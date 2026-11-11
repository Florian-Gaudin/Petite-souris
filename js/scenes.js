// Chapitre 1 : les six scènes interactives. Chaque scène a un élément obligatoire (ou une chaîne
// d'éléments) qui débloque « Continuer », et deux éléments bonus qui donnent des étoiles.
window.SCENES = (function () {
  'use strict';
  const D = window.DATA, A = window.ART, DEC = window.DECORS, SON = window.SON, NARR = window.NARR, MUS = window.MUSIQUE;
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const DESSINS = { chateau: DEC.chateau, foret: DEC.foret, meuse: DEC.meuse, place: DEC.place, aiglemont: DEC.aiglemont, pantoufle: DEC.pantoufle };
  const ICONES_FRISE = {
    chateau: '<path d="M5 20V9h3V6h2v3h4V6h2v3h3v11zM10 20v-5h4v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    foret: '<path d="M12 3l6 9h-3l4 6H5l4-6H6zM12 18v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    meuse: '<path d="M3 10q3-3 6 0t6 0 6 0M3 15q3-3 6 0t6 0 6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    place: '<path d="M4 20v-8a4 4 0 0 1 8 0v8M12 20v-8a4 4 0 0 1 8 0v8M3 20h18M4 8h16" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    aiglemont: '<path d="M4 11l8-7 8 7v9H4zM10 20v-5h4v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    pantoufle: '<path d="M6 10l-1-5 4 3h6l4-3-1 5a6 6 0 0 1-12 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="10" cy="11" r="1" fill="currentColor"/><circle cx="14" cy="11" r="1" fill="currentColor"/>',
  };

  let ctx = null, root = null, wrap = null, svg = null, sc = null, courant = -1, jeton = 0;
  let chaine = [], idx = 0, derniere = null, aideT1 = null, aideT2 = null, raf = null, bougeT = null, secretTaps = 0, secretT = null;
  let occupe = false, jetonBulle = 0, enSecret = false;
  const T = s => ctx.T(s);
  const bulle = b => b ? { txt: T(b.txt), expr: b.expr } : null;

  // ---------- Ce qui se passe à l'écran quand on touche un élément ----------
  const ACTIONS = {
    chateau: {
      lanterne() { svg.classList.add('allume'); SON.play('lanterne'); },
      feuillage(g, sub, etape, deuxieme) {
        if (deuxieme && !g.classList.contains('envol')) { g.classList.add('envol'); SON.play('hulotte'); setTimeout(() => SON.play('buisson'), 300); return; }
        g.classList.remove('secoue'); void g.getBBox(); g.classList.add('secoue'); SON.play('buisson'); setTimeout(() => SON.play('hulotte'), 500);
      },
      sac() { SON.play('papier'); },
    },
    foret: {
      champignons(g, sub, etape) { if (sub) sub.classList.add('allume'); SON.play('champignon'); if (etape >= 3) svg.classList.add('dore'); },
      buisson() { SON.play('buisson'); setTimeout(() => SON.play('renard'), 600); },
      luciole(g) { g.classList.add('vole'); SON.play('luciole'); },
    },
    meuse: {
      billet() { SON.play('pli'); },
      bulles(g) { g.classList.remove('saute'); void g.getBBox(); g.classList.add('saute'); SON.play('plouf'); },
      reflet(g) { g.classList.remove('ondule'); void g.getBBox(); g.classList.add('ondule'); SON.play('ronds'); },
    },
    place: {
      marionnettiste(g) { g.classList.remove('danse'); void g.getBBox(); g.classList.add('danse'); SON.play('pantin'); },
      fenetre() { SON.play('pigeon'); },
      fromage(g) { g.classList.add('croque'); SON.play('croque'); },
    },
    aiglemont: {
      girouette(g) { g.classList.remove('tourne'); void g.getBBox(); g.classList.add('tourne'); SON.play('girouette'); },
      lampadaire() { SON.play('gresille'); },
      fenetre() { SON.play('allume'); },
    },
    pantoufle: {
      yeux() { $('.chat-dort', svg).classList.add('revele'); SON.play('mmh'); },
      quenotte() { SON.play('clic'); },
      moustache() { SON.play('ronron'); },
      porte() { SON.play('grince'); },
    },
  };
  // Petites animations qui suivent l'élément obligatoire, avant la réponse de Quenotte
  const APRES = {
    chateau: { lanterne: () => wait(RM ? 100 : 700) },
    meuse: { billet: traversee },
    place: { marionnettiste: () => wait(RM ? 100 : 900) },
    aiglemont: { girouette: async () => { await wait(RM ? 100 : 2300); svg.classList.add('trouve'); SON.play('allume'); await wait(400); } },
    pantoufle: { yeux: () => wait(RM ? 100 : 900) },
  };
  // Quand un élément devient la cible, certains passent au premier plan (le billet, d'abord caché derrière Quenotte)
  const DEVANT = {
    meuse: { billet(g) { g.setAttribute('transform', 'translate(222,334)'); svg.insertBefore(g, $('.main-aide', svg)); g.classList.add('devant'); } },
  };
  // Éléments obligatoires que l'on peut retoucher après coup (ils rejouent leur animation)
  const REJOUE = { marionnettiste: 1, girouette: 1, yeux: 0, lanterne: 0 };

  async function traversee(g) {
    const nav = $('.navire', svg), rg = $('.rive-g', svg), rd = $('.rive-d', svg);
    g.classList.add('parti'); rg.classList.add('cache'); nav.classList.add('on');
    SON.play('plouf');
    const mien = jeton, x0 = 230, x1 = 770, dur = RM ? 300 : 4200, t0 = performance.now();
    setTimeout(() => { if (mien === jeton) SON.play('eau'); }, 1400);
    setTimeout(() => { if (mien === jeton) SON.play('eau'); }, 2900);
    await new Promise(res => {
      const step = now => {
        if (mien !== jeton) { res(); return; }
        const k = Math.min(1, (now - t0) / dur), x = x0 + (x1 - x0) * k, y = 440 + Math.sin(k * Math.PI * 6) * 6, r = Math.sin(k * Math.PI * 6) * 4;
        nav.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(1)})`);
        if (k < 1) raf = requestAnimationFrame(step); else res();
      };
      raf = requestAnimationFrame(step);
    });
    if (mien !== jeton) return;
    nav.classList.remove('on'); rd.classList.add('on'); svg.classList.add('arrive'); SON.play('pas');
    await wait(RM ? 100 : 500);
  }

  // ---------- La main qui montre l'élément à toucher ----------
  function aideStop() {
    clearTimeout(aideT1); clearTimeout(aideT2);
    const m = svg && $('.main-aide', svg); if (m) m.classList.remove('on');
    if (svg) $$('.tap.grand', svg).forEach(g => g.classList.remove('grand'));
  }
  function aideLance() {
    aideStop();
    if (!svg || idx >= chaine.length) return;
    const g = $(`.tap[data-el="${chaine[idx]}"]`, svg); if (!g) return;
    aideT1 = setTimeout(() => {
      const m = $('.main-aide', svg); let b;
      try { b = (g.querySelector('.halo') || g).getBBox(); } catch (e) { return; }
      let cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      // L'élément est peut-être dans un groupe transformé (chat, sac, porte…) : on passe par les coordonnées écran
      try {
        const pt = svg.createSVGPoint(); const r = (g.querySelector('.halo') || g).getBoundingClientRect();
        pt.x = r.left + r.width / 2; pt.y = r.top + r.height / 2;
        const p = pt.matrixTransform(svg.getScreenCTM().inverse()); cx = p.x; cy = p.y;
      } catch (e) { }
      m.setAttribute('transform', `translate(${(cx + 10).toFixed(0)},${(cy + 14).toFixed(0)})`);
      m.classList.add('on');
    }, 4000);
    aideT2 = setTimeout(() => g.classList.add('grand'), 8000);
  }

  // ---------- Frise des six scènes ----------
  function frise(n) {
    return `<div class="frise" aria-label="Les étapes du voyage">${D.scenes.map((s, i) => {
      const ok = i <= ctx.state.scene;
      return `<button class="pastille ${i === n ? 'active' : ''} ${i < n ? 'faite' : ''}" data-n="${i}" ${ok ? '' : 'disabled'} aria-label="${T(s.titre)}" title="${T(s.titre)}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONES_FRISE[s.id]}</svg></button>`;
    }).join('<span class="frise-trait"></span>')}</div>`;
  }

  // ---------- Ouverture d'une scène ----------
  async function ouvrir(n) {
    fermer();
    const mien = ++jeton;
    courant = n; sc = D.scenes[n];
    root.innerHTML = frise(n) + `<div class="decor-wrap" id="decor-wrap"><h2 class="decor-titre"><span class="decor-heure">${sc.heure.replace(':', ' h ')}</span>${T(sc.titre)}</h2><div class="secrets" id="secrets" title="Secrets découverts dans cette image"><svg viewBox="0 0 24 24"><use href="#etoile5"/></svg><span id="secrets-n"></span></div>${DESSINS[sc.id](ctx.state.nuit)}</div>`;
    wrap = $('#decor-wrap', root); svg = $('svg.decor', root);
    svg.insertAdjacentHTML('beforeend', `<g class="main-aide" aria-hidden="true"><use href="#main" x="-20" y="-6" width="60" height="70"/></g>`);
    ctx.heure(sc.heure); MUS.ambiance(sc.ambiance);
    cadre(); window.addEventListener('resize', cadre);
    chaine = sc.oblig.slice(); idx = 0; secretTaps = 0; occupe = false;
    const vus = (ctx.state.etoiles && ctx.state.etoiles[sc.id]) || [];
    $$('.tap', svg).forEach(g => {
      const id = g.dataset.el;
      if (sc.bonus.indexOf(id) >= 0) {
        g.classList.add('bonus'); if (vus.indexOf(id) >= 0) g.classList.add('deja');
        // Une petite étoile qui clignote au-dessus de chaque secret
        const h = g.querySelector('.halo');
        if (h) { const cx = +h.getAttribute('cx'), cy = +h.getAttribute('cy'), r = +h.getAttribute('r'); g.insertAdjacentHTML('beforeend', `<g class="indice" transform="translate(${cx},${(cy - r * 0.8).toFixed(0)})"><use href="#etoile5" x="-15" y="-15" width="30" height="30"/></g>`); }
      }
      g.addEventListener('click', e => onTap(g, e));
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(g, e); } });
    });
    // Un toucher à côté : la scène bouge doucement, rien de plus
    svg.addEventListener('pointerdown', e => {
      if (e.target.closest('.tap')) return;
      wrap.classList.remove('bouge'); void wrap.offsetWidth; wrap.classList.add('bouge');
    });
    $$('.pastille', root).forEach(p => p.onclick = () => { const k = +p.dataset.n; if (k <= ctx.state.scene && k !== courant) ctx.fondu(() => ouvrir(k)); });
    NARR.action(null); compteSecrets();
    await NARR.dire(derniere = bulle(sc.intro));
    if (mien !== jeton) return;
    const ok = await NARR.attendre();
    if (mien !== jeton || !ok) return; // un élément a été touché pendant l'attente : la suite s'en charge
    if (!ctx.state.indices && sc.bonus.length) {
      // Première scène : Quenotte explique les secrets à découvrir
      await NARR.dire(derniere = bulle(D.indices)); if (mien !== jeton) return;
      const ok2 = await NARR.attendre();
      ctx.state.indices = true; ctx.save();
      if (mien !== jeton || !ok2) return;
    }
    await demande();
  }
  // Cadrage : la scène occupe toute la largeur, et le ciel se prolonge vers le haut si l'écran est en hauteur
  function cadre() {
    if (!svg || !wrap) return;
    const W = wrap.clientWidth || 700;
    const mesure = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bandeau-h')) || 0;
    const band = Math.max(mesure, W > 700 ? 150 : 200);
    // Hauteur disponible : de la position réelle du cadre jusqu'au bandeau (marge de 30 px)
    const haut = wrap.getBoundingClientRect().top + (window.pageYOffset || 0);
    const dispo = window.innerHeight - haut - band - 30;
    const H = Math.max(200, Math.min(dispo, W * 1.15));
    let ext = H * 1000 / W;
    if (ext < 600) {
      // Écran large et bas (tablette en paysage) : la scène entière, un peu moins large, centrée
      svg.setAttribute('viewBox', '0 0 1000 600'); svg.style.width = Math.round(H / 0.6) + 'px'; svg.style.height = H + 'px';
    } else {
      ext = Math.min(1300, Math.round(ext));
      svg.setAttribute('viewBox', `0 ${600 - ext} 1000 ${ext}`); svg.style.width = '100%'; svg.style.height = Math.round(ext * W / 1000) + 'px';
    }
  }
  function compteSecrets() {
    const el = $('#secrets-n', root); if (!el) return;
    el.textContent = ((ctx.state.etoiles && ctx.state.etoiles[sc.id]) || []).length + '/' + sc.bonus.length;
  }
  function fermer() {
    jeton++; aideStop(); window.removeEventListener('resize', cadre); cancelAnimationFrame(raf); clearTimeout(bougeT); clearTimeout(secretT);
    svg = null; wrap = null;
  }

  // Met en évidence l'élément obligatoire suivant et affiche sa demande
  async function demande() {
    const mien = jeton;
    $$('.tap.cible', svg).forEach(g => g.classList.remove('cible'));
    if (idx >= chaine.length) return;
    const id = chaine[idx], el = sc.elements[id], g = $(`.tap[data-el="${id}"]`, svg);
    if (g) { g.classList.add('cible'); const dv = DEVANT[sc.id] && DEVANT[sc.id][id]; if (dv && !g.classList.contains('devant')) dv(g); }
    aideLance();
    if (el.demande) {
      const b = bulle(el.demande), deja = derniere && derniere.txt === b.txt; // déjà lue : on la remet d'un coup
      await NARR.dire(derniere = b, deja ? { vite: 'instant' } : {}); if (mien !== jeton) return;
    } else if (derniere) NARR.dire(derniere, { vite: 'instant' });
  }
  // Après une bulle bonus (et un toucher), on revient à ce qu'il y a à faire
  async function rappel(mien, mienBulle) {
    const ok = await NARR.attendre();
    if (mien !== jeton) return;
    if (mienBulle !== jetonBulle) return; // un autre secret a pris la place : c'est lui qui rendra la main
    NARR.masquerAction(false);
    enSecret = false; svg.classList.remove('secret');
    if (!ok || occupe) return;
    // Retour à l'histoire principale : la demande, la main d'aide et le toucher sur l'élément
    if (idx < chaine.length) { await demande(); return; }
    if (derniere) NARR.dire(derniere, { vite: 'instant' });
  }

  function onTap(g, e) {
    const id = g.dataset.el, el = sc.elements[id];
    if (!el) return;
    SON.unlock();
    if (sc.bonus.indexOf(id) >= 0) { bonus(g, id, el); return; }
    const pos = chaine.indexOf(id);
    // Pendant la lecture d'un secret, l'histoire principale attend le bouton « Suite »
    if (enSecret) { SON.play('toc'); g.classList.remove('refus'); void g.getBBox(); g.classList.add('refus'); return; }
    if (pos < idx) {
      // Élément obligatoire déjà fait : certains rejouent leur animation
      if (REJOUE[id]) { const act = ACTIONS[sc.id][id]; if (act) act(g); }
      if (id === 'marionnettiste' && ctx.config.secret) secret();
      return;
    }
    if (pos > idx) { SON.play('toc'); return; }
    obligatoire(g, id, el, e);
  }
  function secret() {
    secretTaps++; clearTimeout(secretT); secretT = setTimeout(() => { secretTaps = 0; }, 2500);
    if (secretTaps >= 3) { secretTaps = 0; ctx.scene13(); }
  }

  async function bonus(g, id, el) {
    // Pendant la traversée ou la réponse à l'élément obligatoire : on attend (l'élément frémit pour le dire)
    if (occupe) { SON.play('toc'); g.classList.remove('refus'); void g.getBBox(); g.classList.add('refus'); return; }
    const mien = jeton, mienBulle = ++jetonBulle;
    const premiere = !g.classList.contains('vu') && !g.classList.contains('deja');
    const deuxieme = g.classList.contains('vu');
    g.classList.add('vu');
    const act = ACTIONS[sc.id][id]; if (act) act(g, null, 0, deuxieme);
    if (premiere) { ctx.etoile(sc.id, id); compteSecrets(); }
    NARR.masquerAction(true); // le bouton Continuer attend la fin du secret
    enSecret = true; svg.classList.add('secret'); aideStop();
    await NARR.dire(bulle(deuxieme && el.bulle2 ? el.bulle2 : el.bulle));
    if (mien !== jeton) return;
    rappel(mien, mienBulle);
  }

  async function obligatoire(g, id, el, e) {
    if (occupe) return;
    const mien = jeton; jetonBulle++;
    aideStop();
    const act = ACTIONS[sc.id][id];
    if (el.etapes) {
      let sub = e && e.target && e.target.closest ? e.target.closest('[data-sub]') : null;
      if (sub && sub.classList.contains('allume')) sub = null;
      if (!sub && g.querySelector('[data-sub]')) sub = g.querySelector('[data-sub]:not(.allume)');
      const etape = (+(g.dataset.etape || 0)) + 1;
      g.dataset.etape = etape;
      if (act) act(g, sub, etape);
      const txt = { txt: T(el.etapes[etape - 1]), expr: etape >= el.etapes.length ? 'joie' : 'surprise' };
      if (etape < el.etapes.length) { NARR.dire(txt, { vite: true }); aideLance(); return; }
      occupe = true; svg.classList.add('occupe');
      g.classList.add('vu', 'fait'); g.classList.remove('cible');
      await NARR.dire(txt, { vite: true }); if (mien !== jeton) return;
      await wait(500); if (mien !== jeton) return;
    } else {
      occupe = true; svg.classList.add('occupe');
      g.classList.add('vu', 'fait'); g.classList.remove('cible');
      if (act) act(g);
    }
    const apres = APRES[sc.id] && APRES[sc.id][id];
    if (apres) { await apres(g); if (mien !== jeton) return; }
    if (el.reponse) {
      await NARR.dire(derniere = bulle(el.reponse)); if (mien !== jeton) return;
      // Dernier élément et pas de pont : le bouton arrive tout de suite, sans toucher supplémentaire
      const direct = idx + 1 >= chaine.length && !sc.pont;
      if (!direct) { await NARR.attendre(); if (mien !== jeton) return; }
    }
    idx++;
    occupe = false; svg.classList.remove('occupe');
    if (idx < chaine.length) { await demande(); return; }
    await fini(mien);
  }

  async function fini(mien) {
    ctx.sceneFaite(courant);
    $$('.pastille', root).forEach(p => { if (+p.dataset.n <= ctx.state.scene) p.disabled = false; });
    if (sc.pont) { await NARR.dire(derniere = bulle(sc.pont)); if (mien !== jeton) return; }
    const dernier = courant >= D.scenes.length - 1;
    if (dernier) NARR.action(A.icone('patte') + ' ' + T(sc.bouton), () => ctx.finChapitre(), 'btn-rouge');
    else NARR.action('Continuer ' + A.icone('suite'), () => { SON.play('clic'); NARR.action(null); ctx.fondu(() => ouvrir(courant + 1)); });
  }

  return {
    monter(r, c, n) { root = r; ctx = c; ouvrir(Math.max(0, Math.min(D.scenes.length - 1, n))); },
    demonter() { fermer(); root = null; },
    get courante() { return courant; },
  };
})();
