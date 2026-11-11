// Synthèse vocale en français (bouton « Écouter »). Une phrase à la fois, voix locale si possible.
window.VOIX = (function () {
  'use strict';
  const synth = window.speechSynthesis;
  let voix = null, token = 0;

  function choisir() {
    if (!synth) return;
    const toutes = synth.getVoices(); if (!toutes.length) return;
    const fr = toutes.filter(v => /^fr/i.test(v.lang));
    const pref = ['Amélie', 'Audrey', 'Thomas', 'Hortense', 'Julie', 'Denise', 'Paul', 'Google français', 'Marie', 'Virginie', 'Aurélie'];
    voix = fr.find(v => v.localService && pref.some(p => v.name.indexOf(p) >= 0))
      || fr.find(v => v.localService)
      || fr.find(v => pref.some(p => v.name.indexOf(p) >= 0))
      || fr[0] || null;
  }
  if (synth) { choisir(); synth.onvoiceschanged = choisir; }

  function phrases(t) { return (String(t).replace(/\s+/g, ' ').match(/[^.!?…]+[.!?…]*/g) || [t]).map(s => s.trim()).filter(Boolean); }

  // lignes : chaîne ou tableau de chaînes. opts.onLigne(i) avant chaque ligne, opts.onFin() à la fin.
  function parler(lignes, opts) {
    opts = opts || {};
    if (!synth) { if (opts.onFin) opts.onFin(); return false; }
    stop(); const mien = ++token;
    const arr = Array.isArray(lignes) ? lignes : [lignes];
    const cfg = (window.CONFIG && window.CONFIG.tts) || {};
    let i = 0;
    const suivante = () => {
      if (mien !== token) return;
      if (i >= arr.length) { if (opts.onFin) opts.onFin(); return; }
      const idx = i++; if (opts.onLigne) opts.onLigne(idx);
      const parts = phrases(arr[idx]); let p = 0;
      const sub = () => {
        if (mien !== token) return;
        if (p >= parts.length) { suivante(); return; }
        const u = new SpeechSynthesisUtterance(parts[p++]);
        u.lang = 'fr-FR'; if (voix) u.voice = voix;
        u.rate = cfg.rate || 0.95; u.pitch = cfg.pitch || 1.15;
        u.onend = sub; u.onerror = sub;
        synth.speak(u);
      };
      sub();
    };
    suivante();
    return true;
  }
  function stop() { token++; if (synth) { try { synth.cancel(); } catch (e) { } } }
  // Premier toucher : une phrase vide pour « débloquer » la voix sur iOS
  function chauffer() { if (synth) { try { const u = new SpeechSynthesisUtterance(' '); u.lang = 'fr-FR'; u.volume = 0; synth.speak(u); } catch (e) { } } }

  return { parler, stop, chauffer, get dispo() { return !!synth; } };
})();
