# MicroPython FaceBot

!!! mascot-welcome "Welcome to the FaceBot Lab"
    ![Monty waving welcome](../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Robots are much more fun when they have faces! In this lab you will draw
    simple emoji-style faces on the OLED display on the front of your robot.
    You can even give your robot different expressions depending on what it is doing.
    Let's build something amazing!

## What Is the FaceBot?

The **FaceBot** is a robot that displays cartoon faces on a small OLED screen
mounted at the front. The faces change to show the robot's "mood" or state:

- **Happy face** — when the robot is driving normally
- **Surprised face** — when it detects an obstacle
- **Sleeping face** — when the robot is idle

We are inspired by the expressive faces on robots like Cozmo:

![Cozmo Faces](../img/cozmo-faces.png)

## What You Need

| Part | Purpose |
|------|---------|
| Maker Pi RP2040 robot | The base robot with motors and controller |
| 128×64 OLED display (I2C) | Shows the face — connect to the Grove I2C port |
| `ssd1306.py` driver | Library for drawing on the OLED |

Make sure the `ssd1306.py` driver file is saved on your Pico before running
any code. You can find it in the `src/drivers/` folder of this project.

## Setting Up the OLED Display

The OLED connects to the I2C Grove port on the Maker Pi RP2040:

| OLED Pin | Maker Pi RP2040 |
|----------|-----------------|
| GND | GND |
| VCC | 3.3 V |
| SDA | GP0 (I2C SDA) |
| SCL | GP1 (I2C SCL) |

## Drawing a Happy Face

The OLED screen is 128 pixels wide and 64 pixels tall. You draw faces using
circles, lines, and filled rectangles.

```python
from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import time

# Set up the I2C bus and OLED display
i2c = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)
oled = SSD1306_I2C(128, 64, i2c)

def clear():
    """Clear the screen."""
    oled.fill(0)

def show_happy_face():
    """Draw a happy face in the center of the screen."""
    clear()
    # Outline of the head (circle approximated with an ellipse using lines)
    for x in range(30, 99):
        oled.pixel(x, 5, 1)   # top arc
        oled.pixel(x, 58, 1)  # bottom arc
    for y in range(5, 59):
        oled.pixel(29, y, 1)  # left side
        oled.pixel(98, y, 1)  # right side

    # Eyes — two small filled rectangles
    oled.fill_rect(44, 18, 8, 10, 1)  # left eye
    oled.fill_rect(76, 18, 8, 10, 1)  # right eye

    # Smile — a curved line using individual pixels
    for x in range(0, 30):
        # parabola curve for the smile
        y = int(0.03 * (x - 15) ** 2 + 38)
        oled.pixel(49 + x, y, 1)

    oled.show()  # send the drawing to the screen

show_happy_face()
```

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../img/mascot/thinking.png){ class="mascot-admonition-img" }
    `oled.fill(0)` sets every pixel to black (off). `oled.pixel(x, y, 1)` turns
    one pixel white (on). `oled.show()` sends the whole drawing to the screen at
    once — nothing appears until you call `show()`.

## Drawing a Surprised Face

```python
def show_surprised_face():
    """Draw a surprised open-mouth face."""
    clear()
    # Head outline (same as happy face)
    for x in range(30, 99):
        oled.pixel(x, 5, 1)
        oled.pixel(x, 58, 1)
    for y in range(5, 59):
        oled.pixel(29, y, 1)
        oled.pixel(98, y, 1)

    # Wide round eyes
    oled.rect(42, 16, 12, 12, 1)  # left eye outline
    oled.rect(74, 16, 12, 12, 1)  # right eye outline

    # Round open mouth
    oled.ellipse(64, 46, 10, 8, 1)  # open-mouth oval

    oled.show()
```

## Drawing a Sleeping Face

```python
def show_sleeping_face():
    """Draw a sleeping face with closed eyes."""
    clear()
    # Head outline
    for x in range(30, 99):
        oled.pixel(x, 5, 1)
        oled.pixel(x, 58, 1)
    for y in range(5, 59):
        oled.pixel(29, y, 1)
        oled.pixel(98, y, 1)

    # Closed eyes — horizontal lines
    oled.hline(42, 23, 12, 1)  # left eye (closed)
    oled.hline(74, 23, 12, 1)  # right eye (closed)

    # Small straight mouth
    oled.hline(54, 44, 20, 1)  # neutral mouth

    oled.show()
```

## Animating the Faces

Put the faces together with motor commands so the robot changes expression
based on what it is doing:

```python
import time

# Show sleeping face while waiting to start
show_sleeping_face()
time.sleep(2)

# Show happy face while driving
show_happy_face()
# ... motor drive code goes here ...
time.sleep(3)

# Show surprised face when obstacle detected
show_surprised_face()
# ... obstacle avoidance code goes here ...
time.sleep(1)

# Back to happy
show_happy_face()
```

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try adding a **winking face** by drawing only the right eye closed. You can
    also use `oled.text("HI!", 48, 28, 1)` to add a speech bubble with a word
    on the screen!

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Drawing faces with individual pixels takes a bit of patience. If your face
    looks wrong at first, try changing the x and y coordinates a little at a time.
    That is exactly how game artists work!

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your robot can now show emotions! Try combining the FaceBot code with the
    collision avoidance robot so the face automatically changes when the robot
    spots an obstacle.

## References

1. [SSD1306 MicroPython Driver (GitHub)](https://github.com/micropython/micropython-lib/tree/master/micropython/drivers/display/ssd1306)
2. [MicroPython FrameBuffer Documentation](https://docs.micropython.org/en/latest/library/framebuf.html)
3. [Cozmo Robot (for inspiration)](https://www.digitaldreamlabs.com/pages/cozmo)
