# NoorCast — Project Plan & Etsy Strategy

## Vision

NoorCast is a **zero-install, privacy-first, kid-friendly multi-camera screen recorder** built for teachers, makers, and young creators producing tutorials with robots and micro:bits. It runs 100% in the browser — no accounts, no cloud, no tracking.

---

## Architecture

| Layer | Tech | Notes |
|-------|------|-------|
| Rendering | HTML5 Canvas 2D | 1920×1080, 30 fps |
| Recording | MediaRecorder API | WebM output, disk streaming via File System Access |
| BLE | Web Bluetooth | micro:bit v2 UART, servos, sensors |
| Audio | Web Audio API | Oscillators, analysers, mic metering |
| Captions | SpeechRecognition API | Live karaoke-style, .srt export |
| Offline | Service Worker | Cache-first PWA |
| Storage | localStorage | ~100 keys, all settings persisted |
| Build | None | Single-file vanilla JS, zero dependencies |
| Tests | Playwright | 36 visual regression tests |
| Lint | ESLint 9 flat config | Strict, all singletons whitelisted |

**Single file:** `noorcast.js` (~22,600 lines) contains 85+ singleton modules.

---

## Feature Inventory (120+)

### Core Recording
- Multi-camera: screen + webcam + phone (DroidCam/EpocCam/Continuity Camera)
- 6 scene layouts: Full, Side-by-Side, PiP, Split, Focus, Pilot
- 3-2-1 countdown with beep tones + "GO!" flash
- Pause/resume, chapter markers, instant replay (30s rewind)
- Disk streaming (File System Access API) for large recordings
- Smart Scene Switcher (auto-switch by voice/timer)

### Visual Customization
- 49 source skins (11 categories: robots, hackers, phones, retro, frames...)
- 15 background patterns (Islamic geometry, radar, matrix, circuits...)
- 36 AI co-host characters (SVG silhouettes: pirate, hacker, astronaut...)
- 12 canvas pets (animated walkers: spider, robot, ghost, snake...)
- Scene themes (CRT scanlines, neon glow, terminal aesthetic)
- Canvas flair: 20 animated stickers
- Speed lines, vignette, letterbox effects

### Overlays & Tools
- Live captions (karaoke-style, word-wrap, gradient bg)
- Teleprompter (scrolling script)
- Laser pointer, freeze screen, whiteboard/draw mode
- Grid overlay, zoom, spotlight, cursor trail
- Text overlay, watermark, branding
- Clock, FPS counter, recording elapsed time
- Sound pad (piano, drums, SFX), background music
- Voice FX (pitch shifting)

### Micro:bit Integration
- Web Bluetooth connection
- Pan/tilt servo control with real-time gauges
- D-pad for custom commands
- 5×5 LED grid control
- Live sensor overlay (temperature, accelerometer, light)
- Robot choreography (record & playback servo sequences)
- Joystick canvas control

### Gamification
- XP bar with level-up system
- Achievement popups (30+ badges)
- Daily challenges
- Combo system (consecutive actions = multiplier)
- Tutorial quality score
- Unlock gallery (skins/backgrounds gated by XP)
- Ghost replay (compare with previous take)

### Post-Recording
- Take panel with video preview
- Auto-thumbnail generator
- Export flyer (A4 PNG with branding)
- Post-recording transcript (.srt)
- QR code sharing
- Multi-take director (compare takes)
- Instant replay

### Accessibility & i18n
- 3 languages: English, French, Arabic (full RTL)
- Simple mode (collapsed sidebars)
- Voice commands ("record", "stop", "next scene", "snapshot")
- Rebindable keyboard shortcuts
- All settings in localStorage

---

## Roadmap

### v0.7 (Current) ✅
- [x] 120+ features implemented
- [x] Complete user guide (26 chapters, 1970 lines, 5 SVG diagrams)
- [x] Etsy package (ZIP + 6 printables + 7 mockups)
- [x] Playwright visual tests (36 tests)
- [x] ESLint clean

### v0.8 (Next)
- [ ] WebCodecs API for MP4 export (no more WebM-only)
- [ ] Multi-track audio (separate mic + system audio)
- [ ] Cloud-free collaboration (WebRTC peer-to-peer)
- [ ] Template marketplace (share scene configs)
- [ ] Plugin system for community extensions
- [ ] Accessibility audit (WCAG 2.1 AA)

### v0.9
- [ ] Mobile responsive (tablet recording)
- [ ] Electron wrapper (desktop app option)
- [ ] Video editor (trim, cut, merge takes)
- [ ] Green screen / chroma key
- [ ] AI-powered auto-editing (remove silences, generate chapters)

### v1.0
- [ ] Stable release
- [ ] Full documentation site
- [ ] Community forum
- [ ] Marketplace integration
- [ ] School/district licensing

---

## Etsy Strategy

### Listing Details

**Title:**
> NoorCast — Screen Recorder for Teachers | Multi-Camera Tutorial Maker | Digital Download | Browser App + Printables + Lesson Plans

**Price:** $14.99 (introductory) → $19.99 (regular)

**Tags (13 max):**
1. screen recorder
2. teacher tools
3. digital download
4. classroom technology
5. tutorial maker
6. STEM education
7. micro:bit
8. coding for kids
9. video recording app
10. lesson plan template
11. educational software
12. maker education
13. kid friendly app

**Category:** Digital Downloads → Software → Education

### Listing Description

> **NoorCast** is a professional multi-camera screen recorder that runs directly in your browser — no installation, no accounts, no cloud. Perfect for teachers, STEM educators, and young makers creating video tutorials.
>
> **What you get:**
> - Complete NoorCast app (opens in Chrome/Edge, works offline)
> - 120+ features: 49 source skins, 36 AI co-hosts, live captions, voice commands
> - micro:bit Bluetooth integration for robotics tutorials
> - Gamification system (XP, achievements, daily challenges)
> - Full user guide (26 chapters with diagrams)
>
> **Bonus printable materials:**
> - Quick-Start Card (A4)
> - Keyboard Shortcuts Cheat Sheet (A4 landscape, laminate-ready)
> - Classroom Poster "Recording Studio Rules" (A3)
> - Lesson Plan Template + Sample Micro:bit Lesson (A4, 2 pages)
> - Reward Sticker Sheet (30 printable badges)
>
> **Privacy first:** 100% local, zero data collection, GDPR/COPPA friendly.
> **Languages:** English, French, Arabic (RTL).
> **Free lifetime updates** via Etsy.
>
> Just open index.html in Chrome → Add your screen & camera → Record!

### Listing Photos (7 mockups included)
1. Hero/cover with branding
2. What's Included (8 items)
3. Features grid (16 highlights)
4. Printables preview (5 cards)
5. Privacy/trust badges
6. Micro:bit integration
7. Language support (EN/FR/AR)

### Marketing Channels
- **Etsy SEO:** Optimized title + 13 tags + rich description
- **Social:** Share mockup images on Twitter/X, Instagram, Reddit (r/Teachers, r/STEM, r/microbit)
- **Education forums:** Announcement on micro:bit community, MakeCode forums
- **Workshop-diy.org:** Link from main site
- **YouTube:** Demo video showing the app in action

### Pricing Strategy
- **Launch:** $14.99 for first 50 sales
- **Regular:** $19.99
- **Bundle idea:** NoorCast + MakeCode Extension tutorial pack = $24.99
- **Free updates** create lifetime value and positive reviews
