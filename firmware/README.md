# NoorCast micro:bit firmware (.hex)

Drop pre-compiled `.hex` files here, named like `noorcast-v3.6.hex`, so the
**📥 Download .hex** button in the firmware modal works.

## Build a fresh .hex

1. Open `makecode.ts` from the project root in [MakeCode](https://makecode.microbit.org/)
   (JavaScript mode → paste).
2. Click **Download** → MakeCode generates a `.hex` for micro:bit V2.
3. Rename to `noorcast-v3.6.hex` (match the `FW_VERSION` constant) and drop here.
4. Commit. The `📥 Download .hex` button will serve it.

## Why .hex matters

The .hex file is a self-contained micro:bit binary. Kids drag-and-drop it
onto the **MICROBIT** USB drive — no MakeCode account, no JavaScript copy-
paste, no internet needed. 5-second flash.

The text version of `makecode.ts` stays in the repo as the source of truth
+ for advanced users who want to modify the firmware.
