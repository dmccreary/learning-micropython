---
title: Electronics Fundamentals
description: Voltage, current, resistance, Ohm's Law, LEDs, resistors, transistors, breadboards, multimeters, and wiring diagrams for safe MicroPython circuits.
generated_by: claude skill chapter-content-generator
date: 2026-06-12 22:20:00
version: 0.09
---

# Electronics Fundamentals

## Summary

Before connecting any component to your Pico, you need to understand the basic rules of electricity that keep your circuits safe and working. This chapter introduces voltage, current, resistance, and Ohm's Law — the four ideas that explain how electricity flows through every circuit you will build. You will learn about LEDs, resistors, transistors, diodes, and capacitors, and you will see how to use a solderless breadboard, jumper wires, and a multimeter. You will also learn to read wiring diagrams and schematic symbols, skills that unlock every hardware project in the rest of the course.

## Concepts Covered

This chapter covers the following 27 concepts from the learning graph:

1. Voltage
2. Current
3. Resistance
4. Ohm's Law
5. Power (Watts)
6. Series Circuit
7. Parallel Circuit
8. Short Circuit
9. Current-Limiting Resistor
10. Resistor Color Code
11. Capacitor
12. LED (Light Emitting Diode)
13. LED Forward Voltage
14. LED Forward Voltage
15. LED Current Rating
16. Transistor
17. NPN Transistor
18. MOSFET
19. Diode
20. Breadboard
21. Breadboard Rails
22. Breadboard Rows
23. Jumper Wire
24. Multimeter
25. Continuity Test
26. Wiring Diagram
27. Schematic Symbol

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Microcontrollers and Hardware Platforms](../04-microcontrollers-hardware/index.md)

---

!!! mascot-welcome "Welcome to Chapter 5"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Before we connect any hardware, we need to understand the rules of electricity. Think of this chapter as learning the traffic laws before you drive. Once you understand voltage, current, and resistance, every wiring decision in this course will make sense. Let's build something amazing!

<iframe src="../../posters/electronic-components/main.html" width="100%" height="800" scrolling="no"></iframe>

## Voltage, Current, and Resistance

Three quantities describe what electricity is doing in any circuit. A helpful analogy is water flowing through pipes.

**Voltage** (measured in **volts**, symbol **V**) is the electrical pressure that pushes electrons through a circuit. Think of it like water pressure — higher pressure pushes more water. The Pico's GPIO pins output 3.3 V. A USB port supplies 5 V.

**Current** (measured in **amperes** or **amps**, symbol **A**) is the flow rate of electrons — how many pass a point per second. Think of it like the flow rate of water in a pipe. Each GPIO pin on the Pico can safely supply a maximum of 12 mA (milliamps, or 0.012 A).

**Resistance** (measured in **ohms**, symbol **Ω**) is how much a component opposes current flow. Think of it like a narrow pipe that slows water down. Resistors are the most common component for controlling current.

### Ohm's Law

**Ohm's Law** is the fundamental equation of electronics. It connects voltage, current, and resistance:

\[ V = I \times R \]

Where **V** is voltage in volts, **I** is current in amps, and **R** is resistance in ohms. You can rearrange it to find any unknown:

\[ I = \frac{V}{R} \qquad R = \frac{V}{I} \]

**Example:** You want to connect an LED to 3.3 V. The LED needs 20 mA (0.02 A) and has a forward voltage of 2.0 V. The resistor must drop the remaining 1.3 V:

\[ R = \frac{1.3\text{ V}}{0.02\text{ A}} = 65\ \Omega \]

You would use the next standard value up: **68 Ω** or **100 Ω**.

**Power** (measured in **watts**, symbol **W**) is energy consumed per second:

\[ P = V \times I \]

A GPIO pin at 3.3 V and 12 mA delivers: \(P = 3.3 \times 0.012 = 0.04\text{ W}\) — very safe.

#### Diagram: Ohm's Law Interactive Calculator

<iframe src="../../sims/ohms-law-calculator/main.html" width="100%" height="517px" scrolling="no"></iframe>

<details markdown="1">
<summary>Ohm's Law Interactive Calculator MicroSim</summary>
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
</details>

## Series and Parallel Circuits

In a **series circuit**, components are connected end-to-end in one loop. Current has only one path. If one component breaks, the whole circuit stops.

In a **parallel circuit**, components are connected side by side, each with its own path to power and GND. Current splits between paths. If one component breaks, the others keep working.

```
Series:  3.3V → R1 → LED → GND        (same current through everything)
Parallel: 3.3V → R1 → LED1 → GND
          3.3V → R2 → LED2 → GND       (each LED has its own path)
```

A **short circuit** happens when current finds a path with almost no resistance — usually a direct wire from power to GND. Short circuits cause very high current to flow, which can damage your Pico or burn a component. Always double-check wiring before applying power.

## LEDs — Light Emitting Diodes

An **LED** (Light Emitting Diode) is a component that emits light when current flows through it in the correct direction. LEDs have two legs:

- The **anode** (longer leg) connects toward the positive supply.
- The **cathode** (shorter leg, flat side of the plastic body) connects toward GND.

Every LED has two key ratings:

- **Forward voltage** (V_f) — the voltage drop across the LED when it is on. Typical values: red 1.8–2.2 V, green/yellow 2.0–2.5 V, blue/white 3.0–3.5 V.
- **Current rating** — the current the LED needs for normal brightness. Typically 10–20 mA.

Because the Pico's 3.3 V exceeds most LED forward voltages, you must always use a **current-limiting resistor** in series with the LED to prevent burnout.

!!! mascot-warning "Always Use a Resistor with an LED!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Connecting an LED directly to a GPIO pin without a resistor lets too much current flow. Within seconds the LED dims, discolors, and burns out — and it can damage the GPIO pin too. Always use at least a 68 Ω resistor. A 330 Ω resistor is a safe conservative choice for any 3.3 V LED circuit.

### Resistor Color Code

<iframe src="../../posters/resistor-color-codes/main.html" width="100%" height="800" scrolling="no"></iframe>

Resistors are too small to print numbers on, so they use colored bands. Before reading the table, here is the key rule: the first two bands give the digits, the third band gives the multiplier (power of 10).

| Color | Digit | Multiplier |
|-------|-------|-----------|
| Black | 0 | ×1 |
| Brown | 1 | ×10 |
| Red | 2 | ×100 |
| Orange | 3 | ×1,000 |
| Yellow | 4 | ×10,000 |
| Green | 5 | ×100,000 |
| Blue | 6 | ×1,000,000 |
| Violet | 7 | — |
| Gray | 8 | — |
| White | 9 | — |
| Gold | — | ×0.1 (5% tolerance) |
| Silver | — | ×0.01 (10% tolerance) |

**Example:** Brown-Black-Red = 1-0-×100 = **1,000 Ω = 1 kΩ**.

#### Diagram: Resistor Color Code Calculator

<iframe src="../../sims/resistor-color-code-calculator/main.html" width="100%" height="542px" scrolling="no"></iframe>

Pick the color of each of the four bands and watch the resistance value update
live. Band 1 and Band 2 set the two digits, Band 3 is the multiplier, and Band 4
is the tolerance. The value is shown in ohms, kilo-ohms, and mega-ohms so the
units feel familiar.

[Run the Resistor Color Code Calculator Fullscreen](../../sims/resistor-color-code-calculator/index.md)

## Other Common Components

**Transistors** are electronic switches. A small current into the **base** controls a much larger current through the **collector** and **emitter**. You use an **NPN transistor** or a **MOSFET** to drive motors and other high-current loads that a GPIO pin cannot power directly.

**Diodes** allow current to flow in one direction only. A **flyback diode** placed across a motor absorbs the voltage spike that occurs when the motor switches off — protecting your Pico.

**Capacitors** store a small amount of electrical charge and release it quickly. They smooth out voltage spikes and act as tiny batteries for brief moments when a component draws a large burst of current.

## The Breadboard — Your Prototyping Platform

A **breadboard** (solderless breadboard) lets you build and test circuits without soldering. Components and jumper wires plug into small holes. Inside the board, rows of metal clips connect the holes electrically.

Here is how breadboard connections work:

- **Breadboard rails** — the two long rows along the top and bottom edges. One rail connects to positive power (3.3 V or 5 V); the other connects to GND. Marked with `+` and `−`.
- **Breadboard rows** — the short horizontal rows in the center (labeled a–e and f–j). All five holes in one row (a, b, c, d, e) are connected to each other. The gap in the middle separates the two halves.

**Jumper wires** are short wires with connector ends. Use them to link rows, connect to the power rails, and run wires to the Pico.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Keep your breadboard wiring neat. Use short wires when possible and route wires around components rather than over them. A tidy breadboard is much easier to debug than a tangled one. Take a photo of your working circuit before you take it apart — your future self will thank you.

## The Multimeter — Your Best Debugging Tool

A **multimeter** is a handheld meter that measures voltage, current, resistance, and continuity. Learning to use one is one of the most valuable skills in physical computing.

Key measurements you will use in this course:

- **DC Voltage (V⎓)** — measure the voltage between two points. Hold the red probe on the positive point, black probe on GND.
- **Resistance (Ω)** — measure a resistor's value with the circuit powered off.
- **Continuity test** — the multimeter beeps when two points are connected. Use this to check that wires are properly inserted in the breadboard and to verify that GPIO pin labels match actual connections.

## Reading Wiring Diagrams and Schematics

A **wiring diagram** (also called a pictorial diagram or Fritzing diagram) shows your actual components and breadboard, drawn to look like what you see on the bench. Every project in this course includes a wiring diagram.

A **schematic** uses standardized **schematic symbols** to show the same circuit more compactly and precisely. The symbol for a resistor is a zigzag line; the symbol for an LED is a triangle with a bar and arrows. Schematics focus on connections and component values, not physical appearance.

**Power supply** labeling in schematics: `VCC` or `3V3` means the positive supply; `GND` means ground. Any component connected to `GND` is electrically connected to the GND pin on your Pico.

## Key Takeaways

- **Voltage** (V) is electrical pressure; **current** (A) is flow rate; **resistance** (Ω) opposes flow.
- **Ohm's Law**: \(V = I \times R\) — use it to calculate the current-limiting resistor for an LED.
- **Series** circuits share the same current; **parallel** circuits share the same voltage.
- Always use a **current-limiting resistor** with an LED — minimum 68 Ω, safe default 330 Ω.
- **Pull-up resistors** hold pins HIGH; **pull-down resistors** hold pins LOW.
- A **breadboard** has power rails (long rows) and component rows (short rows).
- Use a **multimeter** for voltage, resistance, and continuity checks.

!!! mascot-celebration "You Understand Electricity!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now have the electronics knowledge to build safe, working circuits. Voltage, current, resistance, LEDs, resistors, and breadboards — these are the building blocks of every project ahead. In Chapter 6 you will write your first real hardware program: blinking an LED and reading a button press. The physical world is waiting — let's go!

## References

[See the Annotated References for this chapter](references.md)
