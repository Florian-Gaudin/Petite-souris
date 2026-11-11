// Dessins SVG faits maison (aucune image externe).
window.ART = (function () {
  'use strict';

  // Petit générateur pseudo-aléatoire déterministe (les étoiles sont toujours au même endroit)
  function lcg(seed) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
  function etoiles(n, w, h, seed) {
    const r = lcg(seed); let out = '';
    for (let i = 0; i < n; i++) { const x = (r() * w).toFixed(0), y = (r() * h * 0.6).toFixed(0), rad = (0.6 + r() * 1.4).toFixed(1); out += `<circle cx="${x}" cy="${y}" r="${rad}" fill="#fff" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`; }
    return out;
  }

  // Phase de la lune pour la date de la nuit (AAAA-MM-JJ)
  function lune(nuit) {
    const synodic = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14);
    const d = new Date(nuit + 'T23:00:00');
    const age = (((d.getTime() - ref) / 864e5) % synodic + synodic) % synodic;
    const illum = (1 - Math.cos(2 * Math.PI * age / synodic)) / 2;
    return { age, illum, croissante: age < synodic / 2 };
  }
  function luneSVG(nuit, cx, cy, r, id) {
    const m = lune(nuit);
    const off = 2 * r * m.illum;                       // décalage du disque sombre
    const dx = m.croissante ? -off : off;              // croissante : éclairée à droite
    return `<mask id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/><circle cx="${(cx + dx).toFixed(1)}" cy="${cy}" r="${(r * 1.02).toFixed(1)}" fill="#000"/></mask>
      <circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#FFF4D6" opacity=".07"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFF4D6" mask="url(#${id})"/>`;
  }

  const CIEL = `<linearGradient id="gciel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141A3A"/><stop offset="1" stop-color="#2b3470"/></linearGradient>`;

  // ---------- Symboles réutilisés partout ----------
  function symboles() {
    return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFC857" stop-opacity=".6"/><stop offset="1" stop-color="#FFC857" stop-opacity="0"/></radialGradient>
<radialGradient id="gcire" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#ee6b74"/><stop offset="1" stop-color="#b4232f"/></radialGradient>

<symbol id="souris-face" viewBox="0 0 220 240">
  <circle cx="44" cy="178" r="52" fill="url(#glow)"/>
  <path d="M150 206 C 202 216, 206 164, 172 160" fill="none" stroke="#A79E95" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="161" cy="152" rx="16" ry="21" fill="#8B5A3C"/>
  <ellipse cx="110" cy="166" rx="50" ry="54" fill="#A79E95"/>
  <ellipse cx="110" cy="178" rx="30" ry="36" fill="#EFE8DD"/>
  <path d="M128 130 L 152 142" stroke="#6E4630" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="90" cy="218" rx="15" ry="8" fill="#E7B4B4"/><ellipse cx="130" cy="218" rx="15" ry="8" fill="#E7B4B4"/>
  <circle cx="68" cy="58" r="24" fill="#A79E95"/><circle cx="68" cy="58" r="14" fill="#F2A3B5"/>
  <circle cx="152" cy="58" r="24" fill="#A79E95"/><circle cx="152" cy="58" r="14" fill="#F2A3B5"/>
  <circle cx="110" cy="92" r="44" fill="#A79E95"/>
  <ellipse cx="110" cy="109" rx="18" ry="12" fill="#EFE8DD"/>
  <ellipse cx="110" cy="104" rx="6" ry="4.5" fill="#E98BA0"/>
  <path d="M103 113 q7 6 14 0" fill="none" stroke="#2B2B33" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="95" cy="90" r="5.5" fill="#2B2B33"/><circle cx="125" cy="90" r="5.5" fill="#2B2B33"/>
  <circle cx="97" cy="88" r="2" fill="#fff"/><circle cx="127" cy="88" r="2" fill="#fff"/>
  <g stroke="#6B6560" stroke-width="1.4" stroke-linecap="round"><path d="M92 107 L 64 101"/><path d="M92 111 L 64 113"/><path d="M128 107 L 156 101"/><path d="M128 111 L 156 113"/></g>
  <path d="M70 132 q40 20 80 0 v15 q-40 20 -80 0z" fill="#D64045"/>
  <path d="M76 141 q34 16 68 0" fill="none" stroke="#B5323B" stroke-width="2"/>
  <path d="M128 144 q8 20 4 38 h15 q4 -18 -4 -38z" fill="#D64045"/>
  <g stroke="#FFF4D6" stroke-width="2" stroke-linecap="round"><path d="M134 180 v6"/><path d="M140 181 v6"/></g>
  <ellipse cx="66" cy="152" rx="12" ry="9" fill="#A79E95" transform="rotate(-28 66 152)"/>
  <path d="M56 160 L 47 172" stroke="#6E4630" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M32 174 h26 l-3 -7 h-20z" fill="#6E4630"/>
  <rect x="31" y="174" width="28" height="28" rx="6" fill="#FFC857" stroke="#B9801A" stroke-width="2"/>
  <ellipse cx="45" cy="188" rx="6" ry="8" fill="#FFF4D6"/>
  <ellipse cx="154" cy="154" rx="12" ry="9" fill="#A79E95" transform="rotate(28 154 154)"/>
</symbol>

<symbol id="souris-side" viewBox="0 0 130 100">
  <circle cx="108" cy="86" r="26" fill="url(#glow)"/>
  <path d="M18 70 C -4 72, -2 44, 22 52" fill="none" stroke="#A79E95" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="38" cy="56" rx="15" ry="18" fill="#8B5A3C"/>
  <ellipse cx="60" cy="64" rx="38" ry="25" fill="#A79E95"/>
  <ellipse cx="66" cy="72" rx="24" ry="14" fill="#EFE8DD"/>
  <ellipse class="pied p1" cx="46" cy="90" rx="10" ry="5" fill="#E7B4B4"/><ellipse class="pied p2" cx="72" cy="90" rx="10" ry="5" fill="#E7B4B4"/>
  <circle cx="106" cy="27" r="11" fill="#A79E95"/><circle cx="106" cy="27" r="6" fill="#F2A3B5"/>
  <circle cx="96" cy="48" r="23" fill="#A79E95"/>
  <circle cx="86" cy="26" r="12" fill="#A79E95"/><circle cx="86" cy="26" r="7" fill="#F2A3B5"/>
  <circle cx="104" cy="46" r="3.2" fill="#2B2B33"/><circle cx="105.2" cy="44.8" r="1" fill="#fff"/>
  <circle cx="118" cy="54" r="3.5" fill="#E98BA0"/>
  <g stroke="#6B6560" stroke-width="1.2" stroke-linecap="round"><path d="M112 56 L126 50"/><path d="M112 58 L126 62"/></g>
  <path d="M74 60 q14 8 28 -2 l2 8 q-14 10 -30 2z" fill="#D64045"/>
  <path d="M74 60 q-14 2 -22 14 l6 3 q8 -10 18 -11z" fill="#D64045"/>
  <path d="M92 70 L104 84" stroke="#6E4630" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="98" y="82" width="14" height="14" rx="4" fill="#FFC857" stroke="#B9801A" stroke-width="1.5"/>
</symbol>

<symbol id="souris-cam" viewBox="0 0 130 100">
  <g fill="#0b3a14" stroke="#39FF14" stroke-width="2.5" stroke-linejoin="round">
    <path d="M18 70 C -4 72, -2 44, 22 52" fill="none"/>
    <ellipse cx="38" cy="56" rx="15" ry="18"/>
    <ellipse cx="60" cy="64" rx="38" ry="25"/>
    <circle cx="106" cy="27" r="11"/><circle cx="96" cy="48" r="23"/><circle cx="86" cy="26" r="12"/>
    <path d="M74 60 q14 8 28 -2 l2 8 q-14 10 -30 2z" fill="#2fbf2f"/>
    <path d="M74 60 q-14 2 -22 14 l6 3 q8 -10 18 -11z" fill="#2fbf2f"/>
  </g>
  <circle cx="104" cy="46" r="3.5" fill="#39FF14"/><circle cx="118" cy="54" r="3.5" fill="#39FF14"/>
  <path d="M92 70 L104 84" stroke="#39FF14" stroke-width="2.5"/>
  <rect x="98" y="82" width="14" height="14" rx="4" fill="#9fff8a"/><circle cx="105" cy="89" r="14" fill="#9fff8a" opacity=".18"/>
</symbol>

<symbol id="dent" viewBox="0 0 24 24"><path d="M7 3.5 q5 -3 10 0 q3.5 2.5 1.5 9 q-1 8 -3.5 8.5 q-2 0 -3 -4.5 q-1 4.5 -3 4.5 q-2.5 -.5 -3.5 -8.5 q-2 -6.5 1.5 -9z" fill="#fff" stroke="#cfd3ee" stroke-width=".8"/></symbol>
<symbol id="dent-cam" viewBox="0 0 24 24"><path d="M7 3.5 q5 -3 10 0 q3.5 2.5 1.5 9 q-1 8 -3.5 8.5 q-2 0 -3 -4.5 q-1 4.5 -3 4.5 q-2.5 -.5 -3.5 -8.5 q-2 -6.5 1.5 -9z" fill="#9fff8a" stroke="#39FF14" stroke-width="1.2"/></symbol>
<symbol id="bateau" viewBox="0 0 64 34"><path d="M2 20 L62 20 L52 32 L12 32 Z" fill="#AEB8A6" stroke="#7f8c7a" stroke-width="1"/><path d="M14 20 L32 3 L50 20 Z" fill="#CBD3C4" stroke="#7f8c7a" stroke-width="1"/><path d="M32 3 L32 20" stroke="#7f8c7a" stroke-width="1"/><text x="20" y="29" font-family="Share Tech Mono, monospace" font-size="8" fill="#4a5a4a">5</text><text x="40" y="29" font-family="Share Tech Mono, monospace" font-size="8" fill="#4a5a4a">€</text></symbol>
<symbol id="bateau-cam" viewBox="0 0 64 34"><path d="M2 20 L62 20 L52 32 L12 32 Z" fill="#0f4a1b" stroke="#39FF14" stroke-width="2"/><path d="M14 20 L32 3 L50 20 Z" fill="#0f4a1b" stroke="#39FF14" stroke-width="2"/><path d="M32 3 L32 20" stroke="#39FF14" stroke-width="2"/></symbol>
<symbol id="patte" viewBox="0 0 24 24"><ellipse cx="7" cy="8" rx="2.2" ry="3"/><ellipse cx="12" cy="6" rx="2.2" ry="3"/><ellipse cx="17" cy="8" rx="2.2" ry="3"/><path d="M12 11 q6 0 6 6 q0 4 -6 4 q-6 0 -6 -4 q0 -6 6 -6z"/></symbol>
</defs></svg>`;
  }

  // Petites icônes de boutons (trait blanc)
  const ICONES = {
    lanterne: '<path d="M9 3h6l1 3H8z M8 6h8v9a4 4 0 0 1-8 0z M12 21v-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="11" r="2" fill="currentColor"/>',
    hp: '<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    vite: '<path d="M4 5l8 7-8 7zM12 5l8 7-8 7z" fill="currentColor"/>',
    patte: '<ellipse cx="7" cy="8" rx="2.2" ry="3" fill="currentColor"/><ellipse cx="12" cy="6" rx="2.2" ry="3" fill="currentColor"/><ellipse cx="17" cy="8" rx="2.2" ry="3" fill="currentColor"/><path d="M12 11q6 0 6 6 0 4-6 4-6 0-6-4 0-6 6-6z" fill="currentColor"/>',
    son: '<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    muet: '<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    imprimer: '<path d="M7 8V3h10v5M7 17h10v4H7zM5 8h14a2 2 0 0 1 2 2v7h-4v-3H7v3H3v-7a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    etoile: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor"/>',
  };
  function icone(n, cls) { return `<svg class="ico ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${ICONES[n] || ''}</svg>`; }

  // Icônes des badges (fond coloré rond)
  function badgeIcone(id, taille) {
    const t = taille || 44;
    const dessins = {
      detective: '<circle cx="24" cy="24" r="22" fill="#273066"/><path d="M19 12h10l1.5 4H17.5z M17.5 16h13v12a6.5 6.5 0 0 1-13 0z" fill="#FFC857"/><circle cx="24" cy="23" r="3" fill="#fff"/>',
      passechat: '<circle cx="24" cy="24" r="22" fill="#E8A552"/><circle cx="24" cy="26" r="11" fill="#C9833A"/><path d="M14 20l-2-9 8 5zM34 20l2-9-8 5z" fill="#C9833A"/><path d="M18 26q3 3 6 0M26 26q3 3 6 0" fill="none" stroke="#2B2B33" stroke-width="1.6"/><path d="M22 31h4l-2 2z" fill="#F2A3B5"/>',
      hibou: '<circle cx="24" cy="24" r="22" fill="#06180B"/><circle cx="24" cy="24" r="12" fill="none" stroke="#39FF14" stroke-width="2.5"/><circle cx="24" cy="24" r="5" fill="#39FF14"/>',
      amie: '<circle cx="24" cy="24" r="22" fill="#FFF6E0"/><rect x="11" y="16" width="26" height="18" rx="2" fill="#fff" stroke="#C9A227"/><path d="M11 17l13 10 13-10" fill="none" stroke="#C9A227" stroke-width="1.5"/><circle cx="24" cy="27" r="4" fill="#D64045"/>',
      jumelle: '<circle cx="24" cy="24" r="22" fill="#F2A3B5"/><g transform="translate(9 11) scale(0.95)"><use href="#dent" width="16" height="16"/><use href="#dent" x="16" width="16" height="16"/></g><path d="M24 33l-3-3a2 2 0 0 1 3-3 2 2 0 0 1 3 3z" fill="#D64045"/>',
      scene13: '<circle cx="24" cy="24" r="22" fill="#D64045"/><rect x="10" y="12" width="28" height="24" rx="2" fill="#141A3A"/><path d="M10 12q7 10 0 24zM38 12q-7 10 0 24z" fill="#9a2a32"/><text x="24" y="30" font-family="Baloo 2" font-weight="800" font-size="12" fill="#FFC857" text-anchor="middle">13</text>',
    };
    return `<svg class="badge-ico" width="${t}" height="${t}" viewBox="0 0 48 48" aria-hidden="true">${dessins[id] || ''}</svg>`;
  }

  // ---------- Chapitre 0 : ciel, colline, maison ----------
  function cielSVG(nuit) {
    return `<svg class="ciel-svg" viewBox="0 0 800 480" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
<defs>${CIEL}${luneSVG(nuit, 650, 86, 32, 'mlune0')}</defs>
<rect width="800" height="480" fill="url(#gciel)"/>
${etoiles(60, 800, 480, 7)}
<path d="M0 320 Q130 250 270 300 T560 290 T800 260 V480 H0Z" fill="#1E2658"/>
<g fill="#1E3F36"><path d="M0 400l30-90 30 90zM50 400l36-110 36 110zM120 400l30-90 30 90zM660 400l30-90 30 90zM720 400l36-110 36 110z"/></g>
<path d="M0 480V420Q180 350 400 286Q560 240 800 360V480Z" fill="#24483E"/>
<g id="maison0" transform="translate(-75,-80)"><rect x="470" y="298" width="90" height="62" fill="#F3EFE6"/><path d="M460 298l55-44 55 44z" fill="#D64045"/><rect x="532" y="262" width="12" height="26" fill="#A79E95"/><rect x="496" y="318" width="20" height="22" rx="2" fill="#FFC857" class="fenetre"/><rect x="528" y="330" width="16" height="30" fill="#6E4630"/>
<g class="fumee" fill="#cfd3ee" opacity=".5"><circle cx="540" cy="250" r="5"/><circle cx="546" cy="238" r="7"/><circle cx="554" cy="224" r="9"/></g></g>
<path class="chemin0" d="M60 470 C 180 450, 290 400, 395 292" fill="none" stroke="#D64045" stroke-width="4" stroke-dasharray="10 10" stroke-linecap="round"/>
<g class="qui"><use href="#souris-side" x="30" y="392" width="104" height="80"/></g>
</svg>`;
  }

  // ---------- Chapitre 1 : la carte ----------
  function carteSVG(nuit) {
    let arcades = '';
    for (let x = 430; x <= 610; x += 30) arcades += `<path d="M${x} 420v-30a10 10 0 0 1 20 0v30z"/>`;
    return `<svg class="carte" viewBox="0 0 1000 620" role="img" aria-label="Carte illustrée du voyage de la souris, du château dans la forêt des Ardennes jusqu'à la maison">
<defs>${CIEL}${luneSVG(nuit, 880, 70, 26, 'mlune1')}</defs>
<rect width="1000" height="620" fill="url(#gciel)"/>
${etoiles(70, 1000, 620, 11)}
<path d="M0 330Q120 250 260 300T520 290T780 280T1000 250V620H0Z" fill="#1E2658"/>
<path d="M700 250C740 330 690 400 740 460 780 510 760 570 790 620L860 620C830 570 850 510 810 460 760 400 810 330 770 250Z" fill="#3E7C8F"/>
<g stroke="#7FB8C7" stroke-width="2" fill="none" stroke-linecap="round"><path d="M730 300q10-5 20 0M745 360q10-5 20 0M760 480q10-5 20 0M790 560q10-5 20 0"/></g>
<path d="M800 620C850 500 920 420 1000 400V620Z" fill="#2F5D50"/>
<path d="M0 620V430Q200 410 420 440T700 430L760 620Z" fill="#1A2A26"/>
<g fill="#1E3F36"><path d="M0 440l30-90 30 90zM50 440l34-110 34 110zM110 440l30-90 30 90zM230 440l34-110 34 110zM290 440l30-90 30 90z"/></g>
<g fill="#2F5D50"><path d="M20 460l26-70 26 70zM270 460l26-70 26 70zM340 450l22-60 22 60z"/></g>
<g id="chateau"><rect x="150" y="300" width="24" height="90" fill="#F3EFE6"/><rect x="226" y="300" width="24" height="90" fill="#F3EFE6"/><rect x="170" y="330" width="60" height="60" fill="#F3EFE6"/><path d="M162 300l-14 0 14-26 14 26zM238 300l-14 0 14-26 14 26z" fill="#D64045"/><rect x="192" y="352" width="16" height="24" rx="8" fill="#FFC857"/><text x="200" y="414" class="lbl">Forêt des Ardennes</text></g>
<g id="charleville"><rect x="420" y="330" width="220" height="90" fill="#2A3470"/><path d="M420 330l110-36 110 36z" fill="#3A4690"/><g fill="#1E2658">${arcades}</g><g fill="#FFC857"><rect x="450" y="345" width="10" height="12"/><rect x="530" y="345" width="10" height="12"/><rect x="600" y="345" width="10" height="12"/></g><text x="530" y="452" class="lbl">Charleville · place Ducale</text></g>
<g id="marionnettiste" class="tap" role="button" aria-label="Le Grand Marionnettiste" tabindex="0"><rect x="655" y="230" width="60" height="190" fill="#232c66"/><rect x="668" y="330" width="34" height="60" fill="#151a40"/>
<g class="geant"><circle cx="685" cy="262" r="14" fill="#F3EFE6"/><rect x="676" y="276" width="18" height="40" rx="6" fill="#F3EFE6"/><path d="M676 285l-14 18M694 285l14 18M680 316l-4 16M690 316l4 16" stroke="#F3EFE6" stroke-width="4" stroke-linecap="round"/><path d="M679 262q3 3 6 0M685 262q3 3 6 0" stroke="#2B2B33" stroke-width="1.5" fill="none"/></g>
<text x="685" y="216" class="lbl petit">le Grand Marionnettiste</text><rect x="635" y="196" width="100" height="234" fill="transparent"/></g>
<g id="maison"><rect x="880" y="330" width="70" height="56" fill="#F3EFE6"/><path d="M872 330l43-34 43 34z" fill="#D64045"/><rect x="928" y="302" width="10" height="20" fill="#A79E95"/><rect x="900" y="350" width="16" height="18" fill="#FFC857"/><text x="915" y="414" class="lbl">Aiglemont</text></g>
<text x="770" y="605" class="lbl petit">la Meuse</text>
<path id="trajet" d="M200 400C260 430 330 410 400 430S520 445 600 432S690 425 740 440S800 460 830 430S870 380 900 388" fill="none" stroke="#D64045" stroke-width="4" stroke-dasharray="10 10" stroke-linecap="round"/>
<g id="bateau"><use href="#bateau" width="70" height="38"/></g>
<g id="marqueur"><use href="#souris-side" width="84" height="65"/></g>
</svg>`;
  }

  // ---------- Chapitre 2 : la scène du jeu ----------
  function jeuSVG() {
    return `<svg class="jeu" viewBox="0 0 1000 500" role="img" aria-label="La souris doit passer devant le chat endormi pour atteindre le portail">
<defs>${CIEL}</defs>
<rect width="1000" height="500" fill="url(#gciel)"/>
${etoiles(40, 1000, 500, 5)}
<rect x="840" y="220" width="160" height="200" fill="#2A3470"/><rect x="840" y="210" width="160" height="14" fill="#3A4690"/>
<path d="M880 420v-120a40 40 0 0 1 80 0v120z" fill="#151a40"/><g stroke="#8B5A3C" stroke-width="4"><path d="M900 300v120M920 300v120M940 300v120"/></g>
<rect x="806" y="150" width="6" height="270" fill="#6b6560"/><circle cx="809" cy="140" r="18" fill="#FFC857"/><circle cx="809" cy="140" r="60" fill="#FFC857" opacity=".12"/>
<rect y="420" width="1000" height="80" fill="#1A2A26"/><rect y="405" width="1000" height="18" fill="#2b3b36"/>
<g fill="#8B5A3C"><path d="M300 420l8-40h44l8 40zM520 420l8-40h44l8 40z"/></g><g fill="#3E7C8F"><circle cx="330" cy="372" r="18"/><circle cx="550" cy="372" r="18"/></g>
<g id="chat" data-etat="dort" transform="translate(600,300)">
  <path id="queue" d="M20 90C-20 100-25 50 10 60" fill="none" stroke="#E8A552" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="90" cy="92" rx="80" ry="40" fill="#E8A552"/>
  <g fill="none" stroke="#C9833A" stroke-width="6" stroke-linecap="round"><path d="M50 64q6 12 2 24M74 60q6 14 2 28M98 60q6 14 2 28"/></g>
  <circle cx="156" cy="72" r="36" fill="#E8A552"/>
  <path d="M126 50l-4-30 26 14zM186 50l4-30-26 14z" fill="#E8A552"/><path d="M129 46l-2-14 12 7zM183 46l2-14-12 7z" fill="#F2A3B5"/>
  <g class="oeil-ferme" fill="none" stroke="#2B2B33" stroke-width="3" stroke-linecap="round"><path d="M136 72q8 6 16 0M164 72q8 6 16 0"/></g>
  <g class="oeil-ouvert"><circle cx="144" cy="72" r="7" fill="#fff"/><circle cx="172" cy="72" r="7" fill="#fff"/><circle cx="145" cy="73" r="3.5" fill="#2B2B33"/><circle cx="173" cy="73" r="3.5" fill="#2B2B33"/></g>
  <path d="M152 84h8l-4 5z" fill="#F2A3B5"/>
  <path class="bouche-fermee" d="M156 89q-5 6-10 2M156 89q5 6 10 2" fill="none" stroke="#2B2B33" stroke-width="2"/>
  <ellipse class="bouche-ouverte" cx="156" cy="95" rx="7" ry="9" fill="#9a2a32"/>
  <g stroke="#8A5A2B" stroke-width="1.5"><path d="M136 84l-24-4M136 88l-24 4M176 84l24-4M176 88l24 4"/></g>
  <path d="M126 100q30 12 60 0" fill="none" stroke="#D64045" stroke-width="5"/><circle cx="156" cy="108" r="6" fill="#FFC857"/>
  <g id="zzz"><text x="196" y="30" class="z">z</text><text x="216" y="10" class="z petit">z</text></g>
  <g id="bulle"><rect x="120" y="-34" width="96" height="42" rx="12" fill="#fff"/><path d="M150 8l10 14 6-14z" fill="#fff"/><text x="168" y="-5" class="bulle-txt">Mmh ?</text></g>
</g>
<g id="jeu-souris" transform="translate(40,300)"><use href="#souris-side" width="130" height="100"/></g>
</svg>`;
  }

  // ---------- Chapitre 3 : la caméra (deux plans) ----------
  function camSVG() {
    return `<svg class="camsvg" viewBox="0 0 400 300" aria-hidden="true">
<g id="cam1">
  <rect width="400" height="300" fill="#06180B"/>
  <line x1="0" y1="232" x2="400" y2="232" stroke="#1d4d26" stroke-width="2"/>
  <rect x="290" y="30" width="80" height="90" fill="none" stroke="#2fbf2f" stroke-width="2"/><path d="M330 30v90M290 75h80" stroke="#2fbf2f" stroke-width="1.5"/>
  <rect x="40" y="110" width="230" height="30" rx="6" fill="none" stroke="#2fbf2f" stroke-width="2"/>
  <rect x="40" y="140" width="250" height="92" rx="8" fill="#0b3a14" stroke="#2fbf2f" stroke-width="2"/>
  <rect x="52" y="146" width="70" height="30" rx="8" fill="#0f4a1b" stroke="#39FF14" stroke-width="1.5"/>
  <ellipse cx="150" cy="168" rx="58" ry="22" fill="#0f4a1b" stroke="#39FF14" stroke-width="2"/>
  <path d="M100 152q-10-14-2-24M108 150q-6-16 4-24M116 152q-2-14 8-20" stroke="#39FF14" stroke-width="2" fill="none"/>
  <ellipse cx="232" cy="176" rx="30" ry="14" fill="#0f4a1b" stroke="#39FF14" stroke-width="2"/>
  <circle cx="205" cy="163" r="9" fill="#0f4a1b" stroke="#39FF14" stroke-width="2"/><path d="M199 156q6-6 12 0" stroke="#39FF14" stroke-width="2" fill="none"/>
  <g id="dent1"><use href="#dent-cam" x="112" y="168" width="14" height="14"/></g>
  <path d="M30 262q-10 10 0 16 8 4 14-4l4-22h-10z" fill="none" stroke="#2fbf2f" stroke-width="1.5"/>
  <rect x="310" y="170" width="60" height="62" fill="none" stroke="#2fbf2f" stroke-width="2"/><rect x="325" y="140" width="30" height="30" fill="none" stroke="#2fbf2f" stroke-width="1.5"/>
  <g id="cs1" class="cam-souris"><use href="#souris-cam" width="70" height="54"/></g>
</g>
<g id="cam2" hidden>
  <rect width="400" height="300" fill="#06180B"/>
  <line x1="0" y1="250" x2="400" y2="250" stroke="#1d4d26" stroke-width="2"/>
  <rect x="100" y="120" width="200" height="130" fill="none" stroke="#2fbf2f" stroke-width="2"/>
  <rect x="140" y="160" width="120" height="90" fill="#0b2a10" stroke="#2fbf2f" stroke-width="2"/>
  <path d="M165 250q12-40 32-18 10-30 32 0" stroke="#39FF14" stroke-width="1.5" fill="none"/>
  <rect x="86" y="108" width="228" height="14" rx="3" fill="#0f4a1b" stroke="#39FF14" stroke-width="2"/>
  <circle cx="200" cy="66" r="22" fill="none" stroke="#2fbf2f" stroke-width="2"/><path d="M200 66v-14M200 66l9 7" stroke="#39FF14" stroke-width="2" stroke-linecap="round"/>
  <rect x="112" y="78" width="16" height="30" fill="none" stroke="#2fbf2f" stroke-width="1.5"/>
  <g id="bateau2" class="cam-bateau"><use href="#bateau-cam" width="46" height="25"/></g>
  <g id="cs2" class="cam-souris"><use href="#souris-cam" width="70" height="54"/></g>
</g>
</svg>`;
  }

  // ---------- Chapitre 4 : l'enveloppe ----------
  function enveloppeSVG(enfant) {
    return `<svg class="env" viewBox="0 0 400 280" role="img" aria-label="Une enveloppe fermée par un cachet de cire">
<rect x="40" y="60" width="320" height="200" rx="10" fill="#FFF6E0" stroke="#e6d6ae" stroke-width="2"/>
<path d="M40 70L200 190 360 70" fill="none" stroke="#e6d6ae" stroke-width="2"/>
<path d="M40 260L200 150 360 260" fill="#f7ecd0" stroke="#e6d6ae" stroke-width="2"/>
<text x="200" y="252" class="env-nom">pour ${enfant}</text>
<g id="rabat"><path d="M40 60L200 190 360 60Z" fill="#fbf1dc" stroke="#e6d6ae" stroke-width="2"/></g>
<g id="cachet" class="tap" role="button" aria-label="Ouvrir la lettre" tabindex="0"><circle cx="200" cy="190" r="40" fill="url(#gcire)" stroke="#8d1c26" stroke-width="2"/><use href="#dent" x="184" y="174" width="32" height="32"/></g>
</svg>`;
  }

  // ---------- Chapitre secret : trois tableaux ----------
  function tableau13(i) {
    const fond = `<defs>${CIEL}</defs><rect width="300" height="200" fill="url(#gciel)"/>${etoiles(25, 300, 200, 13 + i)}`;
    if (i === 0) return `<svg viewBox="0 0 300 200">${fond}<rect x="120" y="20" width="60" height="160" fill="#232c66"/><circle cx="150" cy="52" r="14" fill="#F3EFE6"/><rect x="141" y="66" width="18" height="40" rx="6" fill="#F3EFE6"/><path d="M141 75l-14 18M159 75l14 18" stroke="#F3EFE6" stroke-width="4" stroke-linecap="round"/><path d="M144 52q3 3 6 0M150 52q3 3 6 0" stroke="#2B2B33" stroke-width="1.5" fill="none"/><rect y="180" width="300" height="20" fill="#1A2A26"/><use href="#souris-side" x="40" y="118" width="80" height="62"/></svg>`;
    if (i === 1) return `<svg viewBox="0 0 300 200">${fond}<rect y="160" width="300" height="40" fill="#1A2A26"/><g transform="translate(60,60) scale(.8)"><path d="M20 90C-20 100-25 50 10 60" fill="none" stroke="#E8A552" stroke-width="14" stroke-linecap="round"/><ellipse cx="90" cy="92" rx="80" ry="40" fill="#E8A552"/><circle cx="156" cy="72" r="36" fill="#E8A552"/><path d="M126 50l-4-30 26 14zM186 50l4-30-26 14z" fill="#E8A552"/><g fill="none" stroke="#2B2B33" stroke-width="3" stroke-linecap="round"><path d="M136 72q8 6 16 0M164 72q8 6 16 0"/></g><path d="M152 84h8l-4 5z" fill="#F2A3B5"/><text x="196" y="30" class="z">z</text><text x="216" y="10" class="z petit">z</text></g><use href="#souris-side" x="10" y="100" width="70" height="54"/></svg>`;
    return `<svg viewBox="0 0 300 200">${fond}<rect x="60" y="60" width="180" height="110" rx="10" fill="#F3EFE6"/><rect x="60" y="150" width="180" height="20" fill="#A79E95"/><use href="#dent" x="92" y="86" width="50" height="50"/><use href="#dent" x="158" y="86" width="50" height="50"/><path d="M150 128l-7-7a4 4 0 0 1 7-5 4 4 0 0 1 7 5z" fill="#D64045"/><text x="150" y="80" font-family="Baloo 2" font-weight="800" font-size="12" fill="#1F2235" text-anchor="middle">salle des jumelles</text></svg>`;
  }

  return { symboles, icone, badgeIcone, cielSVG, carteSVG, jeuSVG, camSVG, enveloppeSVG, tableau13, lune };
})();
