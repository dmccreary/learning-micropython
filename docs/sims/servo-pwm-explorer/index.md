---
title: Servo PWM Signal Explorer
description: Students can convert a desired servo angle to the correct PWM duty cycle value for `servo.duty_u16()`.
image: /sims/servo-pwm-explorer/servo-pwm-explorer.png
og:image: /sims/servo-pwm-explorer/servo-pwm-explorer.png
twitter:image: /sims/servo-pwm-explorer/servo-pwm-explorer.png
social:
   cards: false
quality_score: 0
---

# Servo PWM Signal Explorer

<iframe src="main.html" height="497" width="100%" scrolling="no"></iframe>

[Run the Servo PWM Signal Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can convert a desired servo angle to the correct PWM duty cycle value for `servo.duty_u16()`.

This interactive MicroSim supports a **Apply (L3)** learning objective: students
can **calculate** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 12: Motors, Servos, and Stepper Motor Control](../../chapters/12-motors-servos-steppers/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/servo-pwm-explorer/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 12: Motors, Servos, and Stepper Motor Control](../../chapters/12-motors-servos-steppers/index.md).

```text
Type: microsim
**sim-id:** servo-pwm-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: calculate
Learning Objective: Students can convert a desired servo angle to the correct PWM duty cycle value for `servo.duty_u16()`.

Canvas layout:
- Left 40%: an animated servo arm graphic that rotates to the selected angle
- Center 30%: a PWM waveform showing the 20 ms period and the highlighted pulse width
- Right 30%: numeric display of angle, pulse width in µs, and duty_u16 value

Visual elements:
- Servo body drawn as a gray rectangle; arm as a line rotating from center
- PWM waveform: horizontal axis = time (0–20 ms), vertical = HIGH/LOW; pulse width highlighted in yellow
- Labels: "Period = 20 ms (50 Hz)", "Pulse = X µs", "duty_u16 = Y"

Interactive controls:
- createSlider() for "Angle" (0–180°) — updates everything live
- Two extra sliders: "Min pulse (µs)" and "Max pulse (µs)" for calibration practice

Instructional Rationale: Linking the physical arm rotation to the waveform pulse width and the code number gives students a complete mental model for servo control.

Implementation: p5.js. Servo arm rotates using `rotate()`; waveform drawn with line() calls; live formula recalculates on slider change.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can convert a desired servo angle to the correct PWM duty cycle value for `servo.duty_u16()`.

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

1. [Chapter 12: Motors, Servos, and Stepper Motor Control](../../chapters/12-motors-servos-steppers/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
