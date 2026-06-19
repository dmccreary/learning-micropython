# Using a Motor Controller Board

!!! mascot-welcome "Welcome to the Controller Board Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Individual transistors and H-bridge chips work great for learning. But when you want to build a real robot quickly, a motor controller board bundles everything into one neat package. Let's build something amazing!

## What Is a Motor Controller Board?

A **motor controller board** is a small printed circuit that already has all the wiring built in. It connects your microcontroller to one or more motors with just a few wires. You do not need loose transistors, diodes, or a messy breadboard circuit.

Most motor controller boards contain:

- An H-bridge chip (so each motor can go forward **or** backward)
- Screw terminals for the motor wires (so the connections stay tight)
- A power input for the motor battery
- Logic pins that connect to your Pico's GPIO pins

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The motor battery and the Pico's USB power are **separate**. Motors need their own power supply — usually 4 AA batteries — so they do not steal current from your Pico.

## The Maker Pi RP2040 Controller Board

One popular choice for MicroPython robots is the **Maker Pi RP2040** from Cytron. It has a Raspberry Pi RP2040 chip built right into the board, along with:

- **Two DC motor ports** (M1 and M2) with screw terminals
- **Four servo ports** labelled SERVO1–SERVO4
- **Two Grove connectors** for plug-and-play sensors
- **A piezo buzzer** and two programmable RGB LEDs

![Maker Pi RP2040 robot view](../../img/maker-pi-rp2040-robot.jpg)

Because the RP2040 chip is already on the board, you do not need a separate Pico. You just plug in batteries, connect motors, and start coding.

## Wiring a Two-Motor Robot

Follow these steps to connect two hobby DC motors to the M1 and M2 ports:

1. Loosen the two screws on the **M1** terminal.
2. Insert the two wires from your **left motor** into M1 — one wire per hole.
3. Tighten the screws firmly so the wires cannot pull out.
4. Repeat steps 1–3 for the **right motor** on the **M2** terminal.
5. Connect your **4 × AA battery pack** positive (red) wire to the **VIN** screw terminal.
6. Connect the battery pack negative (black) wire to the **GND** screw terminal.
7. Plug the **USB cable** into the board to power the RP2040 logic.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Make sure the battery pack **positive (red)** wire goes to VIN and the **negative (black)** wire goes to GND. Reversing them can damage the board.

## Controlling the Motors in MicroPython

The Maker Pi RP2040 motor driver uses four GPIO pins — two per motor — to set direction and speed.

| Pin  | Motor | Function          |
|------|-------|-------------------|
| GP8  | M1    | Direction         |
| GP9  | M1    | Speed (PWM)       |
| GP10 | M2    | Direction         |
| GP11 | M2    | Speed (PWM)       |

Here is a simple program that drives both motors forward for two seconds, then stops:

```python
from machine import Pin, PWM
import time

# Set up Motor 1 — left motor
m1_direction = Pin(8, Pin.OUT)   # direction pin: HIGH = forward, LOW = backward
m1_speed = PWM(Pin(9))           # speed pin — uses PWM to vary speed
m1_speed.freq(1000)              # set PWM to 1000 cycles per second

# Set up Motor 2 — right motor
m2_direction = Pin(10, Pin.OUT)  # direction pin for motor 2
m2_speed = PWM(Pin(11))          # speed pin for motor 2
m2_speed.freq(1000)              # same PWM frequency for smooth control

def drive_forward(motor_power):
    """Drive both motors forward at the given speed (0 to 65535)."""
    m1_direction.value(1)          # motor 1 forward direction
    m1_speed.duty_u16(motor_power) # motor 1 speed
    m2_direction.value(1)          # motor 2 forward direction
    m2_speed.duty_u16(motor_power) # motor 2 speed

def stop_motors():
    """Stop both motors."""
    m1_speed.duty_u16(0)  # duty cycle 0 = motor 1 stops
    m2_speed.duty_u16(0)  # duty cycle 0 = motor 2 stops

# Drive forward at 75% speed for 2 seconds, then stop
drive_forward(49152)  # 49152 is about 75% of 65535
time.sleep(2)
stop_motors()
```

## What Each Line Does

| Line | Purpose |
|------|---------|
| `PWM(Pin(9))` | Creates a PWM signal on the speed pin |
| `m1_speed.freq(1000)` | Sets the PWM frequency to 1000 Hz |
| `m1_direction.value(1)` | Sets the direction pin HIGH — motor goes forward |
| `m1_speed.duty_u16(49152)` | Sets speed to about 75% (49152 out of 65535 max) |
| `m1_speed.duty_u16(0)` | Sets speed to 0% — motor stops |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try changing `49152` to smaller numbers like `32768` (50%) or `16384` (25%) to see how speed changes. PWM speed values range from **0** (stopped) to **65535** (full speed).

## Reversing a Motor

To reverse a motor, change the direction pin from 1 to 0:

```python
def drive_backward(motor_power):
    """Drive both motors backward at the given speed (0 to 65535)."""
    m1_direction.value(0)          # direction LOW means reverse
    m1_speed.duty_u16(motor_power) # set motor 1 speed
    m2_direction.value(0)          # direction LOW means reverse
    m2_speed.duty_u16(motor_power) # set motor 2 speed
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `m1_direction.value(0)` | Sets direction pin LOW — motor runs in reverse |
| `m1_speed.duty_u16(motor_power)` | Sets motor speed to the given value |

## References

1. [Cytron Maker Pi RP2040 Product Page](https://www.cytron.io/p-maker-pi-rp2040)
2. [Maker Pi RP2040 Datasheet](https://docs.cytron.io/maker-pi-rp2040)
3. [MicroPython PWM Documentation](https://docs.micropython.org/en/latest/library/machine.PWM.html)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now control two motors with a real controller board — forward, backward, and stopped. Next you will combine this with sensors so your robot can detect obstacles and steer itself!
