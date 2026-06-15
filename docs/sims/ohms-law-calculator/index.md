---
title: Ohm's Law Interactive Calculator
description: Students can apply Ohm's Law to calculate the required current-limiting resistor value for an LED circuit.
image: /sims/ohms-law-calculator/ohms-law-calculator.png
og:image: /sims/ohms-law-calculator/ohms-law-calculator.png
twitter:image: /sims/ohms-law-calculator/ohms-law-calculator.png
social:
   cards: false
quality_score: 0
---

# Ohm's Law Interactive Calculator

<iframe src="main.html" height="517" width="100%" scrolling="no"></iframe>

[Run the Ohm's Law Interactive Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can apply Ohm's Law to calculate the required current-limiting resistor value for an LED circuit.

This interactive MicroSim supports a **Apply (L3)** learning objective: students
can **calculate** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 5: Electronics Fundamentals](../../chapters/05-electronics-fundamentals/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/ohms-law-calculator/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 5: Electronics Fundamentals](../../chapters/05-electronics-fundamentals/index.md).

```text
Type: microsim
**sim-id:** ohms-law-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: calculate
Learning Objective: Students can apply Ohm's Law to calculate the required current-limiting resistor value for an LED circuit.

Canvas layout:
- Left 50%: a simple circuit diagram: 3.3V supply → resistor → LED → GND. Animated current arrows flow along the wire.
- Right 50%: three sliders: "Supply Voltage" (1–5 V), "LED Forward Voltage" (1.5–3.5 V), "LED Current" (5–30 mA). Below the sliders: calculated R value in a large result box; also shows power in mW.

Visual elements:
- Circuit diagram with labeled supply voltage, resistor, LED (triangle+bar schematic symbol)
- Resistor value displayed on the resistor body in the diagram (updates live)
- Arrows animate along the wire at a speed proportional to current

Interactive controls:
- Three createSlider() controls. All values update live.
- Result box: "Required resistor: 68 Ω (standard value)" — snaps to nearest E12 series value

Data Visibility Requirements:
- Show: supply V, LED forward V, voltage drop across resistor, current, calculated R, standard R, power dissipated

Instructional Rationale: Real-time calculation with animated circuit gives immediate feedback on how changing one variable affects the others, making the formula physical rather than abstract.

Implementation: p5.js with three sliders; R = (V_supply - V_led) / I_led; round to nearest E12 standard value; wire-flow animation with particle objects.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can apply Ohm's Law to calculate the required current-limiting resistor value for an LED circuit.

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

1. [Chapter 5: Electronics Fundamentals](../../chapters/05-electronics-fundamentals/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
