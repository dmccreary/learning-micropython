# Four Digit LED Display

!!! mascot-welcome "Welcome to the 4-Digit Display Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will build a working clock using a 4-digit LED display! You will learn how to read the time and show it with a flashing colon. Let's build something amazing!

## What Is a 4-Digit LED Display?

A **4-digit LED display** is a row of four 7-segment digit displays. Each digit is made of seven LED segments that light up in different combinations to show numbers from 0 to 9. Many of these displays also have a **colon** (:) between the second and third digits — perfect for showing hours and minutes on a clock.

You can buy these displays for about $2 each.

These displays use the **TM1637** chip to communicate with the Pico. You will use [Mike Causer's **tm1637** library](https://github.com/mcauser/micropython-tm1637) to talk to the chip. Download this file and copy it to your Pico before running the examples below.

![4-digit LED display module](../../img/4-digit-led-display.png)

![4-digit LED display showing a clock time](../../img/4-digit-led-display-clock.png)

![Close-up of the colon between the digit pairs](../../img/4-digit-7-segment-colon.png)

## Connections

The display has four pins:

1. **GND** — ground (negative)
2. **VCC** — power (3.3 V or 5 V)
3. **DIO** — data signal (connects to a GPIO pin)
4. **CLK** — clock signal (connects to a GPIO pin)

## Wiring Steps

1. Connect **GND** on the display to any **GND** pin on the Pico.
2. Connect **VCC** on the display to the **3.3 V** pin on the Pico.
3. Connect **DIO** on the display to **GP0** on the Pico.
4. Connect **CLK** on the display to **GP1** on the Pico.

## Quick Start: Show a Number

This example writes the number 1234 to the display.

```python
from machine import Pin    # import Pin to control GPIO pins
from time import sleep     # import sleep for delays
import tm1637              # import the TM1637 display driver

# Pin numbers for data and clock
DIO_PIN = 0   # data signal on GP0
CLK_PIN = 1   # clock signal on GP1

# Set up the display using the TM1637 library
tm = tm1637.TM1637(clk=Pin(CLK_PIN), dio=Pin(DIO_PIN))

# Display the digits 1, 2, 3, 4
tm.write([1, 2, 3, 4])
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `import tm1637` | Loads the TM1637 driver library |
| `tm1637.TM1637(clk=Pin(CLK_PIN), dio=Pin(DIO_PIN))` | Creates the display object using GP0 and GP1 |
| `tm.write([1, 2, 3, 4])` | Sends the digits 1, 2, 3, 4 to the display |

The `tm.write()` function takes a list of numbers and shifts them in from right to left.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The TM1637 chip handles all the hard work. You just tell it which digits to show and it figures out which LED segments to light up. The `tm.numbers()` function makes showing hours and minutes even easier!

## Clock

You can build a simple clock using the `localtime()` function. It reads the current time from the Pico's internal clock. Call it once when the program starts, then count the seconds yourself with `sleep()`.

`localtime()` returns a list of numbers. The numbers at positions 3, 4, and 5 hold the hour, minute, and second.

![4-digit clock display](../../img/4-digit-clock.png)

```python
import tm1637                        # import the TM1637 display driver
from machine import Pin              # import Pin to control GPIO pins
from utime import sleep, localtime   # import sleep and localtime

# Set up the display with clock on GP1 and data on GP0
tm = tm1637.TM1637(clk=Pin(1), dio=Pin(0))

# Read the current time once at startup
now    = localtime()
hour   = now[3]   # the hour is at position 3 in the localtime list
minute = now[4]   # the minute is at position 4
sec    = now[5]   # the second is at position 5

# Convert from 24-hour to 12-hour format
if hour > 12:
    hour = hour - 12

print(hour, ':', minute, ' ', sec, sep='')   # print the time to the console

# Main loop — update the display every half-second to flash the colon
while True:
    tm.numbers(hour, minute, colon=True)   # show time with the colon lit
    sleep(0.5)                             # wait half a second

    tm.numbers(hour, minute, colon=False)  # show time with the colon off
    sleep(0.5)                             # wait half a second

    sec = sec + 1         # add one second to the counter
    if sec == 60:         # if we reach 60 seconds, reset and add a minute
        minute = minute + 1
        sec = 0
        if minute == 60:  # if we reach 60 minutes, reset and add an hour
            hour = hour + 1
            minute = 0
            if hour == 24:  # if we reach 24 hours, reset to midnight
                hour = 0
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `localtime()` | Returns a list of numbers describing the current date and time |
| `now[3]` | Gets the hour (position 3 in the localtime list) |
| `now[4]` | Gets the minute (position 4) |
| `now[5]` | Gets the second (position 5) |
| `tm.numbers(hour, minute, colon=True)` | Shows the hour and minute with the colon lit |
| `sleep(0.5)` | Waits half a second — the colon flashes once per second |
| `sec = sec + 1` | Counts up one second each loop |

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The Pico's internal clock resets every time you unplug the power. The time shown will be wrong after a restart unless you set the clock or use a Pico W to fetch the time from the internet.

## Accurate Clock

This version reads the real time from the system once every minute. That keeps the display more accurate over time.

```python
import tm1637                        # import the TM1637 driver
from machine import Pin              # import Pin for GPIO
from utime import sleep, localtime   # import sleep and localtime

hour   = 0   # start with hour 0
minute = 0   # start with minute 0
sec    = 0   # start with second 0

def update_time():
    """Read the current time from the Pico's internal clock."""
    global hour, minute, sec    # tell Python to update the global variables
    now    = localtime()
    hour   = now[3]             # get the current hour
    if hour > 12:
        hour = hour - 12        # convert to 12-hour format
    minute = now[4]             # get the current minute
    sec    = now[5]             # get the current second

# Set up the display with clock on GP1 and data on GP0
tm = tm1637.TM1637(clk=Pin(1), dio=Pin(0))

update_time()   # set the time before the loop starts

while True:
    tm.numbers(hour, minute, colon=True)    # show time, colon on
    sleep(0.5)
    tm.numbers(hour, minute, colon=False)   # show time, colon off
    sleep(0.5)
    sec = sec + 1       # count one second
    if sec == 60:
        update_time()   # re-read the real time every 60 seconds
        print(hour, ':', minute, ' ', sec, sep='')
        minute = minute + 1
        sec = 0
        if minute == 60:
            hour = hour + 1
            minute = 0
            if hour == 24:
                hour = 0
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `def update_time():` | Defines a function that reads the real clock |
| `global hour, minute, sec` | Allows the function to change these variables outside itself |
| `if sec == 60: update_time()` | Refreshes the time from the real clock each minute |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try using a Pico W and a Wi-Fi connection to fetch the correct time from the internet. Search for "MicroPython NTP" (Network Time Protocol) to learn how!

## References

* [Nerd Cave YouTube Tutorial](https://www.youtube.com/watch?v=D68XtvZlk00)
* [Mike Causer's GitHub Repo with TM-1637 driver](https://github.com/mcauser/micropython-tm1637)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You built a working clock with a flashing colon! Next, try the Character LCD lab to display full sentences on a 16×2 text screen.
