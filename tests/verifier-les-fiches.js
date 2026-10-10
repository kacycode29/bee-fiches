/* Contrôles automatiques sur toutes les fiches générées par tests/generer-toutes-les-fiches.js.
   Utilisation :  node tests/verifier-les-fiches.js fiches-generees.json [racine-du-depot]
   Code de sortie 0 si tout est conforme, 1 sinon. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const d = JSON.parse(fs.readFileSync(path.resolve(process.argv[2] || 'fiches-generees.json'), 'utf8'));
const racine = path.resolve(process.argv[3] || '.');
const bilan = [];
const controle = (nom, cas, detail) => {
  bilan.push({ nom, cas });
  console.log((cas.length ? 'ECHEC ' : 'OK    ') + nom + (cas.length ? `  (${cas.length} cas)` : ''));
  cas.slice(0, 8).forEach(x => console.log("        - " + x));
  if (detail) console.log('        ' + detail);
};
const apprentissage = d.fiches.filter(f => f.type === 'Learning Session');
const consolidation = d.fiches.filter(f => f.type === 'Consolidation Session');
const resolution = d.fiches.filter(f => f.type === 'Problem-Solving Session');
const secondaire = ['2nde A', '1ere A', 'Terminale A', '2nde C', '1ere C-D', 'Terminale C-D'];
const postPrimaire = ['6e', '5e', '4e', '3e'];
const nomFiche = f => `${f.c} | ${f.uid}${f.lesson ? ' | ' + f.lesson : ''}${f.session ? ' | ' + f.session : ''}`;
console.log(`Fiches : ${d.fiches.length} (${apprentissage.length} apprentissage, ${consolidation.length} consolidation, ${resolution.length} résolution de problème)\n`);

/* 1. Aucune erreur de programme */
controle('Aucune erreur de programme à la génération', [
  ...d.erreurs.map(e => `${e.c} ${e.type} ${e.uid}: ${String(e.erreur).split('\n')[0]}`),
  ...(d.erreursPage || []).map(e => 'page: ' + e),
  ...d.compositions.filter(c => c.erreur).map(c => `composition ${c.c} ${c.uid} en erreur`)
]);

/* 2. Articles « a / an » */
const MOTS_FR = /\b(le|la|les|des|du|une|un|est|sont|qui|que|pour|dans|avec|ce|cette|ils|elles|il|elle|son|sa|ses|mais|donc|pas|sur|aux|au|ou|où|et|en|ne|se|nous|vous|on|à|ça|faut|peut|quand|comme)\b/i;
const A_SONORE_CONSONNE = /^(uni|use|usu|usi|uti|uro|uri|euro|one$|once$|ubi|eu|ewe|u-|u\.)/i;
const AN_SONORE_VOYELLE = /^(hour|honest|honou?r|heir|x-ray|[fhlmnrsx]{2,}$|[A-Z]{2,}s?$)/;
function controleArticles(texte, nom, sortie) {
  texte.replace(/\s+/g, ' ').split(/(?<=[.!?”"])\s+/).forEach(phrase => {
    if (MOTS_FR.test(phrase)) return;                 /* phrase en français : « a » est alors le verbe avoir */
    for (const m of phrase.matchAll(/(?<![-–·\d])\b(a|an)\s+([a-z][A-Za-z'’-]*)/g)) {
      const art = m[1], mot = m[2];
      if (/^(and|or|introduces|correctly|before|with|is|are|for|then|but|the|in|to|of)$/.test(mot)) continue;   /* « a » et « an » cités comme mots dans une règle de grammaire */
      if (art === 'a' && /^[AEIOUaeiou]/.test(mot) && !A_SONORE_CONSONNE.test(mot) && !/^[A-Z]{2,}/.test(mot)) sortie.add(`${nom}: « a ${mot} »`);
      if (art === 'an' && /^[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]/.test(mot) && !AN_SONORE_VOYELLE.test(mot) && !/^[A-Z]{2,}/.test(mot)) sortie.add(`${nom}: « an ${mot} »`);
      if (art === 'a' && /^[A-Z]{2,}/.test(mot) && /^(FM|HR|HIV|LCD|MP|NGO|SMS|SIM|SNC|STD|X)/.test(mot)) sortie.add(`${nom}: « a ${mot} »`);
    }
  });
}
const articles = new Set();
for (const f of d.fiches) {
  controleArticles(f.texte, nomFiche(f), articles);
  controleArticles(String(f.fiche || '').replace(/<[^>]+>/g, ' '), nomFiche(f) + ' (fiche d\'accompagnement)', articles);
}
d.compositions.forEach(c => controleArticles(c.texte || '', `composition ${c.c} ${c.uid}`, articles));
controle('Aucun « a » devant une voyelle (ni « an » devant une consonne)', [...articles]);

/* 3. « he » génériques */
const NOMS = 'Salif|Karim|Ibrahim|Lassané|Rasmané|Abdoulaye|Hervé|Arnaud|Boukary|Issouf|Issaka|Madi|Awa|Ali|Moussa|Zounouon|Amza|Madou|Oumar|Noaga|Adama|Ousmane|Salam|Souleymane|Mr|Aminata|Fatou';
const ROLES = 'pupil|student|learner|child|citizen|person|user|consumer|entrepreneur|employee|teenager|adolescent|mediator|player|reader|writer|speaker|listener|trader|farmer|worker|member|candidate|patient|customer|young person|individual|producer|sender|author|traveller|driver|visitor|neighbour|friend|teacher|doctor|nurse|officer|leader|official|parent|voter|taxpayer|investor|buyer|seller|beneficiary|victim|offender|manager|owner|boss|head teacher|pen friend|tourist|newcomer|stranger|guide|artist|healer|judge|lawyer|pharmacist';
const ANTECEDENT = [new RegExp('\\b(a|an|each|every|any|one|no)\\s+(?:[a-z-]+\\s+){0,2}(' + ROLES + ')\\b', 'i'),
  /\bthe\s+(?:[a-z-]+\s+)?(entrepreneur|employee|consumer|user|citizen|person|mediator|learner|pupil|player|reader|writer|speaker|teenager|worker|trader|farmer|investor|patient|customer|candidate|individual)\b/i,
  /\b(nobody|everybody|everyone|someone|somebody|anyone|whoever|no one)\b/i];
/* Personnages précis, relus à la main : un pronom masculin y désigne une personne déterminée (lecteur, mandataire, personnage d'un récit…). */
const PERSONNAGES = [/The president of the court/, /A young man who/, /young man/, /Her brother/, /The officer/, /small boy/, /Point at a picture of a man/, /A visitor arrives/,
  /The author explains that the agent/, /the counsellor/i, /The mediator asked/, /Listen: he (WONDERS|REPORTED|IS|FOUGHT)/, /someone who has gone abroad/, /someone here who did not give up/,
  /A man arrives/, /the pupil .* knocked down/, /He reminded the class/, /a friend of his\/mine/, /He teacher/, /egg incubators/, /Amza/, /somebody asked who had encouraged him/i,
  /Nobody had ever let him/, /Somebody asked who had encouraged him/, /has got to (find|pay)|ought to keep a notebook|His prices are to be fixed|has got to answer/,
  /He had completed his studies in agriculture/, /looking for someone who could tell him the truth/, /I heard him explain/, /He succeeded to create his business/,
  /He explains that in one season/, /what is reproached to him/, /“He (encouraged|said)/];
function heGeneriques(texte, nom, sortie) {
  const re = /\b(he|his|him|himself)\b/gi; let m;
  while ((m = re.exec(texte))) {
    const apres = texte.slice(m.index + m[0].length, m.index + m[0].length + 14).toLowerCase();
    const avant = texte.slice(Math.max(0, m.index - 14), m.index).toLowerCase();
    if (/^\s*(or|\/)\s*(she|her|herself)\b/.test(apres) || /(she|her|herself)\s*(or|\/)\s*$/.test(avant)) continue;
    if (/\b(or|and)\s+(she|her|herself)\b|\b[Ss]he\b/.test(texte.slice(m.index, m.index + 80))) continue;
    const fenetre = texte.slice(Math.max(0, m.index - 160), m.index);
    const hit = ANTECEDENT.map(r => r.exec(fenetre)).find(Boolean);
    if (!hit) continue;
    const reste = fenetre.slice(hit.index + hit[0].length).replace(/(^|[.!?]\s+)[A-Z]/g, '$1x');
    if (/(?<![.!?]\s)\b[A-ZÉ][a-zéèëï]{2,}\b/.test(reste.replace(/^\s+/, ''))) continue;
    const ctx = texte.slice(Math.max(0, m.index - 100), m.index + 50).replace(/\s+/g, ' ');
    const large = texte.slice(Math.max(0, m.index - 260), m.index + 50).replace(/\s+/g, ' ');
    if (new RegExp('(?<![A-Za-zÀ-ÿ])(' + NOMS + ')(?![A-Za-zÀ-ÿ])').test(large)) continue;
    if (PERSONNAGES.some(p => p.test(ctx))) continue;
    sortie.add(`${nom}: …${ctx}…`);
  }
}
const generiques = new Set();
for (const f of d.fiches) {
  heGeneriques(f.texte, nomFiche(f), generiques);
  heGeneriques(String(f.fiche || '').replace(/<[^>]+>/g, ' '), nomFiche(f) + ' (accompagnement)', generiques);
}
d.compositions.forEach(c => heGeneriques(c.texte || '', `composition ${c.c} ${c.uid}`, generiques));
controle('Aucun « he / his / him / himself » générique (hors personnages précis relus à la main)', [...generiques]);

/* 4. Longueur des textes supports du second cycle : fourchettes de la planification d'octobre 2025 */
const OFFICIELLE = { '2nde A': [300, 350], '1ere A': [350, 400], 'Terminale A': [400, 450], '2nde C': [350, 400], '1ere C-D': [350, 400], 'Terminale C-D': [350, 400] };
const PRODUCTION = { '2nde A': 'about 100 words', '1ere A': 'about 120 words', 'Terminale A': 'about 150 words', '2nde C': 'about 120 words', '1ere C-D': 'about 120 words', 'Terminale C-D': 'about 120 words' };
const mots = t => (String(t || '').match(/[A-Za-zÀ-ÿ0-9]+(?:['’-][A-Za-zÀ-ÿ0-9]+)*/g) || []).length;
const hors = [];
let nbTextes = 0;
for (const f of apprentissage.filter(f => OFFICIELLE[f.c])) {
  nbTextes++;
  const n = mots(f.support), [lo, hi] = OFFICIELLE[f.c];
  if (n < lo || n > hi) hors.push(`${nomFiche(f)}: ${n} mots (attendu ${lo}-${hi})`);
}
controle(`Textes supports du second cycle dans la fourchette officielle (${nbTextes} séances)`, hors);
controle('Fourchettes et longueurs de production du logiciel = planification d\'octobre 2025', [
  ...secondaire.filter(c => JSON.stringify(d.plages[c].lecture) !== JSON.stringify(OFFICIELLE[c])).map(c => `${c}: lecture ${JSON.stringify(d.plages[c].lecture)} au lieu de ${JSON.stringify(OFFICIELLE[c])}`),
  ...secondaire.filter(c => d.plages[c].production !== PRODUCTION[c]).map(c => `${c}: production « ${d.plages[c].production} » au lieu de « ${PRODUCTION[c]} »`)
]);

/* 5. Trois consignes dans chaque situation d'intégration et dans la composition */
controle('Trois consignes dans chaque situation d\'intégration', resolution.filter(f => f.consignes.length !== 3).map(f => `${nomFiche(f)}: ${f.consignes.length} consigne(s)`));
controle('Trois consignes (et trois points de grammaire) dans chaque composition', d.compositions.filter(c => !c.consignes || c.consignes.length !== 3 || !c.grammaires || c.grammaires.length !== 3).map(c => `${c.c} ${c.uid}`),
  `${d.compositions.length} compositions essayées (10 classes, toutes les unités)`);
controle('Chaque consigne est notée avec son propre point de grammaire (grille)', resolution.filter(f => !f.grille || f.grille.grammaires.length !== 3 || f.grille.grammaires.some(g => !g)).map(nomFiche));
controle('Deux consignes d\'une même situation ne demandent pas la même chose', resolution.filter(f => new Set(f.consignes.map(c => c.replace(/^\w+ \w+ (sentences|different ways) to /, '').toLowerCase())).size !== f.consignes.length).map(nomFiche));

/* 6. Grille critériée : seulement en résolution de problème, totaux justes */
controle('Aucune grille ni feuille de notes dans les séances d\'apprentissage et de consolidation', [...apprentissage, ...consolidation].filter(f => f.aGrille || f.aFeuilleDeNotes).map(nomFiche));
controle('Une grille dans chaque résolution de problème', resolution.filter(f => !f.aGrille || !f.aFeuilleDeNotes).map(nomFiche));
const totauxFaux = [];
for (const f of resolution) {
  const g = f.grille;
  if (!g) continue;
  const attendu = [3, 6, 9, 2];
  g.sommes.forEach((s, k) => { if (Math.abs(s - attendu[k]) > 1e-9 || Math.abs(g.totaux[k] - attendu[k]) > 1e-9) totauxFaux.push(`${nomFiche(f)}: colonne ${k + 1} somme ${s} / total ${g.totaux[k]}`); });
  if (g.marque !== 20) totauxFaux.push(`${nomFiche(f)}: note sur ${g.marque}`);
}
controle('Totaux de la grille justes (3 / 6 / 9 / 2 = 20)', totauxFaux);
controle('Totaux justes aussi avec d\'autres barèmes (' + d.grillesPerso.length + ' grilles essayées)', d.grillesPerso.filter(g => g.erreur || g.sommes.some((s, k) => Math.abs(s - g.bareme[k]) > 1e-9) || g.totaux.some((t, k) => Math.abs(t - g.bareme[k]) > 1e-9)).map(g => `${g.c} ${g.uid} ${g.bareme}: ${g.erreur || g.sommes + ' / ' + g.totaux}`));

/* 7. Rythme des situations d'intégration */
const rythme = [];
for (const c of Object.keys(d.rythme)) {
  const r = d.rythme[c], n = r.unites.length;
  const attendu = postPrimaire.includes(c) ? r.unites.map(u => [u]) : Array.from({ length: Math.ceil(n / 2) }, (_, i) => r.unites.slice(2 * i, 2 * i + 2));
  if (JSON.stringify(r.groupes) !== JSON.stringify(attendu)) rythme.push(`${c}: groupes ${JSON.stringify(r.groupes)}`);
  if (r.progression.length !== attendu.length) rythme.push(`${c}: ${r.progression.length} situations dans la progression au lieu de ${attendu.length}`);
  const nbFiches = resolution.filter(f => f.c === c).length;
  if (nbFiches !== attendu.length) rythme.push(`${c}: ${nbFiches} fiches de résolution au lieu de ${attendu.length}`);
  /* la situation vient juste après la dernière unité de son groupe */
  attendu.forEach(g => {
    const dernier = g[g.length - 1];
    const iP = r.ordre.indexOf('P:' + g[0]);
    const apres = r.ordre[iP + 1] || '';
    const avant = r.ordre[iP - 1] || '';
    if (!/^[LC]:/.test(avant) || avant.slice(2) !== dernier) rythme.push(`${c}: la situation des unités ${g.join('+')} ne suit pas l'unité ${dernier} (${avant})`);
  });
  if (!postPrimaire.includes(c) && !/group of two units/.test(r.note)) rythme.push(`${c}: l'écran Progression ne dit pas « un groupe de deux unités »`);
  if (postPrimaire.includes(c) && !/end of each unit/.test(r.note)) rythme.push(`${c}: l'écran Progression ne dit pas « à la fin de chaque unité »`);
}
for (const f of resolution) {
  const attendu = postPrimaire.includes(f.c) ? [f.uid] : d.rythme[f.c].groupes.find(g => g[0] === f.uid);
  const unitesDansFiche = (f.texte.match(/Unit(s)? ?(\d)( \+ (\d))?/) || []);
  if (!attendu) rythme.push(`${nomFiche(f)}: unité de départ inconnue`);
  else if (attendu.length === 2 && !/Units \d \+ \d/.test(f.texte)) rythme.push(`${nomFiche(f)}: l'en-tête ne cite pas les deux unités`);
  else if (attendu.length === 2 && !f.consignes.length) rythme.push(`${nomFiche(f)}: pas de consignes`);
}
/* au secondaire, les consignes d'une situation de deux unités puisent dans les deux unités */
controle('Rythme des situations d\'intégration : une par unité (post-primaire), une par groupe de deux unités (secondaire), la dernière seule si le nombre est impair', rythme);

/* 8. Devoirs allégés, rien de plus que des phrases dans les séances d'apprentissage */
const devoirsLourds = [];
for (const f of apprentissage) {
  const dv = f.devoir || '';
  if (!dv) devoirsLourds.push(`${nomFiche(f)}: pas de devoir`);
  else if (/Expected length|paragraph|essay|composition|\b\d+\s*(to\s*\d+\s*)?(words|sentences)\b|about \d+ words/i.test(dv)) devoirsLourds.push(`${nomFiche(f)}: ${dv.slice(0, 90)}`);
  else if (f.skill !== 'Translation' && f.c !== '6e' && !/two or three simple sentences|three simple sentences|two simple sentences|a simple sentence for each|simple sentences/i.test(dv)) devoirsLourds.push(`${nomFiche(f)}: ${dv.slice(0, 90)}`);
}
controle('Devoirs des séances d\'apprentissage allégés (quelques phrases simples, sans longueur imposée)', devoirsLourds);
const production = [];
for (const f of apprentissage) {
  /* on regarde les activités et le devoir (de « PRACTICE PHASE » à « COPYING AND EXECUTING »), pas l'objectif officiel */
  const iDebut = f.html.indexOf('PRACTICE PHASE'), iFin = f.html.indexOf('COPYING AND EXECUTING');
  const pratique = iDebut >= 0 && iFin > iDebut ? f.html.slice(iDebut, iFin) : '';
  if (!pratique) production.push(nomFiche(f) + ': phase de pratique introuvable');
  if (/Activity \d+ — [^<]*(paragraph|essay|composition)/i.test(pratique) || /Follow-up \/ Homework:<\/b>[^<]*(paragraph|essay|composition)/i.test(pratique)) production.push(nomFiche(f) + ': activité de paragraphe');
  const consignesActivites = [...pratique.matchAll(/Instruction:<\/b>([^<]*)</g)].map(m => m[1]);
  consignesActivites.filter(x => /^\s*(write|compose|produce)\b[^.]*(paragraph|essay|composition)|\b\d+ words\b/i.test(x)).forEach(x => production.push(`${nomFiche(f)}: « ${x.trim().slice(0, 80)} »`));
  if (/Situation d'int/.test(f.texte)) production.push(nomFiche(f) + ': situation d\'intégration dans une séance d\'apprentissage');
}
controle('Aucune rédaction de paragraphe ni production dans les séances d\'apprentissage', production);

/* 9. Coquilles recopiées de la planification */
const coquilles = [];
const reCoq = [[/\b(\w{3,})\s+\1\b/i, 'mot doublé'], [/;\s*;|;\s*\.|\.\s*;|-\s*;|\band;|\bthe;|\bto;|\buse;/, 'point-virgule parasite'], [/\bFMGs?\b/, 'FMGs'], [/\bressources\b/i, 'ressources'], [/related (?!to\b)/i, '« related » sans « to »'],
  [/learners will be able to the learners will be able to/i, 'phrase doublée'], [/Unit \d: :/, 'deux-points doublé'], [/\bTransfering/, 'Transfering']];
for (const f of apprentissage) {
  const m = f.texte.match(/By the end of the session, learners will be able to ([^\n]*)/);
  const obj = m ? m[1] : '';
  for (const [re, nom] of reCoq) if (re.test(obj)) coquilles.push(`${nomFiche(f)}: ${nom} — ${obj.slice(0, 100)}`);
}
for (const f of d.fiches) for (const [re, nom] of reCoq.slice(2)) if (re.test(f.texte.split('\n').slice(0, 12).join(' '))) coquilles.push(`${nomFiche(f)}: ${nom} dans l'en-tête`);
controle('Objectifs des fiches sans coquille recopiée de la planification', coquilles);

/* 10. Auteur, version, copies du fichier */
controle('La ligne « Curriculum designer: Tidiani BARRY… » figure sur toutes les fiches', d.fiches.filter(f => !/Curriculum designer: Tidiani BARRY, Inspecteur de l'Enseignement secondaire/.test(f.texte)).map(nomFiche));
const copies = ['index.html', 'app/src/index.html', 'app/src/main/assets/index.html'].map(p => path.join(racine, p)).filter(p => fs.existsSync(p));
const empreintes = copies.map(p => crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex'));
controle('Les trois copies de index.html sont identiques', copies.length === 3 && new Set(empreintes).size === 1 ? [] : ['copies différentes ou absentes']);
const gradle = fs.readFileSync(path.join(racine, 'app/build.gradle'), 'utf8');
const vGradle = (gradle.match(/versionName "([^"]+)"/) || [])[1];
const html = fs.readFileSync(path.join(racine, 'app/src/main/assets/index.html'), 'utf8');
const vEtiquette = (html.match(/<small[^>]*>version ([\d.]+)<\/small>/) || [])[1];
const vTitre = (html.match(/<title>[^<]*?([\d]+\.[\d]+)<\/title>/) || [])[1];
controle('Numéro de version identique partout (build.gradle, étiquette, titre de la page)', vGradle && vGradle === vEtiquette && vGradle === vTitre ? [] : [`build.gradle=${vGradle} étiquette=${vEtiquette} titre=${vTitre}`], `version ${vGradle}`);
controle('Le dossier mal placé .github/workflows/.github a disparu', fs.existsSync(path.join(racine, '.github/workflows/.github')) ? ['encore présent'] : []);

const echecs = bilan.filter(b => b.cas.length);
console.log(`\n${bilan.length - echecs.length} contrôles réussis sur ${bilan.length}.`);
process.exit(echecs.length ? 1 : 0);
