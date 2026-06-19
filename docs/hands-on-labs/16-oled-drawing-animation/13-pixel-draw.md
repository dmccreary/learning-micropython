# Sample Pixel-Based Drawing Program

!!! mascot-welcome "Welcome to Etch-A-Sketch"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will build a digital Etch-A-Sketch! Two potentiometer knobs control where a line is drawn on the OLED screen. Let's build something amazing!

Code example provided by Jim Tannenbaum.

This program works like an Etch-A-Sketch toy. You use two potentiometers to control drawing. One knob controls the X (left-right) position. The other knob controls the Y (up-down) position. As you turn the knobs, the program draws a continuous line on the OLED display.

Press the reset button to clear the screen and start over.

## How It Works

The program reads the two potentiometer values every 0.2 seconds. It scales each raw reading (0 to 65,535) to the matching screen coordinate. Then it draws a line from the previous position to the new position.

This is the same idea behind how classic drawing tablets work.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The `scaled()` function converts one range of numbers to another. For example, a knob value of 32,768 (halfway between 0 and 65,535) maps to pixel 64 (halfway across a 128-pixel screen).

## Wiring Steps

1. Connect the OLED GND to Pico GND.
2. Connect the OLED VCC to Pico 3.3V.
3. Connect the OLED SDA to Pico GP4 (or match your SPI wiring).
4. Connect the OLED SCL to Pico GP5 (or match your SPI wiring).
5. Connect the center tap of the vertical potentiometer to Pico GP26 (ADC0).
6. Connect the center tap of the horizontal potentiometer to Pico GP27 (ADC1).
7. Connect the outer legs of each potentiometer to 3.3V and GND.
8. Connect one leg of the reset button to Pico GP14 and the other to GND.

## Code

```py
from machine import Pin, SPI, ADC   # import Pin, SPI, and ADC tools
import ssd1306                       # import the display driver
import time                          # import the time library

# scale a number from one range to another (like the Arduino map() function)
# value  = the number to convert
# istart = the low end of the input range
# istop  = the high end of the input range
# ostart = the low end of the output range
# ostop  = the high end of the output range
def scaled(value, istart, istop, ostart, ostop):
    return int(ostart + (ostop - ostart) * ((int(value) - istart) / (istop - istart)))

# --- set up the SPI display connection ---
spi_sck = Pin(2)                                           # SPI clock wire on GP2
spi_tx  = Pin(3)                                           # SPI data wire on GP3
spi     = SPI(0, baudrate=100000, sck=spi_sck, mosi=spi_tx)  # create the SPI connection

CS  = Pin(1)   # chip select pin
DC  = Pin(4)   # data/command select pin
RES = Pin(5)   # reset pin

oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)   # create the display object

# clear the screen and show it
oled.fill(0)    # fill with black (all pixels off)
oled.show()     # send the blank screen to the display

# show startup instructions
oled.text('Etch-A-Sketch', 0, 0,  1)    # title at the top
oled.text('Hit the reset',  0, 20, 1)   # instruction line 1
oled.text('button to clear', 0, 30, 1)  # instruction line 2
oled.text('the screen',     0, 40, 1)   # instruction line 3
oled.show()                              # show the instructions

# --- set up the reset button ---
# Pin.PULL_DOWN keeps the pin at 0V until the button pulls it to 3.3V
reset_button = Pin(14, Pin.IN, Pin.PULL_DOWN)

# wait until the user presses the reset button to start drawing
while reset_button.value() != 1:   # loop until button is pressed
    time.sleep(0.25)                # check every 0.25 seconds

oled.fill(0)    # clear the instructions from the screen
oled.show()     # show the blank screen

# --- set up the two potentiometers ---
vert  = ADC(26)   # vertical control knob on GP26 (ADC0)
horiz = ADC(27)   # horizontal control knob on GP27 (ADC1)

# calculate the starting position from the current knob values
start_x = new_x = scaled(vert.read_u16(),  0, 65536, 0, 128)  # scale vert to x (0–127)
start_y = new_y = scaled(horiz.read_u16(), 0, 65536, 0, 64)   # scale horiz to y (0–63)

# --- main drawing loop ---
while True:
    oled.line(start_x, start_y, new_x, new_y, 1)  # draw a line from old position to new position
    start_x = new_x                                 # update the previous x
    start_y = new_y                                 # update the previous y

    if reset_button.value():   # if reset button is pressed
        oled.fill(0)           # clear the screen to black

    oled.show()                # send the updated screen to the display

    time.sleep(0.2)            # wait 0.2 seconds before reading again

    new_x = scaled(vert.read_u16(),  0, 65536, 0, 128)  # read new x position from knob
    new_y = scaled(horiz.read_u16(), 0, 65536, 0, 64)   # read new y position from knob
```

**What each section does:**

1. `scaled(value, istart, istop, ostart, ostop)` — converts the knob value (0–65535) to a screen coordinate. For x it converts to 0–127; for y it converts to 0–63.
2. `SPI(0, baudrate=100000, ...)` — creates a fast SPI connection to the display at 100,000 bits per second.
3. `ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)` — creates the display object using SPI.
4. `while reset_button.value() != 1` — waits for the user to press the button before starting.
5. `ADC(26)` and `ADC(27)` — read the two potentiometer knob values.
6. `start_x = new_x = scaled(...)` — sets both the start and end of the first line to the same point.
7. `oled.line(start_x, start_y, new_x, new_y, 1)` — draws a line from the last position to the new position. This creates a smooth continuous line as you turn the knobs.
8. `start_x = new_x` — saves the new position so next time the line starts from here.
9. `if reset_button.value(): oled.fill(0)` — checks the reset button every loop. If pressed, clears the screen.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try changing `time.sleep(0.2)` to `time.sleep(0.05)` for a faster, smoother drawing experience. Smaller delay = more responsive knobs!

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    If the line looks jumpy, check that both knobs are wired correctly. Connecting outer legs to 3.3V and GND is easy to mix up — that is completely normal. Swap the outer wires if the knob seems backwards.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You built a working Etch-A-Sketch with MicroPython! Next, you will draw random hearts that appear all over the screen.
