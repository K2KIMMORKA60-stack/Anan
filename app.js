/* Application ANAN : logique principale.
   Données et comptes : Supabase (voir supabase/schema.sql pour les règles de sécurité). */
(function () {
'use strict';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fd = d => new Date(d).toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'});
const fds = d => new Date(d).toLocaleDateString('fr-FR');
const SYM = {FCFA:'FCFA', EUR:'€', USD:'$'};
const fm = (n, d) => (Number(n) || 0).toLocaleString('fr-FR') + ' ' + (SYM[d] || d || 'FCFA');
function toast(t){ const e = $('#toast'); e.textContent = t; e.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => e.hidden = true, 3000); }
const safeUrl = u => /^https:\/\//i.test(u || '') ? u : '';

const OPS = [['Orange Money','#FF7900','OM'],['Airtel Money','#E40000','AM'],['Moov Money','#0066B3','MV'],['MTN MoMo','#E8B400','MT'],['Wave','#1DC4FF','WV']];
const COINS = [['Bitcoin (BTC)','#F7931A','₿'],['USDT (Tether)','#26A17B','₮'],['Ethereum (ETH)','#627EEA','Ξ']];
const ICO_MOYEN = {mobile:'📱', carte:'💳', paypal:'🅿️', wallet:'📲', virement:'🏦', crypto:'🪙'};
const PRESETS = {FCFA:[1000,2500,5000,10000,25000], EUR:[5,10,20,50,100], USD:[5,10,20,50,100]};
const STATUT = {en_attente:['En attente','alerte'], confirmee:['Confirmée','ok'], annulee:['Annulée','neutre']};
const ICONS = {
 accueil:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
 annonces:'<path d="M3 10v4h3l6 4V6L6 10zM16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/>',
 contribuer:'<path d="M12 21s-7-4.4-9.3-9A5 5 0 0 1 12 6.5 5 5 0 0 1 21.3 12C19 16.6 12 21 12 21z"/>',
 avis:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 reglement:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
 equipe:'<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>'
};

const S = {
  session: null, profil: null, tab: 'accueil', auth: 'connexion', authMsg: '',
  annonces: [], mesContribs: [], mesAvis: [], moyens: [],
  eq: {contribs: [], avis: [], membres: [], reglages: []},
  sel: {devise: 'FCFA', moyen: null}, pay: null, note: 0, recup: false
};
let sb = null;

/* ---------- démarrage ---------- */
const cfg = window.ANAN_CONFIG || {};
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase) {
  $('#main').innerHTML = `<div class="card"><h2>Application pas encore connectée</h2><p class="small muted">Il manque les réglages Supabase dans le fichier <b>config.js</b>. Voir le guide LISEZ-MOI.</p></div>`;
  return;
}
sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: true}});

const isEquipe = () => S.profil?.role === 'equipe';
async function q(p, msg){ const {data, error} = await p; if (error) { console.warn(error); toast(msg || messageErreur(error)); return null; } return data; }
function messageErreur(e){
  const m = (e && e.message || '').toLowerCase();
  if (m.includes('invalid login')) return 'Adresse e-mail ou mot de passe incorrect.';
  if (m.includes('email not confirmed')) return 'Confirmez d\'abord votre adresse e-mail (lien reçu par e-mail).';
  if (m.includes('already registered')) return 'Un compte existe déjà avec cette adresse. Connectez-vous.';
  if (m.includes('password')) return 'Mot de passe refusé : 8 caractères minimum, avec au moins un chiffre.';
  if (m.includes('rate limit')) return 'Trop d\'essais. Patientez quelques minutes.';
  if (m.includes('row-level security') || m.includes('permission')) return 'Action non autorisée.';
  return 'Une erreur est survenue. Vérifiez votre connexion et réessayez.';
}

sb.auth.onAuthStateChange((ev, session) => {
  if (ev === 'PASSWORD_RECOVERY') S.recup = true;
  S.session = session;
  setTimeout(chargerTout, 0);
});

async function chargerTout(){
  if (!S.session) { S.profil = null; render(); return; }
  const uid = S.session.user.id;
  const [p, ann, mc, ma, mo] = await Promise.all([
    q(sb.from('profiles').select('*').eq('id', uid).maybeSingle()),
    q(sb.from('annonces').select('*').order('cree_le', {ascending: false}).limit(100)),
    q(sb.from('contributions').select('*').eq('user_id', uid).order('cree_le', {ascending: false})),
    q(sb.from('avis').select('*').eq('user_id', uid).order('cree_le', {ascending: false})),
    q(sb.from('moyens_paiement').select('*').order('ordre'))
  ]);
  S.profil = p; S.annonces = ann || []; S.mesContribs = mc || []; S.mesAvis = ma || []; S.moyens = (mo || []).filter(m => m.actif);
  if (!S.sel.moyen || !S.moyens.some(m => m.id === S.sel.moyen)) S.sel.moyen = S.moyens[0]?.id || null;
  if (isEquipe()) await chargerEquipe();
  render();
}
async function chargerEquipe(){
  const [c, a, m, r] = await Promise.all([
    q(sb.from('contributions').select('*').order('cree_le', {ascending: false}).limit(500)),
    q(sb.from('avis').select('*').order('cree_le', {ascending: false}).limit(500)),
    q(sb.from('profiles').select('id,nom,email,role,cree_le').order('cree_le', {ascending: false})),
    q(sb.from('reglages_paiement').select('*'))
  ]);
  S.eq = {contribs: c || [], avis: a || [], membres: m || [], reglages: r || []};
}

/* ---------- affichage ---------- */
function tabs(){ const t = [['accueil','Accueil'],['annonces','Annonces'],['contribuer','Contribuer'],['avis','Avis'],['reglement','Règlement']]; if (isEquipe()) t.push(['equipe','Équipe']); return t; }
function render(){
  const connecte = !!(S.session && S.profil);
  $('#compte').hidden = !connecte; $('#tabs').hidden = !connecte;
  $('#sous').textContent = connecte ? (isEquipe() ? 'Espace équipe' : 'Bonjour ' + S.profil.nom) : 'Communauté 2025 – 2026';
  if (S.recup) { $('#main').innerHTML = vueNouveauMdp(); return; }
  if (!connecte) { $('#main').innerHTML = S.session ? '<div class="empty">Chargement…</div>' : vueAuth(); return; }
  if (S.tab !== 'compte' && !tabs().some(x => x[0] === S.tab)) S.tab = 'accueil';
  $('#tabs').innerHTML = tabs().map(([k, l]) => `<button data-tab="${k}" ${S.tab === k ? 'aria-current="page"' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>${l}</button>`).join('');
  $('#main').innerHTML = (V[S.tab] || V.accueil)();
}

function vueAuth(){
  const m = S.auth;
  const msg = S.authMsg ? `<div class="hint">${S.authMsg}</div>` : '';
  if (m === 'oubli') return `<div class="auth"><div class="logo"><img src="icons/icon-512.png" alt=""><h2>Mot de passe oublié</h2><p class="muted small">Entrez votre adresse e-mail : vous recevrez un lien pour choisir un nouveau mot de passe.</p></div>${msg}
    <form data-f="oubli"><label class="f">Adresse e-mail<input id="au-email" name="email" type="email" required autocomplete="email"></label><span class="err" id="err"></span><button class="btn prim block">Envoyer le lien</button><button type="button" class="btn block" data-mode="connexion">Retour</button></form></div>`;
  const ins = m === 'inscription';
  return `<div class="auth"><div class="logo"><img src="icons/icon-512.png" alt=""><h2>Bienvenue à l'ANAN</h2><p class="muted small">Application gratuite de l'association. Créez votre compte avec votre adresse e-mail pour y accéder.</p></div>
  <div class="seg" role="group" aria-label="Choix"><button data-mode="inscription" aria-pressed="${ins}">Créer un compte</button><button data-mode="connexion" aria-pressed="${!ins}">Se connecter</button></div>
  ${msg}
  <form data-f="${ins ? 'inscription' : 'connexion'}">
   ${ins ? '<label class="f">Nom et prénom<input id="au-nom" name="nom" required minlength="2" maxlength="80" autocomplete="name"></label>' : ''}
   <label class="f">Adresse e-mail<input id="au-email" name="email" type="email" required autocomplete="email"></label>
   <label class="f">Mot de passe<input id="au-pass" name="pass" type="password" required minlength="8" autocomplete="${ins ? 'new-password' : 'current-password'}"></label>
   ${ins ? `<label class="f">Confirmer le mot de passe<input id="au-pass2" name="pass2" type="password" required minlength="8" autocomplete="new-password"></label><p class="small muted">8 caractères minimum, avec au moins un chiffre.</p>
   <label class="small" style="display:flex;gap:8px;align-items:flex-start"><input id="au-ok" type="checkbox" name="ok" required style="width:auto;margin-top:3px"> J'accepte le règlement intérieur et la protection de mes données (art. 11).</label>` : ''}
   <span class="err" id="err"></span>
   <button class="btn prim block">${ins ? 'Créer mon compte' : 'Se connecter'}</button>
   ${ins ? '' : '<button type="button" class="lien" data-mode="oubli" style="align-self:center">Mot de passe oublié ?</button>'}
  </form></div>`;
}
function vueNouveauMdp(){
  return `<div class="auth"><div class="logo"><img src="icons/icon-512.png" alt=""><h2>Nouveau mot de passe</h2></div>
  <form data-f="nouveau-mdp"><label class="f">Nouveau mot de passe<input id="nm-pass" name="pass" type="password" required minlength="8" autocomplete="new-password"></label><label class="f">Confirmer<input id="nm-pass2" name="pass2" type="password" required minlength="8" autocomplete="new-password"></label><span class="err" id="err"></span><button class="btn prim block">Enregistrer</button></form></div>`;
}

const etoiles = n => '★'.repeat(n) + '☆'.repeat(5 - n);
const V = {
accueil(){
  const a = S.annonces[0];
  return `<div class="card" style="flex-direction:row;align-items:center;gap:14px"><img src="icons/icon-192.png" alt="" style="width:64px;height:64px;border-radius:16px;box-shadow:0 0 0 1px var(--ligne)"><div style="min-width:0"><h2>Bonjour ${esc(S.profil.nom)}</h2><p class="small muted">${isEquipe() ? 'Vous êtes connecté à l\'espace équipe.' : 'Merci de faire partie de la communauté ANAN.'}</p></div></div>
  ${a ? `<div class="card"><span class="small muted">Dernière annonce · ${fd(a.cree_le)}</span><h3>${esc(a.titre)}</h3><p class="small" style="white-space:pre-wrap">${esc(a.texte)}</p><button class="btn mini" data-tab="annonces" style="align-self:flex-start">Voir toutes les annonces</button></div>` : '<div class="empty">Pas encore d\'annonce du Bureau.</div>'}
  <div class="card"><h3>Soutenir l'association</h3><p class="small muted">L'application est gratuite. Si vous le souhaitez, vous pouvez contribuer depuis n'importe quel pays.</p><button class="btn orange" data-tab="contribuer">Faire une contribution</button>
  ${S.mesContribs.length ? `<p class="small muted">Vous avez contribué ${S.mesContribs.length} fois. Merci !</p>` : ''}</div>
  <div class="card"><h3>Votre avis compte</h3><p class="small muted">Dites-nous ce que vous pensez de l'application et de l'association.</p><button class="btn" data-tab="avis">Donner mon avis</button></div>
  ${installCard()}`;
},
annonces(){
  return `<h2>Annonces du Bureau</h2>${S.annonces.length ? `<div class="list">${S.annonces.map(a => `<div class="item"><div class="top"><h3>${esc(a.titre)}</h3><span class="pill ${a.importance === 'urgent' ? 'danger' : a.importance === 'important' ? 'alerte' : 'neutre'}">${a.importance === 'urgent' ? 'Urgent' : a.importance === 'important' ? 'Important' : 'Info'}</span></div><span class="small muted">${fd(a.cree_le)}</span><p class="small">${esc(a.texte)}</p></div>`).join('')}</div>` : '<div class="empty">Aucune annonce pour le moment.</div>'}
  ${isEquipe() ? '<p class="small muted">Pour publier une annonce, allez dans l\'onglet Équipe.</p>' : ''}`;
},
contribuer(){
  if (S.pay) {
    const p = S.pay, lien = safeUrl(p.lien);
    return `<h2>Contribuer</h2><div class="card"><div class="ok-big"><div class="rond">✓</div><h3>Contribution enregistrée</h3>
      <p class="small muted">${fm(p.montant, p.devise)} par ${esc(p.nomMoyen)}${p.detail ? ' (' + esc(p.detail) + ')' : ''}. Elle apparaît « en attente » jusqu'à ce que l'équipe confirme la réception.</p></div>
      ${p.instructions || lien ? `<h3>Comment payer</h3>${p.instructions ? `<p class="small" style="white-space:pre-wrap">${esc(p.instructions)}</p>` : ''}${lien ? `<a class="btn orange block" href="${esc(lien)}" target="_blank" rel="noopener noreferrer">Ouvrir la page de paiement sécurisée</a>` : ''}` : '<div class="hint">Ce moyen de paiement n\'est pas encore configuré par l\'équipe. Vous serez contacté par e-mail.</div>'}
      <button class="btn block" data-act="payer-retour">Retour</button></div>`;
  }
  if (!S.moyens.length) return `<h2>Contribuer</h2><div class="empty">Les contributions ne sont pas encore ouvertes.</div>`;
  const pr = PRESETS[S.sel.devise];
  const m = S.sel.moyen;
  return `<h2>Contribuer</h2>
  <p class="small muted">L'application est et restera gratuite. Chaque contribution est volontaire et sert uniquement aux actions de l'association (règlement, art. 6). Vous pouvez payer depuis n'importe quel pays.</p>
  <form data-f="payer" class="card">
   <label class="f">Devise<select id="pa-devise" name="devise">${[['FCFA','Franc CFA (FCFA)'],['EUR','Euro (€)'],['USD','Dollar ($)']].map(([v, l]) => `<option value="${v}" ${S.sel.devise === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
   <span class="small muted" style="font-weight:600">Montant</span>
   <div class="choix-grid">${pr.map((x, i) => `<label class="choix"><input type="radio" name="montant" value="${x}" ${i === 1 ? 'checked' : ''}>${x.toLocaleString('fr-FR')} ${SYM[S.sel.devise]}</label>`).join('')}<label class="choix"><input type="radio" name="montant" value="autre">Autre</label></div>
   <label class="f">Autre montant<input id="pa-autre" name="autre" type="number" min="1" step="any" inputmode="decimal"></label>
   <span class="small muted" style="font-weight:600">Moyen de paiement</span>
   <div class="list" style="gap:8px">${S.moyens.map(x => `<label class="choix" style="justify-content:flex-start;padding:12px 14px"><input type="radio" name="moyen" value="${esc(x.id)}" ${m === x.id ? 'checked' : ''}><span aria-hidden="true">${ICO_MOYEN[x.id] || '•'}</span>${esc(x.nom)}${x.id === 'carte' ? ' <span class="small muted">Visa, Mastercard</span>' : ''}</label>`).join('')}</div>
   ${m === 'mobile' ? `<span class="small muted" style="font-weight:600">Opérateur</span><div class="choix-grid">${OPS.map(([n, c, s], i) => `<label class="choix op"><input type="radio" name="detail" value="${n}" ${i === 0 ? 'checked' : ''}><i style="background:${c}">${s}</i><span class="small">${n}</span></label>`).join('')}</div>`
     : m === 'crypto' ? `<span class="small muted" style="font-weight:600">Crypto-monnaie</span><div class="choix-grid">${COINS.map(([n, c, s], i) => `<label class="choix op"><input type="radio" name="detail" value="${n}" ${i === 0 ? 'checked' : ''}><i style="background:${c};font-size:15px">${s}</i><span class="small">${n}</span></label>`).join('')}</div>` : ''}
   <span class="err" id="err"></span>
   <button class="btn orange block">Contribuer</button>
   <p class="small muted">🔒 L'ANAN ne vous demande jamais votre code secret ni votre numéro de carte dans l'application.</p>
  </form>
  <h3>Mes contributions</h3>${S.mesContribs.length ? `<div class="list">${S.mesContribs.map(c => `<div class="item"><div class="top"><h3>${fm(c.montant, c.devise)}</h3><span class="pill ${STATUT[c.statut][1]}">${STATUT[c.statut][0]}</span></div><span class="small muted">${fd(c.cree_le)} · ${esc(nomMoyen(c.moyen))}${c.detail ? ' · ' + esc(c.detail) : ''}</span></div>`).join('')}</div>` : '<div class="empty">Vous n\'avez pas encore contribué.</div>'}`;
},
avis(){
  const n = S.note;
  return `<h2>Votre avis</h2><form data-f="avis" class="card"><span class="small muted" style="font-weight:600">Votre satisfaction</span>
   <div class="stars" role="radiogroup" aria-label="Note de 1 à 5">${[1,2,3,4,5].map(i => `<button type="button" role="radio" aria-checked="${n === i}" aria-label="${i} sur 5" data-note="${i}" class="${i <= n ? 'on' : ''}">★</button>`).join('')}</div>
   <span class="small muted">${['Touchez une étoile','Pas satisfait','Peu satisfait','Moyennement satisfait','Satisfait','Très satisfait'][n]}</span>
   <label class="f">Votre commentaire<textarea id="av-texte" name="texte" maxlength="1000" placeholder="Ce qui vous plaît, ce qu'on peut améliorer…"></textarea></label>
   <span class="err" id="err"></span><button class="btn prim block">Envoyer mon avis</button>
   <p class="small muted">Votre avis est lu uniquement par l'équipe de l'ANAN.</p></form>
  <h3>Mes avis envoyés</h3>${S.mesAvis.length ? `<div class="list">${S.mesAvis.map(a => `<div class="item"><div class="top"><span class="st">${etoiles(a.note)}</span><span class="small muted">${fd(a.cree_le)}</span></div>${a.texte ? `<p class="small">${esc(a.texte)}</p>` : ''}</div>`).join('')}</div>` : '<div class="empty">Vous n\'avez pas encore donné d\'avis.</div>'}`;
},
reglement(){ return window.ANAN_REGLEMENT || ''; },
equipe(){
  if (!isEquipe()) return '';
  const E = S.eq;
  const conf = E.contribs.filter(c => c.statut === 'confirmee');
  const parDev = {}; conf.forEach(c => parDev[c.devise] = (parDev[c.devise] || 0) + Number(c.montant));
  const tot = Object.entries(parDev).map(([d, n]) => fm(n, d)).join('<br>') || fm(0, 'FCFA');
  const moy = E.avis.length ? E.avis.reduce((s, a) => s + a.note, 0) / E.avis.length : 0;
  const nom = id => esc(E.membres.find(u => u.id === id)?.nom || 'Compte supprimé');
  const attente = E.contribs.filter(c => c.statut === 'en_attente').length;
  const reg = id => E.reglages.find(r => r.moyen === id) || {instructions: '', lien: ''};
  return `<h2>Espace équipe</h2><p class="small muted">Visible uniquement par l'équipe (3 personnes au plus).</p>
  <div class="grid2"><div class="card stat"><span class="small muted">Contributions confirmées</span><b>${tot}</b><span class="small muted">${conf.length} paiements · ${attente} en attente</span></div>
  <div class="card stat"><span class="small muted">Satisfaction</span><b>${moy ? moy.toFixed(1).replace('.', ',') : '—'} / 5</b><span class="small muted">${E.avis.length} avis</span></div>
  <div class="card stat"><span class="small muted">Comptes inscrits</span><b>${E.membres.length}</b></div>
  <div class="card stat"><span class="small muted">Annonces</span><b>${S.annonces.length}</b></div></div>
  <div class="card equipe"><h3>Publier une annonce</h3><form data-f="annonce"><label class="f">Titre<input id="eq-titre" name="titre" required maxlength="120"></label><label class="f">Message<textarea id="eq-texte" name="texte" required maxlength="3000"></textarea></label>
   <label class="f">Importance<select id="eq-imp" name="importance"><option value="info">Information</option><option value="important">Important</option><option value="urgent">Urgent</option></select></label><button class="btn prim">Publier</button></form>
   ${S.annonces.length ? `<div class="list">${S.annonces.map(a => `<div class="item"><div class="top"><h3>${esc(a.titre)}</h3><button class="btn mini" data-del-annonce="${a.id}">Supprimer</button></div><span class="small muted">${fd(a.cree_le)}</span></div>`).join('')}</div>` : ''}</div>
  <div class="card equipe"><h3>Contributions</h3>${E.contribs.length ? `<div class="tablewrap"><table><thead><tr><th>Date</th><th>Membre</th><th>Montant</th><th>Moyen</th><th>Statut</th><th></th></tr></thead><tbody>${E.contribs.map(c => `<tr><td>${fds(c.cree_le)}</td><td>${nom(c.user_id)}</td><td>${fm(c.montant, c.devise)}</td><td>${esc(nomMoyen(c.moyen))}${c.detail ? ' · ' + esc(c.detail) : ''}</td><td><span class="pill ${STATUT[c.statut][1]}">${STATUT[c.statut][0]}</span></td><td>${c.statut === 'en_attente' ? `<button class="btn mini prim" data-statut="${c.id}" data-v="confirmee">Reçu</button> <button class="btn mini" data-statut="${c.id}" data-v="annulee">Annuler</button>` : ''}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty">Aucune contribution.</div>'}</div>
  <div class="card equipe"><h3>Avis des membres</h3>${E.avis.length ? `<div class="list">${E.avis.map(a => `<div class="item"><div class="top"><h3>${nom(a.user_id)}</h3><span class="st">${etoiles(a.note)}</span></div><span class="small muted">${fd(a.cree_le)}</span>${a.texte ? `<p class="small">${esc(a.texte)}</p>` : ''}</div>`).join('')}</div>` : '<div class="empty">Aucun avis.</div>'}</div>
  <div class="card equipe"><h3>Membres inscrits</h3><div class="tablewrap"><table><thead><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>Inscrit le</th></tr></thead><tbody>${E.membres.map(u => `<tr><td>${esc(u.nom)}</td><td>${esc(u.email)}</td><td>${u.role === 'equipe' ? 'Équipe' : 'Membre'}</td><td>${fds(u.cree_le)}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="card equipe"><h3>Réglages de paiement 🔒</h3><p class="small muted">Réservé à l'équipe. Un membre ne voit que les instructions du moyen qu'il choisit, au moment de payer. Les clés secrètes d'un prestataire ne se mettent jamais ici.</p>
   ${S.moyensTous().map(x => { const r = reg(x.id); return `<form data-f="reglage" data-moyen="${esc(x.id)}" class="item"><div class="top"><h3>${ICO_MOYEN[x.id] || ''} ${esc(x.nom)}</h3><label class="small" style="display:flex;gap:6px;align-items:center"><input type="checkbox" name="actif" ${x.actif ? 'checked' : ''} style="width:auto"> Actif</label></div>
     <label class="f">Instructions pour le membre<textarea id="rg-i-${esc(x.id)}" name="instructions" maxlength="2000" placeholder="${x.id === 'mobile' ? 'Ex. : Orange Money au +227 …, nom du titulaire, référence à indiquer' : x.id === 'virement' ? 'Ex. : IBAN, nom du compte, référence' : x.id === 'crypto' ? 'Ex. : adresse BTC / USDT (réseau à préciser)' : 'Ex. : instructions de paiement'}">${esc(r.instructions)}</textarea></label>
     <label class="f">Lien de paiement sécurisé (https)<input id="rg-l-${esc(x.id)}" name="lien" type="url" value="${esc(r.lien)}" placeholder="https://…"></label>
     <button class="btn mini prim" style="align-self:flex-start">Enregistrer</button></form>`; }).join('')}</div>`;
},
compte(){
  return `<h2>Mon compte</h2><form data-f="nom" class="card"><label class="f">Nom et prénom<input id="cp-nom" name="nom" required minlength="2" maxlength="80" value="${esc(S.profil.nom)}"></label><button class="btn mini" style="align-self:flex-start">Enregistrer</button></form>
  <div class="card"><span class="small muted">Adresse e-mail</span><b style="overflow-wrap:anywhere">${esc(S.session.user.email)} <span class="pill ok">Vérifiée</span></b><span class="small muted">Type de compte</span><b>${isEquipe() ? 'Équipe' : 'Membre'}</b></div>
  <form data-f="changer-mdp" class="card"><h3>Changer de mot de passe</h3><label class="f">Nouveau mot de passe<input id="cp-pass" name="pass" type="password" required minlength="8" autocomplete="new-password"></label><label class="f">Confirmer<input id="cp-pass2" name="pass2" type="password" required minlength="8" autocomplete="new-password"></label><span class="err" id="err"></span><button class="btn mini" style="align-self:flex-start">Changer</button></form>
  <button class="btn block" data-act="deconnexion">Se déconnecter</button>
  <p class="small muted">Pour supprimer votre compte et vos données, écrivez à l'équipe de l'ANAN (règlement, art. 11).</p>`;
}
};
S.moyensTous = () => S._tous || S.moyens;
const nomMoyen = id => (S._tous || S.moyens).find(m => m.id === id)?.nom || id;

let promptInstall = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); promptInstall = e; if (S.tab === 'accueil') render(); });
function installCard(){
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) return '';
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  return `<div class="card"><h3>Installer l'application</h3>${promptInstall ? `<p class="small muted">Ajoutez ANAN à votre écran pour l'ouvrir comme une application.</p><button class="btn prim" data-act="installer">Installer ANAN</button>`
   : ios ? '<p class="small muted">Sur iPhone : dans Safari, touchez <b>Partager</b> puis <b>Sur l\'écran d\'accueil</b>.</p>'
   : '<p class="small muted">Sur ordinateur (Chrome ou Edge) : cliquez sur l\'icône d\'installation à droite de la barre d\'adresse. Sur Android : menu ⋮ puis <b>Installer l\'application</b>.</p>'}</div>`;
}

/* ---------- actions ---------- */
function err(t){ const e = $('#err'); if (e) e.textContent = t; }
const okMdp = p => p.length >= 8 && /\d/.test(p);
let occupe = false;
document.addEventListener('submit', async e => {
  const f = e.target.closest('form[data-f]'); if (!f) return; e.preventDefault();
  if (occupe) return; occupe = true;
  const btn = f.querySelector('button:not([type=button])'); if (btn) btn.disabled = true;
  try { await soumettre(f, Object.fromEntries(new FormData(f))); } finally { occupe = false; if (btn && btn.isConnected) btn.disabled = false; }
});
async function soumettre(f, v){
  const k = f.dataset.f;
  if (k === 'inscription') {
    if (v.pass !== v.pass2) return err('Les deux mots de passe ne sont pas identiques.');
    if (!okMdp(v.pass)) return err('8 caractères minimum, avec au moins un chiffre.');
    const {error} = await sb.auth.signUp({email: v.email.trim(), password: v.pass, options: {data: {nom: v.nom.trim()}, emailRedirectTo: location.origin + location.pathname}});
    if (error) return err(messageErreur(error));
    S.auth = 'connexion'; S.authMsg = `Un e-mail de confirmation a été envoyé à <b>${esc(v.email.trim())}</b>. Ouvrez le lien qu'il contient, puis connectez-vous.`; render(); return;
  }
  if (k === 'connexion') {
    const {error} = await sb.auth.signInWithPassword({email: v.email.trim(), password: v.pass});
    if (error) return err(messageErreur(error));
    S.authMsg = ''; S.tab = 'accueil'; return;
  }
  if (k === 'oubli') {
    const {error} = await sb.auth.resetPasswordForEmail(v.email.trim(), {redirectTo: location.origin + location.pathname});
    if (error) return err(messageErreur(error));
    S.auth = 'connexion'; S.authMsg = 'Si un compte existe avec cette adresse, un lien vient d\'être envoyé.'; render(); return;
  }
  if (k === 'nouveau-mdp' || k === 'changer-mdp') {
    if (v.pass !== v.pass2) return err('Les deux mots de passe ne sont pas identiques.');
    if (!okMdp(v.pass)) return err('8 caractères minimum, avec au moins un chiffre.');
    const {error} = await sb.auth.updateUser({password: v.pass});
    if (error) return err(messageErreur(error));
    S.recup = false; toast('Mot de passe changé'); render(); return;
  }
  if (k === 'nom') {
    if (await q(sb.from('profiles').update({nom: v.nom.trim()}).eq('id', S.profil.id).select())) { S.profil.nom = v.nom.trim(); toast('Nom enregistré'); render(); }
    return;
  }
  if (k === 'payer') {
    const montant = v.montant === 'autre' ? Number(v.autre) : Number(v.montant);
    const min = v.devise === 'FCFA' ? 100 : 1;
    if (!montant || montant < min) return err('Indiquez un montant d\'au moins ' + fm(min, v.devise) + '.');
    const row = {montant, devise: v.devise, moyen: v.moyen, detail: (v.detail || '').slice(0, 60)};
    const ins = await q(sb.from('contributions').insert(row).select().single());
    if (!ins) return;
    const instr = await q(sb.rpc('instructions_paiement', {p_moyen: v.moyen}));
    S.mesContribs.unshift(ins);
    S.pay = {...row, nomMoyen: nomMoyen(v.moyen), instructions: instr?.[0]?.instructions || '', lien: instr?.[0]?.lien || ''};
    render(); window.scrollTo(0, 0); return;
  }
  if (k === 'avis') {
    if (!S.note) return err('Choisissez une note de 1 à 5 étoiles.');
    const ins = await q(sb.from('avis').insert({note: S.note, texte: (v.texte || '').trim()}).select().single());
    if (!ins) return;
    S.mesAvis.unshift(ins); S.note = 0; toast('Merci pour votre avis !'); if (isEquipe()) await chargerEquipe(); render(); return;
  }
  if (k === 'annonce' && isEquipe()) {
    const ins = await q(sb.from('annonces').insert({titre: v.titre.trim(), texte: v.texte.trim(), importance: v.importance}).select().single());
    if (ins) { S.annonces.unshift(ins); toast('Annonce publiée'); render(); }
    return;
  }
  if (k === 'reglage' && isEquipe()) {
    const id = f.dataset.moyen, lien = (v.lien || '').trim();
    if (lien && !safeUrl(lien)) return toast('Le lien doit commencer par https://');
    const a = await q(sb.from('reglages_paiement').upsert({moyen: id, instructions: (v.instructions || '').trim(), lien, modifie_le: new Date().toISOString()}).select());
    const b = await q(sb.from('moyens_paiement').update({actif: !!v.actif}).eq('id', id).select());
    if (a && b) { toast('Réglage enregistré'); await chargerMoyensTous(); await chargerEquipe(); render(); }
  }
}
async function chargerMoyensTous(){ const t = await q(sb.from('moyens_paiement').select('*').order('ordre')); if (t) { S._tous = t; S.moyens = t.filter(m => m.actif); } }

document.addEventListener('change', e => {
  if (e.target.id === 'pa-devise') { S.sel.devise = e.target.value; render(); }
  else if (e.target.name === 'moyen' && e.target.closest('form[data-f=payer]')) { S.sel.moyen = e.target.value; render(); }
});
document.addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.id === 'compte') { S.tab = 'compte'; render(); return; }
  if (b.dataset.tab) { S.tab = b.dataset.tab; S.pay = null; if (S.tab === 'equipe') { await chargerMoyensTous(); await chargerEquipe(); } render(); window.scrollTo(0, 0); return; }
  if (b.dataset.mode) { S.auth = b.dataset.mode; S.authMsg = ''; render(); return; }
  if (b.dataset.note) { const t = $('#av-texte')?.value || ''; S.note = Number(b.dataset.note); render(); const a = $('#av-texte'); if (a) a.value = t; return; }
  if (b.dataset.statut && isEquipe()) { if (await q(sb.from('contributions').update({statut: b.dataset.v}).eq('id', b.dataset.statut).select())) { await chargerEquipe(); render(); toast('Statut mis à jour'); } return; }
  if (b.dataset.delAnnonce && isEquipe()) {
    if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmer ?'; return; }
    if (await q(sb.from('annonces').delete().eq('id', b.dataset.delAnnonce).select())) { S.annonces = S.annonces.filter(a => String(a.id) !== b.dataset.delAnnonce); render(); toast('Annonce supprimée'); }
    return;
  }
  const a = b.dataset.act;
  if (a === 'payer-retour') { S.pay = null; render(); }
  if (a === 'deconnexion') { await sb.auth.signOut(); S.tab = 'accueil'; S.auth = 'connexion'; render(); }
  if (a === 'installer' && promptInstall) { promptInstall.prompt(); promptInstall = null; render(); }
});

render();
})();
