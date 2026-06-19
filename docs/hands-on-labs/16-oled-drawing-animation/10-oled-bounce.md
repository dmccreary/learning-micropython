# OLED Bounce

!!! mascot-welcome "Welcome to Bounce Animation"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will animate a bouncing ball inside a border on your OLED display. This is how simple video games work! Let's build something amazing!

In this lesson, you will draw a box around the edge of the display. Then you will make a ball that bounces off the walls. You will use the `hline` and `vline` functions to draw the box edges.

## How the Ball Moves

The ball has an X position and a Y position. Every loop, you add a small number to X and Y to move the ball. When the ball reaches a wall, you flip the direction by multiplying it by -1.

This is the same math used in old video games like Breakout and Pong.

## Draw a Border

First, let's draw a box around the screen edges. We use four line commands:

- `hline` draws a **horizontal line** (going left-right).
- `vline` draws a **vertical line** (going up-down).

```py
import machine
import utime
from ssd1306 import SSD1306_I2C

# set up I2C wires
sda = machine.Pin(0)             # data wire on GP0
scl = machine.Pin(1)             # clock wire on GP1
i2c = machine.I2C(0, sda=sda, scl=scl)

# screen size in pixels
width  = 128
height = 64

oled = SSD1306_I2C(width, height, i2c)  # create the display object

oled.hline(0, 0,        width - 1,  1)  # top edge: start at (0,0), go right
oled.hline(0, height-1, width - 1,  1)  # bottom edge: start at (0,63), go right
oled.vline(0, 0,        height - 1, 1)  # left edge: start at (0,0), go down
oled.vline(width-1, 0,  height - 1, 1)  # right edge: start at (127,0), go down
oled.show()                              # send the drawing to the screen
```

**What each line does:**

1. `machine.Pin(0)` and `machine.Pin(1)` — set up the two I2C wires.
2. `machine.I2C(0, sda=sda, scl=scl)` — creates the I2C connection.
3. `SSD1306_I2C(width, height, i2c)` — creates the display object.
4. `oled.hline(0, 0, width - 1, 1)` — draws the top edge. Parameters: start x, start y, length, color.
5. `oled.hline(0, height - 1, width - 1, 1)` — draws the bottom edge at y = 63.
6. `oled.vline(0, 0, height - 1, 1)` — draws the left edge. Parameters: x position, start y, length, color.
7. `oled.vline(width - 1, 0, height - 1, 1)` — draws the right edge at x = 127.
8. `oled.show()` — sends the border to the screen.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    `hline(x, y, length, color)` starts at position (x, y) and draws a line going right for `length` pixels. `vline(x, y, length, color)` starts at (x, y) and draws a line going down.

## Make a Ball Bounce Around Inside the Wall

Now let's add a bouncing ball. The ball starts in the center of the screen. Each loop, it moves one pixel. When it reaches a wall, it bounces back.

```py
import machine
import utime
from ssd1306 import SSD1306_I2C

# set up I2C wires
sda = machine.Pin(0)
scl = machine.Pin(1)
i2c = machine.I2C(0, sda=sda, scl=scl)

# screen size in pixels
width  = 128
height = 64
oled   = SSD1306_I2C(width, height, i2c)  # create the display object

oled.fill(0)  # clear to black

# draw the border on all four sides
def draw_border(screen_width, screen_height):
    oled.hline(0, 0,               screen_width - 1,  1)  # top edge
    oled.hline(0, screen_height-1, screen_width - 1,  1)  # bottom edge
    oled.vline(0, 0,               screen_height - 1, 1)  # left edge
    oled.vline(screen_width-1, 0,  screen_height - 1, 1)  # right edge

# draw or erase a small square ball at position (x, y)
def draw_ball(x, y, ball_size, pixel_color):
    if ball_size == 1:
        oled.pixel(x, y, pixel_color)          # draw a single pixel for tiny balls
    else:
        for i in range(0, ball_size):          # loop across the ball width
            for j in range(0, ball_size):      # loop down the ball height
                oled.pixel(x + i, y + j, pixel_color)  # draw one pixel of the ball

draw_border(width, height)  # draw the border before the loop starts

ball_size  = 2              # ball is 2x2 pixels
current_x  = int(width  / 2)  # start the ball in the center (x)
current_y  = int(height / 2)  # start the ball in the center (y)
direction_x = 1             # start moving right (+1) or left (-1)
direction_y = -1            # start moving up (-1) or down (+1)

# bounce forever
while True:
    draw_ball(current_x, current_y, ball_size, 1)  # draw the ball (white)
    oled.show()                                     # update the screen

    draw_ball(current_x, current_y, ball_size, 0)  # erase the ball (black)

    # check the left edge
    if current_x < 2:
        direction_x = 1               # reverse: now move right

    # check the right edge
    if current_x > width - ball_size - 2:
        direction_x = -1              # reverse: now move left

    # check the top edge
    if current_y < 2:
        direction_y = 1               # reverse: now move down

    # check the bottom edge
    if current_y > height - ball_size - 2:
        direction_y = -1              # reverse: now move up

    # move the ball one step
    current_x = current_x + direction_x
    current_y = current_y + direction_y
```

**What each section does:**

1. `draw_border()` — a function that draws the four walls using `hline` and `vline`.
2. `draw_ball(x, y, ball_size, pixel_color)` — draws or erases the ball by setting pixels. Passing `pixel_color = 1` draws it white; `pixel_color = 0` erases it.
3. `direction_x = 1` and `direction_y = -1` — the ball starts moving right and up.
4. `draw_ball(..., 1)` then `oled.show()` then `draw_ball(..., 0)` — this draws the ball, shows it, then erases it. Next loop, the ball appears one pixel over.
5. `if current_x < 2: direction_x = 1` — when the ball reaches the left wall, flip to move right.
6. `current_x = current_x + direction_x` — move the ball by adding the direction number.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    OLED screens can get burn-in if the same image stays on screen too long. Running the bounce animation is fine for a lab session, but do not leave static images on the screen for hours.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try changing `ball_size` to 4 or 6. Try changing `direction_x` and `direction_y` to 2 to make the ball move faster. What happens if you use different speeds for x and y?

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You built a bouncing ball animation! This is the core of how arcade games like Breakout work. Next, you will add a sensor to your display to show real-world data.
