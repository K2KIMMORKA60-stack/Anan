-- =====================================================================
-- Application ANAN : base de données sécurisée (Supabase / PostgreSQL)
-- À coller une seule fois dans Supabase > SQL Editor > New query > Run.
-- Chaque table est protégée par des règles (Row Level Security) :
-- un membre ne voit que ses propres données, l'équipe voit tout.
-- =====================================================================

-- ---------- Profils (un par compte) ----------
create table if not exists public.profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  nom       text not null check (char_length(nom) between 2 and 80),
  email     text not null,
  role      text not null default 'membre' check (role in ('membre','equipe')),
  cree_le   timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Vrai si la personne connectée fait partie de l'équipe
create or replace function public.est_equipe()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'equipe');
$$;

-- Création automatique du profil à l'inscription
create or replace function public.nouveau_profil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nom, email)
  values (new.id,
          coalesce(nullif(trim(new.raw_user_meta_data->>'nom'), ''), 'Membre'),
          new.email);
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.nouveau_profil();

-- Personne ne peut changer son rôle ou son e-mail depuis l'application.
-- Les rôles se changent uniquement ici, dans le SQL Editor (voir LISEZ-MOI).
-- L'équipe est limitée à 3 personnes.
create or replace function public.proteger_profil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and (new.role is distinct from old.role or new.email is distinct from old.email or new.id is distinct from old.id) then
    raise exception 'Modification interdite';
  end if;
  if new.role = 'equipe' and old.role <> 'equipe'
     and (select count(*) from public.profiles where role = 'equipe') >= 3 then
    raise exception 'L''équipe est limitée à 3 personnes';
  end if;
  return new;
end $$;
drop trigger if exists proteger_profil on public.profiles;
create trigger proteger_profil before update on public.profiles
  for each row execute function public.proteger_profil();

drop policy if exists "profil lire" on public.profiles;
create policy "profil lire" on public.profiles for select to authenticated
  using (id = auth.uid() or public.est_equipe());
drop policy if exists "profil modifier son nom" on public.profiles;
create policy "profil modifier son nom" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ---------- Annonces du Bureau ----------
create table if not exists public.annonces (
  id          bigint generated always as identity primary key,
  titre       text not null check (char_length(titre) between 1 and 120),
  texte       text not null check (char_length(texte) between 1 and 3000),
  importance  text not null default 'info' check (importance in ('info','important','urgent')),
  auteur      uuid default auth.uid() references public.profiles(id) on delete set null,
  cree_le     timestamptz not null default now()
);
alter table public.annonces enable row level security;
drop policy if exists "annonces lire" on public.annonces;
create policy "annonces lire" on public.annonces for select to authenticated using (true);
drop policy if exists "annonces equipe" on public.annonces;
create policy "annonces equipe" on public.annonces for all to authenticated
  using (public.est_equipe()) with check (public.est_equipe());

-- ---------- Avis et satisfaction ----------
create table if not exists public.avis (
  id        bigint generated always as identity primary key,
  user_id   uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  note      int not null check (note between 1 and 5),
  texte     text not null default '' check (char_length(texte) <= 1000),
  cree_le   timestamptz not null default now()
);
alter table public.avis enable row level security;
drop policy if exists "avis envoyer" on public.avis;
create policy "avis envoyer" on public.avis for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "avis lire" on public.avis;
create policy "avis lire" on public.avis for select to authenticated using (user_id = auth.uid() or public.est_equipe());
drop policy if exists "avis supprimer equipe" on public.avis;
create policy "avis supprimer equipe" on public.avis for delete to authenticated using (public.est_equipe());

-- ---------- Moyens de paiement (liste visible par les membres) ----------
create table if not exists public.moyens_paiement (
  id      text primary key,
  nom     text not null,
  actif   boolean not null default true,
  ordre   int not null default 0
);
alter table public.moyens_paiement enable row level security;
drop policy if exists "moyens lire" on public.moyens_paiement;
create policy "moyens lire" on public.moyens_paiement for select to authenticated using (true);
drop policy if exists "moyens equipe" on public.moyens_paiement;
create policy "moyens equipe" on public.moyens_paiement for all to authenticated
  using (public.est_equipe()) with check (public.est_equipe());

insert into public.moyens_paiement (id, nom, ordre) values
  ('mobile','Mobile money',1),('carte','Carte bancaire',2),('paypal','PayPal',3),
  ('wallet','Apple Pay / Google Pay',4),('virement','Virement bancaire',5),('crypto','Crypto-monnaie',6)
on conflict (id) do nothing;

-- ---------- Réglages de paiement : RÉSERVÉS À L'ÉQUIPE ----------
-- Instructions (numéro du trésorier, lien PayPal, IBAN, adresse crypto…).
-- Aucun membre ne peut lire cette table. Les clés secrètes d'un prestataire
-- ne vont JAMAIS ici : elles iront dans les « secrets » Supabase côté serveur.
create table if not exists public.reglages_paiement (
  moyen         text primary key references public.moyens_paiement(id) on delete cascade,
  instructions  text not null default '' check (char_length(instructions) <= 2000),
  lien          text not null default '' check (lien = '' or lien ~ '^https://'),
  modifie_le    timestamptz not null default now()
);
alter table public.reglages_paiement enable row level security;
drop policy if exists "reglages equipe" on public.reglages_paiement;
create policy "reglages equipe" on public.reglages_paiement for all to authenticated
  using (public.est_equipe()) with check (public.est_equipe());

-- Un membre obtient UNIQUEMENT les instructions du moyen qu'il a choisi,
-- au moment où il fait une contribution.
create or replace function public.instructions_paiement(p_moyen text)
returns table (instructions text, lien text)
language sql stable security definer set search_path = public as $$
  select r.instructions, r.lien
  from public.reglages_paiement r join public.moyens_paiement m on m.id = r.moyen
  where r.moyen = p_moyen and m.actif and auth.uid() is not null;
$$;
revoke all on function public.instructions_paiement(text) from public, anon;
grant execute on function public.instructions_paiement(text) to authenticated;

-- ---------- Contributions ----------
create table if not exists public.contributions (
  id        bigint generated always as identity primary key,
  user_id   uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  montant   numeric(14,2) not null check (montant > 0 and montant < 100000000),
  devise    text not null check (devise in ('FCFA','EUR','USD')),
  moyen     text not null references public.moyens_paiement(id),
  detail    text not null default '' check (char_length(detail) <= 60),
  statut    text not null default 'en_attente' check (statut in ('en_attente','confirmee','annulee')),
  cree_le   timestamptz not null default now()
);
alter table public.contributions enable row level security;
drop policy if exists "contrib creer" on public.contributions;
create policy "contrib creer" on public.contributions for insert to authenticated
  with check (user_id = auth.uid() and statut = 'en_attente');
drop policy if exists "contrib lire" on public.contributions;
create policy "contrib lire" on public.contributions for select to authenticated
  using (user_id = auth.uid() or public.est_equipe());
drop policy if exists "contrib valider equipe" on public.contributions;
create policy "contrib valider equipe" on public.contributions for update to authenticated
  using (public.est_equipe()) with check (public.est_equipe());

-- Les visiteurs non connectés n'ont accès à rien.
revoke all on all tables in schema public from anon;
