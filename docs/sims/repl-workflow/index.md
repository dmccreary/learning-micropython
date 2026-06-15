---
title: REPL Workflow Diagram
description: Students can describe the Read-Evaluate-Print Loop cycle and distinguish interactive mode from script mode.
image: /sims/repl-workflow/repl-workflow.png
og:image: /sims/repl-workflow/repl-workflow.png
twitter:image: /sims/repl-workflow/repl-workflow.png
social:
   cards: false
quality_score: 0
---

# REPL Workflow Diagram

<iframe src="main.html" height="512" width="100%" scrolling="no"></iframe>

[Run the REPL Workflow Diagram MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can describe the Read-Evaluate-Print Loop cycle and distinguish interactive mode from script mode.

This interactive MicroSim supports a **Understand (L2)** learning objective: students
can **explain** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 3: MicroPython Environment and Development Tools](../../chapters/03-micropython-environment/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/repl-workflow/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 3: MicroPython Environment and Development Tools](../../chapters/03-micropython-environment/index.md).

```text
Type: diagram
**sim-id:** repl-workflow<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain
Learning Objective: Students can describe the Read-Evaluate-Print Loop cycle and distinguish interactive mode from script mode.

Canvas layout:
- Center: four labeled boxes arranged in a cycle: "Read" → "Evaluate" → "Print" → "Loop back to Read"
- Below the cycle: two side-by-side columns: "Interactive Mode" vs "Script Mode"
- Each box is clickable

Visual elements:
- Four rounded rectangles in a circular arrangement with arrows between them
- "Read": "You type a Python line and press Enter"
- "Evaluate": "The MicroPython interpreter runs the code"
- "Print": "The result appears on the >>> prompt"
- "Loop": "The prompt reappears, waiting for the next command"
- Color: active step highlighted in teal; others gray

Interactive controls:
- Clicking any box reveals a pop-up with a concrete example (e.g., clicking "Read" shows `>>> 2 + 2`)
- A "Next Step" button cycles through the four stages with highlighting
- Two toggle buttons: "Interactive Mode" and "Script Mode" — each shows a brief description in a side panel

Instructional Rationale: The four-step cycle with click-to-reveal makes the REPL loop concrete. Toggling between modes clarifies the difference between one-shot commands and stored programs.

Implementation: p5.js with four clickable rounded rects; state machine cycles through steps; createButton() for Next Step and mode toggles.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can describe the Read-Evaluate-Print Loop cycle and distinguish interactive mode from script mode.

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

1. [Chapter 3: MicroPython Environment and Development Tools](../../chapters/03-micropython-environment/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
