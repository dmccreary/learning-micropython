---
title: NeoPixels and Non-Graphical Displays
description: WS2812B NeoPixels with RGB/HSV color models, rainbow animations, brightness scaling, 7-segment displays, MAX7219 LED matrices over SPI, and LCD character panels over I2C.
generated_by: claude skill chapter-content-generator
date: 2026-06-12 23:50:00
version: 0.09
---

# NeoPixels and Non-Graphical Displays

## Summary

This chapter covers two families of visual output: individually addressable NeoPixel LEDs and a range of simpler numeric and character displays. NeoPixels (WS2812B LEDs) can each show any of 16 million colors and are controlled over a single data wire — you will build rainbow patterns, color-wheel animations, and brightness-scaled effects using the RGB and HSV color models. The second half of the chapter covers non-graphical displays: 7-segment and 4-digit displays, 10-bar LED arrays, 8×8 LED matrices driven by the MAX7219 chip over SPI, and character LCD panels controlled over I2C.

## Concepts Covered

This chapter covers the following 31 concepts from the learning graph:

1. NeoPixel LED
2. WS2812B Protocol
3. NeoPixel Strip
4. NeoPixel Matrix
5. neopixel Module
6. NeoPixel.fill() Method
7. NeoPixel.show() Method
8. RGB Color Model
9. HSV Color Model
10. Color Wheel Animation
11. Rainbow Pattern
12. Brightness Scaling
13. LED Strip Wiring
14. NeoPixel Power Requirements
15. Level Shifter for NeoPixel
16. LED as Output Indicator
17. 7-Segment Display
18. 7-Segment Digit Encoding
19. 10-Bar LED Array
20. LED Level Meter
21. 8×8 LED Matrix
22. MAX7219 LED Driver
23. MAX7219 SPI Interface
24. MAX7219 Intensity Control
25. Character LCD Display
26. LCD 16×2
27. LCD PCF8574 I2C Backpack
28. lcd_api Module
29. LCD Cursor Control
30. 4-Digit 7-Segment Display
31. TM1637 Display Driver

## Prerequisites

This chapter builds on concepts from:

- [Chapter 6: Digital Input, Output, and Interrupts](../06-digital-io-interrupts/index.md)
- [Chapter 8: Communication Protocols: I2C, SPI, and UART](../08-communication-protocols/index.md)

---

!!! mascot-welcome "Welcome to Chapter 14"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Light up the world with 16 million colors! NeoPixels are one of the most satisfying components in all of physical computing — you write three numbers and a single LED glows any color you can imagine. Then we will explore the simpler but practical world of 7-segment displays, LED matrices, and character LCDs. Let's make your projects glow!

## NeoPixel LEDs — One Wire, 16 Million Colors

A **NeoPixel LED** (manufacturer name: WS2812B) is a full-color RGB LED with a tiny control chip built into its package. Each pixel contains red, green, and blue sub-LEDs, each controllable from 0 to 255. That gives 256 × 256 × 256 = 16.7 million possible colors.

The most impressive feature: NeoPixels **chain** — connect the data-out pin of one pixel to the data-in pin of the next. You can control a strip of 300 NeoPixels from a single GPIO pin by sending one long data stream.

### WS2812B Protocol

The **WS2812B protocol** is a custom 1-wire serial protocol that runs at exactly 800 kbps. The timing is so precise that MicroPython on the Pico uses the RP2040's **PIO** hardware (Chapter 22) to generate it reliably. You do not need to worry about the timing — the `neopixel` module handles it automatically.

### LED Strip Wiring

A NeoPixel strip has three wires:
- **5V** (or 3.7–5V for some strips) — power for the LEDs.
- **GND** — shared with Pico GND.
- **DIN** (Data In) — the serial data from the Pico.

Connect DIN to any Pico GPIO pin (e.g., GP0). Do NOT power a strip of more than 1–2 NeoPixels from the Pico's 3.3 V pin — use an external 5V supply or the VBUS pin.

**Level Shifter for NeoPixel**: WS2812B LEDs are 5V devices and officially require a 5V data signal. However, most work with the Pico's 3.3 V data signal when powered from 5V. If you have signal reliability issues (flickering, random colors), add a 74AHCT125 level shifter to shift the 3.3 V data up to 5 V.

**NeoPixel Power Requirements**: Each WS2812B draws up to 60 mA at full white brightness (20 mA per color channel). A strip of 30 LEDs at full white draws up to 1.8 A — use a 5V power supply rated for at least that current.

### The neopixel Module

MicroPython includes a built-in `neopixel` module:

```python
import neopixel
from machine import Pin

NUM_LEDS = 30
np = neopixel.NeoPixel(Pin(0), NUM_LEDS)
```

The `NeoPixel` object is a list of (R, G, B) tuples. Index 0 is the first LED in the chain.

```python
np[0] = (255, 0, 0)     # first LED: full red
np[1] = (0, 255, 0)     # second LED: full green
np[2] = (0, 0, 255)     # third LED: full blue
np.show()               # MUST call show() to push data to the strip
```

**`NeoPixel.fill(color)`** sets all LEDs to the same color at once:

```python
np.fill((255, 165, 0))  # all LEDs to orange
np.show()
```

**`NeoPixel.show()`** transmits the current color data to all LEDs. Nothing changes on the strip until you call `show()`. This lets you set all colors first, then update the whole strip at once for smooth animations.

## Color Models — RGB and HSV

Two color models are useful for NeoPixel programming.

**RGB (Red, Green, Blue)** is the native NeoPixel format. You specify three channels, each 0–255. The color you want is built by mixing those three primary colors.

**HSV (Hue, Saturation, Value)** is often more intuitive for animations. Hue is the color position on the color wheel (0–360°: red → yellow → green → cyan → blue → magenta → red). Saturation is how vivid the color is (0 = gray, 1 = pure color). Value is brightness (0 = off, 1 = full brightness).

To create a **rainbow pattern**, iterate hue from 0 to 360 and convert each hue to RGB. Python's `colorsys` module is not available in MicroPython, but the conversion is easy to implement:

```python
def hsv_to_rgb(h, s, v):
    """h: 0–360, s: 0–1, v: 0–1 → (r, g, b) each 0–255"""
    h /= 60
    i = int(h) % 6
    f = h - int(h)
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    r, g, b = [(v,t,p),(q,v,p),(p,v,t),(p,q,v),(t,p,v),(v,p,q)][i]
    return int(r * 255), int(g * 255), int(b * 255)

# Color wheel animation
import utime
offset = 0
while True:
    for i in range(NUM_LEDS):
        hue = (i * 360 // NUM_LEDS + offset) % 360
        np[i] = hsv_to_rgb(hue, 1.0, 0.5)
    np.show()
    offset = (offset + 1) % 360
    utime.sleep_ms(20)
```

**Brightness scaling** reduces brightness without changing color. Multiply all three RGB components by a scale factor between 0.0 and 1.0:

```python
def scale(color, factor):
    return (int(color[0]*factor), int(color[1]*factor), int(color[2]*factor))

np[0] = scale((255, 165, 0), 0.5)   # half-brightness orange
```

#### Diagram: NeoPixel Color Mixer

<iframe src="../../sims/neopixel-color-mixer/main.html" width="100%" height="477px" scrolling="no"></iframe>

<details markdown="1">
<summary>NeoPixel Color Mixer MicroSim</summary>
Type: microsim
**sim-id:** neopixel-color-mixer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: construct
Learning Objective: Students can construct a target NeoPixel color by adjusting R, G, B sliders and predict the resulting code.

Canvas layout:
- Left 50%: three vertical sliders labeled R, G, B (0–255 each) with colored fill
- Center 25%: a large circle showing the mixed color (the NeoPixel preview)
- Right 25%: the MicroPython code snippet: `np[0] = (R, G, B)` updated live

Visual elements:
- Sliders filled with the corresponding color (R slider is red-tinted, etc.)
- Circle glows with the blended color; brightness dims when all channels are low
- Code snippet updates live with current R, G, B values

Interactive controls:
- Three createSlider() controls (0–255 each)
- "Add random target color" button sets a random color as a target swatch; students try to match it

Instructional Rationale: Hands-on color mixing makes the RGB model tactile and memorable, and seeing the code update live reinforces the mapping between sliders and code.

Implementation: p5.js. Three sliders; background(r, g, b) applied to circle; code text drawn in monospace font.
</details>

## Non-Graphical Displays

Non-graphical displays show text, numbers, or simple patterns — no bitmap pixels required. They are ideal for sensor readouts, clocks, and status indicators.

### 7-Segment Displays

A **7-segment display** is a set of seven LED bar segments arranged in a figure-8 pattern, labeled a through g. By turning specific segments on or off, you can display any digit 0–9 and some letters.

**7-segment digit encoding**: each segment maps to one bit in a byte. For example, `0b00111111` (segments a,b,c,d,e,f) = the digit `0`.

Standalone 7-segment displays require one GPIO pin per segment (7 pins for one digit). For multi-digit displays, a driver chip handles the multiplexing.

### 4-Digit 7-Segment Display with TM1637

The **TM1637** is a 4-digit 7-segment display driver that communicates over a simple 2-wire protocol (CLK and DIO). A popular Python driver makes it straightforward:

```python
from tm1637 import TM1637   # driver in src/drivers/
from machine import Pin

tm = TM1637(clk=Pin(0), dio=Pin(1))
tm.number(1234)              # display "1234"
tm.numbers(12, 34)           # display "12:34" (with colon for clock display)
tm.brightness(3)             # 0=dimmest, 7=brightest
```

The **TM1637 display driver** handles all the segment encoding and multiplexing internally.

### 10-Bar LED Array — LED Level Meter

A **10-bar LED array** contains ten LEDs in a row, each a different color from green (1) through yellow (5) to red (10). Wire each LED through a resistor to a GPIO pin.

An **LED level meter** lights up a number of LEDs proportional to a sensor value — like the volume meter on old stereo equipment:

```python
bar_pins = [Pin(i, Pin.OUT) for i in range(6, 16)]  # GP6–GP15

def show_level(value, max_value=100):
    lit = int(value / max_value * 10)
    for i, pin in enumerate(bar_pins):
        pin.value(1 if i < lit else 0)
```

### 8×8 LED Matrix with MAX7219

An **8×8 LED matrix** has 64 individual LEDs arranged in a grid. Driving 64 LEDs individually would require 64 GPIO pins — far too many. The **MAX7219 LED driver** chip handles all 64 with a SPI interface: just 3 wires from the Pico (MOSI, SCK, CS).

**MAX7219 intensity control** adjusts the overall brightness of all 64 LEDs from 0 (minimum) to 15 (maximum) with a single register write.

```python
from max7219 import Matrix8x8   # driver in src/drivers/
from machine import SPI, Pin

spi = SPI(0, sck=Pin(2), mosi=Pin(3), miso=Pin(4))
cs  = Pin(5, Pin.OUT)
matrix = Matrix8x8(spi, cs, 1)   # 1 = one chained 8x8 module

matrix.brightness(3)
matrix.fill(0)
matrix.pixel(0, 0, 1)            # turn on top-left pixel
matrix.text('Hi', 0, 0, 1)      # display text (scrolling required for 8 chars)
matrix.show()
```

### Character LCD Displays — LCD 16×2

A **character LCD display** (LCD 16×2) has two rows of 16 character positions. Each position can show an ASCII character. These displays were everywhere before graphical OLED screens became affordable.

Most character LCDs use a Hitachi HD44780 controller and come with a **PCF8574 I2C backpack** that reduces the wiring from 10 GPIO pins to just two (SDA and SCL).

```python
from machine import I2C, Pin
from lcd_api import LcdApi        # driver in src/drivers/
from i2c_lcd import I2cLcd

i2c = I2C(0, scl=Pin(1), sda=Pin(0))
lcd = I2cLcd(i2c, addr=0x27, num_lines=2, num_columns=16)

lcd.putstr("Hello, World!")
lcd.move_to(0, 1)            # move cursor to row 1, column 0
lcd.putstr("MicroPython")
```

**LCD cursor control** lets you position text anywhere on the display with `move_to(col, row)`. Row 0 is the top line; row 1 is the bottom.

## Key Takeaways

- **NeoPixels (WS2812B)** chain on a single GPIO pin; each has full RGB color (0–255 per channel).
- `np.fill(color)` sets all LEDs; `np.show()` pushes the data — always call `show()` after changes.
- **RGB** specifies colors by channel intensity; **HSV** uses hue/saturation/value — better for animations.
- NeoPixels at full brightness draw up to 60 mA each — use an external 5V supply for strips.
- The **TM1637** drives a 4-digit 7-segment display over 2 wires.
- The **MAX7219** drives an 8×8 LED matrix over SPI with intensity control.
- A **character LCD** with I2C backpack uses 2 wires and the `lcd_api` + `i2c_lcd` drivers.

??? question "Quick Check: What RGB value produces yellow? (Click to reveal)"
    **`(255, 255, 0)`** — yellow is full red plus full green, with no blue. In an RGB model, yellow sits between red (255,0,0) and green (0,255,0) on the color wheel.

!!! mascot-celebration "Glowing with Success!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    From 16 million NeoPixel colors to a scrolling LED matrix to a character LCD — your Pico has a dazzling display toolkit. Chapter 15 takes you deeper into graphic display territory with OLED setup and configuration. Pixels and graphics await!

## References

[See the Annotated References for this chapter](references.md)
