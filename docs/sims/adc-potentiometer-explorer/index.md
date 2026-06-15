---
title: ADC and Potentiometer Explorer
description: Students can read a potentiometer value, interpret the raw ADC reading, and scale it to volts, percent, and a target range.
image: /sims/adc-potentiometer-explorer/adc-potentiometer-explorer.png
og:image: /sims/adc-potentiometer-explorer/adc-potentiometer-explorer.png
twitter:image: /sims/adc-potentiometer-explorer/adc-potentiometer-explorer.png
social:
   cards: false
quality_score: 0
---

# ADC and Potentiometer Explorer

<iframe src="main.html" height="482" width="100%" scrolling="no"></iframe>

[Run the ADC and Potentiometer Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can read a potentiometer value, interpret the raw ADC reading, and scale it to volts, percent, and a target range.

This interactive MicroSim supports a **Apply (L3)** learning objective: students
can **calculate** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 7: Analog Signals, ADC, and Pulse-Width Modulation](../../chapters/07-analog-adc-pwm/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/adc-potentiometer-explorer/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 7: Analog Signals, ADC, and Pulse-Width Modulation](../../chapters/07-analog-adc-pwm/index.md).

```text
Type: microsim
**sim-id:** adc-potentiometer-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: calculate
Learning Objective: Students can read a potentiometer value, interpret the raw ADC reading, and scale it to volts, percent, and a target range.

Canvas layout:
- Left 40%: a rotary knob (drag to turn) representing the potentiometer
- Center 30%: four labeled readouts — raw (0–65535), voltage (V), percent (%), and a user-defined target range slider
- Right 30%: a bar graph showing the scaled value in the chosen range

Visual elements:
- Rotary knob drawn with an arc indicating position; draggable
- Waveform line below the knob showing the last 2 seconds of readings
- Readouts update every 50 ms to simulate a real ADC sample

Interactive controls:
- Drag knob left/right to change value
- createSlider() for "Target range min" (0–1000) and "Target range max" (0–1000)
- Result formula shown: `scaled = raw / 65535 × (max - min) + min`

Instructional Rationale: Connecting the physical knob action to the live readout and scaling formula makes the abstract conversion concrete and interactive.

Implementation: p5.js. Knob as an arc; mouse drag changes value; three createSlider() for min, max, update rate; formula displayed dynamically.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can read a potentiometer value, interpret the raw ADC reading, and scale it to volts, percent, and a target range.

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** calculate

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 7: Analog Signals, ADC, and Pulse-Width Modulation](../../chapters/07-analog-adc-pwm/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
