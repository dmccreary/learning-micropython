# OLED Setup

!!! mascot-welcome "Let's Get Your Display Ready"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every MicroPython program needs a setup section at the top. This page shows you the setup code for both I2C and SPI OLED displays. Pick the one that matches your display!

At the top of every MicroPython program, you write a few lines of setup code. This setup code tells the program which libraries to load, which pins to use, and which devices to create. You do this once before your main code runs.

We will look at the I2C setup first. Then we will look at the SPI setup.

## I2C Scanner

Your microcontroller can have many Inter-Integrated Circuit (I2C) devices connected at the same time. Each device needs a unique address so the microcontroller knows which one to talk to. Most OLED displays come set to address 60 by default. The hexadecimal version of that address is 3C.

Run this code to check that your display is connected and find its address:

```py
import machine

sda = machine.Pin(0)   # data wire on GPIO pin 0
scl = machine.Pin(1)   # clock wire on GPIO pin 1
i2c = machine.I2C(0, sda=sda, scl=scl, freq=400000)  # set up I2C bus

print("Device found at decimal", i2c.scan())  # print all I2C addresses found
```

**What each line does:**

1. `import machine` — loads the hardware library.
2. `sda = machine.Pin(0)` — names the data wire pin.
3. `scl = machine.Pin(1)` — names the clock wire pin.
4. `i2c = machine.I2C(0, ...)` — creates the I2C connection at 400,000 signals per second.
5. `print(...)` — shows the list of device addresses found on the bus.

Expected output: `[60]`

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    I2C is like a telephone party line. Every device shares the same two wires, but each device has its own address number so the microcontroller can call the right one.

## SSD1306 Examples

### SSD1306 I2C Setup

Once the scanner finds your display, you can load the SSD1306 driver and show text.

```py
from ssd1306 import SSD1306_I2C  # import the SSD1306 display driver

oled = SSD1306_I2C(128, 64, i2c)   # create the display object: 128 wide, 64 tall
oled.text('Hello World!', 0, 0, 1)  # write text at column 0, row 0, color white
oled.show()                          # send the image to the screen
```

**What each line does:**

1. `from ssd1306 import SSD1306_I2C` — loads just the I2C class from the ssd1306 driver file.
2. `oled = SSD1306_I2C(128, 64, i2c)` — creates the display object. The numbers 128 and 64 are the screen width and height in pixels.
3. `oled.text('Hello World!', 0, 0, 1)` — places text at x=0, y=0. The `1` means white pixels.
4. `oled.show()` — sends everything you have drawn to the physical screen. Nothing appears until you call this!

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    You must call `oled.show()` at the end. Without it, nothing appears on the screen. Think of it like pressing "send" after writing a text message.

### SSD1306 SPI Setup

Serial Peripheral Interface (SPI) is faster than I2C but needs more wires.

Back connections:
![OLED Back Connections](../../img/oled-back-connections.png)

Front labels on OLED with SPI:
![OLED SPI Connection](../../img/oled-spi-connections.png)

Here is the connection diagram:

![SPI Connection](../../img/spi-connectins.png)

Here is the code:

```python
import machine
import ssd1306

spi_sck = machine.Pin(2)                            # clock wire on GPIO pin 2
spi_tx  = machine.Pin(3)                            # data wire on GPIO pin 3
spi = machine.SPI(0, baudrate=100000, sck=spi_sck, mosi=spi_tx)  # set up SPI bus

CS  = machine.Pin(1)   # Chip Select pin — picks this display
DC  = machine.Pin(4)   # Data/Command pin — tells display if bytes are data or commands
RES = machine.Pin(5)   # Reset pin — restarts the display if needed

oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)  # create the display object
oled.text('Hello World!', 0, 0, 1)                       # write text at top-left corner
oled.show()                                               # send image to screen
```

**What each line does:**

1. `import machine` — loads the hardware library.
2. `import ssd1306` — loads the display driver.
3. `spi_sck = machine.Pin(2)` — names the SPI clock pin.
4. `spi_tx = machine.Pin(3)` — names the SPI data pin (also called MOSI).
5. `spi = machine.SPI(...)` — creates the SPI bus at 100,000 signals per second.
6. `CS = machine.Pin(1)` — the Chip Select pin. Pull it low to talk to the display.
7. `DC = machine.Pin(4)` — the Data/Command pin. Tells the display if you are sending a drawing command or pixel data.
8. `RES = machine.Pin(5)` — the Reset pin. Restarts the display chip.
9. `oled = ssd1306.SSD1306_SPI(...)` — creates the display object using all five pins.
10. `oled.text(...)` — draws text.
11. `oled.show()` — sends the drawing to the screen.

## SH1106 I2C Setup

If your display uses the SH1106 chip instead of the SSD1306, use this setup:

```py
from machine import Pin, I2C
import sh1106

sda = machine.Pin(0)                         # data wire on GPIO pin 0
scl = machine.Pin(1)                         # clock wire on GPIO pin 1
i2c = I2C(0, scl=scl, sda=sda, freq=400000)  # set up I2C bus

oled = sh1106.SH1106_I2C(128, 64, i2c)       # create the SH1106 display object
oled.text('Hello World!', 0, 0, 1)            # write text at top-left corner, white
oled.show()                                   # send image to screen
```

**What each line does:**

1. `from machine import Pin, I2C` — loads Pin and I2C classes from the machine library.
2. `import sh1106` — loads the SH1106 display driver.
3. Lines 3–4 — set up the data and clock wires (same as SSD1306).
4. `i2c = I2C(0, ...)` — creates the I2C bus.
5. `oled = sh1106.SH1106_I2C(128, 64, i2c)` — creates the display object.
6. `oled.text(...)` — draws text.
7. `oled.show()` — sends the drawing to the screen.

## References

[MicroPython SSD1306 Driver on GitHub](https://github.com/micropython/micropython/blob/master/drivers/display/ssd1306.py)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know how to set up both I2C and SPI OLED displays. Next, you will try full working examples for each type!
