# OLED SH1106 I2C Examples

!!! mascot-welcome "Welcome to the SH1106 Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will use an SH1106 OLED display with the Inter-Integrated Circuit (I2C) connection. You will show text, count numbers, animate a moving box, and even bounce a ball!

We use small Organic Light-Emitting Diode (OLED) displays in many of our labs because:

1. They are **inexpensive** — about $4 each.
2. They are **easy to connect** via I2C. You only need four wires: GND, VCC, Clock, and Data.
3. They have a **large area** to show feedback. Most are 128 x 64 pixels.
4. Once you get the driver installed, they are **easy to program**. You only need to set up the device and run `oled.fill()`, `oled.text()`, and `oled.show()`.
5. OLEDs keep **high contrast** even when batteries get low. Liquid Crystal Displays (LCDs) can look dim as batteries drain, but OLEDs stay bright.
6. There is plenty of **sample code and tutorials** online.

The first step is to find out which graphics chip is inside your OLED. This page covers the SH1106 chip.

## SH1106 Example

This is the simplest program you can write for an SH1106 display. It shows the text "CoderDojo" on screen.

```py
from machine import Pin, I2C   # load Pin and I2C classes from the machine library
import sh1106                   # load the SH1106 display driver

sda = machine.Pin(0)            # data wire connected to GPIO pin 0
scl = machine.Pin(1)            # clock wire connected to GPIO pin 1
i2c = I2C(0, scl=scl, sda=sda, freq=400000)  # set up I2C bus at 400,000 Hz

display = sh1106.SH1106_I2C(128, 64, i2c, Pin(4), 0x3c)  # create display: 128 wide, 64 tall, I2C bus, reset pin, address
display.sleep(False)  # wake the display up so it shows pixels

display.fill(0)               # clear the screen to black
display.text('CoderDojo', 0, 0, 1)  # write text at column 0, row 0, white pixels
display.show()                # send the drawing to the physical screen

print('done')  # print to the console so you know the program finished
```

**What each line does:**

1. `from machine import Pin, I2C` — loads only the parts of the machine library you need.
2. `import sh1106` — loads the SH1106 display driver.
3. `sda = machine.Pin(0)` — names the data wire pin (GPIO 0).
4. `scl = machine.Pin(1)` — names the clock wire pin (GPIO 1).
5. `i2c = I2C(0, ...)` — creates the I2C bus. The number 400000 sets the speed (400,000 signals per second).
6. `display = sh1106.SH1106_I2C(128, 64, i2c, Pin(4), 0x3c)` — creates the display object. `0x3c` is the address of the display in hexadecimal.
7. `display.sleep(False)` — wakes up the display. Some displays start in sleep mode.
8. `display.fill(0)` — fills the screen with black (0 = off).
9. `display.text('CoderDojo', 0, 0, 1)` — draws the text. `0, 0` is the top-left corner. `1` means white.
10. `display.show()` — sends everything to the screen. Nothing appears until you call this!
11. `print('done')` — shows a message in the console when the program ends.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Always call `display.fill(0)` before drawing new things. This clears the old image. Without it, old pixels stay on screen and make everything look messy.

## Counter Example

In this example, you will update the display 50 times. A counter counts from 1 to 50. There is a short pause between each update so you can watch it count.

```py
import machine
import utime                       # load the time library for pausing
from ssd1306 import SSD1306_I2C   # load the SSD1306 driver (works for the counter demo)

sda = machine.Pin(0)               # data wire on GPIO pin 0
scl = machine.Pin(1)               # clock wire on GPIO pin 1
i2c = machine.I2C(0, sda=sda, scl=scl, freq=400000)  # set up I2C bus
oled = SSD1306_I2C(128, 64, i2c)   # create the display object

for i in range(1, 51):                     # count from 1 to 50
    oled.fill(0)                           # clear screen to black each time
    oled.text('CoderDojo Rocks!', 0, 0, 1) # draw the title at top-left, white
    oled.text(str(i), 40, 20, 1)           # draw the number 20 pixels down from top
    oled.show()                            # send image to screen
    utime.sleep(0.1)                       # wait 1/10 of a second before next update

print('done')  # print when the loop finishes
```

**What each line does:**

1–6. Setup lines — same as above, setting up the I2C bus and display.
7. `for i in range(1, 51):` — runs the loop 50 times. `i` starts at 1 and goes up to 50.
8. `oled.fill(0)` — clears the screen each time through the loop.
9. `oled.text('CoderDojo Rocks!', 0, 0, 1)` — draws a title at the top.
10. `oled.text(str(i), 40, 20, 1)` — draws the counter number. `str(i)` turns the number into text. `40` moves it right. `20` moves it down.
11. `oled.show()` — sends the new image to the screen.
12. `utime.sleep(0.1)` — pauses for 0.1 seconds (100 ms) between updates.

## Animated Box

This example draws a title and a border rectangle. Then it draws a small filled box that slides from left to right across the display.

```py
from machine import Pin, I2C    # load Pin and I2C classes
import sh1106                    # load SH1106 display driver
import utime                     # load time library

sda = machine.Pin(0)             # data wire on GPIO pin 0
scl = machine.Pin(1)             # clock wire on GPIO pin 1
i2c = I2C(0, scl=scl, sda=sda, freq=400000)  # set up I2C bus

# note that we can only draw from 0 to 62
display = sh1106.SH1106_I2C(128, 64, i2c, Pin(4), 0x3c)  # create display
display.sleep(False)              # wake the display

display.fill(0)                           # clear screen to black
display.text('CoderDojo Rocks', 0, 0, 1)  # draw title at top-left, white
# line under title
display.hline(0, 9, 127, 1)     # draw a horizontal line across the screen at row 9
# bottom of display
display.hline(0, 30, 127, 1)    # draw a horizontal line at row 30
# left edge
display.vline(0, 10, 32, 1)     # draw a vertical line along the left side
# right edge
display.vline(127, 10, 32, 1)   # draw a vertical line along the right side

for i in range(0, 118):                  # slide box from left (0) to right (117)
    # box x0, y0, width, height, on
    display.fill_rect(i, 10, 10, 10, 1)  # draw a white 10x10 filled box at position i
    # draw black behind number
    display.fill_rect(10, 21, 30, 8, 0)  # erase the old number with a black rectangle
    display.text(str(i), 10, 21, 1)      # draw the current position number
    display.show()                       # send image to screen

print('done')  # print when animation finishes
```

**What each line does:**

1–7. Setup lines — load libraries and set up the I2C bus and display.
8. `display.fill(0)` — clears the screen.
9. `display.text(...)` — draws the title.
10. `display.hline(0, 9, 127, 1)` — draws a horizontal line. Arguments are: x start, y position, length, color.
11. `display.vline(0, 10, 32, 1)` — draws a vertical line. Arguments are: x position, y start, height, color.
12. `for i in range(0, 118):` — loops 118 times, one step for each pixel position.
13. `display.fill_rect(i, 10, 10, 10, 1)` — draws a filled white rectangle. Arguments are: x, y, width, height, color.
14. `display.fill_rect(10, 21, 30, 8, 0)` — draws a black rectangle to erase the old number.
15. `display.text(str(i), 10, 21, 1)` — draws the current position as a number.
16. `display.show()` — sends the new frame to the screen.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Animation on a display works just like a flip-book. You draw a new image, show it, then clear and draw the next one. Do this fast enough and it looks like smooth motion!

## Bounce on the SH1106 Display using I2C

This example shows a small ball bouncing around inside a border rectangle. The ball changes direction when it hits any edge.

```py
import machine
import utime
import sh1106      # load the SH1106 display driver

sda = machine.Pin(0)             # data wire on GPIO pin 0
scl = machine.Pin(1)             # clock wire on GPIO pin 1
i2c = machine.I2C(0, sda=sda, scl=scl)  # set up I2C bus

# Screen size
width  = 128   # screen width in pixels
height = 64    # screen height in pixels (we could use 63 but the driver needs the full value)

oled = sh1106.SH1106_I2C(width, height, i2c, machine.Pin(4), 0x3c)  # create display

oled.fill(0)  # clear screen to black

# note that OLEDs have problems with screen burn in - don't leave this on too long!
def border(width, height):
    oled.hline(0, 0, width - 1, 1)          # draw top edge
    oled.hline(0, height - 2, width - 1, 1)  # draw bottom edge
    oled.vline(0, 0, height - 1, 1)          # draw left edge
    oled.vline(width - 1, 0, height - 1, 1)  # draw right edge

# ok, not really a circle - just a square for now
def draw_ball(x, y, size, state):
    if size == 1:
        oled.pixel(x, y, state)  # draw a single pixel when size is 1
    else:
        for i in range(0, size):          # loop over each column of the ball
            for j in range(0, size):      # loop over each row of the ball
                oled.pixel(x + i, y + j, state)  # draw or erase one pixel of the ball
    # TODO: for size above 4 round the corners

border(width, height)  # draw the border rectangle

ball_size  = 5          # ball is 5x5 pixels
current_x  = int(width / 2)   # start in the middle of the screen horizontally
current_y  = int(height / 2)  # start in the middle of the screen vertically
direction_x = 1   # start moving right (positive = right)
direction_y = -1  # start moving up (negative = up)

# Bounce forever
while True:
    draw_ball(current_x, current_y, ball_size, 1)  # draw the ball in white
    oled.show()                                     # send frame to screen
    draw_ball(current_x, current_y, ball_size, 0)  # erase the ball (draw in black)

    # reverse direction at the edges
    # left edge test
    if current_x < 2:
        direction_x = 1                            # hit left wall — bounce right
    # right edge test
    if current_x > width - ball_size - 2:
        direction_x = -1                           # hit right wall — bounce left
    # top edge test
    if current_y < 2:
        direction_y = 1                            # hit top wall — bounce down
    # bottom edge test
    if current_y > height - ball_size - 3:
        direction_y = -1                           # hit bottom wall — bounce up

    # update the ball position
    current_x = current_x + direction_x  # move ball left or right by one pixel
    current_y = current_y + direction_y  # move ball up or down by one pixel

print('done')  # this only prints if the while loop ever ends
```

**What each line does:**

1–7. Setup — loads libraries and creates the I2C bus and display.
8. `oled.fill(0)` — clears the screen.
9–13. `border()` function — draws four lines that form a rectangle around the edges.
14–19. `draw_ball()` function — draws or erases the ball one pixel at a time. The `state` argument is 1 for white and 0 for black.
20. `border(width, height)` — calls the function to draw the border.
21–25. Starting values — sets the ball's starting position and direction.
26. `while True:` — loops forever until you stop the program.
27. `draw_ball(..., 1)` — draws the ball in white.
28. `oled.show()` — sends the frame to the screen.
29. `draw_ball(..., 0)` — erases the ball before moving it.
30–37. Edge checks — reverses the direction when the ball reaches a wall.
38–39. Position update — moves the ball one pixel in the current direction.

## SH1106 References

1. [Robert HH SH1106 Driver GitHub](https://github.com/robert-hh/SH1106/blob/master/sh1106.py)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You made text, a counter, a sliding box, and a bouncing ball! You are now an OLED animator. Next, try changing the ball size or speed to make it your own!
