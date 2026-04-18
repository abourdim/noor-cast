# NoorCast micro:bit firmware (.hex)

Drop pre-compiled `.hex` files here, named like `noorcast-v3.6.hex`, so the
**📥 Download .hex** button in the firmware modal works.

## Build a fresh .hex (one-time, ~3 minutes)

1. **Open MakeCode**: <https://makecode.microbit.org/#editor>
2. Switch to **JavaScript mode** — top-right toggle (`{ }` icon).
3. Paste the entire contents of `../makecode.ts` over the default code
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

## Why .hex matters

The .hex file is a self-contained micro:bit binary. Kids drag-and-drop it
onto the **MICROBIT** USB drive — no MakeCode account, no JavaScript copy-
paste, no internet needed. 5-second flash.

The text version of `makecode.ts` stays in the repo as the source of truth
+ for advanced users who want to modify the firmware.
