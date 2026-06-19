# OLED SSD1306 Examples

!!! mascot-welcome "Welcome to the SSD1306 Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will use the SSD1306 — the most popular OLED display chip. You will show text, count to 50, and animate a moving box. Let's get started!

## Using the SSD1306 with I2C Interfaces

### Add the ssd1306 Python Module

You need to add the SSD1306 driver to your Pico before you can use it. You can do this in Thonny using the **Tools → Manage Packages...** menu. Search for `ssd1306` and install it. You need to do this once for each new device type you use.

![](../../img/thonny-add-ssd1306.png)

If the Manage Packages menu is grayed out, go to the Shell at the bottom of Thonny and type the install command there.

## I2C Hello World

This is the first program you should try. It shows "Hello World!" on your display.

```py
import machine
from ssd1306 import SSD1306_I2C   # load the SSD1306 I2C display driver

sda = machine.Pin(0)               # data wire connected to GPIO pin 0
scl = machine.Pin(1)               # clock wire connected to GPIO pin 1
i2c = machine.I2C(0, sda=sda, scl=scl, freq=400000)  # set up I2C bus at 400,000 Hz
oled = SSD1306_I2C(128, 64, i2c)   # create the display object: 128 wide, 64 tall

oled.fill(0)                       # clear screen to black
oled.text("Hello World!", 0, 0)    # draw text at top-left corner
oled.show()                        # send the image to the physical screen
print('Done')                      # print to console when finished
```

**What each line does:**

1. `import machine` — loads the hardware library.
2. `from ssd1306 import SSD1306_I2C` — loads only the I2C class from the ssd1306 driver.
3. `sda = machine.Pin(0)` — names the data wire pin.
4. `scl = machine.Pin(1)` — names the clock wire pin.
5. `i2c = machine.I2C(0, ...)` — creates the Inter-Integrated Circuit (I2C) bus. The `freq=400000` sets the speed to 400,000 signals per second.
6. `oled = SSD1306_I2C(128, 64, i2c)` — creates the display object. `128` is the width. `64` is the height.
7. `oled.fill(0)` — fills the screen with black (0 means off).
8. `oled.text("Hello World!", 0, 0)` — draws text starting at column 0, row 0 (top-left corner).
9. `oled.show()` — sends everything to the screen. Nothing appears until you call this!
10. `print('Done')` — shows a message in the console.

After this program runs you should see the text on your OLED display.
![](../../img/oled-hello-world.png)

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    `oled.show()` is like pressing the "send" button. You can draw as many things as you want, but nothing appears on screen until you call `show()`. Always put it last!

## SH1106 Example

If your display uses the SH1106 chip instead of the SSD1306, use this setup. The SH1106 chip has slightly more internal memory (132 x 64 pixels vs. 128 x 64 pixels), but the programming is very similar.

```py
from machine import Pin, I2C   # load Pin and I2C from the machine library
import sh1106                   # load the SH1106 display driver

sda = machine.Pin(0)            # data wire on GPIO pin 0
scl = machine.Pin(1)            # clock wire on GPIO pin 1
i2c = I2C(0, scl=scl, sda=sda, freq=400000)  # set up I2C bus

display = sh1106.SH1106_I2C(128, 64, i2c, Pin(4), 0x3c)  # create display with address 0x3c
display.sleep(False)   # wake the display up

display.fill(0)                      # clear screen to black
display.text('CoderDojo', 0, 0, 1)   # draw text at top-left, white (1 = white)
display.show()                       # send image to screen

print('done')  # print to console when finished
```

**What each line does:**

1–2. Import lines — load the hardware library and SH1106 driver.
3–4. Pin setup — same data and clock pins as SSD1306.
5. `i2c = I2C(0, ...)` — creates the I2C bus.
6. `display = sh1106.SH1106_I2C(128, 64, i2c, Pin(4), 0x3c)` — creates the display. `0x3c` is the display address in hexadecimal.
7. `display.sleep(False)` — wakes the display. Some SH1106 displays start in sleep mode.
8–10. Drawing and showing — same as SSD1306.

## Counter Example

In this example, you will update the display 50 times. A counter counts from 1 to 50. There is a short pause between each update so you can watch it count.

```py
import machine
import utime                         # load the time library for pausing
from ssd1306 import SSD1306_I2C     # load the SSD1306 driver

sda = machine.Pin(0)                 # data wire on GPIO pin 0
scl = machine.Pin(1)                 # clock wire on GPIO pin 1
i2c = machine.I2C(0, sda=sda, scl=scl, freq=400000)  # set up I2C bus
oled = SSD1306_I2C(128, 64, i2c)     # create the display object

for i in range(1, 51):                      # count from 1 to 50
    oled.fill(0)                            # clear screen to black each time
    oled.text('CoderDojo Rocks!', 0, 0, 1)  # draw title at top-left, white
    oled.text(str(i), 40, 20, 1)            # draw the counter number below the title
    oled.show()                             # send new image to screen
    utime.sleep(0.1)                        # wait 1/10 of a second

print('done')  # print when all 50 counts finish
```

**What each line does:**

1–6. Setup — loads libraries and creates the display.
7. `for i in range(1, 51):` — loops 50 times. Each time, `i` is one number higher.
8. `oled.fill(0)` — clears the screen before drawing the next frame.
9. `oled.text('CoderDojo Rocks!', 0, 0, 1)` — draws the title every frame so it stays visible.
10. `oled.text(str(i), 40, 20, 1)` — converts the number `i` to text with `str()`, then draws it at x=40, y=20.
11. `oled.show()` — sends the new frame to the screen.
12. `utime.sleep(0.1)` — waits 0.1 seconds (100 milliseconds) so you can see each number.

## Animated Box

This example draws a title and a border rectangle. Then it draws a small filled box that slides from left to right across the display.

```py
from machine import Pin, I2C   # load Pin and I2C
import sh1106                   # load SH1106 driver
import utime                    # load time library

sda = machine.Pin(0)            # data wire on GPIO pin 0
scl = machine.Pin(1)            # clock wire on GPIO pin 1
i2c = I2C(0, scl=scl, sda=sda, freq=400000)  # set up I2C bus

display = sh1106.SH1106_I2C(128, 64, i2c, Pin(4), 0x3c)  # create display
display.sleep(False)  # wake the display

display.fill(0)                           # clear screen to black
display.text('CoderDojo Rocks', 0, 0, 1)  # draw title at top-left, white
# line under title
display.hline(0, 9, 127, 1)              # draw horizontal line at row 9, full width
# bottom of display
display.hline(0, 30, 127, 1)             # draw horizontal line at row 30
# left edge
display.vline(0, 10, 32, 1)              # draw vertical line on left side
# right edge
display.vline(127, 10, 32, 1)            # draw vertical line on right side

for i in range(0, 118):                  # slide box from column 0 to column 117
    # box x0, y0, width, height, on
    display.fill_rect(i, 10, 10, 10, 1)  # draw white 10x10 filled box at position i
    # draw black behind number
    display.fill_rect(10, 21, 30, 8, 0)  # erase old number with black rectangle
    display.text(str(i), 10, 21, 1)      # draw current position number in white
    display.show()                       # send frame to screen

print('done')  # print when animation finishes
```

**What each line does:**

1–7. Setup — loads libraries and creates the I2C bus and display.
8. `display.fill(0)` — clears the screen.
9. `display.text(...)` — draws the title.
10. `display.hline(0, 9, 127, 1)` — draws a horizontal line. Arguments: x start, y position, length, color.
11. `display.vline(0, 10, 32, 1)` — draws a vertical line. Arguments: x position, y start, height, color.
12. `for i in range(0, 118):` — loops 118 times, one position for each step.
13. `display.fill_rect(i, 10, 10, 10, 1)` — draws the moving box. Arguments: x, y, width, height, color.
14. `display.fill_rect(10, 21, 30, 8, 0)` — draws a black rectangle to erase the previous number.
15. `display.text(str(i), 10, 21, 1)` — draws the current position as a number.
16. `display.show()` — sends the new frame to the screen.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    To erase something on an OLED, you draw a black rectangle over it. Black pixels are "off" — they produce no light. Drawing in black is the same as erasing!

## Install SSD1306 Module

![](../../img/install-ssd1306.png)

## ssd1306 module

[SSD1306 Library](https://github.com/micropython/micropython/blob/master/drivers/display/ssd1306.py) — click the RAW button, then right-click and choose "Save As" to download the file.

## SSD1306 vs. SH1106

There is only one small difference between SSD1306 and SH1106. The SH1106 chip has an internal memory of 132 x 64 pixels. The SSD1306 only has 128 x 64 pixels. For most programs, you will not notice any difference.

## The SPI interface

The four-wire I2C connection is great for beginners who do not want to hook up many wires. But sometimes you need a faster screen. This is when the Serial Peripheral Interface (SPI) connection is useful.

### SPI Baudrate

The baud rate is the number of signals the SPI bus sends per second. You can read more about Pico SPI baud rates here:
https://raspberrypi.github.io/pico-sdk-doxygen/group__hardware__spi.html#ga37f4c04ce4165ac8c129226336a0b66c

The seven wires on the back of the SPI OLED screens are the following, reading from top to bottom when looking at the back of the display:

![](../../img/oled-back-connections.png)

1. CS — Chip Select — pin 4
2. DC — Data/Command — pin 5
3. RES — Reset — pin 6
4. SDA — Data — SPI0 TX GP7 pin 10
5. SCL — Clock — Connect to SPI0 SCK GP6 pin 9
6. VCC — Connect to the 3.3V Out pin 36
7. GND — pin 38 or any other GND pin

### Pico Pins

```
# Sample code sections
 28 # ------------ SPI ------------------
 29 # Pin Map SPI
 30 # - 3v - xxxxxx - Vcc
 31 # - G - xxxxxx - Gnd
 32 # - D7 - GPIO 13 - Din / MOSI fixed
 33 # - D5 - GPIO 14 - Clk / Sck fixed
 34 # - D8 - GPIO 4 - CS (optional, if the only connected device)
 35 # - D2 - GPIO 5 - D/C
 36 # - D1 - GPIO 2 - Res
```

SCK is the clock — connect this to the OLED SCL pin.
MOSI is the data line that sends data from your Pico to the display. Connect this to the SDA pin.

From the SDK:
https://datasheets.raspberrypi.org/pico/raspberry-pi-pico-python-sdk.pdf
Section 3.7

1. SPI0_SCK — pin 6
2. SPI0_MOSI — pin 7
3. SPI0_MISO — pin 8

This contradicts p122 in GET STARTED WITH MICROPYTHON ON RASPBERRY PI PICO

```
spi_sck = machine.Pin(2)
spi_tx  = machine.Pin(3)
spi_rx  = machine.Pin(4)
```

### SPI Terms

Master Out Slave In (MOSI) is the wire that carries data from the Pico to the display.

We send the data to the SPI RX (Receive) port on the Pico. These are pin 1 (GP0) or pin 6 (GP4).

## Sample Nonworking SPI Code

From the documentation:

!!! From Raspberry Pi Pico Documentation
    **spi** is an SPI object, which has to be created beforehand and tells the ports for SCLJ and MOSI. MISO is not used.

    **dc** is the GPIO Pin object for the Data/Command selection. It will be initialized by the driver.

    **res** is the GPIO Pin object for the reset connection. It will be initialized by the driver. If it is not needed, it can be set to None or omitted. In this case the default value of None applies.

    **cs** is the GPIO Pin object for the CS connection. It will be initialized by the driver. If it is not needed, it can be set to None or omitted. In this case the default value of None applies.

```py
import machine
import machine     # loaded twice here — you only need it once
import utime
import ssd1306
led = machine.Pin(25, machine.Pin.OUT)  # built-in LED on the Pico board

spi_sck = machine.Pin(6)               # SPI clock wire on GPIO pin 6
spi_tx  = machine.Pin(7)               # SPI data wire on GPIO pin 7
spi = machine.SPI(0, baudrate=100000, sck=spi_sck, mosi=spi_tx)  # set up SPI bus

CS  = machine.Pin(8)    # Chip Select pin
DC  = machine.Pin(9)    # Data/Command pin
RES = machine.Pin(10)   # Reset pin

oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)  # create the display

# flash all pixels on
oled.fill(1)             # fill screen white (1 = on)
oled.show()
utime.sleep(0.5)         # wait half a second

oled.fill(0)                          # clear screen to black
oled.text('CoderDojo Rocks!', 0, 0, 1)  # draw text at top-left, white
oled.show()

# flash the LED to show end
led.high()        # turn on the LED
utime.sleep(0.5)  # wait half a second
led.low()         # turn off the LED

print('Done')  # print when finished
```

## References

1. [MicroPython Tutorial on the SSD1306](https://docs.micropython.org/en/latest/esp8266/tutorial/ssd1306.html)

2. [robert-hh's SH1106 Driver](https://github.com/robert-hh/SH1106)

3. [M Fitzp OLED Display i2c Article](https://www.mfitzp.com/article/oled-displays-i2c-micropython/)

4. [Adafruit Stats](https://github.com/adafruit/Adafruit_CircuitPython_SSD1306/blob/master/examples/ssd1306_stats.py)

[DIY More OLED Product Description](https://www.diymore.cc/collections/all-about-arduino/products/2-42-inch-12864-oled-display-module-iic-i2c-spi-serial-for-arduino-c51-stm32-green-white-blue-yellow?variant=17060396597306)

1. [Using I2C Defaults](https://github.com/raspberrypi/pico-micropython-examples/blob/master/i2c/1306oled/i2c_1306oled_using_defaults.py)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have run Hello World, counted to 50, and animated a sliding box. You are making your display come alive. Next, try changing the text or the animation speed to make it your own!
