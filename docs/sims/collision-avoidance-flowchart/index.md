---
title: Collision Avoidance Logic Flowchart
description: Students can trace the control flow of a collision avoidance algorithm and predict the robot's behavior given a set of sensor inputs.
image: /sims/collision-avoidance-flowchart/collision-avoidance-flowchart.png
og:image: /sims/collision-avoidance-flowchart/collision-avoidance-flowchart.png
twitter:image: /sims/collision-avoidance-flowchart/collision-avoidance-flowchart.png
social:
   cards: false
quality_score: 0
---

# Collision Avoidance Logic Flowchart

<iframe src="main.html" height="512" width="100%" scrolling="no"></iframe>

[Run the Collision Avoidance Logic Flowchart MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can trace the control flow of a collision avoidance algorithm and predict the robot's behavior given a set of sensor inputs.

This interactive MicroSim supports a **Analyze (L4)** learning objective: students
can **trace** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 13: Robots and Mobile Systems](../../chapters/13-robots-mobile-systems/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/collision-avoidance-flowchart/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 13: Robots and Mobile Systems](../../chapters/13-robots-mobile-systems/index.md).

```text
Type: diagram
**sim-id:** collision-avoidance-flowchart<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Analyze (L4)
Bloom Verb: trace
Learning Objective: Students can trace the control flow of a collision avoidance algorithm and predict the robot's behavior given a set of sensor inputs.

Canvas layout:
- Top: distance sensor reading display (draggable slider)
- Center: animated flowchart: Read distance → Compare to threshold → Forward or Stop+Turn
- Bottom: top-down robot animation showing the chosen action

Visual elements:
- Flowchart diamonds and rectangles; active path highlighted in green
- Robot icon at bottom responds to the decision (moves forward, backs up, turns)

Interactive controls:
- createSlider() for "Distance reading" (0–100 cm); threshold line at 20 cm
- Robot animation plays the corresponding movement automatically
- Speed slider controls how fast the robot moves in the animation

Instructional Rationale: Connecting the sensor value to the active flowchart path and the robot's visible movement gives students a clear cause-effect understanding of the control loop.

Implementation: p5.js. Flowchart static; active path redrawn based on slider; robot drawn as a circle with a direction arrow, animated with translate/rotate.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can trace the control flow of a collision avoidance algorithm and predict the robot's behavior given a set of sensor inputs.

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** trace

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 13: Robots and Mobile Systems](../../chapters/13-robots-mobile-systems/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
