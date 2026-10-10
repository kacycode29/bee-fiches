/* Essais automatiques de l'écran d'activation (licence) et des menus (situations d'intégration).
   Utilisation : node tests/essai-licence-et-interface.js [index.html]
   Ne touche ni à la clé ni au système de signature : on simule seulement les cas d'échec. */
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require(path.join(process.env.NODE_PATH || '/opt/node22/lib/node_modules', 'playwright'))); }
const fichier = path.resolve(process.argv[2] || 'app/src/main/assets/index.html');
const b64u = o => (Buffer.isBuffer(o) ? o : Buffer.from(typeof o === 'string' ? o : JSON.stringify(o))).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const resultats = [];
const ok = (nom, cond, detail) => { resultats.push({ nom, ok: !!cond, detail }); console.log((cond ? 'OK   ' : 'ECHEC') + ' ' + nom + (cond ? '' : '  -> ' + detail)); };

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const nouveau = async (seed) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const erreurs = []; page.on('pageerror', e => erreurs.push(String(e.message || e)));
    if (seed) await page.addInitScript(s => { try { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); Object.entries(s).forEach(([k, v]) => localStorage.setItem(k, v)); } } catch (e) {} }, seed);
    await page.goto('file://' + fichier);
    await page.waitForTimeout(700);
    return { ctx, page, erreurs };
  };
  const etat = page => page.evaluate(() => ({
    porteOuverte: !document.getElementById('beeLicenseGate').hidden,
    statut: document.getElementById('beeLicenseStatus').textContent,
    reessayer: !document.getElementById('beeRetryBtn').hidden,
    stocke: localStorage.getItem('bee.license.offline.v2')
  }));

  /* 1. Aucune licence : la porte est fermée à clé, message d'accueil */
  let { ctx, page } = await nouveau();
  let e = await etat(page);
  ok('sans licence : écran d\'activation affiché', e.porteOuverte, JSON.stringify(e));
  const idAppareil = await page.evaluate(() => beeDeviceId());
  await ctx.close();

  const jeton = (payload, sig) => b64u({ alg: 'Ed25519', typ: 'BEE-LICENSE' }) + '.' + b64u(payload) + '.' + (sig || b64u(Buffer.alloc(64, 7)));
  const stockage = obj => ({ 'bee.license.offline.v2': JSON.stringify(obj), 'bee.installation.id.v2': idAppareil });

  /* 2. Autre appareil : licence conservée, message demandant d'envoyer le nouvel identifiant */
  ({ ctx, page } = await nouveau(stockage({ token: jeton({ permanent: true, installation_id: 'android-AUTRE', license_key: 'BEE-TEST' }), license_key: 'BEE-TEST' })));
  e = await etat(page);
  ok('autre appareil : licence conservée', !!e.stocke, JSON.stringify(e));
  ok('autre appareil : message en français sur le nouvel identifiant', /identifiant de cet appareil a changé/i.test(e.statut) && /nouvel identifiant/i.test(e.statut), e.statut);
  ok('autre appareil : la porte reste fermée', e.porteOuverte, '');
  await ctx.close();

  /* 3. Code illisible / erreur passagère : licence conservée, « Vérification impossible, réessayez » */
  ({ ctx, page } = await nouveau(stockage({ token: 'abc.def', license_key: 'BEE-TEST' })));
  e = await etat(page);
  ok('code illisible : licence conservée', !!e.stocke, JSON.stringify(e));
  ok('code illisible : « Vérification impossible, réessayez »', /Vérification impossible, réessayez/.test(e.statut), e.statut);
  ok('code illisible : bouton « Réessayer » visible', e.reessayer, '');
  await ctx.close();

  /* 4. Donnée stockée abîmée : licence conservée aussi */
  ({ ctx, page } = await nouveau({ 'bee.license.offline.v2': '{pas du json' }));
  e = await etat(page);
  ok('donnée abîmée : licence conservée', e.stocke === '{pas du json', JSON.stringify(e));
  ok('donnée abîmée : message de nouvel essai', /Vérification impossible, réessayez/.test(e.statut), e.statut);
  await ctx.close();

  /* 5. Signature réellement invalide : seule situation où la licence est retirée */
  ({ ctx, page } = await nouveau(stockage({ token: jeton({ permanent: true, installation_id: idAppareil, license_key: 'BEE-TEST' }), license_key: 'BEE-TEST' })));
  e = await etat(page);
  ok('signature invalide : licence retirée', !e.stocke, JSON.stringify(e));
  ok('signature invalide : message en français', /n’est pas authentique/.test(e.statut), e.statut);
  await ctx.close();

  /* 6. Licence valide (vérification simulée) : échec passager, puis « Réessayer » ouvre la porte */
  ({ ctx, page } = await nouveau(stockage({ token: jeton({ permanent: true, installation_id: idAppareil, license_key: 'BEE-TEST' }), license_key: 'BEE-TEST' })));
  const stockeAvant = JSON.stringify({ token: jeton({ permanent: true, installation_id: idAppareil, license_key: 'BEE-TEST' }), license_key: 'BEE-TEST' });
  await page.evaluate(async (stocke) => {
    localStorage.setItem('bee.license.offline.v2', stocke);
    document.getElementById('beeLicenseGate').hidden = false;
    window.__panne = true;
    window.beeEd25519Verify = async () => { if (window.__panne) throw new Error('verification_cryptographique_indisponible'); return true; };
    await beeStartupLicenseCheck();
  }, stockeAvant);
  const panne = await etat(page);
  ok('navigateur sans vérification : licence conservée', !!panne.stocke, JSON.stringify(panne));
  ok('navigateur sans vérification : « Vérification impossible, réessayez »', /Vérification impossible, réessayez/.test(panne.statut) && panne.reessayer, panne.statut);
  await page.evaluate(() => { window.__panne = false; });
  await page.click('#beeRetryBtn');
  await page.waitForTimeout(400);
  const repris = await etat(page);
  ok('« Réessayer » : la porte s\'ouvre quand la vérification passe', !repris.porteOuverte, JSON.stringify(repris));
  await ctx.close();

  /* 7. Menus : une situation d'intégration par unité (post-primaire) ou par groupe de deux unités (secondaire) */
  ({ ctx, page } = await nouveau());
  await page.evaluate(() => { document.getElementById('beeLicenseGate').hidden = true; });
  const menus = await page.evaluate(() => {
    const sortie = {};
    for (const c of Object.keys(CURRICULUM)) {
      document.getElementById('sessionType').value = 'Problem-Solving Session'; buildSkills();
      document.getElementById('classLevel').value = c; buildUnits();
      const opts = [...document.getElementById('unitSelect').options].map(o => o.value + '=' + o.textContent);
      document.getElementById('unitSelect').value = document.getElementById('unitSelect').options[document.getElementById('unitSelect').options.length - 1].value; buildLessons();
      generate();
      sortie[c] = { options: opts, dernier: document.getElementById('output').innerText.slice(0, 600), lecon: document.getElementById('lessonSelect').textContent };
    }
    return sortie;
  });
  const attendu = { '6e': 8, '5e': 8, '4e': 8, '3e': 8, '2nde A': 4, '1ere A': 4, 'Terminale A': 4, '2nde C': 4, '1ere C-D': 4, 'Terminale C-D': 4 };
  for (const [c, n] of Object.entries(attendu)) ok(`menu « résolution de problème » ${c} : ${n} situations`, menus[c].options.length === n, menus[c].options.length);
  ok('2nde C : la dernière situation porte sur l\'unité 7 seule', /^U7=Unit 7/.test(menus['2nde C'].options[3]), menus['2nde C'].options[3]);
  ok('2nde A : première situation = unités 1 + 2', /^U1=Units 1 \+ 2/.test(menus['2nde A'].options[0]), menus['2nde A'].options[0]);
  ok('fiche du secondaire : « Entire units »', /Entire units/.test(menus['Terminale A'].dernier), menus['Terminale A'].dernier);

  /* 8. Passage apprentissage <-> résolution de problème : le menu des unités suit */
  const bascule = await page.evaluate(() => {
    document.getElementById('sessionType').value = 'Learning Session'; buildSkills();
    document.getElementById('classLevel').value = '2nde A'; buildUnits();
    document.getElementById('unitSelect').value = 'U4'; buildLessons();
    document.getElementById('sessionType').value = 'Problem-Solving Session'; buildSkills(); buildUnits();
    const apres = document.getElementById('unitSelect').value;
    document.getElementById('sessionType').value = 'Learning Session'; buildSkills(); buildUnits();
    return { apres, retour: document.getElementById('unitSelect').options.length, valeur: document.getElementById('unitSelect').value };
  });
  ok('unité 4 -> situation « unités 3 + 4 » (U3)', bascule.apres === 'U3', JSON.stringify(bascule));
  ok('retour à l\'apprentissage : les 8 unités sont là', bascule.retour === 8, JSON.stringify(bascule));

  /* 9. Écran « Progression » : le bouton « Prepare » d'une situation d'intégration ouvre la bonne fiche */
  const prog = await page.evaluate(() => {
    document.getElementById('sessionType').value = 'Learning Session'; buildSkills();
    document.getElementById('classLevel').value = '2nde C'; buildUnits();
    const r = progressionRows('2nde C').filter(x => x.type === 'Problem-Solving Session')[3];
    prepareSession(Object.assign({ c: '2nde C' }, r));
    return { titre: document.getElementById('stageTitle').textContent, type: document.getElementById('sessionType').value, unite: document.getElementById('unitSelect').value };
  });
  ok('progression : dernière situation de 2nde C = unité 7', /SMOKING, DRUG ADDICTION AND VIOLENCE/i.test(prog.titre) && prog.unite === 'U7', JSON.stringify(prog));
  const prog2 = await page.evaluate(() => {
    const r = progressionRows('2nde C').filter(x => x.type === 'Problem-Solving Session')[0];
    prepareSession(Object.assign({ c: '2nde C' }, r));
    savePlan();
    const lib = library();
    const e = lib[0];
    renderProgression();
    const ligne = [...document.querySelectorAll('#progression tr.done')].map(tr => tr.textContent.trim().replace(/\s+/g, ' ')).filter(t => /Problem-solving/.test(t));
    openPlan(e.id);
    return { titre: document.getElementById('stageTitle').textContent, coche: ligne.length, unite: document.getElementById('unitSelect').value };
  });
  ok('fiche enregistrée puis rouverte : situation des unités 1 + 2', /CELLULAR PHONES \+ SELF-MEDICATION/i.test(prog2.titre) && prog2.unite === 'U1', JSON.stringify(prog2));
  ok('progression : la situation enregistrée est cochée', prog2.coche === 1, JSON.stringify(prog2));

  /* 10. Messages d'export : le pont Android absent ne doit rien casser */
  await ctx.close();
  await browser.close();
  const echecs = resultats.filter(r => !r.ok);
  console.log(`\n${resultats.length - echecs.length}/${resultats.length} essais réussis`);
  process.exit(echecs.length ? 1 : 0);
})();
