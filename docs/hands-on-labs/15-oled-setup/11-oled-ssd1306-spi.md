# OLED SSD1306 SPI Examples

!!! mascot-welcome "Welcome to the SPI Display Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will connect an SSD1306 OLED display using the Serial Peripheral Interface (SPI). SPI uses more wires than I2C, but it refreshes the screen about 13 times faster!

## Using the SSD1306 with SPI Interfaces

### Add the ssd1306 Python Module

You need to add the SSD1306 driver to your Pico before you can use it. You can do this in Thonny using the **Tools → Manage Packages...** menu. Search for `ssd1306` and install it. You need to do this once for each new device type you use.

![](../../img/thonny-add-ssd1306.png)

If the Manage Packages menu is grayed out, go to the Shell at the bottom of Thonny and type the install command there.

## Install SSD1306 Module

![](../../img/install-ssd1306.png)

## ssd1306 module

[SSD1306 Library](https://github.com/micropython/micropython/blob/master/drivers/display/ssd1306.py) — click the RAW button, then right-click and choose "Save As" to download the file.

[SSD1306 Library Searchable](https://github.com/stlehmann/micropython-ssd1306/blob/master/ssd1306.py)

## The SPI Interface

The four-wire Inter-Integrated Circuit (I2C) connection is great for beginners who do not want to hook up many wires. But sometimes you need a faster screen with faster refresh times. This is when the Serial Peripheral Interface (SPI) connection is useful.

SPI needs seven wires total, but it can update a 128 x 64 pixel screen about 13 times faster than I2C.

## Displaying SPI Defaults

Run this short program to see the default SPI settings on your Pico.

```py
from machine import Pin
from ssd1306 import SSD1306_SPI   # load the SSD1306 SPI display driver

# default is data (MOSI) on GP7 and clock (sck) on GP6
spi = machine.SPI(0)   # create SPI bus using default pins
print(spi)             # print the SPI settings so you can see them
SPI(0, baudrate=992063, polarity=0, phase=0, bits=8, sck=6, mosi=7, miso=4)
```

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

* SCK is the clock — connect this to the OLED SCL pin.
* MOSI is the line carrying data from your Pico to the display. Connect this to the SDA pin.

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

We send the data to the SPI RX (Receive) port on the Pico. These are pin 1 (GP0) or pin 6 (GP4).

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    SPI uses five signal wires: Clock, Data, Chip Select, Data/Command, and Reset. Each wire has its own job. Together they let your Pico and display talk very fast!

## Sample Nonworking SPI Code

From the documentation:

!!! From Raspberry Pi Pico Documentation
    **spi** is an SPI object, which has to be created beforehand and tells the ports for SCLJ and MOSI. MISO is not used.

    **dc** is the GPIO Pin object for the Data/Command selection. It will be initialized by the driver.

    **res** is the GPIO Pin object for the reset connection. It will be initialized by the driver. If it is not needed, it can be set to None or omitted. In this case the default value of None applies.

    **cs** is the GPIO Pin object for the CS connection. It will be initialized by the driver. If it is not needed, it can be set to None or omitted. In this case the default value of None applies.

```py
import machine
import utime     # load the time library for pausing
import ssd1306   # load the SSD1306 display driver

led = machine.Pin(25, machine.Pin.OUT)  # set up the built-in LED on the Pico

spi_sck = machine.Pin(6)               # SPI clock wire on GPIO pin 6
spi_tx  = machine.Pin(7)               # SPI data wire on GPIO pin 7
spi = machine.SPI(0, baudrate=100000, sck=spi_sck, mosi=spi_tx)  # set up SPI bus at 100,000 Hz

CS  = machine.Pin(8)    # Chip Select pin — picks this display when pulled low
DC  = machine.Pin(9)    # Data/Command pin — tells display if bytes are data or a command
RES = machine.Pin(10)   # Reset pin — restarts the display chip if needed

oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)  # create display: 128 wide, 64 tall

# flash all pixels on
oled.fill(1)         # fill screen white (1 = on)
oled.show()          # send to screen
utime.sleep(0.5)     # wait half a second

oled.fill(0)                             # clear screen to black (0 = off)
oled.text('CoderDojo Rocks!', 0, 0, 1)   # draw text at top-left corner, white
oled.show()                              # send image to screen

# flash the LED to show end
led.high()        # turn built-in LED on
utime.sleep(0.5)  # wait half a second
led.low()         # turn built-in LED off

print('Done')     # print to console when finished
```

**What each line does:**

1. `import machine` — loads the hardware library.
2. `import utime` — loads the time library (used for `sleep`).
3. `import ssd1306` — loads the display driver.
4. `led = machine.Pin(25, machine.Pin.OUT)` — sets up the built-in LED as an output.
5. `spi_sck = machine.Pin(6)` — names the SPI clock pin.
6. `spi_tx = machine.Pin(7)` — names the SPI data pin (also called MOSI).
7. `spi = machine.SPI(0, ...)` — creates the SPI bus at 100,000 signals per second.
8. `CS = machine.Pin(8)` — Chip Select pin. The driver pulls this low when talking to the display.
9. `DC = machine.Pin(9)` — Data/Command pin. Tells the display if you are sending a drawing command or pixel data.
10. `RES = machine.Pin(10)` — Reset pin. Restarts the display chip.
11. `oled = ssd1306.SSD1306_SPI(...)` — creates the display object using all the SPI pins.
12. `oled.fill(1)` — turns on all pixels (white screen).
13. `oled.show()` — sends the image to the screen.
14. `utime.sleep(0.5)` — waits 0.5 seconds so you can see the white screen.
15. `oled.fill(0)` — clears the screen to black.
16. `oled.text(...)` — draws text at the top-left corner.
17. `oled.show()` — sends the text to the screen.
18–20. LED flash — blinks the Pico's built-in LED to show the program finished.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Double-check that VCC goes to the 3.3V pin on your Pico, not the 5V pin. Most small OLED displays only work at 3.3V. Connecting to 5V can damage the display.

## References

[robert-hh's SH1106 Driver](https://github.com/robert-hh/SH1106)

[MicroPython SSD1306 Class](https://github.com/stlehmann/micropython-ssd1306/blob/master/ssd1306.py)

https://www.mfitzp.com/article/oled-displays-i2c-micropython/

https://github.com/adafruit/Adafruit_CircuitPython_SSD1306/blob/master/examples/ssd1306_stats.py

https://github.com/robert-hh/SH1106/blob/master/sh1106.py

[DIY More OLED Product Description](https://www.diymore.cc/collections/all-about-arduino/products/2-42-inch-12864-oled-display-module-iic-i2c-spi-serial-for-arduino-c51-stm32-green-white-blue-yellow?variant=17060396597306)

## SSD1306
https://www.solomon-systech.com/en/product/advanced-display/oled-display-driver-ic/ssd1306/

## SSD1307
https://www.solomon-systech.com/en/product/advanced-display/oled-display-driver-ic/ssd1307/

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You learned about the SPI interface and how all seven wires work together. SPI displays are fast and powerful. Next, you will build a wiring harness to make connecting displays easier!
