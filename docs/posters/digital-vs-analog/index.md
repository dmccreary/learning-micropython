---
title: Digital vs. Analog Signals
description: An interactive comparison of digital and analog signals with PWM and ADC as the bridge between the two worlds on the Raspberry Pi Pico.
image: /posters/digital-vs-analog/analog-adc-pwm-infographic.png
og:image: /posters/digital-vs-analog/analog-adc-pwm-infographic.png
twitter:image: /posters/digital-vs-analog/analog-adc-pwm-infographic.png
social:
   cards: false
hide:
    toc
---
# Digital vs. Analog Signals

Audience: students learning signal types before working with ADC and PWM.
Chapter: 7 — Analog, ADC & PWM

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Compares the two fundamental signal types a microcontroller deals with: the two-state digital signal and the continuously varying analog signal. Click each column to see values, noise immunity, resolution, and the MicroPython calls used to read or write it, then explore the conversion bridge that shows how ADC turns analog into digital and PWM fakes analog using digital.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Render waveform diagrams exactly as described.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Digital vs. Analog Signals", subtitle beneath: "How microcontrollers read and generate real-world signals."

    Layout: Three equal-width columns on a light off-white background (#F7F9FC). Each column is a rounded-corner card with an accent-color top edge. A row of waveform illustrations runs across the top of all three cards. Below each waveform: attribute rows. Generous white space, friendly textbook feel.

    Column 1 (raspberry red #C7164E): Title "Digital Signal"; Waveform illustration: a square wave alternating sharply between 0 V (flat bottom line) and 3.3 V (flat top line) with sharp vertical edges, labeled "0 V = LOW" at the bottom and "3.3 V = HIGH" at the top. Rows:
    · Values: Only two states — LOW (0 V) or HIGH (3.3 V)
    · Noise immunity: Excellent — binary states ignore small fluctuations
    · Resolution: 1 bit per sample
    · Examples: LED on/off, button press, UART data bit, I2C clock
    · MicroPython read: pin.value() → returns 0 or 1
    · MicroPython write: pin.value(1) or pin.value(0)
    · Pico GPIO: All 26 GPIO pins

    Column 2 (teal blue #1389A6): Title "Analog Signal"; Waveform illustration: a smooth sine wave (or gentle curve) oscillating continuously between 0 V and 3.3 V with a label "0 V" at the trough and "3.3 V" at the peak. Rows:
    · Values: Continuous range from 0 V to 3.3 V
    · Noise immunity: Poor — susceptible to electromagnetic interference
    · Resolution: Infinite in nature; limited by ADC when digitized
    · Examples: Potentiometer wiper, microphone output, LDR voltage divider, temperature sensor
    · MicroPython read: ADC(pin).read_u16() → returns 0–65535 (scaled from 12-bit hardware)
    · MicroPython write: Not available (use PWM to approximate)
    · Pico GPIO: ADC only on GP26, GP27, GP28

    Column 3 (deep purple #6A3FB5): Title "PWM — Digital Pretending to be Analog"; Waveform illustration: a pulse wave with varying duty cycle — left half shows 25% duty cycle (short HIGH pulses), right half shows 75% duty cycle (longer HIGH pulses). Label "Duty cycle = HIGH time ÷ Period × 100%". Rows:
    · Values: Rapid switching between 0 V and 3.3 V; perceived as analog by slow devices
    · Duty cycle: 0% = always LOW; 50% = equal on/off; 100% = always HIGH
    · Frequency: 8 Hz to 62.5 MHz on RP2040
    · Resolution: 16-bit (0–65535 steps)
    · Examples: LED brightness (eye averages the flicker), servo position (1–2 ms pulse), motor speed
    · MicroPython: pwm = PWM(pin); pwm.duty_u16(32768) sets 50% duty
    · Pico GPIO: All 26 GPIO pins (8 PWM slices, 2 channels each)

    Below the three columns, a horizontal "conversion bridge" banner spanning all three cards (dark slate #2A2E3A background, white text): "ADC converts Analog → Digital · PWM simulates Analog using Digital"

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column titles, monospace for MicroPython code snippets, slightly smaller for data rows. Footer bar: "Sources: RP2040 Datasheet §4.5 (ADC) §4.5 (PWM) — Raspberry Pi Ltd, 2021." Overall: tidy vector flat-design infographic, clear waveform diagrams in a matching accent color, balanced three-column grid, suitable for a textbook or classroom screen.
