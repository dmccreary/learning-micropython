---
title: OLED Drawing Coordinate System
description: Students can identify any (x, y) coordinate on a 128×64 OLED display and predict which pixel will be affected by a drawing command.
image: /sims/oled-coordinate-system/oled-coordinate-system.png
og:image: /sims/oled-coordinate-system/oled-coordinate-system.png
twitter:image: /sims/oled-coordinate-system/oled-coordinate-system.png
social:
   cards: false
quality_score: 0
---

# OLED Drawing Coordinate System

<iframe src="main.html" height="432" width="100%" scrolling="no"></iframe>

[Run the OLED Drawing Coordinate System MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can identify any (x, y) coordinate on a 128×64 OLED display and predict which pixel will be affected by a drawing command.

This interactive MicroSim supports a **Remember (L1)** learning objective: students
can **identify** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 16: OLED Drawing Methods, Framebuffer, and Animation](../../chapters/16-oled-drawing-animation/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/oled-coordinate-system/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 16: OLED Drawing Methods, Framebuffer, and Animation](../../chapters/16-oled-drawing-animation/index.md).

```text
Type: diagram
**sim-id:** oled-coordinate-system<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Remember (L1)
Bloom Verb: identify
Learning Objective: Students can identify any (x, y) coordinate on a 128×64 OLED display and predict which pixel will be affected by a drawing command.

Canvas layout:
- Center: a scaled-up 128×64 grid representing the OLED display
- Hover crosshairs show the current (x, y) coordinate
- Right panel: the MicroPython command that would draw at the hovered position

Visual elements:
- Gray grid lines every 8 pixels (matching the text character grid)
- Axis labels: 0 at top-left; 127 at top-right; 63 at bottom-left
- Live crosshair follows the mouse with (x,y) shown in a tooltip

Interactive controls:
- Click to "draw" a pixel — it stays lit
- createButton() "Clear" resets all drawn pixels
- Dropdown to select drawing mode: pixel, text, line, rect

Instructional Rationale: A large interactive grid makes the abstract coordinate system concrete. Students can click to place pixels and see the code before writing any hardware programs.

Implementation: p5.js. 128×64 array stores pixel state; mouse position mapped to grid coords; code snippet updates in right panel.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can identify any (x, y) coordinate on a 128×64 OLED display and predict which pixel will be affected by a drawing command.

- **Bloom Level:** Remember (L1)
- **Bloom Verb:** identify

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 16: OLED Drawing Methods, Framebuffer, and Animation](../../chapters/16-oled-drawing-animation/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
