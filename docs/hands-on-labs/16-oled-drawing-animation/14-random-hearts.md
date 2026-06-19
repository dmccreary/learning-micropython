# Draw Random Hearts

!!! mascot-welcome "Welcome to Random Hearts"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will use a random number generator to scatter heart shapes across your OLED display. Let's build something amazing!

This program uses the MicroPython `urandom` library to pick random X and Y positions on the display. It then draws a small heart icon at each random position using a grid of 1s (white pixels) and 0s (black pixels).

## How the Heart Icon Works

The heart is stored as a 9-by-9 grid of numbers. A `1` means the pixel is on (white). A `0` means the pixel is off (black). The program loops through every row and column of the grid and turns on the right pixels.

This is how many video game sprites (small images) are stored in code.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    An image stored as a grid of 1s and 0s is called a **bitmap**. The heart icon is a 9x9 bitmap. You can draw any small picture this way by replacing 1s and 0s on graph paper.

## Code

```py
from machine import Pin, PWM, SPI  # import hardware control tools
import machine
import urandom                      # import the random number library
import ssd1306                      # import the display driver
from utime import sleep
import random                       # import another random module (used for direction)

# display size in pixels
WIDTH  = 128
HEIGHT = 64

# set up the SPI display connection
CS      = machine.Pin(1)    # chip select pin
spi_sck = machine.Pin(2)    # SPI clock wire
spi_tx  = machine.Pin(3)    # SPI data wire
DC      = machine.Pin(4)    # data/command pin
RES     = machine.Pin(5)    # reset pin

spi  = machine.SPI(0, baudrate=100000, sck=spi_sck, mosi=spi_tx)  # create SPI connection
oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)        # create display object

# define the heart shape as a 9x9 grid
# 1 = white pixel on, 0 = black pixel off
HEART = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],  # row 0 — blank top row
    [ 0, 1, 1, 0, 0, 0, 1, 1, 0],  # row 1 — two bumps at the top
    [ 1, 1, 1, 1, 0, 1, 1, 1, 1],  # row 2 — wider bumps
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1],  # row 3 — full width
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1],  # row 4 — full width
    [ 0, 1, 1, 1, 1, 1, 1, 1, 0],  # row 5 — starts narrowing
    [ 0, 0, 1, 1, 1, 1, 1, 0, 0],  # row 6 — narrower
    [ 0, 0, 0, 1, 1, 1, 0, 0, 0],  # row 7 — almost a point
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0],  # row 8 — the bottom tip
]

# draw a heart at a given (xofs, yofs) offset position on the screen
def draw_heart(x_offset, y_offset):
    for y, row in enumerate(HEART):           # loop through each row of the grid
        for x, pixel_color in enumerate(row): # loop through each column in the row
            oled.pixel(x + x_offset, y + y_offset, pixel_color)  # draw one pixel

# pick a random position and draw a heart there
def draw_random_heart():
    x_offset = urandom.getrandbits(7)   # random number 0–127 (7 bits) for the x position
    y_offset = urandom.getrandbits(6)   # random number 0–63  (6 bits) for the y position
    print(x_offset, y_offset)           # print the chosen position for debugging
    draw_heart(x_offset, y_offset)      # draw the heart at the random position

# --- main program ---
oled.fill(0)              # clear the screen to black

for n in range(10):       # draw 10 random hearts
    draw_random_heart()   # pick a random spot and draw

oled.show()               # send the finished drawing to the screen
```

**What each line does:**

1. `HEART = [...]` — defines the 9x9 heart bitmap. Each row is a list of 1s and 0s.
2. `draw_heart(x_offset, y_offset)` — draws the heart by looping through every pixel in the grid. `x + x_offset` shifts the heart to the right. `y + y_offset` shifts it down.
3. `enumerate(HEART)` — gives you both the row index (`y`) and the row data at the same time.
4. `urandom.getrandbits(7)` — picks a random number with 7 bits. 7 bits can hold values from 0 to 127, which matches the screen width.
5. `urandom.getrandbits(6)` — picks a random number with 6 bits. 6 bits hold values from 0 to 63, which matches the screen height.
6. `for n in range(10)` — repeats the process 10 times to draw 10 hearts.
7. `oled.show()` — sends all 10 hearts to the screen at once.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try changing the number in `range(10)` to draw more hearts. Try `range(50)` for a very full screen! Also try calling `oled.fill(0)` and `oled.show()` inside the loop to watch hearts appear one at a time.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Hearts drawn near the right or bottom edge may be clipped. The heart is 9 pixels wide, so drawing at x_offset = 125 would put some pixels off screen. The `oled.pixel()` function silently ignores pixels outside the screen boundary.

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Want to make a different shape? Try editing the HEART grid. Replace 1s with 0s and 0s with 1s to invert the shape. Or draw a star or smiley face on graph paper first, then copy the pattern!

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You drew random pixel-art icons using a bitmap grid and a random number generator! Next, you will create repeating geometric patterns using math equations.
