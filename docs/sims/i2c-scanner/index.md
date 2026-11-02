---
title: I2C Bus Scanner
description: Watch the Pico ask every I2C address "is anyone there?" while an MPU-6050 (0x68), an HMC5883L compass (0x1E) and an SSD1306 display (0x3C) answer with an ACK.
image: /sims/i2c-scanner/i2c-scanner.png
og:image: /sims/i2c-scanner/i2c-scanner.png
twitter:image: /sims/i2c-scanner/i2c-scanner.png
social:
   cards: false
quality_score: 100
---

# I2C Bus Scanner

<iframe src="main.html" height="692px" width="100%" scrolling="no"></iframe>

[Run the I2C Bus Scanner MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Every chip on an Inter-Integrated Circuit (I2C) bus has an address. A chip never
tells the Pico its address. The Pico has to ask.

An I2C scan asks every address from `0x08` to `0x77`, one at a time. After each
address, the Pico listens for one clock pulse. A chip that owns the address pulls
the data wire (SDA) low. That is an acknowledge, or **ACK**. If nobody pulls the
wire low, the answer is a **NACK**. It means nobody lives at that address.

This MicroSim runs a scan in slow motion. The bus has three chips:

- an **MPU-6050** (accelerometer and gyroscope) at `0x68`
- an **HMC5883L** (compass) at `0x1E`
- an **SSD1306** (OLED display) at `0x3C`

You can watch the clock wire (SCL) and the data wire (SDA) for each address.
You can see the matching chip answer. You can watch the address map fill in.
When the scan ends, the console prints what `i2c-scanner.py` prints on a real Pico.

**Learning objective:** You will be able to explain how an I2C scan finds chips.
The Pico asks each address, and only the chip that owns it answers with an ACK.

- **Bloom's Taxonomy (2001):** Understand - *explain, demonstrate*
- **Interaction pattern:** step-through (Start, Step, Reset) with a plug-and-unplug experiment

## How to Use

1. Press **Step** a few times. Watch the Pico box. It shows the address it is asking about, in hex and in decimal.
2. Drag the **Speed** slider to 1 and press **Start**. Follow one address from START, through the seven address bits and the write bit, to the ACK slot.
3. Check **Pause at each ACK**, press **Start**, and let the scan run. It stops each time a chip answers.
4. Speed the scan up and let it finish. Compare the console with the colored cells in the address map.
5. Uncheck a chip to unplug it. Press **Scan again**. Predict which address will disappear before the scan gets there.

## What to Look For

- **The Pico asks. Chips answer.** Every chip box says "listening..." Only one says "ACK! That is me."
- **Addresses are numbers.** `0x1E`, `0x3C` and `0x68` are the same numbers as 30, 60 and 104. The console prints the decimal number too, like the book's `i2c-scanner.py` does.
- **The wires are shared.** All three chips hear every address. That is why two chips on one bus cannot use the same address.
- **Some addresses are skipped.** `0x00` to `0x07` and `0x78` to `0x7F` are reserved. They are gray.

## Embedding This MicroSim

You can add this MicroSim to any web page with this HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/i2c-scanner/main.html"
        height="692px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Ages 10-18. Part of [Appendix A: The I2C Bus](../../appendices/i2c-bus/index.md).

### Duration

10-15 minutes

### Prerequisites

- [Chapter 8: Communication Protocols](../../chapters/08-communication-protocols/index.md), the I2C section
- Hexadecimal numbers such as `0x68` (the appendix explains them)

### Activities

1. **Predict and step** (4 min): Students guess if address `0x09` gets an ACK. They press Step and read the status line.
2. **Slow-motion ACK** (4 min): At speed 1, students find the ACK slot in the waveform. They say who pulled the SDA wire low.
3. **Unplug experiment** (5 min): Students uncheck one chip, predict the new scan, and run it.
4. **Connect to code** (2 min): Students match each console line to the `i2c.scan()` call in `i2c-scanner.py`.

### Assessment

- The student explains why a chip does not announce its own address.
- The student reads a scan result such as `[30, 60, 104]` and names the chips.
- The student predicts the scan after a chip is unplugged.

## References

1. [UM10204: I2C-bus specification and user manual, Rev. 7.0](https://www.nxp.com/docs/en/user-guide/UM10204.pdf) - NXP, 2021
2. [MicroPython machine.I2C](https://docs.micropython.org/en/latest/library/machine.I2C.html) - describes `scan()` and its 0x08 to 0x77 range
3. [Appendix A: The I2C Bus](../../appendices/i2c-bus/index.md) - the full explanation that goes with this MicroSim
4. [Protocol Comparison Explorer](../protocol-comparison/index.md) - compares I2C, SPI and UART
5. [p5.js](https://p5js.org/) - the JavaScript library used to build this MicroSim
