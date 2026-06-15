---
title: Prompt Engineering Workshop
description: Students can evaluate a given AI prompt for MicroPython coding and identify what details are missing to produce accurate, hardware-specific code.
image: /sims/prompt-engineering-workshop/prompt-engineering-workshop.png
og:image: /sims/prompt-engineering-workshop/prompt-engineering-workshop.png
twitter:image: /sims/prompt-engineering-workshop/prompt-engineering-workshop.png
social:
   cards: false
quality_score: 0
---

# Prompt Engineering Workshop

<iframe src="main.html" height="442" width="100%" scrolling="no"></iframe>

[Run the Prompt Engineering Workshop MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can evaluate a given AI prompt for MicroPython coding and identify what details are missing to produce accurate, hardware-specific code.

This interactive MicroSim supports a **Evaluate (L5)** learning objective: students
can **critique** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 22: Advanced Hardware Topics and AI-Assisted Coding](../../chapters/22-advanced-hardware-ai/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/prompt-engineering-workshop/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 22: Advanced Hardware Topics and AI-Assisted Coding](../../chapters/22-advanced-hardware-ai/index.md).

```text
Type: interactive
**sim-id:** prompt-engineering-workshop<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Evaluate (L5)
Bloom Verb: critique
Learning Objective: Students can evaluate a given AI prompt for MicroPython coding and identify what details are missing to produce accurate, hardware-specific code.

Canvas layout:
- Top: a text area showing a sample prompt (editable)
- Center: a checklist of prompt quality criteria (hardware specified? pins specified? behavior described? error handling requested?)
- Bottom: a "Prompt quality score" (0–10) updating live

Visual elements:
- Checklist items light up green when the prompt satisfies the criterion
- Score updates live with color (red <5, yellow 5–7, green 8–10)
- Example "bad" and "good" prompts selectable from a dropdown

Interactive controls:
- Editable text area for the prompt
- "Check prompt" button evaluates against criteria
- Dropdown: "Load example prompt" (bad, medium, good)

Instructional Rationale: Interactive prompt evaluation gives students a framework for writing effective AI prompts rather than abstract rules, building the habit of specificity.

Implementation: p5.js with createInput() for the text area; keyword detection for each criterion; score calculated from criteria count.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can evaluate a given AI prompt for MicroPython coding and identify what details are missing to produce accurate, hardware-specific code.

- **Bloom Level:** Evaluate (L5)
- **Bloom Verb:** critique

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 22: Advanced Hardware Topics and AI-Assisted Coding](../../chapters/22-advanced-hardware-ai/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
