/* Application ANAN : langues.
   Ordre voulu par l'association : langues du Niger, puis français, puis anglais.
   Pour ajouter ou corriger une traduction : ajoutez la phrase française (à gauche)
   et sa traduction (à droite) dans la langue voulue, plus bas dans ce fichier.
   Une phrase sans traduction s'affiche en français. */
(function () {
'use strict';

const LANGS = [
  {code: 'ha',  nom: 'Hausa',      fr: 'Haoussa'},
  {code: 'dje', nom: 'Zarma',      fr: 'Zarma-Songhaï'},
  {code: 'ff',  nom: 'Fulfulde',   fr: 'Peul'},
  {code: 'tmh', nom: 'Tamajaq',    fr: 'Touareg'},
  {code: 'kr',  nom: 'Kanuri',     fr: 'Kanouri'},
  {code: 'ar',  nom: 'العربية',     fr: 'Arabe', rtl: true},
  {code: 'tuq', nom: 'Tedaga',     fr: 'Toubou'},
  {code: 'gux', nom: 'Gulmancema', fr: 'Gourmantché'},
  {code: 'bdm', nom: 'Yedina',     fr: 'Boudouma'},
  {code: 'twq', nom: 'Tasawaq',    fr: 'Tasawaq'},
  {code: 'fr',  nom: 'Français',   fr: 'Français'},
  {code: 'en',  nom: 'English',    fr: 'Anglais'}
];
const LOCALE = {fr: 'fr-FR', en: 'en-GB', ar: 'ar-u-nu-latn', ha: 'ha-NE'};

/* ---------- Traductions ---------- */
const D = {};

D.en = {
'Langue':'Language',
'Accueil':'Home','Annonces':'News','Contribuer':'Contribute','Avis':'Feedback','Règlement':'Rules','Équipe':'Team',
'Mon compte':'My account','Communauté 2025 – 2026':'Community 2025 – 2026','Espace équipe':'Team area','Chargement…':'Loading…',
'Mot de passe oublié':'Forgotten password','Entrez votre adresse e-mail : vous recevrez un lien pour choisir un nouveau mot de passe.':'Enter your email address: you will receive a link to choose a new password.',
'Adresse e-mail':'Email address','Envoyer le lien':'Send the link','Retour':'Back',
"Bienvenue à l'ANAN":'Welcome to ANAN',"Application gratuite de l'association. Créez votre compte avec votre adresse e-mail pour y accéder.":"The association's free app. Create your account with your email address to access it.",
'Créer un compte':'Create an account','Se connecter':'Sign in','Nom et prénom':'Full name','Mot de passe':'Password','Confirmer le mot de passe':'Confirm password',
'8 caractères minimum, avec au moins un chiffre.':'At least 8 characters, including at least one number.',
"J'accepte le règlement intérieur et la protection de mes données (art. 11).":'I accept the internal rules and the protection of my data (art. 11).',
'Créer mon compte':'Create my account','Mot de passe oublié ?':'Forgotten password?','Nouveau mot de passe':'New password','Confirmer':'Confirm','Enregistrer':'Save',
'Un e-mail de confirmation a été envoyé à':'A confirmation email has been sent to',". Ouvrez le lien qu'il contient, puis connectez-vous.":'. Open the link it contains, then sign in.',
"Si un compte existe avec cette adresse, un lien vient d'être envoyé.":'If an account exists with this address, a link has just been sent.',
'Adresse e-mail ou mot de passe incorrect.':'Incorrect email address or password.',"Confirmez d'abord votre adresse e-mail (lien reçu par e-mail).":'Please confirm your email address first (link received by email).',
'Un compte existe déjà avec cette adresse. Connectez-vous.':'An account already exists with this address. Please sign in.','Mot de passe refusé : 8 caractères minimum, avec au moins un chiffre.':'Password refused: at least 8 characters, including one number.',
"Trop d'essais. Patientez quelques minutes.":'Too many attempts. Please wait a few minutes.','Action non autorisée.':'Action not allowed.',
'Une erreur est survenue. Vérifiez votre connexion et réessayez.':'An error occurred. Check your connection and try again.',
'Les deux mots de passe ne sont pas identiques.':'The two passwords do not match.','Choisissez une note de 1 à 5 étoiles.':'Choose a rating from 1 to 5 stars.',
'Mot de passe changé':'Password changed','Nom enregistré':'Name saved','Merci pour votre avis !':'Thank you for your feedback!','Annonce publiée':'Announcement published',
'Le lien doit commencer par https://':'The link must start with https://','Réglage enregistré':'Setting saved','Statut mis à jour':'Status updated','Annonce supprimée':'Announcement deleted',
"Vous êtes connecté à l'espace équipe.":'You are signed in to the team area.','Merci de faire partie de la communauté ANAN.':'Thank you for being part of the ANAN community.',
'Voir toutes les annonces':'See all announcements',"Pas encore d'annonce du Bureau.":'No announcement from the Board yet.',
"Soutenir l'association":'Support the association',"L'application est gratuite. Si vous le souhaitez, vous pouvez contribuer depuis n'importe quel pays.":'The app is free. If you wish, you can contribute from any country.',
'Faire une contribution':'Make a contribution','Votre avis compte':'Your opinion matters',"Dites-nous ce que vous pensez de l'application et de l'association.":'Tell us what you think of the app and the association.','Donner mon avis':'Give my feedback',
"Installer l'application":'Install the app',"Ajoutez ANAN à votre écran pour l'ouvrir comme une application.":'Add ANAN to your screen to open it like an app.','Installer ANAN':'Install ANAN',
'Sur iPhone : dans Safari, touchez':'On iPhone: in Safari, tap','Partager':'Share','puis':'then',"Sur l'écran d'accueil":'Add to Home Screen',
"Sur ordinateur (Chrome ou Edge) : cliquez sur l'icône d'installation à droite de la barre d'adresse. Sur Android : menu ⋮ puis":'On a computer (Chrome or Edge): click the install icon on the right of the address bar. On Android: menu ⋮ then',
'Annonces du Bureau':'Board announcements','Urgent':'Urgent','Important':'Important','Info':'Info','Aucune annonce pour le moment.':'No announcements for now.',
"Pour publier une annonce, allez dans l'onglet Équipe.":'To publish an announcement, go to the Team tab.',
'Contribution enregistrée':'Contribution recorded',"Elle apparaît « en attente » jusqu'à ce que l'équipe confirme la réception.":'It shows as “pending” until the team confirms receipt.',
'Comment payer':'How to pay','Ouvrir la page de paiement sécurisée':'Open the secure payment page',"Ce moyen de paiement n'est pas encore configuré par l'équipe. Vous serez contacté par e-mail.":'This payment method is not set up by the team yet. You will be contacted by email.',
'Les contributions ne sont pas encore ouvertes.':'Contributions are not open yet.',
"L'application est et restera gratuite. Chaque contribution est volontaire et sert uniquement aux actions de l'association (règlement, art. 6). Vous pouvez payer depuis n'importe quel pays.":"The app is and will remain free. Every contribution is voluntary and is used only for the association's activities (rules, art. 6). You can pay from any country.",
'Devise':'Currency','Franc CFA (FCFA)':'CFA franc (FCFA)','Euro (€)':'Euro (€)','Dollar ($)':'Dollar ($)','Montant':'Amount','Autre':'Other','Autre montant':'Other amount',
'Moyen de paiement':'Payment method','Opérateur':'Operator','Crypto-monnaie':'Cryptocurrency',
"🔒 L'ANAN ne vous demande jamais votre code secret ni votre numéro de carte dans l'application.":'🔒 ANAN will never ask for your PIN or card number in the app.',
'Mes contributions':'My contributions','En attente':'Pending','Confirmée':'Confirmed','Annulée':'Cancelled',"Vous n'avez pas encore contribué.":'You have not contributed yet.',
'Mobile money':'Mobile money','Carte bancaire':'Bank card','Virement bancaire':'Bank transfer',
'Votre avis':'Your feedback','Votre satisfaction':'Your satisfaction','Touchez une étoile':'Tap a star','Pas satisfait':'Not satisfied','Peu satisfait':'Slightly satisfied',
'Moyennement satisfait':'Fairly satisfied','Satisfait':'Satisfied','Très satisfait':'Very satisfied','Votre commentaire':'Your comment',
"Ce qui vous plaît, ce qu'on peut améliorer…":'What you like, what we can improve…','Envoyer mon avis':'Send my feedback',"Votre avis est lu uniquement par l'équipe de l'ANAN.":'Your feedback is read only by the ANAN team.',
'Mes avis envoyés':'My feedback sent',"Vous n'avez pas encore donné d'avis.":'You have not given feedback yet.',
'Vérifiée':'Verified','Type de compte':'Account type','Membre':'Member','Changer de mot de passe':'Change password','Changer':'Change','Se déconnecter':'Sign out',
"Pour supprimer votre compte et vos données, écrivez à l'équipe de l'ANAN (règlement, art. 11).":'To delete your account and your data, write to the ANAN team (rules, art. 11).',
"Visible uniquement par l'équipe (3 personnes au plus).":'Visible only to the team (3 people maximum).','Contributions confirmées':'Confirmed contributions','Satisfaction':'Satisfaction',
'Comptes inscrits':'Registered accounts','Publier une annonce':'Publish an announcement','Titre':'Title','Message':'Message','Importance':'Importance','Information':'Information','Publier':'Publish',
'Supprimer':'Delete','Confirmer ?':'Confirm?','Contributions':'Contributions','Aucune contribution.':'No contributions.','Date':'Date','Moyen':'Method','Statut':'Status','Reçu':'Received','Annuler':'Cancel',
'Avis des membres':"Members' feedback",'Aucun avis.':'No feedback.','Membres inscrits':'Registered members','Nom':'Name','E-mail':'Email','Rôle':'Role','Inscrit le':'Joined on',
'Réglages de paiement 🔒':'Payment settings 🔒','Actif':'Active','Instructions pour le membre':'Instructions for the member','Lien de paiement sécurisé (https)':'Secure payment link (https)',
"Réservé à l'équipe. Un membre ne voit que les instructions du moyen qu'il choisit, au moment de payer. Les clés secrètes d'un prestataire ne se mettent jamais ici.":"Team only. A member only sees the instructions for the method they choose, when paying. A provider's secret keys never go here.",
'Compte supprimé':'Deleted account'
};

D.ar = {
"Visible uniquement par l'équipe (3 personnes au plus).":'مرئي لفريق العمل فقط (3 أشخاص على الأكثر).','Contributions confirmées':'المساهمات المؤكدة','Satisfaction':'الرضا','Comptes inscrits':'الحسابات المسجلة',
'Publier une annonce':'نشر إعلان','Titre':'العنوان','Message':'الرسالة','Importance':'الأهمية','Information':'معلومة','Publier':'نشر','Supprimer':'حذف','Confirmer ?':'تأكيد؟',
'Contributions':'المساهمات','Aucune contribution.':'لا توجد مساهمات.','Date':'التاريخ','Moyen':'الوسيلة','Statut':'الحالة','Reçu':'مستلم','Annuler':'إلغاء',
'Avis des membres':'آراء الأعضاء','Aucun avis.':'لا توجد آراء.','Membres inscrits':'الأعضاء المسجلون','Nom':'الاسم','E-mail':'البريد الإلكتروني','Rôle':'الدور','Inscrit le':'تاريخ التسجيل',
'Réglages de paiement 🔒':'إعدادات الدفع 🔒','Actif':'مفعّل','Instructions pour le membre':'تعليمات للعضو','Lien de paiement sécurisé (https)':'رابط دفع آمن (https)',
"Réservé à l'équipe. Un membre ne voit que les instructions du moyen qu'il choisit, au moment de payer. Les clés secrètes d'un prestataire ne se mettent jamais ici.":'خاص بفريق العمل. لا يرى العضو إلا تعليمات الوسيلة التي يختارها عند الدفع. لا توضع هنا أبدًا المفاتيح السرية لمزوّد الخدمة.',
'Langue':'اللغة',
'Accueil':'الرئيسية','Annonces':'الإعلانات','Contribuer':'المساهمة','Avis':'الآراء','Règlement':'النظام','Équipe':'الفريق',
'Mon compte':'حسابي','Communauté 2025 – 2026':'المجتمع 2025 – 2026','Espace équipe':'فضاء الفريق','Chargement…':'جارٍ التحميل…',
'Mot de passe oublié':'نسيت كلمة المرور','Entrez votre adresse e-mail : vous recevrez un lien pour choisir un nouveau mot de passe.':'أدخل بريدك الإلكتروني: ستتلقى رابطًا لاختيار كلمة مرور جديدة.',
'Adresse e-mail':'البريد الإلكتروني','Envoyer le lien':'إرسال الرابط','Retour':'رجوع',
"Bienvenue à l'ANAN":'مرحبًا بكم في ANAN',"Application gratuite de l'association. Créez votre compte avec votre adresse e-mail pour y accéder.":'تطبيق مجاني للجمعية. أنشئ حسابك ببريدك الإلكتروني للدخول.',
'Créer un compte':'إنشاء حساب','Se connecter':'تسجيل الدخول','Nom et prénom':'الاسم واللقب','Mot de passe':'كلمة المرور','Confirmer le mot de passe':'تأكيد كلمة المرور',
'8 caractères minimum, avec au moins un chiffre.':'8 أحرف على الأقل، مع رقم واحد على الأقل.',
"J'accepte le règlement intérieur et la protection de mes données (art. 11).":'أوافق على النظام الداخلي وعلى حماية بياناتي (المادة 11).',
'Créer mon compte':'إنشاء حسابي','Mot de passe oublié ?':'نسيت كلمة المرور؟','Nouveau mot de passe':'كلمة مرور جديدة','Confirmer':'تأكيد','Enregistrer':'حفظ',
'Un e-mail de confirmation a été envoyé à':'تم إرسال رسالة تأكيد إلى',". Ouvrez le lien qu'il contient, puis connectez-vous.":'. افتح الرابط الموجود فيها، ثم سجّل الدخول.',
"Si un compte existe avec cette adresse, un lien vient d'être envoyé.":'إذا كان هناك حساب بهذا العنوان، فقد تم إرسال رابط إليه.',
'Adresse e-mail ou mot de passe incorrect.':'البريد الإلكتروني أو كلمة المرور غير صحيحة.',"Confirmez d'abord votre adresse e-mail (lien reçu par e-mail).":'أكّد بريدك الإلكتروني أولًا (الرابط المُرسل إليك).',
'Un compte existe déjà avec cette adresse. Connectez-vous.':'يوجد حساب بهذا العنوان. سجّل الدخول.','Mot de passe refusé : 8 caractères minimum, avec au moins un chiffre.':'كلمة المرور مرفوضة: 8 أحرف على الأقل مع رقم واحد.',
"Trop d'essais. Patientez quelques minutes.":'محاولات كثيرة. انتظر بضع دقائق.','Action non autorisée.':'عملية غير مسموح بها.',
'Une erreur est survenue. Vérifiez votre connexion et réessayez.':'حدث خطأ. تحقق من اتصالك وأعد المحاولة.',
'Les deux mots de passe ne sont pas identiques.':'كلمتا المرور غير متطابقتين.','Choisissez une note de 1 à 5 étoiles.':'اختر تقييمًا من 1 إلى 5 نجوم.',
'Mot de passe changé':'تم تغيير كلمة المرور','Nom enregistré':'تم حفظ الاسم','Merci pour votre avis !':'شكرًا على رأيك!','Annonce publiée':'تم نشر الإعلان',
'Le lien doit commencer par https://':'يجب أن يبدأ الرابط بـ https://','Réglage enregistré':'تم حفظ الإعداد','Statut mis à jour':'تم تحديث الحالة','Annonce supprimée':'تم حذف الإعلان',
"Vous êtes connecté à l'espace équipe.":'أنت متصل بفضاء الفريق.','Merci de faire partie de la communauté ANAN.':'شكرًا لانتمائك إلى مجتمع ANAN.',
'Voir toutes les annonces':'عرض كل الإعلانات',"Pas encore d'annonce du Bureau.":'لا يوجد إعلان من المكتب بعد.',
"Soutenir l'association":'دعم الجمعية',"L'application est gratuite. Si vous le souhaitez, vous pouvez contribuer depuis n'importe quel pays.":'التطبيق مجاني. يمكنك المساهمة من أي بلد إذا رغبت.',
'Faire une contribution':'تقديم مساهمة','Votre avis compte':'رأيك مهم',"Dites-nous ce que vous pensez de l'application et de l'association.":'أخبرنا برأيك في التطبيق والجمعية.','Donner mon avis':'إبداء رأيي',
"Installer l'application":'تثبيت التطبيق',"Ajoutez ANAN à votre écran pour l'ouvrir comme une application.":'أضف ANAN إلى شاشتك لفتحه كتطبيق.','Installer ANAN':'تثبيت ANAN',
'Sur iPhone : dans Safari, touchez':'على iPhone: في Safari، اضغط','Partager':'مشاركة','puis':'ثم',"Sur l'écran d'accueil":'إضافة إلى الشاشة الرئيسية',
"Sur ordinateur (Chrome ou Edge) : cliquez sur l'icône d'installation à droite de la barre d'adresse. Sur Android : menu ⋮ puis":'على الحاسوب (Chrome أو Edge): انقر على أيقونة التثبيت يمين شريط العنوان. على Android: القائمة ⋮ ثم',
'Annonces du Bureau':'إعلانات المكتب','Urgent':'عاجل','Important':'مهم','Info':'معلومة','Aucune annonce pour le moment.':'لا توجد إعلانات حاليًا.',
"Pour publier une annonce, allez dans l'onglet Équipe.":'لنشر إعلان، اذهب إلى تبويب الفريق.',
'Contribution enregistrée':'تم تسجيل المساهمة',"Elle apparaît « en attente » jusqu'à ce que l'équipe confirme la réception.":'تظهر «قيد الانتظار» حتى يؤكد الفريق الاستلام.',
'Comment payer':'طريقة الدفع','Ouvrir la page de paiement sécurisée':'فتح صفحة الدفع الآمنة',"Ce moyen de paiement n'est pas encore configuré par l'équipe. Vous serez contacté par e-mail.":'وسيلة الدفع هذه لم يُعدّها الفريق بعد. سيتم التواصل معك بالبريد الإلكتروني.',
'Les contributions ne sont pas encore ouvertes.':'المساهمات غير مفتوحة بعد.',
"L'application est et restera gratuite. Chaque contribution est volontaire et sert uniquement aux actions de l'association (règlement, art. 6). Vous pouvez payer depuis n'importe quel pays.":'التطبيق مجاني وسيبقى مجانيًا. كل مساهمة تطوعية وتُستخدم فقط لأنشطة الجمعية (النظام، المادة 6). يمكنك الدفع من أي بلد.',
'Devise':'العملة','Franc CFA (FCFA)':'فرنك سيفا (FCFA)','Euro (€)':'يورو (€)','Dollar ($)':'دولار ($)','Montant':'المبلغ','Autre':'آخر','Autre montant':'مبلغ آخر',
'Moyen de paiement':'وسيلة الدفع','Opérateur':'المشغّل','Crypto-monnaie':'عملة رقمية',
"🔒 L'ANAN ne vous demande jamais votre code secret ni votre numéro de carte dans l'application.":'🔒 لن تطلب منك ANAN أبدًا رمزك السري أو رقم بطاقتك داخل التطبيق.',
'Mes contributions':'مساهماتي','En attente':'قيد الانتظار','Confirmée':'مؤكدة','Annulée':'ملغاة',"Vous n'avez pas encore contribué.":'لم تساهم بعد.',
'Mobile money':'المال عبر الهاتف','Carte bancaire':'بطاقة بنكية','Virement bancaire':'تحويل بنكي',
'Votre avis':'رأيك','Votre satisfaction':'مدى رضاك','Touchez une étoile':'اضغط على نجمة','Pas satisfait':'غير راضٍ','Peu satisfait':'راضٍ قليلًا',
'Moyennement satisfait':'راضٍ نوعًا ما','Satisfait':'راضٍ','Très satisfait':'راضٍ جدًا','Votre commentaire':'تعليقك',
"Ce qui vous plaît, ce qu'on peut améliorer…":'ما يعجبك، وما يمكننا تحسينه…','Envoyer mon avis':'إرسال رأيي',"Votre avis est lu uniquement par l'équipe de l'ANAN.":'لا يقرأ رأيك إلا فريق ANAN.',
'Mes avis envoyés':'آرائي المرسلة',"Vous n'avez pas encore donné d'avis.":'لم تُبدِ رأيك بعد.',
'Vérifiée':'مؤكَّد','Type de compte':'نوع الحساب','Membre':'عضو','Changer de mot de passe':'تغيير كلمة المرور','Changer':'تغيير','Se déconnecter':'تسجيل الخروج',
"Pour supprimer votre compte et vos données, écrivez à l'équipe de l'ANAN (règlement, art. 11).":'لحذف حسابك وبياناتك، راسل فريق ANAN (النظام، المادة 11).',
'Compte supprimé':'حساب محذوف'
};

/* Haoussa : traduction à faire relire par un locuteur. */
D.ha = {
"Visible uniquement par l'équipe (3 personnes au plus).":'Ƙungiyar gudanarwa kaɗai ke gani (mutum 3 a mafi yawa).','Contributions confirmées':'Gudummawar da aka tabbatar','Satisfaction':'Gamsuwa','Comptes inscrits':'Asusun da aka yi rajista',
'Publier une annonce':'Wallafa sanarwa','Titre':'Take','Message':'Saƙo','Importance':'Muhimmanci','Information':'Bayani','Publier':'Wallafa','Supprimer':'Goge','Confirmer ?':'Tabbatar?',
'Contributions':'Gudummawa','Aucune contribution.':'Babu gudummawa.','Date':'Kwanan wata','Moyen':'Hanya','Statut':'Matsayi','Reçu':'An karɓa','Annuler':'Soke',
'Avis des membres':'Ra\'ayoyin mambobi','Aucun avis.':'Babu ra\'ayi.','Membres inscrits':'Mambobin da suka yi rajista','Nom':'Suna','E-mail':'Imel','Rôle':'Matsayi','Inscrit le':'Ranar rajista',
'Réglages de paiement 🔒':'Saitunan biyan kuɗi 🔒','Actif':'Yana aiki','Instructions pour le membre':'Umarni ga mamba','Lien de paiement sécurisé (https)':'Mahaɗin biya mai tsaro (https)',
"Réservé à l'équipe. Un membre ne voit que les instructions du moyen qu'il choisit, au moment de payer. Les clés secrètes d'un prestataire ne se mettent jamais ici.":'Na ƙungiyar gudanarwa kaɗai. Mamba yana ganin umarnin hanyar da ya zaɓa ne kawai, lokacin biya. Ba a taɓa saka maɓallan sirri na mai bada sabis a nan ba.',
'Langue':'Harshe',
'Accueil':'Gida','Annonces':'Sanarwa','Contribuer':'Gudummawa','Avis':"Ra'ayi",'Règlement':'Dokoki','Équipe':'Tawaga',
'Mon compte':'Asusuna','Communauté 2025 – 2026':"Al'umma 2025 – 2026",'Espace équipe':'Wurin tawaga','Chargement…':'Ana lodawa…',
'Mot de passe oublié':'Na manta kalmar sirri','Entrez votre adresse e-mail : vous recevrez un lien pour choisir un nouveau mot de passe.':'Shigar da adireshin imel ɗinka: za ka karɓi hanyar haɗi don zaɓar sabuwar kalmar sirri.',
'Adresse e-mail':'Adireshin imel','Envoyer le lien':'Aika hanyar haɗi','Retour':'Koma baya',
"Bienvenue à l'ANAN":'Barka da zuwa ANAN',"Application gratuite de l'association. Créez votre compte avec votre adresse e-mail pour y accéder.":'Manhaja kyauta ta ƙungiyar. Ƙirƙiri asusunka da adireshin imel ɗinka don shiga.',
'Créer un compte':'Ƙirƙiri asusu','Se connecter':'Shiga','Nom et prénom':'Suna cikakke','Mot de passe':'Kalmar sirri','Confirmer le mot de passe':'Tabbatar da kalmar sirri',
'8 caractères minimum, avec au moins un chiffre.':'Aƙalla haruffa 8, tare da lamba ɗaya aƙalla.',
"J'accepte le règlement intérieur et la protection de mes données (art. 11).":'Na amince da dokokin cikin gida da kare bayanaina (sashe na 11).',
'Créer mon compte':'Ƙirƙiri asusuna','Mot de passe oublié ?':'Ka manta kalmar sirri?','Nouveau mot de passe':'Sabuwar kalmar sirri','Confirmer':'Tabbatar','Enregistrer':'Ajiye',
'Un e-mail de confirmation a été envoyé à':'An aika imel na tabbatarwa zuwa',". Ouvrez le lien qu'il contient, puis connectez-vous.":'. Buɗe hanyar haɗin da ke ciki, sannan ka shiga.',
"Si un compte existe avec cette adresse, un lien vient d'être envoyé.":'Idan akwai asusu da wannan adireshi, an aika hanyar haɗi.',
'Adresse e-mail ou mot de passe incorrect.':'Adireshin imel ko kalmar sirri ba daidai ba ne.',"Confirmez d'abord votre adresse e-mail (lien reçu par e-mail).":'Ka fara tabbatar da adireshin imel ɗinka (hanyar haɗin da aka aiko maka).',
'Un compte existe déjà avec cette adresse. Connectez-vous.':'Akwai asusu da wannan adireshi tuni. Ka shiga.','Mot de passe refusé : 8 caractères minimum, avec au moins un chiffre.':'An ƙi kalmar sirri: aƙalla haruffa 8 tare da lamba ɗaya.',
"Trop d'essais. Patientez quelques minutes.":"An yi ƙoƙari da yawa. Ka jira 'yan mintuna.",'Action non autorisée.':'Ba a yarda da wannan aiki ba.',
'Une erreur est survenue. Vérifiez votre connexion et réessayez.':'An sami matsala. Duba haɗin intanet ɗinka ka sake gwadawa.',
'Les deux mots de passe ne sont pas identiques.':'Kalmomin sirrin biyu ba ɗaya ba ne.','Choisissez une note de 1 à 5 étoiles.':'Zaɓi maki daga tauraro 1 zuwa 5.',
'Mot de passe changé':'An canza kalmar sirri','Nom enregistré':'An ajiye suna','Merci pour votre avis !':"Na gode da ra'ayinka!",'Annonce publiée':'An wallafa sanarwa',
'Le lien doit commencer par https://':'Dole hanyar haɗi ta fara da https://','Réglage enregistré':'An ajiye saiti','Statut mis à jour':'An sabunta matsayi','Annonce supprimée':'An goge sanarwa',
"Vous êtes connecté à l'espace équipe.":'Ka shiga wurin tawaga.','Merci de faire partie de la communauté ANAN.':"Na gode da kasancewa cikin al'ummar ANAN.",
'Voir toutes les annonces':'Duba duk sanarwoyi',"Pas encore d'annonce du Bureau.":'Babu sanarwa daga Ofishin tukuna.',
"Soutenir l'association":'Tallafa wa ƙungiyar',"L'application est gratuite. Si vous le souhaitez, vous pouvez contribuer depuis n'importe quel pays.":'Manhajar kyauta ce. Idan kana so, za ka iya bayar da gudummawa daga kowace ƙasa.',
'Faire une contribution':'Bayar da gudummawa','Votre avis compte':"Ra'ayinka yana da muhimmanci","Dites-nous ce que vous pensez de l'application et de l'association.":"Faɗa mana ra'ayinka game da manhajar da ƙungiyar.",'Donner mon avis':"Bayar da ra'ayi",
"Installer l'application":'Saka manhajar',"Ajoutez ANAN à votre écran pour l'ouvrir comme une application.":'Saka ANAN a allonka don buɗe ta kamar manhaja.','Installer ANAN':'Saka ANAN',
'Sur iPhone : dans Safari, touchez':'A iPhone: a Safari, taɓa','Partager':'Raba','puis':'sannan',"Sur l'écran d'accueil":'Allon gida',
"Sur ordinateur (Chrome ou Edge) : cliquez sur l'icône d'installation à droite de la barre d'adresse. Sur Android : menu ⋮ puis":'A kwamfuta (Chrome ko Edge): danna alamar saka a dama da sandar adireshi. A Android: menu ⋮ sannan',
'Annonces du Bureau':'Sanarwar Ofishi','Urgent':'Gaggawa','Important':'Muhimmi','Info':'Bayani','Aucune annonce pour le moment.':'Babu sanarwa yanzu.',
"Pour publier une annonce, allez dans l'onglet Équipe.":'Don wallafa sanarwa, je shafin Tawaga.',
'Contribution enregistrée':'An rubuta gudummawa',"Elle apparaît « en attente » jusqu'à ce que l'équipe confirme la réception.":'Za ta nuna « ana jira » har sai tawaga ta tabbatar da karɓa.',
'Comment payer':'Yadda ake biya','Ouvrir la page de paiement sécurisée':'Buɗe shafin biya mai tsaro',"Ce moyen de paiement n'est pas encore configuré par l'équipe. Vous serez contacté par e-mail.":'Tawaga ba ta shirya wannan hanyar biya ba tukuna. Za a tuntuɓe ka ta imel.',
'Les contributions ne sont pas encore ouvertes.':'Ba a buɗe gudummawa ba tukuna.',
"L'application est et restera gratuite. Chaque contribution est volontaire et sert uniquement aux actions de l'association (règlement, art. 6). Vous pouvez payer depuis n'importe quel pays.":'Manhajar kyauta ce kuma za ta ci gaba da zama kyauta. Kowace gudummawa ta son rai ce, kuma ana amfani da ita ne kawai don ayyukan ƙungiyar (dokoki, sashe na 6). Za ka iya biya daga kowace ƙasa.',
'Devise':'Kuɗi','Franc CFA (FCFA)':'Sefa (FCFA)','Euro (€)':'Yuro (€)','Dollar ($)':'Dala ($)','Montant':'Adadi','Autre':'Wani','Autre montant':'Wani adadi',
'Moyen de paiement':'Hanyar biya','Opérateur':'Kamfanin waya','Crypto-monnaie':'Kuɗin intanet (crypto)',
"🔒 L'ANAN ne vous demande jamais votre code secret ni votre numéro de carte dans l'application.":'🔒 ANAN ba za ta taɓa tambayar lambar sirrinka ko lambar katinka a cikin manhajar ba.',
'Mes contributions':'Gudummawoyina','En attente':'Ana jira','Confirmée':'An tabbatar','Annulée':'An soke',"Vous n'avez pas encore contribué.":'Ba ka bayar da gudummawa ba tukuna.',
'Mobile money':'Kuɗin waya','Carte bancaire':'Katin banki','Virement bancaire':'Tura kuɗi ta banki',
'Votre avis':"Ra'ayinka",'Votre satisfaction':'Gamsuwarka','Touchez une étoile':'Taɓa tauraro','Pas satisfait':'Ban gamsu ba','Peu satisfait':'Na ɗan gamsu',
'Moyennement satisfait':'Na gamsu kaɗan','Satisfait':'Na gamsu','Très satisfait':'Na gamsu sosai','Votre commentaire':'Sharhinka',
"Ce qui vous plaît, ce qu'on peut améliorer…":'Abin da kake so, abin da za mu inganta…','Envoyer mon avis':"Aika ra'ayina","Votre avis est lu uniquement par l'équipe de l'ANAN.":"Tawagar ANAN kaɗai ke karanta ra'ayinka.",
'Mes avis envoyés':"Ra'ayoyina da na aika","Vous n'avez pas encore donné d'avis.":"Ba ka bayar da ra'ayi ba tukuna.",
'Vérifiée':'An tabbatar','Type de compte':'Irin asusu','Membre':'Memba','Changer de mot de passe':'Canza kalmar sirri','Changer':'Canza','Se déconnecter':'Fita',
"Pour supprimer votre compte et vos données, écrivez à l'équipe de l'ANAN (règlement, art. 11).":'Don goge asusunka da bayananka, rubuta wa tawagar ANAN (dokoki, sashe na 11).',
'Compte supprimé':'Asusun da aka goge'
};

/* Phrases avec une partie variable */
const PAT = [
  [/^Bonjour (.+)$/, {en:'Hello $1', ar:'مرحبًا $1', ha:'Sannu $1'}],
  [/^Dernière annonce · (.+)$/, {en:'Latest announcement · $1', ar:'آخر إعلان · $1', ha:'Sanarwa ta ƙarshe · $1'}],
  [/^Vous avez contribué (\d+) fois\. Merci !$/, {en:'You have contributed $1 times. Thank you!', ar:'لقد ساهمت $1 مرة. شكرًا!', ha:'Ka bayar da gudummawa sau $1. Na gode!'}],
  [/^Indiquez un montant d'au moins (.+)\.$/, {en:'Enter an amount of at least $1.', ar:'أدخل مبلغًا لا يقل عن $1.', ha:'Shigar da adadi aƙalla $1.'}],
  [/^(\d) sur 5$/, {en:'$1 out of 5', ar:'$1 من 5', ha:'$1 cikin 5'}]
];

/* ---------- Moteur ---------- */
let lang = 'fr';
try { const s = localStorage.getItem('anan-langue'); if (LANGS.some(l => l.code === s)) lang = s; } catch (e) {}

function t(s){
  if (lang === 'fr' || s == null) return s;
  const d = D[lang]; if (!d) return s;
  const k = String(s).trim(); if (!k) return s;
  if (Object.prototype.hasOwnProperty.call(d, k)) return String(s).replace(k, d[k]);
  for (const [re, tr] of PAT) if (tr[lang] && re.test(k)) return String(s).replace(k, k.replace(re, tr[lang]));
  return s;
}
const ORIG = new WeakMap();   /* texte français d'origine, pour changer de langue sans recharger */
function apply(root){
  if (!root) return;
  const tx = v => (lang === 'fr' || !D[lang]) ? v : t(v);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => n.parentElement && n.parentElement.closest('script,style,[data-brut]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT});
  const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(n => { if (!ORIG.has(n)) ORIG.set(n, n.nodeValue); const v = tx(ORIG.get(n)); if (v !== n.nodeValue) n.nodeValue = v; });
  root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => {
    if (!ORIG.has(el)) ORIG.set(el, {});
    const o = ORIG.get(el);
    ['placeholder','aria-label','title'].forEach(a => { if (!el.hasAttribute(a)) return; if (!(a in o)) o[a] = el.getAttribute(a); const v = tx(o[a]); if (v !== el.getAttribute(a)) el.setAttribute(a, v); });
  });
}
function setHtmlLang(){
  const L = LANGS.find(l => l.code === lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = L && L.rtl ? 'rtl' : 'ltr';
}
setHtmlLang();

window.I18N = {
  LANGS, t, apply,
  get lang(){ return lang; },
  set(code){ if (!LANGS.some(l => l.code === code)) return; lang = code; try { localStorage.setItem('anan-langue', code); } catch (e) {} setHtmlLang(); },
  locale(){ return LOCALE[lang] || 'fr-FR'; },
  traduit(){ return lang === 'fr' || !!D[lang]; }
};
})();
