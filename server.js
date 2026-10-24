/**
 * Serves the Expo web static export (`dist/`) for a Railway preview.
 * Binds to 0.0.0.0 and process.env.PORT. No extra npm dependency.
 *
 * Expo writes /family-tree.html, /places/index.html, and /places/pl-10j.html.
 * A request such as /places/some-new-id falls through to places/[id].html.
 */
const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, 'dist');
const host = '0.0.0.0';
const port = Number(process.env.PORT) || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function insideRoot(candidate) {
  const resolved = path.resolve(candidate);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null;
  return resolved;
}

function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function isDir(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function dynamicEntry(dir, asFile) {
  let names = [];
  try {
    names = fs.readdirSync(dir);
  } catch {
    return null;
  }
  const name = names.find((entry) =>
    asFile ? /^\[[^/]+\]\.html$/.test(entry) : /^\[[^/]+\]$/.test(entry),
  );
  if (!name) return null;
  const full = path.join(dir, name);
  if (asFile ? !isFile(full) : !isDir(full)) return null;
  return full;
}

function resolveRoute(urlPath) {
  let decoded = urlPath;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const segments = decoded.split('/').filter(Boolean);
  const direct = insideRoot(path.join(root, ...segments));
  if (direct && isFile(direct)) return direct;

  let dir = root;
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const last = index === segments.length - 1;
    const literal = insideRoot(path.join(dir, segment));
    if (!literal) return null;

    if (last) {
      if (isFile(literal)) return literal;
      const html = `${literal}.html`;
      if (isFile(html)) return html;
      const indexHtml = insideRoot(path.join(literal, 'index.html'));
      if (indexHtml && isFile(indexHtml)) return indexHtml;
      return dynamicEntry(dir, true);
    }

    if (isDir(literal)) {
      dir = literal;
      continue;
    }
    const dynamicDir = dynamicEntry(dir, false);
    if (!dynamicDir) return null;
    dir = dynamicDir;
  }

  const indexHtml = insideRoot(path.join(dir, 'index.html'));
  return indexHtml && isFile(indexHtml) ? indexHtml : null;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }

  const pathname = (req.url || '/').split('?')[0];
  let file = resolveRoute(pathname);
  let status = 200;
  if (!file) {
    const ext = path.extname(pathname);
    if (ext && ext !== '.html') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    file = insideRoot(path.join(root, '+not-found.html'));
    status = 404;
  }
  if (!file || !isFile(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const headers = {
    'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
  };
  if (file.includes(`${path.sep}_expo${path.sep}`)) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  }
  res.writeHead(status, headers);
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(file).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Yuen's Family App web preview listening on http://${host}:${port}`);
});
