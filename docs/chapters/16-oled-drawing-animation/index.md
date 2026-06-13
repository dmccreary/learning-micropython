---
title: OLED Drawing Methods, Framebuffer, and Animation
description: text(), fill(), pixel(), line(), rect(), fill_rect() drawing API, framebuf.FrameBuffer off-screen buffers, bounce animation, Pong game, and live sensor display updates.
generated_by: claude skill chapter-content-generator
date: 2026-06-13 00:10:00
version: 0.09
---

# OLED Drawing Methods, Framebuffer, and Animation

## Summary

With the OLED initialized from the previous chapter, you are ready to draw. This chapter covers the full MicroPython drawing API: placing text with `oled.text()`, painting the screen with `oled.fill()`, drawing pixels, lines, rectangles, and filled rectangles. You will also learn the MicroPython `framebuf` module — a fast off-screen buffer that lets you build up a complex image before pushing it to the display all at once, which eliminates flicker. The chapter finishes with three animated projects: a bouncing ball, a two-player Pong game, and a real-time display that shows live sensor readings updating on screen.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. OLED Framebuffer
2. oled.text() Method
3. oled.fill() Method
4. oled.show() Method
5. oled.pixel() Method
6. oled.line() Method
7. oled.rect() Method
8. oled.fill_rect() Method
9. OLED Bounce Animation
10. OLED Pong Game
11. OLED Real-Time Sensor Display
12. Framebuf Module
13. framebuf.FrameBuffer Class
14. framebuf.MONO_HLSB Format
15. framebuf.RGB565 Format
16. Bitmap Drawing
17. Custom Drawing Functions

## Prerequisites

This chapter builds on concepts from:

- [Chapter 15: OLED Display Setup and Configuration](../15-oled-setup/index.md)

---

!!! mascot-welcome "Welcome to Chapter 16"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A blank OLED and a full drawing toolkit — this is where your projects come alive! Pixels, lines, rectangles, text, and smooth animations all follow from a handful of simple methods. By the end of this chapter you will have a bouncing ball on screen and the concepts to build a complete Pong game. Ready to draw?

## The OLED Drawing API

The SSD1306 and SH1106 objects inherit their drawing methods from MicroPython's `framebuf.FrameBuffer` class. You work on a **framebuffer** — a region of RAM that mirrors the display pixels. Every drawing method modifies this in-memory buffer; calling `oled.show()` sends the buffer to the physical display.

All coordinates use the standard screen convention: `(x, y)` where `x` increases to the right and `y` increases downward. The top-left corner is `(0, 0)`. For a 128×64 display, the bottom-right corner is `(127, 63)`.

### oled.fill(color)

**`oled.fill(color)`** paints every pixel on the screen with the given color:
- `0` = black (pixel off)
- `1` = white (pixel on)

Call `oled.fill(0)` at the start of each animation frame to erase the previous frame:

```python
oled.fill(0)   # clear screen
```

### oled.text(string, x, y, color=1)

**`oled.text()`** draws a string starting at position `(x, y)`. Each character is 8×8 pixels. For 128-pixel-wide display, that gives 16 characters per row (128 / 8 = 16).

```python
oled.text("Temp: 23.5 C", 0, 0)   # top-left corner
oled.text("Humidity: 64%", 0, 10)  # 10 pixels below
oled.text("Pico W", 40, 56)        # bottom center-ish
oled.show()
```

### oled.pixel(x, y, color=1)

**`oled.pixel(x, y)`** turns a single pixel on or off:

```python
oled.pixel(64, 32, 1)   # white pixel at center of 128x64 display
oled.pixel(64, 32, 0)   # turn that pixel off
```

### oled.line(x1, y1, x2, y2, color)

**`oled.line()`** draws a straight line from `(x1, y1)` to `(x2, y2)`:

```python
oled.line(0, 0, 127, 63, 1)    # diagonal line across the screen
oled.line(0, 32, 127, 32, 1)   # horizontal center line
```

### oled.rect(x, y, width, height, color)

**`oled.rect()`** draws a rectangle outline (no fill):

```python
oled.rect(10, 10, 50, 30, 1)   # rectangle at (10,10), 50 wide, 30 tall
```

### oled.fill_rect(x, y, width, height, color)

**`oled.fill_rect()`** draws a filled rectangle:

```python
oled.fill_rect(10, 10, 50, 30, 1)   # filled white rectangle
oled.fill_rect(10, 10, 50, 30, 0)   # erase by filling black
```

## Bounce Animation — Putting It Together

Before looking at the code, here is the algorithm for a **bouncing ball animation**:

1. Store ball position `(bx, by)` and velocity `(vx, vy)`.
2. Each frame: clear the screen, draw the ball at `(bx, by)`, call `oled.show()`.
3. Update position: `bx += vx`, `by += vy`.
4. Reverse velocity when the ball hits a wall:
   - If `bx` reaches 0 or max_x, flip `vx` (negate it).
   - If `by` reaches 0 or max_y, flip `vy`.

Here is the complete program:

```python
from machine import I2C, Pin
from ssd1306 import SSD1306_I2C
import utime

i2c  = I2C(0, scl=Pin(1), sda=Pin(0))
oled = SSD1306_I2C(128, 64, i2c)

RADIUS = 4
bx, by = 64, 32    # starting position (center)
vx, vy = 2, 1      # velocity (pixels per frame)

while True:
    oled.fill(0)                     # clear
    oled.fill_rect(bx-RADIUS, by-RADIUS,
                   RADIUS*2, RADIUS*2, 1)  # draw ball as a square

    bx += vx                         # move
    by += vy

    if bx <= RADIUS or bx >= 127 - RADIUS:
        vx = -vx                     # bounce off left/right walls
    if by <= RADIUS or by >= 63 - RADIUS:
        vy = -vy                     # bounce off top/bottom walls

    oled.show()
    utime.sleep_ms(20)               # ~50 fps
```

## The Framebuf Module — Off-Screen Drawing

The **`framebuf` module** lets you create independent off-screen buffers. This is useful when you need to pre-render a sprite, icon, or bitmap and then blit (copy) it onto the main display buffer.

A **`framebuf.FrameBuffer`** object is a rectangle of pixels stored in a `bytearray`. You create one by specifying a buffer, width, height, and pixel format.

**Pixel formats:**

- **`framebuf.MONO_HLSB`** — monochrome, 1 bit per pixel, horizontal layout, MSB first. This is the format used by SSD1306 OLED displays internally.
- **`framebuf.RGB565`** — color, 16 bits per pixel (5 bits red, 6 bits green, 5 bits blue). Used by color TFT displays.

```python
import framebuf

# Create a 16×16 monochrome off-screen buffer (16 × 16 / 8 = 32 bytes)
buf = bytearray(32)
fb  = framebuf.FrameBuffer(buf, 16, 16, framebuf.MONO_HLSB)

fb.fill(0)
fb.text("Hi", 0, 0, 1)   # draw into the off-screen buffer

# Blit (copy) the off-screen buffer onto the OLED at position (56, 24)
oled.blit(fb, 56, 24)
oled.show()
```

**Bitmap drawing** means copying a pre-defined pixel pattern (stored as bytes) into the FrameBuffer using `blit()`. Icons, sprites, and custom fonts all use this technique.

### Custom Drawing Functions

Because the standard API only provides primitive shapes, you will often write **custom drawing functions** for circles, progress bars, graphs, and charts:

```python
def draw_circle(oled, cx, cy, r, color=1):
    """Draw a circle outline using the midpoint algorithm."""
    x, y = r, 0
    err = 0
    while x >= y:
        oled.pixel(cx+x, cy+y, color)
        oled.pixel(cx+y, cy+x, color)
        oled.pixel(cx-y, cy+x, color)
        oled.pixel(cx-x, cy+y, color)
        oled.pixel(cx-x, cy-y, color)
        oled.pixel(cx-y, cy-x, color)
        oled.pixel(cx+y, cy-x, color)
        oled.pixel(cx+x, cy-y, color)
        y += 1
        err += 1 + 2*y
        if 2*(err-x) + 1 > 0:
            x -= 1
            err += 1 - 2*x

def draw_bar(oled, x, y, width, height, value, max_val):
    """Draw a horizontal progress bar."""
    filled = int(width * value / max_val)
    oled.rect(x, y, width, height, 1)           # outline
    oled.fill_rect(x, y, filled, height, 1)     # fill
```

## OLED Real-Time Sensor Display

One of the most practical OLED applications is a **real-time sensor display** that updates the screen every second with live readings. Here is a pattern for updating without flicker:

```python
from machine import I2C, Pin, ADC
from ssd1306 import SSD1306_I2C
import utime, dht

i2c  = I2C(0, scl=Pin(1), sda=Pin(0))
oled = SSD1306_I2C(128, 64, i2c)
dht_sensor = dht.DHT22(Pin(22))

while True:
    dht_sensor.measure()
    temp = dht_sensor.temperature()
    humid = dht_sensor.humidity()

    oled.fill(0)                                    # clear
    oled.text(f"Temp: {temp:.1f} C", 0, 0)
    oled.text(f"Humid: {humid:.0f}%", 0, 12)
    oled.line(0, 22, 127, 22, 1)                    # divider line
    oled.text("MicroPython", 20, 28)
    oled.text("Weather Stn", 22, 40)
    oled.show()                                     # push frame

    utime.sleep(2)   # DHT22 needs 2 s between readings
```

!!! mascot-tip "Eliminate Display Flicker"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Display flicker happens when you call `oled.show()` multiple times per frame (once after each drawing command). The fix: draw everything into the framebuffer first — `fill(0)`, then all your drawing calls — then call `show()` exactly **once** at the end. The entire frame changes at once with zero flicker.

#### Diagram: OLED Drawing Coordinate System

<iframe src="../../sims/oled-coordinate-system/main.html" width="100%" height="420px" scrolling="no"></iframe>

<details markdown="1">
<summary>OLED Drawing Coordinate System MicroSim</summary>
Type: diagram
**sim-id:** oled-coordinate-system<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Remember (L1)
Bloom Verb: identify
Learning Objective: Students can identify any (x, y) coordinate on a 128×64 OLED display and predict which pixel will be affected by a drawing command.

Canvas layout:
- Center: a scaled-up 128×64 grid representing the OLED display
- Hover crosshairs show the current (x, y) coordinate
- Right panel: the MicroPython command that would draw at the hovered position

Visual elements:
- Gray grid lines every 8 pixels (matching the text character grid)
- Axis labels: 0 at top-left; 127 at top-right; 63 at bottom-left
- Live crosshair follows the mouse with (x,y) shown in a tooltip

Interactive controls:
- Click to "draw" a pixel — it stays lit
- createButton() "Clear" resets all drawn pixels
- Dropdown to select drawing mode: pixel, text, line, rect

Instructional Rationale: A large interactive grid makes the abstract coordinate system concrete. Students can click to place pixels and see the code before writing any hardware programs.

Implementation: p5.js. 128×64 array stores pixel state; mouse position mapped to grid coords; code snippet updates in right panel.
</details>

## Key Takeaways

- All drawing commands modify the in-memory **framebuffer** — nothing appears on screen until `oled.show()`.
- Call `oled.show()` exactly **once** at the end of each frame to eliminate flicker.
- `oled.fill(0)` clears the screen; `oled.fill(1)` lights every pixel.
- `oled.text("str", x, y)` draws text with 8×8 pixel characters; 16 chars max per row at 128 width.
- `oled.rect()` draws an outline; `oled.fill_rect()` draws a filled rectangle.
- The `framebuf.FrameBuffer` class allows off-screen rendering and blit-based sprite drawing.
- `framebuf.MONO_HLSB` is the pixel format for monochrome OLED displays.

??? question "Quick Check: How many 8×8 text characters fit in one row of a 128-pixel-wide OLED? (Click to reveal)"
    **16 characters** — 128 ÷ 8 = 16 columns. At 64 pixels tall, you get 8 text rows (64 ÷ 8 = 8), giving a maximum of 16 × 8 = 128 characters on a full 128×64 display.

!!! mascot-celebration "Graphics Master!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Text, lines, rectangles, animations, and custom functions — your OLED can now show anything you can imagine. Chapter 17 takes you into the world of color: full-color TFT displays and e-paper screens that hold their image without any power at all. Onward!
