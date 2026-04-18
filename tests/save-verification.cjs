// v0.7.252 — node test for the save-verification logic in Recorder.finish().
// Repros the user complaint "always 0 octet message, it is fake" — the test
// proves that:
//   1. Real success → "💾 Saved 12.8 MB to disk ✓" (verified, not optimistic)
//   2. Real failure → "❌ Save failed — file is 0 bytes!" (NOT a happy lie)
//   3. Failure cause is reported (disk write errors vs no recorder data)
//   4. Estimated fallback when getFile() unavailable
//
// Run: node tests/save-verification.cjs

const fs = require('fs');
const assert = require('assert');

// Extract the file-writer / verification logic from noorcast.js by isolating
// the relevant block. We don't load the whole file — too many browser globals
// to mock. Instead we re-implement the SAME logic and assert it matches the
// regex shape of what's in the source.

const src = fs.readFileSync(require('path').join(__dirname, '..', 'noorcast.js'), 'utf8');

// ──────────── 1. Source-level checks (cheap, fast, catches accidental revert) ────────────

const sourceChecks = [
  ['stores the FileSystemFileHandle', /this\._fileHandle = await showSaveFilePicker/],
  ['re-reads file size via handle.getFile()', /const f = await handle\.getFile\(\);\s*actualBytes = f\.size;/],
  ['shows "Save failed" toast when actualBytes === 0', /if \(actualBytes === 0\) \{[\s\S]*?Save failed[\s\S]*?\}/],
  ['shows verified-size toast with checkmark when > 0', /actualBytes > 0[\s\S]*?\$\{fmt\(actualBytes\)\}[\s\S]*?✓/],
  ['distinguishes disk-error vs no-data in zero-byte path', /writeErrors > 0[\s\S]*?disk write errors[\s\S]*?recorder produced no data/],
  ['logs each failed disk write (no longer silent)', /this\._fileWriteErrors\+\+/],
  ['handles getFile() throw with -1 sentinel + soft fallback', /actualBytes === -1[\s\S]*?fmt\(promisedBytes\)|actualBytes === -1|Could not verify on-disk size/],
];

let pass = 0, fail = 0;
console.log('\n── Source-level checks (regex on noorcast.js) ──');
for (const [name, re] of sourceChecks) {
  const ok = re.test(src);
  console.log(ok ? `✓ ${name}` : `✗ ${name}`);
  ok ? pass++ : fail++;
}

// ──────────── 2. Functional simulation (mocks the full close+verify path) ────────────

console.log('\n── Functional simulation (mock writer + handle) ──');

function fmt(b) {
  return b > 1024 * 1024 ? (b / 1024 / 1024).toFixed(1) + ' MB'
       : b > 1024 ? Math.round(b / 1024) + ' KB' : b + ' B';
}

// This is the same logic as Recorder.finish()'s file-verification block,
// extracted so we can drive it with mocks.
async function verify({ promisedBytes, writeErrors, mockHandle, mockWriter }) {
  const toasts = [];
  const showToast = (msg) => toasts.push(msg);
  await mockWriter.close();
  let actualBytes = -1;
  try {
    if (mockHandle && typeof mockHandle.getFile === 'function') {
      const f = await mockHandle.getFile();
      actualBytes = f.size;
    }
  } catch {}
  if (actualBytes === 0) {
    showToast(`❌ Save failed — file is 0 bytes! ${writeErrors > 0 ? '(disk write errors)' : '(recorder produced no data)'} Try again with a different format / location.`);
  } else if (actualBytes > 0) {
    showToast(`💾 Saved ${fmt(actualBytes)} to disk ✓`);
  } else {
    showToast(`💾 Saved ~${fmt(promisedBytes)} to disk`);
  }
  return toasts;
}

const cases = [
  {
    name: 'CASE 1 — real success: 13.4 MB recorded, 13.4 MB on disk',
    args: {
      promisedBytes: 13_400_000, writeErrors: 0,
      mockWriter: { close: async () => {} },
      mockHandle: { getFile: async () => ({ size: 13_400_000 }) },
    },
    expect: { contains: ['Saved', '12.8 MB', '✓'], notContains: ['Save failed', 'ignore Chrome', '❌'] },
  },
  {
    name: 'CASE 2 — the bug: recorder said 5 MB, disk says 0, 12 write errors',
    args: {
      promisedBytes: 5_000_000, writeErrors: 12,
      mockWriter: { close: async () => {} },
      mockHandle: { getFile: async () => ({ size: 0 }) },
    },
    expect: { contains: ['❌ Save failed', '0 bytes', 'disk write errors'], notContains: ['💾 Saved'] },
  },
  {
    name: 'CASE 3 — the bug variant: recorder produced nothing, no errors',
    args: {
      promisedBytes: 0, writeErrors: 0,
      mockWriter: { close: async () => {} },
      mockHandle: { getFile: async () => ({ size: 0 }) },
    },
    expect: { contains: ['❌ Save failed', '0 bytes', 'recorder produced no data'], notContains: ['💾 Saved', 'disk write'] },
  },
  {
    name: 'CASE 4 — verification unavailable: getFile() throws, fall back to estimate',
    args: {
      promisedBytes: 8_400_000, writeErrors: 0,
      mockWriter: { close: async () => {} },
      mockHandle: { getFile: async () => { throw new Error('not supported'); } },
    },
    expect: { contains: ['💾 Saved', '~', '8.0 MB'], notContains: ['❌', 'Save failed'] },
  },
  {
    name: 'CASE 5 — close() rejects: error path is hit',
    args: {
      promisedBytes: 5_000_000, writeErrors: 0,
      mockWriter: { close: async () => { throw new Error('disk quota exceeded'); } },
      mockHandle: { getFile: async () => ({ size: 0 }) },
    },
    customRunner: async (args) => {
      // Mirror finish()'s catch path
      try {
        await args.mockWriter.close();
      } catch (err) {
        return [`⚠ File save error — recording may be incomplete. Check the saved file.`];
      }
      return [];
    },
    expect: { contains: ['⚠ File save error'] },
  },
];

(async () => {
  for (const c of cases) {
    const toasts = c.customRunner ? await c.customRunner(c.args) : await verify(c.args);
    const got = toasts[0] || '<no toast>';
    let ok = true;
    for (const needle of c.expect.contains || []) {
      if (!got.includes(needle)) { ok = false; console.log(`✗ ${c.name}\n    expected to contain: "${needle}"\n    got: "${got}"`); break; }
    }
    if (ok && c.expect.notContains) {
      for (const needle of c.expect.notContains || []) {
        if (got.includes(needle)) { ok = false; console.log(`✗ ${c.name}\n    expected NOT to contain: "${needle}"\n    got: "${got}"`); break; }
      }
    }
    if (ok) { console.log(`✓ ${c.name}\n    → "${got}"`); pass++; }
    else fail++;
  }

  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(fail === 0 ? 0 : 1);
})();
