# Extending Drawing Functions

!!! mascot-welcome "Welcome to Custom Shapes"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will write your own drawing functions to make shapes that MicroPython does not include by default — like circles! Let's build something amazing!

The standard SSD1306 display driver gives you rectangles, lines, and text. But it does not include a circle function. To draw a circle, you need to write one yourself.

This is a great example of how programmers extend a library to do new things.

## Circle

A circle is defined by three things:

1. Its center point (cx, cy) — where the middle of the circle is.
2. Its radius (r) — how many pixels wide from the center to the edge.
3. Its color — `1` for white, `0` for black.

Here are the parameters for the circle function:

1. `cx` — X position of the circle center.
2. `cy` — Y position of the circle center.
3. `r` — the radius of the circle in pixels.
4. `color` — `1` for on (white) and `0` for off (black).

Here is one way to write a circle function. It scans every pixel in a square around the circle center. If a pixel is close enough to the center, it turns the pixel on.

```python
from math import sqrt  # import the square root function

def draw_circle(cx, cy, r, color):
    diameter = r * 2                   # the width of the bounding square
    upper_left_x = cx - r             # left edge of the bounding square
    upper_left_y = cy - r             # top edge of the bounding square

    # scan through every pixel in the bounding square
    for i in range(upper_left_x, upper_left_x + diameter):
        for j in range(upper_left_y, upper_left_y + diameter):
            # calculate how far pixel (i, j) is from the center (cx, cy)
            distance = sqrt((i - cx) ** 2 + (j - cy) ** 2)
            if distance < r:           # if close enough, turn the pixel on
                oled.pixel(i, j, color)
```

**What each line does:**

1. `from math import sqrt` — loads the square root function.
2. `diameter = r * 2` — calculates how wide the bounding square needs to be.
3. `upper_left_x = cx - r` — finds the left edge of the area to scan.
4. `upper_left_y = cy - r` — finds the top edge of the area to scan.
5. `for i in range(...)` — loops through each column of the bounding square.
6. `for j in range(...)` — loops through each row inside that column.
7. `distance = sqrt(...)` — uses the Pythagorean theorem to find how far pixel (i, j) is from the center.
8. `if distance < r` — checks if the pixel is inside the circle.
9. `oled.pixel(i, j, color)` — turns the pixel on if it is inside the circle.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The math here uses the Pythagorean theorem: the distance from (i, j) to (cx, cy) is `sqrt((i-cx)^2 + (j-cy)^2)`. If that distance is less than the radius, the pixel is inside the circle.

## Testing Circle Drawing

Here is a complete program that draws circles of growing size on the screen. It uses the SPI (Serial Peripheral Interface) version of the display.

```py
from machine import Pin
from utime import sleep
from math import sqrt
import machine
import ssd1306

# display size in pixels
WIDTH = 128
HEIGHT = 64

# SPI display pin connections
clock = Pin(2)              # SPI clock wire
data  = Pin(3)              # SPI data wire
RES   = machine.Pin(4)     # reset pin
DC    = machine.Pin(5)     # data/command select pin
CS    = machine.Pin(6)     # chip select pin

# set up the SPI connection to the display
spi  = machine.SPI(0, sck=clock, mosi=data)
oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)

def draw_circle(cx, cy, r, color):
    diameter    = r * 2
    upper_left_x = cx - r
    upper_left_y = cy - r
    for i in range(upper_left_x, upper_left_x + diameter):
        for j in range(upper_left_y, upper_left_y + diameter):
            # distance from this pixel to the center
            distance = sqrt((i - cx) ** 2 + (j - cy) ** 2)
            if distance < r:
                oled.pixel(i, j, color)

HALF_WIDTH  = int(WIDTH  / 2)  # center x of the screen
HALF_HEIGHT = int(HEIGHT / 2)  # center y of the screen

while True:
    # grow circles from radius 1 to the half-height
    for rad in range(1, HALF_HEIGHT + 2):
        draw_circle(HALF_WIDTH, HALF_HEIGHT, rad, 1)  # draw a white circle
        oled.show()                                    # update the screen
        sleep(0.1)                                     # pause before the next one
    sleep(3)                                           # pause before clearing

    oled.fill(1)                                       # fill screen white
    # erase circles from the center outward
    for rad in range(1, HALF_HEIGHT + 2):
        draw_circle(HALF_WIDTH, HALF_HEIGHT, rad, 0)  # erase circle by drawing black
        oled.show()
        sleep(0.1)
    oled.fill(0)                                       # clear screen to black
    sleep(3)                                           # pause before repeating
```

**What each section does:**

1. `WIDTH`, `HEIGHT` — store the display size so we can use them throughout the program.
2. `Pin(2)` through `Pin(6)` — set up the five wires that connect the SPI display.
3. `ssd1306.SSD1306_SPI(...)` — creates the display object using SPI instead of I2C.
4. `draw_circle(...)` — the custom function that draws a filled circle.
5. `for rad in range(1, HALF_HEIGHT + 2)` — loops from radius 1 up to 34 (half of 64 + 2).
6. `oled.fill(1)` — fills the screen with white before erasing circles.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    You can erase a circle by drawing it again in black (`color = 0`). This trick works for any shape!

## Drawing a Face

If you have a 128x64 display, you can use two circle calls to draw eyes. This example assumes you have written a `circle()` function as shown above.

```py
oled.fill(0)                      # clear the display to black
draw_circle(32, 32, 10, 1)        # draw the left eye at x=32, y=32 with radius 10
draw_circle(96, 32, 10, 1)        # draw the right eye at x=96, y=32 with radius 10
oled.show()                       # send the drawing to the screen
```

Try adding more circles to make a nose or a mouth!

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Writing your own drawing functions takes practice. If your circle looks odd, try adjusting the `if distance < r` check. You are doing real computer graphics math — that is impressive!

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You wrote a custom circle function from scratch! Next, you will learn how to measure drawing speed so you can make your programs faster.
