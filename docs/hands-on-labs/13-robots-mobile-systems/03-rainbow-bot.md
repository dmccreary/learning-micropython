# Rainbow Bot

![Rainbow Bot Cover Image](../../img/rainbow-bot.gif)

!!! mascot-welcome "Welcome to the Rainbow Bot Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This lab adds a strip of colorful LEDs to your robot. You will program the lights to change color based on what the robot is doing. Let's make your robot shine!

This robot takes the base robot and adds an LED (Light-Emitting Diode) strip arranged in a 12×6 pixel grid. The LEDs display colors and patterns based on what the robot is sensing and doing. For example, a moving rainbow pattern sweeps across the top when the robot drives forward, and the direction reverses when the robot backs up.

The LED strip is easy to connect — it only needs three wires: power, ground, and a data wire.

<iframe width="560" height="315" src="https://www.youtube.com/embed/HZp5nx0aJ40" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

![LED Strip Pico Connections](../../img/led-strip-pico-connections.png)

You can also use longer LED strips and program your own patterns.

## Part 1: Ordering the LED Strip

LED strips come in many lengths, densities, and packaging types. We use 1-meter strips with 60 LEDs per meter. These strips are easy to cut and solder. We like the black background strips. They come in three packaging options:

1. No waterproofing — fine for indoor robots
2. IP65 waterproofing — the strip is coated in silicone rubber to protect it from moisture and dust
3. Full waterproofing — the strip is sealed inside a flexible rubber sleeve

Waterproofed strips cost a little more, but they protect the tiny circuits on the strip better. Note: waterproofing does not mean the strip can be put under water.

A sample place to buy them is [here](https://www.ebay.com/itm/333953423650?hash=item4dc12cd922%3Ag%3AsxcAAOSwND9gYtgi&LH_BIN=1).

![eBay LED Strip Form](../../img/led-strip-ebay-form.png)

You can buy a $3 strip of 60 LEDs and cut it into six pieces of 10 LEDs each. That works out to about 50 cents per segment. Solder short wires to each segment, then add solid 22-gauge wire so the segments plug easily into your breadboard.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    These LED strips are called NeoPixels (a name from Adafruit) or WS2812B LEDs (the manufacturer's name). They are addressable, which means you can set the color of each LED separately using just one data wire.

## Connecting the LED Strips

![Connecting the Rainbow Bot Strips](../../img/rainbow-bot-connecting-strips.jpg)

Wire the LED strip to the Pico. Connect the center pin of the strip connector to Pico pin 0 (upper left corner when the USB port faces up). Connect the GND wire to the ground rail on the breadboard. Connect the 5V wire to the 5-volt power rail.

## Adding a Standoff

![Rainbow Bot Standoff](../../img/rainbow-bot-standoff.jpg)

A standoff is a small metal or plastic spacer. Use standoffs to lift the LED grid above the chassis so the wires have room underneath.

## Upgrading to 9 Volt Power

The base robot uses a 6-volt battery pack (four AA batteries). This robot has 72 RGB (Red, Green, Blue) LEDs that may draw more power. We upgrade to 9 volts by wiring two packs of three batteries together in series. Wiring batteries in series means connecting them end-to-end so their voltages add up. This lets the robot keep running even when the batteries are partly drained.

![Rainbow Bot Underside](../../img/rainbow-bot-underside.jpg)

## 72 Pixel Configuration

Here is a top view of the LEDs shining through the clear plastic chassis top.

![Rainbow Bot Top View](../../img/rainbow-bot-top-view.jpg)

You can see each individual LED. If you add a diffusion layer — a thin piece of white plastic — between the LEDs and the clear top, the colors blend together into a smooth glow.

## Part 2: Making the Connections

The LED strips run on 5 volts. Connect the three wires as follows:

1. Connect the center data wire to pin 0 on the Pico (upper left corner, USB on top).
2. Connect the GND wire to the ground rail on the breadboard.
3. Connect the 5V wire to the 5-volt power rail.

## Part 3: Adding the NeoPixel Library

MicroPython includes a built-in `neopixel` library for basic LED strips. For the 72-pixel matrix with advanced color features, we use the `Neopixel` library (note the capital N). Download it and save it as `neopixel.py` on your Pico.

## Part 4: Testing Your Code

In the first test, make the very first LED on the strip blink red. This confirms your wiring is correct.

```py
import machine, neopixel, time

LED_PIN       = machine.Pin(4)  # data wire connected to pin 4
NUMBER_PIXELS = 12              # how many LEDs are on the strip

np = neopixel.NeoPixel(LED_PIN, NUMBER_PIXELS)  # create the LED strip object

while True:
    np[0] = (255, 0, 0)  # set the first LED to red (R=255, G=0, B=0)
    np.write()           # send the color data to the strip
    time.sleep(1)        # wait 1 second

    np[0] = (0, 0, 0)    # turn the first LED off (all colors to 0)
    np.write()           # send the update
    time.sleep(1)        # wait 1 second
```

#### What each line does

- `neopixel.NeoPixel(LED_PIN, NUMBER_PIXELS)` — creates an object that controls the strip
- `np[0] = (255, 0, 0)` — sets LED number 0 to red using RGB color values
- `np.write()` — sends the color settings to all LEDs at once

## Functions for Drawing on the Matrix

The 72-pixel matrix is 12 columns wide and 6 rows tall. The pixel numbering zigzags. The first row goes 0–11, but the second row goes 23 down to 12 (in reverse order). This zigzag pattern is called a serpentine layout.

```py
import time
from neopixel import Neopixel

numpix = 72                       # total number of pixels
strip = Neopixel(numpix, 0, 0, "GRB")  # create the strip (GRB = Green-Red-Blue color order)

# Define rainbow colors as RGB tuples
red    = (255, 0,   0)
orange = (255, 150, 0)
yellow = (255, 255, 0)
green  = (0,   255, 0)
blue   = (0,   0,   255)
indigo = (75,  0,   130)
violet = (138, 43,  226)
colors = (red, orange, yellow, green, blue, indigo, violet)  # all 7 colors in order

strip.brightness(255)  # set brightness to maximum

def color_wipe():
    """Fill the strip one pixel at a time with each rainbow color."""
    for color in colors:            # loop through each color
        for i in range(numpix):     # loop through each pixel
            strip.set_pixel(i, color)  # set pixel i to the current color
            strip.show()            # update the display
            time.sleep(0.01)        # short pause for animation effect

def color_wipe_2():
    """Fill one column at a time with each rainbow color."""
    for color in colors:
        for i in range(12):         # loop through 12 columns
            # set the same column position in each of the 6 rows
            strip.set_pixel(i,      color)
            strip.set_pixel(i + 12, color)
            strip.set_pixel(i + 24, color)
            strip.set_pixel(i + 36, color)
            strip.set_pixel(i + 48, color)
            strip.set_pixel(i + 60, color)
            strip.show()
            time.sleep(0.01)

def color_wipe_3():
    """Fill columns while accounting for the serpentine row direction."""
    for color in colors:
        for i in range(12):
            strip.set_pixel(i,      color)  # row 1 counts forward
            strip.set_pixel(23 - i, color)  # row 2 counts backward (serpentine)
            strip.set_pixel(i + 24, color)  # row 3 counts forward
            strip.set_pixel(47 - i, color)  # row 4 counts backward
            strip.set_pixel(48 + i, color)  # row 5 counts forward
            strip.set_pixel(71 - i, color)  # row 6 counts backward
            strip.show()
            time.sleep(0.3)

def color_wipe_4(offset, direction):
    """Draw a rainbow column pattern that can move forward or backward."""
    for i in range(12):
        if direction == 1:
            this_color = colors[(i - offset) % 7]   # shift colors forward
        else:
            this_color = colors[(i + offset) % 7]   # shift colors backward
        strip.set_pixel(i,      this_color)
        strip.set_pixel(23 - i, this_color)
        strip.set_pixel(i + 24, this_color)
        strip.set_pixel(47 - i, this_color)
        strip.set_pixel(48 + i, this_color)
        strip.set_pixel(71 - i, this_color)
        strip.show()

while True:
    for counter in range(100):
        color_wipe_4(counter % 7, 1)   # animate the rainbow moving forward
    for counter in range(100):
        color_wipe_4(counter % 7, -1)  # animate the rainbow moving backward
```

#### What each line does (color_wipe_4)

- `offset` — controls which color appears first in each column
- `direction` — 1 moves the rainbow one way, -1 moves it the other way
- `% 7` — wraps the offset back to 0 after it reaches 7 (there are 7 colors)

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Start with `strip.brightness(20)` instead of 255 when filming the robot — full brightness washes out the camera. You can turn it up to 255 for normal use.

## Full Source Code

This combines motor control, the distance sensor, and the LED animation. The rainbow moves forward while the robot drives forward. When the robot detects an obstacle, it backs up, the rainbow reverses direction, and the robot turns.

main.py

```py
from machine import Pin, PWM
from time import sleep
import machine
import VL53L0X        # time-of-flight distance sensor driver
from neopixel import Neopixel  # addressable LED driver

# --- Motor pins ---
RIGHT_FORWARD_PIN = 19
RIGHT_REVERSE_PIN = 18
LEFT_FORWARD_PIN  = 20
LEFT_REVERSE_PIN  = 21

right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse  = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward   = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse   = PWM(Pin(LEFT_REVERSE_PIN))

# --- Distance sensor ---
sda = machine.Pin(16)
scl = machine.Pin(17)
i2c = machine.I2C(0, sda=sda, scl=scl)
tof = VL53L0X.VL53L0X(i2c)  # create the sensor object
tof.start()  # wake up the sensor

# --- On-board LED ---
led_onboard = machine.Pin(25, machine.Pin.OUT)

# --- LED strip ---
numpix = 72
strip = Neopixel(numpix, 0, 0, "GRB")
strip.brightness(20)  # low brightness for video; raise to 255 for normal use

# --- Driving parameters ---
POWER_LEVEL    = 30000  # motor speed (20000 to 65025)
TURN_THRESHOLD = 400    # distance in mm at which the robot turns
TURN_TIME      = 0.25   # seconds spent turning
BACKUP_TIME    = 0.75   # seconds spent backing up

# --- Rainbow colors ---
red    = (255, 0,   0)
orange = (255, 165, 0)
yellow = (255, 255, 0)
green  = (0,   255, 0)
blue   = (0,   0,   255)
indigo = (75,  0,   130)
violet = (138, 43,  226)
colors = (red, orange, yellow, green, blue, indigo, violet)

# --- Motor control functions ---

def turn_motor_on(pwm):
    pwm.duty_u16(POWER_LEVEL)  # set motor to the chosen power level

def turn_motor_off(pwm):
    pwm.duty_u16(0)  # stop the motor

def forward():
    turn_motor_on(right_forward)
    turn_motor_on(left_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_reverse)

def reverse():
    turn_motor_on(right_reverse)
    turn_motor_on(left_reverse)
    turn_motor_off(right_forward)
    turn_motor_off(left_forward)

def turn_right():
    turn_motor_on(right_forward)
    turn_motor_on(left_reverse)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)

def turn_left():
    turn_motor_on(right_reverse)
    turn_motor_on(left_forward)
    turn_motor_off(right_forward)
    turn_motor_off(left_reverse)

def stop():
    turn_motor_off(right_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)
    turn_motor_off(left_reverse)
    for i in range(numpix):
        strip.set_pixel(i, violet)  # turn all LEDs violet when stopped
    strip.show()

# --- Sensor function ---

def read_sensor_avg():
    """Read the distance sensor 10 times and return the average."""
    total = 0
    for i in range(10):
        total = total + tof.read()
        sleep(0.01)
    return int(total / 10)

# --- LED animation function ---

def color_wipe_4(offset, direction):
    """Animate a moving rainbow column pattern on the LED matrix."""
    for i in range(12):
        if direction == 1:
            this_color = colors[(i - offset) % 7]   # forward rainbow shift
        else:
            this_color = colors[(i + offset) % 7]   # backward rainbow shift
        strip.set_pixel(i,      this_color)
        strip.set_pixel(23 - i, this_color)
        strip.set_pixel(i + 24, this_color)
        strip.set_pixel(47 - i, this_color)
        strip.set_pixel(48 + i, this_color)
        strip.set_pixel(71 - i, this_color)
        strip.show()

# --- Main loop ---

counter = 0  # tracks the animation frame for the rainbow

while True:
    dist = read_sensor_avg()  # read the average distance

    if dist < TURN_THRESHOLD:   # obstacle detected
        print('object detected')
        reverse()  # start backing up

        # animate the rainbow backward while reversing
        for _ in range(5):
            color_wipe_4(counter % 7, -1)
            sleep(0.1)
            counter += 1

        # turn right while continuing the reversed rainbow
        turn_right()
        for _ in range(3):
            color_wipe_4(counter % 7, -1)
            sleep(0.1)
            counter += 1

    else:  # path is clear
        forward()
        color_wipe_4(counter % 7, 1)  # rainbow moves forward while driving forward

    counter += 1  # advance the animation frame
```

[Rainbow Bot Source Code on GitHub](https://github.com/CoderDojoTC/micropython/tree/main/src/robots/rainbow-bot)

## References

1. MicroPython [NeoPixel Library](https://docs.micropython.org/en/v1.15/esp8266/tutorial/neopixel.html)

!!! mascot-celebration "Amazing Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your robot now lights up with a moving rainbow! You combined motor control, distance sensing, and LED animation all in one program. That is a big achievement — great job!
