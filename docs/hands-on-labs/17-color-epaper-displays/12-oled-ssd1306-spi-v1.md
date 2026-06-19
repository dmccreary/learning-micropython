# OLED SPI Display Demo

!!! mascot-welcome "Welcome to the OLED SPI Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will connect an OLED screen using SPI — a very fast connection type. Then you will write code to print a message on the screen!

## What Is SPI?

**Serial Peripheral Interface (SPI)** is a way for the Pico to send data to a display very quickly. It uses four wires:

- **SCK** — the clock wire (keeps timing in sync)
- **MOSI** — the data wire (sends data from Pico to display)
- **CS** — chip select (tells the display "this message is for you")
- **DC** — data or command (tells the display what kind of message is coming)

SPI is faster than **I2C (Inter-Integrated Circuit)**, the other common connection type. SPI is a good choice when you want fast screen updates.

This demo was provided by Jim Tannenbaum (also known as Jet).

## Wiring Connections

![OLED SPI Connections](../../img/oled-spi-connections.png)

![OLED SSD1306 SPI Connections](../../img/oled-ssd1306-spi-connections.png)

Connect your OLED display to the Pico using these steps:

1. Connect the display's **SCK** pin to Pico **GP2** (the SPI clock pin).
2. Connect the display's **SDA** (also called MOSI) pin to Pico **GP3** (the SPI data pin).
3. Connect the display's **CS** pin to Pico **GP1** (chip select).
4. Connect the display's **DC** pin to Pico **GP4** (data or command select).
5. Connect the display's **RES** (reset) pin to Pico **GP5**.
6. Connect the display's **VCC** pin to the Pico's **3.3V** pin.
7. Connect the display's **GND** pin to the Pico's **GND** pin.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Double-check each wire before you plug in USB power. A wire in the wrong place can stop the display from working or even damage it.

## The Code

```python
import machine            # import the machine module to control hardware pins
import ssd1306            # import the SSD1306 OLED display driver

spi_sck = machine.Pin(2)  # set up GP2 as the SPI clock pin
spi_tx = machine.Pin(3)   # set up GP3 as the SPI data (MOSI) pin

# create the SPI connection at 100,000 bits per second
spi = machine.SPI(0, baudrate=100000, sck=spi_sck, mosi=spi_tx)

CS = machine.Pin(1)        # GP1 controls which device is selected
DC = machine.Pin(4)        # GP4 tells the display: data or command?
RES = machine.Pin(5)       # GP5 resets the display

# create the OLED display object: 128 pixels wide, 64 pixels tall
oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

oled.fill(0)               # clear the screen (fill with black)
oled.show()                # send the cleared screen to the display

oled.text('Hello Jet', 0, 0, 1)  # write the text at column 0, row 0, in white (1)
oled.show()                # send the updated screen to the display
```

## What Each Line Does

1. `import machine` — loads the tools for controlling Pico hardware pins.
2. `import ssd1306` — loads the driver that knows how to talk to the OLED screen.
3. `spi_sck = machine.Pin(2)` — tells the Pico that GP2 will be the clock wire.
4. `spi_tx = machine.Pin(3)` — tells the Pico that GP3 will carry the data.
5. `spi = machine.SPI(0, baudrate=100000, ...)` — starts the SPI connection at 100,000 bits per second.
6. `CS = machine.Pin(1)` — sets up GP1 as the chip select pin.
7. `DC = machine.Pin(4)` — sets up GP4 to tell the display if it is receiving data or a command.
8. `RES = machine.Pin(5)` — sets up GP5 to reset the display if needed.
9. `oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)` — creates the display object using all the pins you set up.
10. `oled.fill(0)` — fills the whole screen with black (0 means black, 1 means white).
11. `oled.show()` — sends the current image to the screen. Nothing appears until you call `show()`.
12. `oled.text('Hello Jet', 0, 0, 1)` — draws the words "Hello Jet" starting at position (0, 0), in white.
13. `oled.show()` — sends the updated image to the screen so the text appears.

!!! mascot-thinking "Why Call show() Twice?"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The display has a small memory buffer. Commands like `fill()` and `text()` change the buffer, but the screen only updates when you call `show()`. Think of it like drawing on paper before showing it to someone.

## What to Expect

After you run this code, the OLED screen will show the words **Hello Jet** in white text on a black background. The text starts in the top-left corner of the screen.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You connected an OLED display over SPI and made it show a message. Try changing the text in the `oled.text()` line to display your own name!
