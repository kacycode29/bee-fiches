/* Génère TOUTES les fiches de BEE dans un navigateur (Chromium sans écran) et
   enregistre le résultat dans un fichier JSON pour les contrôles automatiques.

   Utilisation :  node tests/generer-toutes-les-fiches.js [index.html] [sortie.json]
   Il faut le module « playwright » et un Chromium installé. */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require(path.join(process.env.NODE_PATH || '/opt/node22/lib/node_modules', 'playwright'))); }

const fichier = path.resolve(process.argv[2] || 'app/src/main/assets/index.html');
const sortie = path.resolve(process.argv[3] || 'fiches-generees.json');

(async () => {
  const exe = process.env.PLAYWRIGHT_BROWSERS_PATH ? undefined : undefined;
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const erreursPage = [];
  page.on('pageerror', e => erreursPage.push(String(e && e.message || e)));
  await page.goto('file://' + fichier);
  await page.waitForTimeout(500);
  const resultat = await page.evaluate(() => {
    const fiches = [], erreurs = [];
    document.getElementById('beeLicenseGate').hidden = true;
    const classes = Object.keys(CURRICULUM);
    const types = ['Learning Session', 'Consolidation Session', 'Problem-Solving Session'];
    const lancer = (meta, regler) => {
      try {
        regler();
        generate();
        const d = collect();
        fiches.push(Object.assign({}, meta, {
          html: document.getElementById('output').innerHTML,
          texte: document.getElementById('output').innerText,
          fiche: document.getElementById('supportSheet').innerHTML,
          support: d.supportText, skill: d.skill, fn: d.fn
        }));
      } catch (e) { erreurs.push(Object.assign({}, meta, { erreur: String(e && e.stack || e) })); }
    };
    for (const c of classes) {
      const units = CURRICULUM[c].units;
      for (const type of types) {
        document.getElementById('sessionType').value = type; buildSkills();
        document.getElementById('classLevel').value = c; buildUnits();
        const unitIds = type === 'Problem-Solving Session' && typeof unitesPourResolution === 'function'
          ? unitesPourResolution(c).map(u => u.id) : units.map(u => u.id);
        for (const uid of unitIds) {
          const u = units.find(x => x.id === uid);
          if (type === 'Problem-Solving Session') {
            lancer({ c, type, uid }, () => {
              document.getElementById('sessionType').value = type; buildSkills();
              document.getElementById('classLevel').value = c; buildUnits();
              document.getElementById('unitSelect').value = uid; buildLessons();
            });
            continue;
          }
          for (const l of u.lessons) {
            const seances = type === 'Learning Session' ? l.sessions : [''];
            for (const s of seances) {
              lancer({ c, type, uid, lesson: l.name, session: s }, () => {
                document.getElementById('sessionType').value = type; buildSkills();
                document.getElementById('classLevel').value = c; buildUnits();
                document.getElementById('unitSelect').value = uid; buildLessons();
                document.getElementById('lessonSelect').value = l.name; buildSessions();
                if (s) { document.getElementById('sessionSelect').value = s; syncSupportText(true); }
              });
            }
          }
        }
      }
    }
    return { fiches, erreurs };
  });
  fs.writeFileSync(sortie, JSON.stringify({ fichier, erreursPage, ...resultat }));
  console.log(`${resultat.fiches.length} fiches générées, ${resultat.erreurs.length} erreurs de programme, ${erreursPage.length} erreurs de page`);
  await browser.close();
})();
