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
        const sortie = document.getElementById('output');
        /* La grille critériée : on relève, pour chaque colonne, la somme des points des indicateurs. */
        let grille = null;
        const tg = sortie.querySelector('table.marking');
        if (tg) {
          const nb = x => parseFloat(String(x).replace(',', '.')) || 0;
          const lignes = [...tg.querySelectorAll('tbody tr')];
          const corps = lignes.filter(tr => !tr.querySelector('th'));
          const sommes = [0, 0, 0, 0];
          const lignesDetail = [];
          corps.forEach(tr => {
            const cellules = [...tr.children].slice(1);       /* on saute la colonne « consignes » */
            cellules.forEach((td, k) => {
              const pts = [...td.querySelectorAll('.ind b')].map(b => nb(b.textContent));
              const somme = pts.reduce((a, b) => a + b, 0);
              sommes[k] += somme;
              if (k < 3) lignesDetail.push({ colonne: k, somme });
            });
          });
          const totaux = [...lignes.find(tr => /TOTAL/.test(tr.textContent)).querySelectorAll('th.n')].map(th => nb(th.textContent));
          const marque = nb((lignes.find(tr => /^Mark/.test(tr.textContent.trim())).querySelector('th.n') || {}).textContent.replace('/', ''));
          grille = { sommes, totaux, marque, lignes: corps.length,
                     grammaires: [...tg.querySelectorAll('td')].map(td => (td.textContent.match(/grammar point of instruction \d correctly: ([^\n]*?) [0-9.]+ pts?/) || [])[1]).filter(Boolean) };
        }
        fiches.push(Object.assign({}, meta, {
          html: sortie.innerHTML,
          texte: sortie.innerText,
          fiche: document.getElementById('supportSheet').innerHTML,
          support: d.supportText, skill: d.skill, fn: d.fn,
          consignes: [...sortie.querySelectorAll('ol.consignes > li')].map(li => li.textContent.trim()),
          grille, aGrille: !!tg, aFeuilleDeNotes: !!sortie.querySelector('table.marksheet'),
          devoir: ((sortie.innerHTML.match(/Follow-up \/ Homework:<\/b>([\s\S]*?)<\/p>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim(),
          titreFiche: sortie.querySelector('.title h2') ? sortie.querySelector('.title h2').textContent : ''
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
                /* comme dans l'interface : le changement de séance met à jour les activités proposées */
                refreshDynamicEditor(true);
              });
            }
          }
        }
      }
    }
    /* Rythme des situations d'intégration et écran « Progression » */
    const rythme = {};
    for (const c of classes) {
      const groupes = typeof groupesDUnites === 'function' ? groupesDUnites(c) : [];
      document.getElementById('classLevel').value = c;
      const rows = progressionRows(c);
      rythme[c] = {
        unites: CURRICULUM[c].units.map(u => u.id),
        groupes: groupes.map(g => g.map(u => u.id)),
        progression: rows.filter(r => r.type === 'Problem-Solving Session').map(r => ({ unitId: r.unitId, units: r.units || [r.unitId.replace(/\D/g, '') * 1] })),
        ordre: rows.map(r => r.type === 'Problem-Solving Session' ? 'P:' + r.unitId : r.type[0] + ':' + r.unitId),
        note: (() => { document.getElementById('classLevel').value = c; document.getElementById('sessionType').value = 'Learning Session'; renderProgression(); return document.getElementById('progression').innerText; })()
      };
    }
    /* Composition : trois consignes, quelle que soit la classe et l'unité */
    const compositions = [];
    const phrases = ['Many young people in our country want to continue their studies after the secondary school.',
      'Some of them travel to the big towns because they hope to find a job there.',
      'Their parents often help them with the little money that the family saves.',
      'In the village, the elders say that education is the best inheritance for a child.',
      'A teacher explained that learning a language requires patience and regular practice.',
      'Last year, the pupils of the school organised a clean-up day around the market.',
      'They collected a large quantity of waste and the traders thanked them warmly.',
      'The mayor promised that the commune would buy new bins before the rainy season.',
      'Everybody agreed that cleanliness protects the health of the whole community.',
      'A nurse told the pupils that clean water and good hygiene prevent many diseases.',
      'If the families keep these habits, the number of sick children will decrease.',
      'The young people understood that small actions can change the life of a district.'];
    const faireTexte = n => { let t = '', i = 0; while ((t.match(/\b[A-Za-z]+\b/g) || []).length < n) { t += phrases[i % phrases.length] + (i % 4 === 3 ? '\n' : ' '); i++; } return t; };
    for (const c of classes) {
      for (const u of CURRICULUM[c].units) {
        try {
          document.getElementById('sessionType').value = 'Learning Session'; buildSkills();
          document.getElementById('classLevel').value = c; buildUnits();
          document.getElementById('unitSelect').value = u.id; buildLessons();
          const bepc = ['6e', '5e', '4e', '3e'].includes(c);
          document.getElementById('compoText').value = faireTexte(bepc ? 255 : 375);
          buildCompoBareme(true);
          generate();
          compoAJour = false; batirComposition();
          const sheet = document.getElementById('compoSheet');
          compositions.push({ c, uid: u.id,
            consignes: [...sheet.querySelectorAll('.compo-sujet ol.compo-cons > li')].map(li => li.textContent.trim()),
            grammaires: [...sheet.querySelectorAll('.compo-cle ol li b')].map(b => b.textContent.trim()),
            erreur: /n.a pas pu/.test(sheet.innerText),
            texte: sheet.innerText });
        } catch (e) { compositions.push({ c, uid: u.id, erreur: true, message: String(e && e.stack || e) }); }
      }
    }
    /* Fourchettes officielles utilisées par le logiciel, et barèmes personnalisés (totaux à vérifier) */
    const plages = {};
    for (const c of classes) plages[c] = { lecture: officialWordRange(c, '1'), production: levelInfo(c).writing };
    const grillesPerso = [];
    const baremes = [[3, 6, 9, 2], [4, 5, 8, 3], [5, 5, 5, 5], [2, 7, 9, 2], [1, 1, 1, 17], [0, 10, 10, 0], [7, 3, 6, 4], [3, 3, 3, 3]];
    for (const [c, uid] of [['6e', 'U1'], ['4e', 'U3'], ['2nde A', 'U1'], ['Terminale A', 'U7'], ['2nde C', 'U7'], ['Terminale C-D', 'U5']]) {
      for (const bw of baremes) {
        try {
          document.getElementById('sessionType').value = 'Problem-Solving Session'; buildSkills();
          document.getElementById('classLevel').value = c; buildUnits();
          document.getElementById('unitSelect').value = uid; buildLessons();
          ['wRel', 'wLang', 'wCoh', 'wRef'].forEach((id, k) => { document.getElementById(id).value = bw[k]; });
          generate();
          const tg = document.getElementById('output').querySelector('table.marking');
          const nb = x => parseFloat(String(x).replace(',', '.')) || 0;
          const lignes = [...tg.querySelectorAll('tbody tr')];
          const corps = lignes.filter(tr => !tr.querySelector('th'));
          const sommes = [0, 0, 0, 0];
          corps.forEach(tr => [...tr.children].slice(1).forEach((td, k) => { sommes[k] += [...td.querySelectorAll('.ind b')].map(b => nb(b.textContent)).reduce((a, b) => a + b, 0); }));
          const totaux = [...lignes.find(tr => /TOTAL/.test(tr.textContent)).querySelectorAll('th.n')].map(th => nb(th.textContent));
          grillesPerso.push({ c, uid, bareme: bw, sommes: sommes.map(x => Math.round(x * 1000) / 1000), totaux, lignes: corps.length });
        } catch (e) { grillesPerso.push({ c, uid, bareme: bw, erreur: String(e && e.message || e) }); }
      }
    }
    ['wRel', 'wLang', 'wCoh', 'wRef'].forEach((id, k) => { document.getElementById(id).value = [3, 6, 9, 2][k]; });
    return { fiches, erreurs, rythme, compositions, plages, grillesPerso };
  });
  fs.writeFileSync(sortie, JSON.stringify({ fichier, erreursPage, ...resultat }));
  console.log(`${resultat.fiches.length} fiches générées, ${resultat.erreurs.length} erreurs de programme, ${erreursPage.length} erreurs de page`);
  await browser.close();
})();
