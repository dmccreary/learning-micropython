---
title: Input Device Comparison
description: An interactive comparison of six ways to accept user input in MicroPython — push button, potentiometer, rotary encoder, capacitive touch, matrix keypad, and joystick — with pins, signal types, and a built-in quiz.
image: /posters/input-devices/input-devices-infographic.png
og:image: /posters/input-devices/input-devices-infographic.png
twitter:image: /posters/input-devices/input-devices-infographic.png
social:
   cards: false
hide:
    toc
---
# Input Device Comparison

Audience: students choosing how to accept user input in their MicroPython projects.
Chapters: 6 — Digital I/O · 7 — Analog & ADC · 11 — Encoders, Touch & Audio

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Compares six ways to accept user input in a MicroPython project: the push button, potentiometer, rotary encoder, capacitive touch sensor, 4×4 matrix keypad, and joystick module. Click each card to see its signal type, pin count, resolution, and MicroPython code, then use Quiz Me to test which input device fits a given task.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Input Device Comparison", subtitle beneath: "Six ways to accept user input in your MicroPython project."

    Layout: a 2-row × 3-column grid of input-device cards on a light off-white background (#F7F9FC). Each card is a rounded-corner panel with a distinct accent-color top edge, a component illustration, and eight attribute rows. Generous white space, thin card outlines, friendly textbook feel.

    Card 1 — row 1 col 1 (raspberry red #C7164E): Device "Push Button"; Illustration: small black 6×6 mm tactile button with 4 legs viewed from above. Rows:
    · Signal type: Digital — on (1) or off (0)
    · GPIO pins: 1 pin; use Pin.PULL_UP — no external resistor needed
    · Output value: 0 (pressed, pulled to GND) or 1 (released, pulled HIGH)
    · Resolution: 1 bit (two states only)
    · MicroPython: btn = Pin(n, Pin.IN, Pin.PULL_UP); btn.value()
    · Typical cost: $0.05–$0.20 each
    · Debounce needed: Yes — add 10 ms software delay or 100 nF capacitor
    · Best for: Start/stop, menu selection, OK button, trigger

    Card 2 — row 1 col 2 (warm orange #E07B39): Device "Potentiometer"; Illustration: blue 10 kΩ rotary potentiometer viewed from above with shaft and three pins labeled GND · Wiper · 3.3 V. Rows:
    · Signal type: Analog — smooth continuous voltage 0 V to 3.3 V
    · GPIO pins: 1 ADC pin (GP26, GP27, or GP28 on Pico)
    · Output value: 0–65535 (16-bit scaled from 12-bit ADC)
    · Resolution: 12-bit hardware (4096 steps); reported as 16-bit (65536 steps)
    · MicroPython: pot = ADC(26); pot.read_u16()
    · Typical cost: $0.20–$1.00 each
    · Debounce needed: No — analog signal; add RC filter if noisy
    · Best for: Volume control, speed setting, brightness dimmer, angle measurement

    Card 3 — row 1 col 3 (forest green #2D8A4E): Device "Rotary Encoder"; Illustration: rotary encoder module with shaft and click-button; three pins (CLK, DT, SW) labeled on the right side. Rows:
    · Signal type: Digital quadrature — two pulse trains 90° out of phase
    · GPIO pins: 2 pins for rotation (CLK, DT) + optional 1 for built-in push button
    · Output value: Direction (CW/CCW) + step count; unlimited range (no stops)
    · Resolution: Typically 20 detents per full revolution; software counts pulses
    · MicroPython: Read CLK and DT pins; compare transitions to determine direction
    · Typical cost: $0.50–$2.00 each
    · Debounce needed: Yes — mechanical encoders bounce; use interrupts + debounce
    · Best for: Menu navigation, scroll wheel, motor position, unlimited-range number input

    Card 4 — row 2 col 1 (teal blue #1389A6): Device "Capacitive Touch (TTP223)"; Illustration: small TTP223 touch sensor breakout — flat gold touch pad on a green PCB with 3 pins (VCC, GND, SIG). Rows:
    · Signal type: Digital — touch (1) or no-touch (0)
    · GPIO pins: 1 pin (digital input — no pull-up needed)
    · Output value: 0 or 1
    · Resolution: 1 bit; some modules output hold-mode (stays HIGH while touched)
    · MicroPython: touch = Pin(n, Pin.IN); touch.value()
    · Typical cost: $0.30–$1.00 each
    · Debounce needed: No — capacitive sensors have internal hysteresis
    · Best for: Touchless buttons, proximity sensing, moisture detection

    Card 5 — row 2 col 2 (deep purple #6A3FB5): Device "4×4 Matrix Keypad"; Illustration: rectangular membrane keypad with 16 labeled keys (0–9, A–D, *, #) and 8 ribbon cable wires (4 rows + 4 columns). Rows:
    · Signal type: Digital matrix scan — rows and columns polled
    · GPIO pins: 8 pins (4 row output + 4 column input with pull-ups)
    · Output value: One of 16 key characters: '0'–'9', 'A'–'D', '*', '#'
    · Resolution: 16 discrete keys
    · MicroPython: Scan rows/columns in a loop; match pressed row+column to key table
    · Typical cost: $1.00–$3.00 each
    · Debounce needed: Yes — mechanical membrane keys; add 10 ms delay after detect
    · Best for: PIN entry, calculator, menu selection with multiple options

    Card 6 — row 2 col 3 (magenta pink #E5398A): Device "Joystick Module (KY-023)"; Illustration: joystick module with thumb-stick viewed from above; 5 pins labeled VCC, GND, VRx, VRy, SW. Rows:
    · Signal type: 2× Analog (X, Y axes) + 1× Digital (push-button click)
    · GPIO pins: 2 ADC pins (VRx, VRy) + 1 digital pin (SW)
    · Output value: VRx: 0–65535 (left-right); VRy: 0–65535 (up-down); SW: 0 or 1
    · Resolution: 12-bit analog per axis; 1-bit for button; center rest ~32768
    · MicroPython: x=ADC(26).read_u16(); y=ADC(27).read_u16(); btn=Pin(n,Pin.IN,Pin.PULL_UP)
    · Typical cost: $1.00–$3.00 each
    · Debounce needed: Button: yes; analog: no
    · Best for: Robot remote control, games, pan/tilt camera, drawing apps

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold device names, smaller data rows, monospace for MicroPython snippets. Footer bar: "Specifications from manufacturer datasheets and RP2040 ADC documentation — verified June 2026." Overall: tidy vector flat-design reference card grid, clear component illustrations, balanced 2×3 layout, suitable for a classroom wall poster or textbook insert.
