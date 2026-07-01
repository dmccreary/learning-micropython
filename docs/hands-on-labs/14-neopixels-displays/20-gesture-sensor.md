# APDS9960 Gesture and Light Sensor

!!! mascot-welcome "Welcome to Gesture Sensing!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    What if your Pico could sense a wave of your hand? In this lab, you will connect a sensor that detects gestures, measures how close objects are, and reads the color of light. Let's build something amazing!

The **APDS9960** is a small chip that can do several things at once. It detects gestures (swipe left, swipe right, swipe up, swipe down), measures how close objects are, and reads the color of the light around it. This same chip is used in many smartphones to turn off the screen when you hold the phone to your ear.

## Parts You Need

- Raspberry Pi Pico
- APDS9960 breakout board (such as the Adafruit APDS9960 or a compatible module)
- 4 jumper wires
- Breadboard

## How It Connects

The APDS9960 uses the I2C bus (pronounced "eye-squared-see"). I2C is a way for the Pico to talk to many sensors using just two wires: a clock wire (SCL) and a data wire (SDA).

### Wiring Steps

1. Connect the sensor's **VCC** pin to the Pico's **3.3V** pin.
2. Connect the sensor's **GND** pin to any **GND** pin on the Pico.
3. Connect the sensor's **SDA** pin to **GPIO 12** on the Pico.
4. Connect the sensor's **SCL** pin to **GPIO 13** on the Pico.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The APDS9960 runs at 3.3V, not 5V. Always connect VCC to the Pico's 3.3V pin — never to the VBUS (5V) pin. Using 5V will damage the sensor permanently.

## Installing the Driver

The APDS9960 needs a driver library to work. Copy the file `APDS9960LITE.py` from `src/sensors/gesture/` to your Pico's root folder (or its `/lib` folder).

You can do this with Thonny's file manager:
1. Open Thonny and connect to your Pico.
2. Open the **Files** panel (View → Files).
3. Find `APDS9960LITE.py` on your computer.
4. Right-click it and choose **Upload to /**.

## Lab 1: Measuring Proximity

Proximity tells you how close an object is. The sensor shines invisible infrared light and measures how much bounces back. A higher number means the object is closer.

```python
import machine
from time import sleep, sleep_ms
from APDS9960LITE import APDS9960LITE   # import the sensor driver

# Set up the I2C bus on GPIO 12 (SDA) and GPIO 13 (SCL)
sda = machine.Pin(12)
scl = machine.Pin(13)
i2c = machine.I2C(0, sda=sda, scl=scl, freq=400000)  # 400 kHz speed

# Create the sensor object
apds9960 = APDS9960LITE(i2c)

# Turn on the proximity sensor
apds9960.prox.enableSensor()

print("Hold objects near the sensor and watch the number change.")
print("Closer objects give higher numbers (0 to 255).")

while True:
    sleep(0.1)                                       # wait for a reading to be ready
    level = apds9960.prox.proximityLevel             # read the proximity value
    print("Proximity:", level)                       # print it to the console
```

### What Each Line Does

1. `machine.I2C(0, sda=sda, scl=scl, freq=400000)` — sets up the I2C bus at 400,000 bits per second.
2. `APDS9960LITE(i2c)` — creates the sensor object using that I2C bus.
3. `apds9960.prox.enableSensor()` — turns on the infrared emitter inside the sensor.
4. `apds9960.prox.proximityLevel` — reads the current proximity value (0 = far, 255 = very close).

Move your hand toward and away from the sensor. You will see the number change in the Thonny console. At about 5 cm distance, typical values are between 50 and 200.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The sensor uses infrared (IR) light — the same kind TV remotes use. Your eyes cannot see it, but the sensor can detect the reflection.

## Lab 2: Reading Ambient Light and Color

The sensor can measure the brightness and color of the light around it. It reads four values: overall brightness (ambient light level), and separate red, green, and blue channels.

```python
import machine
from time import sleep, sleep_ms
from APDS9960LITE import APDS9960LITE

sda = machine.Pin(12)
scl = machine.Pin(13)
i2c = machine.I2C(0, sda=sda, scl=scl, freq=400000)

apds9960 = APDS9960LITE(i2c)

# Turn on the ambient light and color sensor (ALS = Ambient Light Sensor)
apds9960.als.enableSensor()
sleep_ms(25)             # wait 25 milliseconds for the first reading to be ready

print("Shine different colored lights at the sensor.")
print("Format: Ambient  Red  Green  Blue")

while True:
    ambient = apds9960.als.ambientLightLevel   # total brightness
    red     = apds9960.als.redLightLevel       # red channel only
    green   = apds9960.als.greenLightLevel     # green channel only
    blue    = apds9960.als.blueLightLevel      # blue channel only

    print(ambient, red, green, blue)           # print all four values
    sleep(0.1)
```

### What Each Line Does

1. `apds9960.als.enableSensor()` — turns on the color-sensing part of the chip.
2. `sleep_ms(25)` — waits 25 milliseconds for the sensor to warm up.
3. `apds9960.als.ambientLightLevel` — reads the overall brightness (higher = brighter).
4. `apds9960.als.redLightLevel` — reads only the red part of the light.

Try shining a red phone flashlight at the sensor. The red value should be much higher than green or blue. Try a blue light and compare. Use the Thonny plotter (View → Plotter) to see all four channels as a live graph.

## Lab 3: Combining Proximity and Color

This program uses proximity to decide when to measure color. When something is close, it reads and prints the color. When nothing is nearby, it stays quiet.

```python
import machine
from time import sleep, sleep_ms
from APDS9960LITE import APDS9960LITE

sda = machine.Pin(12)
scl = machine.Pin(13)
i2c = machine.I2C(0, sda=sda, scl=scl, freq=400000)

apds9960 = APDS9960LITE(i2c)

apds9960.prox.enableSensor()     # turn on proximity sensing
apds9960.als.enableSensor()      # turn on color sensing
sleep_ms(25)

NEAR_THRESHOLD = 50              # readings above this mean an object is close

while True:
    prox = apds9960.prox.proximityLevel   # check how close something is

    if prox > NEAR_THRESHOLD:            # only read color when close enough
        red   = apds9960.als.redLightLevel
        green = apds9960.als.greenLightLevel
        blue  = apds9960.als.blueLightLevel
        print(f"Object nearby! R={red}  G={green}  B={blue}")
    else:
        print("Waiting...")              # nothing close enough to measure

    sleep(0.2)
```

## Experiments

1. In Lab 1, add an LED to GPIO 15. Turn the LED on when the proximity value is above 100. This is how phones wake their screen when you pick them up.
2. In Lab 2, open the Thonny plotter and wave a piece of red paper, then a green paper in front of the sensor. Watch how the three color channels respond differently.
3. In Lab 3, change `NEAR_THRESHOLD` to different values. How close does your hand need to be at each threshold setting?
4. Point the sensor at sunlight through a window, then at a fluorescent light, then at an LED flashlight. How do the color readings differ for each light source?

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have built a proximity detector and a color reader! In the next lab, you will add a compass sensor that tells your Pico which way is north.
