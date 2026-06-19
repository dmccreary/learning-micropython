# OLED Potentiometer Example

!!! mascot-welcome "Welcome to the Potentiometer Display"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will connect a potentiometer knob to your OLED display and draw a live bar chart that grows and shrinks as you turn the knob. Let's build something amazing!

In this lesson, you will use a potentiometer (a turning knob) to change what appears on an OLED display. You will use a small SSD1306 OLED with an I2C (Inter-Integrated Circuit) interface.

A **potentiometer** (pot for short) has three legs. The two outside legs connect to GND and to the 3.3V output. The center leg, called the **tap**, connects to an input that converts a continuous voltage into a digital number. This process is called **analog-to-digital conversion (ADC)**.

[Wikipedia Page on Potentiometer](https://en.wikipedia.org/wiki/Potentiometer)

## Circuit Diagram

![OLED I2C clock and data wiring diagram](../../img/oled-i2c-clock-data.png)

![OLED potentiometer lab pin diagram showing GP26 for ADC input](../../img/oled-pot-lab-pins.png)

## Wiring Steps

1. Connect the OLED GND to Pico GND.
2. Connect the OLED VCC to Pico 3.3V.
3. Connect the OLED SDA to Pico GP0.
4. Connect the OLED SCL to Pico GP1.
5. Connect the center tap of the potentiometer to Pico GP26 (ADC0, physical pin 31).
6. Connect one outer leg of the potentiometer to Pico 3.3V.
7. Connect the other outer leg of the potentiometer to Pico GND.

## Testing the Potentiometer

Our first task is to confirm that the potentiometer is wired correctly. GP26 is the same as ADC0 (the first analog input pin, physical pin 31 on the Pico).

```py
import machine   # import the hardware control library
import utime     # import the time library

pot = machine.ADC(26)   # create an ADC object on GP26 (ADC0)

while True:
    print(pot.read_u16())   # print the raw pot reading every 0.2 seconds
    utime.sleep(0.2)
```

**What each line does:**

1. `machine.ADC(26)` — creates an ADC object on pin GP26. This converts the knob voltage to a number.
2. `pot.read_u16()` — reads the current knob position as a 16-bit unsigned integer.
3. `utime.sleep(0.2)` — waits 0.2 seconds before reading again.

### Sample 16-bit Output

A 16-bit unsigned integer can hold values from 0 to 65,535. Turning the knob from one end to the other gives you numbers across this full range.

Sample readings as the knob turns from minimum to maximum:

```data
65535
52844
31047
7745
256
352
19140
41114
62239
65535
57277
33384
10114
352
288
19940
28086
```

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The ADC gives you numbers from 0 to 65,535. That is 65,536 possible values (2 to the power of 16). Turning the knob all the way left gives 0. All the way right gives 65,535.

## Testing the OLED

Before combining the pot and OLED, let's confirm the display works on its own.

### Finding the Default I2C Pins

```py
from machine import Pin, I2C   # import Pin and I2C tools

i2c = machine.I2C(0)                             # create I2C on bus 0 with defaults
print("Device found at decimal", i2c.scan())     # print the device address
print(i2c)                                       # print the I2C settings
```

Results look like this:

```data
Device found at decimal [60]
I2C(0, freq=399361, scl=1, sda=0)
```

This tells you the display is at address 60 and the default pins are GP1 (clock) and GP0 (data).

### Displaying a Test Message

```py
from machine import Pin, I2C
from ssd1306 import SSD1306_I2C

WIDTH  = 128   # display width in pixels
HEIGHT = 64    # display height in pixels

i2c  = I2C(0)                          # use I2C0 with default pins (SCL=GP1, SDA=GP0)
oled = SSD1306_I2C(WIDTH, HEIGHT, i2c) # create the display object

oled.fill(0)                           # clear to black
oled.text("CoderDojo Rocks", 0, 0)     # draw test text at the top-left corner
oled.show()                            # send the drawing to the screen
```

## Continuous Text Display on OLED

This program reads the pot and shows the raw number on screen every 0.2 seconds.

```py
from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import machine
import utime

WIDTH  = 128
HEIGHT = 32

i2c     = I2C(0)                           # I2C0 with default pins
oled    = SSD1306_I2C(WIDTH, HEIGHT, i2c)  # create the display object

POT_PIN = machine.ADC(26)                  # potentiometer on GP26 (ADC0)

while True:
    pot_value = POT_PIN.read_u16()         # read the knob value (0–65535)
    oled.fill(0)                           # clear the screen each loop
    oled.text(str(pot_value), 0, 0)        # convert number to text and draw it
    oled.show()                            # send the drawing to the screen
    utime.sleep(0.2)                       # wait before the next reading
```

**What each line does:**

1. `machine.ADC(26)` — creates the ADC object for the knob on GP26.
2. `POT_PIN.read_u16()` — reads the raw knob value.
3. `oled.fill(0)` — clears the screen so old numbers don't stay on.
4. `str(pot_value)` — converts the number to a string so `oled.text()` can display it.
5. `oled.show()` — sends the updated screen.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Always call `oled.fill(0)` at the start of each loop. Without it, new text overlaps old text and the screen becomes a mess!

## Bar Chart and Text Display of Pot Value

This program draws a live bar chart that grows as you turn the knob. It also shows the raw and scaled values as text below the chart.

```py
import machine
import utime
import sh1106    # this example uses the SH1106 driver — swap for ssd1306 if needed

sda     = machine.Pin(0)        # data wire
scl     = machine.Pin(1)        # clock wire
pot_pin = machine.ADC(26)       # potentiometer on GP26

i2c = machine.I2C(0, sda=sda, scl=scl)   # create the I2C connection

# screen size in pixels
width       = 128
height      = 64
half_height = int(height / 2)  # the dividing line between bar chart and text

# create the display object (SH1106 variant)
oled = sh1106.SH1106_I2C(width, height, i2c, machine.Pin(4), 0x3c)

oled.fill(0)  # clear to black

# draw a border around the screen
def draw_border(screen_width, screen_height):
    oled.hline(0, 0,                screen_width - 1,  1)  # top edge
    oled.hline(0, screen_height - 2, screen_width - 1, 1)  # bottom edge
    oled.vline(0, 0,                screen_height - 1, 1)  # left edge
    oled.vline(screen_width - 1, 0, screen_height - 1, 1)  # right edge

# scale a number from one range to another (like the Arduino map() function)
def valmap(value, istart, istop, ostart, ostop):
    return int(ostart + (ostop - ostart) * ((value - istart) / (istop - istart)))

# draw a horizontal bar that fills from the left
def draw_horizontal_bar(bar_width, bar_height, pixel_color):
    oled.fill(0)                                          # clear the screen
    draw_border(width, height)                            # draw the border
    oled.fill_rect(0, 1, bar_width, bar_height, pixel_color)  # draw the filled bar
    utime.sleep(0.1)                                      # small pause for smoothness

# --- main loop ---
while True:
    raw_value    = int(pot_pin.read_u16())                     # read raw knob value (0–65535)
    scaled_value = valmap(raw_value, 0, 65536, 0, 127)        # scale to screen width (0–127)

    print(raw_value, scaled_value)   # print both values for debugging

    draw_horizontal_bar(scaled_value, half_height, 1)   # draw the bar in the top half

    # show the raw and scaled values as text in the bottom half
    oled.text('raw:',    0,  half_height + 5,  1)
    oled.text(str(raw_value), 30, half_height + 5,  1)
    oled.text('scaled:', 0,  half_height + 15, 1)
    oled.text(str(scaled_value), 60, half_height + 15, 1)

    oled.show()   # send everything to the screen
```

**What each section does:**

1. `sh1106.SH1106_I2C(...)` — creates the display using the SH1106 driver. Change to `SSD1306_I2C` if your display uses that chip.
2. `draw_border()` — draws four lines around the screen edges.
3. `valmap(raw_value, 0, 65536, 0, 127)` — scales the knob value (0–65535) to screen width (0–127).
4. `oled.fill_rect(0, 1, bar_width, bar_height, 1)` — draws a filled rectangle whose width matches the knob position.
5. `oled.text('raw:', 0, half_height + 5, 1)` — draws the label "raw:" in the bottom half of the screen.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    If you use the wrong display driver (ssd1306 vs sh1106), the screen may show garbage or nothing at all. Check the chip name on the back of your OLED module.

## Gif of OLED

Gif of small .96" OLED:
![OLED Pot Small](../../img/pot-oled.gif)

Gif of larger 2.42" OLED:
![OLED Pot Large Screen](../../img/oled-pot-i2c-large.gif)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You connected a physical knob to the display and showed live data as a bar chart! Next, you will use two potentiometers to draw like an Etch-A-Sketch.
