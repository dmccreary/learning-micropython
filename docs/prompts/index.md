# Using Generative AI Prompts to Generate MicroPython Code

This book includes a collection of sample prompts that
can be used to have generative AI tools generate debug and create
working MicroPython code for your project.  We think
that this is a great way to learn MicroPython and we highly
encourage you to use these tools.

Central to getting good working code is "grounding" your generative AI model in the concepts used in this course.  Our goal is to teach computational thinking to students in a fun low-cost way.  Loading our [Learning Graph](../sims/learning-graph/index.md) into your generative AI project is a great way to anchor your responses and avoid hallucinations.  As of this writing (February 2025), both Anthropic Clause and OpenAI ChatGPT support projects.
To use projects you can load our [MicroPython Concepts](https://github.com/dmccreary/learning-micropython/blob/main/data/learning-micropython-concepts.csv) and [Glossary](../glossary.md) into your project area.

## Telling Generative About Your Hardware Configuration

The next step is to load your hardware configuration file into your Generative AI project.
This can be easily done if your project supports our recommended config.py structure.
Here is an example of this config.py file:

```python
NEOPIXEL_PIN = 0
NUMBER_PIXELS = 30
```

## Sample Config File for Cython Board

```python
# Sample hardware configuration file for the Cytron Maker Pi RP2040 board

# SPIN OLED Display Connections
# VCC, GND Clock and Data are on Grove Port 2
SPI_CLK_PIN = 2
SPI_SDA_PIN = 3
# We are using the servo data pins on the Cytron board
SPI_CS_PIN = 13
SPI_DC_PIN = 14
SPI_RESET_PIN = 15

# I2C Connections for the Time of Flight Sensor on Grove Port 1
I2C_BUS = 0
I2C_SDA_PIN = 0 # white Grove wire
I2C_SCL_PIN = 1 # yellow Grove wire
# use the following line to create the I2C object
# i2c=machine.I2C(I2C_BUS,sda=Pin(I2C_SDA_PIN), scl=Pin(I2C_SCL_PIN), freq=400000)

# Speaker Pin
SPEAKER_PIN = 22

# Motor Pins
MOTOR_RIGHT_FORWARD = 11
MOTOR_RIGHT_BACKWARD = 10
MOTOR_LEFT_FORWARD = 8
MOTOR_LEFT_REVERSE = 9
```
