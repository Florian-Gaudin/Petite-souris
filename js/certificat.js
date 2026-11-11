// Le diplôme, utilisé à l'écran (chapitre 5) et sur la page d'impression (certificat.html).
window.CERTIFICAT = (function () {
  'use strict';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Mâchoire du bas : 10 dents de lait sur un arc, les incisives centrales marquées
  function machoireSVG(dents) {
    const C = window.CONFIG;
    const parPosition = {};
    (dents || C.dents).forEach(d => { parPosition[d.position] = d.numero; });
    let out = `<svg class="machoire" viewBox="0 0 220 104" role="img" aria-label="Schéma de la mâchoire du bas : dix dents de lait, les deux incisives centrales marquées">`;
    out += `<path d="M18 16q92 150 184 0" fill="none" stroke="#C9A227" stroke-width="1.5"/>`;
    const noms = ['molaire', 'molaire', 'canine', 'incisive', 'bas-centrale-gauche', 'bas-centrale-droite', 'incisive', 'canine', 'molaire', 'molaire'];
    for (let i = 0; i < 10; i++) {
      const x = 30 + i * 17.8;
      const y = 20 + 62 * (1 - Math.pow((x - 110) / 86, 2));
      const w = (i === 4 || i === 5) ? 15 : (i >= 3 && i <= 6 ? 13 : 16), h = (i === 4 || i === 5) ? 18 : 15;
      const num = parPosition[noms[i]];
      const tombee = !!num;
      out += `<rect x="${(x - w / 2).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${w}" height="${h}" rx="4" fill="${tombee ? '#D64045' : '#fff'}" stroke="${tombee ? '#9a2a32' : '#7a6220'}" stroke-width="1"/>`;
      if (tombee) out += `<text x="${x.toFixed(1)}" y="${(y + h / 2 + 11).toFixed(1)}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="9" fill="#D64045">${num}<tspan font-size="6" dy="-3">${num === 1 ? 're' : 'e'}</tspan></text>`;
    }
    out += `</svg><div class="machoire-legende">Mâchoire du bas, vue de face : les deux incisives centrales sont tombées.</div>`;
    return out;
  }

  function tamponSVG() {
    return `<svg class="tampon" viewBox="0 0 120 120" aria-hidden="true">
<defs><path id="cercleTxt" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1 -88 0"/></defs>
<circle cx="60" cy="60" r="56" fill="none" stroke="#C9A227" stroke-width="3"/><circle cx="60" cy="60" r="50" fill="none" stroke="#C9A227" stroke-width="1"/>
<text font-family="Libre Baskerville, serif" font-size="9.5" fill="#C9A227" letter-spacing="1.5"><textPath href="#cercleTxt">CHÂTEAU DES DENTS DE LAIT · ARDENNES · VU ET APPROUVÉ ·</textPath></text>
<use href="#dent" x="44" y="40" width="32" height="32"/><text x="60" y="88" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="11" fill="#C9A227">OFFICIEL</text>
</svg>`;
  }

  // opts : { badges: [ids], secret: bool, nuitTexte: "nuit du …", dents, etoiles: n, total: n }
  function html(opts) {
    const C = window.CONFIG, D = window.DATA;
    const T = s => s.replace(/\{(\w+)\}/g, (m, k) => C[k] != null ? C[k] : m);
    const gagnes = opts.badges || [];
    const badges = D.badges.filter(b => !b.secret || opts.secret).map(b => {
      const ok = gagnes.indexOf(b.id) >= 0;
      return `<div class="badge-dip ${ok ? '' : 'off'}" title="${ok ? 'Badge gagné' : 'Badge à gagner'}">${window.ART.badgeIcone(b.id, 46)}<span>${esc(T(b.nom))}</span></div>`;
    }).join('');
    const derniere = C.dents[C.dents.length - 1];
    const ordinal = derniere.numero === 1 ? '1<sup>re</sup>' : derniere.numero + '<sup>e</sup>';
    const total = opts.total || D.scenes.reduce((n, s) => n + s.bonus.length, 0);
    const etoiles = Math.max(0, Math.min(total, opts.etoiles || 0));
    let etoilesSVG = '';
    for (let i = 0; i < total; i++) etoilesSVG += `<svg class="dip-etoile ${i < etoiles ? '' : 'off'}" viewBox="0 0 24 24" aria-hidden="true"><use href="#etoile5"/></svg>`;
    return `<div class="diplome">
  <div class="dip-bord">
    <div class="dip-coin c1"></div><div class="dip-coin c2"></div><div class="dip-coin c3"></div><div class="dip-coin c4"></div>
    <div class="dip-entete">Certificat officiel</div>
    <div class="dip-sous">de dent de lait perdue</div>
    <div class="dip-decerne">décerné à</div>
    <div class="dip-nom">${esc(C.enfant)}</div>
    <p class="dip-texte">qui a perdu sa <b>${ordinal} dent de lait</b>, une incisive centrale du bas, qui a guidé ${esc(C.souris)} jusqu'à sa maison et l'a aidée à passer devant le chat ${esc(C.chat)}.<br>Son billet de 5 € a traversé la Meuse en bateau.</p>
    <div class="dip-etoiles" aria-label="${etoiles} étoiles de découverte sur ${total}">${etoilesSVG}<span>${etoiles} étoile${etoiles > 1 ? 's' : ''} de découverte sur ${total}</span></div>
    <div class="dip-milieu">
      <div class="dip-machoire">${machoireSVG(opts.dents)}</div>
      <div class="dip-badges">${badges}</div>
    </div>
    <div class="dip-pied">
      <div class="dip-date">Fait à ${esc(C.ville)},<br>${esc(opts.nuitTexte || '')}</div>
      <div class="dip-tampon">${tamponSVG()}</div>
      <div class="dip-sign"><span class="sign">${esc(C.souris)}</span><small>Petite Souris des Ardennes</small><small>Témoin officiel : ${esc(C.poupee)} (dormait)</small></div>
    </div>
    <div class="dip-sourire"><span>Dessine ton nouveau sourire ici</span></div>
  </div>
</div>`;
  }
  return { html, machoireSVG, tamponSVG };
})();
