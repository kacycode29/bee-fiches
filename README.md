# BEE Fiches — application Android

Projet Android complet qui embarque le *Burkina English Express — Lesson Plan
Generator* (v13) dans une application native, **entièrement hors ligne**.

La compilation se fait automatiquement sur GitHub : vous n'avez **rien à
installer** sur votre ordinateur.

---

## Étape 1 — Créer un dépôt GitHub

1. Créez un compte gratuit sur <https://github.com> si vous n'en avez pas.
2. Cliquez sur **+** (en haut à droite) → **New repository**.
3. Donnez-lui un nom, par exemple `bee-fiches`.
4. Laissez **Public** (ou choisissez Private, cela fonctionne aussi).
5. **N'ajoutez pas** de README ni de .gitignore — le dossier en contient déjà.
6. Cliquez sur **Create repository**.

## Étape 2 — Envoyer les fichiers

Sur la page du dépôt vide, cliquez sur **uploading an existing file**, puis
faites glisser **tout le contenu de ce dossier** (pas le dossier lui-même :
les fichiers `gradlew`, `settings.gradle`, et les dossiers `app/`, `gradle/`,
`.github/`).

> Le dossier `.github` est masqué sur certains systèmes. Sous Windows :
> onglet *Affichage* → cocher *Éléments masqués*. Sous macOS : `Cmd + Shift + .`
> S'il ne part pas, utilisez plutôt GitHub Desktop, ou dites-le-moi et je vous
> donne les commandes `git`.

Cliquez ensuite sur **Commit changes**.

## Étape 3 — Récupérer l'APK

1. Ouvrez l'onglet **Actions** du dépôt. Une compilation démarre toute seule.
2. Attendez le ✅ vert (environ 3 à 5 minutes la première fois).
3. Allez dans l'onglet **Releases** (colonne de droite de la page d'accueil du
   dépôt) : le fichier `.apk` s'y trouve, prêt à télécharger.

   *Il est aussi disponible dans Actions → la compilation → section
   **Artifacts** (là, c'est un fichier .zip à décompresser).*

## Étape 4 — Installer sur Android

Ouvrez le fichier `.apk` sur le téléphone. Android demandera d'autoriser
l'installation d'applications « de sources inconnues » : acceptez pour votre
navigateur ou votre gestionnaire de fichiers.

L'APK se partage ensuite librement : WhatsApp, Bluetooth, clé USB, carte SD.

---

## Points importants propres à BEE

### 1. L'activation de l'application est distincte de celle du navigateur

L'identifiant d'installation (`bee.installation.id.v2`) est stocké dans
l'espace de l'application. L'application est donc, du point de vue de votre
système de licence, **un appareil neuf** :

- un enseignant déjà activé dans son navigateur devra **demander un nouveau
  code d'autorisation** pour l'application ;
- si l'enseignant désinstalle l'application ou efface ses données
  (*Paramètres → Applications → BEE Fiches → Stockage → Effacer les données*),
  l'identifiant est perdu et une **réactivation** est nécessaire.

Le bouton « Ouvrir WhatsApp avec ma demande » fonctionne dans l'application :
il ouvre WhatsApp avec l'identifiant d'installation déjà rempli.

### 2. Compatibilité des anciens appareils — réglée

La vérification de signature repose sur Ed25519, que `crypto.subtle` ne propose
qu'à partir d'**Android System WebView / Chrome 137** (mai 2025). Sur un
téléphone plus ancien, l'activation aurait échoué avec « signature invalide »
alors que le code fourni était correct.

Le fichier embarque désormais une **vérification Ed25519 en JavaScript pur**
(`window.BEE_ED25519`, insérée juste avant le script principal) :

- si le WebView sait faire Ed25519, c'est lui qui vérifie, comme avant ;
- sinon, le repli prend le relais automatiquement, sans message ni réglage.

La clé publique BEE, le format des codes d'autorisation et toute la logique de
licence sont **inchangés** : les codes déjà émis restent valables. La seule
modification du code d'origine est le remplacement de l'appel direct à
`crypto.subtle` par la fonction `beeEd25519Verify`, qui essaie les deux
chemins. Une vérification par le repli prend environ 2 ms.

Ce repli sert aussi à la **version navigateur** du logiciel : le même fichier
fonctionne sur les ordinateurs anciens, et même ouvert directement depuis une
clé USB (`file://`), où `crypto.subtle` est indisponible.

### 3. Ce qui a été vérifié

Le fichier a été chargé dans Chromium dans les conditions de l'application
(origine sécurisée, écran de 390 px) :

- aucune erreur JavaScript au chargement ;
- portail d'activation affiché et mise en page mobile correcte ;
- identifiant d'installation généré et conservé ;
- activation testée de bout en bout avec un vrai couple de clés Ed25519 :
  code valide accepté par le chemin natif **et** par le repli, signature
  falsifiée rejetée, code destiné à un autre appareil rejeté ;
- vérification Ed25519 du repli contrôlée sur 40 signatures de référence
  produites par une implémentation éprouvée, et 160 tentatives de falsification
  toutes rejetées ;
- aucune ressource externe : le logiciel est complètement autonome
  (seul le lien WhatsApp sort de l'application, et il s'ouvre dans WhatsApp).

### 4. Fonctions du générateur dans l'application

| Fonction du logiciel | Comportement dans l'APK |
|---|---|
| **Print / Imprimer** | Ouvre le service d'impression Android → « Enregistrer au format PDF » |
| **Export `.doc`** | Enregistré dans le dossier *Téléchargements* sous son vrai nom |
| **Export de la bibliothèque `.json`** | Idem, `bee-plans-AAAA-MM-JJ.json` |
| **Import d'un `.json`** | Ouvre le sélecteur de fichiers du téléphone |
| **Copier vers le presse-papiers** | Fonctionne (repli automatique en texte brut) |
| **Plans enregistrés, préférences** | Conservés sur l'appareil entre deux ouvertures |

---

## Personnalisation

| Ce que vous voulez changer | Où |
|---|---|
| Le logiciel lui-même (nouvelle version v14, v15…) | remplacer `app/src/main/assets/index.html` |
| Le nom affiché sous l'icône | `app/src/main/res/values/strings.xml` |
| Le numéro de version | `app/build.gradle` → `versionName` / `versionCode` (à incrémenter à chaque nouvelle version) |
| L'identifiant unique de l'app | `app/build.gradle` → `applicationId` |
| L'icône | `app/src/main/res/mipmap-*/ic_launcher.png` |
| La couleur de fond de l'icône | `app/src/main/res/values/colors.xml` |

Chaque fois que vous modifiez un fichier sur GitHub et validez (*Commit*), une
nouvelle version de l'APK est construite automatiquement.

### Plusieurs fichiers

Si votre logiciel comporte plusieurs pages, images, feuilles de style ou
polices, placez-les tous dans `app/src/main/assets/`, en conservant la même
structure de dossiers. La page de démarrage doit s'appeler `index.html`.

---

## Ce que l'application gère

- **Hors ligne complet** — aucune connexion requise.
- **Stockage local** (`localStorage`, `IndexedDB`) — les données saisies sont
  conservées d'une session à l'autre. Le contenu est servi via une véritable
  origine HTTPS interne, ce qui évite les blocages habituels des WebView.
- **Impression et PDF** — un appel `window.print()` dans votre page ouvre le
  service d'impression Android, qui propose « Enregistrer au format PDF ».
- **Téléchargements** — les fichiers générés par la page (`blob:`, `data:`,
  liens `download`) sont enregistrés dans le dossier *Téléchargements*.
- **Import de fichiers** — les champs `<input type="file">` ouvrent le
  sélecteur de fichiers du téléphone.
- **Bouton retour** — revient à la page précédente avant de quitter l'app.
- **Liens externes** — s'ouvrent dans le navigateur, l'application reste
  sur son contenu.

## Détails techniques

- Android 5.0 (API 21) minimum — couvre plus de 99 % des appareils en service.
- `compileSdk` / `targetSdk` 34, Java 17, Gradle 8.7, AGP 8.5.2.
- L'APK produit est signé avec la clé de *debug* : installable et partageable
  sans restriction, mais pas publiable sur le Play Store. Pour une publication
  sur le Store, il faut une clé de signature personnelle — demandez-moi et
  j'ajoute cette configuration.
