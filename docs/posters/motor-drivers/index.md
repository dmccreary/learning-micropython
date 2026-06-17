---
title: Motor Driver ICs Compared
description: An interactive comparison of the L293D, DRV8833, and TB6612FNG motor driver chips covering voltage, current, packaging, and cost with a built-in quiz.
image: /posters/motor-drivers/motor-drivers-infographic.png
og:image: /posters/motor-drivers/motor-drivers-infographic.png
twitter:image: /posters/motor-drivers/motor-drivers-infographic.png
social:
   cards: false
hide:
    toc
---
# Motor Driver ICs Compared

Audience: students wiring motors to their Raspberry Pi Pico.
Chapter: 12 — Motors, Servos & Steppers

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Compares the three motor driver ICs you are most likely to use with a Raspberry Pi Pico: the classic L293D, the low-voltage DRV8833, and the efficient TB6612FNG. Click each column to see motor and logic voltages, current limits, protection features, packaging, and cost, then use Quiz Me to test which driver fits a given motor.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Motor Driver ICs Compared", subtitle beneath: "L293D · DRV8833 · TB6612FNG — the chips that let your Pico drive real motors."

    Layout: a three-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a top-view illustration of the breakout board or IC package. A vertical row-label strip on the far left lists the ten attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (warm orange #E07B39): Header "L293D"; sub-header "Classic H-bridge"; Illustration: DIP-16 IC package top view with 16 pins labeled; tan/gray body. Rows:
    · Motor channels: 2 independent DC motor channels (or 1 stepper)
    · Motor voltage: 4.5 V–36 V (Vmotor pin)
    · Logic voltage: 5 V (TTL compatible; 3.3 V GPIO usually works)
    · Continuous current: 600 mA per channel
    · Peak current: 1.2 A per channel
    · Built-in protection: Thermal shutdown; internal flyback diodes
    · Package: DIP-16 — breadboard friendly, no soldering required
    · Typical cost: $0.50–$1.50
    · MicroPython: 2 GPIO direction pins + 1 PWM enable pin per channel
    · Best for: Beginners; breadboard prototyping; lower-current motors

    Column 2 (raspberry red #C7164E): Header "DRV8833"; sub-header "Low-voltage H-bridge"; Illustration: small green breakout board top view with HTSSOP-16 IC and 8 header pins; Pololu or SparkFun style. Rows:
    · Motor channels: 2 independent DC motor channels (or 1 stepper)
    · Motor voltage: 2.7 V–10.8 V
    · Logic voltage: 2.7 V–5 V (3.3 V GPIO direct connect)
    · Continuous current: 1.5 A per channel
    · Peak current: 2 A per channel
    · Built-in protection: Current limiting, thermal shutdown, nSLEEP low-power mode
    · Package: HTSSOP-16 (surface-mount; usually on a breakout board)
    · Typical cost: $1.00–$3.00 (breakout board)
    · MicroPython: 2 GPIO pins per channel; supports phase/enable and in1/in2 drive modes
    · Best for: Pico-powered robots; 3.3 V logic systems; slightly more current than L293D

    Column 3 (deep purple #6A3FB5): Header "TB6612FNG"; sub-header "Efficient dual H-bridge"; Illustration: small purple SparkFun breakout board top view with SSOP-24 IC and labeled header pins. Rows:
    · Motor channels: 2 independent DC motor channels + separate PWM input per channel
    · Motor voltage: 2.5 V–13.5 V
    · Logic voltage: 2.7 V–5.5 V (3.3 V GPIO direct connect)
    · Continuous current: 1.2 A per channel
    · Peak current: 3.2 A per channel (burst, up to 2 s)
    · Built-in protection: Thermal shutdown, under-voltage lockout, standby mode (STBY pin)
    · Package: SSOP-24 (surface-mount; usually on a breakout board)
    · Typical cost: $2.00–$5.00 (breakout board)
    · MicroPython: 2 direction pins + 1 PWM pin per channel + 1 STBY pin for both channels
    · Best for: Higher-torque robots; long battery-powered sessions; clean PWM speed control

    At the bottom, a note row spanning all three columns: "Rule of thumb: Motor stall current must be ≤ driver peak current. Always add a flyback diode if your driver board does not have one built in."

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, numbers bold so current specs pop, monospace for MicroPython notes. Footer bar: "Sources: TI L293D datasheet · TI DRV8833 datasheet · Toshiba TB6612FNG datasheet — all verified June 2026." Overall: tidy vector flat-design infographic poster, three-column grid with IC illustrations, suitable for a textbook or classroom screen.
