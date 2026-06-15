---
title: Accelerometer Axes Explorer
description: Students can describe how gravity's 1 g vector distributes across X, Y, and Z axes as the board tilts, and use this to infer tilt angle.
image: /sims/accelerometer-axes/accelerometer-axes.png
og:image: /sims/accelerometer-axes/accelerometer-axes.png
twitter:image: /sims/accelerometer-axes/accelerometer-axes.png
social:
   cards: false
quality_score: 0
---

# Accelerometer Axes Explorer

<iframe src="main.html" height="482" width="100%" scrolling="no"></iframe>

[Run the Accelerometer Axes Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can describe how gravity's 1 g vector distributes across X, Y, and Z axes as the board tilts, and use this to infer tilt angle.

This interactive MicroSim supports a **Understand (L2)** learning objective: students
can **explain** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 10: Motion, Orientation, and Light Sensors](../../chapters/10-motion-light-sensors/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/accelerometer-axes/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 10: Motion, Orientation, and Light Sensors](../../chapters/10-motion-light-sensors/index.md).

```text
Type: diagram
**sim-id:** accelerometer-axes<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain
Learning Objective: Students can describe how gravity's 1 g vector distributes across X, Y, and Z axes as the board tilts, and use this to infer tilt angle.

Canvas layout:
- Left: a 3D-looking rectangle representing the PCB, with X/Y/Z axis arrows
- Right: three horizontal bar gauges showing X, Y, Z acceleration in g units
- Bottom: numeric readouts and a simple tilt-angle estimate

Visual elements:
- PCB rectangle tilts as the student drags the rotation sliders
- Axis arrows labeled (X=red, Y=green, Z=blue)
- Bar gauges fill proportionally; Z shows 1.0 when flat

Interactive controls:
- createSlider() for "Tilt forward/back" (−90 to 90°) and "Tilt left/right" (−90 to 90°)
- Live formula: `angle = atan2(X, Z)` displayed below gauges

Instructional Rationale: Visualizing how gravity distributes across axes as the board tilts replaces the abstract formula with a spatial mental model.

Implementation: p5.js. PCB drawn as a rotated parallelogram; axis gauges as filled rectangles; trig computed live from slider values.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can describe how gravity's 1 g vector distributes across X, Y, and Z axes as the board tilts, and use this to infer tilt angle.

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** explain

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 10: Motion, Orientation, and Light Sensors](../../chapters/10-motion-light-sensors/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
