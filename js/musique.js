// Musique d'ambiance générée en code (Web Audio, aucun fichier) : une boîte à musique douce,
// gamme pentatonique, avec une variation par chapitre. Elle démarre après le premier toucher,
// baisse pendant les effets sonores et se coupe avec le bouton son (même sortie que SON).
window.MUSIQUE = (function () {
  'use strict';
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const MAJ = [0, 2, 4, 7, 9], MIN = [0, 3, 5, 7, 10];

  // Les ambiances : racine (Hz), gamme, tempo (noires / min), densité des notes, nappe grave, bourdon tendu
  const AMBIANCES = {
    accueil: { root: 523.25, gamme: MAJ, tempo: 66, densite: 0.5, nappe: 0.5, grave: 0, vol: 1 },
    chateau: { root: 523.25, gamme: MAJ, tempo: 60, densite: 0.45, nappe: 0.5, grave: 0, vol: 1 },
    foret: { root: 440, gamme: MIN, tempo: 56, densite: 0.35, nappe: 0.7, grave: 0, vol: 0.9 },
    meuse: { root: 587.33, gamme: MAJ, tempo: 84, densite: 0.7, nappe: 0.4, grave: 0, vol: 1, vague: true },
    place: { root: 783.99, gamme: MAJ, tempo: 100, densite: 0.75, nappe: 0.2, grave: 0, vol: 1 },
    aiglemont: { root: 523.25, gamme: MAJ, tempo: 64, densite: 0.45, nappe: 0.5, grave: 0, vol: 0.95 },
    pantoufle: { root: 329.63, gamme: MIN, tempo: 60, densite: 0.15, nappe: 0, grave: 1, vol: 0.9 },
    jeu: { root: 329.63, gamme: MIN, tempo: 72, densite: 0.2, nappe: 0, grave: 1, vol: 0.85 },
    camera: { root: 329.63, gamme: MIN, tempo: 50, densite: 0.2, nappe: 0.3, grave: 0, vol: 0.55 },
    lettre: { root: 349.23, gamme: MAJ, tempo: 54, densite: 0.5, nappe: 0.8, grave: 0, vol: 1, tendre: true },
    diplome: { root: 523.25, gamme: MAJ, tempo: 92, densite: 0.8, nappe: 0.4, grave: 0, vol: 1 },
    silence: null,
  };

  let ctx = null, sortie = null, gainMus = null, echo = null, nappeOsc = [], graveOsc = null;
  let courante = 'silence', param = null, timer = null, prochain = 0, pas = 0, degre = 0, demarree = false, pause = false;
  let baisseT = null, volCible = 0.14;

  function prepare() {
    if (ctx) return true;
    const c = window.SON && window.SON.contexte(); if (!c) return false;
    ctx = c; sortie = window.SON.master;
    gainMus = ctx.createGain(); gainMus.gain.value = 0;
    // Petit écho feutré pour l'effet boîte à musique
    echo = ctx.createDelay(1.0); echo.delayTime.value = 0.36;
    const retour = ctx.createGain(); retour.gain.value = 0.28;
    const filtre = ctx.createBiquadFilter(); filtre.type = 'lowpass'; filtre.frequency.value = 2200;
    echo.connect(filtre).connect(retour).connect(echo);
    const mixEcho = ctx.createGain(); mixEcho.gain.value = 0.35;
    echo.connect(mixEcho).connect(gainMus);
    gainMus.connect(sortie);
    return true;
  }
  function freq(deg) {
    const g = param.gamme, n = g.length;
    const oct = Math.floor(deg / n), d = ((deg % n) + n) % n;
    return param.root * Math.pow(2, oct + g[d] / 12);
  }
  // Une note de boîte à musique : fondamentale + partiel aigu, attaque vive, longue descente
  function note(f, t, vol, dur) {
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain();
    o1.type = 'sine'; o1.frequency.value = f;
    o2.type = 'sine'; o2.frequency.value = f * 4.02;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(vol * 0.18, t + 0.005); g2.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(0.5, dur * 0.4));
    o1.connect(g); o2.connect(g2); g.connect(gainMus); g2.connect(gainMus); g.connect(echo);
    o1.start(t); o2.start(t); o1.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }
  function planifie() {
    if (!param || pause) return;
    const noire = 60 / param.tempo, croche = noire / 2;
    while (prochain < ctx.currentTime + 0.4) {
      const t = prochain, mesurePos = pas % 8;
      // Basse douce au début de chaque mesure (ou bourdon tendu pour Pantoufle)
      if (mesurePos === 0) {
        if (param.grave) note(param.root / 4, t, 0.22, noire * 3.5);
        else note(param.root / 2 * (pas % 16 === 8 ? Math.pow(2, 7 / 12) : 1), t, 0.1, noire * 3);
      }
      if (param.vague && mesurePos % 2 === 0) {
        // La Meuse : petit arpège qui coule
        note(freq(mesurePos / 2 + 5), t, 0.05, croche * 1.5);
      }
      if (Math.random() < param.densite || (mesurePos === 0 && !param.grave)) {
        // Marche aléatoire sur la gamme, qui revient vers la racine au début des mesures
        let saut = [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)];
        if (mesurePos === 0 && Math.random() < 0.5) degre = degre > 2 ? degre - 2 : (degre < -2 ? degre + 2 : 0);
        else degre += saut;
        degre = Math.max(-3, Math.min(9, degre));
        const vol = param.tendre ? 0.07 : 0.09;
        note(freq(degre), t + (Math.random() * 0.012), vol * (mesurePos === 0 ? 1.2 : 0.85), croche * (param.tendre ? 5 : 3.5));
      }
      prochain += croche; pas++;
    }
  }
  function nappeStart() {
    nappeStop();
    if (!param || !param.nappe) return;
    const t = ctx.currentTime, base = param.root / 4;
    [base, base * Math.pow(2, 7 / 12)].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = f * (i ? 1.002 : 1);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.028 * param.nappe, t + 3);
      lfo.frequency.value = 0.08 + i * 0.03; lg.gain.value = 0.008; lfo.connect(lg).connect(g.gain);
      const filtre = ctx.createBiquadFilter(); filtre.type = 'lowpass'; filtre.frequency.value = 500;
      o.connect(filtre).connect(g).connect(gainMus); o.start(t); lfo.start(t);
      nappeOsc.push({ o, g, lfo });
    });
  }
  function nappeStop() {
    const t = ctx ? ctx.currentTime : 0;
    nappeOsc.forEach(n => { try { n.g.gain.cancelScheduledValues(t); n.g.gain.setValueAtTime(n.g.gain.value, t); n.g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5); n.o.stop(t + 1.6); n.lfo.stop(t + 1.6); } catch (e) { } });
    nappeOsc = [];
  }
  function applique(nom) {
    param = AMBIANCES[nom] || null;
    if (!ctx) return;
    const t = ctx.currentTime;
    if (!param) { gainMus.gain.cancelScheduledValues(t); gainMus.gain.setValueAtTime(gainMus.gain.value, t); gainMus.gain.linearRampToValueAtTime(0, t + 1.2); nappeStop(); return; }
    volCible = 0.14 * param.vol;
    gainMus.gain.cancelScheduledValues(t); gainMus.gain.setValueAtTime(gainMus.gain.value, t); gainMus.gain.linearRampToValueAtTime(volCible, t + 2);
    degre = 0; pas = 0; prochain = Math.max(prochain, t + 0.1);
    nappeStart();
  }
  function boucle() {
    if (!demarree || !ctx) return;
    try { planifie(); } catch (e) { }
  }

  return {
    // Première interaction : on démarre la musique de l'ambiance en cours
    demarrer() {
      if (demarree) return;
      if (!prepare()) return;
      demarree = true; prochain = ctx.currentTime + 0.2;
      applique(courante);
      timer = setInterval(boucle, 120);
    },
    ambiance(nom) {
      if (nom === courante) return;
      courante = nom;
      if (demarree) applique(nom);
    },
    // Pendant un effet sonore, la musique baisse un peu
    baisser() {
      if (!ctx || !param || !demarree) return;
      const t = ctx.currentTime;
      gainMus.gain.cancelScheduledValues(t); gainMus.gain.setValueAtTime(gainMus.gain.value, t);
      gainMus.gain.linearRampToValueAtTime(volCible * 0.4, t + 0.05);
      clearTimeout(baisseT);
      baisseT = setTimeout(() => { if (!ctx || !param) return; const t2 = ctx.currentTime; gainMus.gain.cancelScheduledValues(t2); gainMus.gain.setValueAtTime(gainMus.gain.value, t2); gainMus.gain.linearRampToValueAtTime(volCible, t2 + 0.8); }, 700);
    },
    pause(on) {
      pause = !!on;
      if (!ctx) return;
      if (on) { nappeStop(); } else if (demarree) { prochain = ctx.currentTime + 0.1; nappeStart(); }
    },
    get ambianceCourante() { return courante; },
    get reduit() { return RM; },
  };
})();

// Onglet caché : on met la musique en pause
document.addEventListener('visibilitychange', () => { if (window.MUSIQUE) window.MUSIQUE.pause(document.hidden); });
