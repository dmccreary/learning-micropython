# HMC5883L Compass Sensor

!!! mascot-welcome "Welcome to Compass Sensing!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab you will give your Pico a sense of direction! A digital compass sensor tells your program which way is north — just like the compass app on your phone. Let's build something amazing!

The **HMC5883L** is a three-axis magnetic sensor. It measures the strength of the magnetic field in three directions (X, Y, and Z). By comparing those three numbers, your code can calculate which direction the sensor is pointing — this is called the **heading**, measured in degrees from 0 to 360.

A heading of 0° means north. 90° means east. 180° means south. 270° means west.

## Parts You Need

- Raspberry Pi Pico
- HMC5883L breakout board
- 4 jumper wires
- Breadboard

## Wiring Steps

The HMC5883L uses the I2C bus, just like many other sensors.

1. Connect **VCC** on the sensor to the **3.3V** pin on the Pico.
2. Connect **GND** on the sensor to any **GND** pin on the Pico.
3. Connect **SDA** on the sensor to **GPIO 12** on the Pico.
4. Connect **SCL** on the sensor to **GPIO 13** on the Pico.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Keep the compass sensor away from motors, speakers, and strong magnets. Nearby magnetic fields will give wrong readings.

## Installing the Driver

Copy the file `hmc5883l.py` from `src/sensors/compass/` to the root folder (or `/lib` folder) on your Pico using Thonny's file manager.

## Lab 1: Reading Raw Magnetic Values

This program reads the raw magnetic field strength in three directions. The numbers do not mean much on their own, but you can use them to verify the sensor is working.

```python
from machine import I2C
from hmc5883l import HMC5883L    # import the compass driver
from time import sleep

# Create the sensor on GPIO 12 (SDA) and GPIO 13 (SCL)
sensor = HMC5883L(scl=13, sda=12)

print("Raw compass values (X, Y, Z)")
print("Rotate the sensor and watch the numbers change.")

while True:
    x, y, z = sensor.read()      # read the three magnetic field values
    print(x, y, z)               # print them to the console
    sleep(0.3)                   # wait 300 milliseconds between readings
```

### What Each Line Does

1. `HMC5883L(scl=13, sda=12)` — creates the sensor, using GPIO 13 for clock and GPIO 12 for data.
2. `sensor.read()` — returns three numbers: X (left-right), Y (forward-back), Z (up-down).
3. `print(x, y, z)` — displays all three values.

Open the Thonny plotter to see the values as a live graph. Rotate the sensor slowly and watch all three lines move.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    When the sensor is flat on the table, the X and Y values change as you rotate it. The Z value barely moves because it measures up-down, and you are not tilting the sensor.

## Lab 2: Calculating a Compass Heading

The **heading** is the direction the sensor points, measured in degrees. The driver calculates this from the X and Y values automatically.

```python
from machine import I2C
from hmc5883l import HMC5883L
from time import sleep

# The 'declination' corrects for the difference between
# magnetic north and true geographic north.
# Look up your local declination at magnetic-declination.com
# Minneapolis, MN example: (0, 71) means 0 degrees, 71 minutes East
sensor = HMC5883L(scl=13, sda=12, declination=(0, 71))

print("Heading in degrees (0=North, 90=East, 180=South, 270=West)")

while True:
    x, y, z = sensor.read()                  # get raw magnetic values
    heading, degrees, minutes = sensor.heading(x, y)  # calculate the heading
    print(f"Heading: {heading:.1f}°")        # print with one decimal place
    sleep(0.5)
```

### What Each Line Does

1. `declination=(0, 71)` — corrects for local magnetic variation. Find yours at `magnetic-declination.com`.
2. `sensor.heading(x, y)` — converts the X and Y values into a heading in degrees (0–360).
3. `f"Heading: {heading:.1f}°"` — formats the number with one decimal place.

Point the sensor in each cardinal direction (north, east, south, west). The heading value should match your phone's compass app within a few degrees.

## Lab 3: Compass Needle on a NeoPixel Ring

This is the most exciting lab! You will show the compass heading on a 24-LED NeoPixel ring. One red pixel acts as the compass needle pointing north.

```python
from machine import I2C, Pin
from hmc5883l import HMC5883L
from time import sleep
from neopixel import NeoPixel

# Set up the compass sensor
sensor = HMC5883L(scl=13, sda=12, declination=(0, 71))

# Set up the NeoPixel ring
NEOPIXEL_PIN = 0          # GPIO pin connected to the ring's data input
NUMBER_PIXELS = 24        # how many LEDs are on the ring
strip = NeoPixel(Pin(NEOPIXEL_PIN), NUMBER_PIXELS)

print("Rotate the sensor — the red pixel shows which way is north.")

while True:
    x, y, z = sensor.read()
    heading = sensor.heading(x, y)[0]      # get just the heading number

    # Convert 0–360 degrees to 0–23 (one step per LED on the ring)
    index = round(heading / 15) - 10       # -10 adjusts for ring orientation
    index = (NUMBER_PIXELS - index) % NUMBER_PIXELS   # wrap around the ring

    # Light one red pixel, turn all others off
    for i in range(NUMBER_PIXELS):
        if i == index:
            strip[i] = (100, 70, 100)     # light this pixel in red-purple
        else:
            strip[i] = (0, 0, 0)         # turn all other pixels off
    strip.write()                         # send the colors to the ring
    sleep(0.5)
```

### What Each Line Does

1. `sensor.heading(x, y)[0]` — gets just the first item (the degree value) from the heading result.
2. `round(heading / 15)` — divides 360 degrees by 24 LEDs = 15 degrees per LED.
3. `(NUMBER_PIXELS - index) % NUMBER_PIXELS` — flips the direction so the needle moves clockwise.
4. `strip[i] = (100, 70, 100)` — sets one pixel to a reddish color (R=100, G=70, B=100).
5. `strip.write()` — sends the new colors to all pixels at once.

## Calibrating Your Compass

Every compass sensor needs calibration. Magnetic fields in buildings, from phone screens, and from power supplies can all shift the readings.

The file `src/sensors/compass/minneapolis-calibration.py` shows how to calibrate. The basic idea is:
1. Slowly rotate the sensor in a full circle.
2. Record the minimum and maximum X and Y values.
3. Subtract those offsets from future readings.

This correction is called **hard iron calibration**. It greatly improves accuracy.

## Experiments

1. Hold the sensor level and walk slowly in a circle. Does the NeoPixel needle keep pointing in the same direction?
2. Bring the sensor close to a magnet (like a fridge magnet). What happens to the heading?
3. Change the needle color from red to a color that matches direction: red for north, yellow for east, green for south, blue for west.
4. Add a second pixel next to the needle pixel, lit in a dimmer color, to make the pointer look bigger.

!!! mascot-celebration "You Have a Compass!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your Pico now knows which way is north! You could use this in a robot that always stays facing a specific direction. Next, you will explore a digital microphone that captures sound.
