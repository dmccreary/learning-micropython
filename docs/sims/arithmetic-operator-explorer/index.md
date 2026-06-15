---
title: Arithmetic Operator Explorer
description: Students can apply the six Python arithmetic operators to compute results and predict outputs for given inputs.
image: /sims/arithmetic-operator-explorer/arithmetic-operator-explorer.png
og:image: /sims/arithmetic-operator-explorer/arithmetic-operator-explorer.png
twitter:image: /sims/arithmetic-operator-explorer/arithmetic-operator-explorer.png
social:
   cards: false
quality_score: 0
---

# Arithmetic Operator Explorer

<iframe src="main.html" height="497" width="100%" scrolling="no"></iframe>

[Run the Arithmetic Operator Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can apply the six Python arithmetic operators to compute results and predict outputs for given inputs.

This interactive MicroSim supports a **Apply (L3)** learning objective: students
can **calculate** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 1: Python Basics — Programs, Variables, Data Types, and Operators](../../chapters/01-python-basics/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/arithmetic-operator-explorer/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 1: Python Basics — Programs, Variables, Data Types, and Operators](../../chapters/01-python-basics/index.md).

```text
Type: microsim
**sim-id:** arithmetic-operator-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: calculate
Learning Objective: Students can apply the six Python arithmetic operators to compute results and predict outputs for given inputs.

Canvas layout:
- Top area: Two sliders labeled "Number A" (range 0–20, default 10) and "Number B" (range 1–20, default 3, minimum 1 to prevent division by zero).
- Middle area: A 2×3 grid of six operator buttons: `+`, `-`, `*`, `/`, `//`, `%`. The currently selected operator is highlighted in a bright accent color.
- Bottom area: A result card showing the full Python expression and computed result in large monospace font. Below the result: a one-sentence plain-English explanation of the operator. For `//` and `%`, also show a pizza-sharing analogy: "10 pizza slices shared by 3 people: each person gets 3 slices (//), with 1 left over (%)."

Interactive controls:
- createSlider() for Number A and Number B. Values update live as sliders move.
- createButton() for each operator. Clicking selects that operator and recalculates immediately.

Default state: A = 10, B = 3, operator = `+`, showing `10 + 3 = 13`.

Data Visibility Requirements:
- Stage 1: Show A, B, and the selected operator.
- Stage 2: Show the full Python expression: `A op B = result`.
- Stage 3: Show a plain-English explanation and (for `//`/`%`) the pizza analogy.

Instructional Rationale: Slider-driven Apply-level exploration lets students verify mental predictions immediately. Showing the expression alongside the plain-English explanation bridges symbolic notation and meaning. The pizza analogy makes floor division and modulo concrete for 10-year-olds.

Implementation: p5.js with createSlider() and createButton(). Result displayed as large centered text with explanation below. Operator buttons styled as colored rounded rectangles; selected one gets a distinct border highlight.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can apply the six Python arithmetic operators to compute results and predict outputs for given inputs.

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

1. [Chapter 1: Python Basics — Programs, Variables, Data Types, and Operators](../../chapters/01-python-basics/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
