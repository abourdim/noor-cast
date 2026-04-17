/**
 * NoorCast — micro:bit BLE Firmware V3.5
 *
 * UART over Bluetooth LE
 * Compatible with NoorCast + bit-playground
 *
 * v3.5: REMOVED compass telemetry. Calling input.compassHeading()
 * triggers MakeCode's "tilt to fill circle" calibration game on the
 * LEDs the first time it's used — confusing for kids. Cleaner to
 * skip compass entirely. JS still parses COMPASS: lines if they
 * arrive (backward-compatible with V3.4 and older firmware).
 *
 * v3.4: Servo LED bars only redraw when pan/tilt actually change.
 * Previously they were redrawn every 100ms (after 2s CMD cooldown),
 * which erased any arrow icon shown via CMD:LEFT/UP/etc. with
 * identical bars. Now the LEDs hold whatever was last drawn.
 *
 * v3.3: VERSION REPORT on connect — sends "VER:NoorCast,V3.3,YYYY-MM-DD"
 * so the browser can show which firmware is actually flashed and warn
 * if it's older than expected. Bump FW_BUILD on every reflash.
 *
 * v3.2: CHANGE-DETECTION on all telemetry — only sends a line when
 * the value actually changes (with thresholds for noisy sensors).
 * Cuts BLE traffic ~10× when the board sits idle. On (re)connect a
 * "burst" frame sends all current values once so the browser panel
 * populates immediately.
 *
 * Thresholds: acc 50 mg, sound 5, light 5, compass 5°, temp 1°C.
 *
 * TELEMETRY (micro:bit → browser):
 *   A:x,y,z        accelerometer (milli-g)
 *   BA:1 / BB:1     button pressed
 *   TP:n            temperature (°C)
 *   L:n             light (0-255)
 *   S:n             sound (0-255, V2)
 *   LEDS:r0,r1,r2,r3,r4  LED sync
 *   (compass intentionally omitted — avoids calibration prompt)
 *
 * COMMANDS (browser → micro:bit):
 *   P:angle         pan servo P1 (0-180)
 *   TI:angle        tilt servo P2 (0-180)
 *   P:OFF / TI:OFF  release servo PWM
 *   LED:hex         5x5 matrix (5 hex bytes)
 *   CMD:HEART/SMILE/SAD/CLEAR/UP/DOWN/LEFT/RIGHT/FIRE
 *   TEXT:string     scroll text on LEDs
 *   BUZZ:freq,ms    play tone (V2 speaker + P0)
 *   BUZZ:OFF        stop sound
 *   TEST            checkmark + reply "OK"
 *   HELLO           heart on connect — also forces telemetry burst
 *   BYE             clean disconnect (show X, stop telemetry)
 *   VER?            re-send VER:… line (browser can poll on demand)
 */

// v3.3: firmware identity — bump FW_BUILD when you reflash this code.
// FW_NAME stays "NoorCast" so other apps using the same protocol can
// tell if a board is running NoorCast firmware vs. something else.
const FW_NAME = "NoorCast"
const FW_VERSION = "V3.5"
const FW_BUILD = "2026-04-17"

bluetooth.startUartService()
let pan = 90, tilt = 90, ledsDirty = false, lastCmdAt = 0
let prevPan = -1, prevTilt = -1
let s1Active = false, s2Active = false, btConnected = false

// v3.2: cached previous telemetry values for change detection.
// -9999 means "never sent" — first read forces a transmit (burst).
let prevAx = -9999, prevAy = -9999, prevAz = -9999
let prevTp = -9999, prevL = -9999, prevS = -9999, prevC = -9999
let burst = true  // set true on (re)connect to force one full snapshot

// v3.3: helper — send firmware identity in a single line
function sendVer() {
    bluetooth.uartWriteLine("VER:" + FW_NAME + "," + FW_VERSION + "," + FW_BUILD)
}

bluetooth.onBluetoothConnected(() => {
    btConnected = true
    burst = true   // re-send all telemetry once on (re)connect
    basic.showIcon(IconNames.Yes)
    bluetooth.uartWriteLine("INFO:CONNECTED")
    sendVer()  // v3.3: announce identity right after CONNECTED
})
bluetooth.onBluetoothDisconnected(() => {
    btConnected = false
    basic.showIcon(IconNames.No)
    basic.pause(2000)
    basic.clearScreen()
})

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), () => {
    let cmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    // Servos
    if (cmd == "P:OFF") {
        pins.analogWritePin(AnalogPin.P1, 0); s1Active = false; return
    }
    if (cmd == "TI:OFF") {
        pins.analogWritePin(AnalogPin.P2, 0); s2Active = false; return
    }
    if (cmd.indexOf("P:") == 0) {
        pan = Math.min(180, Math.max(0, parseInt(cmd.substr(2))))
        pins.servoWritePin(AnalogPin.P1, pan); s1Active = true; return
    }
    if (cmd.indexOf("TI:") == 0) {
        tilt = Math.min(180, Math.max(0, parseInt(cmd.substr(3))))
        pins.servoWritePin(AnalogPin.P2, tilt); s2Active = true; return
    }
    // Test / Hello / Bye
    if (cmd == "TEST") {
        basic.showIcon(IconNames.Yes)
        basic.pause(500); basic.clearScreen()
        bluetooth.uartWriteLine("OK"); return
    }
    if (cmd == "HELLO") {
        basic.showIcon(IconNames.Heart)
        burst = true   // v3.2: re-send full telemetry snapshot
        sendVer()      // v3.3: re-announce identity
        basic.pause(300); basic.clearScreen(); return
    }
    if (cmd == "VER?") {  // v3.3: on-demand version query
        sendVer(); return
    }
    if (cmd == "BYE") {
        btConnected = false
        basic.showIcon(IconNames.No)
        basic.pause(500); basic.clearScreen(); return
    }
    // LED matrix (hex)
    if (cmd.indexOf("LED:") == 0) {
        let hex = cmd.substr(4)
        for (let r = 0; r < 5; r++) {
            let b = parseInt(hex.substr(r * 2, 2), 16)
            for (let c = 0; c < 5; c++) {
                if ((b >> (4 - c)) & 1) led.plot(c, r)
                else led.unplot(c, r)
            }
        }
        ledsDirty = true; return
    }
    // CMD icons + arrows
    if (cmd.indexOf("CMD:") == 0) {
        lastCmdAt = input.runningTime()
        let c = cmd.substr(4)
        if (c == "HEART") basic.showIcon(IconNames.Heart)
        else if (c == "SMILE") basic.showIcon(IconNames.Happy)
        else if (c == "SAD") basic.showIcon(IconNames.Sad)
        else if (c == "CLEAR") basic.clearScreen()
        else if (c == "UP") basic.showArrow(ArrowNames.North)
        else if (c == "DOWN") basic.showArrow(ArrowNames.South)
        else if (c == "LEFT") basic.showArrow(ArrowNames.West)
        else if (c == "RIGHT") basic.showArrow(ArrowNames.East)
        else if (c == "FIRE") {
            for (let i = 0; i < 3; i++) {
                basic.showIcon(IconNames.SmallDiamond)
                basic.pause(100)
                basic.showIcon(IconNames.Diamond)
                basic.pause(100)
            }
            basic.clearScreen()
        }
        ledsDirty = true; return
    }
    // Scroll text
    if (cmd.indexOf("TEXT:") == 0) {
        basic.showString(cmd.substr(5)); return
    }
    // Buzzer
    if (cmd == "BUZZ:OFF") {
        music.stopAllSounds()
        pins.analogWritePin(AnalogPin.P0, 0); return
    }
    if (cmd.indexOf("BUZZ:") == 0) {
        let parts = cmd.substr(5).split(",")
        if (parts.length == 2) {
            let freq = parseInt(parts[0])
            let dur = parseInt(parts[1])
            if (freq >= 20 && freq <= 20000 && dur >= 1 && dur <= 5000) {
                control.inBackground(() => music.playTone(freq, dur))
            }
        }
        return
    }
})

input.onButtonPressed(Button.A, () => { if (btConnected) bluetooth.uartWriteLine("BA:1") })
input.onButtonPressed(Button.B, () => { if (btConnected) bluetooth.uartWriteLine("BB:1") })

// Telemetry + LED sync
let prevLeds = ""
basic.forever(() => {
    if (!btConnected) {
        // v3.5: pulsing X = "waiting for connection" (was a pulsing dot).
        // X is unambiguously "disconnected" — parents/kids instantly
        // understand without needing context.
        basic.showIcon(IconNames.No)
        basic.pause(600)
        basic.clearScreen()
        basic.pause(400)
        return
    }
    // v3.2: change-detection — only send when value changed enough.
    // 'burst' forces a one-time full snapshot on connect/HELLO.
    let ax = input.acceleration(Dimension.X)
    let ay = input.acceleration(Dimension.Y)
    let az = input.acceleration(Dimension.Z)
    if (burst || Math.abs(ax - prevAx) >= 50 || Math.abs(ay - prevAy) >= 50 || Math.abs(az - prevAz) >= 50) {
        bluetooth.uartWriteLine("A:" + ax + "," + ay + "," + az)
        prevAx = ax; prevAy = ay; prevAz = az
    }
    let tp = input.temperature()
    if (burst || tp != prevTp) {
        bluetooth.uartWriteLine("TP:" + tp); prevTp = tp
    }
    let lv = input.lightLevel()
    if (burst || Math.abs(lv - prevL) >= 5) {
        bluetooth.uartWriteLine("L:" + lv); prevL = lv
    }
    let sv = input.soundLevel()
    if (burst || Math.abs(sv - prevS) >= 5) {
        bluetooth.uartWriteLine("S:" + sv); prevS = sv
    }
    // v3.5: compass intentionally NOT read — input.compassHeading()
    // forces MakeCode's "tilt to fill the circle" calibration game on
    // first call, which is confusing for kids. If you want compass back,
    // call input.calibrateCompass() once then read heading freely.
    burst = false  // burst is one-shot
    // v3.4: Only redraw servo bars when the angle ACTUALLY changed.
    // Previously the bars were drawn every 100ms after the 2s CMD
    // cooldown, which overwrote any other LED content (e.g. the arrow
    // from CMD:LEFT) with identical bars on every tick. Now the bars
    // only refresh when pan/tilt move, so the arrow stays put and the
    // LEDs hold whatever was last drawn.
    if ((s1Active || s2Active)
        && (input.runningTime() - lastCmdAt > 2000)
        && (pan != prevPan || tilt != prevTilt)) {
        // Row 0-1: servo 1 bar, Row 3-4: servo 2 bar, Row 2: separator
        for (let c = 0; c < 5; c++) {
            let s1on = s1Active && c < Math.round(pan / 180 * 5)
            let s2on = s2Active && c < Math.round(tilt / 180 * 5)
            if (s1on) { led.plot(c, 0); led.plot(c, 1) } else { led.unplot(c, 0); led.unplot(c, 1) }
            if (s2on) { led.plot(c, 3); led.plot(c, 4) } else { led.unplot(c, 3); led.unplot(c, 4) }
            led.unplot(c, 2) // separator row
        }
        prevPan = pan
        prevTilt = tilt
        ledsDirty = true
    }
    // LED sync
    if (ledsDirty) {
        let ls = ""
        for (let r = 0; r < 5; r++) {
            let v = 0
            for (let c = 0; c < 5; c++) {
                if (led.point(c, r)) v |= (1 << c)
            }
            ls += (r > 0 ? "," : "") + v
        }
        if (ls != prevLeds) {
            bluetooth.uartWriteLine("LEDS:" + ls)
            prevLeds = ls
        }
        ledsDirty = false
    }
    basic.pause(100)
})
