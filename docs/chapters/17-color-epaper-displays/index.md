---
title: Color Displays and E-Paper Screens
description: ILI9341 and ST7789V full-color TFT displays over SPI, RGB565 color depth, screen coordinate systems, e-paper e-ink technology, refresh rate, low-power design, and Waveshare drivers.
generated_by: claude skill chapter-content-generator
date: 2026-06-13 00:20:00
version: 0.09
---

# Color Displays and E-Paper Screens

## Summary

This chapter moves beyond black-and-white OLED screens to full-color TFT LCD displays and ultra-low-power e-paper screens. You will work with two popular TFT controllers — the ILI9341 (240×320 pixels) and the ST7789V (240×240 pixels) — both driven over SPI, and you will learn about 16-bit RGB565 color depth and the screen coordinate system. The chapter also introduces e-paper (e-ink) displays, which only consume power when the image changes, making them ideal for battery-powered projects that display slowly updating information like weather data or labels.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. TFT Display
2. ILI9341 TFT Driver
3. ILI9341 SPI Interface
4. ILI9341 Color Depth (16-bit)
5. ST7789V Color LCD Driver
6. ST7789V SPI Interface
7. ST7789V Resolution
8. Graphic LCD (CU1609C)
9. Waveshare LCD
10. Screen Coordinate System
11. HSTX Display Interface
12. Display Color Formats
13. E-Paper Display
14. E-Ink Technology
15. E-Paper Refresh Rate
16. E-Paper Low Power
17. E-Paper SPI Interface
18. Waveshare E-Paper Driver

## Prerequisites

This chapter builds on concepts from:

- [Chapter 8: Communication Protocols: I2C, SPI, and UART](../08-communication-protocols/index.md)
- [Chapter 16: OLED Drawing Methods, Framebuffer, and Animation](../16-oled-drawing-animation/index.md)

---

!!! mascot-welcome "Welcome to Chapter 17"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Black and white is so Chapter 16! In this chapter your Pico drives a full-color screen — every pixel can be any of 65,536 colors. Then we explore the other extreme: e-paper displays that use almost no power and look like printed ink on paper. Two very different technologies, both extremely useful!

## TFT Displays — Full Color Over SPI

A **TFT display** (Thin-Film Transistor display) is a full-color LCD screen where each pixel has its own transistor for precise control. Unlike OLED (which emits its own light), a TFT LCD has a white backlight behind it. TFT displays are brighter and cheaper for larger sizes, but use more power than OLEDs.

The controller chip (ILI9341 or ST7789V) receives pixel data over SPI and drives the actual LCD panel.

### Display Color Formats and RGB565

Before we look at the controllers, we need to understand color formats.

The OLED displays from Chapters 15–16 were monochrome: each pixel is either on (1) or off (0). Color displays need more data per pixel.

**RGB565** is the standard 16-bit color format for microcontroller displays:
- 5 bits for red (0–31)
- 6 bits for green (0–63)
- 5 bits for blue (0–31)

Total: 16 bits = 65,536 possible colors per pixel. The green channel gets one extra bit because the human eye is more sensitive to green.

To create an RGB565 color value:

```python
def rgb565(r, g, b):
    """Convert 8-bit RGB (0–255 each) to 16-bit RGB565."""
    r5 = r >> 3          # top 5 bits of red
    g6 = g >> 2          # top 6 bits of green
    b5 = b >> 3          # top 5 bits of blue
    return (r5 << 11) | (g6 << 5) | b5

RED   = rgb565(255, 0, 0)      # 0xF800
GREEN = rgb565(0, 255, 0)      # 0x07E0
BLUE  = rgb565(0, 0, 255)      # 0x001F
WHITE = rgb565(255, 255, 255)  # 0xFFFF
BLACK = 0x0000
```

**Display color formats** summary:
| Format | Bits/pixel | Colors | Used by |
|--------|-----------|--------|---------|
| MONO_HLSB | 1 | 2 (B&W) | OLED (SSD1306, SH1106) |
| RGB565 | 16 | 65,536 | TFT (ILI9341, ST7789V) |
| RGB888 | 24 | 16.7M | PNG images, desktop |

### Screen Coordinate System

The **screen coordinate system** for TFT displays is the same as for OLEDs: `(x, y)` where `x` increases left-to-right and `y` increases top-to-bottom. The origin `(0, 0)` is the top-left corner.

TFT drivers support **rotation** — you can orient the display in 0°, 90°, 180°, or 270° positions. Changing rotation also swaps width and height in software so your code does not need to change.

### ILI9341 TFT Driver — 240×320 Pixels

The **ILI9341** drives a 240×320 pixel TFT display — much larger than a typical OLED. At 3.3V it connects over **SPI** with several control pins: DC (data/command), RST (reset), CS (chip select), and BL (backlight).

```python
from machine import SPI, Pin
import ili9341   # driver: copy ili9341.py and glcdfont.py to Pico

spi = SPI(0, baudrate=40_000_000, sck=Pin(2), mosi=Pin(3), miso=Pin(4))
dc  = Pin(8,  Pin.OUT)
rst = Pin(9,  Pin.OUT)
cs  = Pin(10, Pin.OUT)
bl  = Pin(13, Pin.OUT)

display = ili9341.ILI9341(spi, dc=dc, rst=rst, cs=cs, w=240, h=320)
bl.value(1)   # turn on backlight

display.fill(BLACK)
display.draw_text(0, 0, "Hello Color!", ili9341.color565(255, 165, 0))
```

The **ILI9341 SPI interface** runs at up to 40 MHz for read and write operations. At 240×320 pixels × 2 bytes/pixel = 153,600 bytes per full-screen refresh — even at 40 MHz that takes about 30 ms. For smooth animation, only redraw regions that change.

**ILI9341 color depth (16-bit)**: all color values passed to the driver use 16-bit RGB565 encoding (described above).

### ST7789V Color LCD Driver — 240×240 Pixels

The **ST7789V** is a popular driver for square 240×240 pixel displays and round 240×240 GC9A01 displays. It also runs at 3.3V over SPI and uses the same pin set as the ILI9341.

```python
from machine import SPI, Pin
import st7789   # driver: copy st7789.py to Pico

spi  = SPI(1, baudrate=40_000_000, sck=Pin(10), mosi=Pin(11))
tft  = st7789.ST7789(spi, 240, 240, reset=Pin(12, Pin.OUT),
                     cs=Pin(9, Pin.OUT), dc=Pin(8, Pin.OUT))
tft.init()
tft.fill(st7789.BLACK)
tft.text("MicroPython", 60, 110, st7789.WHITE)
```

**ST7789V resolution**: the 240×240 square format is common for wristwatch-style displays. The wider **Waveshare LCD** modules (such as 2.8-inch 320×240) often use the ILI9341 instead.

### Other Display Options

- **Graphic LCD (CU1609C)**: a 160×128 pixel color graphic LCD; less common, similar SPI wiring.
- **Waveshare LCD**: Waveshare makes a range of SPI TFT modules for the Pico with pre-written demo libraries.
- **HSTX Display Interface**: the Raspberry Pi Pico 2 (RP2350 chip) includes the HSTX (High-Speed Serial Transmit) interface, which can drive DVI/HDMI displays at up to 720p resolution — far beyond what standard SPI can support.

!!! mascot-thinking "SPI Speed Matters for TFT Displays"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A 240×320 TFT has 240 × 320 × 2 = 153,600 bytes per frame. At 10 MHz SPI that takes 120 ms — too slow for animation. At 40 MHz it takes 30 ms — workable but still slow. Design your animated sections to redraw only the changed regions, not the whole screen. Black out and redraw only the number that changed, not the surrounding text.

## E-Paper Displays — Power Off, Image Stays

An **e-paper display** (also called e-ink) is a completely different technology from TFT or OLED. It uses tiny capsules filled with black and white charged particles. When a voltage is applied, the particles rearrange to show a pattern. Once set, the image is completely stable with **zero power consumption** — perfect for name badges, shelf labels, and weather stations that update once a day.

### E-Ink Technology

**E-ink technology** works like a microscopic Etch A Sketch inside each pixel. Each pixel capsule contains:
- White particles that rise when a positive voltage is applied.
- Black particles that rise when a negative voltage is applied.

The display only consumes power during the moment it changes. A typical frame update takes 1–4 seconds.

### E-Paper Refresh Rate and Low Power

**E-paper refresh rate** is slow by design — typically 1–4 seconds for a full refresh, and up to 15 seconds for color e-paper. Partial refresh (changing only some pixels) can be faster (0.3–1 second) but may cause ghosting if used too frequently.

**E-paper low power** is the killer feature. A 2.9-inch Waveshare e-paper module consumes:
- 26.4 mA during refresh
- 0 mA (literally zero) when displaying a static image
- 0.001 mA in deep sleep mode

For a project running on AA batteries that updates once per hour, the e-paper display is essentially free from a power perspective.

### E-Paper SPI Interface and Waveshare Driver

Most e-paper modules use a 4-wire SPI interface plus several control pins (DC, RST, BUSY). The **Waveshare E-Paper Driver** library (available in `src/drivers/`) includes support for Waveshare's 1.54", 2.9", and 4.2" modules.

```python
from machine import SPI, Pin
from waveshare_epaper import EPD_2in9   # Waveshare 2.9-inch b/w module

spi  = SPI(0, baudrate=4_000_000, sck=Pin(2), mosi=Pin(3))
epd  = EPD_2in9(spi, dc=Pin(8), cs=Pin(9), rst=Pin(12), busy=Pin(13))

epd.init()
epd.clear()

# Draw into a framebuffer, then display
import framebuf
buf = bytearray(epd.width * epd.height // 8)
fb  = framebuf.FrameBuffer(buf, epd.width, epd.height, framebuf.MONO_HLSB)

fb.fill(0xFF)                    # white background (0xFF = all off = white)
fb.text("Weather: Sunny", 5, 20, 0x00)   # black text
fb.text("Temp: 22 C", 5, 40, 0x00)

epd.display(buf)                 # push to e-paper (takes ~2 seconds)
epd.sleep()                      # put e-paper chip to sleep (saves power)
```

!!! mascot-warning "Never Refresh E-Paper Faster Than Specified!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    E-paper displays can be damaged by rapid repeated refreshes. The electrophoretic particles need time to fully settle. Follow the manufacturer's minimum refresh interval (typically 3–5 seconds for full refresh, 0.3–1 second for partial refresh). Continuous rapid refreshing shortens the display's lifespan dramatically.

#### Diagram: E-Paper vs TFT vs OLED Comparison

<iframe src="../../sims/display-technology-comparison/main.html" width="100%" height="430px" scrolling="no"></iframe>

<details markdown="1">
<summary>Display Technology Comparison MicroSim</summary>
Type: diagram
**sim-id:** display-technology-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Analyze (L4)
Bloom Verb: compare
Learning Objective: Students can select the appropriate display technology (OLED, TFT, e-paper) for a given set of project requirements (power, color, refresh rate, readability).

Canvas layout:
- Three columns: OLED | TFT | E-Paper
- Five rows of comparison attributes: Color, Power, Refresh rate, Outdoor visibility, Typical use
- At the bottom: a "Project match" tool

Visual elements:
- Each column headed by a stylized mini display icon
- Attribute cells color-coded: green = best, yellow = acceptable, red = worst
- Hover over any cell reveals a tooltip with exact figures

Interactive controls:
- Checkboxes for project requirements: "Battery powered", "Needs color", "Fast animation", "Outdoor use"
- "Best match" button highlights the recommended display type based on checked requirements

Instructional Rationale: Comparing three technologies in a structured matrix with a recommendation engine helps students make informed hardware choices rather than defaulting to whatever is in the kit.

Implementation: p5.js. Grid layout; createCheckbox() for requirements; recommendation algorithm checks boxes vs. category scores.
</details>

## Key Takeaways

- **TFT displays** use a backlit LCD panel; driven over SPI with DC, RST, CS, and backlight pins.
- **RGB565** is the standard 16-bit color format: 5 red bits + 6 green bits + 5 blue bits = 65,536 colors.
- **ILI9341** drives 240×320 TFT displays; **ST7789V** drives 240×240 square or round displays.
- Only redraw changed regions to keep TFT animation smooth — full-screen refresh at 40 MHz takes ~30 ms.
- **E-paper** holds its image with zero power; updates take 1–4 seconds; ideal for rarely-updated displays.
- The **Waveshare E-Paper Driver** handles the SPI protocol and frame timing.
- Always call `epd.sleep()` after an e-paper update to save power and protect the display.

??? question "Quick Check: What is the RGB565 value for pure red? (Click to reveal)"
    **`0xF800`** — red occupies the top 5 bits: `11111 000000 00000` in binary = `0xF800`. Green is `0x07E0` (bits 10–5), and blue is `0x001F` (bits 4–0).

!!! mascot-celebration "Color and E-Paper Complete!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Full-color TFT and zero-power e-paper — you now command the full spectrum of display technology. Chapter 18 takes a sonic detour: generating tones, playing melodies, and creating audio output from your Pico. Get ready to make some noise!
