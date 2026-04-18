# NoorCast micro:bit firmware (.hex)

Drop pre-compiled `.hex` files here, named like `noorcast-v3.6.hex`, so the
**📥 Download .hex** button in the firmware modal works.

## Build a fresh .hex (one-time, ~3 minutes)

1. **Open MakeCode**: <https://makecode.microbit.org/#editor>
2. Switch to **JavaScript mode** — top-right toggle (`{ }` icon).
3. Paste the entire contents of `makecode.ts` over the default code
   (`Ctrl+A` then `Ctrl+V`).
4. Click **Download** in the bottom-left of MakeCode — your browser
   downloads `microbit-NoorCast.hex` (or similar).
5. Rename to **`noorcast-v3.6.hex`** (must match the `FW_VERSION`
   constant in `makecode.ts`) and drop the file here in `firmware/`.
6. Commit + push. The **📥 Download .hex** button in the firmware
   modal will probe-and-reveal itself automatically — no app code
   change needed.

### When firmware version bumps

If you change `FW_VERSION` in `makecode.ts` (e.g. V3.6 → V3.7), also
update the filename pattern in `index.html` (`tcFwDownloadHex` href +
download attr) and in this README. The probe in `noorcast.js`
(`probeFwHex`) reads the href, so it follows automatically.

## Why MakeCode online (and not `pxt` CLI)

Tried locally via `npm install -g pxt && pxt target microbit && pxt
build` (v0.9.10 session, April 2026). Result: **does not work in
this configuration**. Notes for the next person who tries:

1. `pxt target microbit` succeeds (downloads ~660 packages, takes
   ~3 min). `pxt init` is broken (TypeError on installAsync) — make
   the project manually with `pxt.json` + `main.ts`.
2. The default build picks the V1 (`mbdal`) variant → instant
   "program too big" error because V1 has only ~242 KB usable flash
   and bluetooth+servo doesn't fit. Patching `pxtarget.json` to set
   V2 (`mbcodal`) flash limits as defaults bypasses the V1 check.
3. After that, the build picks a pre-cached V2 runtime hex from
   `hexcache/`. The hex matching `core+bluetooth+microphone+servo`
   leaves only ~3 KB for user code — our 11 KB `main.ts` overflows
   by 3.4 KB. Removing `input.soundLevel()` saves only 148 bytes
   (pxt still auto-adds the `microphone` extension because the API
   scan triggers it).
4. `pxt build --localbuild` would do a fresh native compile via
   yotta + ARM gcc, bypassing the cached hex limit — but requires a
   fully set-up ARM cross-toolchain (gcc-arm-none-eabi, yotta,
   Python 2 build deps). Multi-hour install, often fails on Windows.

**MakeCode online avoids all of this** — its cloud build farm picks
or compiles the right runtime variant for our extension combo and
ships back a fitting hex. Use the 6-step flow at the top of this
README. ~3 minutes one-time, then the .hex sits in this folder
forever.

## Why .hex matters

The .hex file is a self-contained micro:bit binary. Kids drag-and-drop it
onto the **MICROBIT** USB drive — no MakeCode account, no JavaScript copy-
paste, no internet needed. 5-second flash.

The text version of `makecode.ts` stays in the repo as the source of truth
+ for advanced users who want to modify the firmware.
