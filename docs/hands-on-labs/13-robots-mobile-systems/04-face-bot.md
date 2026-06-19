# MicroPython FaceBot

!!! mascot-welcome "Welcome to the FaceBot Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Robots are much more fun when they have faces! In this lab you will draw simple emoji-style faces on the OLED display on the front of your robot. You can even give your robot different expressions depending on what it is doing. Let's build something amazing!

## What Is the FaceBot?

The **FaceBot** is a robot that displays cartoon faces on a small OLED screen mounted at the front. OLED stands for Organic Light-Emitting Diode — it is a tiny, bright display that works great on robots. The faces change to show the robot's "mood" or current state:

- **Happy face** — when the robot is driving normally
- **Surprised face** — when it detects an obstacle
- **Sleeping face** — when the robot is idle

We are inspired by the expressive faces on robots like Cozmo:

![Cozmo Faces](../../img/cozmo-faces.png)

## What You Need

| Part | Purpose |
|------|---------|
| Maker Pi RP2040 robot | The base robot with motors and controller |
| 128×64 OLED display (I2C) | Shows the face — connect to the Grove I2C port |
| `ssd1306.py` driver | Library for drawing on the OLED |

Make sure the `ssd1306.py` driver file is saved on your Pico before you run any code. You can find it in the `src/drivers/` folder of this project.

## Setting Up the OLED Display

Connect the OLED display to the I2C Grove port on the Maker Pi RP2040. I2C (Inter-Integrated Circuit) is a way to connect devices using just two wires.

Wire the OLED display using these steps:

1. Connect the OLED **GND** pin to any **GND** pin on the board.
2. Connect the OLED **VCC** pin to the **3.3 V** pin on the board.
3. Connect the OLED **SDA** pin to **GP0** (the I2C data pin).
4. Connect the OLED **SCL** pin to **GP1** (the I2C clock pin).

| OLED Pin | Maker Pi RP2040 |
|----------|-----------------|
| GND | GND |
| VCC | 3.3 V |
| SDA | GP0 (I2C SDA) |
| SCL | GP1 (I2C SCL) |

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    `oled.fill(0)` sets every pixel to black (off). `oled.pixel(x, y, 1)` turns one pixel white (on). `oled.show()` sends the whole drawing to the screen at once — nothing appears until you call `show()`.

## Drawing a Happy Face

The OLED screen is 128 pixels wide and 64 pixels tall. You draw faces using circles, lines, and filled rectangles. Pixels are the tiny dots that make up the screen. Each pixel can be on (white) or off (black).

```python
from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import time

# Set up the I2C bus and the OLED display
i2c = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)  # I2C bus 0, 400,000 Hz speed
oled = SSD1306_I2C(128, 64, i2c)                    # 128-wide, 64-tall display

def clear():
    """Clear the screen by turning all pixels off."""
    oled.fill(0)  # fill every pixel with black (0 = off)

def show_happy_face():
    """Draw a happy face in the center of the screen."""
    clear()

    # Draw the head outline — a rectangle of single pixels
    for x in range(30, 99):
        oled.pixel(x, 5,  1)  # top edge of the head
        oled.pixel(x, 58, 1)  # bottom edge of the head
    for y in range(5, 59):
        oled.pixel(29, y, 1)  # left edge of the head
        oled.pixel(98, y, 1)  # right edge of the head

    # Draw the eyes as two small filled rectangles
    oled.fill_rect(44, 18, 8, 10, 1)  # left eye  (x=44, y=18, 8 pixels wide, 10 tall)
    oled.fill_rect(76, 18, 8, 10, 1)  # right eye (x=76, y=18, 8 pixels wide, 10 tall)

    # Draw the smile using a curved line of individual pixels
    for x in range(0, 30):
        y = int(0.03 * (x - 15) ** 2 + 38)  # parabola formula for a curved smile
        oled.pixel(49 + x, y, 1)            # place each pixel of the smile

    oled.show()  # send the entire drawing to the screen (required to see it)

show_happy_face()  # call the function to draw the face
```

#### What each line does

- `I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)` — sets up the I2C bus on pins 0 and 1 at 400 kHz
- `SSD1306_I2C(128, 64, i2c)` — creates the display object for a 128×64 OLED
- `oled.fill(0)` — clears the screen (all pixels off)
- `oled.pixel(x, y, 1)` — turns on one pixel at position (x, y)
- `oled.fill_rect(x, y, w, h, 1)` — draws a filled rectangle
- `oled.show()` — sends the drawing to the screen

## Drawing a Surprised Face

```python
def show_surprised_face():
    """Draw a surprised open-mouth face."""
    clear()

    # Head outline — same as the happy face
    for x in range(30, 99):
        oled.pixel(x, 5,  1)
        oled.pixel(x, 58, 1)
    for y in range(5, 59):
        oled.pixel(29, y, 1)
        oled.pixel(98, y, 1)

    # Wide round eyes — rectangle outlines (not filled)
    oled.rect(42, 16, 12, 12, 1)  # left eye outline
    oled.rect(74, 16, 12, 12, 1)  # right eye outline

    # Round open mouth — an ellipse (oval shape)
    oled.ellipse(64, 46, 10, 8, 1)  # centered at (64, 46), 10 wide, 8 tall

    oled.show()
```

#### What each line does

- `oled.rect(x, y, w, h, 1)` — draws an empty rectangle outline (not filled)
- `oled.ellipse(cx, cy, rx, ry, 1)` — draws an oval centered at (cx, cy)

## Drawing a Sleeping Face

```python
def show_sleeping_face():
    """Draw a sleeping face with closed eyes and a flat mouth."""
    clear()

    # Head outline
    for x in range(30, 99):
        oled.pixel(x, 5,  1)
        oled.pixel(x, 58, 1)
    for y in range(5, 59):
        oled.pixel(29, y, 1)
        oled.pixel(98, y, 1)

    # Closed eyes — short horizontal lines
    oled.hline(42, 23, 12, 1)  # left eye closed (horizontal line, 12 pixels wide)
    oled.hline(74, 23, 12, 1)  # right eye closed

    # Neutral flat mouth — a horizontal line
    oled.hline(54, 44, 20, 1)  # mouth, 20 pixels wide

    oled.show()
```

#### What each line does

- `oled.hline(x, y, length, 1)` — draws a horizontal line starting at (x, y)

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try adding a winking face by drawing only the right eye closed. You can also use `oled.text("HI!", 48, 28, 1)` to add a speech bubble word on the screen!

## Animating the Faces

Connect the face functions to your motor code. The robot changes expression based on what it is doing:

```python
import time

# Show sleeping face while the robot waits to start
show_sleeping_face()
time.sleep(2)        # wait 2 seconds

# Show happy face while the robot is driving
show_happy_face()
# ... motor drive code goes here ...
time.sleep(3)        # drive for 3 seconds

# Show surprised face when the robot detects an obstacle
show_surprised_face()
# ... obstacle avoidance code goes here ...
time.sleep(1)        # hold the surprised face for 1 second

# Return to happy face after avoiding the obstacle
show_happy_face()
```

#### What each line does

- `show_sleeping_face()` — calls the function that draws the sleeping face
- `time.sleep(2)` — pauses the program for 2 seconds before doing the next step
- Replace the `# ... code goes here ...` comments with your actual motor commands

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Drawing faces with individual pixels takes a bit of patience. If your face looks wrong at first, change the x and y coordinates a little at a time. That is exactly how game artists work!

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your robot can now show emotions! Try combining the FaceBot code with the collision avoidance robot so the face automatically changes when the robot spots an obstacle.

## References

1. [SSD1306 MicroPython Driver (GitHub)](https://github.com/micropython/micropython-lib/tree/master/micropython/drivers/display/ssd1306)
2. [MicroPython FrameBuffer Documentation](https://docs.micropython.org/en/latest/library/framebuf.html)
3. [Cozmo Robot (for inspiration)](https://www.digitaldreamlabs.com/pages/cozmo)
