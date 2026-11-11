// Mini serveur local pour tester le site : `node outils/serveur.js` puis http://localhost:8765/
// (ouvrir index.html directement depuis l'explorateur ne charge pas les polices dans certains navigateurs)
const http = require('http'), fs = require('fs'), path = require('path');
const racine = path.resolve(__dirname, '..');
const port = Number(process.argv[2]) || 8765;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.md': 'text/plain; charset=utf-8', '.pdf': 'application/pdf' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.normalize(path.join(racine, p));
  if (!f.startsWith(racine)) { res.writeHead(403); res.end(); return; }
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Introuvable : ' + p); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(port, () => console.log('Site de test : http://localhost:' + port + '/   (Ctrl+C pour arrêter)'));
