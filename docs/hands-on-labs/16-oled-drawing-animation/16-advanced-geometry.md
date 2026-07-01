# Advanced OLED Drawing — Ellipses, Polygons, and Robot Faces

!!! mascot-welcome "Welcome to Advanced Drawing!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You already know how to draw lines and rectangles. Now you will learn to draw curved shapes, custom polygons, and even animated faces! MicroPython's framebuffer gives you powerful tools for all of these. Let's build something amazing!

The `SSD1306_SPI` and `SSD1306_I2C` display objects in MicroPython come with a `FrameBuffer` built in. That FrameBuffer gives you access to several drawing methods you may not have tried yet:

- `ellipse(x, y, rx, ry, color)` — draw an oval or circle
- `poly(x, y, array, color, fill)` — draw any polygon from an array of points
- `blit(fb, x, y)` — copy another FrameBuffer onto the display

These three tools let you build complex graphics like robot faces, gauges, and animated expressions.

## Parts You Need

- Raspberry Pi Pico
- SSD1306 OLED display (128×64) via SPI

Connect via SPI: **SCL → GPIO 2**, **SDA → GPIO 3**, **RES → GPIO 4**, **DC → GPIO 5**, **CS → GPIO 6**

## Lab 1: Drawing Ellipses

An ellipse is a stretched circle. You set the center point and two radii: `xr` (width radius) and `yr` (height radius). When both radii are equal, you get a perfect circle.

```python
from machine import Pin, SPI
import ssd1306

spi = SPI(0, sck=Pin(2), mosi=Pin(3))
oled = ssd1306.SSD1306_SPI(128, 64, spi, Pin(5), Pin(4), Pin(6))

oled.fill(0)                               # clear the screen

# Draw a circle (both radii equal)
oled.ellipse(32, 32, 20, 20, 1)           # center at (32,32), radius 20

# Draw a wide oval (wider than tall)
oled.ellipse(96, 32, 28, 12, 1)           # center at (96,32), xr=28, yr=12

# Draw a filled ellipse
oled.ellipse(64, 10, 15, 8, 1, True)      # True = filled

# Draw only the bottom half of an ellipse (quadrant mask = 3 = bits 0 and 1)
# Quadrant 1 = top right (bit 0), Q2 = top left (bit 1)
# Quadrant 3 = bottom left (bit 2), Q4 = bottom right (bit 3)
# Bits 0+1 = 3 = bottom half
oled.ellipse(64, 55, 30, 10, 1, False, 12)  # mask 12 = bits 3+2 = top half

oled.show()                                # update the display
```

### What Each Line Does

1. `ellipse(32, 32, 20, 20, 1)` — center (32,32), xr=20, yr=20 → perfect circle.
2. `ellipse(64, 10, 15, 8, 1, True)` — the `True` means fill the shape solid.
3. The optional last argument is a **quadrant mask**. Each of the 4 bits controls one quarter. This lets you draw half-circles and quarter-arcs.

### Quadrant Mask Reference

| Bit | Value | Quadrant |
|-----|-------|----------|
| 0 | 1 | Q1 — top right |
| 1 | 2 | Q2 — top left |
| 2 | 4 | Q3 — bottom left |
| 3 | 8 | Q4 — bottom right |

Add the values together for combinations. `1+2=3` draws both top quadrants. `4+8=12` draws both bottom quadrants.

## Lab 2: Drawing Polygons

The `poly()` method draws any shape from a list of (X, Y) points. You store the points in an `array` of signed 16-bit integers, then pass it to `poly()`.

```python
from machine import Pin, SPI
from array import array           # needed to create the points list
import ssd1306

spi = SPI(0, sck=Pin(2), mosi=Pin(3))
oled = ssd1306.SSD1306_SPI(128, 64, spi, Pin(5), Pin(4), Pin(6))

oled.fill(0)

# Define a triangle as (x,y) pairs flattened into one array
# Points listed as: x0,y0, x1,y1, x2,y2
triangle = array('h', [0, -20,  20, 20,  -20, 20])
# 'h' means signed 16-bit integers — required for poly()

# Draw the triangle at position (64, 40) on screen
oled.poly(64, 40, triangle, 1, True)   # True = filled

# Define a star-like arrow shape pointing right
arrow = array('h', [0,0,  -10,-8,  -6,-4,  -20,-4,  -20,4,  -6,4,  -10,8])
oled.poly(100, 20, arrow, 1, False)    # False = outline only

oled.show()
```

### What Each Line Does

1. `array('h', [...])` — creates a list of 16-bit integers. The `'h'` type code is required by `poly()`.
2. Points are **relative to the drawing origin** you pass as `x, y` to `poly()`.
3. `poly(64, 40, triangle, 1, True)` — draws at screen position (64,40), color=1, filled.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Points in `poly()` are measured from the center you pass in, not from the screen corner. Negative values go left and up, positive values go right and down.

## Lab 3: Building a Robot Face with Expressions

This is the most advanced lab. You will build a complete animated robot face using ellipses for eyes and mouth, polygons for eyebrows, and `blit()` to copy eye images onto the main display.

```python
from machine import Pin, SPI
from utime import sleep, ticks_us
from array import array
import ssd1306

spi = SPI(0, sck=Pin(2), mosi=Pin(3))
oled = ssd1306.SSD1306_SPI(128, 64, spi, Pin(5), Pin(4), Pin(6))

WIDTH  = 128
HEIGHT = 64
HALF_W = WIDTH  // 2
HALF_H = HEIGHT // 2

ON   = 1
OFF  = 0
FILL = True

# Eye shape constants
EYE_W       = 27      # half-width of each eye
EYE_H       = 7       # half-height of each eye
PUPIL_W     = 5       # half-width of the pupil
EYE_Y       = 25      # vertical center of the eyes

MOUTH_Y     = 50      # vertical center of the mouth
MOUTH_W     = 40      # half-width of the mouth
MAX_CURVE   = 10      # maximum mouth curve height

# Eyebrow polygon point arrays (relative to eye center)
left_eyebrow  = array('h', [-EYE_W, -1,  15, -5,  EYE_W+10, 1,  15, -2])
right_eyebrow = array('h', [-EYE_W-10, 1, -15, -5, EYE_W, 0, -15, -2])

def draw_eye(cx, pupil_offset, blink_level):
    # White of the eye
    oled.ellipse(cx, EYE_Y, EYE_W, EYE_H - blink_level, ON, FILL)
    # Black pupil on top of the white
    oled.ellipse(cx + pupil_offset, EYE_Y, PUPIL_W, PUPIL_W, OFF, FILL)

def draw_mouth(curve):
    # curve > 0 = smile, curve = 0 = neutral line, curve < 0 = frown
    if curve > 0:
        # Bottom half of ellipse = smile arc
        oled.ellipse(HALF_W, MOUTH_Y, MOUTH_W, curve, ON, False, 12)
    elif curve == 0:
        oled.hline(MOUTH_W - MOUTH_W // 2, MOUTH_Y, MOUTH_W * 2, ON)
    else:
        # Top half of ellipse = frown arc
        oled.ellipse(HALF_W, MOUTH_Y, MOUTH_W, -curve, ON, False, 3)

def draw_face(pupil_offset, blink_level, mouth_curve):
    oled.fill(0)

    # Left eye and eyebrow
    draw_eye(HALF_W // 2, pupil_offset, blink_level)
    oled.poly(HALF_W // 2, EYE_Y - 10, left_eyebrow, ON, FILL)

    # Right eye and eyebrow
    draw_eye(HALF_W + HALF_W // 2, pupil_offset, blink_level)
    oled.poly(HALF_W + HALF_W // 2, EYE_Y - 10, right_eyebrow, ON, FILL)

    draw_mouth(mouth_curve)
    oled.show()

# --- Animation loop ---
SCAN_DELAY  = 0.05
BLINK_DELAY = 0.07
MOUTH_DELAY = 0.1

while True:
    # Eyes scan left to right
    for offset in range(0, 10):
        draw_face(offset, 0, MAX_CURVE)
        sleep(SCAN_DELAY)
    for offset in range(10, -10, -1):
        draw_face(offset, 0, MAX_CURVE)
        sleep(SCAN_DELAY)
    for offset in range(-10, 0):
        draw_face(offset, 0, MAX_CURVE)
        sleep(SCAN_DELAY)

    # Blink
    for b in range(0, 7):
        draw_face(0, b, MAX_CURVE)
        sleep(BLINK_DELAY)
    for b in range(7, 0, -1):
        draw_face(0, b, MAX_CURVE)
        sleep(BLINK_DELAY)

    # Smile → neutral → frown
    for curve in range(MAX_CURVE, 0, -1):
        draw_face(0, 0, curve)
        sleep(MOUTH_DELAY)
    sleep(0.5)
    draw_face(0, 0, 0)              # neutral expression
    sleep(0.5)
    for curve in range(-1, -MAX_CURVE, -1):
        draw_face(0, 0, curve)
        sleep(MOUTH_DELAY)
    sleep(0.5)
```

### What Each Section Does

1. `draw_eye(cx, pupil_offset, blink_level)` — draws a white ellipse for the eye, then a black ellipse for the pupil. `blink_level` squishes the eye vertically when nonzero.
2. `oled.poly(cx, ey-10, left_eyebrow, ...)` — draws a polygon at a position 10 pixels above the eye center.
3. `draw_mouth(curve)` — a positive curve draws a smile (bottom half ellipse). Zero draws a straight line. Negative draws a frown (top half ellipse).
4. The outer animation loop cycles through: eyes scanning, blinking, then changing expression from smile to frown and back.

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    The math here is more complex than earlier labs. Start by running the code as-is, then change one number at a time. See what happens when you change `EYE_H` or `MAX_CURVE` — that is how you learn what each value does.

## Experiments

1. Change `EYE_W` from 27 to 40. How does the face look with wider eyes?
2. Add a third expression — surprised! When surprised, the eyes should be wide open (`blink_level=0`), eyebrows high, and the mouth a wide circle.
3. Make the pupil follow the direction the eyes are scanning: when scanning left, offset the pupil left too.
4. Use the onboard button (if your board has one) to switch between expressions on button press.

!!! mascot-celebration "Your Robot Has Feelings!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have mastered ellipses, polygons, and blitting to create a fully animated robot face! These are the exact techniques used in educational robots like the GoPiGo and the CoderZ cars. Next, you will turn this into an interactive Pong game!
