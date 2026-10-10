# BEE — Burkina English Express : rapport d'analyse du dépôt

**Version analysée :** 13.36 (versionCode 32), dépôt `kacycode29/bee-fiches`, branche `main` au commit `4b6f923`.
**Date de l'analyse :** 10 octobre 2026.
**Aucun fichier de code n'a été modifié.** Ce rapport est le seul fichier ajouté.

---

## 0. Comment lire ce rapport

Chaque point porte une étiquette de priorité :

| Étiquette | Sens |
|---|---|
| 🔴 **URGENT** | Erreur visible par l'enseignant, risque de perte de données, ou règle officielle non respectée. À corriger en premier. |
| 🟠 **IMPORTANT** | Gêne réelle ou écart avec les documents officiels, mais le logiciel reste utilisable. |
| 🟢 **SOUHAITABLE** | Amélioration de confort, de finition ou de solidité. |

Les emplacements dans le code sont donnés sous la forme `index.html:ligne`.
Le logiciel entier tient dans un seul fichier, `index.html` (31 531 lignes, 2,6 Mo). Les trois exemplaires du dépôt sont identiques (voir point 5.9).

### Ce qui a été fait pour vérifier

- Lecture du code Android (`MainActivity.java`, `AndroidManifest.xml`, `build.gradle`), des deux fichiers de compilation automatique et de `index.html`.
- Lecture des six documents officiels placés à la racine : les deux guides des curricula, les deux planifications détaillées, les instructions BEPC (document scanné, lu page par page) et les instructions bac.
- **Génération automatique de toutes les fiches du logiciel dans un navigateur** : 463 séances d'apprentissage, 155 séances de consolidation et 77 séances de résolution de problème, soit **695 fiches** pour les dix classes. Aucune n'a provoqué d'erreur de programme. Le texte de chacune a ensuite été analysé par des contrôles automatiques (pronoms, articles, grille, longueur des textes, etc.).
- Essais de la composition (sujet d'évaluation), de l'import de fichiers, de l'activation de licence, de l'affichage sur un écran de téléphone, de la vitesse sur un ordinateur ralenti six fois.

### Ce qui n'a pas pu être vérifié

- Aucun essai sur un vrai téléphone Android : les points concernant l'application (enregistrement des fichiers, anciens téléphones) viennent de la **lecture du code** et sont à confirmer sur un appareil.
- Je n'ai pas la clé privée de licence : le fonctionnement d'un code d'activation valide n'a pas pu être testé de bout en bout (seule la vérification mathématique de signature a été éprouvée, voir 5.3).
- Les programmes officiels de septembre 2024, cités par le logiciel comme source des compétences, **ne sont pas dans le dépôt** : je n'ai comparé qu'avec les documents fournis.

---

## 1. Résumé en dix lignes

1. **Le cœur pédagogique est solide** : les unités, leçons, séances, compétences principales et points de grammaire du logiciel correspondent à la planification officielle (secondaire d'octobre 2025 et post-primaire), à quelques détails de ponctuation près.
2. **Aucune fiche ne plante** (695 sur 695 générées), et la génération prend quelques millisecondes.
3. **La grille chiffrée n'apparaît que dans les séances de résolution de problème** (77 sur 77) et jamais ailleurs. La répartition par défaut est bien 3 / 6 / 9 / 2 et les totaux sont justes.
4. **Les séances d'apprentissage ne s'arrêtent pas aux activités semi-contrôlées** : 350 fiches sur 463 demandent une production écrite en devoir, et 55 proposent une « rédaction guidée de paragraphe » (voir 2.1).
5. **Les fourchettes de mots officielles ne sont pas respectées** pour le second cycle : deux classes (2nde C et Terminale C-D) ont une fourchette fausse dans le logiciel, et de nombreux textes sont hors fourchette (voir 2.4).
6. **Des fautes d'anglais sont produites par le logiciel lui-même** : « This is **a** animal », « He is **a** uncle », « She is a grandmother » (voir 3).
7. **Des « he » génériques subsistent** à propos d'élèves, de citoyens ou d'enfants (voir 2.5).
8. **L'activation de licence est facile à contourner** : le dépôt est public et la « porte » est un simple attribut `hidden` (voir 5.3).
9. **La licence peut disparaître sans prévenir** si la vérification échoue une seule fois (voir 1.2).
10. **L'interface est entièrement en anglais** pour des enseignants francophones peu à l'aise avec l'informatique, et le formulaire est très long (voir 4).

---

## 2. Conformité pédagogique

### Ce qui est conforme (vérifié)

| Point | Résultat |
|---|---|
| Structure des 10 classes (unités, leçons, séances) | Conforme à la planification. Écarts : seulement des différences de ponctuation (« / », espaces) dans 3 libellés de grammaire. |
| Compétence principale et point de grammaire de chaque séance (secondaire) | 463 prescriptions comparées au document d'octobre 2025 : aucun écart de fond. |
| Canevas de la séance d'apprentissage | 15 + 15 + 7 + 8 + 3 + 7 = 55 min, comme le canevas officiel (`index.html:20962`). |
| Canevas consolidation / résolution de problème | 3 + 5 + 20 + 20 + 7 = 55 min, comme le canevas officiel. |
| Grille chiffrée uniquement en résolution de problème | 77 fiches sur 77 ont la grille ; **0 sur 463** apprentissage et **0 sur 155** consolidation. |
| Répartition de la grille | Par défaut 3 / 6 / 9 / 2 = 20. Les sommes colonne par colonne ont été recalculées sur les 77 grilles : aucune erreur d'addition. |
| Composition (sujet d'examen) | Barèmes BEPC 6 / 4 / 4 / 6, bac A 8 / 3 / 3 / 6, bac C-D 11 / 3 / 6, durées, coefficients et longueurs de texte (225–275 mots BEPC ; 350–400 mots bac) conformes aux instructions. L'exigence « texte inédit » est rappelée à l'écran. |
| Compétences terminales (2nde A, 1ère A, Terminale A) | Fourchettes de lecture 300–350, 350–400, 400–450 : conformes. |

### 2.1 🟠 IMPORTANT — Production dans les séances d'apprentissage

**Règle attendue :** une séance d'apprentissage s'arrête aux activités contrôlées et semi-contrôlées. Pas de production, pas de grille critériée.

**Constat :**
- **Pas de grille** dans les séances d'apprentissage : conforme.
- **Production en devoir (« Follow-up / Homework »)** : 350 fiches d'apprentissage sur 463 se terminent par une consigne de rédaction avec une longueur imposée, par exemple « Write a paragraph on the advantages and drawbacks of the Internet… (Expected length: 8 to 10 sentences) ». Source : `homeworkLine`, `index.html:20912`.
- **Production dans l'activité semi-contrôlée** : 55 fiches (5e et second cycle, séances où l'habileté principale est « Writing ») proposent « Guided paragraph writing » et « Sentence writing from prompts » (`SKILL_FLOW`, `index.html:29449`). Écrire un paragraphe est une production, pas un exercice semi-contrôlé au sens du guide (« finish the sentence », « limited response questions »).
- **Dialogues à jouer** : 157 fiches ont « Guided dialogue / exchange » en semi-contrôlé (acceptable tant que le dialogue reste guidé).

**À savoir :** les modèles officiels eux-mêmes comportent un « Follow up (3 mn) » avec une petite rédaction. Il faut donc décider avec l'inspecteur : soit on garde le devoir mais on l'allège (phrases, pas de longueur imposée), soit on le supprime des séances d'apprentissage. La « rédaction guidée de paragraphe » devrait être remplacée par des phrases à compléter ou à construire.

### 2.2 🟠 IMPORTANT — Les quatre constituants d'une situation d'intégration

**Règle attendue :** contexte, fonction, support, consignes.

**Constat :** les quatre sont construits (`integrationParts`, `index.html:29872`), mais :
- ils sont **rangés dans un bloc replié « Constituents of this situation — for the teacher »**, qui est **masqué à l'impression** (`index.html:256`, règle `.decomposition{display:none}`). Sur la feuille imprimée ou en PDF, on ne voit que l'énoncé fondu.
- le **support** est presque toujours générique : « What you studied in the lessons… your notebook, the support texts… ». Le guide demande un support réel (texte, image, tableau…). L'enseignant peut en coller un dans la zone « Situation d'intégration — support », mais ce champ est facultatif et peu visible.
- la **fonction** (« You take part in order to… ») est tirée du thème, pas de la leçon, et peut tomber à côté.

**Proposition :** imprimer les quatre constituants dans la fiche (ou au moins une ligne « Context / Function / Support / Instructions »), et proposer un support par défaut concret (une image à décrire, un court texte).

### 2.3 🟠 IMPORTANT — Nombre de consignes des situations d'intégration

- Les instructions BEPC et bac exigent **trois consignes** pour la production écrite.
- Le logiciel prend « une consigne par ressource étudiée » (`index.html:29872`, `dispo.length`), plafonnée à 4. Résultat sur les 77 situations d'intégration : **15 n'ont qu'une consigne** (unités à une seule leçon au second cycle), **46 en ont deux** (4e, 3e et la plupart du second cycle), et seules 16 (6e, 5e) en ont trois.
- Dans la composition, le texte du corrigé dit « Les trois consignes sont notées séparément » alors que l'énoncé n'en contient parfois que deux (`index.html:30413`).

**Proposition :** toujours produire trois consignes pour la composition ; pour la résolution de problème de classe, au moins deux ou trois, en déclinant les fonctions de la leçon quand il n'y a qu'une seule leçon.

### 2.4 🔴 URGENT — Fourchettes de mots des textes supports (second cycle)

Référence : planification détaillée d'octobre 2025, colonne « Compétences intermédiaires ».

| Classe | Fourchette officielle (lecture) | Fourchette dans le logiciel | Écart |
|---|---|---|---|
| 2nde A | 300–350 | 300–350 | — |
| 1ère A | 350–400 | 350–400 | — |
| Terminale A | 400–450 | 400–450 | — |
| **2nde C** | **350–400** | 300–350 | **Faux** |
| 1ère C-D | 350–400 | 350–400 | — |
| **Terminale C-D** | **350–400** | 400–450 | **Faux** |

Cause : `INTERMEDIATE_COMPETENCIES`, `index.html:6732`, recopié des curricula de septembre 2024, jamais mis à jour avec la planification d'octobre 2025. Conséquence : le **compteur de mots affiche « dans la fourchette officielle » alors qu'elle ne l'est pas** pour ces deux classes.

**Longueur réelle des textes affichés par défaut** (version « Official length ») pour les séances d'apprentissage, comparée à la fourchette **officielle** :

| Classe | Séances | Dans la fourchette | Hors fourchette |
|---|---|---|---|
| 2nde A (300–350) | 33 | 16 | 17 (trop longs) |
| 1ère A (350–400) | 33 | 28 | 5 (trop longs) |
| Terminale A (400–450) | 52 | 45 | 7 (trop longs) |
| 2nde C (350–400) | 31 | 6 | 25 (22 trop courts, 3 trop longs) |
| 1ère C-D (350–400) | 31 | 26 | 5 (trop longs) |
| Terminale C-D (350–400) | 31 | 0 | **31 (tous trop longs, 364 à 470 mots)** |

Les « textes d'origine » (option « Original version ») sont, pour la plupart, **plus courts que la fourchette** (227 à 379 mots ; seuls 17 sur 31 en Terminale C-D sont dans les 350–400 mots).

**Longueur de production demandée** (planification d'octobre 2025) : 2nde C = 120 mots (le logiciel dit 100) ; Terminale C-D = 120 mots (le logiciel dit 150) — `LEVEL_INFO`, `index.html:12640`. Pour le bac (composition), 150 mots reste la bonne valeur.

**Post-primaire (6e à 3e) :** la planification de travail ne fixe **aucun nombre de mots** pour les textes d'étude. Le logiciel affiche « longueur indicative » (80, 110, 150, 180 mots), ce qui est honnête. Les textes réels vont de 50 à 136 mots (6e–5e) et de 130 à 207 mots (4e–3e). Seul le **BEPC** fixe 250 mots ± 10 % pour l'épreuve (225–275), et ce chiffre est bien utilisé dans la composition. Si l'inspection a une fourchette pour les textes d'étude de la 3e, elle devra être ajoutée.

### 2.5 🟠 IMPORTANT — « he » générique à propos d'un élève ou d'une personne

Le logiciel utilise correctement « he or she » / « his or her » / « he/she » à de nombreux endroits (plus de 120 lignes de code). Restent des « he » / « his » / « himself » génériques :

| Où | Texte | Fiches touchées |
|---|---|---|
| `index.html:13170` | « Convinced that a citizen who knows **his** rights and **his** duties makes **his** country stronger » | situations d'intégration et de consolidation (6 fiches, 5e notamment) |
| `index.html:13346` | « a child is lost at the market and **his** parents need help to find **him** » (variante dans la 6e : `index.html:26798`) | 6e, unité 4 |
| `index.html:15847` | « Nobody has to speak about **himself** if **he** does not want to. » | 4e, fiche d'accompagnement |
| `index.html:25126` | « Each pupil has **his** own exercise book. » (modèle de phrase donné aux élèves) | grammaire |
| `index.html:25172` | « A pupil should prepare **his** lesson at home. » | grammaire |
| `index.html:11012`, `11087`, `9196` | textes supports : « A child who is not able to go to school cannot build **his** future », « a citizen can give is to pay what **he** owes », « avoids paying **his** taxes » | textes d'étude |
| `index.html:13455` | « Who can greet the head teacher? Remember: **he** is not your friend. » | 6e |

Le « Does the second speaker agree… expected: **He** agrees » (4e, 3e) est aussi générique. À l'inverse, les « He » des dialogues (Ali, Mr Traoré, etc.) sont normaux : ils désignent un personnage nommé.

**Correction :** remplacer par « he or she », « they » ou le pluriel (« Pupils should prepare their lessons… »). Le contrôle automatique peut être refait facilement (voir 6).

### 2.6 🟠 IMPORTANT — Libellé des compétences intermédiaires

- Les trois trimestres de chaque classe ont **exactement le même texte** : le choix du trimestre (« Term ») ne change rien, alors que la planification d'octobre 2025 donne, par trimestre, une compétence liée aux thèmes de ce trimestre (ex. « … 300 à 350 mots sur Youth unemployment, Religions in Burkina Faso et Youth and ICTs »). Le sélecteur de trimestre est donc décoratif.
- En post-primaire, le libellé du logiciel (« Comprendre un texte court écrit dans un langage très élémentaire en lien avec l'environnement immédiat… ») diffère de celui de la planification de travail (« L'apprenant doit pouvoir lire et comprendre un texte écrit dans un langage très élémentaire »). En 4e et 3e, la planification cite les thèmes du trimestre (« Families, Health, Young people in danger »), absents de la fiche.

### 2.7 🟠 IMPORTANT — Fréquence des situations d'intégration

Les deux planifications précisent : « Il faut réaliser **une** situation d'intégration **après chaque deux unités** ». Le guide du post-primaire montre pourtant un exemple « Problem solving Month 1: Unit 1 », et le logiciel propose une résolution de problème **par unité** (`progressionRows`, `index.html:30053`), avec la phrase « one situation d'intégration after each unit ». Pour le post-primaire, la planification de travail (qui fait foi) ne prévoit aucune ligne « Problem solving » dans ses tableaux. À clarifier ; en attendant, ne pas affirmer « après chaque unité » dans l'écran « Progression ».

### 2.8 🟢 SOUHAITABLE — Ce qui manque dans la composition

- Pas de modèle pour les **baccalauréats technologiques et professionnels** (instructions : compréhension 10, structure 4, rédaction 6 ; rédaction de 100 mots pour G-H, 70 mots pour les autres séries).
- Pas de modèle pour les **épreuves orales** (BEPC : texte de 100 mots ± 10 % ; bac : 250 mots ± 10 %).
- Pas de zone pour indiquer la **source** du texte autrement que par des points de suspension (le texte officiel l'exige : titre, auteur, année, page, « adapté »).

---

## 3. Qualité de l'anglais

### 3.1 🔴 URGENT — Fautes produites automatiquement par le logiciel

1. **Article « a » devant une voyelle.** La consigne de vocabulaire « personne » écrit « He is a **${mot}** » sans tenir compte de la voyelle (`voc_gestes`, `index.html:25575`, ligne 25576 ; même défaut ligne 25581 pour les objets : « This is a ${M} »). Exemples réels : « This is **a animal** », « He is **a uncle** », « Who is **a entrepreneur** here? », « **a aunt** ». **18 fiches** sur les 695 sont touchées (5e, 4e, 3e, 2nde C, 1ère C-D, Terminale C-D). À corriger : choisir « a » ou « an » selon le mot.
2. **Genre incompatible.** La même consigne dit « He is a grandmother. / She is a uncle. » (7 fiches). Il faut proposer un pronom compatible avec le mot, ou « This person is a… ».
3. **Pluriels et mots non dénombrables** : la même consigne dit « This is a + mot » pour un objet, sans vérifier le nombre (à surveiller, par exemple « furniture », « news »).

### 3.2 🟠 IMPORTANT — Phrases « fausses » fabriquées par le logiciel

Pour les exercices vrai/faux, le logiciel change un mot du texte (`makeFalse`, `index.html:22987`). Exemple vu dans une fiche de 3e : « …the uncles had discussed the dowry **short** before the girl had given her own answer » (le texte disait « long before » ; « short before » n'est pas de l'anglais correct). Le logiciel avertit « Check them before the lesson », ce qui est honnête, mais l'enseignant peu à l'aise en anglais peut ne pas voir la faute. À corriger : ne remplacer que les mots dont le contraire est grammaticalement substituable, ou proposer l'énoncé faux sous forme de négation.

### 3.3 🟠 IMPORTANT — Mots de vocabulaire mal choisis

Les « mots de la séance » sont choisis automatiquement dans le texte. Les plus fréquents sur 370 fiches : *pupil* (31), *state* (31), *organise* (20), *class* (19), *cause* (19), *carry* (16), *clean* (15), *answer* (15), *teacher* (14), *short* (14). Pour une classe de 3e ou de Terminale, enseigner « pupil », « teacher », « answer » ou « cook » à propos d'un texte sur les mariages ou le commerce international est sans intérêt, alors que « dowry », « bride », « tariff », « protectionism » sont ignorés. Le tableau « Key idea » de l'activité semi-contrôlée reprend parfois des mots sans sens (« given », « families » comme « idées clés »).

### 3.4 🟠 IMPORTANT — Fautes recopiées des documents officiels

Les objectifs (« By the end of the session, learners will be able to… ») sont recopiés de la planification, avec ses coquilles et ses coupures de cellule. Exemples relevés (37 fiches ont des signes parasites) :

- « causes of drug**;** use by teenagers » (la cellule du tableau a été coupée en deux) ;
- « tell, ask and**;** write the date » ;
- « identify methods of food processing and preservation **-;** » et « reinforce grammatical notions**.;** » ;
- « explain **the the** concepts… », « give an opinion on **the The** Role of… », « strategic regional alliances **alliances** », « new vocabulary **vocabulary** », « the issues of **FMGs** » (pour FGMs), « African natural **ressources** » ;
- « use new vocabulary related ICTs » (il manque « to ») ;
- en 6e, trois fiches commencent par « learners will be able to **the learners will be able to** choose appropriate actions… » (`index.html:5158`, 5166, 5174 : la phrase recopiée contient déjà son début).

Ces défauts sont dans les données (`SEANCES_OFFICIELLES`). Une relecture unique de la liste réglerait tout.

### 3.5 🟢 SOUHAITABLE — Tournures maladroites

- Consignes de production : « find three different ways to talk about symptoms, transmission modes (Traditional medicine) » — un titre de séance est collé entre parenthèses à la fin d'une consigne, ce qui la rend peu naturelle.
- « Unit 3: : POLLUTION » (double deux-points, Terminale C-D, `index.html:3359`).
- En-tête de fiche : « Teacher not specified · 10 October 2026 » quand le nom est vide.
- Les mots anglais et français sont mélangés dans les fiches d'accompagnement (« La faute à attendre », « Ce qu'il faut faire ») : voulu, mais l'enseignant ne le sait pas.
- Le titre de la page indique « Lesson Plan Generator v2 » alors que la version est 13.36.

### 3.6 🟢 SOUHAITABLE — Devoirs hors sujet

- La séance de résolution de problème propose un devoir du type « Write a short dialogue using the expressions studied **today** » : « today » n'a pas de sens pour un exercice portant sur toute l'unité (`homeworkLine`, `index.html:20912`). Le devoir est déduit du premier thème reconnu dans le texte, pas de la séance.
- En 5e, plusieurs séances d'une même leçon reçoivent le même devoir mot pour mot.

---

## 4. Facilité d'utilisation pour un enseignant non technicien

### 4.1 🟠 IMPORTANT — Interface entièrement en anglais

Tous les libellés du formulaire sont en anglais : « Teacher and school », « Learning Session », « Unit / Theme », « Generate the plan », « View the plan », « Download for Word », « Edit the plan », « Teacher's sheet »… Seuls l'écran d'activation et la rubrique « Composition » sont en français. Le contenu des **fiches** doit rester en anglais (c'est le canevas officiel), mais **l'interface** peut être en français. Les messages d'erreur et d'information (« Storage is full — export your plans », « Plan saved on this device ») sont aussi en anglais.

### 4.2 🟠 IMPORTANT — Formulaire trop long

Sur téléphone (390 px), le formulaire fait 4 126 pixels de haut, soit environ cinq écrans. Il mélange des réglages de tous les jours (classe, unité, séance) et des réglages rares (barème de la rédaction, texte de composition, nombre d'items, numérotation des lignes, version « original » ou « longue » du texte…). Les sections avancées devraient être repliées par défaut.

### 4.3 🟠 IMPORTANT — Messages et boutons peu clairs

- « Dynamic lesson design », « Practice activities », « Scale to /20 », « Regenerate and discard my edits », « Composition — sujet d'évaluation » : des termes que l'enseignant ne comprend pas toujours.
- Le bouton **« Download for Word »** produit en réalité une page web renommée `.doc` (`downloadWord`, `index.html:31303`). Sur ordinateur, Word peut afficher un avertissement de format ; sur téléphone, beaucoup de lecteurs l'ouvrent mal. La voie « Imprimer → Enregistrer en PDF » est plus sûre.
- Le bouton « Save » crée une **nouvelle entrée à chaque appui** : enregistrer deux fois la même fiche en donne deux. Après 100 fiches, la plus ancienne disparaît (avec un message en anglais).
- Le choix du **trimestre** n'a aucun effet (voir 2.6).
- À l'activation, le bouton « Copier l'identifiant » a l'aspect brut du navigateur, différent des autres boutons ; l'écran affiche beaucoup de texte avant le bouton WhatsApp.

### 4.4 🟢 SOUHAITABLE — Autres frottements

- La date est préremplie avec la date du jour (pratique), mais le champ « Teacher » vide produit « Teacher not specified » sur la fiche.
- Aucun tutoriel ni exemple rempli à la première ouverture.
- Les fiches de 6e présentent des situations en français ; celles de 5e en anglais : voulu (modèle officiel), mais déroutant.
- La fiche d'accompagnement (« Teacher's sheet ») et la composition sont accessibles par des boutons sans explication.

---

## 5. Performance, sécurité et fiabilité

### 5.1 Performance — satisfaisante

| Mesure (navigateur de bureau) | Résultat |
|---|---|
| Chargement + première fiche | 0,2 s ; 0,8 s avec le processeur ralenti 4 fois ; 1,3 s ralenti 6 fois |
| Génération d'une fiche | 2 ms ; 21 ms ralenti 6 fois ; 20 ms au pire sur les 695 fiches |
| Mémoire | environ 11 Mo |
| Appels réseau | **aucun** (le lien WhatsApp mis à part) |

### 5.2 Fonctionnement hors connexion — conforme

Aucune ressource externe (ni police, ni script, ni image distante). L'application Android charge ses fichiers par une adresse interne (`MainActivity.java`, `WebViewAssetLoader`). Les fiches enregistrées, les préférences et les situations personnelles sont gardées dans la mémoire du navigateur (`localStorage`).

### 5.3 Licence et activation

**Ce qui fonctionne :** la vérification de signature (Ed25519) a été éprouvée avec des signatures neuves : 12 signatures valides acceptées, 12 messages falsifiés et 12 signatures altérées rejetés, environ 4 ms par vérification, sans dépendre du navigateur. Les messages d'erreur d'activation sont en français courant.

#### 🔴 URGENT — Le blocage est trivial à contourner
- Le dépôt GitHub est **public** (vérifié) : le logiciel complet, les APK de la rubrique « Releases » et les documents officiels y sont téléchargeables sans licence.
- La « porte » d'activation est l'élément `<div id="beeLicenseGate">` (`index.html:339`) fermé par un attribut `hidden` : il suffit de le retirer dans le navigateur, ou d'ouvrir `index.html` avec un éditeur, pour utiliser tout le logiciel. L'essai a été fait et il fonctionne.
- La vérification cryptographique est bonne, mais elle ne protège que contre la fabrication de faux codes, pas contre la copie du logiciel.

À décider : si la licence est une vraie source de revenu, rendre le dépôt privé (au minimum), distribuer l'APK par un autre canal, et accepter qu'une protection 100 % hors ligne ne soit jamais infaillible. Si elle est surtout un moyen de suivre les utilisateurs, l'état actuel peut convenir, mais il faut le savoir.

#### 🔴 URGENT — La licence peut être effacée à la moindre erreur
`beeCheckStoredLicense` (`index.html:981`) **supprime la licence enregistrée dès que la vérification échoue, quelle qu'en soit la raison** (identifiant différent, navigateur trop ancien, erreur passagère). L'enseignant retrouve l'écran d'activation et doit refaire une demande par WhatsApp. Il faudrait ne supprimer qu'en cas de signature réellement invalide, et sinon afficher un message « vérification impossible, réessayez ».

#### 🟠 IMPORTANT — Identifiant d'installation : risque de réactivation après mise à jour
- Le README dit que l'identifiant est stocké dans l'espace de l'application. Le code actuel fait l'inverse : sur Android, **c'est l'identifiant Android (`ANDROID_ID`) qui prime** (`MainActivity.java`, `stableDeviceId` ; `index.html:931`).
- Un enseignant activé avec une ancienne version (identifiant aléatoire) verra, après mise à jour vers une version utilisant l'identifiant Android, sa licence refusée **puis effacée en silence** (point précédent).
- Sur Android 8 et plus, `ANDROID_ID` dépend aussi de la clé de signature : un APK signé avec la clé de débogage (anciennes versions, `build-apk.yml`) et un APK signé avec la clé permanente n'ont pas le même identifiant.
- Sur ordinateur, l'identifiant dépend du navigateur : changer de navigateur, vider les données ou utiliser la navigation privée demande une nouvelle activation.

Il faudrait un message clair « Cet appareil a changé : envoyez ce nouvel identifiant » et une procédure de migration documentée.

#### 🟢 SOUHAITABLE
- Le numéro WhatsApp est écrit en dur dans le code (`index.html:1016`) : le changer oblige à republier tout le logiciel.
- Aucune date d'expiration, aucune révocation possible (la licence est « permanente » par conception).
- Le message d'activation dit « je viens d'acheter » : il ne convient pas aux licences gratuites ou d'essai.

### 5.4 Sauvegarde et perte de données

- 🔴 **URGENT — Export sur Android 6 à 9 (à vérifier sur appareil).** `MainActivity.writeToDownloads` écrit directement dans le dossier Téléchargements pour Android 9 et avant, mais **le code ne demande jamais l'autorisation d'écriture** à l'utilisateur, alors qu'elle est obligatoire depuis Android 6 pour une application visant l'API 34. Sur ces téléphones, « Export all plans » et « Download for Word » devraient échouer avec « Échec de l'enregistrement » (message « Permission denied »). Or l'export est **la seule sauvegarde** des fiches. Android 10 et plus passent par `MediaStore` et ne sont pas concernés.
- 🟠 **IMPORTANT — Aucune sauvegarde automatique ni rappel.** Les fiches disparaissent si l'enseignant efface les données de l'application ou la désinstalle (la note « Comment vos données sont-elles traitées ? » le dit, mais personne ne la lit). Il faudrait un rappel après N enregistrements (« Pensez à exporter vos fiches ») et une exportation en un geste.
- 🟠 **IMPORTANT — Export et blob.** Le fichier exporté est un `blob:` révoqué 1,5 s après le clic (`index.html:31176`, `31303`). Sur un téléphone lent, l'application Android lit le blob après coup ; si le délai est dépassé, rien n'est enregistré et **aucun message d'erreur n'apparaît** (le script d'enregistrement n'a pas de gestion d'échec, `MainActivity.blobToBase64Script`).
- 🟢 **SOUHAITABLE — Import de fichier abîmé.** Un fichier d'export incomplet (sans la rubrique `params.w`) est accepté, puis le bouton « Open » ne fait rien (erreur silencieuse « Cannot read properties of undefined (reading 'relevance') », `index.html:31115`). La validation d'import ne contrôle que la classe.
- 🟢 Le stockage navigateur est limité (environ 5 Mo) : 100 fiches modifiées à la main (chacune enregistre son HTML) peuvent le dépasser ; le message « Storage is full » existe mais en anglais.

### 5.5 Sécurité du contenu importé ou collé — correcte

- Un texte collé contenant `<img onerror>`, `<script>` ou `onmouseover` ne s'exécute pas (échappement testé).
- Un fichier d'import contenant un nom malveillant, un `<script>` ou un `onclick` est nettoyé (`sanitizePlanHtml`).
- Les liens externes sortent de l'application (WhatsApp).

### 5.6 Application Android — points techniques

- 🟠 **Anciens téléphones et navigateurs.** Le logiciel utilise des fonctions récentes de JavaScript : chaînage optionnel `?.` (89 usages, WebView/Chrome 80 minimum), nombres `BigInt` (Chrome 67) et expression régulière « lookbehind » (`index.html:24722`, `25346`), qui **empêche l'ouverture sous Safari/iPhone antérieurs à iOS 16.4**. L'écran d'activation propose pourtant « Sur iPhone comme sur Android ». Sur un navigateur trop ancien, la page reste **blanche, sans message**. Le README annonce Android 5 minimum ; en pratique il faut une WebView à jour. Prévoir un message « Mettez à jour Android System WebView / votre navigateur » (par un petit script qui ne contient aucune de ces syntaxes).
- 🟢 La permission `INTERNET` est déclarée (`AndroidManifest.xml`) alors que l'application n'en a pas besoin. La retirer renforcerait la promesse « fonctionne sans connexion ».
- 🟢 `allowBackup="true"` : la sauvegarde automatique Android peut restaurer des données sur un autre téléphone dont l'identifiant diffère ; sans conséquence grave mais à décider.
- 🟢 Pas de validation du nom de fichier proposé par la page avant écriture sous Android 9 et avant (`new File(dir, name)`). Risque faible (la page est locale), mais à nettoyer.
- 🟢 `minifyEnabled false`, aucun test automatique, aucune vérification de la syntaxe du fichier HTML avant publication.

### 5.7 Compilation automatique (GitHub Actions)

- 🟠 `.github/workflows/main.yml` **échoue** si les secrets `BEE_KEYSTORE_*` sont absents ou tronqués (message explicite, c'est bien) ; chaque envoi sur `main` crée une publication `v<numéro d'exécution>` : une relance du même numéro échoue (la publication existe déjà).
- 🟠 Le dossier **`.github/workflows/.github/workflows/build-apk.yml`** est mal placé : GitHub ne l'exécute jamais. C'est l'ancienne version (APK « debug »). À supprimer pour éviter la confusion.
- 🟢 Le numéro de version est à changer à la main à trois endroits : `app/build.gradle`, l'étiquette dans `index.html` (« version 13.36 ») et le titre de page.

### 5.8 Mise à jour des utilisateurs

Il n'existe aucun moyen de prévenir l'enseignant qu'une nouvelle version existe. Les corrections de ce rapport n'arriveraient qu'à ceux qui reçoivent le nouvel APK (par WhatsApp, selon le README).

### 5.9 Trois copies du logiciel

`index.html`, `app/src/index.html` et `app/src/main/assets/index.html` sont **identiques octet pour octet** aujourd'hui (même empreinte). Seule la dernière est compilée. Modifier la mauvaise copie n'aurait aucun effet visible. Ne garder qu'une copie (ou faire copier automatiquement par la compilation).

### 5.10 README partiellement périmé

Le README dit « APK signé avec la clé de debug » (faux depuis la clé permanente), « l'identifiant est dans l'espace de l'application » (faux sur Android, voir 5.3) et ne parle ni des documents officiels ni de la clé permanente. Il cite « v13 » et non 13.36.

### 5.11 Auteur affiché sur chaque fiche

Chaque fiche imprimée porte « Curriculum designer: Tidiani BARRY, Inspecteur de l'Enseignement secondaire » (`index.html:31011`) sans paramètre pour le changer. À confirmer avec l'intéressé, et prévoir un champ modifiable ou facultatif.

---

## 6. Bugs de fond, par ordre d'importance (récapitulatif technique)

| # | Priorité | Où | Problème |
|---|---|---|---|
| 1 | 🔴 | `index.html:25575-25590` | « a » devant voyelle, genre incompatible (18 + 7 fiches) |
| 2 | 🔴 | `index.html:6732`, `12640` | Fourchettes de mots / longueurs de rédaction fausses pour 2nde C et Terminale C-D ; compteur de mots trompeur |
| 3 | 🔴 | `index.html:981` | Licence effacée à la moindre erreur de vérification |
| 4 | 🔴 | `MainActivity.java` (`writeToDownloads`) | Export impossible sur Android 6–9 faute de demande d'autorisation (à confirmer) |
| 5 | 🟠 | `index.html:30413`, `30311-30440` | Composition : la rédaction reprend l'unité/leçon du formulaire et la compétence « Speaking » (peut dire « prepare a spoken production » pour un examen écrit), n'a souvent que 2 consignes, mais parle de « trois consignes » ; énoncé sans rapport avec le texte collé |
| 6 | 🟠 | `index.html:29999` | Grille : le point de grammaire est le même pour toutes les consignes (« the verb be… » noté même pour « give orders ») ; avec 2 consignes les points deviennent 0,75 ou 2,25 |
| 7 | 🟠 | `index.html:29872` | 15 situations d'intégration n'ont qu'une consigne, 46 en ont deux |
| 8 | 🟠 | `index.html:20912` | Devoirs hors sujet ou identiques ; devoir « today » dans une résolution de problème |
| 9 | 🟠 | `index.html:22987` | Énoncés « faux » parfois agrammaticaux |
| 10 | 🟠 | `SEANCES_OFFICIELLES` | Coquilles et signes parasites recopiés du document officiel (37 fiches) |
| 11 | 🟠 | `index.html:13170` et autres | « he » génériques |
| 12 | 🟠 | `index.html:12848` | Sélecteur de trimestre sans effet réel |
| 13 | 🟢 | `index.html:31115`, `31201` | Import abîmé : erreur silencieuse à l'ouverture |
| 14 | 🟢 | `index.html:31091` | Doublons à chaque « Save » |
| 15 | 🟢 | `index.html:3359` | « Unit 3: : POLLUTION » |

---

## 7. Propositions d'amélioration et nouvelles fonctions

**Pour l'enseignant**

1. **Interface en français** (avec les fiches en anglais) et mode « Simple / Avancé » : par défaut classe, unité, séance, bouton « Créer la fiche ».
2. **Assistant en trois étapes** : « Ma classe » → « Ma leçon » → « Ma fiche », au lieu d'un formulaire de cinq écrans.
3. **Sauvegarde en un geste** (« Sauvegarder mes fiches ») avec rappel mensuel, et partage direct par WhatsApp du fichier de sauvegarde.
4. **Export PDF** proposé en premier, au lieu du faux fichier Word ; vrai fichier `.docx` en option.
5. **Mode « fiche de classe »** à imprimer sur une page : situation, consignes, grille, sans le détail pédagogique.
6. **Vérificateur de texte** : l'enseignant colle un texte, le logiciel compte les mots, signale la fourchette officielle de la classe, repère les « he » génériques et les mots rares.
7. **Banque de textes inédits** pour la composition (avec source), puisque les textes d'étude ne conviennent pas (instructions : inédit, ni annales, ni Wikipédia, ni IA).
8. **Choix du devoir** : liste de trois devoirs possibles (sans production) plutôt qu'un seul imposé.
9. **Emploi du temps de l'unité** : le calendrier mensuel officiel (12 h, 9 h, 6 h, 16 h, 8 h) avec les dates réelles.
10. **Fiche de remédiation et d'évaluation** (le guide les prévoit : 2 h d'évaluation, 2 h de remédiation par unité) : aujourd'hui absentes du logiciel.

**Pour le qualité pédagogique**

11. **Relecture du contenu par un anglophone** (fautes des points 3.1 à 3.5) et liste de mots clés choisie à la main pour chaque séance, ou au moins filtrée par niveau (ne pas enseigner « teacher » en 3e).
12. **Écran d'« inspection »** : un bouton qui vérifie la fiche avant impression (longueur du texte, grille seulement en résolution de problème, trois consignes, pas de « he » générique).
13. **Tests automatiques** à chaque envoi sur GitHub : génération des 695 fiches, détection d'erreurs de programme, de « a + voyelle », de « he » générique, longueur des textes. Les contrôles utilisés pour ce rapport peuvent servir de base.

**Pour la solidité**

14. Garder **une seule copie** de `index.html` et un seul fichier de compilation.
15. Message clair pour les **navigateurs trop anciens**.
16. Mise à jour de la licence : messages de migration, ne jamais effacer sans confirmation.
17. Mécanisme de **vérification de nouvelle version** (hors ligne par défaut, vérification manuelle quand la connexion est disponible).

---

## 8. Les dix actions les plus utiles à faire en premier

| Rang | Action | Priorité | Pourquoi |
|---|---|---|---|
| 1 | **Corriger « a/an » et le genre** dans la consigne de vocabulaire (`index.html:25575`) | 🔴 | Faute d'anglais visible sur 25 fiches, dans un logiciel destiné à enseigner l'anglais. Correction de quelques lignes. |
| 2 | **Mettre à jour les fourchettes de mots** de la 2nde C (350–400) et de la Terminale C-D (350–400), et les longueurs de rédaction (120 mots) | 🔴 | Le compteur de mots donne un faux « OK ». |
| 3 | **Ne plus effacer la licence** sur simple échec de vérification ; afficher un message de ré-essai | 🔴 | Un enseignant activé peut perdre l'accès sans comprendre pourquoi. |
| 4 | **Tester l'export de fichiers sur un téléphone Android 8 ou 9** et ajouter la demande d'autorisation si besoin | 🔴 | L'export est la seule sauvegarde des fiches. |
| 5 | **Trancher le sort de la production dans les séances d'apprentissage** (devoir rédigé, « Guided paragraph writing ») avec l'inspecteur, puis l'aligner | 🟠 | Règle pédagogique centrale, 350 fiches concernées. |
| 6 | **Remplacer les « he » génériques** (liste du point 2.5) | 🟠 | Règle d'écriture inclusive demandée. |
| 7 | **Corriger les textes copiés de la planification** (coquilles, « ; », doublons « the the ») et recoller les cellules coupées | 🟠 | Objectifs visibles en tête de chaque fiche. |
| 8 | **Garantir trois consignes** en composition et en résolution de problème, et afficher les quatre constituants sur la fiche imprimée | 🟠 | Exigence des instructions BEPC/bac et du guide. |
| 9 | **Passer l'interface en français** et replier les réglages avancés | 🟠 | C'est ce qui décide si l'enseignant utilisera le logiciel. |
| 10 | **Décider de la protection de la licence** (dépôt privé ou non, contournement de la « porte »), puis **nettoyer le dépôt** : une seule copie de `index.html`, supprimer le dossier de compilation mal placé, mettre à jour le README | 🟠 | Protéger le travail et éviter les erreurs de publication. |

---

## Annexe — Chiffres utiles

| Donnée | Valeur |
|---|---|
| Classes | 10 (6e, 5e, 4e, 3e, 2nde A, 1ère A, Terminale A, 2nde C, 1ère C-D, Terminale C-D) |
| Séances d'apprentissage dans la base | 463 (6e : 93, 5e : 93, 4e : 33, 3e : 33, 2nde A : 33, 1ère A : 33, Terminale A : 52, 2nde C : 31, 1ère C-D : 31, Terminale C-D : 31) |
| Fiches générées pour l'analyse | 695 (463 + 155 + 77), 0 erreur de programme |
| Taille de `index.html` | 2 671 179 octets, 31 531 lignes |
| Textes de la base | 6e–5e : 50 à 136 mots ; 4e–3e : 130 à 207 ; second cycle (version « longue ») : 303 à 510 |
| Documents officiels lus | 2 guides des curricula, 2 planifications détaillées, instructions BEPC (scan, 3 pages), instructions bac (3 pages) |
