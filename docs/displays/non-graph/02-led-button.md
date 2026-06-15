# LED Button Lab

!!! mascot-welcome "Welcome to the LED Button Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    An LED button is a button and an LED combined in one part! Press it to turn
    on the light — or use code to control the light while the button waits for
    your touch. Let's build something amazing!

## What Is an LED Button?

An **LED button** is a push button that has a small LED built into the cap.
When the LED is on, the button glows. This makes it easy to see which button
is active — perfect for game controllers, status panels, and interactive projects.

The **Grove LED Button** from Seeed Studio is a popular choice. It has a four-pin
Grove connector:

| Pin | Signal |
|-----|--------|
| 1 | Button signal (HIGH when not pressed, LOW when pressed) |
| 2 | LED signal (HIGH to turn LED on) |
| 3 | GND |
| 4 | VCC (3.3 V) |

You can also use any push button paired with a separate LED — the wiring and code
are the same.

## Parts You Need

| Part | Quantity | Approximate Cost |
|------|----------|-----------------|
| Raspberry Pi Pico | 1 | $4 |
| Grove LED Button (or button + LED) | 1 | $2–$3 |
| Solderless breadboard | 1 | $3 |
| Jumper wires | 4 | — |
| 330 Ω resistor (if using separate LED) | 1 | <$1 |

## Wiring Steps

1. Connect **VCC** on the button to **3.3 V (pin 36)** on the Pico.
2. Connect **GND** on the button to any **GND** pin on the Pico.
3. Connect the **button signal** wire to **GP14** on the Pico.
4. Connect the **LED signal** wire to **GP15** on the Pico.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    If you use a separate LED instead of a Grove button, always put a **330 Ω
    resistor** in series with the LED. Without a resistor, too much current will
    flow and the LED will burn out.

## Sample Program: Button Toggles LED

This program turns the LED on when you press the button and off when you
press it again.

```python
from machine import Pin
import time

# Set up the button as an input with the internal pull-up resistor enabled
button = Pin(14, Pin.IN, Pin.PULL_UP)

# Set up the LED as an output
led = Pin(15, Pin.OUT)

led_state = False  # start with the LED off

while True:
    if button.value() == 0:        # button pressed (pulls pin LOW)
        led_state = not led_state  # flip the LED state
        led.value(led_state)       # apply the new state
        time.sleep(0.3)            # short delay to avoid bouncing
    time.sleep(0.05)               # check the button 20 times per second
```

## What Each Line Does

| Line | Purpose |
|------|---------|
| `Pin(14, Pin.IN, Pin.PULL_UP)` | Button input with internal pull-up (reads HIGH when not pressed) |
| `Pin(15, Pin.OUT)` | LED output pin |
| `button.value() == 0` | True when the button is pressed (pulls pin to GND) |
| `not led_state` | Flips True→False or False→True |
| `time.sleep(0.3)` | Waits 300 ms so one press = one toggle, not many |

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    `Pin.PULL_UP` turns on a tiny resistor inside the Pico that keeps the pin
    HIGH when the button is not pressed. When you press the button, it connects
    the pin to GND, so the pin goes LOW. That is how the Pico detects a press.

## Sample Program: LED Stays On While Button Is Held

This simpler version lights the LED only while you hold the button down:

```python
from machine import Pin
import time

button = Pin(14, Pin.IN, Pin.PULL_UP)
led = Pin(15, Pin.OUT)

while True:
    if button.value() == 0:  # button is being held down
        led.value(1)         # turn LED on
    else:
        led.value(0)         # turn LED off
    time.sleep(0.02)         # check 50 times per second
```

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try connecting the LED to a PWM pin and fading it in slowly when you press
    the button. Use `PWM(Pin(15))` and `duty_u16()` to control brightness!

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have wired up an LED button and controlled it two different ways.
    Next, try the 7-segment display to show numbers on screen!

## References

1. [Grove LED Button (Seeed Studio Wiki)](https://wiki.seeedstudio.com/Grove-LED_Button/)
2. [MicroPython Pin Documentation](https://docs.micropython.org/en/latest/library/machine.Pin.html)
