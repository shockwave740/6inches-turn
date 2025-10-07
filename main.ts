let moving = false
let duration = 0
let distance = 0
let dist = 0
/**
 * Checklist:
 */
/**
 * 1. Define motor control functions (A and B, forward, backward, stop).
 */
/**
 * 2. Define ultrasonic distance function (in cm).
 */
/**
 * 3. Keep a state variable for "moving" vs "stopped".
 */
/**
 * 4. If moving and obstacle < 15cm (~6in), turn right briefly, then continue forward.
 */
/**
 * 5. If stopped, ignore obstacles.
 */
function motors_turnRight () {
    // A forward, B forward = spin right in place
    motorA_cw()
    motorB_cw()
    // adjust turn duration
    basic.pause(500)
}
function motors_stop () {
    motorA_stop()
    motorB_stop()
    moving = false
}
// --- Button A starts forward motion ---
input.onButtonPressed(Button.A, function () {
    motors_forward()
})
// --- Motor functions ---
function motorA_cw () {
    pins.digitalWritePin(DigitalPin.P0, 1)
    pins.digitalWritePin(DigitalPin.P1, 0)
}
function motorB_cw () {
    pins.digitalWritePin(DigitalPin.P2, 1)
    pins.digitalWritePin(DigitalPin.P3, 0)
}
function motorB_stop () {
    pins.digitalWritePin(DigitalPin.P2, 0)
    pins.digitalWritePin(DigitalPin.P3, 0)
}
// --- Ultrasonic distance (HC-SR04) ---
function getDistanceCm () {
    // Send trigger pulse
    pins.digitalWritePin(DigitalPin.P8, 0)
    control.waitMicros(2)
    pins.digitalWritePin(DigitalPin.P8, 1)
    control.waitMicros(10)
    pins.digitalWritePin(DigitalPin.P8, 0)
    // Measure echo pulse
    duration = pins.pulseIn(DigitalPin.P9, PulseValue.High)
    // convert µs to cm
    distance = duration / 58
    return distance
}
function motors_forward () {
    motorA_cw()
    motorB_ccw()
    moving = true
}
// --- Button B stops motors ---
input.onButtonPressed(Button.B, function () {
    motors_stop()
})
function motorB_ccw () {
    pins.digitalWritePin(DigitalPin.P2, 0)
    pins.digitalWritePin(DigitalPin.P3, 1)
}
function motorA_ccw () {
    pins.digitalWritePin(DigitalPin.P0, 0)
    pins.digitalWritePin(DigitalPin.P1, 1)
}
function motorA_stop () {
    pins.digitalWritePin(DigitalPin.P0, 0)
    pins.digitalWritePin(DigitalPin.P1, 0)
}
// --- Main loop ---
basic.forever(function () {
    dist = getDistanceCm()
    if (moving) {
        if (dist > 0 && dist < 15) {
            // obstacle within 15 cm (~6 in)
            motors_turnRight()
            motors_forward()
        }
    }
})
