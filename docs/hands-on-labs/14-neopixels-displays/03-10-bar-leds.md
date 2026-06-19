# Ten Bar LED Display

<iframe width="560" height="315" src="https://www.youtube.com/embed/SooCyURMsPE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

![Ten-segment LED bar graph showing all 10 LEDs in a row](../../img/led-bar-graph-10-segments.png)

!!! mascot-welcome "Welcome to the 10-Bar LED Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Ten LEDs in a row can show a level — like a battery meter or a signal strength bar. You will learn to control each LED with a Python list. Let's build something amazing!

## Goals for the Lesson

You can buy 10-segment LED bar displays for about 40 cents each. They are perfect for showing a reading such as battery charge or signal strength.

Your goal is to learn how to use Python **lists** to turn a row of 10 Light-Emitting Diodes (LEDs) on and off. A list is a way to store many values in one place. You will store all 10 General-Purpose Input/Output (GPIO) pin numbers in one list.

## Circuit

![10-segment LED package showing pin layout](../../img/led-10-segment-package-circuit.png)

The LED bar comes in a dual-in-line package. Each LED has two pins — one on each side of the package.

In the circuit below, the positive side (called the **anode**) of each LED connects to a GPIO pin. The negative side (called the **cathode**) connects through a 330-ohm resistor to the GND rail on the breadboard.

![Circuit diagram for the 10-segment LED bar connected to the Pico](../../img/led-10-segment-circuit.png)

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    You **must** use a current-limiting resistor with every LED. Without a resistor, too much current flows through the LED and it burns out. Use a 330-ohm resistor for each LED.

One end of each LED bar connects to a GPIO pin. The other end connects to the GND rail through a resistor.

## Wiring Steps

1. Place the 10-segment LED bar in the center of your breadboard.
2. Connect one 330-ohm resistor from each LED's cathode (negative) pin to the GND rail.
3. Connect the GND rail to any GND pin on the Pico.
4. Connect the anode (positive) pin of each LED to the GPIO pins listed below:

| LED number | GPIO pin |
|-----------|---------|
| LED 1 | GP12 |
| LED 2 | GP13 |
| LED 3 | GP14 |
| LED 4 | GP15 |
| LED 5 | GP20 |
| LED 6 | GP19 |
| LED 7 | GP18 |
| LED 8 | GP17 |
| LED 9 | GP16 |

## Programming

You will create a list that holds each GPIO pin number. Then you will loop over the list and set up each pin as an output.

```python
# Store all pin numbers in a list — easier than using 9 separate variables
pin_ids = [12, 13, 14, 15, 20, 19, 18, 17, 16]
```

Here is the full setup code that creates a Pin object for each number in the list:

```python
from machine import Pin    # import Pin so we can control GPIO pins
from utime import sleep    # import sleep so we can add delays

# List of GPIO pin numbers — one for each LED
pin_ids = [12, 13, 14, 15, 20, 19, 18, 17, 16]

pins = []  # start with an empty list — we will add pins to it

# Loop over the pin numbers and create a Pin object for each one
for pin_number in pin_ids:
    pins.append(Pin(pin_number, Pin.OUT))  # add each Pin object to the list
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `pin_ids = [12, 13, ...]` | Stores all 9 GPIO pin numbers in one list |
| `pins = []` | Creates an empty list to hold the Pin objects |
| `for pin_number in pin_ids:` | Loops through each number in pin_ids |
| `Pin(pin_number, Pin.OUT)` | Creates a Pin object set as an output |
| `pins.append(...)` | Adds the new Pin object to the pins list |

You will use this setup code at the top of every example in this lab.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A Python list lets you store many values together. Instead of writing `led1 = Pin(12)`, `led2 = Pin(13)`, and so on, you store all the pin numbers in one list and loop over it. Less code, same result!

## Code to Blink All 9 LEDs

This program turns all LEDs on, waits, turns them all off, and repeats.

```python
from machine import Pin    # import Pin to control GPIO pins
from utime import sleep    # import sleep for delays

# List of GPIO pin numbers connected to each LED
pin_ids = [12, 13, 14, 15, 20, 19, 18, 17, 16]

pins = []  # empty list to hold Pin objects

# Create a Pin object for each GPIO number and add it to the list
for pin_number in pin_ids:
    pins.append(Pin(pin_number, Pin.OUT))

delay = 0.5  # wait half a second between on and off

while True:
    # Turn all LEDs on
    for pin in pins:
        pin.on()       # turn this LED on
    sleep(delay)       # wait before turning them off

    # Turn all LEDs off
    for pin in pins:
        pin.off()      # turn this LED off
    sleep(delay)       # wait before turning them on again
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `for pin in pins:` | Loops through every Pin object in the list |
| `pin.on()` | Turns one LED on |
| `pin.off()` | Turns one LED off |
| `sleep(delay)` | Waits 0.5 seconds before the next step |

## Sample Running Lights Example

The "running lights" pattern makes it look like a light is moving along the bar. You turn one LED on, wait a moment, then turn it off before moving to the next one.

```python
from machine import Pin    # import Pin to control GPIO pins
from utime import sleep    # import sleep for delays

# List of GPIO pin numbers connected to each LED
pin_ids = [12, 13, 14, 15, 20, 19, 18, 17, 16]

pins = []  # empty list to hold Pin objects

# Create a Pin object for each GPIO number
for i in range(0, 9):
    pins.append(Pin(pin_ids[i], Pin.OUT))

delay = 0.1  # time each LED stays on (in seconds)

while True:
    # Move the light from left to right
    for i in range(0, 9):
        pins[i].on()     # turn this LED on
        sleep(delay)     # wait a moment
        pins[i].off()    # turn this LED off before moving to the next

    # Move the light from right to left
    for i in range(8, 1, -1):
        pins[i].on()     # turn this LED on
        sleep(delay)     # wait a moment
        pins[i].off()    # turn this LED off before moving to the next
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `range(0, 9)` | Counts from 0 to 8 — one index for each LED |
| `range(8, 1, -1)` | Counts backward from 8 to 2 to reverse direction |
| `pins[i].on()` | Turns on the LED at position i |
| `pins[i].off()` | Turns off the LED at position i |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try changing `delay = 0.1` to a smaller number like `0.05` to make the light move faster. Changing one variable controls the whole animation!

## Swipe Pattern

The swipe pattern turns each LED on and keeps it on until the whole bar is lit. Then it sweeps back and turns each LED off.

Try writing this yourself! Use the running lights code as a starting point. The key difference is that you do not turn off each LED before moving to the next one.

## Adding a Binary Counter Pattern

You can also create a pattern that shows binary counting. In binary, the rightmost LED flickers on and off fastest. Each LED to the left changes half as often as the one to its right. The leftmost LED changes only once for every 256 flickers of the rightmost LED.

This is a fun challenge to try after you finish the running lights example.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now control a row of 10 LEDs using a Python list and a loop. Next, try the Level Meter lab to drive the bar graph with a real sensor reading!
