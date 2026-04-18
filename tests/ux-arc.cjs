// v0.9.31 — guards the v0.9.26 → v0.9.31 UX-arc invariants. Source-level
// regex on noorcast.js + index.html + style.css. Run:
//   node tests/ux-arc.cjs

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const js   = fs.readFileSync(path.join(root, 'noorcast.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css  = fs.readFileSync(path.join(root, 'style.css'),  'utf8');

const checks = [
  // ─── v0.9.26 — Workflow step tabs ────────────────────────────────
  ['WorkflowSteps module exists',
    /const WorkflowSteps = \{[\s\S]*?STEPS:\s*\['setup',\s*'tune',\s*'record',\s*'share'\]/.test(js)],
  ['WorkflowSteps tabs wired in HTML',
    html.includes('data-step="setup"') && html.includes('data-step="tune"') &&
    html.includes('data-step="record"') && html.includes('data-step="share"')],
  ['WorkflowSteps auto-advances on rec/source',
    /this\.setActive\('tune'\)[\s\S]*this\.setActive\('record'\)[\s\S]*this\.setActive\('share'\)/.test(js)],
  ['WorkflowSteps polling watcher 220 ms',
    /setInterval\(\(\) => this\._tick\(\), 220\)/.test(js)],
  ['Toolbar hidden in SETUP/SHARE via CSS',
    /\.tc-studio\[data-active-step="setup"\]\s+\.tc-tools-bar[\s\S]*\.tc-studio\[data-active-step="share"\]\s+\.tc-tools-bar/.test(css)],
  ['Step tabs i18n in fr/en/ar',
    /stepSetup:[\s\S]*stepSetup:[\s\S]*stepSetup:/.test(js)],

  // ─── v0.9.27 — Take-as-modal ─────────────────────────────────────
  ['Take has tc-take-modal class + role=dialog',
    html.includes('class="tc-take tc-take-modal"') && html.includes('role="dialog"')],
  ['Take modal body wrapper present',
    html.includes('class="tc-take-modal-body"') && html.includes('class="tc-take-modal-header"')],
  ['Take show uses display:flex (not block)',
    /\$\('tcTake'\)\.style\.display = 'flex'/.test(js)],
  ['Re-open Last-take button in header',
    html.includes('id="tcReopenTakeBtn"')],
  ['Re-open button revealed on finish',
    /\$\('tcReopenTakeBtn'\)\?\.classList\.add\('tc-visible'\)/.test(js)],
  ['ESC closes the take modal',
    /closeTakeModal[\s\S]*Escape/.test(js)],

  // ─── v0.9.28 — StageStatus bar ───────────────────────────────────
  ['StageStatus module exists',
    /const StageStatus = \{[\s\S]*?_tick\(\) \{/.test(js)],
  ['Stage-status HTML present (5 chunks)',
    html.includes('id="tcSsState"')   && html.includes('id="tcSsSources"') &&
    html.includes('id="tcSsFormat"')  && html.includes('id="tcSsQuality"') &&
    html.includes('id="tcSsHandle"')],
  ['Stage-status chunk click handlers wired',
    /tcSsSources[\s\S]*addEventListener[\s\S]*tcSsFormat[\s\S]*addEventListener[\s\S]*tcSsQuality[\s\S]*addEventListener/.test(js)],
  ['Stage-status aria-live polite',
    html.includes('id="tcStageStatus"') && /id="tcStageStatus"[\s\S]{0,300}aria-live="polite"/.test(html)],
  ['Stage-status state chunk shows recording state',
    /tc-ss-recording/.test(css) && /'🔴 ' \+ \(t\('ssRecording'\)/.test(js)],
  ['ssReady/ssRecording i18n triple',
    /ssReady:[\s\S]*ssReady:[\s\S]*ssReady:/.test(js)],

  // ─── v0.9.29 — Single primary CTA per step ───────────────────────
  ['Source-add zone wraps the 3 source rows',
    html.includes('class="tc-add-zone"') &&
    /tc-add-zone[\s\S]*srcScreenBtn[\s\S]*srcCamBtn[\s\S]*micSelect/.test(html)],
  ['Add-zone has uppercase "ADD A SOURCE" header',
    /id="tcAddZoneTitle"/.test(html) && /addASource:/.test(js)],
  ['Add-zone pulses in SETUP step',
    /\.tc-studio\[data-active-step="setup"\]\s+\.tc-add-zone[\s\S]*animation:\s*addZonePulse/.test(css)],

  // ─── v0.9.30 — Mobile reflow ─────────────────────────────────────
  ['Mobile breakpoint at 960 px (tablet stack)',
    /@media \(max-width:\s*960px\)[\s\S]*tc-studio-grid[\s\S]*grid-template-columns:\s*1fr/.test(css)],
  ['Mobile breakpoint at 768 px (bottom-sheet panels)',
    /@media \(max-width:\s*768px\)[\s\S]*helpPanel[\s\S]*transform:\s*translateY/.test(css)],
  ['Mobile breakpoint at 560 px (phone tightening)',
    /@media \(max-width:\s*560px\)/.test(css)],
  ['Touch-device WCAG 2.5.5 — 44 px min tap target',
    /@media \(hover:\s*none\) and \(pointer:\s*coarse\)[\s\S]*min-height:\s*44px/.test(css)],

  // ─── v0.9.31 — 30-second tour ────────────────────────────────────
  ['Tour module exists with >= 5 spotlight steps',
    /const Tour = \{[\s\S]*?STEPS:\s*\[/.test(js) &&
    (js.match(/sel:\s*'[^']+'/g) || []).length >= 5],
  ['Tour persists tc-tour-seen',
    /silentSet\('tc-tour-seen', '1'\)/.test(js)],
  ['Tour fires after templates close',
    /Tour\.shouldShow\(\)\s*&&\s*\$\('tcModePicker'\)|setTimeout\(\(\)\s*=>\s*\{\s*if\s*\(Tour\.shouldShow\(\)\)\s*Tour\.start\(\)/.test(js)],
  ['Tour replay button in Help panel',
    html.includes('id="tcReplayTourBtn"')],
  ['Tour replay button wired',
    /tcReplayTourBtn[\s\S]*silentRemove\('tc-tour-seen'\)[\s\S]*Tour\.start/.test(js)],

  // ─── A11y from v0.9.23–v0.9.25 ───────────────────────────────────
  ['focus-visible outline rule present',
    /button:focus-visible,[\s\S]*outline:\s*3px solid #a3e635/.test(css)],
  ['aria-pressed MutationObserver mirror',
    /aria-pressed[\s\S]*MutationObserver[\s\S]*\.tc-tool-btn,\s*\.tc-scene-btn/.test(js)],
  ['Toast aria-live="polite"',
    html.includes('id="toastIndicator"') && /id="toastIndicator"[\s\S]{0,200}aria-live="polite"/.test(html)],
  ['prefers-reduced-motion media query',
    /@media \(prefers-reduced-motion:\s*reduce\)/.test(css)],
  ['Panel openPanel/closePanel focus restore',
    /_panelOpener\[id\]\s*=\s*document\.activeElement[\s\S]*opener\.focus/.test(js)],

  // ─── Misc — ensure no obvious regressions ─────────────────────────
  ['APP_VERSION present and on a known minor (0.9.x or 0.10.x)',
    /const APP_VERSION = '0\.(9|10|11|12)\.\d+'/.test(js)],
  ['BUILD_DATE not stale (year 2026 still valid)',
    /const BUILD_DATE = '2026-04-/.test(js)],
];

console.log('── UX-arc invariants (v0.9.26 → v0.9.31) ──');
let pass = 0, fail = 0;
for (const [label, ok] of checks) {
  if (ok) { console.log(`✓ ${label}`); pass++; }
  else    { console.log(`✗ ${label}`); fail++; }
}

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
