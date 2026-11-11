// Les six décors illustrés du chapitre 1 (SVG 1000 × 600, sol vers y = 480).
// Chaque élément à toucher est un <g class="tap" data-el="…"> qui commence par un halo.
window.DECORS = (function () {
  'use strict';
  const A = window.ART;

  const halo = (cx, cy, r) => `<circle class="halo" cx="${cx}" cy="${cy}" r="${r}" fill="url(#halo-or)"/>`;
  const tap = (el, label, contenu, attrs) => `<g class="tap" data-el="${el}" role="button" tabindex="0" aria-label="${label}" ${attrs || ''}>${contenu}</g>`;
  const sapin = (x, y, h, fill) => `<path d="M${x} ${y}l${h * 0.32}-${h} ${h * 0.32} ${h}z" fill="${fill}"/>`;
  function sapins(xs, y, h, fill) { return xs.map(x => sapin(x, y, h, fill)).join(''); }
  function lueur(x, y, r) { return `<circle class="lueur" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="url(#halo-or)"/>`; }

  // ---------- 1. Le château ----------
  function chateau(nuit) {
    const sx = 380, sy = 362, sw = 170;
    const L = A.pointSouris(sx, sy, sw, 'lanterne');
    return `<svg class="decor decor-chateau" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Le château des dents de lait, la nuit">
${A.fond(nuit, 21, { x: 830, y: 95, r: 34 })}
<path d="M0 360Q150 300 300 340T600 330T1000 300V600H0Z" fill="#1E2658"/>
<g>${sapins([0, 60, 130, 200, 700, 760, 900, 960], 470, 150, '#1E3F36')}${sapins([30, 100, 170, 730, 820, 930], 480, 110, '#24483E')}</g>
<path d="M0 600V470Q250 450 500 470T1000 460V600Z" fill="#24483E"/>
<path d="M0 600V500Q500 480 1000 500V600Z" fill="#1A2A26"/>
<g id="chateau-svg">
  <rect x="300" y="200" width="70" height="285" fill="#E9E2D6"/><rect x="560" y="200" width="70" height="285" fill="#E9E2D6"/>
  <path d="M288 200l47-78 47 78z" fill="#D64045"/><path d="M548 200l47-78 47 78z" fill="#D64045"/>
  <path d="M335 122v-30M595 122v-30" stroke="#6b6560" stroke-width="3"/><path d="M335 92l22 8-22 8zM595 92l22 8-22 8z" fill="#FFC857"/>
  <rect x="370" y="290" width="190" height="195" fill="#DDD5C7"/>
  <g fill="#DDD5C7"><rect x="370" y="276" width="22" height="16"/><rect x="412" y="276" width="22" height="16"/><rect x="454" y="276" width="22" height="16"/><rect x="496" y="276" width="22" height="16"/><rect x="538" y="276" width="22" height="16"/></g>
  <g fill="#2b3470"><rect x="325" y="250" width="20" height="30" rx="10"/><rect x="325" y="330" width="20" height="30" rx="10"/><rect x="585" y="250" width="20" height="30" rx="10"/><rect x="585" y="330" width="20" height="30" rx="10"/><rect x="390" y="320" width="22" height="34" rx="11"/><rect x="518" y="320" width="22" height="34" rx="11"/></g>
  <path d="M440 485v-62a25 25 0 0 1 50 0v62z" fill="#6E4630"/><circle cx="480" cy="452" r="3" fill="#C9A227"/>
  <g class="tresor"><circle cx="465" cy="355" r="40" fill="url(#halo-or)" opacity=".7"/><rect x="445" y="332" width="40" height="48" rx="6" fill="#FFC857"/><path d="M445 356h40M465 332v48" stroke="#B9801A" stroke-width="2"/><use href="#dent" x="455" y="346" width="20" height="20"/></g>
</g>
<rect x="790" y="300" width="26" height="185" fill="#4a3324"/><path d="M780 485q23-20 46 0z" fill="#4a3324"/>
${tap('feuillage', 'Le feuillage de l’arbre', `${halo(803, 255, 105)}
  <g class="feuillage"><circle cx="755" cy="285" r="56" fill="#1E3F36"/><circle cx="850" cy="280" r="58" fill="#1E3F36"/><circle cx="800" cy="228" r="66" fill="#24483E"/><circle cx="765" cy="238" r="42" fill="#2F5D50"/><circle cx="836" cy="236" r="38" fill="#2F5D50"/></g>
  <g transform="translate(800,250)"><g class="hulotte"><path class="aile ag" d="M-16 6q-26 6-22 34q14-6 22-24z" fill="#8B5A3C"/><path class="aile ad" d="M16 6q26 6 22 34q-14-6-22-24z" fill="#8B5A3C"/><ellipse cx="0" cy="20" rx="19" ry="24" fill="#8B5A3C"/><ellipse cx="0" cy="24" rx="10" ry="16" fill="#C9A98A"/><circle cx="0" cy="-4" r="18" fill="#A0724A"/><path d="M-16-14l-6-14 14 6zM16-14l6-14-14 6z" fill="#A0724A"/><circle cx="-7" cy="-6" r="7.5" fill="#FFF4D6"/><circle cx="7" cy="-6" r="7.5" fill="#FFF4D6"/><circle cx="-7" cy="-6" r="3.5" fill="#2B2B33"/><circle cx="7" cy="-6" r="3.5" fill="#2B2B33"/><path d="M-3 1l3 6 3-6z" fill="#FFC857"/></g></g>`)}
<rect class="noir" x="0" y="-700" width="1000" height="1300" fill="#050816" opacity=".45"/>
${lueur(L.x, L.y, 150)}
${A.souris(sx, sy, sw, 'class="quenotte"')}
${tap('lanterne', 'La lanterne de Quenotte', `${halo(L.x.toFixed(0), L.y.toFixed(0), 40)}<circle cx="${L.x.toFixed(0)}" cy="${L.y.toFixed(0)}" r="44" fill="transparent"/>`)}
${tap('sac', 'Le sac de Quenotte', `${halo(0, 10, 56)}
  <g class="billet-sac"><use href="#billet" x="-26" y="-14" width="52" height="28" transform="rotate(-12)"/></g>
  <path d="M-36 44C-40 10-28-12 0-12s40 22 36 56z" fill="#8B5A3C" stroke="#5c3a24" stroke-width="2"/>
  <path d="M-22-6q22-14 44 0q-22 10-44 0z" fill="#6E4630"/><path d="M-18-2q18 8 36 0" stroke="#C9A227" stroke-width="3" fill="none" stroke-linecap="round"/>`, 'transform="translate(650,440)"')}
</svg>`;
  }

  // ---------- 2. La forêt des Ardennes ----------
  function foret(nuit) {
    const sx = 120, sy = 362, sw = 170;
    const L = A.pointSouris(sx, sy, sw, 'lanterne');
    const champi = (x, y, s, i) => `<g class="champi" data-sub="${i}" transform="translate(${x},${y}) scale(${s})"><circle class="champi-lueur" cx="0" cy="-16" r="70" fill="url(#halo-or)"/><rect x="-10" y="-10" width="20" height="34" rx="7" fill="#E9E2D6"/><path class="chapeau" d="M-36-6q36-48 72 0z" fill="#6b4a5a"/><circle class="pois" cx="-12" cy="-22" r="4" fill="#9a7a8a"/><circle class="pois" cx="10" cy="-30" r="3" fill="#9a7a8a"/><circle class="pois" cx="18" cy="-14" r="3.5" fill="#9a7a8a"/></g>`;
    let fars = '';
    [60, 150, 240, 330, 420, 520, 610, 700, 790, 880, 960].forEach((x, i) => { fars += `<rect x="${x}" y="-700" width="${18 + (i % 3) * 5}" height="500" fill="#141c3c"/>`; });
    return `<svg class="decor decor-foret" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="La grande forêt des Ardennes, la nuit">
${A.fond(nuit, 31, null)}
<rect x="0" y="-700" width="1000" height="1300" fill="#0d1430" opacity=".45"/>
${fars}
<path d="M0 600V480Q500 460 1000 480V600Z" fill="#14271f"/>
<path d="M-20 560Q300 470 520 500T1020 470" fill="none" stroke="#2b3b36" stroke-width="70" stroke-linecap="round"/>
<g fill="#1a1226"><rect x="30" y="0" width="52" height="490"/><path d="M10 490q46-30 92 0z"/><rect x="560" y="0" width="58" height="490"/><path d="M540 490q49-30 98 0z"/><rect x="905" y="0" width="62" height="490"/><path d="M885 490q51-30 102 0z"/></g>
<g fill="#0f2a22"><rect x="0" y="-700" width="1000" height="740"/><ellipse cx="100" cy="30" rx="260" ry="115"/><ellipse cx="220" cy="-150" rx="320" ry="130" fill="#132e26"/><ellipse cx="700" cy="-230" rx="360" ry="140" fill="#0c2219"/><ellipse cx="420" cy="-420" rx="420" ry="160" fill="#11291f"/><ellipse cx="880" cy="-520" rx="300" ry="150" fill="#0c2219"/><ellipse cx="120" cy="-600" rx="300" ry="130" fill="#132e26"/><ellipse cx="500" cy="10" rx="310" ry="125"/><ellipse cx="900" cy="30" rx="260" ry="115"/></g>
<g class="brume" fill="#cfd3ee" opacity=".08"><ellipse cx="300" cy="505" rx="220" ry="26"/><ellipse cx="750" cy="525" rx="260" ry="30"/></g>
${tap('champignons', 'Les champignons lumineux', `${halo(330, 455, 60)}${halo(480, 480, 60)}${halo(600, 452, 60)}${champi(330, 470, 1, 0)}${champi(480, 496, 1.15, 1)}${champi(600, 466, 0.95, 2)}`)}
${tap('buisson', 'Un buisson qui tremble', `${halo(0, -10, 85)}
  <g class="renard"><path d="M40 10q40-30 40 10" fill="none" stroke="#E07A3F" stroke-width="12" stroke-linecap="round"/><path d="M72 18q14-6 10 8" fill="none" stroke="#FFF4D6" stroke-width="10" stroke-linecap="round"/><ellipse cx="10" cy="14" rx="42" ry="20" fill="#E07A3F"/><ellipse cx="4" cy="22" rx="24" ry="10" fill="#FFF4D6"/><circle cx="-36" cy="2" r="19" fill="#E07A3F"/><path d="M-48-10l-6-20 16 10zM-24-10l6-20-16 10z" fill="#E07A3F"/><path d="M-52 6q-10 4-14 10 6 2 14 0z" fill="#FFF4D6"/><circle cx="-58" cy="12" r="3" fill="#2B2B33"/><circle cx="-40" cy="-1" r="3.2" fill="#2B2B33"/><circle cx="-39" cy="-2" r="1" fill="#fff"/><g fill="#E07A3F"><rect x="-18" y="26" width="10" height="14" rx="4"/><rect x="18" y="26" width="10" height="14" rx="4"/></g></g>
  <g class="buisson"><circle cx="-40" cy="-6" r="34" fill="#1E3F36"/><circle cx="0" cy="-26" r="42" fill="#24483E"/><circle cx="44" cy="-6" r="36" fill="#1E3F36"/><circle cx="6" cy="4" r="34" fill="#2F5D50"/></g>`, 'transform="translate(830,470)"')}
${tap('luciole', 'Une luciole', `<animateMotion dur="18s" repeatCount="indefinite" path="M200 300C350 200 500 380 650 280S850 200 900 320S600 420 400 340S220 380 200 300"/>${halo(0, 0, 44)}<circle r="34" fill="transparent"/><circle class="lum" r="16" fill="url(#halo-or)"/><circle r="4.5" fill="#FFF4D6"/>`)}
<rect class="dore" x="0" y="-700" width="1000" height="1300" fill="#FFC857" opacity="0"/>
${lueur(L.x, L.y, 120)}
${A.souris(sx, sy, sw, 'class="quenotte trotte"')}
</svg>`;
  }

  // ---------- 3. La Meuse ----------
  function meuse(nuit) {
    const sx = 20, sy = 296, sw = 150;
    const L = A.pointSouris(sx, sy, sw, 'lanterne');
    let lum = '';
    for (let i = 0; i < 14; i++) lum += `<rect x="${790 + i * 15}" y="${300 - (i % 4) * 9}" width="5" height="7" fill="#FFC857"/>`;
    return `<svg class="decor decor-meuse" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="La Meuse sous la lune, avec le billet à plier en bateau">
${A.fond(nuit, 41, { x: 700, y: 110, r: 38 })}
<defs><linearGradient id="geau" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a8ea3"/><stop offset="1" stop-color="#2b5f70"/></linearGradient></defs>
<path d="M0 330Q200 280 400 320T1000 290V600H0Z" fill="#1E2658"/>
<g class="lumieres"><g fill="#1b2250"><rect x="780" y="260" width="60" height="70"/><rect x="845" y="245" width="40" height="85"/><rect x="890" y="270" width="80" height="60"/><path d="M845 245l20-28 20 28z"/><rect x="970" y="250" width="30" height="80"/></g>${lum}</g>
<rect y="330" width="1000" height="270" fill="url(#geau)"/>
<g class="vagues" fill="none" stroke="#7FB8C7" stroke-width="2.5" stroke-linecap="round" opacity=".5"><path d="M-100 400q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0"/><path d="M-100 470q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" opacity=".7"/><path d="M-100 540q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" opacity=".5"/></g>
${tap('reflet', 'Le reflet de la lune', `${halo(700, 420, 70)}<ellipse class="reflet" cx="700" cy="420" rx="48" ry="14" fill="#FFF4D6" opacity=".55"/><g class="ronds" fill="none" stroke="#FFF4D6" stroke-width="2"><ellipse cx="700" cy="420" rx="30" ry="9"/><ellipse cx="700" cy="420" rx="30" ry="9"/><ellipse cx="700" cy="420" rx="30" ry="9"/></g>`)}
${tap('bulles', 'Des bulles dans l’eau', `${halo(470, 440, 60)}<g class="bulles-eau" fill="none" stroke="#cfe9f0" stroke-width="2"><circle cx="458" cy="462" r="5"/><circle cx="476" cy="470" r="7"/><circle cx="490" cy="455" r="4"/></g>
  <g class="poisson"><g class="poisson-in"><ellipse cx="0" cy="0" rx="28" ry="13" fill="#9fd0dd" stroke="#5f9fb0" stroke-width="2"/><path d="M26-2l16-12v28l-16-12z" fill="#9fd0dd" stroke="#5f9fb0" stroke-width="2"/><circle cx="-14" cy="-3" r="3" fill="#2B2B33"/><path d="M-6-13q6-8 12 0" fill="none" stroke="#5f9fb0" stroke-width="2"/></g></g>`, 'transform="translate(0,0)"')}
<path d="M0 600V380Q120 360 240 400L300 600Z" fill="#24483E"/><path d="M0 600V440Q120 430 230 470L260 600Z" fill="#1A2A26"/>
<path d="M1000 600V360Q900 350 780 400L720 600Z" fill="#24483E"/><path d="M1000 600V430Q900 420 790 460L760 600Z" fill="#1A2A26"/>
<g fill="#2F5D50"><ellipse cx="60" cy="390" rx="40" ry="18"/><ellipse cx="900" cy="372" rx="46" ry="18"/></g>
${lueur(L.x, L.y, 110)}
${A.souris(sx, sy, sw, 'class="quenotte rive-g"')}
${tap('billet', 'Le billet de 5 euros à plier', `${halo(0, 0, 84)}
  <g class="pli pli0"><use href="#billet" x="-70" y="-37" width="140" height="74"/></g>
  <g class="pli pli1"><rect x="-70" y="-20" width="140" height="40" rx="3" fill="#B9C4B0" stroke="#7f8c7a" stroke-width="2"/><path d="M-70 0h140" stroke="#8fa08a" stroke-width="2" stroke-dasharray="6 4"/><text x="0" y="12" font-family="Share Tech Mono, monospace" font-size="18" fill="#4a5a4a" text-anchor="middle">5 €</text></g>
  <g class="pli pli2"><path d="M-62 18L0-44l62 62z" fill="#CBD3C4" stroke="#7f8c7a" stroke-width="2"/><rect x="-62" y="18" width="124" height="16" fill="#B9C4B0" stroke="#7f8c7a" stroke-width="2"/><path d="M0-44v62" stroke="#8fa08a" stroke-width="2"/></g>
  <g class="pli pli3"><use href="#bateau" x="-70" y="-40" width="140" height="74"/></g>`, 'transform="translate(135,330)" data-etape="0"')}
<g class="navire" transform="translate(230,440)"><use href="#bateau" x="-70" y="-40" width="140" height="74"/>${A.souris(-52, -106, 110)}</g>
${A.souris(800, 296, 150, 'class="quenotte rive-d"')}
</svg>`;
  }

  // ---------- 4. La place Ducale ----------
  function place(nuit) {
    const sx = 270, sy = 376, sw = 150;
    const L = A.pointSouris(sx, sy, sw, 'lanterne');
    let maisons = '';
    for (let i = 0; i < 5; i++) {
      const x = i * 152, mur = i % 2 ? '#C79B74' : '#D6B493';
      maisons += `<path d="M${x} 232L${x + 76} 168l76 64z" fill="#2A3470"/><rect x="${x + 64}" y="196" width="24" height="26" fill="#3A4690"/><rect x="${x + 70}" y="202" width="12" height="14" fill="#141A3A"/>
<rect x="${x}" y="232" width="152" height="130" fill="${mur}"/>
<g fill="#1b2250" stroke="#F3EFE6" stroke-width="2"><rect x="${x + 20}" y="246" width="24" height="40"/><rect x="${x + 64}" y="246" width="24" height="40"/><rect x="${x + 108}" y="246" width="24" height="40"/><rect x="${x + 20}" y="300" width="24" height="44"/><rect x="${x + 64}" y="300" width="24" height="44"/><rect x="${x + 108}" y="300" width="24" height="44"/></g>
<rect x="${x}" y="362" width="152" height="120" fill="#B98B68"/><path d="M${x + 12} 482v-66a64 64 0 0 1 128 0v66z" fill="#151a40"/><rect x="${x}" y="362" width="12" height="120" fill="#A07A58"/>`;
    }
    return `<svg class="decor decor-place" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="La place Ducale de Charleville et ses arcades, avec le Grand Marionnettiste">
${A.fond(nuit, 51, { x: 150, y: 100, r: 26 })}
${maisons}
<rect x="800" y="90" width="92" height="392" fill="#232c66"/><path d="M790 90l56-60 56 60z" fill="#3A4690"/><rect x="800" y="90" width="92" height="8" fill="#3A4690"/>
<rect y="482" width="1000" height="118" fill="#4d4a5a"/><g fill="none" stroke="#5c5a6a" stroke-width="2"><path d="M0 520q50-10 100 0t100 0 100 0 100 0 100 0 100 0 100 0 100 0 100 0 100 0"/><path d="M0 560q50-10 100 0t100 0 100 0 100 0 100 0 100 0 100 0 100 0 100 0 100 0"/></g>
${tap('marionnettiste', 'Le Grand Marionnettiste', `${halo(846, 230, 95)}
  <rect x="815" y="150" width="62" height="150" fill="#151a40"/>
  <g class="geant"><circle cx="846" cy="182" r="16" fill="#F3EFE6"/><rect x="836" y="198" width="20" height="46" rx="7" fill="#F3EFE6"/><path class="bras-g" d="M836 208l-16 20" stroke="#F3EFE6" stroke-width="5" stroke-linecap="round"/><path class="bras-d" d="M856 208l16 20" stroke="#F3EFE6" stroke-width="5" stroke-linecap="round"/><path d="M840 244l-4 18M852 244l4 18" stroke="#F3EFE6" stroke-width="5" stroke-linecap="round"/><path d="M840 182q3 3 6 0M846 182q3 3 6 0" stroke="#2B2B33" stroke-width="1.5" fill="none"/></g>
  <g class="pantin"><path d="M846 262v40" stroke="#cfd3ee" stroke-width="1"/><g transform="translate(846,302)"><circle cx="0" cy="0" r="7" fill="#FFC857"/><rect x="-5" y="7" width="10" height="16" rx="3" fill="#D64045"/><path d="M-5 11l-8 8M5 11l8 8M-3 23l-3 10M3 23l3 10" stroke="#FFC857" stroke-width="3" stroke-linecap="round"/></g></g>`)}
${tap('fenetre', 'Une fenêtre qui clignote', `${halo(0, 0, 48)}<rect class="vitre" x="-12" y="-22" width="24" height="44" fill="#FFC857"/><g class="pigeon"><ellipse cx="0" cy="10" rx="15" ry="9" fill="#9aa0b5"/><circle cx="-12" cy="2" r="7" fill="#9aa0b5"/><path d="M-19 2l-6 2 6 2z" fill="#FFC857"/><circle cx="-13" cy="0" r="1.6" fill="#2B2B33"/><path d="M-4 8q10-6 16 0" fill="none" stroke="#6b7390" stroke-width="2"/></g>`, 'transform="translate(380,322)"')}
${tap('fromage', 'Un morceau de fromage', `${halo(0, 0, 46)}<g class="fromage"><path d="M-30 14L30 14 30-4-30-14z" fill="#FFC857" stroke="#B9801A" stroke-width="2"/><circle cx="-12" cy="2" r="4" fill="#e0a93f"/><circle cx="8" cy="6" r="3" fill="#e0a93f"/><circle cx="18" cy="-1" r="2.5" fill="#e0a93f"/></g><g class="miettes" fill="#FFC857"><circle cx="-38" cy="16" r="2.5"/><circle cx="36" cy="18" r="2"/><circle cx="-28" cy="22" r="1.8"/></g>`, 'transform="translate(560,520)"')}
${lueur(L.x, L.y, 110)}
${A.souris(sx, sy, sw, 'class="quenotte trotte"')}
</svg>`;
  }

  // ---------- 5. Aiglemont ----------
  function aiglemont(nuit) {
    const sx = 40, sy = 376, sw = 150;
    const L = A.pointSouris(sx, sy, sw, 'lanterne');
    const volet = (x, y) => `<rect x="${x}" y="${y}" width="26" height="36" fill="#2b3470"/><g fill="#3E7C8F" stroke="#2b5a66" stroke-width="1.5"><rect x="${x}" y="${y}" width="13" height="36"/><rect x="${x + 13}" y="${y}" width="13" height="36"/></g>`;
    const maison = (x, y, w, h, toit) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="#E9E2D6"/><path d="M${x - 10} ${y - h}l${w / 2 + 10}-${h * 0.55} ${w / 2 + 10} ${h * 0.55}z" fill="${toit}"/><rect x="${x + w / 2 - 12}" y="${y - 50}" width="24" height="50" fill="#6E4630"/>${volet(x + 14, y - h + 18)}${volet(x + w - 40, y - h + 18)}`;
    return `<svg class="decor decor-aiglemont" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Les maisons endormies d’Aiglemont et la girouette">
${A.fond(nuit, 61, { x: 880, y: 80, r: 30 })}
<path d="M0 600V440Q300 400 600 350T1000 290V600Z" fill="#1E3F36"/>
<path d="M0 600V480Q300 440 600 400T1000 340V600Z" fill="#24483E"/>
<path d="M-20 580Q300 520 600 470T1020 400" fill="none" stroke="#1A2A26" stroke-width="56" stroke-linecap="round"/>
<circle class="lueur-maison" cx="735" cy="380" r="200" fill="url(#halo-or)"/>
${maison(80, 480, 150, 100, '#D64045')}
${maison(330, 450, 170, 110, '#3E7C8F')}
${maison(640, 400, 190, 130, '#D64045')}
<rect x="920" y="300" width="100" height="70" fill="#E9E2D6"/><path d="M910 300l60-40 60 40z" fill="#3E7C8F"/>${volet(940, 318)}
${tap('fenetre', 'La fenêtre de la chambre', `${halo(0, 0, 44)}<rect class="vitre" x="-18" y="-24" width="36" height="48" rx="3" fill="#FFC857"/><g class="nicolas"><circle cx="0" cy="-4" r="8" fill="#2b2b33"/><rect x="-8" y="4" width="16" height="20" rx="5" fill="#2b2b33"/><path d="M-8 10l-6 8M8 10l6 8" stroke="#2b2b33" stroke-width="4" stroke-linecap="round"/></g><path d="M-18 0h36M0-24v48" stroke="#F3EFE6" stroke-width="2.5"/><rect x="-18" y="-24" width="36" height="48" rx="3" fill="none" stroke="#F3EFE6" stroke-width="3"/>`, 'transform="translate(735,312)"')}
${tap('girouette', 'La girouette', `${halo(0, -24, 52)}<rect x="-3" y="-14" width="6" height="40" fill="#6b6560"/><g class="coq"><path d="M-34-24h68" stroke="#F3EFE6" stroke-width="4" stroke-linecap="round"/><path d="M24-34l12 10-12 10z" fill="#F3EFE6"/><path d="M-6-28q-6-18 8-22 10-2 14 8 2 8-6 14z" fill="#D64045"/><path d="M-10-46l4-8 4 8 4-8 2 10z" fill="#FFC857"/><circle cx="8" cy="-40" r="1.8" fill="#2B2B33"/></g>`, 'transform="translate(415,318)"')}
${tap('lampadaire', 'Un lampadaire qui grésille', `${halo(0, -162, 52)}<rect x="-4" y="-150" width="8" height="150" fill="#6b6560"/><path d="M-20-150h40l-6-28h-28z" fill="#3b4254"/><circle class="lampe-lueur" cx="0" cy="-164" r="80" fill="url(#halo-or)"/><circle class="ampoule" cx="0" cy="-164" r="11" fill="#FFC857"/>`, 'transform="translate(230,470)"')}
${lueur(L.x, L.y, 100)}
${A.souris(sx, sy, sw, 'class="quenotte trotte"')}
</svg>`;
  }

  // ---------- 6. Pantoufle ----------
  function pantoufle(nuit) {
    const sx = 120, sy = 376, sw = 150;
    const L = A.pointSouris(sx, sy, sw, 'lanterne');
    let cloture = '';
    for (let x = 20; x <= 330; x += 32) cloture += `<rect x="${x}" y="400" width="10" height="82" rx="3"/>`;
    return `<svg class="decor decor-pantoufle" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Le jardin, la porte de la maison et le chat endormi sur le seuil">
${A.fond(nuit, 71, { x: 120, y: 90, r: 24 })}
<path d="M0 600V430Q200 410 400 420T1000 400V600Z" fill="#1E3F36"/>
<rect x="560" y="110" width="440" height="390" fill="#E9E2D6"/><rect x="540" y="84" width="460" height="30" fill="#D64045"/><rect x="560" y="114" width="440" height="6" fill="#c9bfae"/>
<rect x="860" y="170" width="80" height="96" fill="#2b3470"/><path d="M900 170v96M860 218h80" stroke="#F3EFE6" stroke-width="3"/><rect x="860" y="170" width="80" height="96" fill="none" stroke="#F3EFE6" stroke-width="4"/>
<g fill="#6b6560">${cloture}<rect x="20" y="420" width="320" height="8"/><rect x="20" y="460" width="320" height="8"/></g>
<rect y="490" width="1000" height="110" fill="#1A2A26"/>
<g fill="#2F5D50"><ellipse cx="420" cy="482" rx="60" ry="34"/><ellipse cx="90" cy="486" rx="70" ry="34"/><ellipse cx="960" cy="486" rx="50" ry="28"/></g>
<g><path d="M470 490l6-34h36l6 34z" fill="#B05E3B"/><circle cx="488" cy="446" r="12" fill="#D64045"/><circle cx="500" cy="440" r="10" fill="#F2A3B5"/><circle cx="476" cy="440" r="9" fill="#FFC857"/></g>
${tap('porte', 'La porte de la maison', `${halo(0, -95, 95)}<path d="M-74 0v-170a74 74 0 0 1 148 0V0z" fill="#4a3324"/><g class="battant"><path d="M-60 0v-168a60 60 0 0 1 120 0V0z" fill="#8B5A3C"/><rect x="-42" y="-150" width="34" height="62" rx="4" fill="#6E4630"/><rect x="8" y="-150" width="34" height="62" rx="4" fill="#6E4630"/><rect x="-42" y="-74" width="34" height="56" rx="4" fill="#6E4630"/><rect x="8" y="-74" width="34" height="56" rx="4" fill="#6E4630"/><circle cx="44" cy="-80" r="6" fill="#C9A227"/></g>`, 'transform="translate(700,482)"')}
<rect x="600" y="482" width="200" height="14" fill="#A79E95"/>
<g class="chat-dort" transform="translate(616,420) scale(.9)">
  <path class="queue" d="M-70 50C-110 60-115 10-80 20" fill="none" stroke="#20222e" stroke-width="14" stroke-linecap="round"/>
  <ellipse class="fourrure" cx="0" cy="48" rx="82" ry="36" fill="#20222e"/>
  <g class="rayures" fill="none" stroke="#C9833A" stroke-width="6" stroke-linecap="round"><path d="M-40 22q6 12 2 24M-16 18q6 14 2 28M8 18q6 14 2 28"/></g>
  <circle class="fourrure" cx="70" cy="22" r="36" fill="#20222e"/>
  <path class="fourrure" d="M40 0l-4-30 26 14zM100 0l4-30-26 14z" fill="#20222e"/><path class="oreilles" d="M43-4l-2-14 12 7zM97-4l2-14-12 7z" fill="#F2A3B5"/>
  ${tap('moustache', 'Les moustaches de Pantoufle', `${halo(104, 40, 32)}<g class="moustaches" stroke="#cfd3ee" stroke-width="2" stroke-linecap="round"><path d="M50 34l-26-4M50 38l-26 4M90 34l26-4M90 38l26 4"/></g><circle cx="100" cy="36" r="30" fill="transparent"/>`)}
  <path class="nez" d="M66 34h8l-4 5z" fill="#F2A3B5"/><path class="bouche" d="M70 39q-5 6-10 2M70 39q5 6 10 2" fill="none" stroke="#2B2B33" stroke-width="2"/>
  ${tap('yeux', 'Deux yeux qui brillent dans le noir', `${halo(70, 20, 52)}<g class="yeux-brillent"><ellipse cx="58" cy="20" rx="9" ry="6.5" fill="#FFC857"/><ellipse cx="84" cy="20" rx="9" ry="6.5" fill="#FFC857"/><ellipse cx="58" cy="20" rx="2.2" ry="5" fill="#2B2B33"/><ellipse cx="84" cy="20" rx="2.2" ry="5" fill="#2B2B33"/></g><g class="yeux-fermes" fill="none" stroke="#2B2B33" stroke-width="3" stroke-linecap="round"><path d="M50 22q8 6 16 0M76 22q8 6 16 0"/></g>`)}
  <path d="M40 50q30 12 60 0" fill="none" stroke="#D64045" stroke-width="5"/><circle cx="70" cy="58" r="6" fill="#FFC857"/>
  <g class="zzz"><text x="110" y="-20" class="z">z</text><text x="130" y="-40" class="z petit">z</text></g>
</g>
${lueur(L.x, L.y, 100)}
${tap('quenotte', 'Quenotte', `${halo(195, 430, 95)}${A.souris(sx, sy, sw, 'class="quenotte"')}`)}
</svg>`;
  }

  return { chateau, foret, meuse, place, aiglemont, pantoufle };
})();
