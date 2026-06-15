---
title: Interactive Conditional Flowchart
description: Students can trace the execution path of an if-elif-else chain for a given input value.
image: /sims/conditional-flowchart/conditional-flowchart.png
og:image: /sims/conditional-flowchart/conditional-flowchart.png
twitter:image: /sims/conditional-flowchart/conditional-flowchart.png
social:
   cards: false
quality_score: 0
---

# Interactive Conditional Flowchart

<iframe src="main.html" height="502" width="100%" scrolling="no"></iframe>

[Run the Interactive Conditional Flowchart MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can trace the execution path of an if-elif-else chain for a given input value.

This interactive MicroSim supports a **Understand (L2)** learning objective: students
can **explain** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 2: Collections, Control Flow, Functions, and Error Handling](../../chapters/02-control-flow-functions/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/conditional-flowchart/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 2: Collections, Control Flow, Functions, and Error Handling](../../chapters/02-control-flow-functions/index.md).

```text
Type: microsim
**sim-id:** conditional-flowchart<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain
Learning Objective: Students can trace the execution path of an if-elif-else chain for a given input value.

Canvas layout:
- Left 65%: flowchart with four decision diamonds and four output rectangles
- Right 35%: slider for the input value and a result display

Visual elements:
- Diamonds: "reading < 10000?", "reading < 30000?", "reading < 50000?"
- Rectangle outputs: "Very dark", "Dim", "Bright", "Very bright"
- Active path highlighted in green; inactive paths in gray

Interactive controls:
- Slider: "Sensor reading" (0–65535, default 512). As the slider moves, the active path animates.
- Hover any diamond for a tooltip showing the Python condition and its True/False result.

Data Visibility Requirements:
- Show current value, condition checked, result (True/False), and which output fires.

Instructional Rationale: Live slider lets students see routing through an if-elif-else chain as a directed path rather than a code listing, making control flow concrete.

Implementation: p5.js. Diamonds/rectangles drawn with quad/rect; active path redrawn on slider change; createSlider() for input.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can trace the execution path of an if-elif-else chain for a given input value.

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

1. [Chapter 2: Collections, Control Flow, Functions, and Error Handling](../../chapters/02-control-flow-functions/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
