---
title: Blocking vs Non-Blocking Timeline
description: Students can explain why blocking code misses events and predict whether a non-blocking pattern will detect a button press during a timing gap.
image: /sims/blocking-vs-nonblocking/blocking-vs-nonblocking.png
og:image: /sims/blocking-vs-nonblocking/blocking-vs-nonblocking.png
twitter:image: /sims/blocking-vs-nonblocking/blocking-vs-nonblocking.png
social:
   cards: false
quality_score: 0
---

# Blocking vs Non-Blocking Timeline

<iframe src="main.html" height="497" width="100%" scrolling="no"></iframe>

[Run the Blocking vs Non-Blocking Timeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can explain why blocking code misses events and predict whether a non-blocking pattern will detect a button press during a timing gap.

This interactive MicroSim supports a **Understand (L2)** learning objective: students
can **compare** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 20: Timers, Timing Functions, and Multi-Core Programming](../../chapters/20-timers-multicore/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/blocking-vs-nonblocking/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 20: Timers, Timing Functions, and Multi-Core Programming](../../chapters/20-timers-multicore/index.md).

```text
Type: diagram
**sim-id:** blocking-vs-nonblocking<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: compare
Learning Objective: Students can explain why blocking code misses events and predict whether a non-blocking pattern will detect a button press during a timing gap.

Canvas layout:
- Left timeline: "Blocking" program — long gray blocks (sleep) alternating with short action blocks
- Right timeline: "Non-blocking" program — continuous green loop tick marks; action blocks at the right intervals
- Below timelines: a button press event marker that the user can drag left/right

Visual elements:
- Blocking: button press during a sleep block is shown as "MISSED" in red
- Non-blocking: button press between tick marks is detected within one loop cycle
- Comparison stat: max response latency shown for each approach

Interactive controls:
- createSlider() for "sleep duration" (100–2000 ms)
- createSlider() for "button press time" (drag to set when the button fires)
- "Play animation" button runs a 5-second simulation

Instructional Rationale: Seeing a missed button press in the blocking timeline makes the problem visceral rather than theoretical, motivating the non-blocking approach.

Implementation: p5.js. Two timeline tracks drawn as horizontal strips; sleep periods as gray rectangles; button press as a vertical arrow the user can drag.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can explain why blocking code misses events and predict whether a non-blocking pattern will detect a button press during a timing gap.

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

1. [Chapter 20: Timers, Timing Functions, and Multi-Core Programming](../../chapters/20-timers-multicore/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
