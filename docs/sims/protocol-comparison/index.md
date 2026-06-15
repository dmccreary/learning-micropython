---
title: Protocol Comparison Explorer
description: Students can select the appropriate protocol (I2C, SPI, UART, 1-Wire) for a given sensor or peripheral based on its wire count, speed, and use case.
image: /sims/protocol-comparison/protocol-comparison.png
og:image: /sims/protocol-comparison/protocol-comparison.png
twitter:image: /sims/protocol-comparison/protocol-comparison.png
social:
   cards: false
quality_score: 0
---

# Protocol Comparison Explorer

<iframe src="main.html" height="512" width="100%" scrolling="no"></iframe>

[Run the Protocol Comparison Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can select the appropriate protocol (I2C, SPI, UART, 1-Wire) for a given sensor or peripheral based on its wire count, speed, and use case.

This interactive MicroSim supports a **Understand (L2)** learning objective: students
can **compare** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 8: Communication Protocols — I2C, SPI, and UART](../../chapters/08-communication-protocols/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/protocol-comparison/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 8: Communication Protocols — I2C, SPI, and UART](../../chapters/08-communication-protocols/index.md).

```text
Type: diagram
**sim-id:** protocol-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: compare
Learning Objective: Students can select the appropriate protocol (I2C, SPI, UART, 1-Wire) for a given sensor or peripheral based on its wire count, speed, and use case.

Canvas layout:
- Top: protocol selector tabs: I2C | SPI | UART | 1-Wire | I2S
- Center: animated waveform showing the selected protocol's bus signals
- Bottom: summary panel: wire count, typical speed, max devices, best for

Visual elements:
- I2C: two waveforms (SDA, SCL); address byte highlighted in purple; data bytes in blue
- SPI: four waveforms (SCK, MOSI, MISO, CS); CS pulse visible
- UART: two waveforms (TX, RX); start/stop bits highlighted
- 1-Wire: single waveform with presence pulse animation

Interactive controls:
- Tab buttons to switch protocol
- A "Send data" button triggers a one-shot waveform animation
- Bottom panel updates automatically with: Wires, Speed, Addressing, Best use

Instructional Rationale: Side-by-side animated waveforms with a clear summary panel give students a mental model to match protocols to real devices before they wire anything.

Implementation: p5.js. Each protocol stored as an array of timed state changes; draw() animates the waveform; createButton() for tab switching.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can select the appropriate protocol (I2C, SPI, UART, 1-Wire) for a given sensor or peripheral based on its wire count, speed, and use case.

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** compare

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 8: Communication Protocols — I2C, SPI, and UART](../../chapters/08-communication-protocols/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
