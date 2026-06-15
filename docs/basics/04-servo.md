# Controlling a Servo with MicroPython

!!! mascot-welcome "Welcome to the Servo Lab"
    ![Monty waving welcome](../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Servos are special motors that can move to a precise angle and hold it there.
    You will use them to make robot arms, camera pans, and steering systems.
    Let's build something amazing!

## What Is a Servo?

A **servo** is a motor with a built-in position sensor and control circuit.
You tell it an angle — say, 90 degrees — and it rotates to exactly that position
and stays there.

A typical hobby servo can move from **0 degrees** to **180 degrees**.

## Parts You Need

| Part | Quantity | Approximate Cost |
|------|----------|-----------------|
| Raspberry Pi Pico | 1 | $4 |
| SG90 Micro Servo | 1 | $2–$4 |
| Solderless breadboard | 1 | $3 |
| Jumper wires | 3 | — |

## Servo Connections

Almost every hobby servo has a **three-wire connector**:

| Wire color | Signal | Where to connect |
|------------|--------|-----------------|
| Brown or Black | Ground (GND) | Pico GND pin |
| Red | Power (5 V) | Pico VBUS pin (pin 40) |
| Orange or Yellow | Signal (data) | GP15 (or any PWM-capable pin) |

!!! mascot-warning "Watch Out!"
    ![Monty warning](../img/mascot/warning.png){ class="mascot-admonition-img" }
    Servos run on **5 V** power but accept a **3.3 V** signal from the Pico.
    Connect the red wire to **VBUS** (the 5 V USB pin), not to the 3V3 pin.
    Using 3.3 V power will make the servo weak or unreliable.

## How Servo Control Works

Servos use a signal called **Pulse-Width Modulation (PWM)**. The Pico sends
short pulses at 50 times per second (50 Hz). The **length** of each pulse tells
the servo where to move:

- A pulse of **1 millisecond (ms)** → 0 degrees
- A pulse of **1.5 ms** → 90 degrees (center)
- A pulse of **2 ms** → 180 degrees

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The Pico's `duty_u16()` value ranges from 0 to 65 535. At 50 Hz, a 1 ms pulse
    equals a duty value of about **1 638**, and a 2 ms pulse equals about **3 276**.

## Wiring Steps

1. Place the servo near your breadboard.
2. Connect the **brown/black wire** to any **GND** pin on the Pico.
3. Connect the **red wire** to **VBUS** (pin 40 on the Pico).
4. Connect the **orange/yellow wire** to **GP15** on the Pico.

## Sample Program

```python
from machine import Pin, PWM
import time

# Create a PWM signal on GP15 for the servo signal wire
servo_pin = PWM(Pin(15))
servo_pin.freq(50)  # servos need a 50 Hz signal

def set_angle(degrees):
    """Move the servo to the given angle (0 to 180 degrees)."""
    # Convert degrees to a pulse width between 1 ms and 2 ms
    # At 50 Hz, one full cycle = 20 ms = 65535 duty units
    # 1 ms pulse = 65535 / 20 = 3276 units
    # 2 ms pulse = 65535 / 10 = 6553 units
    min_duty = 1638   # duty value for 0 degrees  (0.5 ms pulse)
    max_duty = 8192   # duty value for 180 degrees (2.5 ms pulse)
    duty = int(min_duty + (max_duty - min_duty) * degrees / 180)
    servo_pin.duty_u16(duty)

# Sweep from 0 to 180 degrees and back
while True:
    for angle in range(0, 181, 10):   # 0 → 180 in steps of 10
        set_angle(angle)
        time.sleep(0.05)              # wait 50 ms between steps
    for angle in range(180, -1, -10): # 180 → 0 in steps of 10
        set_angle(angle)
        time.sleep(0.05)
```

## What Each Line Does

| Line | Purpose |
|------|---------|
| `PWM(Pin(15))` | Creates a PWM signal on GP15 |
| `servo_pin.freq(50)` | Sets the frequency to 50 Hz (required for servos) |
| `min_duty = 1638` | Duty value that produces a 0.5 ms pulse (0°) |
| `max_duty = 8192` | Duty value that produces a 2.5 ms pulse (180°) |
| `servo_pin.duty_u16(duty)` | Sends the calculated pulse width to the servo |
| `range(0, 181, 10)` | Counts from 0 to 180 in steps of 10 |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../img/mascot/tip.png){ class="mascot-admonition-img" }
    If your servo buzzes at the ends of its range, the `min_duty` and `max_duty`
    values may be slightly off for your particular servo model. Try adjusting
    `min_duty` up by 100 or `max_duty` down by 100 until the buzzing stops.

## Moving to a Specific Angle

Instead of the sweep loop, you can move to one specific position:

```python
set_angle(0)    # move to 0 degrees
time.sleep(1)

set_angle(90)   # move to center
time.sleep(1)

set_angle(180)  # move to 180 degrees
time.sleep(1)
```

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now move a servo to any angle with just a few lines of code.
    Next, try combining the servo with a button or potentiometer so a human
    can control the angle in real time!

## References

1. [MicroPython PWM Documentation](https://docs.micropython.org/en/latest/library/machine.PWM.html)
2. [SG90 Servo Datasheet](http://www.ee.ic.ac.uk/pcheung/teaching/DE1_EE/stores/sg90_datasheet.pdf)
3. [SparkFun Servo Tutorial](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial)
