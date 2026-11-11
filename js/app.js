// La nuit de la Petite Souris — application (chapitres, progression, fil rouge, narration)
(function () {
  'use strict';
  const C = window.CONFIG, D = window.DATA, A = window.ART, SON = window.SON, MUS = window.MUSIQUE, NARR = window.NARR;
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  function T(s) {
    return String(s).replace(/\{(\w+)\}/g, (m, k) => {
      if (k === 'lieuBillet') return C.billet.lieu;
      return C[k] != null ? C[k] : m;
    });
  }
  const B = b => b ? { txt: T(b.txt), expr: b.expr } : null;
  const hasard = arr => arr[Math.floor(Math.random() * arr.length)];

  // ---------- Progression (mémorisée en local) ----------
  const KEY = 'souris.v2';
  const State = { unlocked: 0, scene: 0, etoiles: {}, badges: [], secret: false, nuit: null, fini: false };
  function calcNuit() { const d = new Date(); if (d.getHours() < 12) d.setDate(d.getDate() - 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function load() {
    try { Object.assign(State, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { }
    if (!State.etoiles || typeof State.etoiles !== 'object') State.etoiles = {};
    if (C.nuit) State.nuit = C.nuit;
    if (!State.nuit || !/^\d{4}-\d{2}-\d{2}$/.test(State.nuit)) State.nuit = calcNuit();
    save();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(State)); } catch (e) { } }
  function nuitTexte() {
    const d1 = new Date(State.nuit + 'T12:00:00'), d2 = new Date(d1); d2.setDate(d2.getDate() + 1);
    const mois = new Intl.DateTimeFormat('fr-FR', { month: 'long' });
    const m1 = mois.format(d1), m2 = mois.format(d2);
    return m1 === m2 ? `nuit du ${d1.getDate()} au ${d2.getDate()} ${m2} ${d2.getFullYear()}` : `nuit du ${d1.getDate()} ${m1} au ${d2.getDate()} ${m2} ${d2.getFullYear()}`;
  }
  function dateCam() { const d = new Date(State.nuit + 'T12:00:00'); d.setDate(d.getDate() + 1); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); }
  function nbEtoiles() { return Object.keys(State.etoiles).reduce((n, k) => n + (State.etoiles[k] || []).length, 0); }
  const totalEtoiles = D.scenes.reduce((n, s) => n + s.bonus.length, 0);

  // Paramètres d'adresse pour tester : ?reset=1 efface tout, ?chapitre=3 débloque jusqu'au chapitre 3,
  // ?chapitre=1&scene=4 ouvre la scène 4 du voyage, ?t=30 avance de 30 s dans la caméra
  const params = new URLSearchParams(location.search);
  if (params.has('reset')) {
    try { localStorage.removeItem(KEY); localStorage.removeItem('souris.v1'); localStorage.removeItem('souris.muet'); } catch (e) { }
    location.replace(location.pathname); return;
  }
  load();
  const tTest = Math.max(0, parseFloat(params.get('t')) || 0);
  let demande = null, sceneDemande = null;
  if (params.has('chapitre')) {
    const n = Math.max(0, Math.min(5, parseInt(params.get('chapitre'), 10) || 0));
    State.unlocked = Math.max(State.unlocked, n); demande = n;
    if (params.has('scene')) { sceneDemande = Math.max(0, Math.min(5, parseInt(params.get('scene'), 10) || 0)); State.scene = Math.max(State.scene, sceneDemande); }
    save();
    try { history.replaceState(null, '', location.pathname + '#' + n); } catch (e) { }
  }

  // ---------- Fil rouge, heure, son, toasts ----------
  const root = $('#scene');
  let courant = null, courantN = 0;
  function heure(t) { $('#heure').textContent = t; }
  function toast(txt, icone) {
    const el = $('#toast');
    el.innerHTML = `<div class="toast-in">${icone || ''}<span>${esc(txt)}</span></div>`;
    el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 3200);
  }
  function badge(id) {
    const b = D.badges.find(x => x.id === id);
    if (!b || State.badges.indexOf(id) >= 0) return;
    State.badges.push(id); save();
    toast('Badge gagné : ' + T(b.nom), A.badgeIcone(id, 36)); SON.play('badge');
  }
  function etoile(sceneId, el) {
    const liste = State.etoiles[sceneId] || (State.etoiles[sceneId] = []);
    if (liste.indexOf(el) >= 0) return;
    liste.push(el); save();
    const n = nbEtoiles();
    const sc = D.scenes.find(s => s.id === sceneId);
    toast((sc && liste.length >= sc.bonus.length ? D.etoilesToutes : D.etoile) + ' (' + n + '/' + totalEtoiles + ')', `<svg class="badge-ico" width="34" height="34" viewBox="0 0 24 24"><use href="#etoile5"/></svg>`);
    SON.play('etoile');
    D.badges.filter(b => b.etoiles && n >= b.etoiles).forEach(b => setTimeout(() => badge(b.id), 1500));
  }
  function complete(n) { if (State.unlocked < n + 1) { State.unlocked = n + 1; save(); } }
  function buildFil() {
    const maison = `<button class="perle maison" data-n="0" aria-label="Revenir au début de l'histoire" title="Revenir au début"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="#fff"/></svg></button>`;
    const perles = maison + [1, 2, 3, 4, 5].map(i => `<button class="perle" data-n="${i}" aria-label="Chapitre ${i}"><span>${i}</span></button>`).join('');
    $('#fil').innerHTML = `<div class="fil-in">
      <div class="ruban" aria-label="Progression de l'histoire"><div class="fil-ligne"></div>${perles}<div class="fil-souris"><svg viewBox="0 0 130 100"><use href="#souris-side"/></svg></div></div>
      <div class="heure" id="heure" aria-label="Heure dans l'histoire">—</div>
      <button class="btn-ico" id="btn-son" aria-label="Couper ou remettre le son et la musique">${A.icone(SON.muet ? 'muet' : 'son')}</button>
    </div>`;
    $('#btn-son').onclick = () => { SON.unlock(); const m = SON.toggle(); $('#btn-son').innerHTML = A.icone(m ? 'muet' : 'son'); toast(m ? 'Son et musique coupés' : 'Son et musique activés'); };
    $$('.perle').forEach(p => p.onclick = () => { const n = +p.dataset.n; if (n <= State.unlocked) show(n); else toast('Termine d\'abord le chapitre ' + (n - 1) + ' !'); });
  }
  function updateFil(n) {
    $$('.perle').forEach(p => { const i = +p.dataset.n; p.classList.toggle('faite', i < State.unlocked); p.classList.toggle('active', i === n); p.classList.toggle('ouverte', i <= State.unlocked); });
    const s = $('.fil-souris'); if (s) s.style.left = n === 0 ? '5%' : [16, 33, 50, 67, 84][n - 1] + '%';
    document.body.dataset.chapitre = n;
  }
  // Fondu au noir entre deux tableaux : on assombrit, on change, on rallume
  function fondu(fn, duree) {
    const v = $('#voile-noir'); duree = RM ? 0 : (duree || 700);
    v.style.transitionDuration = duree + 'ms';
    v.classList.add('on');
    return wait(duree + 60).then(() => { fn(); return wait(80); }).then(() => { v.classList.remove('on'); });
  }
  function show(n, opts) {
    opts = opts || {};
    n = Math.max(0, Math.min(5, n)); if (n > State.unlocked) n = State.unlocked;
    if (courant && courant.unmount) { try { courant.unmount(); } catch (e) { } }
    SON.ronfleStop(); NARR.action(null); NARR.cacher(false);
    courantN = n; courant = Chapitres[n];
    root.innerHTML = courant.render(opts); root.className = 'scene ch-' + n;
    window.scrollTo(0, 0); updateFil(n); courant.mount(root, opts);
    try { history.replaceState(null, '', location.pathname + '#' + n); } catch (e) { }
  }

  // ---------- Chapitre 0 : accueil ----------
  const Ch0 = {
    render() {
      return `<section class="ch ch0">
  <div class="ciel">${A.cielSVG(State.nuit)}</div>
  <div class="ch0-texte">
    <h1 class="titre">La nuit de la Petite Souris</h1>
    <p class="sous">${esc(C.ville)} · ${esc(nuitTexte())}</p>
  </div>
  <a class="recommencer" href="?reset=1" title="Efface la progression (pour les parents)">Recommencer</a>
</section>`;
    },
    mount(r) {
      heure('—'); MUS.ambiance('accueil');
      NARR.dire(B(D.accueil));
      NARR.action(A.icone('lanterne') + ' ' + T(D.accueil.bouton), async () => {
        SON.unlock(); SON.play('lanterne');
        $('.ch0', r).classList.add('allume'); NARR.action(null);
        NARR.dire(B(D.accueilDepart), { vite: true });
        await wait(RM ? 150 : 1000);
        // Quenotte suit le chemin jusqu'à la maison, puis le rideau tombe
        const am = $('#am0', r); if (am && !RM) { try { am.beginElement(); } catch (e) { } }
        for (let i = 0; i < 6 && !RM; i++) { await wait(420); SON.play('pas'); }
        await wait(RM ? 100 : 600);
        complete(0);
        await fondu(() => show(1, { scene: State.unlocked > 1 ? 0 : State.scene }), 900);
      });
    },
  };

  // ---------- Chapitre 1 : le voyage en six scènes ----------
  const Ch1 = {
    render() { return `<section class="ch ch1" id="ch1"></section>`; },
    mount(r, opts) {
      const n = sceneDemande != null ? sceneDemande : (opts.scene != null ? opts.scene : Math.min(State.scene, 5));
      sceneDemande = null;
      window.SCENES.monter($('#ch1', r), {
        state: State, config: C, T, heure, etoile, toast, save,
        sceneFaite(i) { if (State.scene < i + 1) { State.scene = Math.min(5, i + 1); save(); } },
        fondu,
        finChapitre() { complete(1); badge('detective'); show(2); },
        scene13,
      }, n);
    },
    unmount() { window.SCENES.demonter(); },
  };

  function scene13() {
    const v = document.createElement('div'); v.className = 'voile';
    v.innerHTML = `<div class="scene13" role="dialog" aria-label="La treizième scène du Grand Marionnettiste">
      <div class="rideau g"></div><div class="rideau d"></div>
      <div class="s13-in"><div class="s13-titre">La 13<sup>e</sup> scène</div><div class="tableau" id="tab13"></div><p class="tab-txt" id="tab13-txt"></p>
      <div class="tab-actions"><button class="btn btn-grand btn-or" id="tab13-next">Suivant</button></div></div></div>`;
    document.body.appendChild(v);
    const tabs = D.scene13; let i = 0;
    const montre = () => { $('#tab13', v).innerHTML = A.tableau13(i); $('#tab13-txt', v).textContent = T(tabs[i]); $('#tab13-next', v).textContent = i < tabs.length - 1 ? 'Suivant' : 'Fermer le rideau'; };
    requestAnimationFrame(() => { v.classList.add('on'); setTimeout(() => v.classList.add('ouvert'), RM ? 0 : 500); });
    SON.play('papier'); montre();
    $('#tab13-next', v).onclick = () => {
      i++;
      if (i >= tabs.length) {
        v.classList.remove('ouvert');
        setTimeout(() => { v.remove(); if (!State.secret) { State.secret = true; save(); } badge('scene13'); }, RM ? 0 : 600);
      } else montre();
    };
  }

  // ---------- Chapitre 2 : 1, 2, 3, soleil avec le chat ----------
  const Ch2 = {
    render() {
      return `<section class="ch ch2">
  <h2 class="decor-titre"><span class="decor-heure">2 h 31</span>Chut ! ${esc(C.chat)} dort.</h2>
  <div class="jeu-wrap">${A.jeuSVG()}</div>
  <div class="jauge" aria-live="polite"><div class="jauge-in" id="jauge"></div><span id="fromages">Il reste 5 fromages</span></div>
  <button class="btn btn-grand btn-or btn-tenir" id="btn-avancer">${A.icone('patte')} Avancer <small>reste appuyé</small></button>
</section>`;
    },
    mount(r) {
      const svg = $('.jeu', r), souris = $('#jeu-souris', svg), chat = $('#chat', svg), bulle = $('#bulle', svg);
      const btn = $('#btn-avancer', r), jauge = $('#jauge', r), fromages = $('#fromages', r);
      const self = this; let p = 0, tient = false, etat = 'dort', pris = 0, gagne = false, sonne = false, dernier = null, pasT = 0, premierCycle = true;
      heure('02:31'); MUS.ambiance('jeu');
      NARR.dire(B(D.jeu.intro));
      const dis = (arr, expr) => NARR.dire({ txt: T(hasard(arr)), expr }, { vite: true });
      const setEtat = s => {
        etat = s; chat.setAttribute('data-etat', s);
        if (s === 'dort') { SON.ronfleStart(); if (!premierCycle) dis(D.jeu.dort, 'chuchote'); premierCycle = false; }
        else SON.ronfleStop();
        if (s === 'baille') { SON.play('baillement'); dis(D.jeu.baille, 'surprise'); }
        if (s === 'reveille') dis(D.jeu.reveille, 'surprise');
      };
      const cycle = () => {
        if (gagne) return; setEtat('dort');
        const base = pris >= 5 ? 6500 : 2800 + Math.random() * 2000;
        self.t = setTimeout(() => { if (gagne) return; setEtat('baille'); self.t = setTimeout(() => { if (gagne) return; setEtat('reveille'); self.t = setTimeout(cycle, 1700); }, 1000); }, base);
      };
      const rendu = () => {
        souris.setAttribute('transform', `translate(${(40 + p * 7.8).toFixed(1)},300)`);
        jauge.style.width = p + '%';
        const n = Math.ceil((100 - p) / 20); fromages.textContent = n <= 0 ? 'Arrivée !' : `Il reste ${n} fromage${n > 1 ? 's' : ''}`;
      };
      const vue = () => {
        sonne = true; pris++; p = Math.max(0, p - 12);
        bulle.classList.add('on'); souris.classList.add('boule'); SON.play('mmh');
        try { navigator.vibrate && navigator.vibrate(80); } catch (e) { }
        if (pris === 5) NARR.dire({ txt: T(D.jeu.trop), expr: 'clin' }, { vite: true }); else dis(D.jeu.vu, 'surprise');
        setTimeout(() => { bulle.classList.remove('on'); souris.classList.remove('boule'); sonne = false; }, 1200);
      };
      const victoire = () => {
        gagne = true; clearTimeout(self.t); SON.ronfleStop(); setEtat('dort'); SON.play('fanfare');
        btn.hidden = true; heure('02:40'); souris.classList.add('saute');
        NARR.dire(B(D.jeu.gagne));
        NARR.action(T(D.jeu.bouton) + ' ' + A.icone('suite'), () => { complete(2); badge('passechat'); show(3); });
      };
      const boucle = ts => {
        if (gagne) return;
        if (dernier == null) dernier = ts; const dt = Math.min(100, ts - dernier); dernier = ts;
        if (tient && !sonne) {
          if (etat === 'reveille') vue();
          else { p = Math.min(100, p + dt * 0.02); souris.classList.add('marche'); pasT += dt; if (pasT > 260) { pasT = 0; SON.play('pas'); } }
        } else souris.classList.remove('marche');
        rendu();
        if (p >= 100) { victoire(); return; }
        self.raf = requestAnimationFrame(boucle);
      };
      const down = e => { if (e.cancelable) e.preventDefault(); SON.unlock(); tient = true; btn.classList.add('on'); };
      const up = () => { tient = false; btn.classList.remove('on'); };
      btn.addEventListener('pointerdown', down);
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => btn.addEventListener(ev, up));
      btn.addEventListener('contextmenu', e => e.preventDefault());
      window.addEventListener('blur', up);
      document.addEventListener('keydown', self.kd = e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat && e.target === document.body) { down(e); } });
      document.addEventListener('keyup', self.ku = e => { if (e.key === ' ' || e.key === 'Enter') up(); });
      rendu(); cycle(); self.raf = requestAnimationFrame(boucle);
    },
    unmount() { clearTimeout(this.t); cancelAnimationFrame(this.raf); SON.ronfleStop(); document.removeEventListener('keydown', this.kd); document.removeEventListener('keyup', this.ku); },
  };

  // ---------- Chapitre 3 : la caméra de la souris ----------
  const Ch3 = {
    render() {
      return `<section class="ch ch3">
  <div class="barre"><h2 class="decor-titre"><span class="decor-heure">2 h 47</span>La caméra de ${esc(C.souris)}</h2><div class="actions"><button class="btn btn-petit" id="btn-passer">${A.icone('vite')} Passer</button><button class="btn btn-petit" id="btn-revoir" hidden>Revoir</button></div></div>
  <div class="cam" id="cam">
    <div class="cam-hud"><span class="rec">● REC</span><span class="cam-nom" id="cam-nom">CAM 1 · SALON</span><span class="cam-ts" id="cam-ts">${dateCam()} 02:47:00</span></div>
    ${A.camSVG()}
    <div class="dets" id="dets"></div>
    <div class="cam-grain" aria-hidden="true"></div>
    <div class="preuve"><span>PREUVE</span><small>FIN DE L'ENREGISTREMENT</small></div>
  </div>
</section>`;
    },
    mount(r) {
      const self = this, cam = $('#cam', r), dets = $('#dets', r), ts = $('#cam-ts', r), nom = $('#cam-nom', r);
      const cs1 = $('#cs1', r), cs2 = $('#cs2', r), bat = $('#bateau2', r), dent = $('#dent1', r), mot = $('#mot1', r), salon = $('#cam-salon', r), chambre = $('#cam-chambre', r);
      const lieu = (C.billet.lieu || 'sur la cheminée').toUpperCase();
      heure('02:47'); MUS.ambiance('camera');
      const mv = (el, x, y) => { el.style.transform = `translate(${x}px,${y}px)`; };
      const det = (id, label, l, t, w, h, mode) => {
        let d = $('#det-' + id, dets);
        if (!d) { d = document.createElement('div'); d.id = 'det-' + id; d.innerHTML = '<span></span>'; dets.appendChild(d); SON.play('bip'); }
        d.className = 'det' + (mode ? ' ' + mode : '');
        d.style.left = l + '%'; d.style.top = t + '%'; d.style.width = w + '%'; d.style.height = h + '%';
        d.querySelector('span').textContent = label;
      };
      const rm = id => { const d = $('#det-' + id, dets); if (d) d.remove(); };
      const instant = () => cam.classList.contains('instant');
      // Quenotte chuchote : le film se met en pause jusqu'à un toucher sur le bandeau
      let pause = false, pauseA = 0;
      const chuchote = b => {
        if (instant()) return;
        pause = true; pauseA = performance.now(); cancelAnimationFrame(self.raf);
        NARR.dire(B(b)).then(() => NARR.attendre()).then(ok => {
          if (!pause || !ok || fini) return;
          pause = false; debut += performance.now() - pauseA; self.raf = requestAnimationFrame(boucle);
        });
      };
      const evenements = [
        [0.3, () => { mv(cs2, -90, 200); mv(bat, -40, 236); mv(cs1, -90, 232); }],
        [0.6, () => chuchote(D.camera.intro)],
        [1.4, () => det('cheminee', 'CHEMINÉE – ÉTEINTE', 25, 40, 50, 43, 'bas')],
        [2.6, () => { mv(cs2, 40, 200); mv(bat, 90, 236); SON.play('pas'); }],
        [4.6, () => det('souris', 'PETITE SOURIS – 99 %', 10, 66, 20, 20)],
        [6.2, () => { mv(cs2, 70, 56); mv(bat, 120, 92); SON.play('pas'); rm('cheminee'); }],
        [8.2, () => { mv(bat, 160, 84); det('souris', 'PETITE SOURIS – 99 %', 17, 18, 20, 20); }],
        [9.6, () => { det('bateau', 'BILLET 5 € – SÈCHE ' + lieu, 38, 26, 30, 12); chuchote(D.camera.cheminee); }],
        [12.5, () => { cs2.classList.add('coucou'); det('souris', 'PETITE SOURIS – 100 % (COUCOU)', 17, 18, 20, 20); }],
        [14.5, () => { cs2.classList.remove('coucou'); mv(cs2, -90, 200); SON.play('pas'); rm('souris'); }],
        [16, () => { salon.setAttribute('hidden', ''); chambre.removeAttribute('hidden'); nom.textContent = 'CAM 2 · CHAMBRE'; dets.innerHTML = ''; SON.play('bip'); chuchote(D.camera.chambre); }],
        [17, () => det('clem', (C.enfant + ' – DORT').toUpperCase(), 22, 46, 34, 26)],
        [18.2, () => det('nico', (C.poupee + ' – DORT AUSSI').toUpperCase(), 48, 50, 20, 18, 'bas')],
        [19.6, () => { mv(cs1, 60, 232); SON.play('pas'); }],
        [21.6, () => det('souris', 'PETITE SOURIS – 99 %', 14, 76, 20, 20)],
        [23.4, () => { mv(cs1, 32, 118); SON.play('pas'); }],
        [25.4, () => det('souris', 'PETITE SOURIS – 99 %', 7, 38, 20, 20)],
        [26.6, () => { dent.classList.add('prise'); chuchote(D.camera.dent); }],
        [27.4, () => det('dent', 'DENT – TROUVÉE', 26, 54, 8, 8)],
        [29.4, () => { mot.classList.add('pose'); SON.play('papier'); rm('dent'); det('mot', 'PETIT MOT – SOUS L\'OREILLER', 24, 54, 10, 8); }],
        [31.6, () => det('nico', (C.poupee + ' – RONFLE UN PEU').toUpperCase(), 48, 50, 20, 18, 'bas')],
        [33.4, () => { mv(cs1, 170, 236); SON.play('pas'); rm('mot'); det('souris', 'PETITE SOURIS – 99 %', 42, 78, 20, 20); }],
        [35.4, () => det('lit', 'SOUS LE LIT – MONSTRES : 0', 14, 79, 26, 7)],
        [37.4, () => det('chaussette', 'CHAUSSETTE – PERDUE DEPUIS MARDI', 4, 86, 12, 10, 'droite')],
        [39.4, () => { mv(cs1, -90, 236); SON.play('pas'); rm('souris'); chuchote(D.camera.fin); }],
        [42, () => { cam.classList.add('fin'); $('#btn-passer', r).hidden = true; $('#btn-revoir', r).hidden = false; SON.play('alerte'); heure('02:52'); NARR.action(T(D.camera.bouton) + ' ' + A.icone('suite'), () => { complete(3); badge('hibou'); show(4); }); }],
      ];
      const finAt = evenements[evenements.length - 1][0];
      let debut = null, idx = 0, fini = false;
      const horo = s => { const t = 2 * 3600 + 47 * 60 + Math.floor(s * 7); ts.textContent = dateCam() + ' ' + pad(Math.floor(t / 3600)) + ':' + pad(Math.floor(t / 60) % 60) + ':' + pad(t % 60); heure(pad(Math.floor(t / 3600)) + ':' + pad(Math.floor(t / 60) % 60)); };
      const boucle = now => {
        if (fini) return; if (debut == null) debut = now - tTest * 1000;
        const s = (now - debut) / 1000;
        while (idx < evenements.length && s >= evenements[idx][0] && !pause) evenements[idx++][1]();
        horo(Math.min(s, finAt));
        if (idx >= evenements.length) { fini = true; return; }
        if (pause) return;
        self.raf = requestAnimationFrame(boucle);
      };
      const lancer = () => {
        cancelAnimationFrame(self.raf); fini = false; debut = null; idx = 0; pause = false;
        cam.classList.remove('fin'); cam.classList.add('instant'); dets.innerHTML = ''; NARR.action(null);
        chambre.setAttribute('hidden', ''); salon.removeAttribute('hidden'); nom.textContent = 'CAM 1 · SALON'; dent.classList.remove('prise'); mot.classList.remove('pose'); cs2.classList.remove('coucou');
        evenements[0][1](); $('#btn-passer', r).hidden = false; $('#btn-revoir', r).hidden = true;
        requestAnimationFrame(() => { cam.classList.remove('instant'); self.raf = requestAnimationFrame(boucle); });
      };
      const passer = () => { cancelAnimationFrame(self.raf); pause = false; cam.classList.add('instant'); while (idx < evenements.length) evenements[idx++][1](); horo(finAt); fini = true; NARR.dire(B(D.camera.fin), { vite: 'instant' }); };
      $('#btn-passer', r).onclick = () => { SON.unlock(); passer(); };
      $('#btn-revoir', r).onclick = () => lancer();
      lancer();
      if (RM || tTest > 0) requestAnimationFrame(() => cam.classList.add('instant'));
    },
    unmount() { cancelAnimationFrame(this.raf); },
  };

  // ---------- Chapitre 4 : la lettre ----------
  const Ch4 = {
    lignes() {
      const l = D.lettre.map(T).filter(Boolean);
      l.push(T(D.signature)); l.push(D.heureLettre); l.push(T(D.ps));
      return l;
    },
    render() {
      return `<section class="ch ch4">
  <div class="barre"><h2 class="decor-titre"><span class="decor-heure">3 h 02</span>Une lettre pour ${esc(C.enfant)}</h2><div class="actions"><button class="btn btn-petit" id="btn-tout" hidden>Tout montrer</button></div></div>
  <div class="env-stage" id="env-stage">${A.enveloppeSVG(esc(C.enfant))}</div>
  <div class="lettre-stage" id="lettre-stage" hidden>
    <div class="papier" id="papier"></div>
    <p class="lire-avec">${A.icone('etoile')} ${esc(T(D.lireAvec))}</p>
  </div>
</section>`;
    },
    mount(r) {
      const self = this, lignes = this.lignes(), papier = $('#papier', r);
      heure('03:02'); MUS.ambiance('lettre');
      NARR.dire(B(D.lettreIntro));
      let ecrit = false;
      const n = lignes.length;
      const els = lignes.map((l, i) => { const p = document.createElement('p'); p.className = 'ligne' + (i === n - 3 || i === n - 2 ? ' sign' : '') + (i === n - 1 ? ' ps' : ''); p.dataset.txt = l; papier.appendChild(p); return p; });
      const termine = () => { $('#btn-tout', r).hidden = true; NARR.cacher(false); NARR.dire(B(D.lettreFin)); NARR.action(A.icone('etoile') + ' ' + T(D.boutonLettre), () => { complete(4); badge('amie'); show(5); }); };
      const montreTout = () => { if (ecrit) return; ecrit = true; clearTimeout(self.t); els.forEach(p => { p.textContent = p.dataset.txt; p.classList.add('vue'); }); termine(); };
      // La lettre s'écrit lentement, mot par mot, en très gros caractères
      const ecrire = () => {
        let i = 0, j = 0, mots = [];
        const pas = () => {
          if (ecrit) return;
          if (i >= els.length) { ecrit = true; termine(); return; }
          if (j === 0) { mots = els[i].dataset.txt.split(' '); els[i].classList.add('vue'); }
          if (j < mots.length) { els[i].textContent = mots.slice(0, j + 1).join(' '); SON.play('crayon'); j++; self.t = setTimeout(pas, RM ? 60 : 300); }
          else { i++; j = 0; self.t = setTimeout(pas, RM ? 100 : 700); }
        };
        pas();
      };
      const ouvrir = () => {
        const env = $('.env', r); if (env.classList.contains('ouverte')) return;
        SON.unlock(); SON.play('cachet'); env.classList.add('ouverte');
        setTimeout(() => { $('#env-stage', r).hidden = true; $('#lettre-stage', r).hidden = false; $('#btn-tout', r).hidden = false; SON.play('papier'); NARR.cacher(true); ecrire(); }, RM ? 150 : 1100);
      };
      const cachet = $('#cachet', r);
      cachet.addEventListener('click', ouvrir); cachet.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(); } });
      $('#btn-tout', r).onclick = montreTout;
      if (tTest > 0) { $('.env', r).classList.add('ouverte'); $('#env-stage', r).hidden = true; $('#lettre-stage', r).hidden = false; montreTout(); }
    },
    unmount() { clearTimeout(this.t); NARR.cacher(false); },
  };

  // ---------- Chapitre 5 : le certificat ----------
  const Ch5 = {
    render() {
      const qs = 'badges=' + encodeURIComponent(State.badges.join(',')) + '&secret=' + (State.secret ? 1 : 0) + '&nuit=' + State.nuit + '&etoiles=' + nbEtoiles();
      return `<section class="ch ch5">
  <h2 class="decor-titre"><span class="decor-heure">3 h 40</span>Bravo ${esc(C.enfant)} !</h2>
  <div class="confettis" aria-hidden="true"></div>
  <div class="diplome-wrap">${window.CERTIFICAT.html({ badges: State.badges.concat(State.badges.indexOf('jumelle') < 0 ? ['jumelle'] : []), secret: State.secret, nuitTexte: nuitTexte(), etoiles: nbEtoiles(), total: totalEtoiles })}</div>
  <div class="fin">
    <a class="btn btn-grand btn-or" id="btn-imprimer" href="certificat.html?${qs}" target="_blank" rel="noopener">${A.icone('imprimer')} Imprimer le diplôme</a>
    <button class="btn btn-grand btn-petit" id="btn-billet" ${State.badges.indexOf('billet') >= 0 ? 'hidden' : ''}>${A.icone('billet')} J'ai trouvé mon billet !</button>
    <button class="btn btn-petit" id="btn-revoir5">Revoir l'histoire</button>
  </div>
</section>`;
    },
    mount(r) {
      heure('03:40'); MUS.ambiance('diplome');
      const premiere = !State.fini;
      complete(5); if (premiere) { State.fini = true; save(); }
      badge('jumelle');
      if (premiere) SON.play('fanfare');
      NARR.dire(B(D.diplome));
      if (!RM) { const c = $('.confettis', r); const couleurs = ['#FFC857', '#D64045', '#F2A3B5', '#3E7C8F', '#F3EFE6']; for (let i = 0; i < 40; i++) { const s = document.createElement('i'); s.style.left = (Math.random() * 100) + '%'; s.style.background = couleurs[i % couleurs.length]; s.style.animationDelay = (Math.random() * 2.5) + 's'; s.style.animationDuration = (3 + Math.random() * 3) + 's'; c.appendChild(s); } }
      $('#btn-billet', r).onclick = () => { badge('billet'); NARR.dire(B(D.billetTrouve)); show(5); };
      $('#btn-revoir5', r).onclick = () => show(1, { scene: 0 });
    },
  };

  const Chapitres = [Ch0, Ch1, Ch2, Ch3, Ch4, Ch5];

  // ---------- Démarrage ----------
  document.body.insertAdjacentHTML('afterbegin', A.symboles());
  NARR.init();
  buildFil();
  // Premier toucher : on autorise les sons et on lance la musique d'ambiance
  const GESTES = ['pointerdown', 'touchend', 'click', 'keydown'];
  const premierGeste = () => { SON.unlock(); MUS.demarrer(); GESTES.forEach(g => document.removeEventListener(g, premierGeste)); };
  GESTES.forEach(g => document.addEventListener(g, premierGeste));

  const h = parseInt((location.hash || '').slice(1), 10);
  if (demande != null) show(demande);
  else if (!isNaN(h) && h > 0 && h <= State.unlocked) show(Math.min(5, h));
  else show(0);
  window.addEventListener('hashchange', () => { const n = parseInt((location.hash || '').slice(1), 10); if (!isNaN(n) && n !== courantN && n <= State.unlocked) show(n); });

  // Exposé pour les tests
  window.APP = { show, state: State, nuitTexte };
})();
