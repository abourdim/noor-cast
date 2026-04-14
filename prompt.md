# NoorCast — AI Development Prompt

This document captures the complete prompt and context used to build NoorCast with Claude. Use it to reproduce, extend, or fork the project.

---

## System Prompt

```
You are building NoorCast, a browser-based multi-camera screen recorder for teachers
creating tutorials with robots and micro:bits.

Target audience: Kids (8-16), teachers, STEM educators, maker community.

Design principles:
- Kid-friendly but serious/professional
- Geeky, maker, hacker aesthetic (green-on-dark terminal vibes)
- Zero dependencies — pure vanilla JS, HTML, CSS
- 100% local, privacy-first — no cloud, no accounts, no tracking
- Everything persisted in localStorage
- Everything baked into recordings (overlays render on canvas)
- Single-file architecture (one JS file for everything)
- PWA with offline support via service worker
```

---

## Architecture Prompt

```
Build a single-page app with this architecture:

- HTML5 Canvas 2D at 1920×1080, 30fps for the recording stage
- MediaRecorder API for video capture (WebM)
- Web Bluetooth API for micro:bit v2 UART communication
- SpeechRecognition API for live captions and voice commands
- Web Audio API for sound effects, music, mic metering
- Service Worker (cache-first) for offline PWA
- localStorage for all settings persistence (~100 keys)
- File System Access API for disk streaming (large recordings)

Use a singleton object pattern for all feature modules:
const FeatureName = { init(){}, render(ctx, W, H){}, ... };

All overlays must render on the canvas (not DOM) so they appear in recordings.
The render pipeline in Engine.render() calls each module's render() method.
```

---

## Feature Development Prompts

### Source Skins (49 skins)
```
Create camera/screen source skins drawn on canvas. Categories:
- Classic: Circle, Rounded, Hexagon, Diamond, Oval, Badge, Shield, Star
- Tech: Phone, Tablet, Laptop, Monitor, CRT, Terminal, Oscilloscope
- Robot: Robot-A/B/C heads, Mech, Android, Cyborg
- Hacker: Anonymous mask, Kali hood, Matrix frame, Glitch, Cipher
- Retro: VHS, Polaroid, Film strip, Arcade cabinet, Gameboy
- Futurist: Hologram, Neon ring, Neural, Quantum, Nano
- Fun: Pirate flag, Speech bubble, Cloud
- Islamic: Arabesque, Mihrab

Use evenodd canvas clipping: draw the frame path as outer, then cut out
the video rectangle so the camera feed shows through.
Store selection in localStorage key 'tc-source-skin-{sourceId}'.
```

### AI Co-hosts (36 characters)
```
Create inline SVG silhouette characters for the AI co-host feature.
NO emojis — use proper silhouette SVGs that look serious and geeky.

Categories:
- Tech: Hacker, Anonymous, Coder, Sysadmin, DevOps, Pentester
- Science: Scientist, Astronaut, Professor, Inventor, Biologist, Chemist
- Makers: Engineer, Mechanic, Electrician, Architect, Carpenter, Welder
- Adventure: Pirate, Explorer, Captain, Viking, Knight, Samurai
- Creative: Artist, Musician, Director, Writer, Photographer, Designer
- Legends: Einstein, Tesla, Da Vinci, Turing, Curie, Lovelace

Each character is a data:image/svg+xml URI converted to an Image object.
Render at 200px height on the canvas with slight bob animation.
Store selection in localStorage key 'tc-cohost-char'.
```

### Gamification
```
Build a complete gamification system:
- XP bar: earn XP for recording, using features, completing challenges
- Levels: Beginner → Creator → Expert → Legend → Grandmaster
- Achievements: 30+ badges unlocked by milestones
- Daily challenges: "Record with 3 different scenes", "Use voice commands"
- Combo system: consecutive actions multiply XP
- Unlock gallery: some skins/backgrounds gated by XP level
- Ghost replay: overlay of previous take for comparison
- Tutorial quality score: rate audio, duration, scene variety

All XP and progress stored in localStorage.
Achievement popups render on canvas with confetti animation.
```

### Micro:bit Integration
```
Implement Web Bluetooth connection to micro:bit v2:
- UART service for bidirectional communication
- Parse incoming sensor data: temperature, accelerometer, light
- Send commands: servo angles, LED patterns, custom UART messages
- Canvas overlay: D-pad, joystick, LED grid editor, servo gauges
- Sensor graph: real-time line chart of sensor readings
- Robot choreography: record/playback servo movement sequences

Show gauges and graph on canvas even when not connected (demo mode).
All overlay positions stored in localStorage.
```

### Background Patterns (15 patterns)
```
Draw tiled background patterns on the canvas behind sources:

- Geometric: Grid, Dots, Crosses, Triangles
- Tech: Circuit board, Binary rain, Radar sweep, Waveform
- Islamic: Arabesque tiles, Star-and-cross, Zellige mosaic,
          Muqarnas, Islamic science (astrolabe/geometric instruments)
- Fun: Confetti, Retro squares
- Radar: Classic sweep, Concentric rings

All procedurally drawn (no images). Support opacity slider.
Store selection in localStorage key 'tc-bg-pattern'.
```

---

## Etsy Package Prompt

```
Create a complete Etsy digital product package for NoorCast:

1. Quick-Start Card (A4 HTML → PNG) — 5-step setup guide
2. Keyboard Shortcuts Cheat Sheet (A4 landscape, laminate-ready)
3. Classroom Poster "Recording Studio Rules" (A3, 7 rules)
4. Lesson Plan Template + Sample Micro:bit Lesson (A4, 2 pages)
5. Printable Sticker/Badge Sheet (30 reward stickers)
6. README Quick-Start (1-page branded overview)
7. LICENSE.txt (commercial license with lifetime updates)
8. 7 Etsy listing mockup images (2000×1500px each)
9. ZIP packaging script (Playwright renders HTML→PNG, bundles everything)

Design: Match NoorCast's dark green terminal aesthetic.
Fonts: Righteous (headings), Orbitron (mono/tech), Tajawal (body).
Colors: #a3e635 (accent), #060e06 (bg), #fbbf24 (gold), #38bdf8 (blue).
```

---

## User Guide Prompt

```
Create a comprehensive HTML user guide for NoorCast:

- 26 chapters covering every feature
- 119/119 features documented
- Sidebar navigation with grouped links
- 5 inline SVG diagrams (interface layout, recording workflow,
  skin categories, post-recording tools, XP bar)
- Cross-references between chapters (175+ links)
- Camera setup chapter (phones, USB, Continuity Camera, DroidCam, EpocCam)
- Templates & lesson planning chapter
- Accessibility, RTL & performance chapter
- Match the app's dark green terminal aesthetic

Design: Same CSS variables as the app.
Target: 1500-2000 lines, ~10K words.
```

---

## Style Guidelines

```css
:root {
  --accent: #a3e635;    /* Lime green — primary actions, headings */
  --bg: #060e06;        /* Near-black green — backgrounds */
  --card: rgba(12,24,12,.6);  /* Card backgrounds */
  --border: rgba(163,230,53,.1);  /* Subtle borders */
  --text: #cbd5e1;      /* Body text */
  --muted: #64748b;     /* Secondary text */
  --blue: #38bdf8;      /* Info, secondary actions */
  --gold: #fbbf24;      /* Warnings, sub-headings */
  --red: #ef4444;       /* Errors, recording indicator */
  --purple: #c084fc;    /* Tertiary accent */
}

Fonts:
- Headings: 'Righteous', sans-serif
- Monospace/tech: 'Orbitron', ui-monospace, monospace
- Body text: 'Tajawal', sans-serif (supports Arabic)

Aesthetic: CRT scanlines, neon glow, terminal vibes, geeky but kid-friendly.
Animations: Spring bounce (popIn), subtle hover glows, pulsing LEDs.
```

---

## Testing Prompt

```
Set up visual regression testing with Playwright:
- 36 test cases covering all major UI states
- maxDiffPixelRatio: 0.02 (2% tolerance)
- animations: 'disabled' for deterministic screenshots
- ESLint 9 flat config with all singletons whitelisted
- Run: npm run lint && npm test
```

---

## Key Technical Decisions

1. **Single file JS** — Easier to distribute, no build step, no bundler
2. **Canvas rendering** — All overlays baked into recording (not DOM)
3. **localStorage** — No database, no cloud, instant persistence
4. **Singleton pattern** — Each feature is a self-contained object
5. **Evenodd clipping** — Source skins clip around the video feed
6. **Inline SVG** — Co-host characters as data URIs (no external files)
7. **Procedural drawing** — All patterns/skins drawn with canvas API
8. **Web Bluetooth** — Direct micro:bit connection, no middleware
9. **Service Worker** — Cache-first for offline PWA capability
10. **No frameworks** — Zero dependencies, runs anywhere

---

## Reproduction Steps

To recreate NoorCast from scratch:

1. Start with a basic HTML page + canvas + MediaRecorder
2. Add source management (screen capture + webcam via getUserMedia/getDisplayMedia)
3. Build the scene layout system (6 layouts with responsive source positioning)
4. Add the canvas render pipeline (Engine.render → draw sources → draw overlays)
5. Implement recording (MediaRecorder + Blob download)
6. Layer on features one by one (each as a singleton with init/render methods)
7. Add localStorage persistence for every setting
8. Implement Web Bluetooth for micro:bit
9. Add SpeechRecognition for captions + voice commands
10. Build the gamification system (XP, achievements, challenges)
11. Create the visual customization (skins, backgrounds, co-hosts, pets)
12. Add post-recording tools (thumbnail, transcript, flyer, QR)
13. Write comprehensive tests + documentation
14. Package for distribution (Etsy, PWA)
