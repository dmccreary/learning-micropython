# Sensors in MicroPython

!!! mascot-welcome "Welcome to the Sensors Section"
    ![Monty waving welcome](../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Sensors are how your microcontroller feels the world around it. You will connect
    sensors that measure light, temperature, distance, and motion. Let's build
    something amazing!

## What Is a Sensor?

A **sensor** is an electronic part that measures something in the real world and
turns that measurement into an electrical signal your Pico can read.

Here are some examples:

| Sensor | What It Measures |
|--------|-----------------|
| Photoresistor | How bright the light is |
| DHT11 | Temperature and humidity |
| HC-SR04 | Distance to an object |
| Rotary encoder | How far a knob has turned |
| Gesture sensor | Hand movements near the device |

## Analog vs. Digital Sensors

Sensors come in two main types:

**Analog sensors** output a voltage that changes smoothly. A photoresistor, for
example, outputs a high voltage in bright light and a low voltage in the dark.
Your Pico reads these with its **Analog-to-Digital Converter (ADC)** pins.

**Digital sensors** send data as numbers using a communication protocol such as
**I2C** or **SPI**. Temperature and humidity sensors like the DHT11 use a simple
one-wire digital signal.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of an analog sensor like a dimmer switch — the output can be any value
    in a range. A digital sensor is more like a text message — it sends you an
    exact number.

## How to Read an Analog Sensor

The Raspberry Pi Pico has three ADC pins: **GP26**, **GP27**, and **GP28**.
Connect your analog sensor's output wire to one of these pins.

```python
from machine import ADC
import time

# Connect a photoresistor (light sensor) to GP26
light_sensor = ADC(26)

while True:
    # Read the sensor — returns a value from 0 (dark) to 65535 (bright)
    reading = light_sensor.read_u16()
    print("Light level:", reading)
    time.sleep(0.5)
```

## How to Read a Digital Sensor

Digital sensors on the I2C bus use two wires: **SDA** (data) and **SCL** (clock).
On the Pico, GP0 is SDA and GP1 is SCL by default for I2C bus 0.

```python
from machine import Pin, I2C

# Set up the I2C bus
i2c = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)

# Scan to see what devices are connected
devices = i2c.scan()
print("I2C devices found:", [hex(d) for d in devices])
```

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../img/mascot/tip.png){ class="mascot-admonition-img" }
    Run the I2C scan code first whenever you connect a new sensor. It shows you
    the sensor's **address** — a number your code uses to talk to that specific
    device on the bus.

## What's in This Section

The labs in this section walk you through the most common sensors used in
MicroPython projects:

- **[Light Sensor](02-photosensor.md)** — read light levels with a photoresistor
- **[Ping Distance](03-ping.md)** — measure distance with an ultrasonic sensor
- **[Temperature and Humidity](04-temp-dht11.md)** — use the DHT11 sensor
- **[BME280](06-bme280.md)** — measure temperature, humidity, and air pressure
- **[Rotary Encoder](10-rotary-encoder.md)** — detect knob rotation
- **[Gesture Sensor](13-gesture.md)** — detect hand swipes and taps

Work through the labs in order, or jump to the sensor you need for your project.

!!! mascot-celebration "Let's Go!"
    ![Monty celebrating](../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Each lab in this section has a wiring diagram, sample code, and challenges to
    extend what you build. You are about to make your Pico feel the world — that
    is one of the coolest things in all of electronics!
