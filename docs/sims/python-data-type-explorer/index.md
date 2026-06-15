---
title: Python Data Type Explorer
description: Students can classify a given Python value as integer, float, string, or boolean by examining its form.
image: /sims/python-data-type-explorer/python-data-type-explorer.png
og:image: /sims/python-data-type-explorer/python-data-type-explorer.png
twitter:image: /sims/python-data-type-explorer/python-data-type-explorer.png
social:
   cards: false
quality_score: 0
---

# Python Data Type Explorer

<iframe src="main.html" height="482" width="100%" scrolling="no"></iframe>

[Run the Python Data Type Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can classify a given Python value as integer, float, string, or boolean by examining its form.

This interactive MicroSim supports a **Understand (L2)** learning objective: students
can **classify** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 1: Python Basics — Programs, Variables, Data Types, and Operators](../../chapters/01-python-basics/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/python-data-type-explorer/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 1: Python Basics — Programs, Variables, Data Types, and Operators](../../chapters/01-python-basics/index.md).

```text
Type: microsim
**sim-id:** python-data-type-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: classify
Learning Objective: Students can classify a given Python value as integer, float, string, or boolean by examining its form.

Canvas layout:
- Top row: four labeled colored boxes representing the four data types (Integer = blue, Float = green, String = orange, Boolean = purple). Each box shows the type name and a one-line description.
- Center: a large "mystery value" card showing a Python literal in large monospace font.
- Bottom: a feedback message area and a "Next Value" button.

Visual elements:
- Integer box (blue): label "Integer", description "Whole number — no decimal"
- Float box (green): label "Float", description "Number with a decimal point"
- String box (orange): label "String", description "Text inside quotation marks"
- Boolean box (purple): label "Boolean", description "Only True or False"
- Mystery value card: shows values like `42`, `3.14`, `"hello"`, `True`, `-7`, `'Pico'`, `False`, `0.5`, `"GP15"`, `-2.71`

Interactive controls:
- Four clickable type boxes. On correct click: the box glows and a message says "Correct! [value] is an integer because it has no decimal point."
- On incorrect click: the box shakes gently and a message says "Not quite — look for quotation marks, a decimal point, or True/False."
- Button: "Next Value" — loads a new mystery value from the randomized list.
- Running score display: "X correct out of Y attempts."

Data Visibility Requirements:
- Stage 1: Mystery value shown in large font.
- Stage 2: After student clicks, show the correct type name and a one-sentence reason.
- Stage 3: Show running score.

Instructional Rationale: A classify interaction at Understand level is appropriate because students must distinguish four mutually exclusive categories. Immediate corrective feedback builds the mental model without passive animation.

Values to cycle through (randomized): `42`, `3.14`, `"hello"`, `True`, `-7`, `'Pico'`, `False`, `0.5`, `100`, `"GP15"`, `False`, `-2.71`

Implementation: p5.js. Four clickable rectangles for classification. createButton() for "Next Value". Feedback text rendered below the boxes. Score tracked in a variable.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can classify a given Python value as integer, float, string, or boolean by examining its form.

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** classify

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
