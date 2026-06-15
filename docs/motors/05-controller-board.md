# Using a Motor Controller Board

!!! mascot-welcome "Welcome to the Controller Board Lab"
    ![Monty waving welcome](../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Individual transistors and H-bridge chips work great for learning. But when you
    want to build a real robot quickly, a motor controller **board** bundles everything
    into one neat package. Let's build something amazing!

## What Is a Motor Controller Board?

A motor controller board is a small printed circuit that already has all the wiring
built in. It connects your microcontroller to one or more motors with just a few
wires — no loose transistors, no diodes, no messy breadboard circuits.

Most motor controller boards contain:

- An H-bridge chip (so each motor can go forward **or** backward)
- Screw terminals for the motor wires (so the connections stay tight)
- A power input for the motor battery
- Logic pins that plug into your Pico's GPIO pins

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The motor battery and the Pico's USB power are **separate**. Motors need their
    own power supply — usually 4 × AA batteries — so they do not steal current
    from your Pico.

## The Maker Pi RP2040 Controller Board

One popular choice for MicroPython robots is the **Maker Pi RP2040** from Cytron.
It has a Raspberry Pi RP2040 chip built right in, along with:

- **Two DC motor ports** (M1 and M2) with screw terminals
- **Four servo ports** labelled SERVO1–SERVO4
- **Two Grove connectors** for plug-and-play sensors
- **A piezo buzzer** and two programmable RGB LEDs

![Maker Pi RP2040 robot view](../img/maker-pi-rp2040-robot.jpg)

Because the RP2040 chip is already on the board, you do not need a separate Pico.
You just plug in batteries, connect motors, and start coding.

## Wiring a Two-Motor Robot

Follow these steps to connect two hobby DC motors to the M1 and M2 ports:

1. Loosen the two screws on the **M1** terminal.
2. Insert the two wires from your **left motor** into M1 (one wire per hole).
3. Tighten the screws firmly so the wires do not pull out.
4. Repeat for the **right motor** on the **M2** terminal.
5. Connect your **4 × AA battery pack** to the **VIN** and **GND** screw terminals.
6. Plug the **USB cable** into the board to power the RP2040 logic.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../img/mascot/warning.png){ class="mascot-admonition-img" }
    Make sure the battery pack **positive (red)** wire goes to VIN and the
    **negative (black)** wire goes to GND. Reversing them can damage the board.

## Controlling the Motors in MicroPython

The Maker Pi RP2040 motor driver uses four GPIO pins — two per motor — to set
direction and speed.

| Pin  | Motor | Function          |
|------|-------|-------------------|
| GP8  | M1    | Direction A       |
| GP9  | M1    | Speed (PWM)       |
| GP10 | M2    | Direction A       |
| GP11 | M2    | Speed (PWM)       |

Here is a simple program that drives both motors forward for two seconds,
then stops:

```python
from machine import Pin, PWM
import time

# Set up Motor 1 (left motor)
m1a = Pin(8, Pin.OUT)   # direction pin
m1b = PWM(Pin(9))       # speed pin — uses PWM
m1b.freq(1000)          # 1 kHz PWM frequency

# Set up Motor 2 (right motor)
m2a = Pin(10, Pin.OUT)  # direction pin
m2b = PWM(Pin(11))      # speed pin — uses PWM
m2b.freq(1000)

def drive_forward(speed):
    """Drive both motors forward at the given speed (0–65535)."""
    m1a.value(1)         # motor 1 forward direction
    m1b.duty_u16(speed)  # motor 1 speed
    m2a.value(1)         # motor 2 forward direction
    m2b.duty_u16(speed)  # motor 2 speed

def stop():
    """Stop both motors."""
    m1b.duty_u16(0)
    m2b.duty_u16(0)

# Drive forward at 75% speed for 2 seconds, then stop
drive_forward(49152)  # 49152 is about 75% of 65535
time.sleep(2)
stop()
```

## What Each Line Does

| Line | Purpose |
|------|---------|
| `PWM(Pin(9))` | Creates a PWM signal on the speed pin |
| `m1b.freq(1000)` | Sets the PWM frequency to 1 000 Hz |
| `m1a.value(1)` | Sets the direction pin HIGH (forward) |
| `m1b.duty_u16(49152)` | Sets speed to 75% (49 152 out of 65 535) |
| `m1b.duty_u16(0)` | Sets speed to 0% — motor stops |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try changing `49152` to smaller numbers like `32768` (50%) or `16384` (25%)
    to see how speed changes. PWM speed values range from **0** (stopped)
    to **65535** (full speed).

## Reversing a Motor

To reverse a motor, flip the direction pin from 1 to 0:

```python
def drive_backward(speed):
    """Drive both motors backward at the given speed (0–65535)."""
    m1a.value(0)         # direction LOW means reverse
    m1b.duty_u16(speed)
    m2a.value(0)
    m2b.duty_u16(speed)
```

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now control two motors with a real controller board — forward, backward,
    and stopped. Next you will combine this with sensors so your robot can detect
    obstacles and steer itself!

## References

1. [Cytron Maker Pi RP2040 Product Page](https://www.cytron.io/p-maker-pi-rp2040)
2. [Maker Pi RP2040 Datasheet](https://docs.cytron.io/maker-pi-rp2040)
3. [MicroPython PWM Documentation](https://docs.micropython.org/en/latest/library/machine.PWM.html)
