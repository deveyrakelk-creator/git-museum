const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const webRoot = path.join(__dirname, '..', 'web');
let latestFrame = null;
let latestType = 'image/jpeg';

const mime = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'application/javascript; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.json':'application/json; charset=utf-8', '.ico':'image/x-icon'
};

function send(res, code, body, type='text/plain; charset=utf-8') {
  res.writeHead(code, {'Content-Type': type, 'Access-Control-Allow-Origin':'*'});
  res.end(body);
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.normalize(path.join(webRoot, urlPath));
  if (!filePath.startsWith(webRoot)) return send(res, 403, 'Forbidden');
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not found');
    send(res, 200, data, mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers':'Content-Type'
    });
    return res.end();
  }

  if (req.method === 'POST' && req.url.startsWith('/upload')) {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      latestFrame = Buffer.concat(chunks);
      latestType = req.headers['content-type'] || 'image/jpeg';
      send(res, 200, JSON.stringify({ ok:true, size:latestFrame.length }), 'application/json; charset=utf-8');
    });
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/frame')) {
    if (!latestFrame) return send(res, 204, '');
    res.writeHead(200, {'Content-Type': latestType, 'Cache-Control':'no-store', 'Access-Control-Allow-Origin':'*'});
    return res.end(latestFrame);
  }

  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Museum guide dashboard running at http://localhost:${PORT}`);
});
