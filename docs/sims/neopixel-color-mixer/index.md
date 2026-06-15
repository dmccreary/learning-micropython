---
title: NeoPixel Color Mixer
description: Students can construct a target NeoPixel color by adjusting R, G, B sliders and predict the resulting code.
image: /sims/neopixel-color-mixer/neopixel-color-mixer.png
og:image: /sims/neopixel-color-mixer/neopixel-color-mixer.png
twitter:image: /sims/neopixel-color-mixer/neopixel-color-mixer.png
social:
   cards: false
quality_score: 0
---

# NeoPixel Color Mixer

<iframe src="main.html" height="477" width="100%" scrolling="no"></iframe>

[Run the NeoPixel Color Mixer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can construct a target NeoPixel color by adjusting R, G, B sliders and predict the resulting code.

This interactive MicroSim supports a **Apply (L3)** learning objective: students
can **construct** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 14: NeoPixels and Non-Graphical Displays](../../chapters/14-neopixels-displays/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/neopixel-color-mixer/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 14: NeoPixels and Non-Graphical Displays](../../chapters/14-neopixels-displays/index.md).

```text
Type: microsim
**sim-id:** neopixel-color-mixer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: construct
Learning Objective: Students can construct a target NeoPixel color by adjusting R, G, B sliders and predict the resulting code.

Canvas layout:
- Left 50%: three vertical sliders labeled R, G, B (0–255 each) with colored fill
- Center 25%: a large circle showing the mixed color (the NeoPixel preview)
- Right 25%: the MicroPython code snippet: `np[0] = (R, G, B)` updated live

Visual elements:
- Sliders filled with the corresponding color (R slider is red-tinted, etc.)
- Circle glows with the blended color; brightness dims when all channels are low
- Code snippet updates live with current R, G, B values

Interactive controls:
- Three createSlider() controls (0–255 each)
- "Add random target color" button sets a random color as a target swatch; students try to match it

Instructional Rationale: Hands-on color mixing makes the RGB model tactile and memorable, and seeing the code update live reinforces the mapping between sliders and code.

Implementation: p5.js. Three sliders; background(r, g, b) applied to circle; code text drawn in monospace font.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can construct a target NeoPixel color by adjusting R, G, B sliders and predict the resulting code.

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** construct

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 14: NeoPixels and Non-Graphical Displays](../../chapters/14-neopixels-displays/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
