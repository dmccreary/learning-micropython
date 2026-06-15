# Learning MicroPython FAQ

Welcome to the Frequently Asked Questions page for **Learning MicroPython and Physical Computing**. Here you will find answers to the most common questions students, teachers, and makers ask. Use the search box at the top of the page to find a specific topic quickly.

---

## Getting Started Questions

### What is this course about?

This course teaches you how to write Python programs that control real hardware. You will blink LEDs, read sensors, spin motors, and even build robots — all using a tiny computer called a microcontroller. The branch of computer science that reads sensors and controls lights and motors is called **physical computing**, and this course is your hands-on introduction to it.

By the end of the course, you will be able to design and build your own projects from scratch. No prior programming or electronics experience is needed to begin.

See the [Course Description](course-description.md) for a full list of topics and learning goals.

---

### Who is this course for?

This course was first built for students in 5th through 12th grade (ages 10–18), but people of all ages from around the world use it to learn MicroPython. If you have never programmed before and want to make things light up, move, and react to the world, this course is for you.

Parents, teachers, and hobbyists are also very welcome. The course moves at your own pace, so you can work through it as quickly or as slowly as you like.

---

### What do I need to get started?

You need three things:

1. **A microcontroller** — the $4 Raspberry Pi Pico is the recommended starting board.
2. **A USB cable** — a standard USB Micro-B cable to connect the Pico to your computer.
3. **A few basic parts** — LEDs, resistors, a solderless breadboard, and jumper wires. A starter kit costs under $20.

You also need a free program called Thonny on your computer. See [Getting Started](getting-started/01-intro.md) for a complete list and shopping links.

---

### What is a microcontroller?

A microcontroller is a tiny computer built into a single chip. It has a processor, memory, and input/output pins all in one small package. Unlike a laptop or phone, a microcontroller does not run a full operating system. It runs one program at a time and uses its pins to talk to the physical world — reading sensors, lighting LEDs, or spinning motors.

The Raspberry Pi Pico uses the RP2040 chip. It costs $4 and has 264 KB of RAM — about 100 times more than an older Arduino Uno. That extra memory makes it easy to work with displays and complex programs.

See [Introduction to Microcontrollers](intro/03-microcontrollers.md) for more details.

---

### What is the Raspberry Pi Pico?

The Raspberry Pi Pico is a small, low-cost microcontroller board made by the Raspberry Pi Foundation. It uses the RP2040 chip and costs about $4. The Pico has 26 GPIO (General-Purpose Input/Output) pins you can use to connect sensors, displays, motors, and more.

There are several versions:

- **Pico** — basic board, no wireless
- **Pico W** — adds Wi-Fi
- **Pico 2** — newer version with more memory and speed

Most lessons in this course use the original Pico or Pico W. See [Getting Started with the Raspberry Pi Pico](getting-started/02-pi-pico.md) for setup steps.

---

### What is MicroPython?

MicroPython is a version of Python designed to run on small microcontrollers. It includes most of the features of regular Python, plus special libraries for controlling hardware — reading pins, driving motors, and talking to displays.

MicroPython was created by Damien George and first released in 2014. It is now the most popular way to program microcontrollers with Python because it is easy to learn, runs fast enough for most projects, and works on many different boards.

See the [Glossary](misc/glossary.md) for a quick definition, or the [Course Description](course-description.md) for a comparison between MicroPython and standard Python.

---

### How do I set up my computer to use MicroPython?

The easiest setup uses a free program called **Thonny**. Here are the basic steps:

1. Download and install Thonny from thonny.org.
2. Connect your Pico to your computer with a USB cable.
3. Hold the BOOTSEL button on the Pico, plug it in, then release the button.
4. In Thonny, go to **Tools → Options → Interpreter** and choose MicroPython (Raspberry Pi Pico).
5. Click **Install or update MicroPython** to flash the firmware.

After these steps, you can type code directly into the Thonny shell and run it on your Pico. See [Getting Started with Thonny](getting-started/02c-thonny.md) for a full walkthrough with screenshots.

---

### What is Thonny?

Thonny is a free, lightweight code editor designed for beginners. It runs on Windows, Mac, and Linux. Thonny lets you write and run MicroPython programs on your Pico, see error messages in plain language, and even step through your code one line at a time to find bugs.

It is the recommended editor for this course. Advanced users may prefer VS Code — see [Getting Started with VS Code](getting-started/02d-vscode.md) for that setup.

---

### Can I use an ESP32 instead of a Raspberry Pi Pico?

Yes! The ESP32 is another popular microcontroller that runs MicroPython. It has built-in Wi-Fi and Bluetooth and typically costs around $5–$10. Many of the lessons in this course work on an ESP32 with small changes.

The main difference is that the Pico is simpler and cheaper for beginners, while the ESP32 is better for wireless projects from the start. See [Getting Started with ESP32](getting-started/02-esp32.md) for setup steps.

---

### Do I need to know Python before I start?

No prior Python knowledge is required. The course starts from the very beginning and teaches you the programming concepts you need as you go. If you already know some Python, you will move through the early sections quickly.

The course covers variables, loops, functions, and modules — all the Python basics you need to write real hardware programs.

---

### How long does the course take to complete?

That depends on how much time you spend on it. Most students can finish the Getting Started section and Basic Examples in a few afternoons. The full course — including sensors, motors, displays, sound, and robots — can take a semester at school or a few months of weekend learning at home.

There is no deadline. You can go at your own pace and skip to sections that interest you most.

---

### Where can I ask questions or get help?

The best place to ask questions is the GitHub Discussions page for this project:

[https://github.com/dmccreary/learning-micropython/discussions](https://github.com/dmccreary/learning-micropython/discussions)

You can also use the search function at the top of this website to find an answer quickly. If you find a bug or want to suggest a topic, open an issue on GitHub or see the [Contributing Guide](misc/contributing.md).

---

## Core Concept Questions

### What is physical computing?

Physical computing means writing programs that interact with the real, physical world. Instead of just showing text on a screen, a physical computing program might turn on a light when it gets dark, play a sound when a button is pressed, or stop a robot when an obstacle is detected.

Physical computing connects two worlds: software (the code you write) and hardware (the wires, sensors, and motors). MicroPython is one of the best tools for learning physical computing because you see results immediately.

See [Introduction to Physical Computing](intro/02-physical-computing.md) for more.

---

### What is a GPIO pin?

GPIO stands for **General-Purpose Input/Output**. These are the small metal pins on the side of your Pico. You can use them to:

- **Output**: send a signal to turn on an LED, buzzer, or motor
- **Input**: read a signal from a button, sensor, or switch

The Raspberry Pi Pico has 26 GPIO pins. Each one has a number (GP0 through GP28). When you write MicroPython code, you use these GP numbers to tell the Pico which pin to use.

See the [Raspberry Pi Pico setup page](getting-started/02-pi-pico.md) for the full pinout diagram.

---

### What is a breadboard?

A breadboard is a plastic board with lots of small holes that let you connect electronic parts without soldering. The holes are wired together in rows and columns underneath, so you can connect components like LEDs, resistors, and sensors by simply pushing their legs into the right holes.

Breadboards make it easy to try circuits, move parts around, and fix mistakes — perfect for learning. All labs in this course use a solderless breadboard.

See [Getting Started with Breadboards](getting-started/02-breadboards.md) for a guide to how breadboard connections work.

---

### What is PWM?

PWM stands for **Pulse-Width Modulation**. It is a way to control the average power going to a device by switching it on and off very quickly. The percentage of time it is "on" is called the **duty cycle**.

For example:
- 100% duty cycle → full brightness (or full speed)
- 50% duty cycle → half brightness (or half speed)
- 0% duty cycle → off

MicroPython uses the `machine.PWM` class to create PWM signals. You use PWM to fade LEDs, control motor speed, and move servo motors.

See [Basic Examples: Fade In and Out](basics/04-fade-in-and-out.md) for a hands-on PWM example.

---

### What is I2C?

I2C (pronounced "I-squared-C") stands for **Inter-Integrated Circuit**. It is a simple two-wire communication protocol that lets your microcontroller talk to sensors and displays. The two wires are:

- **SDA** — Serial Data line (carries the data)
- **SCL** — Serial Clock line (keeps both devices in sync)

I2C is popular because you can connect many devices to the same two wires. Each device has a unique I2C **address** so the Pico knows which one to talk to. MicroPython uses the `machine.I2C` class to communicate over I2C.

Many sensors and OLED displays in this course use I2C. See [Advanced Labs: I2C Scanner](advanced-labs/06-i2c.md) to learn how to find connected I2C devices.

---

### What is SPI?

SPI stands for **Serial Peripheral Interface**. Like I2C, SPI lets your Pico talk to sensors and displays. SPI uses four wires (MOSI, MISO, SCK, and CS) and is generally faster than I2C, making it good for displays that need to refresh quickly.

MicroPython uses the `machine.SPI` class to communicate over SPI. Some of the graphical LCD displays in this course use SPI for faster drawing.

---

### What is an ADC?

ADC stands for **Analog-to-Digital Converter**. Most of the world is **analog** — light, temperature, and sound all change smoothly between values. But microcontrollers only understand **digital** values (numbers). An ADC measures an analog voltage and converts it into a number your program can use.

The Raspberry Pi Pico has three ADC inputs (pins GP26, GP27, and GP28). Each one measures voltages from 0 to 3.3 V and returns a number from 0 to 65535. MicroPython uses the `machine.ADC` class to read these values.

See [Sensors: Potentiometer](sensors/02-pot.md) for a simple ADC example using a potentiometer.

---

### What is the REPL?

REPL stands for **Read-Evaluate-Print Loop**. It is the interactive shell you see at the bottom of Thonny. You type a line of Python, press Enter, and the Pico runs it immediately and shows the result.

The REPL is great for experimenting. You can test a single line of code without writing a full program. For example, type `print("Hello!")` in the REPL and press Enter — the Pico prints `Hello!` right away.

---

### What is a loop in MicroPython?

A loop is a block of code that runs over and over. In MicroPython programs for hardware, the most common loop is `while True:` — this runs forever until you stop the program or the Pico loses power.

```python
import utime
from machine import Pin

led = Pin(15, Pin.OUT)

while True:        # run forever
    led.toggle()   # switch the LED on or off
    utime.sleep(1) # wait one second
```

A `for` loop runs a fixed number of times, like when you want to light up each NeoPixel in a strip one by one.

See [Basic Examples: Blink](basics/01-blink.md) for your first `while True:` program.

---

### What is debouncing?

When you press a button, the metal contacts inside it bounce very quickly before settling into the pressed position. This can cause your program to see many button presses instead of just one.

**Debouncing** is the fix. Software debouncing adds a small delay after detecting a press before checking again, ignoring the noise. Hardware debouncing uses a capacitor to smooth out the signal.

See [Basic Examples: Buttons](basics/03-button.md) for a debouncing example in MicroPython.

---

### What is a NeoPixel?

A NeoPixel is a small, full-color LED that you can control with a single wire from your microcontroller. Each NeoPixel contains red, green, and blue LEDs, so you can set it to any color by mixing those three values. NeoPixels are also called "WS2812B" LEDs.

You can connect many NeoPixels in a strip or ring, and control each one individually. MicroPython has a built-in `neopixel` module that makes this easy.

See [Basic Examples: NeoPixel](basics/05-neopixel.md) for your first color program.

---

### What is a servo motor?

A servo motor is a special motor that turns to a specific angle and holds it there. Servos are used in robots to move arms, tilt sensors, and steer wheels. A standard servo can turn between 0° and 180°. A **continuous rotation servo** spins like a regular motor but with speed control.

You control a servo with a PWM signal at 50 Hz. The length of each pulse tells the servo what angle to move to. MicroPython uses the `machine.PWM` class to generate this signal.

See [Basic Examples: Servo](basics/04-servo.md) for a hands-on servo example.

---

### What is a sensor?

A sensor is a device that measures something in the physical world and converts it into an electrical signal your microcontroller can read. Common sensors in this course include:

- **DHT11/DHT22** — temperature and humidity
- **HC-SR04** — distance using ultrasonic sound
- **VL53L0X** — distance using a laser beam (time-of-flight)
- **APDS9960** — gesture, color, and proximity
- **HMC5883L** — magnetic field (compass)
- **Photoresistor (LDR)** — light level

Each sensor has its own way of connecting and communicating. Many use I2C or simple digital/analog signals. See the [Sensors section](sensors/01-intro.md) for labs covering each type.

---

### What is computational thinking?

Computational thinking is a way of solving problems. It has four key steps:

1. **Decomposition** — break a big problem into smaller, simpler pieces
2. **Pattern recognition** — find similarities between problems you have already solved
3. **Abstraction** — focus on the important parts, ignore the details that do not matter
4. **Algorithms** — write a step-by-step plan for solving the problem

Every MicroPython project in this course uses computational thinking. When you build a robot, for example, you decompose it into: power, motors, sensors, and control logic — then solve each piece separately.

---

### What is a function in MicroPython?

A function is a reusable block of code that you give a name. Instead of writing the same code over and over, you define a function once and call it whenever you need it. In MicroPython:

```python
def blink_led(pin_number, times):
    led = Pin(pin_number, Pin.OUT)
    for i in range(times):
        led.on()
        utime.sleep(0.5)
        led.off()
        utime.sleep(0.5)
```

Then you can call `blink_led(15, 3)` to blink the LED on GPIO 15 three times. Functions make your programs shorter, easier to read, and easier to fix.

---

### What is a module in MicroPython?

A module is a file that contains Python code you can use in other programs. You load a module with the `import` statement. MicroPython has many built-in modules:

- `machine` — controls hardware pins, ADC, PWM, I2C, SPI
- `utime` — provides timing functions like `sleep()`
- `neopixel` — drives NeoPixel LED strips
- `network` — connects to Wi-Fi (Pico W)

You can also install extra driver modules to support specific sensors and displays. See [Getting Started: MicroPython Libraries](getting-started/01b-libraries.md) for how to install them.

---

### What is a wiring diagram?

A wiring diagram shows you how to connect the parts of a circuit together. It uses pictures of the components — LEDs, resistors, sensors, the Pico — and lines to show which wire goes where.

Every lab in this course includes a wiring diagram so you know exactly where to plug each wire. You do not need to know electronics theory to follow a wiring diagram — just match the colors and pin labels.

---

## Technical Detail Questions

### What is the RP2040 chip?

The RP2040 is a custom microcontroller chip designed by the Raspberry Pi Foundation. It powers the Raspberry Pi Pico. Key specs:

- **Processor**: Dual-core ARM Cortex-M0+ running up to 133 MHz
- **RAM**: 264 KB of SRAM (much more than older Arduinos)
- **Flash**: 2 MB on-board (for storing your programs)
- **GPIO**: 26 multi-function pins
- **ADC**: Three 12-bit analog inputs

The RP2040 also has 8 programmable I/O (PIO) state machines, which let it emulate almost any communication protocol. See [Getting Started with the Raspberry Pi Pico](getting-started/02-pi-pico.md) for the full specs.

---

### What is a UF2 file?

A UF2 file is the file you drag onto the Pico to install MicroPython firmware. When you hold the BOOTSEL button while plugging in the Pico, it appears on your computer as a USB drive called RPI-RP2. You drag the MicroPython UF2 file onto that drive, and the Pico automatically installs the firmware and restarts.

You only need to do this once unless you want to update MicroPython to a newer version.

---

### What is BOOTSEL?

BOOTSEL is a small button on the top of the Raspberry Pi Pico. When you hold it down while plugging the Pico into USB, the Pico enters **bootloader mode** and appears as a USB storage drive on your computer. This is how you install or update MicroPython firmware.

After flashing, the Pico restarts automatically and you can program it normally through Thonny.

---

### What is the `machine` module?

The `machine` module is MicroPython's main hardware control library. You use it to:

- `machine.Pin` — control GPIO pins (on/off, read buttons)
- `machine.PWM` — create PWM signals (fade LEDs, drive servos)
- `machine.ADC` — read analog voltages (sensors, potentiometers)
- `machine.I2C` — communicate with I2C devices (sensors, OLED displays)
- `machine.SPI` — communicate with SPI devices (fast displays)

Almost every program in this course starts with `from machine import Pin` or a similar import from the `machine` module.

---

### What does Pin.OUT mean?

When you set up a GPIO pin, you tell MicroPython whether the pin is an **output** or an **input**:

- `Pin.OUT` — the Pico sends a signal OUT through this pin. Use this for LEDs, buzzers, and motor control signals.
- `Pin.IN` — the Pico reads a signal coming IN on this pin. Use this for buttons and sensors.

Example:
```python
from machine import Pin
led = Pin(15, Pin.OUT)  # GPIO 15 is an output — controls an LED
```

---

### What is a pull-up resistor?

When a GPIO pin is set to input mode, it can float between high and low if nothing is connected — giving random readings. A **pull-up resistor** connects the pin to 3.3 V through a large resistor (usually 10,000 ohms), so the pin reads HIGH when the button is not pressed and LOW when it is pressed.

The Pico has built-in pull-up resistors you can turn on in software:

```python
button = Pin(14, Pin.IN, Pin.PULL_UP)
```

This saves you from adding an external resistor to your circuit. See [Basic Examples: Buttons](basics/03-button.md) for a full example.

---

### What is an interrupt?

An interrupt is a signal that pauses your main program and runs a special function immediately. For example, if you press a button very quickly, your `while True:` loop might miss it if it is busy doing something else. An interrupt catches the button press no matter what.

In MicroPython, you set up an interrupt with the `.irq()` method on a Pin object:

```python
def button_pressed(pin):
    print("Button pressed!")

button = Pin(14, Pin.IN, Pin.PULL_UP)
button.irq(trigger=Pin.IRQ_FALLING, handler=button_pressed)
```

See [Advanced Labs: Interrupt Handlers](advanced-labs/02-interrupt-handlers.md) for a full example.

---

### What is an I2C address?

Every device on an I2C bus has a unique address — a number that identifies it. When the Pico wants to talk to an OLED display, it sends the display's I2C address first so all devices on the bus know who should listen.

Common I2C addresses:
- SSD1306 OLED display: usually `0x3C` or `0x3D`
- DHT11 — not I2C (uses its own protocol)
- VL53L0X time-of-flight sensor: `0x29`

If you are not sure what address your device uses, run an I2C scanner. See [Advanced Labs: I2C Scanner](advanced-labs/06-i2c.md) for scanner code.

---

### What is a framebuffer?

A framebuffer is a section of RAM that stores a picture of what should be on your display. When you draw a line, circle, or text in MicroPython, you are actually drawing into the framebuffer first. Then you call `.show()` to send the whole framebuffer to the display at once — this makes the screen update look smooth.

For a 128×64 pixel monochrome OLED, the framebuffer needs 128 × 64 = 8,192 bits (1 KB) of RAM. The Pico's 264 KB of RAM makes this easy. See [Advanced Labs: Frame Buffer](advanced-labs/07-framebuffer.md) for details.

---

### What is firmware?

Firmware is the software built into a device that makes it work. For the Raspberry Pi Pico, firmware is the MicroPython interpreter itself — the program stored in the Pico's flash memory that reads and runs your MicroPython code.

You install firmware once by dragging a UF2 file onto the Pico in bootloader mode. When you update MicroPython to a newer version, you are updating the firmware.

---

### What is the `utime` module?

The `utime` module provides time-related functions in MicroPython. The most commonly used function is `utime.sleep()`, which pauses your program for a number of seconds:

```python
import utime
utime.sleep(1)      # wait 1 second
utime.sleep_ms(500) # wait 500 milliseconds (half a second)
utime.sleep_us(100) # wait 100 microseconds
```

You also use `utime.ticks_ms()` to measure how much time has passed — useful for debouncing and timing events without using `sleep()`.

---

### What is a DHT11 sensor?

The DHT11 is a low-cost sensor that measures temperature and humidity. It connects to a single GPIO pin on your Pico and sends data using its own simple protocol. MicroPython has a built-in `dht` module that makes reading it easy:

```python
import dht
from machine import Pin

sensor = dht.DHT11(Pin(16))
sensor.measure()
print(sensor.temperature())  # degrees Celsius
print(sensor.humidity())      # percent relative humidity
```

See [Sensors: Temperature and Humidity](sensors/04-temp-dht11.md) for a full wiring diagram and program.

---

### What is an OLED display?

OLED stands for **Organic Light-Emitting Diode**. An OLED display is a small, bright screen with high contrast and a wide viewing angle. The most common size in this course is 128×64 pixels — about 1 inch diagonally — and costs around $4–$5.

OLED displays connect over I2C or SPI and use the `SSD1306` or `SH1106` driver chip. MicroPython has a driver for both. You can draw pixels, lines, rectangles, and text onto the display.

See [Displays Graphical: OLED Setup](displays/graph/02-oled-setup.md) to get started.

---

## Common Challenge Questions

### My LED does not light up. What do I check?

Work through this checklist one step at a time:

1. **Polarity** — LEDs only work one way. The longer leg (anode) connects to the GPIO pin. The shorter leg (cathode) connects to GND.
2. **Resistor** — always use a current-limiting resistor (typically 330 Ω) in series with the LED. Without it, you may burn out the LED or damage the Pico.
3. **Pin number** — check that the pin number in your code matches the GP number on the pin you used, not the physical pin number on the board.
4. **Code** — make sure your code is actually running and has no errors. Check the Thonny shell for error messages.
5. **USB connection** — confirm the Pico is connected and Thonny is set to the MicroPython interpreter.

See [Basic Examples: Blink](basics/01-blink.md) for a working starter program to test with.

---

### I see an ImportError. What does that mean?

An `ImportError` means MicroPython cannot find the module you are trying to import. This usually means:

1. The module name is spelled wrong — check capitalisation. Python is case-sensitive: `import neopixel` not `import NeoPixel`.
2. The driver file has not been copied to the Pico. For example, `ssd1306.py` must be on the Pico before you can `import ssd1306`.

To copy driver files to the Pico, use the Thonny file manager or the `mpremote` tool. See [Getting Started: MicroPython Libraries](getting-started/01b-libraries.md) for instructions.

---

### My sensor gives wrong readings. What do I check?

Sensor problems are usually one of three things:

1. **Wrong wiring** — double-check VCC, GND, SDA, and SCL connections against the wiring diagram. Swapping SDA and SCL is a common mistake.
2. **Wrong I2C pins** — the Pico has two I2C buses (I2C0 and I2C1). Make sure the pins in your code match the physical pins you wired.
3. **Missing driver** — some sensors need a driver file (like `bme280.py`). Make sure it is copied to the Pico.

If you have an OLED or I2C sensor that shows nothing, run an I2C scanner first to confirm the device is detected. See [Advanced Labs: I2C Scanner](advanced-labs/06-i2c.md).

---

### My display shows nothing. What do I check?

For an OLED or LCD display that is blank:

1. **Power** — check that 3.3 V and GND are connected correctly.
2. **I2C wiring** — confirm SDA and SCL are on the right pins.
3. **I2C address** — the default address in most drivers is `0x3C`. Your display may use `0x3D`. Run an I2C scanner to find the real address.
4. **Calling `.show()`** — drawing functions update the framebuffer, but nothing appears on screen until you call `oled.show()`. Make sure that call is in your code.

See [Displays Graphical: OLED Setup](displays/graph/02-oled-setup.md) for a step-by-step setup guide.

---

### My Pico will not connect to my computer. What do I do?

Try these steps in order:

1. **Try a different USB cable** — many cables are charge-only and do not carry data.
2. **Try a different USB port** on your computer.
3. **Reinstall the firmware** — hold BOOTSEL, plug in the Pico, drag the MicroPython UF2 file onto the RPI-RP2 drive.
4. **Restart Thonny** — close and reopen Thonny, then check that the interpreter is set to MicroPython (Raspberry Pi Pico).

If the Pico is stuck in a crash loop (a program with an error runs on boot), you can stop it by pressing the STOP button in Thonny right after connecting. See [Debugging](debugging/index.md) for more troubleshooting tips.

---

### I get an IndentationError. What does that mean?

Python uses indentation (spaces or tabs at the start of a line) to show what code belongs inside a loop, function, or if-statement. An `IndentationError` means the indentation is inconsistent — for example, you mixed tabs and spaces, or you forgot to indent a line inside a `while` loop.

**Fix**: In Thonny, go to **Options → Editor** and check "Use spaces instead of tabs." Always use 4 spaces per level of indentation.

```python
while True:
    led.toggle()    # this line MUST be indented 4 spaces
    utime.sleep(1)  # this line too
```

---

### My motor only runs in one direction. What do I check?

DC motors need an **H-bridge** circuit to run in both directions. The H-bridge lets you reverse the current through the motor. Common H-bridge chips used in this course are the L293D and DRV8833.

Check:
1. Are both motor control pins connected to the H-bridge?
2. Is your code setting both pins, not just one?
3. Is the H-bridge powered correctly (some need 5 V for the motor, 3.3 V for logic)?

See [Motors: H-Bridge](motors/03-h-bridge.md) and [Motors: L293D Chip](motors/04-l293d.md) for wiring diagrams and example code.

---

### How do I know which GPIO pin to use?

All GPIO pins (GP0–GP28) can be used for basic digital input and output. However, some pins have special functions:

- **GP26, GP27, GP28** — also ADC inputs (for reading analog sensors)
- **Specific I2C pins** — I2C0 uses GP0/GP1 by default; I2C1 uses GP2/GP3
- **SPI pins** — check the datasheet for default SPI pin assignments

The pinout diagram on the [Raspberry Pi Pico setup page](getting-started/02-pi-pico.md) shows every pin and its functions. Keep that page handy when wiring new projects.

---

### My code was working, and now it stops after a few seconds. What happened?

A few common causes:

1. **Power problem** — if you are running motors or many LEDs from USB power, you may be drawing too much current. Add a separate battery pack for motors.
2. **Memory error** — if you see `MemoryError`, your program is using too much RAM. Free up memory by deleting unused variables or simplifying your code.
3. **Infinite loop mistake** — check if your loop has an exit condition that is being met accidentally.
4. **Hardware fault** — check all wiring connections. A loose wire can cause intermittent failures.

See [Debugging](debugging/index.md) for a systematic approach to tracking down these issues.

---

## Best Practice Questions

### How do I organize my MicroPython project files?

A clean project structure makes your code easier to understand and fix:

```
project-name/
    main.py        # your main program
    config.py      # pin numbers and settings
    ssd1306.py     # driver for the OLED display
    bme280.py      # driver for the temperature sensor
```

Keep all driver files in the same folder as `main.py`. Put hardware pin numbers and settings in a separate `config.py` file so you can change them without hunting through your main code.

See [Basic Examples: Config](basics/10.config.md) for an example `config.py`.

---

### What is a `config.py` file?

A `config.py` file stores the settings for your project — mainly which GPIO pins you connected things to. Instead of hard-coding pin numbers inside every function, you import them from `config.py`:

```python
# config.py
MOTOR_LEFT_PIN = 14
MOTOR_RIGHT_PIN = 15
OLED_SDA_PIN = 0
OLED_SCL_PIN = 1
```

Then in `main.py`:
```python
from config import MOTOR_LEFT_PIN, MOTOR_RIGHT_PIN
```

This is a key example of **abstraction** from computational thinking. If you rewire a motor to a different pin, you only change one line in `config.py` instead of hunting through your whole program.

---

### How do I save my program so it runs automatically when the Pico powers on?

Save your program as `main.py` on the Pico. When the Pico powers on, it automatically runs `main.py` first. If you also have a `boot.py`, that runs before `main.py` — use it for setup tasks like connecting to Wi-Fi.

In Thonny, save your file using **File → Save As** and choose the MicroPython device, not your computer.

---

### How do I install driver libraries on my Pico?

Driver libraries are `.py` files that you copy onto the Pico. You can do this two ways:

1. **Thonny file manager** — open the Files panel in Thonny, find the driver file on your computer, right-click it, and choose "Upload to /".
2. **`mpremote` tool** — use the command line: `mpremote cp ssd1306.py :ssd1306.py`

After copying, you can `import ssd1306` in your program just like any other module.

See [Getting Started: MicroPython Libraries](getting-started/01b-libraries.md) for a list of common drivers and where to find them.

---

### When should I use `while True:` versus a timer?

Use `while True:` when your program only does one thing repeatedly — like reading a sensor and printing the value. It is simple and easy to understand.

Use a **timer** when you need things to happen at precise intervals without blocking the rest of your program. For example, a timer can flash an LED every 500 ms while the main loop reads buttons.

```python
# Timer example
from machine import Timer, Pin

led = Pin(15, Pin.OUT)
timer = Timer()
timer.init(freq=2, mode=Timer.PERIODIC, callback=lambda t: led.toggle())
```

See [Advanced Labs: Timers](advanced-labs/13-timers.md) for more timer examples.

---

### How do I use AI tools to help me code MicroPython?

AI assistants like Claude and ChatGPT can help you understand MicroPython concepts, generate starter code, and debug errors. To get the best help:

1. **Be specific** — mention your board (Raspberry Pi Pico), sensor (DHT11), and what you want to do (read temperature and print it).
2. **Paste your error message** — AI tools can explain error messages and suggest fixes.
3. **Review before running** — always read AI-generated code before running it. AI can make mistakes, especially with pin numbers.
4. **Ask follow-up questions** — if the code does not work, describe what happened and ask for help.

See the [Prompts section](prompts/index.md) for example prompts that work well for MicroPython learning.

---

### What is the right way to connect multiple I2C devices?

You can connect many I2C devices to the same two wires (SDA and SCL) as long as each device has a different I2C address. Simply connect all devices' SDA pins together, all SCL pins together, and all GND pins together.

Steps:
1. Run an I2C scanner to confirm each device has a unique address.
2. Create one `I2C` object in your code.
3. Initialize each driver with that same `I2C` object.

If two devices share the same address (a common problem), some sensors let you change their address by soldering a jumper or connecting an address pin to 3.3 V.

---

### How do I share my project with others?

The best way to share is to put your code on GitHub. You upload your `main.py`, `config.py`, and any driver files, along with a README that explains what your project does and how to wire it.

You can also contribute to this course by submitting a pull request. See [About This Site](intro/01-about.md) for the different ways to contribute, including Git pull requests, GitHub Issues, and even sending raw documents.

---

## Advanced Topic Questions

### How do I connect my Pico W to Wi-Fi?

The Pico W has a built-in Wi-Fi chip. To connect, use the `network` module:

```python
import network

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("your_wifi_name", "your_password")

while not wlan.isconnected():
    pass

print("Connected! IP:", wlan.ifconfig()[0])
```

Once connected, you can make HTTP requests to fetch data from the internet, or build a simple web server that shows sensor readings in a browser.

See [Wireless: Connecting to Wi-Fi](wireless/02-connecting-to-wifi.md) and [Wireless: Web Server](wireless/04-web-server.md) for full examples.

---

### How do I build a robot with MicroPython?

A basic collision-avoidance robot needs four things:

1. **Drive motors** — two DC motors with an H-bridge driver (like the DRV8833)
2. **Distance sensor** — an HC-SR04 or VL53L0X to detect obstacles
3. **Microcontroller** — a Raspberry Pi Pico (or the Cytron Maker Pi RP2040, which has motors and drivers built in)
4. **Power** — a battery pack

The robot runs a loop: measure distance, if too close then reverse and turn, else go forward. This is a simple but powerful example of computational thinking — a real algorithm controlling real hardware.

See [Robots: Base Bot](robots/02-base-bot.md) and the [Kits: Maker Pi RP2040 Robot](kits/maker-pi-rp2040-robot/index.md) section for step-by-step assembly and code.

---

### What is multi-core programming on the RP2040?

The RP2040 chip inside the Pico has **two processor cores** that can run code at the same time. This is called multi-core programming. You can run your main program on Core 0 and a background task (like reading a sensor) on Core 1.

MicroPython supports this with the `_thread` module:

```python
import _thread

def core1_task():
    while True:
        # this runs on the second core
        read_sensor()

_thread.start_new_thread(core1_task, ())
```

This is an advanced topic but very useful for projects that need to do two things at once — for example, playing music while also controlling a motor.

See [Advanced Labs: Multi-Core Programming](advanced-labs/16-multi-core.md) for a full example.

---

### What is TinyML and can I use it on a Pico?

TinyML is **Tiny Machine Learning** — running machine learning models on small, low-power devices. The Raspberry Pi Pico has just enough RAM and processing power to run simple TinyML models for tasks like detecting a specific sound or recognizing a motion pattern.

This is an advanced topic that requires training a model on a computer first, then deploying the tiny version to the Pico. It uses libraries like TensorFlow Lite Micro.

See [Advanced Labs: TinyML](advanced-labs/20-tinyml.md) for an introduction to running ML on the Pico.

---

### What is a spectrum analyzer?

A spectrum analyzer shows you the frequencies present in a sound — a visual display where each bar represents how loud a particular frequency is. Low bars are bass notes; high bars are treble notes.

Building a spectrum analyzer on the Pico uses a microphone (INMP441), the I2S bus to read audio data, and a **Fast Fourier Transform (FFT)** algorithm to break the audio into frequency bands. The results can be shown on an OLED display.

This project combines sensors (microphone), communication protocols (I2S), advanced math (FFT), and display programming — one of the most impressive things you can build with a Pico.

See [Advanced Labs: Spectrum Analyzer](advanced-labs/30-spectrum-analyzer/index.md) for the full project.

---

### How do I convert an Arduino or CircuitPython project to MicroPython?

Converting from **Arduino (C/C++)** to MicroPython means rewriting the code in Python. The logic stays the same, but the syntax and libraries are different. For example, `digitalWrite(pin, HIGH)` in Arduino becomes `pin.on()` or `pin.value(1)` in MicroPython.

Converting from **CircuitPython** to MicroPython is easier because both use Python. The main differences are in the libraries — CircuitPython uses `board` and `busio`, while MicroPython uses `machine`. You usually need to swap the import statements and adjust a few function names.

See [Advanced Labs: Converting CircuitPython to MicroPython](advanced-labs/10-converting-circuitpython-to-micropython.md) for a side-by-side comparison and conversion tips.

---

### Where can I find more MicroPython projects after I finish this course?

After finishing the core labs, there are several related sites with more advanced MicroPython projects:

- [Moving Rainbow](https://dmccreary.github.io/moving-rainbow/) — full curriculum around LED strips and costumes
- [Clocks and Watches](https://dmccreary.github.io/micropython-clocks-and-watches/) — dozens of clock projects using the Pico W
- [Robot Day](https://dmccreary.github.io/robot-day/) — details for running a robot-building event at your school
- [Beginning Electronics](https://dmccreary.github.io/beginning-electronics/) — deeper electronics theory to complement your MicroPython skills

When you are ready to step beyond the Pico, the [AI Racing League](https://www.coderdojotc.org/ai-racing-league/) moves on to full Python, machine learning, and computer vision on Raspberry Pi single-board computers.
