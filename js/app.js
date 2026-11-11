// La nuit de la Petite Souris — application (chapitres, progression, fil rouge)
(function () {
  'use strict';
  const C = window.CONFIG, D = window.DATA, A = window.ART, SON = window.SON, VOIX = window.VOIX;
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  function T(s) {
    return String(s).replace(/\{(\w+)\}/g, (m, k) => {
      if (k === 'lieuBillet') return C.billet.lieu;
      if (k === 'ligneBillet') return T(C.billet.bateau ? D.ligneBilletBateau : D.ligneBilletSimple);
      return C[k] != null ? C[k] : m;
    });
  }

  // ---------- Progression (mémorisée en local) ----------
  const KEY = 'souris.v1';
  const State = { unlocked: 0, badges: [], secret: false, nuit: null, fini: false };
  function calcNuit() { const d = new Date(); if (d.getHours() < 12) d.setDate(d.getDate() - 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function load() {
    try { Object.assign(State, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { }
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

  // Paramètres d'adresse pour tester : ?reset=1 efface tout, ?chapitre=3 débloque jusqu'au chapitre 3
  const params = new URLSearchParams(location.search);
  if (params.has('reset')) {
    try { localStorage.removeItem(KEY); localStorage.removeItem('souris.muet'); } catch (e) { }
    location.replace(location.pathname); return;
  }
  load();
  // ?t=30 (tests) : avance de 30 secondes dans le chapitre ouvert (carte, caméra, lettre)
  const tTest = Math.max(0, parseFloat(params.get('t')) || 0);
  let demande = null;
  if (params.has('chapitre')) {
    const n = Math.max(0, Math.min(5, parseInt(params.get('chapitre'), 10) || 0));
    State.unlocked = Math.max(State.unlocked, n); save(); demande = n;
    try { history.replaceState(null, '', location.pathname + '#' + n); } catch (e) { }
  }

  // ---------- Fil rouge, heure, son, toasts ----------
  const root = $('#scene');
  let courant = null, courantN = 0;
  function heure(t) { $('#heure').textContent = t; }
  function toast(txt, icone) {
    const el = $('#toast');
    el.innerHTML = `<div class="toast-in">${icone || ''}<span>${esc(txt)}</span></div>`;
    el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 3400);
  }
  function badge(id) {
    const b = D.badges.find(x => x.id === id);
    if (!b || State.badges.indexOf(id) >= 0) return;
    State.badges.push(id); save();
    toast('Badge gagné : ' + T(b.nom), A.badgeIcone(id, 36)); SON.play('badge');
  }
  function complete(n) { if (State.unlocked < n + 1) { State.unlocked = n + 1; save(); } }
  function buildFil() {
    const perles = [1, 2, 3, 4, 5].map(i => `<button class="perle" data-n="${i}" aria-label="Chapitre ${i}"><span>${i}</span></button>`).join('');
    $('#fil').innerHTML = `<div class="fil-in">
      <div class="ruban" aria-label="Progression de l'histoire"><div class="fil-ligne"></div>${perles}<div class="fil-souris"><svg viewBox="0 0 130 100"><use href="#souris-side"/></svg></div></div>
      <div class="heure" id="heure" aria-label="Heure dans l'histoire">—</div>
      <button class="btn-ico" id="btn-son" aria-label="Couper ou remettre le son">${A.icone(SON.muet ? 'muet' : 'son')}</button>
    </div>`;
    $('#btn-son').onclick = () => { SON.unlock(); const m = SON.toggle(); $('#btn-son').innerHTML = A.icone(m ? 'muet' : 'son'); toast(m ? 'Son coupé' : 'Son activé'); };
    $$('.perle').forEach(p => p.onclick = () => { const n = +p.dataset.n; if (n <= State.unlocked) show(n); else toast('Termine d\'abord le chapitre ' + (n - 1) + ' !'); });
  }
  function updateFil(n) {
    $$('.perle').forEach(p => { const i = +p.dataset.n; p.classList.toggle('faite', i < State.unlocked); p.classList.toggle('active', i === n); p.classList.toggle('ouverte', i <= State.unlocked); });
    const s = $('.fil-souris'); if (s) s.style.left = n === 0 ? '6%' : [16, 33, 50, 67, 84][n - 1] + '%';
    document.body.dataset.chapitre = n;
  }
  function show(n) {
    n = Math.max(0, Math.min(5, n)); if (n > State.unlocked) n = State.unlocked;
    if (courant && courant.unmount) { try { courant.unmount(); } catch (e) { } }
    VOIX.stop(); SON.ronfleStop();
    courantN = n; courant = Chapitres[n];
    root.innerHTML = courant.render(); root.className = 'scene ch-' + n;
    window.scrollTo(0, 0); updateFil(n); courant.mount(root);
    try { history.replaceState(null, '', location.pathname + '#' + n); } catch (e) { }
  }
  function boutonEcouter(r, id, lignes) {
    const b = $(id, r); if (!b) return;
    b.onclick = () => {
      SON.unlock();
      const ok = VOIX.parler(typeof lignes === 'function' ? lignes() : lignes, { onFin: () => b.classList.remove('parle') });
      if (ok) b.classList.add('parle'); else toast('Pas de voix disponible sur cet appareil');
    };
  }

  // ---------- Chapitre 0 : accueil ----------
  const Ch0 = {
    render() {
      return `<section class="ch ch0">
  <div class="ciel">${A.cielSVG(State.nuit)}</div>
  <div class="ch0-texte">
    <h1 class="titre">${esc(T('{enfant}, quelqu\'un est venu cette nuit…'))}</h1>
    <p class="sous">${esc(C.ville)} · ${esc(nuitTexte())}</p>
    <button class="btn btn-grand btn-or" id="btn-start">${A.icone('lanterne')} ${State.unlocked > 0 ? 'Rallumer la lanterne' : 'Allumer la lanterne'}</button>
    <button class="btn btn-petit" id="btn-ecouter0">${A.icone('hp')} Écouter</button>
  </div>
  <a class="recommencer" href="?reset=1" title="Efface la progression (pour les parents)">Recommencer</a>
</section>`;
    },
    mount(r) {
      heure('—');
      boutonEcouter(r, '#btn-ecouter0', D.ecouter[0].map(T));
      $('#btn-start', r).onclick = async () => {
        SON.unlock(); VOIX.chauffer(); SON.play('lanterne');
        $('.ch0', r).classList.add('allume');
        await wait(RM ? 150 : 1100);
        complete(0); show(Math.min(5, Math.max(1, State.unlocked)));
      };
    },
  };

  // ---------- Chapitre 1 : le suivi sur la carte ----------
  const Ch1 = {
    render() {
      return `<section class="ch ch1">
  <div class="barre"><h2>Le voyage de ${esc(C.souris)}</h2><div class="actions"><button class="btn btn-petit" id="btn-ecouter1">${A.icone('hp')} Écouter</button><button class="btn btn-petit" id="btn-vite">${A.icone('vite')} Plus vite</button></div></div>
  <div class="carte-wrap">${A.carteSVG(State.nuit)}</div>
  <ol class="journal" id="journal" aria-live="polite"></ol>
  <div class="fin" id="fin1" hidden>
    <p class="alerte-txt">${A.icone('patte')} 02:31 · ${esc(C.chat)} bloque le passage !</p>
    <button class="btn btn-grand btn-rouge" id="btn-aider">Aider ${esc(C.souris)} !</button>
  </div>
</section>`;
    },
    mount(r) {
      const svg = $('.carte', r), trajet = $('#trajet', svg), marqueur = $('#marqueur', svg), bateau = $('#bateau', svg);
      const L = trajet.getTotalLength(), statuts = D.statuts, journal = $('#journal', r);
      const dur = C.durees.suivi * 1000;
      let f = 0, montre = 0, vitesse = 1, dernier = null, fini = false;
      const self = this;
      const pos = fr => {
        const p = trajet.getPointAtLength(fr * L);
        marqueur.setAttribute('transform', `translate(${(p.x - 42).toFixed(1)},${(p.y - 58).toFixed(1)})`);
        const eau = p.x > 728 && p.x < 822;
        bateau.classList.toggle('on', eau);
        if (eau) bateau.setAttribute('transform', `translate(${(p.x - 35).toFixed(1)},${(p.y - 14).toFixed(1)})`);
        marqueur.classList.toggle('flotte', eau);
      };
      const heureA = fr => {
        let i = 0; while (i < statuts.length - 1 && statuts[i + 1].f <= fr) i++;
        const a = statuts[i], b = statuts[Math.min(i + 1, statuts.length - 1)];
        const [ha, ma] = a.t.split(':').map(Number), [hb, mb] = b.t.split(':').map(Number);
        const ta = ha * 60 + ma, tb = hb * 60 + mb, k = b.f > a.f ? (fr - a.f) / (b.f - a.f) : 0;
        const m = Math.round(ta + (tb - ta) * Math.max(0, Math.min(1, k)));
        return pad(Math.floor(m / 60)) + ':' + pad(m % 60);
      };
      const ajoute = s => {
        const li = document.createElement('li'); if (s.alerte) li.className = 'alerte';
        li.innerHTML = `<time>${s.t}</time><span>${esc(T(s.txt))}</span>`;
        journal.appendChild(li); journal.scrollTop = journal.scrollHeight;
        SON.play(s.alerte ? 'alerte' : 'clic');
      };
      const termine = () => {
        fini = true; heure('02:31'); $('#fin1', r).hidden = false; $('#btn-vite', r).hidden = true;
        marqueur.classList.add('tremble');
        $('#fin1', r).scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'end' });
      };
      const tick = ts => {
        if (fini) return;
        if (dernier == null) dernier = ts;
        f = Math.min(1, f + (ts - dernier) * vitesse / dur); dernier = ts;
        if (!RM) pos(f);
        while (montre < statuts.length && f >= statuts[montre].f) { const s = statuts[montre++]; if (RM) pos(s.f); ajoute(s); }
        heure(heureA(f));
        if (f >= 1) { termine(); return; }
        self.raf = requestAnimationFrame(tick);
      };
      f = Math.min(1, tTest * 1000 / dur); pos(f); heure(statuts[0].t);
      self.raf = requestAnimationFrame(tick);
      $('#btn-vite', r).onclick = e => { SON.unlock(); vitesse = vitesse === 1 ? 4 : 1; e.currentTarget.classList.toggle('on', vitesse > 1); e.currentTarget.innerHTML = A.icone('vite') + (vitesse > 1 ? ' Normal' : ' Plus vite'); };
      boutonEcouter(r, '#btn-ecouter1', () => statuts.slice(Math.max(0, montre - 3), montre).map(s => T(s.tts || s.txt)));
      $('#btn-aider', r).onclick = () => { complete(1); badge('detective'); show(2); };
      // Chapitre secret : toucher 3 fois le Grand Marionnettiste
      if (C.secret) {
        let taps = 0, tt = null; const m = $('#marionnettiste', svg);
        const tap = () => { SON.unlock(); taps++; m.classList.add('pouss'); setTimeout(() => m.classList.remove('pouss'), 250); clearTimeout(tt); tt = setTimeout(() => { taps = 0; }, 2500); if (taps >= 3) { taps = 0; scene13(); } };
        m.addEventListener('click', tap); m.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(); } });
      }
    },
    unmount() { cancelAnimationFrame(this.raf); },
  };

  function scene13() {
    const v = document.createElement('div'); v.className = 'voile';
    v.innerHTML = `<div class="scene13" role="dialog" aria-label="La treizième scène du Grand Marionnettiste">
      <div class="rideau g"></div><div class="rideau d"></div>
      <div class="s13-in"><div class="s13-titre">La 13<sup>e</sup> scène</div><div class="tableau" id="tab13"></div><p class="tab-txt" id="tab13-txt"></p>
      <div class="tab-actions"><button class="btn btn-petit" id="tab13-ecouter">${A.icone('hp')} Écouter</button><button class="btn btn-grand btn-or" id="tab13-next">Suivant</button></div></div></div>`;
    document.body.appendChild(v);
    const tabs = D.scene13; let i = 0;
    const montre = () => { $('#tab13', v).innerHTML = A.tableau13(i); $('#tab13-txt', v).textContent = T(tabs[i]); $('#tab13-next', v).textContent = i < tabs.length - 1 ? 'Suivant' : 'Fermer le rideau'; VOIX.parler(T(tabs[i])); };
    requestAnimationFrame(() => { v.classList.add('on'); setTimeout(() => v.classList.add('ouvert'), RM ? 0 : 500); });
    SON.play('papier'); montre();
    $('#tab13-ecouter', v).onclick = () => VOIX.parler(T(tabs[i]));
    $('#tab13-next', v).onclick = () => {
      i++;
      if (i >= tabs.length) {
        v.classList.remove('ouvert'); VOIX.stop();
        setTimeout(() => { v.remove(); if (!State.secret) { State.secret = true; save(); } badge('scene13'); }, RM ? 0 : 600);
      } else montre();
    };
  }

  // ---------- Chapitre 2 : 1, 2, 3, soleil avec le chat ----------
  const Ch2 = {
    render() {
      return `<section class="ch ch2">
  <div class="barre"><h2>Chut ! ${esc(C.chat)} dort.</h2><div class="actions"><button class="btn btn-petit" id="btn-ecouter2">${A.icone('hp')} Écouter</button></div></div>
  <p class="consigne" id="consigne">${esc(T(D.jeu.consigne))}</p>
  <div class="jeu-wrap">${A.jeuSVG()}</div>
  <div class="jauge" aria-live="polite"><div class="jauge-in" id="jauge"></div><span id="fromages">Il reste 5 fromages</span></div>
  <button class="btn btn-grand btn-or btn-tenir" id="btn-avancer">${A.icone('patte')} Avancer <small>reste appuyé</small></button>
  <div class="fin" id="fin2" hidden><p class="bravo">${esc(T(D.jeu.gagne))} <span class="h">02:40</span></p><button class="btn btn-grand btn-or" id="btn-suite2">Voir la caméra</button></div>
</section>`;
    },
    mount(r) {
      const svg = $('.jeu', r), souris = $('#jeu-souris', svg), chat = $('#chat', svg), bulle = $('#bulle', svg);
      const btn = $('#btn-avancer', r), jauge = $('#jauge', r), fromages = $('#fromages', r);
      const self = this; let p = 0, tient = false, etat = 'dort', pris = 0, gagne = false, sonne = false, dernier = null, pasT = 0;
      heure('02:31');
      const setEtat = s => { etat = s; chat.setAttribute('data-etat', s); if (s === 'dort') SON.ronfleStart(); else SON.ronfleStop(); if (s === 'baille') SON.play('baillement'); };
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
        if (pris === 5) { $('#consigne', r).textContent = T(D.jeu.trop); }
        setTimeout(() => { bulle.classList.remove('on'); souris.classList.remove('boule'); sonne = false; }, 1200);
      };
      const victoire = () => {
        gagne = true; clearTimeout(self.t); SON.ronfleStop(); setEtat('dort'); SON.play('fanfare');
        btn.hidden = true; $('#fin2', r).hidden = false; heure('02:40'); souris.classList.add('saute');
        $('#fin2', r).scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'end' });
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
      document.addEventListener('keydown', self.kd = e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { down(e); } });
      document.addEventListener('keyup', self.ku = e => { if (e.key === ' ' || e.key === 'Enter') up(); });
      boutonEcouter(r, '#btn-ecouter2', D.ecouter[2].map(T));
      $('#btn-suite2', r).onclick = () => { complete(2); badge('passechat'); show(3); };
      rendu(); cycle(); self.raf = requestAnimationFrame(boucle);
    },
    unmount() { clearTimeout(this.t); cancelAnimationFrame(this.raf); SON.ronfleStop(); document.removeEventListener('keydown', this.kd); document.removeEventListener('keyup', this.ku); },
  };

  // ---------- Chapitre 3 : la caméra de la souris ----------
  const Ch3 = {
    render() {
      return `<section class="ch ch3">
  <div class="barre"><h2>La caméra de ${esc(C.souris)}</h2><div class="actions"><button class="btn btn-petit" id="btn-ecouter3">${A.icone('hp')} Écouter</button><button class="btn btn-petit" id="btn-passer">${A.icone('vite')} Passer</button></div></div>
  <p class="consigne">Filmé pour ${esc(C.enfant)}, cette nuit, avec la petite caméra du sac à dos.</p>
  <div class="cam" id="cam">
    <div class="cam-hud"><span class="rec">● REC</span><span class="cam-nom" id="cam-nom">CAM 1 · CHAMBRE</span><span class="cam-ts" id="cam-ts">${dateCam()} 02:47:00</span></div>
    ${A.camSVG()}
    <div class="dets" id="dets"></div>
    <div class="cam-grain" aria-hidden="true"></div>
    <div class="preuve"><span>PREUVE</span><small>FIN DE L'ENREGISTREMENT</small></div>
  </div>
  <div class="fin" id="fin3" hidden><button class="btn btn-petit" id="btn-revoir">Revoir</button><button class="btn btn-grand btn-or" id="btn-suite3">Lire la lettre</button></div>
</section>`;
    },
    mount(r) {
      const self = this, cam = $('#cam', r), dets = $('#dets', r), ts = $('#cam-ts', r), nom = $('#cam-nom', r);
      const cs1 = $('#cs1', r), cs2 = $('#cs2', r), bat = $('#bateau2', r), dent = $('#dent1', r), cam1 = $('#cam1', r), cam2 = $('#cam2', r);
      const bateau = C.billet.bateau, lieu = (C.billet.lieu || '').toUpperCase();
      const mv = (el, x, y) => { el.style.transform = `translate(${x}px,${y}px)`; };
      const det = (id, label, l, t, w, h, mode) => {
        let d = $('#det-' + id, dets);
        if (!d) { d = document.createElement('div'); d.id = 'det-' + id; d.innerHTML = '<span></span>'; dets.appendChild(d); SON.play('bip'); }
        d.className = 'det' + (mode ? ' ' + mode : '');
        d.style.left = l + '%'; d.style.top = t + '%'; d.style.width = w + '%'; d.style.height = h + '%';
        d.querySelector('span').textContent = label;
      };
      const rm = id => { const d = $('#det-' + id, dets); if (d) d.remove(); };
      const evenements = [
        [0.3, () => { mv(cs1, -90, 232); mv(cs2, -90, 200); mv(bat, -40, 236); }],
        [0.8, () => det('clem', (C.enfant + ' – DORT').toUpperCase(), 22, 46, 34, 26)],
        [1.8, () => det('nico', (C.poupee + ' – DORT AUSSI').toUpperCase(), 48, 50, 20, 18, 'bas')],
        [3, () => { mv(cs1, 60, 232); SON.play('pas'); }],
        [5.2, () => det('souris', 'PETITE SOURIS – 99 %', 14, 76, 20, 20)],
        [8, () => { mv(cs1, 32, 118); SON.play('pas'); }],
        [10.2, () => det('souris', 'PETITE SOURIS – 99 %', 7, 38, 20, 20)],
        [11.5, () => { dent.classList.add('prise'); }],
        [12.3, () => det('dent', 'DENT – TROUVÉE', 26, 54, 8, 8)],
        [15, () => det('nico', (C.poupee + ' – RONFLE UN PEU').toUpperCase(), 48, 50, 20, 18, 'bas')],
        [17, () => { mv(cs1, 170, 236); SON.play('pas'); rm('dent'); det('souris', 'PETITE SOURIS – 99 %', 42, 78, 20, 20); }],
        [19, () => det('lit', 'SOUS LE LIT – MONSTRES : 0', 14, 79, 26, 7)],
        [21.5, () => det('chaussette', 'CHAUSSETTE – PERDUE DEPUIS MARDI', 4, 86, 12, 10, 'droite')],
        [24, () => { mv(cs1, -90, 236); SON.play('pas'); rm('souris'); }],
        [25.5, () => {
          if (bateau) { cam1.setAttribute('hidden', ''); cam2.removeAttribute('hidden'); nom.textContent = 'CAM 2 · SALON'; dets.innerHTML = ''; SON.play('bip'); }
          else { det('billet', 'BILLET 5 € – DÉPOSÉ ' + lieu, 14, 48, 18, 10); }
        }],
        [26.5, () => { if (bateau) { mv(cs2, 40, 200); mv(bat, 90, 236); SON.play('pas'); } }],
        [28.5, () => { if (bateau) det('souris', 'PETITE SOURIS – 99 %', 10, 66, 20, 20); }],
        [29.5, () => { if (bateau) { mv(cs2, 70, 56); mv(bat, 120, 92); SON.play('pas'); } }],
        [31.5, () => { if (bateau) { mv(bat, 160, 84); det('souris', 'PETITE SOURIS – 99 %', 17, 18, 20, 20); } }],
        [33, () => { if (bateau) det('bateau', 'BATEAU-BILLET – SÈCHE ' + lieu, 38, 26, 30, 12); }],
        [35, () => { if (bateau) { cs2.classList.add('coucou'); det('souris', 'PETITE SOURIS – 100 % (COUCOU)', 17, 18, 20, 20); } }],
        [37.5, () => { if (bateau) { cs2.classList.remove('coucou'); mv(cs2, -90, 200); SON.play('pas'); rm('souris'); } }],
        [40, () => { cam.classList.add('fin'); $('#fin3', r).hidden = false; $('#btn-passer', r).hidden = true; SON.play('alerte'); heure('02:52'); }],
      ];
      const finAt = evenements[evenements.length - 1][0];
      let debut = null, idx = 0, fini = false;
      const horo = s => { const t = 2 * 3600 + 47 * 60 + Math.floor(s * 7); ts.textContent = dateCam() + ' ' + pad(Math.floor(t / 3600)) + ':' + pad(Math.floor(t / 60) % 60) + ':' + pad(t % 60); heure(pad(Math.floor(t / 3600)) + ':' + pad(Math.floor(t / 60) % 60)); };
      const boucle = now => {
        if (fini) return; if (debut == null) debut = now - tTest * 1000;
        const s = (now - debut) / 1000;
        while (idx < evenements.length && s >= evenements[idx][0]) evenements[idx++][1]();
        horo(Math.min(s, finAt));
        if (idx >= evenements.length) { fini = true; return; }
        self.raf = requestAnimationFrame(boucle);
      };
      const lancer = () => {
        cancelAnimationFrame(self.raf); fini = false; debut = null; idx = 0;
        cam.classList.remove('fin'); cam.classList.add('instant'); dets.innerHTML = '';
        cam2.setAttribute('hidden', ''); cam1.removeAttribute('hidden'); nom.textContent = 'CAM 1 · CHAMBRE'; dent.classList.remove('prise'); cs2.classList.remove('coucou');
        evenements[0][1](); $('#fin3', r).hidden = true; $('#btn-passer', r).hidden = false;
        requestAnimationFrame(() => { cam.classList.remove('instant'); self.raf = requestAnimationFrame(boucle); });
      };
      const passer = () => { cancelAnimationFrame(self.raf); cam.classList.add('instant'); while (idx < evenements.length) evenements[idx++][1](); horo(finAt); fini = true; };
      $('#btn-passer', r).onclick = () => { SON.unlock(); passer(); };
      $('#btn-revoir', r).onclick = () => lancer();
      boutonEcouter(r, '#btn-ecouter3', D.ecouter[3].map(T));
      $('#btn-suite3', r).onclick = () => { complete(3); badge('hibou'); show(4); };
      lancer();
      if (RM || tTest > 0) requestAnimationFrame(() => cam.classList.add('instant'));
    },
    unmount() { cancelAnimationFrame(this.raf); },
  };

  // ---------- Chapitre 4 : la lettre ----------
  const Ch4 = {
    lignes() {
      const l = D.lettre.map(T).filter(Boolean);
      l.push(T(D.signature));
      l.push(D.heureLettre);
      l.push(T(D.ps));
      return l;
    },
    render() {
      return `<section class="ch ch4">
  <div class="barre"><h2>Une lettre pour ${esc(C.enfant)}</h2><div class="actions"><button class="btn btn-petit" id="btn-ecouter4">${A.icone('hp')} Écouter</button><button class="btn btn-petit" id="btn-tout" hidden>Tout montrer</button></div></div>
  <div class="env-stage" id="env-stage"><p class="consigne">Touche le cachet de cire pour ouvrir l'enveloppe.</p>${A.enveloppeSVG(esc(C.enfant))}</div>
  <div class="lettre-stage" id="lettre-stage" hidden>
    <div class="papier" id="papier"></div>
    <div class="fin" id="fin4" hidden><button class="btn btn-grand btn-or" id="btn-suite4">${A.icone('etoile')} Mon diplôme</button></div>
  </div>
</section>`;
    },
    mount(r) {
      const self = this, lignes = this.lignes(), papier = $('#papier', r);
      heure('03:02');
      let ecrit = false;
      const n = lignes.length;
      const els = lignes.map((l, i) => { const p = document.createElement('p'); p.className = 'ligne' + (i === n - 3 || i === n - 2 ? ' sign' : '') + (i === n - 1 ? ' ps' : ''); p.dataset.txt = l; papier.appendChild(p); return p; });
      const lignesVoix = lignes.map((l, i) => i === n - 2 ? D.heureLettreTts : l);
      const montreTout = () => { ecrit = true; clearTimeout(self.t); els.forEach(p => { p.textContent = p.dataset.txt; p.classList.add('vue'); }); $('#btn-tout', r).hidden = true; $('#fin4', r).hidden = false; };
      const ecrire = () => {
        let i = 0, j = 0;
        const pas = () => {
          if (ecrit) return;
          if (i >= els.length) { montreTout(); return; }
          const txt = els[i].dataset.txt; els[i].classList.add('vue');
          if (j <= txt.length) { els[i].textContent = txt.slice(0, j); if (j % 4 === 0) SON.play('crayon'); j++; self.t = setTimeout(pas, 28); }
          else { i++; j = 0; self.t = setTimeout(pas, 350); }
        };
        if (RM) { let k = 0; const suiv = () => { if (ecrit) return; if (k >= els.length) { montreTout(); return; } els[k].textContent = els[k].dataset.txt; els[k].classList.add('vue'); k++; self.t = setTimeout(suiv, 700); }; suiv(); }
        else pas();
      };
      const ouvrir = () => {
        const env = $('.env', r); if (env.classList.contains('ouverte')) return;
        SON.unlock(); SON.play('cachet'); env.classList.add('ouverte');
        setTimeout(() => { $('#env-stage', r).hidden = true; $('#lettre-stage', r).hidden = false; $('#btn-tout', r).hidden = false; SON.play('papier'); ecrire(); }, RM ? 150 : 1100);
      };
      const cachet = $('#cachet', r);
      cachet.addEventListener('click', ouvrir); cachet.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(); } });
      $('#btn-tout', r).onclick = montreTout;
      $('#btn-ecouter4', r).onclick = () => {
        SON.unlock(); if ($('#env-stage', r).hidden === false) { ouvrir(); }
        montreTout();
        const ok = VOIX.parler(lignesVoix, { onLigne: i => { els.forEach(p => p.classList.remove('parle')); els[i].classList.add('parle'); }, onFin: () => els.forEach(p => p.classList.remove('parle')) });
        if (!ok) toast('Pas de voix disponible sur cet appareil');
      };
      $('#btn-suite4', r).onclick = () => { complete(4); badge('amie'); show(5); };
      if (tTest > 0) { $('.env', r).classList.add('ouverte'); $('#env-stage', r).hidden = true; $('#lettre-stage', r).hidden = false; montreTout(); }
    },
    unmount() { clearTimeout(this.t); },
  };

  // ---------- Chapitre 5 : le certificat ----------
  const Ch5 = {
    render() {
      const qs = 'badges=' + encodeURIComponent(State.badges.join(',')) + '&secret=' + (State.secret ? 1 : 0) + '&nuit=' + State.nuit;
      return `<section class="ch ch5">
  <div class="barre"><h2>Bravo ${esc(C.enfant)} !</h2><div class="actions"><button class="btn btn-petit" id="btn-ecouter5">${A.icone('hp')} Écouter</button></div></div>
  <div class="confettis" aria-hidden="true"></div>
  <div class="diplome-wrap">${window.CERTIFICAT.html({ badges: State.badges.concat(State.badges.indexOf('jumelle') < 0 ? ['jumelle'] : []), secret: State.secret, nuitTexte: nuitTexte() })}</div>
  <div class="fin">
    <a class="btn btn-grand btn-or" id="btn-imprimer" href="certificat.html?${qs}" target="_blank" rel="noopener">${A.icone('imprimer')} Imprimer le diplôme</a>
    <button class="btn btn-petit" id="btn-revoir5">Revoir l'histoire</button>
  </div>
</section>`;
    },
    mount(r) {
      heure('03:40');
      const premiere = !State.fini;
      complete(5); if (premiere) { State.fini = true; save(); }
      badge('jumelle');
      if (premiere) SON.play('fanfare');
      if (!RM) { const c = $('.confettis', r); const couleurs = ['#FFC857', '#D64045', '#F2A3B5', '#3E7C8F', '#F3EFE6']; for (let i = 0; i < 40; i++) { const s = document.createElement('i'); s.style.left = (Math.random() * 100) + '%'; s.style.background = couleurs[i % couleurs.length]; s.style.animationDelay = (Math.random() * 2.5) + 's'; s.style.animationDuration = (3 + Math.random() * 3) + 's'; c.appendChild(s); } }
      boutonEcouter(r, '#btn-ecouter5', D.ecouter[5].map(T));
      $('#btn-revoir5', r).onclick = () => show(1);
    },
  };

  const Chapitres = [Ch0, Ch1, Ch2, Ch3, Ch4, Ch5];

  // ---------- Démarrage ----------
  document.body.insertAdjacentHTML('afterbegin', A.symboles());
  buildFil();
  const h = parseInt((location.hash || '').slice(1), 10);
  if (demande != null) show(demande);
  else if (!isNaN(h) && h > 0 && h <= State.unlocked) show(Math.min(5, h));
  else show(0);
  window.addEventListener('hashchange', () => { const n = parseInt((location.hash || '').slice(1), 10); if (!isNaN(n) && n !== courantN && n <= State.unlocked) show(n); });

  // Exposé pour les tests
  window.APP = { show, state: State, nuitTexte };
})();
