---
title: Ultrasonic Ranging Explorer
description: Students can calculate the distance to an object from the echo duration using the speed-of-sound formula.
image: /sims/ultrasonic-ranging/ultrasonic-ranging.png
og:image: /sims/ultrasonic-ranging/ultrasonic-ranging.png
twitter:image: /sims/ultrasonic-ranging/ultrasonic-ranging.png
social:
   cards: false
quality_score: 0
---

# Ultrasonic Ranging Explorer

<iframe src="main.html" height="452" width="100%" scrolling="no"></iframe>

[Run the Ultrasonic Ranging Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can calculate the distance to an object from the echo duration using the speed-of-sound formula.

This interactive MicroSim supports a **Apply (L3)** learning objective: students
can **calculate** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 9: Temperature, Humidity, and Distance Sensors](../../chapters/09-temp-distance-sensors/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/ultrasonic-ranging/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 9: Temperature, Humidity, and Distance Sensors](../../chapters/09-temp-distance-sensors/index.md).

```text
Type: microsim
**sim-id:** ultrasonic-ranging<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: calculate
Learning Objective: Students can calculate the distance to an object from the echo duration using the speed-of-sound formula.

Canvas layout:
- Left: HC-SR04 sensor icon emitting a semicircular pulse wave animation
- Center: a sliding "wall" object that can be dragged closer or farther
- Right panel: displays echo duration in µs and calculated distance in cm; shows the formula

Visual elements:
- Pulse wave animation: concentric arcs traveling from the sensor, bouncing off the wall, returning
- Wall is a vertical rectangle that the student drags left/right on the canvas
- As the wall moves, echo duration updates and the return wave animates at the right speed

Interactive controls:
- Drag wall to change distance
- createSlider() for "Air temperature" (0–40 °C) — changes speed of sound
- Formula display: `distance = duration / 58` updates live with current values

Instructional Rationale: Animating the ultrasonic pulse as a traveling wave makes the timing concept physical rather than abstract, and the temperature slider hints at a real limitation.

Implementation: p5.js. Wall position → duration → animate wave at `343 + 0.6*(T-20)` m/s; arc animation using frameCount.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can calculate the distance to an object from the echo duration using the speed-of-sound formula.

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

1. [Chapter 9: Temperature, Humidity, and Distance Sensors](../../chapters/09-temp-distance-sensors/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
