// v0.10.9 — deep broken-link scanner. Resolves every href/src across all
// HTML/MD/JS files relative to its OWN location and verifies the target
// exists on disk. Skips http/https/data: URIs, anchors, mailto, javascript:.
// Run: node tests/check-links.cjs

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Files to scan
const FILES = [];
const walk = (dir, depth = 0) => {
  if (depth > 4) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'output', 'NoorCast-v0.7', 'NoorCast-v0.9', 'test-results'].includes(e.name)) continue;
      walk(p, depth + 1);
    } else if (/\.(html|md|js|json|css)$/i.test(e.name)) {
      // Skip the legacy NoorCast-v0.7 + freshly built v0.9 packages — they're snapshots, not source
      if (p.includes('NoorCast-v0.')) continue;
      // Skip tests + node_modules
      if (p.includes('node_modules')) continue;
      FILES.push(p);
    }
  }
};
walk(ROOT);

// Patterns to extract per file type
const isExternal = (s) =>
  /^(https?:|data:|mailto:|tel:|javascript:|file:|\/\/)/i.test(s) ||
  s.startsWith('#') || s === '' || s === './' || s === '/';

// Strip URL fragment + query
const cleanPath = (s) => s.replace(/[#?].*$/, '');

const broken = [];
const skipped = [];

for (const file of FILES) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const dir = path.dirname(file);
  const ext = path.extname(file).toLowerCase();
  const src = fs.readFileSync(file, 'utf8');
  const refs = new Set();

  if (ext === '.html') {
    // href="..." and src="..."
    for (const m of src.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/g)) refs.add(m[1]);
    for (const m of src.matchAll(/(?:href|src)\s*=\s*'([^']+)'/g)) refs.add(m[1]);
    // CSS url(...)
    for (const m of src.matchAll(/url\(\s*["']?([^)"']+)["']?\s*\)/g)) refs.add(m[1]);
  } else if (ext === '.css') {
    for (const m of src.matchAll(/url\(\s*["']?([^)"']+)["']?\s*\)/g)) refs.add(m[1]);
  } else if (ext === '.md') {
    // Markdown [text](path) — capture group is the path
    for (const m of src.matchAll(/\]\(\s*([^)\s]+)/g)) refs.add(m[1]);
  } else if (ext === '.json') {
    // manifest.json icons[] src + start_url + scope
    for (const m of src.matchAll(/"(?:src|start_url|scope|url)"\s*:\s*"([^"]+)"/g)) refs.add(m[1]);
  } else if (ext === '.js') {
    // sw.js APP_SHELL — quoted relative paths starting with ./
    for (const m of src.matchAll(/['"]\.\/([^'"\s]+\.[a-z0-9]{2,5})['"]/g)) refs.add('./' + m[1]);
    // build-package.js — join(ROOT, '...') and similar
    for (const m of src.matchAll(/['"]([a-z][a-z0-9_\-]*\/[a-z0-9_\-/.]+\.[a-z]{2,5})['"]/gi)) {
      // Likely path-like string (e.g. 'assets/logo.svg')
      if (!m[1].includes(' ') && !m[1].includes('://')) refs.add(m[1]);
    }
  }

  // Known intentionally-may-not-exist refs (handled gracefully at runtime)
  const KNOWN_OPTIONAL = new Set([
    './firmware/noorcast-v3.6.hex',  // probed at modal open; gracefully hidden if missing
  ]);
  // Build script: paths are relative to ROOT (resolve(ROOT, ...)), not to the script file
  const RESOLVE_FROM_ROOT = rel === 'etsy-package/build-package.js';

  for (const raw of refs) {
    const r = raw.trim();
    if (isExternal(r)) { skipped.push({ file: rel, ref: r }); continue; }
    if (KNOWN_OPTIONAL.has(r)) { skipped.push({ file: rel, ref: r, optional: true }); continue; }
    const clean = cleanPath(r);
    if (!clean) continue;
    const baseDir = RESOLVE_FROM_ROOT ? ROOT : dir;
    const target = path.resolve(baseDir, clean);
    if (!fs.existsSync(target)) {
      broken.push({ file: rel, ref: raw, target: path.relative(ROOT, target).replace(/\\/g, '/') });
    }
  }
}

console.log(`── Deep link scan: ${FILES.length} files ──\n`);

if (broken.length === 0) {
  console.log('✅ All references resolve.\n');
} else {
  console.log(`❌ ${broken.length} broken reference(s):\n`);
  for (const b of broken) {
    console.log(`  ${b.file}`);
    console.log(`    → "${b.ref}"`);
    console.log(`    expected: ${b.target}`);
    console.log();
  }
}

console.log(`(Skipped ${skipped.length} external/anchor refs.)`);
process.exit(broken.length > 0 ? 1 : 0);
