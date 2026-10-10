# BEE — CORRECTIONS de la version 13.37

**Branche :** `corrections` (créée à partir de `main`, qui n'a pas été modifiée).
**Version :** 13.37 (`versionCode` 33). Elle remplace la 13.36 analysée dans `RAPPORT-ANALYSE.md`.
**Fichier du logiciel :** `app/src/main/assets/index.html` (c'est lui qui est compilé). Les deux autres copies
(`index.html` à la racine et `app/src/index.html`) lui sont identiques, octet pour octet.

---

## 1. En résumé

- Les **devoirs** des séances d'apprentissage sont allégés (2 à 3 phrases simples) et la « rédaction guidée de paragraphe » est remplacée par des exercices de phrases.
- Les **situations d'intégration** suivent maintenant le rythme demandé par l'inspecteur : une par unité au post-primaire, une par groupe de deux unités au secondaire (la dernière unité seule quand leur nombre est impair). L'écran « Progression » le montre.
- Toute situation d'intégration et toute composition a **exactement trois consignes**, et la grille note, pour chaque consigne, le point de grammaire qui lui correspond. Les totaux (3 / 6 / 9 / 2 = 20) sont justes, même si l'enseignant change le barème.
- Les **fautes d'anglais** produites par le logiciel sont corrigées (« a animal », « He is a grandmother », « he » génériques, coquilles recopiées de la planification).
- Les **fourchettes de mots** de la 2nde C et de la Terminale C-D sont corrigées, et les **88 textes supports** hors fourchette du second cycle ont été réécrits pour y entrer. Les textes d'origine sont conservés.
- La **licence** n'est plus effacée pour une simple erreur de vérification.
- L'**export des fichiers** sur Android 6 à 9 demande maintenant l'autorisation d'écrire et affiche un message en français en cas d'échec.
- Le dossier de compilation mal placé est supprimé et le numéro de version est le même partout.

Ce qui n'a **pas** été touché, comme demandé : la ligne « Curriculum designer: Tidiani BARRY… », la structure officielle des unités, leçons et séances, la clé et le système de signature des licences (le code qui vérifie la signature est identique à celui de `main`, vérifié ligne à ligne).

---

## 2. Ce qui a changé, point par point

### Décision 1 — Devoirs et séances d'apprentissage

- **Devoirs.** Les 38 devoirs thématiques sont réécrits : « Write two or three simple sentences about… ». Plus de paragraphe, plus de phrase « Expected length: 8 to 10 sentences ». Pour les séances de 6e construites sur un dialogue, le devoir reste « apprendre le dialogue par cœur et le rejouer », qui n'est pas une production. Pour une séance de traduction, le devoir reste la traduction du reste du texte.
- **Activité semi-contrôlée.** « Guided paragraph writing » (55 fiches) est remplacé par **« Sentence completion »** (compléter des phrases avec ses propres mots). L'autre activité, « Sentence writing from prompts » (construire une phrase à partir de mots donnés), est conservée. Pour que la même activité ne soit pas proposée deux fois, la séance d'écriture remplace sa phase contrôlée « Sentence completion » par « Word or phrase ordering » (remettre des mots en ordre).
- **Rien d'autre à produire.** Aucune grille ni feuille de notes dans les séances d'apprentissage (vérifié sur les 463 fiches).
- Le devoir allégé est aussi utilisé dans les séances de consolidation et de résolution de problème (même fonction dans le logiciel) ; on y a retiré le mot « today » qui n'avait pas de sens.

### Décision 2 — Rythme des situations d'intégration

- **Post-primaire (6e, 5e, 4e, 3e)** : une situation à la fin de chaque unité (8 par classe, 32 en tout).
- **Secondaire** : une situation à la fin de chaque groupe de deux unités (unités 1+2, 3+4, 5+6, 7+8). Pour la 2nde C, la 1ère C-D et la Terminale C-D, qui ont 7 unités, **l'unité 7 a sa propre situation**. Cela fait 4 situations par classe du secondaire, soit 24, et **56 au total** (77 auparavant).
- **Menus** : en choisissant « Problem-Solving Session », la liste des unités devient une liste de groupes (« Units 1 + 2: … »). En revenant à « Learning Session », la liste des unités complète revient.
- **Écran « Progression »** : la ligne « Problem-solving » vient après la dernière unité du groupe (« units 1 and 2 »), et la phrase d'explication dit désormais la vraie règle. Les anciennes fiches enregistrées s'ouvrent toujours.
- **Contexte** : comme deux unités n'ont pas toujours de lien entre elles, j'ai écrit pour les 21 groupes de deux unités une situation de départ qui réunit les deux thèmes (ex. : « Working and living together » pour *Youth unemployment* + *Religions*). La consigne dit déjà ce que l'élève doit faire. **À relire par l'inspecteur** (tableau `SITUATIONS_GROUPES` dans `index.html`).

### Décision 3 — Trois consignes partout, grille adaptée

- **Choix des trois consignes.** Le logiciel prend d'abord une leçon par consigne, en alternant les deux unités du groupe (par exemple leçon 1 de l'unité A, leçon 1 de l'unité B, leçon 2 de l'unité A). **S'il y a moins de trois leçons**, il décline les fonctions de communication des leçons ; s'il n'y en a pas assez non plus, il décline les séances de la leçon. Le sélecteur « Number of instructions » ne propose plus que « Three (as required) ».
- **Grille.** Chaque consigne reçoit **son** point de grammaire (celui que la planification prescrit à la séance qui porte la fonction demandée). Avec le barème par défaut, chaque consigne vaut 1 + 2 + 3 points, plus 2 points de présentation pour l'ensemble. Avec un autre barème (par exemple 4/5/8/3), les points sont partagés au quart de point près et **les totaux restent exacts**.
- **Composition.** Elle donne toujours trois consignes (avant : 1 à 3 selon l'unité) ; le corrigé liste, pour chaque consigne, le point de grammaire noté. Pour la Terminale, la rédaction reste à environ **150 mots** (instructions du baccalauréat), même si la production de classe de la Terminale C-D est de 120 mots.
- **Non modifié** : les tâches de **consolidation** (une consigne par séance de la leçon, 1 à 4). La demande visait les situations d'intégration et la composition ; à confirmer avec l'inspecteur si la consolidation doit aussi avoir trois consignes.

### Urgent 4 — Articles et pronoms de la consigne de vocabulaire

La consigne choisit « a » ou « an » selon le **son** du mot (an uncle, an animal, a university, a uniform, an hour). Elle écrit « He is… » ou « She is… » selon le mot (**grandmother, aunt, girl : « She is… »** ; **uncle, brother : « He is… »**) et propose les deux seulement quand le mot convient aux deux. Les pluriels (« These are books. ») et les mots non dénombrables (« This is water. ») sont aussi traités.

### Urgent 5 — Fourchettes de mots (second cycle)

Contrôlé sur les six classes dans la planification d'octobre 2025 :

| Classe | Lecture (mots) | Production (mots) | Avant |
|---|---|---|---|
| 2nde A | 300–350 | 100 | correct |
| 1ère A | 350–400 | 120 | correct |
| Terminale A | 400–450 | 150 | correct |
| **2nde C** | **350–400** | **120** | 300–350 et 100 : **corrigé** |
| 1ère C-D | 350–400 | 120 | correct |
| **Terminale C-D** | **350–400** | **120** | 400–450 et 150 : **corrigé** |

Les 88 textes supports (version « Official length ») qui sortaient de la fourchette sont réécrits :
**66 sont raccourcis** (phrases ou paragraphes secondaires retirés, même thème, même niveau, phrases portant le point de grammaire conservées) et **22 sont allongés** (2nde C : une ou deux phrases ajoutées). Résultat : **les 211 textes du second cycle sont dans la fourchette** (liste en annexe). Les **textes d'origine** du second cycle (« Original version ») sont conservés tels quels (vérifié texte par texte). Au post-primaire, six textes ont seulement reçu des corrections de pronoms (« he/him or her » erronés). Pour les deux textes qui ont une traduction française de référence, la traduction a été raccourcie de la même façon.

### Urgent 6 — Licence

- Une licence enregistrée n'est **plus effacée** quand la vérification échoue pour une autre raison qu'une signature réellement invalide (navigateur trop ancien, erreur passagère, donnée abîmée). L'écran affiche « **Vérification impossible, réessayez.** » et un bouton « Réessayer la vérification ».
- Si l'**identifiant de l'appareil a changé**, le message dit : « L'identifiant de cet appareil a changé. Votre licence est conservée. Envoyez ce nouvel identifiant à BEE avec le bouton WhatsApp ci-dessous… » et affiche l'identifiant.
- Seule une signature fausse retire la licence, avec un message en français.

### Urgent 7 — Export Android 6 à 9

`MainActivity.java` demande maintenant l'autorisation d'écriture (`WRITE_EXTERNAL_STORAGE`, déjà déclarée dans le manifeste jusqu'à Android 9) au premier enregistrement, puis enregistre le fichier si l'enseignant accepte. S'il refuse, ou si la lecture ou l'écriture échoue, un message **en français** l'explique. Les noms de fichiers sont nettoyés. Android 10 et plus ne sont pas concernés (ils n'ont pas besoin de cette autorisation).

### 8 — « he » génériques

Remplacés par « he or she », « they » ou le pluriel : tous ceux de la liste du rapport (citoyen, enfant perdu, « Nobody has to speak about themselves… », « Each pupil has his or her own… », « Pupils should prepare their lessons… », « The second speaker agrees. », « the head teacher is not your friend ») et environ 80 corrections de pronoms dans les textes et les exercices, dont une quarantaine d'erreurs inverses (voir plus bas). Les « he » qui désignent un personnage nommé ou précis restent. J'ai aussi corrigé l'**erreur inverse**, plus fréquente que prévu (une quarantaine de cas) : des « his or her / him or her » mis à tort derrière un personnage nommé (« Issouf… his or her poultry farm », « Hervé and his or her classmates », « Awa… thanks him or her »…). Enfin, les exercices ne coupent plus « his or her » en deux (« …keeps his… »).

### 9 — Coquilles recopiées de la planification

« ; » parasites (« causes of drug; use by teenagers », « tell, ask and; write the date », « -; », « .; »), « the the », « alliances alliances », « vocabulary vocabulary », « the The », « FMGs » (devenu **FGMs** partout, y compris dans les noms de leçons), « ressources » (resources), « related ICTs » (related **to** ICTs), « learners will be able to the learners will be able to… », « Unit 3: : POLLUTION », « Transfering ». Les points-virgules sont maintenant rétablis seulement là où un nouvel objectif commence vraiment.

**Cellules coupées de la planification, reconstituées** (à confirmer par l'inspecteur) : 5e *Writing about tourism* (« describe some tourist activities or sites in Burkina Faso »), 4e *Women in economies* (compétence « skim a text (for the gist) » ; le point de grammaire qui avait débordé dans la cellule voisine est rétabli : « …pleased with, willing to »), 3e *Narrating events* (« scan a text (reading for specific information or details) »), 1ère C-D *Adaptation to Global Warming* et Terminale C-D *Rule of law… reinforce grammatical notions* (objectifs complétés d'après les séances voisines), 1ère C-D *Risk-Taking* (« talk about risk-taking in entrepreneurship and employment »).

### 10 — Dépôt et version

- Dossier `.github/workflows/.github/` supprimé (il n'a jamais été exécuté) ; `main.yml` reste en place.
- Version **13.37** dans `app/build.gradle` (`versionName`, `versionCode` 33), dans l'étiquette du logiciel et dans le titre de la page.

### Petites corrections liées, trouvées en cours de route

- Majuscules des sigles et noms propres dans les consignes (ICTs, FGMs, Burkina Faso…), au lieu de « icts », « burkina faso ».
- Les points de grammaire prescrits mal écrits (« (used to) », « Review: … », « the: Simple past ») sont nettoyés avant d'entrer dans la grille.
- L'exercice de traduction d'un passage choisit un paragraphe assez long au lieu d'abandonner quand le premier tirage est trop court.

---

## 3. Résultats de la vérification

Toutes les fiches ont été regénérées dans un navigateur, comme pendant l'analyse, puis contrôlées automatiquement (`tests/verifier-les-fiches.js`). Le même contrôle, lancé sur la version 13.36, retrouve les défauts du rapport, ce qui prouve qu'il sait les repérer.

**Fiches générées : 674** (463 apprentissage, 155 consolidation, 56 résolution de problème), pour les dix classes.

| Contrôle | Version 13.36 | Version 13.37 |
|---|---|---|
| Erreurs de programme à la génération | 0 | **0** |
| « a » devant une voyelle (ou « an » devant une consonne) | 20 phrases | **0** |
| « he / his / him » génériques | 84 contextes | **0** (1) |
| Textes du second cycle dans la fourchette officielle | 121 sur 211 | **211 sur 211** |
| Fourchettes et longueurs de production conformes à la planification | 4 écarts | **0** |
| Situations d'intégration avec exactement trois consignes | 16 sur 77 | **56 sur 56** |
| Compositions avec trois consignes et leurs trois points de grammaire (77 essayées : 10 classes × toutes les unités) | 16 sur 77 avaient trois consignes, aucune ne listait les points de grammaire | **77 sur 77** |
| Grille : seulement en résolution de problème, totaux justes | oui | **oui** (aussi avec 8 barèmes différents, 48 grilles) |
| Rythme des situations (par unité / par groupe de deux, dernière seule si impair) | non | **conforme** |
| Devoirs sans paragraphe ni longueur imposée | 350 non conformes | **0** (2) |
| Rédaction de paragraphe dans l'apprentissage (activité « Guided paragraph writing » : 55 fiches ; devoirs de paragraphe : 67) | 55 + 67 | **0** |
| Objectifs avec coquilles (« ; », mots doublés…) | 76 | **0** |
| Ligne « Curriculum designer: Tidiani BARRY… » sur chaque fiche | oui | **oui** |
| Trois copies de `index.html` identiques ; version identique partout | — | **oui** (13.37) |

(1) Le programme ne comprend pas le sens des phrases : il cherche un « he » après « a pupil », « each citizen », « nobody », « the entrepreneur »… Les cas restants (une trentaine de phrases) concernent des personnages précis (un récit, un exemple de faute d'élève, Karim, Rasmané…) ; je les ai relus à la main et ils figurent sur une liste de personnages autorisés dans le script.
(2) Les devoirs de 6e (apprendre un dialogue) et de traduction ne sont pas des productions ; le contrôle ne cherche pas la formule « simple sentences » dans ces deux cas.

Autres essais automatiques (`tests/essai-licence-et-interface.js`, **32 sur 32 réussis**) : écran de licence (aucune licence, autre appareil, code illisible, donnée abîmée, signature fausse, bouton « Réessayer »), menus des situations d'intégration dans les dix classes, passage d'apprentissage à résolution de problème, écran « Progression » (bouton « Prepare », fiche enregistrée puis rouverte et cochée).

---

## 4. À tester vous-même sur un téléphone

Je n'ai pas de téléphone ni d'Android SDK : **l'application Android n'a pas été compilée ni essayée sur un appareil.** À faire, dans cet ordre, avec l'APK construit à partir de cette branche :

1. **Mise à jour sans perdre la licence.** Sur un téléphone déjà activé avec la 13.36, installer la 13.37 *par-dessus*. L'écran d'activation ne doit pas réapparaître. Si l'enseignant voit « Vérification impossible, réessayez », appuyer sur « Réessayer » : la licence doit rester enregistrée.
2. **Changement d'appareil.** Installer sur un autre téléphone avec la même licence : le message demande d'envoyer le **nouvel identifiant** ; le bouton WhatsApp doit contenir cet identifiant.
3. **Export sur Android 6, 7, 8 ou 9** (le cas le plus important) : « Export all plans » puis « Download for Word ». Le téléphone doit demander l'autorisation ; après « Autoriser », le fichier apparaît dans *Téléchargements*. Refuser ensuite l'autorisation : un message en français doit s'afficher. Refaire le test avec « Autoriser ».
4. **Export sur Android 10 ou plus** : doit se comporter comme avant (aucune demande d'autorisation).
5. **Import** du fichier exporté (« Import plans ») : les fiches reviennent.
6. **Situations d'intégration.** Choisir « Problem-Solving Session » en 2nde A : la liste des unités propose 4 groupes. Générer la fiche : trois consignes, une grille dont les colonnes font 3 / 6 / 9 / 2. Faire de même en 2nde C (le 4e choix est l'unité 7 seule) et en 6e (une situation par unité).
7. **Écran « Progression »** en 2nde A et en 2nde C : la ligne « Problem-solving » vient après les unités 2, 4, 6 (et 8, ou 7 seule en 2nde C).
8. **Séance d'apprentissage** de 5e ou de 2nde A sur l'écriture : deux activités de phrases, un devoir de 2 à 3 phrases, pas de grille.
9. **Compter les mots** : dans une séance de lecture de 2nde C ou de Terminale C-D, le compteur doit afficher « within the official range ».
10. **Composition** (bouton « Composition ») : coller un texte inédit, vérifier les trois consignes et le corrigé.
11. **Impression / PDF** d'une fiche de résolution de problème (la grille doit tenir sur la page).

---

## 5. Limites et points à confirmer

- **Textes ajoutés (22 textes de 2nde C) et textes raccourcis (66)** : relire avec un anglophone ou l'inspecteur ; j'ai gardé les phrases qui portent le point de grammaire de chaque séance (vérifié par programme), mais le choix de ce qui est retiré est un choix pédagogique.
- **Situations de départ des groupes de deux unités** (21) : écrites par moi, à valider.
- **Consolidation** : inchangée (voir décision 3).
- **Tests de la licence** : le code d'autorisation valide n'a pas pu être essayé (je n'ai pas la clé privée) ; j'ai simulé la réussite de la vérification pour contrôler que la porte s'ouvre. Le système de signature n'a pas été modifié.
- **Les documents officiels** (guides, planifications, instructions) ne sont que sur la branche `analyse` ; je les ai lus à cet endroit sans les copier dans `corrections`.
- **Non traité (hors demande)** : interface en français, formulaire plus court, protection contre la copie du logiciel (dépôt public), nouveau texte du README, message pour les navigateurs trop anciens, sauvegarde automatique. Ils restent dans `RAPPORT-ANALYSE.md`.

---

## 6. Fichiers ajoutés ou modifiés

- `index.html`, `app/src/index.html`, `app/src/main/assets/index.html` : le logiciel (trois copies identiques).
- `app/src/main/java/.../MainActivity.java` : autorisation d'écriture et messages d'échec.
- `app/build.gradle` : version 13.37, `versionCode` 33.
- `.github/workflows/.github/` : supprimé.
- `README.md` : paragraphe sur les contrôles automatiques.
- `tests/` (nouveau) : `generer-toutes-les-fiches.js`, `verifier-les-fiches.js`, `essai-licence-et-interface.js` (voir le README pour les lancer).
- `CORRECTIONS.md` : ce fichier.

---

## Annexe — Textes supports du second cycle modifiés

Nombre de mots avant → après (fourchette officielle indiquée).

**1ere A** (fourchette 350–400 mots)

| Texte | Avant | Après |
|---|---|---|
| Understanding Development Aid | 401 | 373 |
| The impact of religion on conflict resolution and social harmony | 423 | 376 |
| Understanding drug addiction and substance abuse | 442 | 381 |
| Transforming learning: the role of internet in modern education | 425 | 380 |
| The role of the citizen | 422 | 381 |

**1ere C-D** (fourchette 350–400 mots)

| Texte | Avant | Après |
|---|---|---|
| Definition and Differences | 423 | 383 |
| Role of Science in Medicine | 441 | 363 |
| Networking and Relationship Building | 404 | 390 |
| The Role of Integrity in Sustainable Development | 430 | 390 |
| The Relationship Between Integrity and National Pride | 425 | 380 |

**2nde A** (fourchette 300–350 mots)

| Texte | Avant | Après |
|---|---|---|
| Understanding unemployment | 368 | 338 |
| Commonly practised revealed religions in Burkina Faso | 374 | 338 |
| Religious tolerance | 393 | 321 |
| Freedom of worship | 383 | 342 |
| Cyberbullying | 360 | 341 |
| Data privacy issues | 362 | 338 |
| Addiction to social media | 373 | 342 |
| Understanding globalisation | 373 | 336 |
| Cultural exchanges | 356 | 338 |
| The Relation between Globalisation and Geopolitics | 376 | 337 |
| Cultural tolerance and cohesion | 363 | 342 |
| Burkina Faso, the land of upright people | 363 | 320 |
| Intellectual hobbies (reading, educational video games, etc.) | 363 | 339 |
| Why separation of powers matters | 413 | 341 |
| Checks and Balances in Action | 375 | 343 |

**2nde C** (fourchette 350–400 mots)

| Texte | Avant | Après |
|---|---|---|
| The side effects of social media | 406 | 387 |
| Mobile phones: the new social addiction | 348 | 371 |
| mobile phone and safety | 349 | 367 |
| The use of smart phones in education | 349 | 370 |
| Ensuring public health | 342 | 361 |
| Impacts of self-medication on public health | 347 | 367 |
| The consequences of self-medication | 340 | 374 |
| Solutions against self-medication | 349 | 371 |
| The effects of plastic bags on the environment | 407 | 384 |
| The effects of plastic bags on humans’ and animals’ health | 347 | 367 |
| Fighting the peril of plastic bags | 341 | 362 |
| Smuggling in Burkina Faso: the manifestation | 343 | 362 |
| The economic and social impacts of smuggling in Burkina Faso | 346 | 368 |
| Government efforts to combat smuggling | 340 | 375 |
| The population’s contributions to fight smuggling | 344 | 363 |
| Understanding FGMs | 347 | 362 |
| Causes of FGMs | 343 | 359 |
| Consequences of FGMs | 343 | 364 |
| Prevention and punishment of FGMs | 336 | 366 |
| Reconstructive surgery and post-FGMs care | 344 | 365 |
| Promoting modern means of production for increased yield | 346 | 365 |
| Causes of drug use by teenagers | 401 | 390 |
| impacts of drug on teenagers | 345 | 368 |
| impacts of drug use on the society | 349 | 367 |
| Smoking and drug addiction resolution | 338 | 378 |

**Terminale A** (fourchette 400–450 mots)

| Texte | Avant | Après |
|---|---|---|
| What Is Geopolitics? Understanding Global Power | 463 | 437 |
| What Is a Geopolitical Conflict? | 472 | 440 |
| Rich Land, Poor People: Understanding the Paradox | 510 | 441 |
| Understanding Globalization | 509 | 433 |
| African Cultures in a Global World | 476 | 430 |
| The Pillars of Good Governance | 464 | 427 |
| Definition and types of ICTs (internet, mobile phones, computers, social media) | 461 | 424 |

**Terminale C-D** (fourchette 350–400 mots)

| Texte | Avant | Après |
|---|---|---|
| Getting familiar with online communication tools and platforms | 418 | 385 |
| Digital citizenship | 412 | 378 |
| Online privacy and security | 409 | 382 |
| Understanding artificial intelligence | 417 | 386 |
| Impacts, challenges, and the future of artificial intelligence | 410 | 384 |
| Major infectious diseases: causes and prevention | 403 | 391 |
| Major non-infectious diseases: causes and prevention Causes and types of major non-infectious diseases in Burk | 403 | 385 |
| Facing diseases | 427 | 373 |
| Sound living environment | 419 | 386 |
| Healthy habits | 462 | 381 |
| Types and Sources of Pollution | 470 | 390 |
| Causes and consequences of global warming | 437 | 364 |
| Actions to reduce pollution | 415 | 379 |
| Understanding conflicts and their roots | 408 | 384 |
| Categorizing conflicts | 407 | 391 |
| Responses to conflicts | 458 | 376 |
| Traditional and modern strategies for resolving conflict | 421 | 385 |
| The role of education and awareness in conflict resolution | 465 | 390 |
| Patriotism and integrity in development | 415 | 368 |
| Transparency and accountability | 414 | 360 |
| Rule of law and its effective implementation | 427 | 382 |
| Fostering socioeconomic growth through good governance | 406 | 381 |
| Impact of poor governance on society | 414 | 383 |
| Meaning and importance of food processing | 410 | 373 |
| Methods of food processing and preservation | 412 | 379 |
| Combating malnutrition and food loss | 407 | 371 |
| Understanding agribusiness entrepreneurship | 410 | 383 |
| Empowering young people to the creation of agricultural start-ups | 418 | 379 |
| Opportunities in agribusiness entrepreneurship for youth in Burkina Faso | 411 | 368 |
| Traits of a successful entrepreneur | 468 | 382 |
| Successful management of a start-up | 426 | 390 |
