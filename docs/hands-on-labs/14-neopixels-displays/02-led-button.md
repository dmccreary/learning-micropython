# LED Button Lab

!!! mascot-welcome "Welcome to the LED Button Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    An LED button is a button and a light combined in one part! Press it to turn on the glow — or use code to control the light while the button waits for your touch. Let's build something amazing!

## What Is an LED Button?

An **LED button** is a push button that has a small Light-Emitting Diode (LED) built into the cap. When the LED is on, the button glows. This makes it easy to see which button is active. You might find glowing buttons on game controllers, status panels, and interactive projects.

The **Grove LED Button** from Seeed Studio is a popular choice. It uses a four-pin Grove connector. Here is what each pin does:

| Pin | Signal |
|-----|--------|
| 1 | Button signal (HIGH when not pressed, LOW when pressed) |
| 2 | LED signal (HIGH to turn LED on) |
| 3 | GND (ground — the negative connection) |
| 4 | VCC (power — 3.3 V) |

You can also use any push button paired with a separate LED. The wiring and code are the same.

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
    If you use a separate LED instead of a Grove button, always put a **330 Ω resistor** in series with the LED. Without a resistor, too much current flows and the LED burns out instantly.

## Sample Program: Button Toggles LED

This program turns the LED on when you press the button. Press it again and the LED turns off.

```python
from machine import Pin   # import Pin so we can control GPIO pins
import time               # import time so we can add delays

# Set up the button as an input with the internal pull-up resistor turned on
button = Pin(14, Pin.IN, Pin.PULL_UP)

# Set up the LED as an output pin
led = Pin(15, Pin.OUT)

led_state = False  # start with the LED off (False = off, True = on)

while True:
    if button.value() == 0:        # button is pressed — it pulls the pin LOW (0)
        led_state = not led_state  # flip the state: True becomes False, False becomes True
        led.value(led_state)       # send the new state to the LED pin
        time.sleep(0.3)            # wait 300 ms so one press counts as one tap, not many
    time.sleep(0.05)               # check the button 20 times every second
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `from machine import Pin` | Loads the Pin tool so we can control hardware pins |
| `Pin(14, Pin.IN, Pin.PULL_UP)` | Sets GP14 as an input with the built-in pull-up resistor turned on |
| `Pin(15, Pin.OUT)` | Sets GP15 as an output so we can turn the LED on and off |
| `led_state = False` | Tracks whether the LED is on or off |
| `button.value() == 0` | True when the button is pressed (the pin drops to 0) |
| `not led_state` | Flips True to False, or False to True |
| `time.sleep(0.3)` | Waits 300 ms so one press equals one toggle, not many quick ones |

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    `Pin.PULL_UP` turns on a tiny resistor inside the Pico. That resistor keeps the pin HIGH when the button is not pressed. When you press the button, it connects the pin to GND, so the pin drops LOW. That drop is how the Pico detects a press.

## Sample Program: LED Stays On While Button Is Held

This simpler version lights the LED only while you hold the button down:

```python
from machine import Pin   # import Pin to control GPIO pins
import time               # import time for the delay

button = Pin(14, Pin.IN, Pin.PULL_UP)  # GP14 as button input with pull-up
led = Pin(15, Pin.OUT)                 # GP15 as LED output

while True:
    if button.value() == 0:  # button is held down — pin reads LOW
        led.value(1)         # turn the LED on (1 = on)
    else:
        led.value(0)         # button is not pressed — turn the LED off
    time.sleep(0.02)         # check 50 times every second
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `button.value() == 0` | Checks if the button is being pressed right now |
| `led.value(1)` | Turns the LED on |
| `led.value(0)` | Turns the LED off |
| `time.sleep(0.02)` | Waits 20 ms before checking again |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try connecting the LED to a Pulse Width Modulation (PWM) pin and fading it in slowly when you press the button. Use `PWM(Pin(15))` and `duty_u16()` to control brightness!

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You wired up an LED button and controlled it two different ways. Next, try the 7-segment display to show numbers with code!

## References

1. [Grove LED Button (Seeed Studio Wiki)](https://wiki.seeedstudio.com/Grove-LED_Button/)
2. [MicroPython Pin Documentation](https://docs.micropython.org/en/latest/library/machine.Pin.html)
