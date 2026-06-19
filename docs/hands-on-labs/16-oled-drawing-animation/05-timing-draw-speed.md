# Timing Drawing Speed

!!! mascot-welcome "Welcome to Speed Testing"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will measure how long drawing functions take to run. This is a real skill that game programmers use every day. Let's build something amazing!

If you are writing a video game, you want the screen to update as fast as possible. A slow drawing function makes the game look choppy. A fast one makes it look smooth.

In this lab, you will measure two different ways to draw a circle and compare their speeds.

## Why Speed Matters

Every time you draw a shape on the display, the Pico must do math calculations. For a circle, it needs to figure out which pixels to turn on.

Different algorithms (step-by-step methods) can solve the same problem in different amounts of time. You want to find the fastest one.

## Measuring Time in MicroPython

MicroPython has a function called `ticks_us()` that returns the current time in **microseconds** (one millionth of a second). You call it before and after your drawing function. Then you subtract to find how long it took.

```py
from utime import ticks_us   # import the microsecond timer

start = ticks_us()           # record the time before the function runs
my_function()                # run the function you want to time
end   = ticks_us()           # record the time after it finishes

print('Time in microseconds:', end - start)  # print the difference
```

**What each line does:**

1. `from utime import ticks_us` — loads the microsecond timer.
2. `start = ticks_us()` — saves the current time before the function.
3. `my_function()` — runs whatever you want to measure.
4. `end = ticks_us()` — saves the time after the function finishes.
5. `end - start` — the difference is how many microseconds the function took.

MicroPython also has `ticks_cpu()` for even finer measurements. On the Raspberry Pi Pico, `ticks_cpu()` gives the same result as `ticks_us()`.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A microsecond is one millionth of a second. The Pico can do millions of operations per second. Small differences in draw time add up fast when you are animating many frames.

## Comparing Two Circle Drawing Algorithms

There are two common ways to draw a circle:

1. **Row Scanner Method** — scans every pixel in a square around the circle. For each pixel, it calculates how far that pixel is from the center. If the distance is within the circle's edge thickness, it turns the pixel on.
2. **Point Draw Method** — steps around the circle degree by degree (0, 2, 4, … 360). For each angle, it calculates one point on the edge of the circle using sine and cosine math, then turns that pixel on.

For small circles, the Point Draw Method is slow — it still tries 180 points even for a tiny circle. The Row Scanner only checks the pixels it needs to. But for large circles, the Row Scanner must check thousands of pixels, while the Point Draw still only needs 180 points.

Here is a program that times both methods and prints the results:

```py
from utime import sleep, ticks_us   # import the timer and sleep
import machine
import math
import ssd1306
from machine import Pin

# display size in pixels
WIDTH  = 128
HEIGHT = 64

# SPI pin connections
clock = Pin(2)               # SPI clock wire
data  = Pin(3)               # SPI data wire
RES   = machine.Pin(4)       # reset pin
DC    = machine.Pin(5)       # data/command pin
CS    = machine.Pin(6)       # chip select pin

spi  = machine.SPI(0, sck=clock, mosi=data)  # create the SPI connection
oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)  # create the display

# Point Draw Method: walks around the circle edge using sine and cosine
def fast_circle(center_x, center_y, radius, color):
    for angle in range(0, 360, 2):                   # step 2 degrees at a time
        radians = math.radians(angle)                # convert degrees to radians
        pixel_x = int(center_x + radius * math.cos(radians))  # x position on the edge
        pixel_y = int(center_y + radius * math.sin(radians))  # y position on the edge
        oled.pixel(pixel_x, pixel_y, color)          # turn that pixel on

# Row Scanner Method: checks every pixel in a square around the circle
def circle(center_x, center_y, radius, color):
    inner_radius_sq = (radius - 0.5) ** 2  # square of the inner edge distance
    outer_radius_sq = (radius + 0.5) ** 2  # square of the outer edge distance
    x_min = max(0,   int(center_x - radius))      # left bound (don't go off screen)
    x_max = min(128, int(center_x + radius + 1))  # right bound
    y_min = max(0,   int(center_y - radius))      # top bound
    y_max = min(64,  int(center_y + radius + 1))  # bottom bound

    for pixel_y in range(y_min, y_max):
        for pixel_x in range(x_min, x_max):
            # check if this pixel is on the ring
            dist_sq = (pixel_x - center_x) ** 2 + (pixel_y - center_y) ** 2
            if inner_radius_sq <= dist_sq <= outer_radius_sq:
                oled.pixel(pixel_x, pixel_y, color)

# --- Time the Row Scanner Method ---
start = ticks_us()
circle(32, 32, 10, 1)          # draw a circle at (32, 32) with radius 10
end   = ticks_us()
print('Row Scanner time (microseconds):', end - start)
oled.show()
sleep(1)

# --- Time the Point Draw Method ---
start = ticks_us()
fast_circle(96, 32, 10, 1)    # draw a circle at (96, 32) with radius 10
end   = ticks_us()
print('Point Draw time (microseconds):', end - start)
oled.show()
```

**What each section does:**

1. `fast_circle()` — the Point Draw method. It steps around the circle 2 degrees at a time. `math.cos()` and `math.sin()` find each point on the edge.
2. `circle()` — the Row Scanner method. It checks every pixel in the bounding square and calculates the exact distance from the center.
3. `ticks_us()` before and after each call — measures how long each method takes.
4. `print(...)` — shows the timing result in the Thonny console.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Run the timing test with different circle sizes! Try radii of 5, 10, 20, and 30. See if the Row Scanner or the Point Draw method wins at each size.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The Point Draw method can leave gaps in very small circles. If you see a broken ring, try stepping by 1 degree instead of 2 in the `range(0, 360, 2)` line — but that will be slower.

## Challenge Tasks

Try these experiments to go further:

1. Write a program that compares drawing speed for circles of different sizes (radius 5, 10, 20, and 30).
2. Change the `fast_circle()` function to skip every 3rd point instead of every 2nd. Does it look broken for small circles?
3. Can you write a function that automatically chooses the faster algorithm based on the circle size?
4. Can you add a parameter that controls how many points are skipped in the Point Draw method?

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You measured real drawing performance on your microcontroller! Next, you will use what you know to animate a bouncing ball on the screen.
