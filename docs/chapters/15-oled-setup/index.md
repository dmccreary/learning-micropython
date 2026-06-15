---
title: OLED Display Setup and Configuration
description: Wiring SSD1306 and SH1106 OLED displays via I2C and SPI, installing driver modules, initializing 128×64 and 128×32 displays, and verifying a working connection.
generated_by: claude skill chapter-content-generator
date: 2026-06-13 00:00:00
version: 0.09
---

# OLED Display Setup and Configuration

## Summary

OLED displays are small, sharp, low-power screens that are perfect for showing sensor readings, menus, and graphics on your Pico projects. This chapter covers everything you need to get an OLED working: the two most common controller chips (SSD1306 and SH1106), how to wire them using I2C or SPI, the different resolution options (128×64 and 128×32), and how to install and import the `ssd1306` and `sh1106` driver modules. By the end of this chapter your display will be powered on, initialized, and ready for the drawing commands taught in the next chapter.

## Concepts Covered

This chapter covers the following 13 concepts from the learning graph:

1. OLED Display
2. OLED SSD1306 Controller
3. SSD1306 I2C Interface
4. SSD1306 SPI Interface
5. SSD1306 128×64 Resolution
6. SSD1306 128×32 Resolution
7. ssd1306 Module
8. SSD1306_I2C Class
9. SSD1306_SPI Class
10. OLED SH1106 Controller
11. SH1106 I2C Interface
12. sh1106 Module
13. OLED SSD1352 Controller

## Prerequisites

This chapter builds on concepts from:

- [Chapter 8: Communication Protocols: I2C, SPI, and UART](../08-communication-protocols/index.md)

---

!!! mascot-welcome "Welcome to Chapter 15"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A tiny screen that shows whatever your Pico is thinking — sensor readings, menus, graphics, game levels. OLED displays are one of the most satisfying additions to any project. In this chapter we wire the display up and prove it works. Chapter 16 then teaches you to draw on it. Let's get the screen glowing!

## What Is an OLED Display?

An **OLED display** (Organic Light-Emitting Diode) is a flat screen where each pixel produces its own light. Unlike an LCD, an OLED has no backlight — pixels that show black are simply off, saving power. OLED displays are sharp, high-contrast, and consume very little power, making them ideal for battery-powered Pico projects.

The OLED displays used in this course are monochrome (black and white, or sometimes black and yellow/blue). The most common sizes are:

- **128×64 pixels** — the standard size (about 1 inch diagonal, 0.96 inches is common).
- **128×32 pixels** — smaller and narrower; useful when vertical space is limited.

## OLED Controller Chips

The display itself is passive — it needs a **controller chip** to receive commands from the Pico and convert them into voltages for each pixel. Two controllers dominate the beginner market.

### SSD1306

The **SSD1306** is the most common OLED controller. It supports 128×64 and 128×32 pixel displays. MicroPython includes the `ssd1306` module built-in (no file to copy for most firmware builds).

The SSD1306 communicates via **I2C** or **SPI**. I2C needs only two wires (plus power); SPI needs four but allows faster display updates.

### SH1106

The **SH1106** is a slightly different controller, physically similar to the SSD1306 but incompatible — it requires a different driver. Many 1.3-inch OLED modules (the larger of the common sizes) use SH1106 internally even if the package does not say so. If your SSD1306 code shows random noise or shifted images on a 1.3-inch display, try the SH1106 driver.

The **SH1106 I2C interface** works the same way as SSD1306 I2C from your code's perspective, but you must import the `sh1106` module instead.

### SSD1352

The **OLED SSD1352 controller** drives larger, color OLED displays. It is less common for beginners but worth knowing exists. This course focuses on the SSD1306 and SH1106 for the 128×64 monochrome displays.

## Installing the Driver Modules

For the SSD1306, MicroPython firmware for the Pico often includes `ssd1306` built-in. Verify by running in the REPL:

```python
import ssd1306
```

If you get `ImportError: no module named 'ssd1306'`, copy `ssd1306.py` from `src/drivers/` to your Pico.

For the SH1106, copy `sh1106.py` from `src/drivers/` to your Pico:

```bash
mpremote cp src/drivers/sh1106.py :sh1106.py
```

## Wiring an SSD1306 OLED via I2C

The most common OLED breakout boards have four pins: VCC, GND, SCL, SDA.

```
OLED VCC → Pico 3V3 (pin 36)
OLED GND → Pico GND (pin 38)
OLED SDA → Pico GP0 (I2C0 SDA)
OLED SCL → Pico GP1 (I2C0 SCL)
```

!!! mascot-warning "3.3 V Only — Never Connect to VBUS!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    These OLED modules run at **3.3 V**. Connecting VCC to the 5 V VBUS pin will immediately destroy the display. Always use the Pico's **3V3** (3.3 V) output pin for OLED power.

### Initializing SSD1306 over I2C

```python
from machine import I2C, Pin
from ssd1306 import SSD1306_I2C

i2c = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)

# Verify the display is found
devices = i2c.scan()
print("I2C devices:", [hex(d) for d in devices])
# Should print: I2C devices: ['0x3c']

WIDTH  = 128
HEIGHT = 64   # or 32 for the smaller display

oled = SSD1306_I2C(WIDTH, HEIGHT, i2c)

oled.fill(0)             # clear the screen (0 = black)
oled.text("Hello!", 0, 0)  # draw text at (x=0, y=0)
oled.show()              # push framebuffer to display
```

The **`SSD1306_I2C` class** takes three required arguments:

- `width` — pixel width of the display (128 for standard OLED)
- `height` — pixel height (64 or 32)
- `i2c` — an initialized `I2C` object

The default I2C address is `0x3C`. If your display responds at `0x3D`, pass it as the fourth argument: `SSD1306_I2C(128, 64, i2c, addr=0x3D)`.

## Wiring an SSD1306 OLED via SPI

Some OLED modules expose SPI pins: SDA (MOSI), SCL (CLK), DC (Data/Command), RST (Reset), CS (Chip Select).

```
OLED VCC → Pico 3V3
OLED GND → Pico GND
OLED SDA → Pico GP3 (SPI0 MOSI)
OLED SCL → Pico GP2 (SPI0 SCK)
OLED DC  → Pico GP8
OLED RST → Pico GP9
OLED CS  → Pico GP10
```

```python
from machine import SPI, Pin
from ssd1306 import SSD1306_SPI

spi = SPI(0, baudrate=10_000_000, sck=Pin(2), mosi=Pin(3), miso=Pin(4))
dc  = Pin(8,  Pin.OUT)
rst = Pin(9,  Pin.OUT)
cs  = Pin(10, Pin.OUT)

oled = SSD1306_SPI(128, 64, spi, dc, rst, cs)

oled.fill(0)
oled.text("SPI OLED!", 0, 0)
oled.show()
```

The **`SSD1306_SPI` class** takes six arguments: width, height, spi object, DC pin, reset pin, and CS pin. SPI OLED updates are faster than I2C — noticeable when animating graphics.

## Initializing the SH1106 via I2C

If you have a 1.3-inch OLED or a display that behaves strangely with the SSD1306 driver, try the **`sh1106` module**:

```python
from machine import I2C, Pin
from sh1106 import SH1106_I2C

i2c = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)
oled = SH1106_I2C(128, 64, i2c, rotate=0)

oled.fill(0)
oled.text("SH1106 OK!", 0, 0)
oled.show()
```

The `sh1106` driver API is nearly identical to `ssd1306`. The `rotate` parameter accepts 0 or 180 to flip the display upside down.

## Troubleshooting Your OLED

Before testing drawing commands, verify the display is working:

1. **Run `i2c.scan()`** — the OLED should appear as `0x3C` or `0x3D`. If the list is empty, check your wiring.
2. **Fill the screen white** — `oled.fill(1); oled.show()`. If you see all pixels lit, your display works. If only some pixels light, the width/height mismatch your actual display size.
3. **Draw text** — `oled.text("Test", 0, 0); oled.show()`. If text appears at the wrong position or is shifted horizontally, you may need the SH1106 driver instead of SSD1306.
4. **Check power** — A dim or flickering display may be underpowered. Use a shorter, thicker USB cable.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Many OLED displays are sold as "SSD1306" but actually contain SH1106 controllers. The easiest way to tell: if `oled.text("ABC", 0, 0)` with the SSD1306 driver shows the text shifted about 2 pixels to the right compared to the display edge, swap to the SH1106 driver. The SH1106 has a slightly different internal column offset.

#### Diagram: OLED Wiring Configuration

<iframe src="../../sims/oled-wiring-guide/main.html" width="100%" height="472px" scrolling="no"></iframe>

<details markdown="1">
<summary>OLED Wiring Configuration Guide MicroSim</summary>
Type: diagram
**sim-id:** oled-wiring-guide<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: connect
Learning Objective: Students can correctly identify which OLED pin connects to which Pico pin for both I2C and SPI configurations.

Canvas layout:
- Left: stylized OLED module with labeled pins (VCC, GND, SDA/SCL or SPI pins)
- Center: breadboard with connecting wires color-coded by function (red=power, black=GND, yellow=data, blue=clock)
- Right: stylized Pico top-down view with labeled GPIO pins

Visual elements:
- Wire colors: red=VCC, black=GND, yellow=SDA/MOSI, blue=SCL/CLK
- Toggle at the top switches between I2C wiring and SPI wiring
- Moused-over wire lights up and shows a tooltip: "SDA → GP0 (I2C SDA)"

Interactive controls:
- createButton() toggle: "I2C mode" / "SPI mode" — updates the wiring diagram
- Click any wire to see the connection label in a pop-up

Instructional Rationale: Seeing the actual wiring with color-coded wires reduces physical assembly errors, one of the most common beginner frustrations.

Implementation: p5.js. OLED and Pico drawn as labeled rectangles; lines drawn between them; mouse hover detection via dist() to wire endpoints.
</details>

## Key Takeaways

- **OLED displays** emit their own light — no backlight, high contrast, low power.
- **SSD1306** is the most common controller for 128×64 displays; built into most MicroPython firmware.
- **SH1106** is an alternative controller used in some 1.3-inch displays; requires a separate driver.
- OLED displays use **3.3 V** — never connect to 5 V.
- Use `I2C.scan()` to verify the OLED is detected at `0x3C` before writing any code.
- `SSD1306_I2C(128, 64, i2c)` creates the display object; `oled.show()` pushes pixels to the screen.
- SPI OLED is faster than I2C — use SPI for animated graphics.

??? question "Quick Check: Why must you call oled.show() after drawing? (Click to reveal)"
    All drawing commands modify an in-memory **framebuffer** — they do not immediately affect the physical display. `show()` copies the entire framebuffer to the display hardware. This batching approach allows you to build a complete frame before any pixels change, preventing visible flickering mid-draw.

!!! mascot-celebration "Display Online!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your OLED is initialized, powered on, and showing text — hardware setup complete! Chapter 16 is where the real graphic fun begins: lines, rectangles, circles, custom fonts, animations, and the framebuffer model. Your screen is ready. Let's draw!

## References

[See the Annotated References for this chapter](references.md)
