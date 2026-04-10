# Changelog

All notable changes to **TutoCast** are documented here. This project follows
[Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

## v0.1.1 — 2026-04-10

Bug fixes after the first full runtime test pass (UI buttons, i18n, scenes,
tools, panels, hotkeys, ticker — all exercised in a real Chrome instance via
Bash-background ruby HTTP server + Chrome-in-Chrome automation).

### Fixed
- **Double emoji in scene buttons** (`"💻💻 Code"` instead of `"💻 Code"`):
  the emoji was rendered twice — once as the standalone `.tc-scene-icon` span,
  once inside the `scene_*` i18n label itself. Stripped the emoji from the
  6 `scene_*` keys across EN / FR / AR so the icon slot is the single source
  of truth.
- **41 i18n keys referenced by `data-i18n` but missing from `LANG`**: all
  FAQ questions/answers (`faq_q1..q8` + `faq_a1..a8`), how-to steps
  (`howto_1..howto_7`), wiki entries (`wiki_multicam*`, `wiki_scenes*`,
  `wiki_sensor*`, `wiki_privacy*`), and the v0.1.0 changelog entries
  (`news_010` + `news_010_1..9`) were only present as HTML fallback text in
  French. Switching to English or Arabic left them untranslated. Added all
  41 keys × 3 languages = 123 new translation entries. The three `LANG`
  blocks are now perfectly balanced at **169 keys each**.

### Notes
- Zero runtime errors or console warnings during the full test pass.
- All 6 scenes, 10 text presets, 4 tools, 3 panels, 4 help tabs, 8 themes,
  3 languages, ticker, and every hotkey (1-6, L, F, D, Esc) verified working.
- Remaining untested paths require real device permissions (screen capture,
  getUserMedia camera/mic) and live recording — documented in README.

## v0.1.0 — 2026-04-10

First release. Kids-friendly browser-based multi-camera tutorial recorder.

### Added
- **Multi-source capture**: screen/window/tab via `getDisplayMedia`, up to 3
  simultaneous cameras via `getUserMedia`, 1 mic with live VU-meter.
- **1920×1080 canvas composition engine** running at 30 fps via
  `requestAnimationFrame`, with per-source position/size/shape (rect or
  circle) and optional mirror.
- **6 scene presets** with hotkeys 1–6:
  - 💻 Code (screen full + face PIP)
  - 🤖 Robot (first cam full + face PIP)
  - 🎛 Capteurs (second cam full + face PIP)
  - 💻🤖 Code + Robot (screen 60% + robot 40% + face PIP)
  - 🎬 Studio (2×2 grid)
  - 👋 Toi (face cam full)
- **Live recording** via `MediaRecorder` (WebM VP9 + Opus), 4 Mbps video.
- **3-2-1 countdown** overlay before recording (toggleable in settings).
- **Pause/Resume/Stop** with live timer and pulsing REC indicator.
- **Automatic chapters** — every scene switch creates a chapter, exported
  as a sidecar `.vtt` file alongside the `.webm`.
- **Live markers** with `M` key, counted as chapters.

### Live tools
- **🔴 Laser pointer** (`L`) — cursor becomes a glowing red dot, visible in recording
- **❄️ Screen freeze** (`F`) — freeze canvas via `getImageData`, mic keeps recording
- **✏️ Whiteboard** (`D`) — draw directly on the overlay canvas, persists across frames
- **📜 Teleprompter** — floating script over the preview, **NOT drawn on the canvas** (visible to teacher only, excluded from the recording)
- **📸 Snapshot** (`S`) — download current canvas frame as PNG

### Text overlays
- 10 preset kid-friendly texts (⭐ Bravo, 🎯 Étape 1–3, 👀 Regarde, 💡 Astuce, ⚠️ Attention, 🙈 Oups, 💪 À toi, 🎉 Fini).
- Preset texts auto-fade after 4 seconds, free texts stay until removed.
- Rounded badge style with outline for readability.

### micro:bit sensors (Chrome/Edge only)
- One-click pairing via **Web Bluetooth API** (accelerometer + button services).
- Live X/Y/Z accelerometer readings + button A/B states.
- Values displayed as an overlay on the recording canvas in real time.
- UUIDs: `e95d0753-...` (accel service), `e95d9882-...` (button service).

### Kids UX polish
- **Animated SVG logo**: clapperboard that "claps" every 3 seconds.
- **News ticker** at the bottom with 10 rotating trilingual tips, pausable.
- **Onboarding card** on first launch with 4 friendly steps.
- **Achievement badges** (6 total): first tutorial, over 5 min, multi-cam, all scenes, marker king, micro:bit plugged. Persisted in `localStorage`.
- **Confetti explosion** when a recording completes.
- Default theme **Jungle** (vivid green/orange).
- **Trilingual UI**: 🇫🇷 FR (default) · 🇬🇧 EN · 🇩🇿 AR with full RTL.

### Privacy & architecture
- 100% local, zero backend, zero telemetry, zero third-party calls at runtime (except Google Fonts CSS in `<head>`, removable).
- Single-file app: `index.html` + `tutocast.js` + `style.css`, no build step.
- Workshop-DIY template shell kept for themes + splash + panels.

### Known limits
- Requires Chrome or Edge desktop for full feature set (Web Bluetooth).
- Firefox works for recording but not for micro:bit sensors.
- iOS / Safari Mobile not supported (no screen capture API).
- Audio is mic only — system audio capture requires BlackHole on macOS.
- Output is WebM only; MP4 requires post-conversion with ffmpeg or similar.
