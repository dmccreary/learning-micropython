---
title: Common Electronic Components
description: An interactive guide to six fundamental electronic components — the resistor, LED, capacitor, push button, transistor, and potentiometer — with a built-in quiz.
image: /posters/electronic-components/electrical-components-infographic.png
og:image: /posters/electronic-components/electrical-components-infographic.png
twitter:image: /posters/electronic-components/electrical-components-infographic.png
social:
   cards: false
hide:
    toc
---

Audience: beginners learning to identify and use fundamental components.
Chapter: 5 — Electronics Fundamentals

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Introduces the six building blocks found in nearly every circuit: the resistor, LED, capacitor, push button, transistor, and potentiometer. Click each component card to see what it does, its units and values, and a wiring tip, then use Quiz Me to test which component fits a given job.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None," render "None."

    A clean, modern, flat-design educational reference infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Common Electronic Components", subtitle beneath: "Learn to identify and use the building blocks of every circuit."

    Layout: a 2-row × 3-column grid of component cards on a light off-white background (#F7F9FC). Each card is a rounded-corner panel with a distinct accent color on its left edge, a large clear illustration of the component in the center, its circuit schematic symbol below the illustration, and a data block at the bottom. Generous white space, thin card outlines, friendly textbook feel.

    Card 1 (raspberry red #C7164E): Component "Resistor"; Illustration: tan/beige cylindrical body with four color bands and two wire leads; Symbol: rectangle with two lines; Data:
    · Limits current in a circuit
    · Unit: Ohms (Ω)
    · Common values: 220 Ω, 1 kΩ, 10 kΩ
    · Tip: Use one in series with every LED to prevent burnout

    Card 2 (warm orange #E07B39): Component "LED (Light-Emitting Diode)"; Illustration: clear dome with flat-edge (cathode) side visible, two legs; Symbol: triangle pointing right with a vertical bar and two arrows (light rays); Data:
    · Emits light when current flows (anode → cathode)
    · Forward voltage: ~2.0 V (red) – 3.3 V (blue/white)
    · Typical current: 20 mA maximum
    · Tip: Always pair with a 220 Ω–470 Ω resistor from a 3.3 V GPIO pin

    Card 3 (forest green #2D8A4E): Component "Capacitor"; Illustration: blue cylindrical electrolytic cap with "+" marked on the longer lead, or a small ceramic disc; Symbol: two parallel lines (one curved for electrolytic); Data:
    · Stores and releases electrical charge
    · Unit: Farads (F); common: 100 µF electrolytic, 0.1 µF ceramic
    · Uses: Smooth power supply; filter noise; bypass capacitor
    · Tip: Electrolytic caps have polarity — match + and – markings

    Card 4 (teal blue #1389A6): Component "Push Button"; Illustration: rectangular tactile button with four legs on a black body; Symbol: two parallel lines with a diagonal bridging bar (normally open); Data:
    · Momentary switch — connected only while pressed
    · Configuration: Connect one side to GPIO, other to GND; enable internal pull-up
    · Debounce: Add 10 µF cap or software delay to avoid false triggers
    · Tip: Use Pin.PULL_UP in MicroPython for reliable readings

    Card 5 (deep purple #6A3FB5): Component "Transistor (NPN BJT, e.g., 2N2222)"; Illustration: black D-shaped plastic body with three labeled leads: Base (B), Collector (C), Emitter (E); Symbol: NPN transistor symbol with labeled B, C, E; Data:
    · Acts as an electronic switch: small base current controls large collector current
    · GPIO → 1 kΩ resistor → Base; load connects Collector to V+; Emitter to GND
    · Gain (hFE): ~100–300 (2N2222)
    · Tip: Use to drive motors, buzzers, or LEDs that need more than 20 mA

    Card 6 (magenta pink #E5398A): Component "Potentiometer (10 kΩ)"; Illustration: blue rectangular body with a top-turn shaft, three pins at bottom labeled Left, Wiper, Right; Symbol: rectangle with arrow pointing to middle; Data:
    · Variable resistor — turning the knob changes resistance 0 Ω → 10 kΩ
    · Connect: Left pin to 3.3 V, Right pin to GND, Wiper pin to ADC input
    · Output voltage at wiper: 0 V to 3.3 V (reads 0–65535 in MicroPython read_u16())
    · Tip: Use for volume control, angle setting, brightness dimmer

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold component names, smaller data text. Accent colors used for card left-edge only; all text in dark slate #2A2E3A on off-white. Footer bar: "Components verified against manufacturer datasheets, June 2026." Overall: tidy vector flat-design reference card, clear component illustrations alongside schematic symbols, lots of breathing room, suitable for a classroom wall poster or textbook insert.
