# MAX7219 8x8 LED Matrix

![MAX7219 8x8 LED matrix module — front view showing the 64 LEDs](../../img/max7219-8x8-led.png)
![MAX7219 8x8 LED matrix module — back view showing the driver chip](../../img/led-matrix-display-back.png)

!!! mascot-welcome "Welcome to the 8×8 LED Matrix Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    An 8×8 LED matrix is a grid of 64 tiny lights. You can draw letters, shapes, and animations — all with just 4 wires! Let's build something amazing!

## What Is an 8×8 LED Matrix?

An **8×8 LED matrix** is a grid of 64 Light-Emitting Diodes (LEDs) arranged in 8 rows and 8 columns. A single driver chip called the **MAX7219** controls all 64 LEDs. This keeps the wiring simple — you only need 4 wires between the Pico and the display.

This low-cost ($3) device is perfect for small projects that do not need a full graphical screen. You will be surprised at how creative you can be with just 64 pixels!

[eBay Search for "MAX7219 8x8 matrix"](https://www.ebay.com/sch/i.html?_nkw=MAX7219+8x8+matrix)

The device has five connectors:

1. Power (VCC) — connects to 3.3 V or 5 V
2. Ground (GND) — connects to GND
3. Clock (SCK) — the timing signal for Serial Peripheral Interface (SPI) communication
4. Data (MOSI — Master Out Slave In) — carries the data signal
5. Chip Select (CS) — tells the chip when to listen

You communicate with the device using **SPI**. SPI is a way for two chips to share data using 3 or 4 wires. The Pico sends data, and the MAX7219 receives it and lights up the right LEDs.

There is also an easy-to-use driver library by [Mike Causer](https://github.com/mcauser/micropython-max7219). Download this file and copy it to your Pico before running the examples below.

## Wiring Steps

1. Connect **VCC** on the matrix to **3.3 V** on the Pico.
2. Connect **GND** on the matrix to any **GND** pin on the Pico.
3. Connect **SCK** on the matrix to **GP2** on the Pico.
4. Connect **MOSI (data)** on the matrix to **GP3** on the Pico.
5. Connect **CS** on the matrix to **GP4** on the Pico.

## Quick Start: Show a Letter

Here is how you set up the driver and display one letter:

```python
from machine import SPI, Pin    # import SPI for communication, Pin for the CS pin
import max7219                   # import the MAX7219 driver library
from utime import sleep          # import sleep for delays

CLOCK_PIN = 2    # GP2 — SPI clock
DATA_PIN  = 3    # GP3 — SPI data (MOSI)
CS_PIN    = 4    # GP4 — Chip Select

# Set up the SPI bus using bus 0
spi0 = SPI(0, baudrate=10000000, polarity=1, phase=0,
           sck=Pin(CLOCK_PIN), mosi=Pin(DATA_PIN))

cs = Pin(CS_PIN, Pin.OUT)   # set up the Chip Select pin as an output

# Create the matrix object — the "1" means we have 1 display
matrix = max7219.Matrix8x8(spi0, cs, 1)

# Display the letter A at position x=0, y=0 with LEDs on (1)
matrix.text('A', 0, 0, 1)
matrix.show()   # send the image to the display
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `SPI(0, baudrate=10000000, ...)` | Sets up the SPI bus at 10 MHz on bus 0 |
| `Pin(CS_PIN, Pin.OUT)` | Sets the Chip Select pin as an output |
| `max7219.Matrix8x8(spi0, cs, 1)` | Creates a matrix object for 1 display |
| `matrix.text('A', 0, 0, 1)` | Draws the letter A at column 0, row 0 |
| `matrix.show()` | Sends all the pixel data to the display |

## Using Multiple Displays

You can chain up to 4 displays side by side. Change the last number in `Matrix8x8()` to match how many displays you have:

```python
import max7219
from machine import Pin, SPI

spi = SPI(0, baudrate=10000000, polarity=1, phase=0,
          sck=Pin(2), mosi=Pin(3))     # set up the SPI bus
cs = Pin(4, Pin.OUT)                   # set up Chip Select

# The "4" at the end tells the driver we have 4 displays chained together
matrix = max7219.Matrix8x8(spi, cs, 4)

matrix.text('1234', 0, 0, 1)   # display "1234" across all 4 displays
matrix.show()                   # send the image to the displays
```

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    When you chain displays, data flows from one display to the next like a relay race. The Pico sends data to display 1, which passes extra data to display 2, and so on. That is why 4 displays still only need 4 wires!

## Basic Program

```python
from machine import SPI, Pin    # import SPI and Pin
import max7219                   # import the MAX7219 driver
from utime import sleep          # import sleep for delays

CLOCK_PIN  = 2    # GP2 — SPI clock
DATA_PIN   = 3    # GP3 — SPI data
CS_PIN     = 4    # GP4 — Chip Select
delay_time = 1    # wait 1 second between each display step

# Set up SPI bus 0
spi0 = SPI(0, baudrate=10000000, polarity=1, phase=0,
           sck=Pin(CLOCK_PIN), mosi=Pin(DATA_PIN))

cs = Pin(CS_PIN, Pin.OUT)   # Chip Select as output

matrix = max7219.Matrix8x8(spi0, cs, 1)   # one display

matrix.text('A', 0, 0, 1)   # draw the letter A
matrix.show()                # send to the display
sleep(delay_time)            # wait 1 second
```

## Full Demo

This program cycles through several different displays to show what the matrix can do:

```python
from machine import SPI, Pin    # import SPI and Pin
import max7219                   # import the MAX7219 driver
from utime import sleep          # import sleep for delays

# Set up SPI bus 0 with clock on GP2 and data on GP3
spi0 = SPI(0, baudrate=10000000, polarity=1, phase=0,
           sck=Pin(2), mosi=Pin(3))

cs = Pin(4, Pin.OUT)   # Chip Select on GP4

matrix = max7219.Matrix8x8(spi0, cs, 1)   # one display

delay_time = 1   # seconds to show each image

while True:
    # --- Step 1: draw the letter A ---
    matrix.text('A', 0, 0, 1)   # place 'A' at top-left corner
    matrix.show()                # send to display
    sleep(delay_time)

    # --- Step 2: draw an X using two diagonal lines ---
    matrix.fill(0)               # clear all pixels (0 = off)
    matrix.line(0, 0, 7, 7, 1)  # draw a line from top-left to bottom-right
    matrix.show()
    sleep(delay_time)

    matrix.line(7, 0, 0, 7, 1)  # draw a line from top-right to bottom-left
    matrix.show()
    sleep(delay_time)

    # --- Step 3: add a box around the X ---
    matrix.rect(0, 0, 8, 8, 1)  # draw an 8×8 rectangle border
    matrix.show()
    sleep(delay_time)

    matrix.fill(0)   # clear all pixels

    # --- Step 4: draw a smile face using individual pixels ---
    matrix.pixel(1, 1, 1)   # left eye
    matrix.pixel(6, 1, 1)   # right eye
    matrix.pixel(0, 4, 1)   # left cheek
    matrix.pixel(7, 4, 1)   # right cheek
    matrix.pixel(1, 5, 1)   # smile left
    matrix.pixel(6, 5, 1)   # smile right
    matrix.pixel(2, 6, 1)   # smile lower-left
    matrix.pixel(5, 6, 1)   # smile lower-right
    matrix.pixel(3, 7, 1)   # smile bottom-left
    matrix.pixel(4, 7, 1)   # smile bottom-right
    matrix.show()
    sleep(delay_time)

    matrix.fill(0)   # clear all pixels
    matrix.show()    # update the display to show the blank screen
    sleep(delay_time)
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `matrix.fill(0)` | Turns off all 64 pixels |
| `matrix.line(0, 0, 7, 7, 1)` | Draws a line from (col 0, row 0) to (col 7, row 7) |
| `matrix.rect(0, 0, 8, 8, 1)` | Draws a rectangle border starting at (0,0) that is 8 wide and 8 tall |
| `matrix.pixel(x, y, 1)` | Turns on one pixel at column x, row y |
| `matrix.show()` | Sends all pixel changes to the display |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try changing the numbers in `matrix.pixel()` to create your own face or design. The columns go from 0 (left) to 7 (right). The rows go from 0 (top) to 7 (bottom).

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You drew letters, lines, rectangles, and a smile face on an 8×8 LED matrix! Next, try the 4-Digit LED Display lab to build a working clock.
