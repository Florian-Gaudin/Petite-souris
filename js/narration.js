// Le bandeau de narration : Quenotte parle à la première personne, dans un bandeau fixe en bas
// de l'écran. Le texte apparaît par petits groupes de mots ; un toucher l'affiche en entier.
window.NARR = (function () {
  'use strict';
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const BULLES = { sourire: '', joie: '★', surprise: '!', chuchote: 'chut', clin: '♪', triste: '…' };
  let el = null, texte = null, portrait = null, bulle = null, actions = null, timer = null, enCours = null, jeton = 0, attente = null;

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

  // dire({ txt, expr, vite }) : affiche la phrase, résout quand tout est visible
  function dire(b, opts) {
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
  // Un toucher : montre tout le texte, ou passe à la suite si on attendait
  function continuer() {
    if (enCours) { toutMontrer(); return true; }
    if (attente) { const f = attente; attente = null; el.classList.remove('attente'); f(true); return true; }
    return false;
  }
  // Attend un toucher sur le bandeau avant la suite. Résout false si une autre bulle a pris la place.
  function attendre() {
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
  // Masque provisoirement le bouton d'action (pendant une bulle bonus), sans le perdre
  function masquerAction(on) { actions.hidden = !!on; }

  return { init, dire, attendre, continuer, action, masquerAction, cacher, expression, get attend() { return !!attente || !!enCours; }, get lit() { return !!enCours; }, get visible() { return !el.classList.contains('cache'); } };
})();
