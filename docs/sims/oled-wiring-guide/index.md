---
title: OLED Wiring Configuration
description: Students can correctly identify which OLED pin connects to which Pico pin for both I2C and SPI configurations.
image: /sims/oled-wiring-guide/oled-wiring-guide.png
og:image: /sims/oled-wiring-guide/oled-wiring-guide.png
twitter:image: /sims/oled-wiring-guide/oled-wiring-guide.png
social:
   cards: false
quality_score: 0
---

# OLED Wiring Configuration

<iframe src="main.html" height="472" width="100%" scrolling="no"></iframe>

[Run the OLED Wiring Configuration MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can correctly identify which OLED pin connects to which Pico pin for both I2C and SPI configurations.

This interactive MicroSim supports a **Apply (L3)** learning objective: students
can **connect** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 15: OLED Display Setup and Configuration](../../chapters/15-oled-setup/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/oled-wiring-guide/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 15: OLED Display Setup and Configuration](../../chapters/15-oled-setup/index.md).

```text
Type: diagram
**sim-id:** oled-wiring-guide<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: connect
Learning Objective: Students can correctly identify which OLED pin connects to which Pico pin for both I2C and SPI configurations.

Canvas layout:
- Left: stylized OLED module with labeled pins (VCC, GND, SDA/SCL or SPI pins)
- Center: breadboard with connecting wires color-coded by function (red=power, black=GND, yellow=data, blue=clock)
- Right: stylized Pico top-down view with labeled GPIO pins

Visual elements:
- Wire colors: red=VCC, black=GND, yellow=SDA/MOSI, blue=SCL/CLK
- Toggle at the top switches between I2C wiring and SPI wiring
- Moused-over wire lights up and shows a tooltip: "SDA → GP0 (I2C SDA)"

Interactive controls:
- createButton() toggle: "I2C mode" / "SPI mode" — updates the wiring diagram
- Click any wire to see the connection label in a pop-up

Instructional Rationale: Seeing the actual wiring with color-coded wires reduces physical assembly errors, one of the most common beginner frustrations.

Implementation: p5.js. OLED and Pico drawn as labeled rectangles; lines drawn between them; mouse hover detection via dist() to wire endpoints.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can correctly identify which OLED pin connects to which Pico pin for both I2C and SPI configurations.

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** connect

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 15: OLED Display Setup and Configuration](../../chapters/15-oled-setup/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
