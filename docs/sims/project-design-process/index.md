---
title: Project Design Process Flowchart
description: Students can apply the seven-step project design process to plan an original capstone project, identifying requirements, components, and code structure before building.
image: /sims/project-design-process/project-design-process.png
og:image: /sims/project-design-process/project-design-process.png
twitter:image: /sims/project-design-process/project-design-process.png
social:
   cards: false
quality_score: 0
---

# Project Design Process Flowchart

<iframe src="main.html" height="492" width="100%" scrolling="no"></iframe>

[Run the Project Design Process Flowchart MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can apply the seven-step project design process to plan an original capstone project, identifying requirements, components, and code structure before building.

This interactive MicroSim supports a **Create (L6)** learning objective: students
can **design** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 23: Applied Learning and Capstone Projects](../../chapters/23-applied-learning-projects/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/project-design-process/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 23: Applied Learning and Capstone Projects](../../chapters/23-applied-learning-projects/index.md).

```text
Type: diagram
**sim-id:** project-design-process<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Create (L6)
Bloom Verb: design
Learning Objective: Students can apply the seven-step project design process to plan an original capstone project, identifying requirements, components, and code structure before building.

Canvas layout:
- Seven labeled boxes in a flowchart: Requirements → Components → BOM → Prototype → Wiring Diagram → Code Organization → Documentation
- Arrows between boxes; each box clickable to reveal a checklist

Visual elements:
- Active step highlighted in green when clicked
- Each step's checklist appears in a right-side panel with checkboxes the student can tick
- Progress bar at the top showing completion (steps ticked ÷ total steps)

Interactive controls:
- Click any step box to see its checklist
- Checkboxes are persistent for the session
- "Print checklist" button opens a text summary of all checked items

Instructional Rationale: An interactive checklist version of the design process gives students a concrete scaffold for capstone planning rather than an abstract description.

Implementation: p5.js with seven clickable rect boxes; createCheckbox() for each checklist item; JSON data structure for all checklist items by step.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can apply the seven-step project design process to plan an original capstone project, identifying requirements, components, and code structure before building.

- **Bloom Level:** Create (L6)
- **Bloom Verb:** design

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 23: Applied Learning and Capstone Projects](../../chapters/23-applied-learning-projects/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
