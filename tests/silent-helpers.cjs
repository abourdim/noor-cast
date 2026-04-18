// v0.9.4 — guards the silent-helper migration so a future revert can't
// silently re-introduce raw localStorage calls (which are the audit's #1
// maintainability pain point — error handling spread across 100+ sites).
//
// Source-level only (regex on noorcast.js). Run:
//   node tests/silent-helpers.cjs

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'noorcast.js'), 'utf8');

// Strip the helper declarations (lines 1–80 ish) before counting raw uses,
// so the helpers' own internal localStorage.* calls don't fail the test.
const HELPER_END = src.indexOf('/* ─────────── 1. i18n ─────────── */');
if (HELPER_END < 0) { console.error('Could not find i18n marker'); process.exit(1); }
const post = src.slice(HELPER_END);

const checks = [
  ['silentGet helper exists',  /function silentGet\(key, dflt = null\)/.test(src)],
  ['silentSet helper exists',  /function silentSet\(key, val\)/.test(src)],
  ['silentSetJSON exists',     /function silentSetJSON\(/.test(src)],
  ['silentGetJSON exists',     /function silentGetJSON\(/.test(src)],
  ['silentRemove exists',      /function silentRemove\(key\)/.test(src)],
  ['safe() helper exists',     /function safe\(fn, ctx\)/.test(src)],
  ['debounce() helper exists', /function debounce\(fn,/.test(src)],
  ['EventBus.on exists',       /EventBus = \{[\s\S]*?on\(target, evt, fn/.test(src)],
  ['WhatsNew.maybeShow exists', /const WhatsNew[\s\S]*?maybeShow\(\)/.test(src)],
  ['WhatsNew wired into init',  /WhatsNew\.maybeShow\(\)/.test(src)],
  ['WhatsNew compares semver',  /_olderThan\(a, b\)/.test(src)],

  // After the helper block, no raw localStorage calls should remain
  ['no raw localStorage.getItem after helpers',
    !/localStorage\.getItem\(/.test(post)],
  ['no raw localStorage.setItem after helpers',
    !/localStorage\.setItem\(/.test(post)],
  ['<= 1 raw localStorage.removeItem after helpers',
    (post.match(/localStorage\.removeItem\(/g) || []).length <= 1],
];

console.log('── Silent-helper invariants (regex on noorcast.js) ──');
let pass = 0, fail = 0;
for (const [label, ok] of checks) {
  if (ok) { console.log(`✓ ${label}`); pass++; }
  else    { console.log(`✗ ${label}`); fail++; }
}

// Quantitative health
const silentCalls = (src.match(/silent(Get|Set|GetJSON|SetJSON|Remove)\(/g) || []).length;
const emptyCatch = (src.match(/catch\s*\{\s*\}|catch\s*\(\w+\)\s*\{\s*\}/g) || []).length;
console.log(`\nQuantitative health (informational, not asserted):`);
console.log(`  silent helper calls:  ${silentCalls}`);
console.log(`  empty catch blocks:   ${emptyCatch}`);

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
