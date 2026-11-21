# Application ANAN

Application officielle de l'association ANAN : installable sur ordinateur et téléphone (sans passer par les stores), gratuite, avec comptes par e-mail.

## Ce qu'elle contient
- Création de compte avec adresse e-mail vérifiée, connexion, mot de passe oublié
- Accueil, annonces du Bureau, règlement intérieur (fichier `reglement.js`)
- Contribuer : FCFA, euro ou dollar ; mobile money (Orange, Airtel, Moov, MTN, Wave), carte bancaire, PayPal, Apple Pay / Google Pay, virement, crypto
- Avis et satisfaction (note de 1 à 5 et commentaire)
- Espace équipe (3 personnes au plus) : contributions à confirmer, avis, membres, annonces, réglages de paiement

## Sécurité
- Comptes et données gérés par Supabase, avec des règles par ligne (fichier `supabase/schema.sql`) :
  un membre ne voit que ses propres contributions et avis ; seule l'équipe voit tout.
- Les réglages de paiement (numéros, IBAN, adresses crypto, liens) sont lisibles uniquement par l'équipe.
  Un membre reçoit seulement les instructions du moyen qu'il choisit, au moment de payer.
- Personne ne peut se donner le rôle « équipe » depuis l'application. L'équipe est limitée à 3 personnes.
- Mots de passe chiffrés par Supabase, jamais visibles. Connexion HTTPS obligatoire.
- La clé `anon public` dans `config.js` peut être publique. La clé `service_role` ne doit JAMAIS être mise dans l'application ni envoyée à quelqu'un.

## Mise en route (une seule fois)
1. **Supabase** : créer un projet, puis SQL Editor › New query › coller `supabase/schema.sql` › Run.
2. **Authentication › Providers › Email** : laisser « Confirm email » activé. Mettre la longueur minimale du mot de passe à 8.
3. **Authentication › URL Configuration** : Site URL = l'adresse de l'application (ex. `https://<compte>.github.io/anan-app/`), et l'ajouter aussi dans « Redirect URLs ».
4. Copier la Project URL et la clé anon public dans `config.js`.
5. **GitHub** : mettre les fichiers dans le dépôt `anan-app`, puis Settings › Pages › Deploy from a branch › `main` / root.
6. Créer votre compte dans l'application, puis vous donner le rôle équipe dans Supabase (SQL Editor) :
   ```sql
   update public.profiles set role = 'equipe' where email = 'votre-adresse@exemple.com';
   ```
   Faire de même pour les 2 autres personnes de l'équipe (3 au maximum).

## Installer l'application
- **iPhone** : ouvrir l'adresse dans Safari › Partager › Sur l'écran d'accueil.
- **Android** : Chrome › menu ⋮ › Installer l'application.
- **Ordinateur** : Chrome ou Edge › icône d'installation à droite de la barre d'adresse.

## Mises à jour à plusieurs
- Sur GitHub : Settings › Collaborators › Add people, pour donner l'accès aux 2 ou 3 personnes qui font les mises à jour.
- Sur Supabase : Organization › Team › Invite, pour les mêmes personnes.
- Chaque changement poussé sur `main` est en ligne en quelques minutes. Pour forcer la mise à jour chez les membres, changer `VERSION` dans `sw.js`.

## Paiements réels
Aujourd'hui, une contribution est enregistrée « en attente » et le membre voit les instructions saisies par l'équipe (numéro mobile money, lien PayPal, IBAN, adresse crypto). L'équipe la confirme à réception.
Pour des paiements automatiques, il faudra un compte marchand chez un prestataire (au nom de l'association déclarée). Ses clés secrètes iront dans les secrets Supabase (Edge Functions), jamais dans l'application.
