---
title: E-Paper vs TFT vs OLED Comparison
description: Students can select the appropriate display technology (OLED, TFT, e-paper) for a given set of project requirements (power, color, refresh rate, readability).
image: /sims/display-technology-comparison/display-technology-comparison.png
og:image: /sims/display-technology-comparison/display-technology-comparison.png
twitter:image: /sims/display-technology-comparison/display-technology-comparison.png
social:
   cards: false
quality_score: 0
---

# E-Paper vs TFT vs OLED Comparison

<iframe src="main.html" height="482" width="100%" scrolling="no"></iframe>

[Run the E-Paper vs TFT vs OLED Comparison MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can select the appropriate display technology (OLED, TFT, e-paper) for a given set of project requirements (power, color, refresh rate, readability).

This interactive MicroSim supports a **Analyze (L4)** learning objective: students
can **compare** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 17: Color Displays and E-Paper Screens](../../chapters/17-color-epaper-displays/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/display-technology-comparison/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 17: Color Displays and E-Paper Screens](../../chapters/17-color-epaper-displays/index.md).

```text
Type: diagram
**sim-id:** display-technology-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Analyze (L4)
Bloom Verb: compare
Learning Objective: Students can select the appropriate display technology (OLED, TFT, e-paper) for a given set of project requirements (power, color, refresh rate, readability).

Canvas layout:
- Three columns: OLED | TFT | E-Paper
- Five rows of comparison attributes: Color, Power, Refresh rate, Outdoor visibility, Typical use
- At the bottom: a "Project match" tool

Visual elements:
- Each column headed by a stylized mini display icon
- Attribute cells color-coded: green = best, yellow = acceptable, red = worst
- Hover over any cell reveals a tooltip with exact figures

Interactive controls:
- Checkboxes for project requirements: "Battery powered", "Needs color", "Fast animation", "Outdoor use"
- "Best match" button highlights the recommended display type based on checked requirements

Instructional Rationale: Comparing three technologies in a structured matrix with a recommendation engine helps students make informed hardware choices rather than defaulting to whatever is in the kit.

Implementation: p5.js. Grid layout; createCheckbox() for requirements; recommendation algorithm checks boxes vs. category scores.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can select the appropriate display technology (OLED, TFT, e-paper) for a given set of project requirements (power, color, refresh rate, readability).

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** compare

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 17: Color Displays and E-Paper Screens](../../chapters/17-color-epaper-displays/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
