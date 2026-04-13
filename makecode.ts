/**
 * NoorCast — micro:bit BLE Firmware V3.1
 *
 * UART over Bluetooth LE
 * Compatible with NoorCast + bit-playground
 *
 * TELEMETRY (micro:bit → browser):
 *   A:x,y,z        accelerometer (milli-g)
 *   BA:1 / BB:1     button pressed
 *   TP:n            temperature (°C)
 *   L:n             light (0-255)
 *   S:n             sound (0-255, V2)
 *   COMPASS:n       heading (0-360)
 *   LEDS:r0,r1,r2,r3,r4  LED sync
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
 *   HELLO           heart on connect
 *   BYE             clean disconnect (show X, stop telemetry)
 */
bluetooth.startUartService()
let pan = 90, tilt = 90, ledsDirty = false, lastCmdAt = 0
let prevPan = -1, prevTilt = -1
let s1Active = false, s2Active = false, btConnected = false

bluetooth.onBluetoothConnected(() => {
    btConnected = true
    basic.showIcon(IconNames.Yes)
    bluetooth.uartWriteLine("INFO:CONNECTED")
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
        basic.pause(300); basic.clearScreen(); return
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
        // Pulsing dot = "waiting for connection"
        led.plot(2, 2); basic.pause(300)
        led.unplot(2, 2); basic.pause(300)
        return
    }
    bluetooth.uartWriteLine("A:" + input.acceleration(Dimension.X) + "," + input.acceleration(Dimension.Y) + "," + input.acceleration(Dimension.Z))
    bluetooth.uartWriteLine("TP:" + input.temperature())
    bluetooth.uartWriteLine("L:" + input.lightLevel())
    bluetooth.uartWriteLine("S:" + input.soundLevel())
    bluetooth.uartWriteLine("COMPASS:" + input.compassHeading())
    // Show servo positions on LEDs only when no recent CMD icon (2s cooldown)
    if ((s1Active || s2Active) && (input.runningTime() - lastCmdAt > 2000)) {
        // Row 0-1: servo 1 bar, Row 3-4: servo 2 bar, Row 2: separator
        for (let c = 0; c < 5; c++) {
            let s1on = s1Active && c < Math.round(pan / 180 * 5)
            let s2on = s2Active && c < Math.round(tilt / 180 * 5)
            if (s1on) { led.plot(c, 0); led.plot(c, 1) } else { led.unplot(c, 0); led.unplot(c, 1) }
            if (s2on) { led.plot(c, 3); led.plot(c, 4) } else { led.unplot(c, 3); led.unplot(c, 4) }
            led.unplot(c, 2) // separator row
        }
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
