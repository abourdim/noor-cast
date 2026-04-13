# NoorCast User Guide

> **NoorCast** — Record multi-camera tutorial videos from your browser.
> Zero install, zero account, zero cloud. Everything stays on your computer.

---

## Quick Start (2 minutes)

1. Open `index.html` in **Chrome** or **Edge** (desktop only)
2. Grant camera + microphone permissions when prompted
3. Pick a template: `📚 Full lesson`, `🤖 Robot demo`, `🔧 Fix-it`, or `🤖 Robot Tuto`
4. Hit the big red **REC** button
5. Follow the template steps — each click switches scenes and drops a chapter marker
6. Press **Stop** when done
7. Download your `.webm` video + `.vtt` chapter file

---

## Adding Sources

### Screen share
Click **+ Add** under Screen. Pick a window, tab, or entire screen. The screen appears on the canvas.

### Webcam
Select your camera from the dropdown under Camera, then click **+ Add**. Drag and resize it on the canvas.

### Microphone
Select your mic from the dropdown under Mic. Audio is recorded automatically.

### Image
Paste an image from clipboard (Ctrl+V) to add it as a static source on the canvas.

### Colored shapes
Click any shape in the **🟩 Shapes** accordion (left sidebar) to add a colored shape to the canvas:

| Shape | Button | Default color |
|-------|--------|---------------|
| Rectangle | ⬛ | Green |
| Circle | ⚪ | Blue |
| Rounded | 🔲 | Orange |
| Pill | 💊 | Pink |
| Hexagon | ⬢ | Green |
| Octagon | 🛑 | Red |
| Diamond | 🔶 | Yellow |
| Star | ⭐ | Yellow |
| Heart | ❤️ | Red |
| Full background | 🖤 | Black (1920x1080) |
| Dark bar | ➖ | Dark (400x60) |
| White bar | ▬ | White (400x60) |
| Red dot | 🔴 | Red (60x60) |
| Green dot | 🟢 | Green (60x60) |
| Dark card | 🃏 | Dark (500x300) |

Shapes support ALL source features: drag, resize (free — no aspect lock), opacity, color change, border, shadow, corner radius, rotation, flip, badge, alignment. Change color via **🎨 Style → Shape Color** picker.

**Use cases:** colored backgrounds behind text, divider bars, decorative frames, status dots, title cards.

### Simple / Pro mode
On first launch, choose **🎓 Simple** or **🚀 Pro**:

- **Simple mode:** Only essential tools visible (Laser, Freeze, Draw, Snapshot, Fullscreen). Settings show General section only. No sensors, no text section, no advanced overlays.
- **Pro mode:** Everything visible — all 25+ tools, all settings sections, sensors, shapes, text stickers.
- **Switch anytime:** Click the mode badge in the header (🎓/🚀) or the button at the top of Settings.

### Source Style popup (Pro mode)
Click a source → click **🎨** in the toolbar → Style popup opens with:

| Section | Controls |
|---------|----------|
| 🟩 Shape Color | Color picker (shapes only) |
| 🎨 Look | Opacity (0-100%), Filter (9 presets), Corner radius (0-50px), Rotation (-180 to +180°) |
| 🖼 Frame | Border (color + width 0-10px), Shadow (color + blur 0-30 + offset X/Y) |
| ✂ Crop | Top/Bottom/Left/Right (0-40% each) |
| 🏷 Badge | Text label (max 12 chars) + color — draws a pill at top-right |
| ↔ Align | 6 buttons: left/center H/right/top/center V/bottom |
| 🔗 Aspect lock | Lock width/height ratio during resize |
| ↔↕ Flip | Horizontal / Vertical mirror |
| 🙈 Privacy | Avatar mode (cartoon face) / Privacy blur (30px) |

---

## 📱 Using Your Phone as a Camera

### Option A: iPhone + Mac (easiest — no install)

1. Sign into the **same Apple ID** on both devices
2. Connect to the **same Wi-Fi network**
3. Open NoorCast in Chrome on your Mac
4. Click **+ Camera** — your iPhone appears as "iPhone Camera"
5. Select it and click **+ Add**

This is Apple's **Continuity Camera** — zero setup.

### Option B: DroidCam (any phone + any computer)

**On your phone:**
1. Install **DroidCam** from [App Store (iPhone)](https://apps.apple.com/app/droidcam-webcam-obs-camera/id1510258102) or [Play Store (Android)](https://play.google.com/store/apps/details?id=com.dev47apps.droidcam) — free
2. Open the app — note your phone's IP address and port number

**On your computer:**
1. Download **DroidCam Client** from [droidcam.app](https://www.dev47apps.com/droidcam/)
2. Install it (adds a virtual camera driver)
3. Open DroidCam Client, enter your phone's IP, click **Start**

**In NoorCast:**
1. Click **+ Camera** — "DroidCam Source" appears in the dropdown
2. Select it, click **+ Add**
3. Drag and resize on the canvas

### Option C: Iriun Webcam (all platforms — recommended for vertical/portrait)

**Why Iriun:** Free, works on Windows/Mac/Linux, supports **portrait (vertical) mode** — DroidCam does not. Best choice for filming a robot from above or a breadboard in portrait orientation.

**On your phone (iPhone or Android):**
1. Go to App Store or Play Store
2. Search **"Iriun Webcam"** — or use direct links: [App Store (iPhone)](https://apps.apple.com/app/iriun-webcam/id1439013982) · [Play Store (Android)](https://play.google.com/store/apps/details?id=com.jacksoftw.webcam)
3. Open the app — it shows "Waiting for connection..."
4. Your phone camera preview appears fullscreen

**On your computer:**
1. Go to [iriun.com](https://iriun.com) — download links for [Windows](https://iriun.com/IriunWebcam-2.8.1.exe), [Mac](https://iriun.com/IriunWebcam-2.8.pkg), [Linux (Ubuntu)](https://iriun.com/IriunWebcam-2.8.deb)
2. Download the desktop client for your OS (Windows / Mac / Linux)
3. Install it — this adds a virtual camera driver called "Iriun Webcam"
4. **No need to open the desktop app** — the driver runs automatically in the background

**Connecting (Wi-Fi):**
1. Make sure phone and computer are on the **same Wi-Fi network**
2. Open Iriun on the phone — it auto-discovers your computer
3. The phone screen shows "Connected" with a live preview

**Connecting (USB — recommended for stability):**
1. Plug your phone into the computer with a USB cable
2. **iPhone:** trust the computer when prompted
3. **Android:** enable USB debugging in Developer Options
4. Open Iriun on the phone — it connects via USB (faster, no lag)

**In NoorCast:**
1. Click **+ Camera** in the left sidebar
2. Select **"Iriun Webcam"** from the dropdown
3. Click **+ Add** — your phone's camera appears on the canvas
4. Drag and resize as needed

**Portrait (vertical) mode:**
1. Hold your phone **vertically** (portrait)
2. Iriun automatically sends the vertical feed — no black bars, no rotation needed
3. In NoorCast, resize the source to a tall narrow rectangle to match

**Settings in the Iriun phone app:**
- **Camera:** tap to switch between front/back camera
- **Resolution:** 640p (default) is fine; 1080p uses more CPU
- **Orientation:** auto-detects — just rotate your phone
- **Mirror:** toggle if the image is flipped

**Troubleshooting Iriun:**
- **Phone says "Waiting for connection":** make sure the desktop driver is installed (check system tray on Windows, menu bar on Mac)
- **Lag or stuttering:** switch to USB, or lower resolution in the phone app
- **"Iriun Webcam" not in NoorCast dropdown:** restart Chrome after installing the driver
- **Black screen in NoorCast:** close any other app using the camera (Zoom, Teams), then retry

### Option D: Camo (pro quality — best image controls)

**Why Camo:** Best image quality of all options. Manual controls for zoom, exposure, focus, white balance, and ISO. Supports **portrait and landscape**. Free tier works; paid plan ($5/month) unlocks all controls + 1080p.

**On your phone (iPhone or Android):**
1. Go to App Store or Play Store
2. Search **"Camo"** by Reincubate — or use direct links: [App Store (iPhone)](https://apps.apple.com/app/camo-webcam-for-mac-and-pc/id1514199064) · [Play Store (Android)](https://play.google.com/store/apps/details?id=com.reincubate.camo)
3. Open the app — it shows a live camera preview with a toolbar at the bottom
4. Grant camera permission when prompted

**On your computer:**
1. Go to [reincubate.com/camo](https://reincubate.com/camo/) — download links for [Windows](https://reincubate.com/camo/download/windows/) · [Mac](https://reincubate.com/camo/download/mac/) (no Linux)
2. Download **Camo Studio** for your OS
3. Install it — adds a virtual camera driver called "Camo"
4. Open Camo Studio — it shows a pairing screen

**Connecting (USB — recommended):**
1. Plug your phone into the computer with a USB cable
2. **iPhone:** trust the computer when prompted
3. **Android:** enable USB debugging, then allow connection
4. Camo Studio shows your phone's live feed immediately
5. USB gives the lowest latency and best quality

**Connecting (Wi-Fi):**
1. Same Wi-Fi network on both devices
2. In Camo Studio on the computer, click the device dropdown
3. Your phone appears — select it
4. Connection is automatic but slightly more lag than USB

**In NoorCast:**
1. Click **+ Camera** in the left sidebar
2. Select **"Camo"** from the dropdown
3. Click **+ Add** — the feed appears on the canvas

**Portrait (vertical) mode:**
1. Hold your phone vertically — Camo sends the portrait feed
2. Rotate the phone — Camo auto-switches orientation
3. In NoorCast, resize the source to match the aspect ratio

**Camo Studio controls (on your computer):**
- **Zoom:** digital zoom slider — zoom into the robot without moving the phone
- **Focus:** tap to auto-focus or switch to manual focus and drag the slider
- **Exposure:** brighten/darken the image (useful for poorly lit classrooms)
- **White balance:** fix yellow/blue color casts under fluorescent lights
- **ISO:** increase for dark rooms (adds some grain)
- **Rotation:** force 0° / 90° / 180° / 270° — useful for weird mounting angles
- **Lens:** switch between front/back camera, and ultra-wide if your phone has one
- **Filters:** built-in color filters (none needed for tutorials, but fun for kids)

**Free vs Paid:**

| Feature | Free | Pro ($5/month) |
|---------|------|----------------|
| Resolution | 720p | 1080p / 4K |
| Zoom | ❌ | ✅ |
| Manual focus | ❌ | ✅ |
| Exposure/ISO | ❌ | ✅ |
| Lens selection | Back only | All lenses |
| Watermark | Small logo | None |
| Portrait mode | ✅ | ✅ |

**Troubleshooting Camo:**
- **"Camo" not in NoorCast dropdown:** restart Chrome after installing Camo Studio
- **Black screen:** make sure Camo Studio is open on the computer (unlike Iriun, Camo needs the desktop app running)
- **Lag on Wi-Fi:** switch to USB — always more stable
- **"No devices found":** check that Camo app is open on the phone and both are on the same network
- **Watermark on free tier:** the small Reincubate logo appears in the corner — upgrade to Pro to remove it, or crop it out in NoorCast using the Crop sliders in Style

### Tips for phone cameras

- **USB beats Wi-Fi** — more stable, no lag, essential if the phone is moving
- **Disable screen auto-lock** on the phone so it doesn't sleep mid-recording
- A cheap **phone tripod or gimbal** makes a huge difference for steady shots
- Mount one phone on the robot, another pointed at the sensors/breadboard

---

## 📱 Creative Phone Use Cases

Beyond using phones as cameras, here are advanced setups:

### Use case 1: Phone as wireless microphone (free!)

The teacher uses a phone in their pocket or clipped to their collar as a **wireless mic**. No cables, no hardware cost.

**Setup:**
1. Phone runs DroidCam or Iriun with **audio enabled**
2. Phone goes in teacher's pocket or clips to collar
3. In NoorCast, select "DroidCam Source" or "Iriun Webcam" as the **Mic** source
4. Laptop webcam or USB cam films the teacher
5. Audio comes from the phone mic — close to the mouth, clear voice

**Even better:** wear Bluetooth earbuds connected to the phone. The earbud mic is right at your mouth — crystal clear audio, zero cables.

**Note:** If you're already using the phone as a robot camera, you need **two phones** — one for the robot camera, one as the wireless mic.

### Use case 2: Robot sounds from phone mic

When the phone is **mounted on the robot**, the phone mic captures motor sounds, servo clicks, and wheel noise that the laptop mic across the room would miss.

**Setup:**
1. Phone mounted on/near the robot with DroidCam/Iriun (audio enabled)
2. In NoorCast, select the phone as the **Mic** source
3. The recording captures close-up robot sounds

**Limitation:** NoorCast uses one mic for the entire recording. You can't switch mics per scene. So either:
- Record with phone mic (robot sounds clear, teacher voice distant)
- Record with laptop mic (teacher voice clear, robot sounds faint)

**Workaround:** Record the main tutorial with laptop mic, then do a separate 10-second "listen to the robot" clip with phone mic selected.

### Use case 3: Phone as classroom loudspeaker

The teacher speaks into the laptop mic, and the **phone mounted on the robot plays their voice** through its speaker — so students standing around the robot can hear instructions clearly.

**Setup (Google Meet method — simplest):**
1. Open a Google Meet call on both the laptop and the phone
2. On the phone: **mute the phone mic**, turn volume up
3. On the laptop: **unmute the laptop mic**
4. The teacher's voice plays through the phone speaker on the robot
5. NoorCast runs separately on the laptop, recording normally

**Alternative apps:**
- **AudioRelay** ([audiorelay.net](https://audiorelay.net)) — routes laptop mic to phone speaker over Wi-Fi. Free, low latency.
- **Voxer** or any walkie-talkie app — push-to-talk from laptop to phone

**Best for:** classroom demos where 10+ students crowd around a table watching the robot. The teacher stays at the laptop but their voice comes from the robot's location.

### Use case 4: Walking teacher with phone

The teacher walks around the classroom holding the phone, filming students' work. The phone is both camera AND mic (captures the teacher's narration + what they see).

**Setup:**
1. Phone runs Iriun with audio enabled
2. In NoorCast: phone as both Camera AND Mic source
3. Teacher walks around, filming student projects, narrating
4. Screen share on laptop shows the code/instructions
5. Switch between "Walking" scene (phone cam) and "Code" scene (screen share)

### Use case 5: Phone as portable monitor (cast laptop screen)

Students standing around the robot can't see the laptop screen. Cast the NoorCast preview to the phone so they see what's being recorded.

**Setup:**
- **Windows:** use Miracast screen mirroring (Settings → Display → Connect to a wireless display) or Chrome Remote Desktop on the phone
- **Mac:** use AirPlay to mirror to an iPhone/iPad nearby
- **Any OS:** open Chrome Remote Desktop ([remotedesktop.google.com](https://remotedesktop.google.com)) on both devices — the phone shows the laptop screen

The phone becomes a portable monitor for students. No extra hardware.

### Summary: which phone does what

| Phone role | Camera used? | Mic used? | Where is it? |
|-----------|-------------|----------|-------------|
| Robot camera | Yes | Optional | Mounted on robot |
| Sensor camera | Yes | No | Pointed at breadboard |
| Wireless mic | No | Yes | In pocket / on collar |
| Classroom speaker | No | No (speaker only) | On robot (via Google Meet) |
| Walking camera + mic | Yes | Yes | In teacher's hand |
| Portable monitor | No | No | Near students (screen cast) |

---

## 🤖 Robot Tutorial Setup

### Recommended camera layout (unlimited cameras + screens)

| Camera | What it films | Scene |
|--------|--------------|-------|
| Laptop webcam | Your face | "You" |
| Phone 1 (DroidCam) | The robot moving | "Robot" |
| Phone 2 (DroidCam) | Sensors / breadboard | "Sensors" |
| Phone 3 (Iriun) | Whiteboard / wide shot | "Studio" |
| USB webcam | Close-up on components | "Code + Robot" |
| Screen share | Code editor (MakeCode, Arduino IDE) | "Code" |

There is **no limit** on the number of cameras. Add as many as your computer can handle — each is an independent source you can place in any scene. Typical setups use 2-4 cameras + 1 screen share.

### Ways to add cameras

| Source | How to add | Cost |
|--------|-----------|------|
| Built-in laptop webcam | Already in the dropdown → + Add | Free |
| USB webcam | Plug in USB, select in dropdown → + Add | ~10-15 EUR |
| Second USB webcam | Plug in another, shows as separate entry → + Add | ~10-15 EUR |
| iPhone (Mac only) | Same Wi-Fi + Apple ID → appears automatically | Free |
| Phone via [DroidCam](https://www.dev47apps.com/droidcam/) | Install app + driver → "DroidCam Source" in dropdown | Free |
| Phone via [Iriun](https://iriun.com) | Install app + driver → "Iriun Webcam" in dropdown | Free |
| Phone via [Camo](https://reincubate.com/camo/) | Install app + driver → "Camo" in dropdown | Free / paid |

You can **mix and match** — e.g. laptop webcam + 1 USB cam + 2 phones via DroidCam = 4 cameras. Each click on **+ Camera** adds a new independent source.

### Using the Robot Tuto template

1. On first launch, pick **🤖 Robot Tuto**
2. NoorCast creates 5 steps: **Intro → Code → Robot → Sensors → Recap**
3. Click each step to switch scenes during recording
4. Each switch automatically drops a chapter marker in the video

### Connecting your micro:bit

NoorCast can read your **micro:bit sensors live** via Web Bluetooth:

1. Click **📡 Connect micro:bit** in the left sidebar
2. Pair your micro:bit in the browser popup
3. Accelerometer data appears in real time
4. **Button A** = zoom in, **Button B** = drop a chapter marker
5. Tilting the micro:bit drives the **laser pointer** on screen

**[MakeCode](https://makecode.microbit.org/#editor) code** (flash this to your micro:bit to enable BLE):

```javascript
bluetooth.startAccelerometerService()
bluetooth.startButtonService()
basic.forever(() => {
    basic.pause(100)
})
```

### Sensor overlay in recordings

Enable **"🤖 Overlay auto si le robot bouge fort"** in Settings → Recording. When the robot moves, accelerometer values appear on the canvas and are baked into the recording.

### micro:bit advanced features

All toggleable in Settings → Behavior:

| Feature | What it does |
|---------|-------------|
| 🫨 Shake → switch scene | Shake the micro:bit hard to jump to a random scene |
| 🎉 Shake → confetti | Shake triggers a confetti burst on canvas |
| 👏 Button A → applause | Button A plays an applause sound effect instead of zoom |
| 📈 Live graph | Real-time X/Y/Z accelerometer line chart on canvas |
| 🌈 Motion trail | Rainbow dot trail showing the robot's movement path |
| 🌡 Temperature | Displays micro:bit thermometer reading on canvas |
| 💡 Light level | Shows ambient light as a bar on canvas |
| 🔊 Sound level | micro:bit v2 mic level via UART (needs updated firmware) |
| 🎯 Tilt → pan camera | Tilting shifts the crop window on the selected source |

### Privacy features (for camera-shy teachers)

- **🤖 Avatar mode:** Replaces the camera feed with a cartoon face. The mouth animates with your voice. Sources named "robot" get a robot antenna.
- **🔲 Privacy blur:** Blurs the entire camera feed at 30px. You appear as a shape with colors but your face is unrecognizable.
- Both toggleable per-source in **🎨 Style → Privacy**.
- Or simply **don't add a face camera** — use screen + robot cam + mic only.

---

## 🔧 Assembly Tutorial Setup

For teachers who film themselves **building and assembling robots** on a desk:

### Recommended camera layout

| Camera | What it films | Mount |
|--------|--------------|-------|
| Phone 1 (Iriun, portrait) | Hands + desk from above | Gooseneck clamp on desk edge (~8 EUR) |
| Phone 2 (DroidCam) | Close-up on the robot | Small tripod at table level |
| Screen share | Assembly instructions / datasheet | Browser or PDF |
| USB webcam (optional) | Face for intro/outro | On laptop |

### Cheap overhead mount options

- **Phone gooseneck clamp** (~8 EUR on Amazon) — clips to desk edge, bends over workspace. Best option.
- **Selfie stick + tape** — ghetto but works for quick setups
- **Book stand** leaning over the desk with phone resting against it
- **3D-printed arm** — if you have access to a printer, many free designs on Thingiverse

### Tips for assembly filming

1. **Use portrait mode** (Iriun) for the overhead shot — shows more of the vertical desk space
2. **Good lighting matters more than camera quality** — a desk lamp pointed at the workspace makes a huge difference
3. **Use the Freeze + Draw combo** (F then D) — freeze the overhead view, draw circles around components, annotate pin numbers
4. **Drop markers** (M) at each assembly step — viewers get a clickable chapter timeline ("Step 1: Solder the motor driver", "Step 2: Connect the wheels")
5. **Rename the "You" scene** to **"My Hands"** — double-click the scene button label to rename it
6. **Use text stickers** for part labels — click ✏️ Add Text → type "Motor Driver" → position it near the component

### Example workflow

1. Scene 1 "Intro" (face cam): "Today we're building a line-following robot!"
2. Scene 2 "Parts" (overhead cam): show all components laid out
3. Scene 3 "Build" (overhead cam + close-up): assemble step by step, drop markers
4. Scene 4 "Code" (screen share): write the program in MakeCode
5. Scene 5 "Test" (robot cam): run the robot, show it working
6. Scene 6 "Recap" (face cam): wrap up, show the finished robot

---

## Scenes

NoorCast has **6 built-in scene presets** that arrange your sources in different layouts:

| Scene | Layout |
|-------|--------|
| Code | Screen fullscreen, face cam small in corner |
| Robot | Robot camera fullscreen |
| Sensors | Sensor camera fullscreen |
| Code + Robot | Split screen: code left, robot right |
| Studio | All cameras visible in a grid |
| You | Face cam fullscreen (for intro/outro) |

### Switching scenes
- Click a scene button in the right sidebar
- Press **1-6** on keyboard for quick switch
- Press **?** for a random scene

### Custom scenes
1. Arrange your sources exactly how you want them
2. Click **💾 Save this layout**
3. Name your scene — it appears as a new button

---

## Recording

### Starting
- Click the big red **REC** button or press **R**
- A countdown (3-2-1) plays before recording starts

### During recording
- **M** = drop a chapter marker (creates a clickable timestamp in the video)
- **Q** = show a quiz card overlay
- **Pause** = pause recording (⏸ PAUSED appears on canvas)
- Switch scenes with **1-6** or by clicking scene buttons

### Stopping
- Click **Stop** or press **Escape**
- Your video downloads automatically as `.webm` (or `.mp4` if supported)
- Chapter file (`.vtt`) and sensor data (`.csv`) download alongside

### After recording
- **Trim**: cut the start/end of your video
- **Silence trim**: automatically remove silent pauses
- **Take notes**: add notes about what went well
- **Rate**: give your take 1-5 stars
- **SRT captions**: if live captions were on, download `.srt` subtitle file (works with YouTube, VLC)
- **Thumbnail**: download a `.png` screenshot of the last frame for YouTube thumbnails

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **R** | Start/stop recording |
| **L** | Laser pointer |
| **F** | Freeze screen |
| **D** | Draw / whiteboard |
| **S** | Take snapshot |
| **T** | Teleprompter |
| **Z** | Zoom |
| **M** | Drop chapter marker |
| **Q** | Quiz card |
| **G** | Rule-of-thirds grid |
| **1-6** | Switch to scene 1-6 |
| **?** | Random scene |
| **Ctrl+Z** | Undo layout change |
| **Ctrl+Y** | Redo layout change |
| **Ctrl+S** | Download all files |
| **Shift+F** | Focus mode (hide all panels) |
| **Alt+1-9** | Toggle source visibility |
| **Escape** | Stop recording / exit mode |

Press **⋯ More** in the tools bar for additional tools: ripples, cursor trail, spotlight, auto-zoom, teleprompter, timer, text stamps, sticky notes, emoji reactions, sound board, piano overlay, letterbox bars, color picker.

---

## Settings Overview

Settings are in the **⚙** panel (top-right gear icon), organized into sections:

### General
- Language (FR / EN / AR)
- Theme (8 visual themes)
- Canvas background color
- Snap-to-grid for source positioning

### Recording
- **Capture**: countdown, mirror webcam, output format, stage aspect ratio
- **Overlays**: clock, REC indicator, elapsed timer, captions, letterbox, vignette
- **Audio**: sound effects, mic boost, noise gate, volume ducking
- **Behavior**: auto-pause, scene transitions, auto-save

### Logo
- Upload your school/brand logo (PNG/SVG)
- Adjust size, opacity, filter, tint, position
- Save up to 3 brand presets

### Slogan & Effect
- Add scrolling text, badge card URL, watermark (draggable on canvas, position saved)

### Ticker
- Custom scrolling messages at the bottom of the screen

---

## Tips for Great Tutorials

1. **Do a dry run first** — press all your scene switches without recording to check angles
2. **Use the teleprompter** (T) — paste your lesson script, it auto-scrolls while you talk
3. **Drop markers** (M) at every section change — your viewers get a clickable chapter timeline
4. **Freeze + Draw** (F then D) — pause the screen and annotate code with circles and arrows
5. **Keep takes short** — 5-10 minutes per video, re-record if needed (it's free and instant)
6. **Use the silence trimmer** after Stop — it removes all the "umm..." pauses automatically
7. **Check the dashboard** — track your recording streak, total time, and badges earned

---

## Troubleshooting

### Camera not showing in dropdown
- Make sure no other app (Zoom, Teams) is using the camera
- Try refreshing the page
- Check browser permissions: click the lock icon in the address bar → Camera → Allow

### Phone camera not appearing (DroidCam/Iriun)
- Ensure both phone and computer are on the same Wi-Fi
- Check that the DroidCam/Iriun Client is running on the computer
- Try USB instead of Wi-Fi — plug the phone in with a cable

### Recording produces 0-byte file
- Check the activity log (bottom of the page) for error messages
- Try switching output format in Settings → Recording → Output Format
- Ensure at least one video source is active

### micro:bit won't connect
- Use **Chrome or Edge** (Firefox doesn't support Web Bluetooth)
- Make sure Bluetooth is enabled on your computer
- Flash the MakeCode BLE program (see micro:bit section above)
- Try clicking **📡 Connect micro:bit** again
- NoorCast scans for both "BBC micro:bit" and "uBit" name prefixes — both are supported

### Video is choppy
- Close other browser tabs to free up CPU
- Reduce the stage resolution in Settings → Recording → Stage Format
- Disable overlays you're not using (clock, vignette, audio visualizer)

---

## Platform Compatibility

| Feature | Windows | macOS | Linux | Mobile |
|---------|---------|-------|-------|--------|
| Screen capture | ✅ | ✅ | ✅ | ❌ |
| Multi-camera | ✅ | ✅ | ✅ | ❌ |
| Recording | ✅ | ✅ | ✅ | ❌ |
| micro:bit BLE | ✅ | ✅ | ✅ | ❌ |
| MP4 output | ✅ Chrome | ✅ Chrome | ❌ | — |
| WebM output | ✅ | ✅ | ✅ | — |

**Browser:** Chrome 100+ or Edge 100+ required. Firefox and Safari are not supported.

---

## Privacy

- **Zero network calls** — no data ever leaves your computer
- **No accounts** — no login, no signup, no cloud
- **No analytics** — no tracking, no cookies (except localStorage for settings)
- **Fonts are self-hosted** — even the fonts load from local files
- **GDPR-friendly** — safe for schools with strict data policies

---

*NoorCast v0.7.176 — A professional tool for teachers who code with robots*
