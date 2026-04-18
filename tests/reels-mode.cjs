// v0.9.3 — node test guarding the v0.9.x Reels-mode invariants in noorcast.js.
// Source-level (regex on noorcast.js) — no browser globals to mock. Run:
//   node tests/reels-mode.cjs

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const src = fs.readFileSync(path.join(__dirname, '..', 'noorcast.js'), 'utf8');

const checks = [
  // v0.9.0 — SafeZone module + auto-on
  ['SafeZone module exists',
    /const SafeZone = \{[\s\S]*?render\(ctx, W, H\)/],
  ['SafeZone never renders during recording',
    /SafeZone[\s\S]*?Recorder\.state === 'recording'[\s\S]*?return/],
  ['SafeZone only renders on portrait canvas',
    /SafeZone[\s\S]*?if \(H <= W\) return/],
  ['SafeZone wired into Engine.render',
    /SafeZone\.render\(ctx, width, height\)/],
  ['SafeZone auto-enables first time 9:16 is picked',
    /tc-safezone-introduced[\s\S]*?SafeZone\.visible = true/],

  // v0.9.1 — captions safe-zone position + MP4 default in 9:16
  ['LiveCaptions raises caption box on portrait canvases',
    /LiveCaptions[\s\S]*?isPortrait = H > W[\s\S]*?bottomMargin/],
  ['Recorder.pickMime prefers MP4 in 9:16 mode',
    /isReels[\s\S]*?StageAspect\.current === '9:16'[\s\S]*?isReels \? \[\.\.\.mp4, \.\.\.webm\]/],

  // v0.9.2 — 90s cap warning + post-save ffmpeg helper
  ['Recording timer warns at 90 s in 9:16',
    /StageAspect\.current === '9:16'[\s\S]*?_reels90Warned[\s\S]*?Reels limit reached/],
  ['CSS class applied to time chip past 90 s',
    /tc-reels-overlimit/],
  ['Post-save ffmpeg helper toast in 9:16',
    /ffmpeg -ss 00:00:00 -to[\s\S]*?-c copy/],

  // v0.9.3 — in-browser ReelsTrim + skip-intro
  ['ReelsTrim module exists',
    /const ReelsTrim = \{[\s\S]*?TARGET_SEC: 90/],
  ['ReelsTrim button only shows in 9:16',
    /ReelsTrim[\s\S]*?StageAspect\.current !== '9:16'[\s\S]*?return/],
  ['ReelsTrim re-encodes via canvas + MediaRecorder',
    /ReelsTrim[\s\S]*?canvas\.captureStream\(30\)[\s\S]*?MediaRecorder\(stream/],
  ['ReelsTrim wired into the take pipeline',
    /ReelsTrim\.checkLastTake\(\)/],
  ['Skip-intro waits for first audio peak',
    /_waitForFirstPeak[\s\S]*?AnalyserNode|_waitForFirstPeak[\s\S]*?createAnalyser/],
  ['Skip-intro caps wait at 5000 ms',
    /_waitForFirstPeak\(5000\)|timeoutMs = 5000/],
  ['Skip-intro RMS threshold is 0.05',
    /_waitForFirstPeak[\s\S]*?rms > 0\.05/],

  // i18n
  ['reelsTrim i18n in fr/en/ar',
    /reelsTrim:[\s\S]*?reelsTrim:[\s\S]*?reelsTrim:/],
  ['skipIntro i18n in fr/en/ar',
    /skipIntro:[\s\S]*?skipIntro:[\s\S]*?skipIntro:/],
  ['safeZoneTitle/tip1/tip2 i18n triple in all langs',
    /safeZoneTitle:[\s\S]*?safeZoneTip1:[\s\S]*?safeZoneTip2:[\s\S]*?safeZoneTitle:[\s\S]*?safeZoneTip1:[\s\S]*?safeZoneTip2:[\s\S]*?safeZoneTitle:[\s\S]*?safeZoneTip1:[\s\S]*?safeZoneTip2:/],
  ['SafeZone.render uses t() for label',
    /t\('safeZoneTitle'\)/],
];

console.log('── Reels-mode invariants (regex on noorcast.js) ──');
let pass = 0, fail = 0;
for (const [label, re] of checks) {
  if (re.test(src)) { console.log(`✓ ${label}`); pass++; }
  else              { console.log(`✗ ${label}`); fail++; }
}
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
