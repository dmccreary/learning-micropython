---
title: Pico Pinout Explorer
description: Students can identify the function of each pin on the Raspberry Pi Pico by name and number.
image: /sims/pico-pinout-explorer/pico-pinout-explorer.png
og:image: /sims/pico-pinout-explorer/pico-pinout-explorer.png
twitter:image: /sims/pico-pinout-explorer/pico-pinout-explorer.png
social:
   cards: false
quality_score: 0
---

# Pico Pinout Explorer

<iframe src="main.html" height="657" width="100%" scrolling="no"></iframe>

[Run the Pico Pinout Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can identify the function of each pin on the Raspberry Pi Pico by name and number.

This interactive MicroSim supports a **Remember (L1)** learning objective: students
can **identify** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 4: Microcontrollers and Hardware Platforms](../../chapters/04-microcontrollers-hardware/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/pico-pinout-explorer/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 4: Microcontrollers and Hardware Platforms](../../chapters/04-microcontrollers-hardware/index.md).

```text
Type: diagram
**sim-id:** pico-pinout-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Remember (L1)
Bloom Verb: identify
Learning Objective: Students can identify the function of each pin on the Raspberry Pi Pico by name and number.

Canvas layout:
- Center: a scaled top-down illustration of the Pico PCB (40 pin pads, two rows of 20)
- Left and right margins: pin labels that align with the corresponding pad
- Bottom: an info panel that shows pin details when a pad is hovered or clicked

Visual elements:
- 40 pin pads color-coded by function:
  - Green: GPIO (GP0–GP28)
  - Red: 3.3V power
  - Black: Ground (GND)
  - Orange: ADC-capable pins (GP26–GP28)
  - Blue: I2C/SPI/UART pins
  - Yellow: VSYS, VBUS, RUN
- Pin label next to each pad: e.g., "GP0 / SDA0 / UART0 TX"

Interactive controls:
- Hover a pin pad: tooltip shows pin number, GPIO name, and alternate functions
- Click a pin pad: info panel updates with full description, voltage, and a usage example
- A legend in the corner explains the color coding
- Filter buttons: "Show GPIO only", "Show Power only", "Show I2C pins"

Instructional Rationale: Color-coded interactive pinout with click-to-reveal lets students explore the Pico layout at their own pace, building spatial memory of pin locations.

Implementation: p5.js. Pin pads as small ellipses; color from function lookup; createButton() for filters; info panel as a rectangle with text.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can identify the function of each pin on the Raspberry Pi Pico by name and number.

- **Bloom Level:** Remember (L1)
- **Bloom Verb:** identify

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 4: Microcontrollers and Hardware Platforms](../../chapters/04-microcontrollers-hardware/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
