---
title: Resistor Color Code Calculator
description: Interactive p5.js MicroSim where students pick the color of each of the four bands on a resistor and watch the resistance value update live in ohms, kilo-ohms, and mega-ohms.
image: /sims/resistor-color-code-calculator/resistor-color-code-calculator.png
og:image: /sims/resistor-color-code-calculator/resistor-color-code-calculator.png
twitter:image: /sims/resistor-color-code-calculator/resistor-color-code-calculator.png
social:
   cards: false
quality_score: 0
---

# Resistor Color Code Calculator

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Resistor Color Code Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the Resistor Color Code Calculator MicroSim Using the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/M1WMd5GZF)

## About This MicroSim

Real resistors are too small to print numbers on, so they use colored bands
instead. This MicroSim lets you pick the color of each of the four bands and
instantly see what value that resistor would have.

A horizontal resistor is drawn across the top of the screen. Below it are four
columns of radio buttons — one column for each band — with every color choice
visible at once and a matching color swatch next to each name.

- **Band 1** sets the **first digit**.
- **Band 2** sets the **second digit**.
- **Band 3** is the **multiplier** — how many times to multiply the two digits (a power of ten).
- **Band 4** is the **tolerance** — how far the real value may be from the printed value.

As you change any band, the resistor picture and the value update right away.
The value is shown three ways so the units feel familiar: a short form like
**1 kΩ**, the full name **1 kilo-ohm**, and the plain number **1,000 ohms**.

## How to Use

1. Look at the resistor at the top. The default colors are **Brown – Black – Red – Gold**.
2. Read the value below the resistor: **1 kΩ = 1 kilo-ohm = 1,000 ohms, ±5% tolerance**.
3. Try changing **Band 1** to **Red**. The first digit becomes 2, so the value jumps.
4. Change **Band 3** (the multiplier) from **Red** to **Orange** and watch the value grow by a factor of ten — small numbers turn into kilo-ohms, big ones into mega-ohms.
5. Try to build a **220 Ω** resistor (Red – Red – Brown) and a **4.7 kΩ** resistor (Yellow – Violet – Red).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/resistor-color-code-calculator/main.html"
        height="542px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Grades 5-12. The primary audience is curious beginners around age 10.

### Duration
10-15 minutes

### Prerequisites

- Knows that resistance is measured in **ohms (Ω)**.
- Has seen the resistor color code table in Chapter 5.
- Understands place value (ones, tens) and multiplying by powers of ten.

### Learning Objective

Students can **apply** the resistor color code to read the value of a four-band
resistor and express that value in ohms, kilo-ohms, or mega-ohms.

### Activities

1. **Exploration** (5 min): Let students freely change bands and watch the value. Ask: "Which band makes the biggest change to the value? Why?" (The multiplier band.)
2. **Guided Practice** (5 min): Call out values — 330 Ω, 1 kΩ, 10 kΩ, 1 MΩ — and have students set the bands to match.
3. **Assessment** (5 min): Show a photo or drawing of a real resistor and ask students to predict its value before checking it in the MicroSim.

### Assessment

- Can the student name what each of the four bands controls?
- Given three band colors, can the student calculate the resistance before using the tool?
- Can the student convert between ohms, kilo-ohms, and mega-ohms correctly?

## References

1. [Resistor Color Code — Chapter 5: Electronics Fundamentals](../../chapters/05-electronics-fundamentals/index.md)
2. [Electronic Color Code — Wikipedia](https://en.wikipedia.org/wiki/Electronic_color_code)
