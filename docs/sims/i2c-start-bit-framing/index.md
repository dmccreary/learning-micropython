---
title: I2C Start Bit and Address Framing
description: Step through a real I2C transaction between a controller, an EEPROM at 0x50 and an LCD backpack at 0x27 to see why the start bit lets each device tell its own address apart from data meant for someone else.
image: /sims/i2c-start-bit-framing/i2c-start-bit-framing.png
og:image: /sims/i2c-start-bit-framing/i2c-start-bit-framing.png
twitter:image: /sims/i2c-start-bit-framing/i2c-start-bit-framing.png
social:
   cards: false
quality_score: 0
---

# I2C Start Bit and Address Framing

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the I2C Start Bit and Address Framing MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Two chips share the same two I2C wires: an EEPROM at address `0x50` and an
LCD backpack at address `0x27`. The controller writes a 16-bit memory
address to the EEPROM (two bytes: `0x12` and `0x34`), then reads one byte
back. Step through all 13 bus events one at a time and watch:

- the **bus frame** (start bit, address, ACKs, data, repeated start, stop)
- whether each device is **listening**, has **matched** its own address, or
  is **ignoring** the bus because the address wasn't its own
- the matching line of **driver pseudocode** that produces each bus event
- a plain-language caption explaining what just happened and why

The central idea this MicroSim makes concrete: a device only compares an
incoming byte to its own address **immediately after a start bit** (or a
repeated start). Every byte after that — including the EEPROM's two memory
address bytes, `0x12` and `0x34` — is just data to whichever device already
matched. The LCD stopped listening the moment the first address byte didn't
match it, so it can never mistake the EEPROM's internal memory address for
its own 7-bit address, even if the numbers happened to collide.

## How to Use

1. Press **Next** (or **Play** to auto-advance) to step through the 13 bus
   events one at a time.
2. Watch the two device panels. The EEPROM panel shows it matching,
   acknowledging, receiving the two address bytes, and sending data. The LCD
   panel shows it going silent right after step 2 and staying silent — even
   while `0x12` and `0x34` cross the bus — until the repeated start at step 7
   wakes it up to check the address again.
3. Read the highlighted line in the code panel alongside the caption below
   it. Each line of the "driver pseudocode" is exactly one event on the bus.
4. Drag the slider to scrub back and forth, or press **Reset** to start over.

### Discussion Questions

1. Why doesn't the LCD get confused when the EEPROM's memory address byte
   `0x12` crosses the bus? What would have to happen for it to listen again?
2. What is the difference between a **STOP** and a **repeated START**? Why
   does the code here use a repeated start instead of a stop before reading?
3. If the EEPROM's memory address happened to equal `0x27` (the LCD's
   address), would the LCD respond to it? Why or why not?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/i2c-start-bit-framing/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
5-12 (Learning MicroPython)

### Duration
10-15 minutes

### Prerequisites

- [Appendix A: The I2C Bus](../../appendices/i2c-bus/index.md) — addresses, ACKs, and how the bus takes turns
- Familiarity with hexadecimal and binary notation (a byte, bit shifting)

### Activities

1. **Exploration** (5 min): Students press Next through all 13 steps once,
   without reading the captions, and write down in their own words when they
   think the LCD is "listening" versus "ignoring".
2. **Guided Practice** (5 min): Re-run the steps reading each caption aloud.
   Pause at step 2 (first ACK) and step 7 (repeated start) — the two moments
   that answer "why doesn't the LCD get confused?"
3. **Assessment** (5 min): Answer the three discussion questions above,
   referencing specific step numbers from the MicroSim.

### Assessment

- Can the student state, in one sentence, when a device checks an incoming
  byte against its own address (answer: only right after a start or repeated
  start)?
- Can the student explain why the EEPROM's two memory-address bytes cannot
  be mistaken for an I2C device address by any other chip on the bus?

## References

1. [Appendix A: The I2C Bus](../../appendices/i2c-bus/index.md) — this project's own I2C reference chapter.
2. [I2C-bus specification, NXP/Philips](https://www.nxp.com/docs/en/user-guide/UM10204.pdf) — the original protocol specification; see the sections on START/STOP conditions and acknowledge.
3. [I2C Scanner MicroSim](../i2c-scanner/index.md) — scanning a bus to discover which addresses respond.
4. [I2C Collision-Avoidance Robot MicroSim](../i2c-collision-avoidance/index.md) — a continuous-time I2C sensor-read example, for contrast with this step-through one.
