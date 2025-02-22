# Learning Micropython Glossary of Terms

<!-- Link to this by using [TERM](glossary#term-id 
The format is used to generate a concept graph for this course.

Sample Prompt:
Create a Glossy of Terms for a high school class.
Return the results in alphabetical order using raw
markdown format with each term being in a
level 4 header and the definition text in the body.
Include terms related to batteries, buttons, displays,
microcontrollers, programming, python, MicroPython,
sensors, displays, potentiometers, LEDs, neopixels,
DC motors, motor controllers, PWM, interrupts, and debugging.
-->


#### Abstraction

A cognitive process of reducing complexity by focusing on the essential features of a concept, system, or problem while omitting unnecessary details.

**Example:** In our example programs we hide the unnecessary details of the specific hardware
configuration of a project by putting all the hardware pin numbers in a config.py file.

#### Algorithms

A step-by-step procedure or set of rules for solving a problem or accomplishing a task. 

In MicroPython, this includes both software algorithms and the logic for controlling hardware components.

#### Ampy

An obsolete MicroPython support tool created by Adafruit but no longer supported.  Please
see the [mpremote](#mpremote) tool for the current best practice.

#### Analog to Digital Converter

A component that takes an analogue signal and changes it to a digital one.

Every ADC has two parameters, its [resolution](#resolution), measured in digital bits, and its [channels](#channels), or how many analogue signals it can accept and convert at once.

* Also know as: ADC

#### Blit

A special form of copy operation; it copies a rectangular area of pixels from one framebuffer to another.  It is used in MicroPython when doing drawing to a display such as an OLED display.

#### BOOTSEL
A button on the pico that when pressed during power up will allow you to mount the device as a USB drive.  You can then drag-and-drop any uf2 image file to reset or update the runtime libraries.

![](../img/boot-selection.png)

* Also known as: Boot Selection

#### Castellated Edge

Plated through holes or vias located in the edges of a printed circuit board that make it easier to solder onto another circuit board.

![](../img/castellated-edge.png)

The word "Castellated" means having grooves or slots on an edge and is derived from the turrets of a castle.

The Raspberry Pi Pico uses castellated edges so that it can be used with headers on a breadboard
or soldered directly to a PC board.  This is the most flexible way to manufacturing boards today.

#### Computational Thinking

A problem-solving approach that involves breaking down complex problems into smaller, more manageable parts using fundamental concepts from computer science. It encompasses four key components:

1.  [Decomposition](#decomposition) - Breaking problems into smaller, more manageable parts
2.  [Pattern Recognition](#pattern-recognition) - Identifying similarities or patterns among problems
3.  [Abstraction](#abstraction) - Focusing on important information while ignoring irrelevant details
4.  [Algorithms](#algorithms) - Developing step-by-step solutions that can be understood by both humans and computers

For example: When creating a MicroPython project to monitor room temperature, computational thinking would involve:

-   Decomposing the task into reading sensor data, processing measurements, and displaying results
-   Recognizing patterns in temperature changes over time
-   Abstracting away hardware-specific details into configuration files
-   Designing algorithms to convert raw sensor data into meaningful temperature readings

#### Debugging Strategies

Systematic approaches to finding and fixing errors in both software and hardware configurations, including using print statements, LED indicators, and serial monitoring.

Our course uses the [Thonny](#thonny) Integrated Development Environment (IDE) which has extensive tools to help with debugging including the ability to set breakpoints and examine state variables.

* See our [Debugging](../debugging/index.md) section for tips on debugging MicroPython with Thonny.

#### Decomposition

The process of breaking down complex problems into smaller, more manageable parts that can be solved independently. 

**Example:** In a MicroPython program, this could involve separating hardware initialization, sensor reading, and display updating into distinct functions or modules.

Decomposition is a fundamental skill for not just programmers, but also for [prompt engineers](../prompts/index.md) using generative AI models.  A good decomposition prompt is "Please break this project down into discrete steps."

#### Dupont Connectors

Pre-made low-cost used and used to connect breadboards to hardware such as sensors and displays.

The connectors are available in male and female ends and are typically sold in lengths of 10 or 20cm.  They have a with a 2.54mm (100mill) pitch so they are easy to align with our standard breadboards.  They are typically sold in a ribbon of mixed colors for around $2.00 US for 40 connectors.

* Also known as: Jumper Wires
* [Sample eBay Search for Jumper Wires](https://www.ebay.com/sch/92074/i.html?_from=R40&_nkw=jumper+wire+cables)


#### ESP32
A series of low-cost, low-power system on a chip microcontrollers with integrated Wi-Fi and dual-mode Bluetooth.

Typical costs for the ESP32 is are around $10 US on eBay.

* [Sample on eBay](https://www.ebay.com/itm/ESP32-ESP-32S-NodeMCU-Development-Board-2-4GHz-WiFi-Bluetooth-Dual-Mode-CP2102/392899357234) $5
* [Sample on Amazon](https://www.amazon.com/HiLetgo-ESP-WROOM-32-Development-Microcontroller-Integrated/dp/B0718T232Z/ref=sr_1_1_sspa) $11
* [Sample on SparkFun](https://www.sparkfun.com/products/13907) $21
* [ESP32 Quick Reference](http://docs.micropython.org/en/latest/esp32/quickref.html)
* [Sample eBay Search for ESP32 from $5 to $20](https://www.ebay.com/sch/i.html?_from=R40&_nkw=esp32&_sacat=175673&LH_TitleDesc=0&LH_BIN=1&_udhi=20&rt=nc&_udlo=5)

#### Formatted Strings

The ability to use a simplified syntax to format strings by added the letter "f" before the string.  Values within curly braces are formatted from variables.

```py
name = "Lisa"
age = 12
f"Hello, {name}. You are {age}."
```

returns

```
Hello, Lisa. You are 12.
```

Formatted string support was added to MicroPython in release 1.17.  Most formats work except the date and time formats.  For these we must write our own formatting functions.

* Also known as: f-strings
* Also known as: Literal String Interpolation
* From Python Enhancement Proposal: PEP 498
* [Official Python documentation on string formatting](https://docs.python.org/3/library/string.html#string-formatting)
* Link to Formatted Strings Docs: [formatted strings](https://www.python.org/dev/peps/pep-0498/)
* PyFormat library for formatting strings: [PyFormat.info](https://pyformat.info/)

#### Framebuffer

A region of your microcontroller RAM that stores a bitmap image of your display.

For a 128X64 monochrome display this would be 128 * 64 = 8,192 bits or 1,024 bytes (1K).  Color displays must store up to 8 bytes per color for each color (red, green and blue).

* [Wikipedia page on Framebuffer](https://en.wikipedia.org/wiki/Framebuffer)
* [MicroPython Documentation on FrameBuffer](https://docs.micropython.org/en/latest/library/framebuf.html)

#### Interrupts

A type of signal used to pause a program and execute a different program. 

We use interrupts to pause our program and execute a different program when a
button is pressed.  Interrupts are also known as [IRQs](#interrup-request) Interrupt ReQuest

#### Interrupt ReQuest

A hardware signal that interrupts the normal flow of program execution to handle a high-priority event. 

When an Interrupt ReQuest (IRQ) occurs, the microcontroller saves its current state, handles the interrupt event through an Interrupt Service Routine (ISR), and then returns to its previous task. In MicroPython, IRQs are used with Pin objects using the ```irq()``` method to handle events like button presses or sensor triggers.  The ```irq()``` method binds an event on a device like a button to a specific MicroPython function.

See the [Button Lab](../basics/03-button.md) for an full example of how IRQs are used to
respond to a button press.

Here is a sample of MicroPython

```python
# this function is called when a button is pressed
def button_pressed(pin):
    print("Button was pressed!")

# this declares our button and the internal pull-up resistor
button = Pin(16, Pin.IN, Pin.PULL_UP)
# this binds the button pin to the button_pressed function
button.irq(trigger=Pin.IRQ_FALLING, handler=button_pressed)
```

* also known as: IRQ

#### Iteration

The process of repeating a set of instructions until a specific condition is met. 

Understanding iteration is essential for MicroPython programs that need to work with
many similar items such as NeoPixels.  They are also used to continuously monitor sensors or update displays in a loop.

#### I2C

A communications protocol common in microcontroller-based systems, particularly for interfacing with sensors, memory devices and liquid crystal displays.

I2C is similar to SPI, it's a synchronous protocol because it uses a clock line.

* Also Known as: Inter-integrated Circuit
* See also: [SPI](#spi)

#### MicroPython

A set of Python libraries and tools developed specifically for microcontrollers.

MicroPython was originally developed by Damien George and first released in 2014.  It includes many of the features of mainstream Python, while adding a range of new ones designed to take advantage of the facilities available on Raspberry Pi Pico and other microcontroller boards like the ESP32.

#### MPG Shell

A simple MicroPython shell based file explorer for ESP8266 and WiPy MicroPython based devices.

The shell is a helper for up/downloading files to the ESP8266 (over serial line and Websockets) and WiPy (serial line and telnet). It basically offers commands to list and upload/download files on the flash FS of the device.

[GitHub Repo for MPFShell](https://github.com/wendlers/mpfshell)

## Mpremote

A versatile MicroPython support tool that has become the recommended replacement for ampy and rshell. 

mpremote is the preferred tools supported by the MicroPython runtime.

mpremote offers an array of features, including:

- Remote REPL access
- Remote script execution
- Mounting local directories

This integration streamlines the development process by providing a unified interface for interacting with MicroPython devices. For detailed information and guidance on using mpremote, you can refer to the official MicroPython documentation.

#### OLED Display

OLED (Organic polymer light emitting diode) displays are small but bright displays with high contrast, low power and a wide viewing angle.  We use these displays throughout our labs.  The small displays are around 1" (diagonal) and only cost around $4 to $5.  Larger 2.24" displays cost around $20.  These displays work both with 4-wire I2C and 7-wire SPI connections.

Typical chips that control the OLED include the SSD1306 driver chips.

* See: [Graph Displays](../displays/graph/01-intro.md)

#### Pattern Recognition

The ability to identify similarities, differences, and patterns in problems or data. 

This is particularly important in MicroPython when dealing with sensor data patterns or implementing repeated behaviors in similar physical computing projects.

#### Raspberry Pi Foundation

The company that builds the Raspberry Pi hardware and provides some software.

#### Raspberry Pi Pico
A microcontroller designed by the Raspberry Pi foundation for doing real-time control systems.

The Pico was introduced in 2020 with a retail list price of $4.  It was a key development because it used a custom chip that had 100 times the RAM of an Arduino Nano.

#### State Machine

A programming model where a system can be in one of several "states," with rules governing transitions between states.

State machines are particularly useful in MicroPython for managing device behavior and user interactions.  Many of our projects have "modes" that govern things like what pattern
is being displayed on a NeoPixel Strip.

#### Pico Pinout Diagram

The Pico pinout diagram shows you the ways that each Pin can be used.  Different colors are used for GPIO numbers, I2C, and SPI interfaces.

![](../img/pi-pico-pinout.png)

* [Pinout PDF](https://datasheets.raspberrypi.org/pico/Pico-R3-A4-Pinout.pdf)

#### PWM
A type of output signal used to control items with continuous values.  For example, we use PWM to control the brightness of a light or the speed of a motor.  We use pulse-width modulation (PWM) to control the speed of our DC motors.

![](../img/PWM-duty-cycle.png)

#### RP2040 chip
A custom chip created by the [Raspberry Pi Foundation](raspberry-pi-foundation) to power the [Raspberry Pi Pico](#raspberry-pi-pico).

#### rshell

A MicroPython shell that runs on the host and uses MicroPython's raw-REPL to send python snippets to the pyboard in order to get filesystem information, and to copy files to and from MicroPython's filesystem.

It also has the ability to invoke the regular REPL, so rshell can be used as a terminal emulator as well.

Note: With rshell you can disable USB Mass Storage and still copy files into and out of your pyboard.

[RShell GitHub Repo](https://github.com/dhylands/rshell)

#### SPI
An interface bus commonly used to send data between microcontrollers and small peripherals such as sensors, displays and SD cards. SPI uses separate clock and data lines, along with a select line to choose the device you wish to talk to.

Also known as: Serial Peripheral Interface
See also: [I2C](#i2c)

#### Thonny
A lightweight Python IDE ideal for writing simple Python programs for first time users.

Thonny runs on Mac, Windows and Linux.

* [Thonny web site](https://thonny.org/)

#### UF2 File
The file that must be uploaded into the Raspberry Pi Pico folder to allow it to be used.

The file name format looks like this:

```rp2-pico-20210205-unstable-v1.14-8-g1f800cac3.uf2```

#### Unicorn
MicroPython on Unicorn is completely open source Micropython emulator

* Github Repo: [https://github.com/micropython/micropython-unicorn](https://github.com/micropython/micropython-unicorn)

## See Also

[MicroPython.org Glossary](https://docs.micropython.org/en/latest/reference/glossary.html)