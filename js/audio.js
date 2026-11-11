// Sons fabriqués en code (Web Audio). Rien ne joue avant le premier toucher.
window.SON = (function () {
  'use strict';
  let ctx = null, master = null, ronfleTimer = null, debloque = false;
  let muet = false;
  try { muet = localStorage.getItem('souris.muet') === '1'; } catch (e) { }

  function ensure() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
        ctx = new AC(); master = ctx.createGain(); master.gain.value = muet ? 0 : 0.6; master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { }
    return ctx;
  }
  function tone(freq, dur, type, vol, when, slideTo) {
    if (!debloque) return;
    const c = ensure(); if (!c) return;
    const t0 = c.currentTime + (when || 0);
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.3, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(master); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function bruit(dur, vol, when, freq) {
    if (!debloque) return;
    const c = ensure(); if (!c) return;
    const t0 = c.currentTime + (when || 0);
    const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq || 1200;
    const g = c.createGain(); g.gain.setValueAtTime(vol || 0.2, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f).connect(g).connect(master); s.start(t0);
  }
  const sons = {
    lanterne() { tone(660, 0.15, 'triangle', 0.25); tone(990, 0.35, 'triangle', 0.2, 0.12); },
    badge() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'triangle', 0.22, i * 0.12)); },
    fanfare() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.4, 'triangle', 0.2, i * 0.14)); tone(1568, 0.8, 'triangle', 0.18, 0.75); },
    clic() { tone(900, 0.05, 'square', 0.05); },
    pas() { bruit(0.05, 0.07, 0, 600); },
    mmh() { tone(300, 0.18, 'sawtooth', 0.1); tone(420, 0.3, 'sawtooth', 0.1, 0.16); },
    baillement() { tone(200, 0.8, 'triangle', 0.12, 0, 420); },
    alerte() { tone(880, 0.12, 'square', 0.08); tone(660, 0.12, 'square', 0.08, 0.16); tone(880, 0.12, 'square', 0.08, 0.32); },
    bip() { tone(1200, 0.08, 'square', 0.07); },
    cachet() { bruit(0.12, 0.35, 0, 900); bruit(0.25, 0.2, 0.08, 500); },
    papier() { bruit(0.3, 0.12, 0, 2500); },
    crayon() { bruit(0.04, 0.05, 0, 2600); },
    plouf() { tone(500, 0.2, 'sine', 0.2, 0, 180); bruit(0.3, 0.1, 0.05, 800); },
  };
  function ronfleStart() {
    if (ronfleTimer || muet) return;
    const un = () => { tone(85, 0.9, 'sawtooth', 0.07, 0, 65); tone(60, 0.7, 'triangle', 0.05, 1.2); };
    un(); ronfleTimer = setInterval(un, 2300);
  }
  function ronfleStop() { if (ronfleTimer) { clearInterval(ronfleTimer); ronfleTimer = null; } }

  document.addEventListener('visibilitychange', () => { if (document.hidden) ronfleStop(); });

  return {
    // À appeler depuis un geste de l'utilisateur (toucher, clic) : autorise les sons
    unlock() { debloque = true; return ensure(); },
    play(n) { try { if (!muet && sons[n]) sons[n](); } catch (e) { } },
    ronfleStart, ronfleStop,
    get muet() { return muet; },
    toggle() {
      muet = !muet;
      try { localStorage.setItem('souris.muet', muet ? '1' : '0'); } catch (e) { }
      if (master) master.gain.value = muet ? 0 : 0.6;
      if (muet) ronfleStop();
      return muet;
    },
  };
})();
