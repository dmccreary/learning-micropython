# Character LCD Display

![LCD 1602 character display showing two rows of text](../../img/lcd-1602.jpg)

!!! mascot-welcome "Welcome to the Character LCD Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A character LCD screen can show 32 letters and numbers at once — 16 on each row! You will print messages, move the cursor, and even control the backlight with code. Let's build something amazing!

## What Is a Character LCD Display?

A **character LCD (Liquid Crystal Display)** is a screen that shows text. The most popular size is the **16×2** model. It has 16 columns and 2 rows, so it can show 32 characters at once.

This lab uses the **LCM1602 I2C LCD interface** board. The I2C board clips onto the back of the LCD. It reduces the wiring from about 12 wires down to just 4.

**Inter-Integrated Circuit (I2C)** is a way for two devices to share data using just two signal wires. It is much simpler than connecting every pin separately.

The I2C board has four wires:

1. **GND** — ground (negative power)
2. **VCC** — power supply
3. **SDA** — data wire (sends and receives data)
4. **SCL** — clock wire (keeps the timing in sync)

The photo above shows a 3.3 V to 5 V voltage converter. Using 5 V gives the backlight more power and makes the screen easier to read. You can connect VCC to the Pico's 3.3 V pin, but the display may be harder to read in bright light.

## Wiring Steps

1. Connect **GND** on the I2C board to any **GND** pin on the Pico.
2. Connect **VCC** on the I2C board to the **3.3 V** pin on the Pico (or 5 V if you have a converter).
3. Connect **SDA** on the I2C board to **GP0** on the Pico.
4. Connect **SCL** on the I2C board to **GP1** on the Pico.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Make sure you connect SDA to GP0 and SCL to GP1. Swapping these two wires is a very common mistake. If the scanner finds no devices, check your SDA and SCL wires first.

## I2C Address Scanner Test

Before you can use the LCD, you need to find its **I2C address**. Every I2C device has a unique address — a number the Pico uses to talk to it. Run this scanner code to find the address.

```python
import machine   # import machine so we can use the I2C bus

I2C_SDA_PIN = 0   # SDA is on GP0
I2C_SCL_PIN = 1   # SCL is on GP1

# Set up the I2C bus on bus 0 at 400,000 Hz
i2c = machine.I2C(0,
                  sda=machine.Pin(I2C_SDA_PIN),
                  scl=machine.Pin(I2C_SCL_PIN),
                  freq=400000)

print('Scanning I2C bus.')
devices = i2c.scan()          # scan the bus and return a list of addresses found

device_count = len(devices)   # count how many devices were found
if device_count == 0:
    print('No I2C device found.')
else:
    print(device_count, 'devices found.')

for device in devices:
    print('Decimal address:', device, ', Hex address:', hex(device))
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `machine.I2C(0, sda=..., scl=..., freq=400000)` | Sets up the I2C bus on bus 0 at 400 kHz |
| `i2c.scan()` | Scans all possible addresses and returns the ones that answer |
| `len(devices)` | Counts the items in the devices list |
| `hex(device)` | Converts the address to a hex number (like 0x27) |

### Scanner Result

When the LCD is connected correctly, you should see output like this:

```
Scanning I2C bus.
1 devices found.
Decimal address: 39 , Hex address:  0x27
```

Write down the hex address. You will need it in the next step. Most LCM1602 boards use address `0x27`.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The I2C address is like a house number on a street. The Pico sends a message to that address, and only the device at that address answers. If the scanner shows no devices, the wiring has a problem — check your connections.

## Testing the LCD

Now you will display a message on the screen. This code uses two library files: `lcd_api.py` and `pico_i2c_lcd.py`. Copy both files to your Pico before running this.

```python
from machine import I2C, Pin       # import I2C and Pin
from lcd_api import LcdApi         # import the base LCD API library
from pico_i2c_lcd import I2cLcd    # import the Pico-specific I2C LCD driver

I2C_ADDR     = 0x27   # the I2C address found by the scanner
I2C_NUM_ROWS = 2      # the screen has 2 rows
I2C_NUM_COLS = 16     # the screen has 16 columns

# Set up the I2C bus on bus 0
i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)

# Create the LCD object using the I2C bus and the screen size
lcd = I2cLcd(i2c, I2C_ADDR, I2C_NUM_ROWS, I2C_NUM_COLS)

lcd.putstr("Hello, Maker!")   # print a message to the screen
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `I2C_ADDR = 0x27` | Stores the screen's I2C address |
| `I2cLcd(i2c, I2C_ADDR, I2C_NUM_ROWS, I2C_NUM_COLS)` | Creates the LCD object with the right address and size |
| `lcd.putstr("Hello, Maker!")` | Sends a string of text to the screen |

## Putting the Device Through Display Option Tests

Once you can display text, you can explore all the other things the LCD can do. Here is a list of the most useful functions:

1. `lcd.move_to(col, row)` — move the cursor to a specific column and row
2. `lcd.display_on()` and `lcd.display_off()` — turn the display on or off
3. `lcd.show_cursor()` and `lcd.hide_cursor()` — show or hide the blinking cursor
4. `lcd.blink_cursor_on()` and `lcd.blink_cursor_off()` — make the cursor blink or stop blinking
5. `lcd.backlight_on()` and `lcd.backlight_off()` — turn the backlight on or off
6. `lcd.clear()` — erase all text from the screen

The following test program cycles through all of these features automatically:

```python
import utime                        # import utime for sleep and localtime
import machine                      # import machine for Pin
from machine import I2C             # import I2C for the bus
from lcd_api import LcdApi          # import the base LCD library
from pico_i2c_lcd import I2cLcd    # import the Pico I2C LCD driver

I2C_ADDR     = 0x27   # LCD I2C address
I2C_NUM_ROWS = 2      # 2 rows
I2C_NUM_COLS = 16     # 16 columns per row

def test_main():
    """Run through all the LCD display options to test the screen."""
    print("Running test_main")

    # Set up the I2C bus
    i2c = I2C(0, sda=machine.Pin(0), scl=machine.Pin(1), freq=400000)

    # Create the LCD object
    lcd = I2cLcd(i2c, I2C_ADDR, I2C_NUM_ROWS, I2C_NUM_COLS)

    lcd.putstr("Hello, Maker!")   # show a greeting
    utime.sleep(10)               # leave it on screen for 10 seconds
    lcd.clear()                   # erase the greeting

    count = 0   # track which step we are on

    while True:
        lcd.clear()   # clear the screen at the start of each loop

        # Read the current time from the Pico's internal clock
        time = utime.localtime()

        # Show the date and time formatted as: YYYY/MM/DD HH:MM:SS
        lcd.putstr("{year:>04d}/{month:>02d}/{day:>02d} {HH:>02d}:{MM:>02d}:{SS:>02d}".format(
            year=time[0], month=time[1], day=time[2],
            HH=time[3], MM=time[4], SS=time[5]))

        # Every 10 loops, cycle through a display feature
        if count % 10 == 0:
            print("Turning cursor on")
            lcd.show_cursor()           # make the cursor visible

        if count % 10 == 1:
            print("Turning cursor off")
            lcd.hide_cursor()           # hide the cursor

        if count % 10 == 2:
            print("Turning blink cursor on")
            lcd.blink_cursor_on()       # make the cursor blink

        if count % 10 == 3:
            print("Turning blink cursor off")
            lcd.blink_cursor_off()      # stop the cursor blinking

        if count % 10 == 4:
            print("Turning backlight off")
            lcd.backlight_off()         # turn off the backlight

        if count % 10 == 5:
            print("Turning backlight on")
            lcd.backlight_on()          # turn the backlight back on

        if count % 10 == 6:
            print("Turning display off")
            lcd.display_off()           # blank the entire display

        if count % 10 == 7:
            print("Turning display on")
            lcd.display_on()            # turn the display back on

        if count % 10 == 8:
            print("Filling display")
            lcd.clear()
            fill_string = ""
            # Build a string of 32 printable characters to fill both rows
            for x in range(32, 32 + I2C_NUM_ROWS * I2C_NUM_COLS):
                fill_string += chr(x)   # chr() converts a number to a character
            lcd.putstr(fill_string)     # show the filled string

        count += 1          # move to the next step
        utime.sleep(2)      # wait 2 seconds before the next step

test_main()   # run the test function
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `utime.localtime()` | Returns the current date and time as a list |
| `lcd.putstr(...)` | Sends a formatted string to the LCD |
| `count % 10` | Cycles through values 0–9 to test each feature in turn |
| `chr(x)` | Converts a number to its matching character (32 = space, 33 = !, etc.) |
| `count += 1` | Adds 1 to count each loop |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Use `lcd.move_to(col, row)` to control exactly where your text appears. Row 0 is the top row and row 1 is the bottom row. Column 0 is the leftmost position.

## References

[Wokwi LCD Simulator](https://wokwi.com/projects/359400194112248833)

[Paul McWhorter Video on Using an LCD with an I2C Interface](https://www.youtube.com/watch?v=liwMc01LOIA&list=PLGs0VKk2DiYz8js1SJog21cDhkBqyAhC5&index=22)

[ChatGPT response when asked how to use a 2-line LCD with MicroPython](https://chatgpt.com/share/67ba0326-b104-8001-891e-b6a8d2c99d20)

[MFitzp article on OLED displays](https://www.mfitzp.com/article/oled-displays-i2c-micropython/)

[Adafruit LCD Guide](https://learn.adafruit.com/character-lcds)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now display text, move the cursor, and control the backlight on a 16×2 LCD! Next, try the NeoPixel Matrix lab to light up a full grid of color LEDs.
