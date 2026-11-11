// Le bandeau de narration : Quenotte parle à la première personne, dans un bandeau fixe en bas
// de l'écran. Le texte apparaît par petits groupes de mots ; un toucher l'affiche en entier.
window.NARR = (function () {
  'use strict';
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const BULLES = { sourire: '', joie: '★', surprise: '!', chuchote: 'chut', clin: '♪', triste: '…' };
  let el = null, texte = null, portrait = null, bulle = null, actions = null, timer = null, enCours = null, jeton = 0, attente = null;
  let courante = null, inter = null; // inter : l'histoire principale mise en pause pendant un secret

  function init() {
    el = document.getElementById('bandeau');
    el.innerHTML = `<div class="bandeau-in">
      <div class="bandeau-portrait">${window.ART.portrait()}<span class="bandeau-bulle" aria-hidden="true"></span></div>
      <p class="bandeau-texte" id="bandeau-texte" aria-live="polite"></p>
      <span class="bandeau-suite" aria-hidden="true">Suite <b>▸</b></span>
      <div class="bandeau-actions" id="bandeau-actions"></div>
    </div>`;
    texte = el.querySelector('#bandeau-texte'); portrait = el.querySelector('.portrait'); bulle = el.querySelector('.bandeau-bulle'); actions = el.querySelector('#bandeau-actions');
    el.addEventListener('click', e => {
      if (e.target.closest('.bandeau-actions')) return;
      if (e.target.closest('.bandeau-suite')) { continuer(); return; }
      // Ailleurs sur le bandeau : on montre seulement tout le texte, on n'avance pas
      if (enCours) toutMontrer();
    });
    // La hauteur du bandeau est transmise au reste de la page (pour ne jamais cacher la scène)
    const mesure = () => { document.documentElement.style.setProperty('--bandeau-h', el.offsetHeight + 'px'); };
    if (window.ResizeObserver) new ResizeObserver(mesure).observe(el); else window.addEventListener('resize', mesure);
    window.addEventListener('resize', ajuster);
    mesure();
  }

  // Découpe en petits groupes de mots (coupés aux virgules et aux fins de phrase)
  function groupes(t) {
    const mots = t.split(/\s+/).filter(Boolean), out = []; let cur = [];
    mots.forEach(m => {
      cur.push(m);
      if (cur.length >= 3 || /[,.!?…:]$/.test(m) || (cur.length >= 2 && /[»]$/.test(m))) { out.push(cur.join(' ')); cur = []; }
    });
    if (cur.length) out.push(cur.join(' '));
    return out;
  }
  // Le texte doit tenir en entier dans son cadre : on réduit la police si besoin (jamais de défilement)
  function ajuster() {
    if (!texte) return;
    texte.style.fontSize = '';
    let fs = parseFloat(getComputedStyle(texte).fontSize) || 16;
    const min = Math.max(11, fs * 0.66);
    let n = 0;
    while (texte.scrollHeight > texte.clientHeight + 1 && fs > min && n++ < 40) { fs -= 0.5; texte.style.fontSize = fs + 'px'; }
  }
  function expression(expr) {
    const e = BULLES.hasOwnProperty(expr) ? expr : 'sourire';
    portrait.setAttribute('data-expr', e);
    bulle.textContent = BULLES[e]; bulle.classList.toggle('on', !!BULLES[e]);
    portrait.classList.remove('hop'); void portrait.offsetWidth; portrait.classList.add('hop');
  }
  function toutMontrer() {
    if (!enCours) return;
    clearTimeout(timer);
    texte.querySelectorAll('.mot').forEach(s => s.classList.add('vu'));
    const fin = enCours.fin; enCours = null; if (fin) fin();
  }

  // dire({ txt, expr, vite }) : affiche la phrase de l'histoire, résout quand tout est visible.
  // Pendant un secret, la phrase attend en coulisse et s'affichera au retour.
  function dire(b, opts) {
    if (inter) {
      if (inter.attente) { const f = inter.attente; inter.attente = null; f(false); }
      if (inter.dire) { const f = inter.dire; inter.dire = null; f(); }
      inter.bulle = b;
      return new Promise(res => { inter.dire = res; });
    }
    courante = b;
    return afficher(b, opts);
  }
  function afficher(b, opts) {
    opts = opts || {};
    clearTimeout(timer); const mien = ++jeton;
    // Une bulle remplacée libère ceux qui l'attendaient (et annule l'attente d'un toucher)
    if (enCours) { const f = enCours.fin; enCours = null; if (f) f(); }
    if (attente) { const f = attente; attente = null; el.classList.remove('attente'); f(false); }
    const t = (b && b.txt) || '';
    expression((b && b.expr) || 'sourire');
    el.classList.toggle('chuchote', (b && b.expr) === 'chuchote');
    const gs = groupes(t);
    texte.innerHTML = gs.map(g => `<span class="mot">${g.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</span>`).join(' ');
    ajuster(); // tous les mots sont déjà en place (invisibles) : la taille est calculée sur le texte complet
    const spans = Array.prototype.slice.call(texte.querySelectorAll('.mot'));
    return new Promise(resolve => {
      enCours = { fin: resolve };
      if (RM || opts.vite === 'instant') { toutMontrer(); return; }
      const delai = opts.vite ? 140 : 380; let i = 0;
      const suivant = () => {
        if (mien !== jeton) return;
        if (i >= spans.length) { enCours = null; resolve(); return; }
        spans[i++].classList.add('vu');
        timer = setTimeout(suivant, delai);
      };
      suivant();
    });
  }
  // Un secret interrompt l'histoire : son texte s'affiche, puis « Suite » rend la main à l'histoire,
  // exactement où elle en était (texte, attente du bouton Suite, bouton d'action).
  // Résout true au retour, false si un autre secret a pris la place.
  function interrompre(b) {
    if (!inter) {
      clearTimeout(timer); jeton++;
      inter = { bulle: courante, dire: enCours ? enCours.fin : null, attente: attente, resolve: null };
      enCours = null; attente = null; actions.hidden = true;
    } else if (inter.resolve) { const r = inter.resolve; inter.resolve = null; r(false); }
    el.classList.remove('attente'); el.classList.add('interrompu');
    return new Promise(res => {
      inter.resolve = res;
      afficher(b).then(() => { if (inter && inter.resolve === res) el.classList.add('attente'); });
    });
  }
  function restaurer() {
    const i = inter; inter = null;
    el.classList.remove('attente', 'interrompu'); actions.hidden = false;
    if (i.bulle) { courante = i.bulle; afficher(i.bulle, { vite: 'instant' }); }
    if (i.dire) i.dire();
    if (i.attente) { attente = i.attente; el.classList.add('attente'); }
    if (i.resolve) i.resolve(true);
  }
  // Un toucher : montre tout le texte, ou passe à la suite si on attendait
  function continuer() {
    if (enCours) { toutMontrer(); return true; }
    if (inter) { restaurer(); return true; }
    if (attente) { const f = attente; attente = null; el.classList.remove('attente'); f(true); return true; }
    return false;
  }
  // Attend un toucher sur le bandeau avant la suite. Résout false si une autre bulle a pris la place.
  function attendre() {
    if (inter) { if (inter.attente) { const f = inter.attente; inter.attente = null; f(false); } return new Promise(res => { inter.attente = res; }); }
    if (attente) { const f = attente; attente = null; f(false); }
    el.classList.add('attente');
    return new Promise(res => { attente = res; });
  }
  // Un bouton (ou rien) dans le bandeau
  function action(html, onclick, cls) {
    actions.innerHTML = '';
    if (!html) return null;
    const b = document.createElement('button'); b.className = 'btn ' + (cls || 'btn-or'); b.innerHTML = html; b.onclick = onclick;
    actions.appendChild(b); b.classList.add('pop'); return b;
  }
  function cacher(on) { el.classList.toggle('cache', !!on); }
  return { init, dire, attendre, continuer, interrompre, action, cacher, expression, get interrompu() { return !!inter; }, get attend() { return !!attente || !!enCours; }, get lit() { return !!enCours; }, get visible() { return !el.classList.contains('cache'); } };
})();
