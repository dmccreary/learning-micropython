---
title: Digital I/O Explorer
description: Students can trace the signal path from a button press through debouncing logic to an LED output, and predict the output state from a given input sequence.
image: /sims/digital-io-explorer/digital-io-explorer.png
og:image: /sims/digital-io-explorer/digital-io-explorer.png
twitter:image: /sims/digital-io-explorer/digital-io-explorer.png
social:
   cards: false
quality_score: 0
---

# Digital I/O Explorer

<iframe src="main.html" height="462" width="100%" scrolling="no"></iframe>

[Run the Digital I/O Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can trace the signal path from a button press through debouncing logic to an LED output, and predict the output state from a given input sequence.

This interactive MicroSim supports a **Apply (L3)** learning objective: students
can **demonstrate** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 6: Digital Input, Output, and Interrupts](../../chapters/06-digital-io-interrupts/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/digital-io-explorer/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 6: Digital Input, Output, and Interrupts](../../chapters/06-digital-io-interrupts/index.md).

```text
Type: microsim
**sim-id:** digital-io-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: demonstrate
Learning Objective: Students can trace the signal path from a button press through debouncing logic to an LED output, and predict the output state from a given input sequence.

Canvas layout:
- Left column: animated button (click to toggle) with bounce waveform shown below it
- Center: software debounce logic block with timer countdown
- Right column: LED indicator showing the debounced output state

Visual elements:
- Button click generates a noisy bouncing signal shown as a jittery waveform
- A 30 ms timer bar in the center fills as the debounce delay runs
- After the timer, the output LED changes state cleanly
- Bounces that occur before the timer resets the timer

Interactive controls:
- Click button: generates a simulated bounce (random count 3–8 bounces in 5 ms)
- Slider: "Debounce time" (10–100 ms)
- Toggle: "Software" vs "Hardware" mode (hardware shows a smoothed RC waveform instead of the bounce pattern)

Instructional Rationale: Seeing the bounce as an animation and watching the debounce timer absorb it makes the problem and solution vivid in a way that text alone cannot.

Implementation: p5.js. Use createSlider() for debounce time; button click starts a bounce animation (sinusoidal noise added to signal); debounce timer is a visual progress bar.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can trace the signal path from a button press through debouncing logic to an LED output, and predict the output state from a given input sequence.

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** demonstrate

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 6: Digital Input, Output, and Interrupts](../../chapters/06-digital-io-interrupts/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
