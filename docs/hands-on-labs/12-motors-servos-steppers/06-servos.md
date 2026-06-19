# Controlling a Servo Motor with MicroPython

!!! mascot-welcome "Welcome to the Servo Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Servo motors are amazing — they rotate to a specific angle on command! You will use them to build robot arms, camera mounts, and steering systems. Let's get started!

## What Is a Servo Motor?

A **servo motor** is a special motor that turns to an exact angle and holds that position. Unlike a regular DC motor that just spins, a servo waits for your instructions and moves precisely.

Inside a servo are three things:

1. A small DC motor
2. A set of gears to give it more force
3. A control circuit that reads your signal and moves to the right angle

Servos are perfect for robot arms, camera mounts, steering mechanisms, and anything that needs to move to a specific position.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A servo does not spin freely like a DC motor. It turns to a specific angle — usually between 0° and 180° — and stays there until you tell it to move again.

## Types of Servos

There are many servo motors available. In these labs, you will use two main types:

1. **SG90 Micro Servo** — 9 grams, 180 degree range, plastic gears. Cost: about $4.
2. **MG90S Micro Servo** — 9 grams, 180 degree range, metal gears. Cost: about $5.

The MG90S has metal gears, which are stronger and last longer. For most projects, either type works fine.

There are also **continuous rotation servos** that spin like a DC motor instead of stopping at a set angle.

## Servo Connections

Almost all servos have a three-wire connector with pins spaced 1/10th of an inch apart. This fits standard breadboards and servo headers.

| Wire color | Signal | Connect to |
|-----------|--------|-----------|
| Black or brown | Ground | Pico GND |
| Red | 5 V power | Pico VBUS (5 V from USB) |
| Orange or yellow | Data signal | Pico GPIO pin |

## How Servo Control Works

You control a servo with **Pulse-Width Modulation (PWM)**. PWM sends a repeating pulse signal. The length of each pulse tells the servo what angle to move to.

- Pulse width of **1 ms** (millisecond) → servo moves to **0 degrees**
- Pulse width of **1.5 ms** → servo moves to **90 degrees** (middle)
- Pulse width of **2 ms** → servo moves to **180 degrees**

The pulses repeat at 50 Hz — meaning 50 pulses per second. Each pulse lasts 20 ms total, and the servo reads the HIGH portion to figure out its angle.

## Wiring Steps

Connect the servo like this:

1. Push the servo's brown or black wire into a breadboard row connected to the Pico's GND pin.
2. Push the servo's red wire into a row connected to the Pico's VBUS pin (5 V).
3. Push the servo's orange or yellow wire into a row connected to Pico GP15.

## Sample Code: Move a Servo to Different Angles

```python
from machine import Pin, PWM
import time

# Set up GP15 as a PWM pin to control the servo
servo_pwm = PWM(Pin(15))

# Servos need a 50 Hz signal — 50 pulses per second
servo_pwm.freq(50)

def set_servo_angle(angle_degrees):
    """Move the servo to the given angle (0 to 180 degrees)."""
    # Convert the angle to a pulse width between 1 ms and 2 ms
    # The full PWM range is 0 to 65535 (16-bit)
    # At 50 Hz, 1 ms = 3277 and 2 ms = 6554
    min_pulse = 3277   # 1 ms pulse = 0 degrees
    max_pulse = 6554   # 2 ms pulse = 180 degrees

    # Calculate the duty value for this angle
    duty_value = int(min_pulse + (angle_degrees / 180) * (max_pulse - min_pulse))
    servo_pwm.duty_u16(duty_value)  # send the pulse to the servo

# Move the servo to 0 degrees
set_servo_angle(0)
time.sleep(1)      # wait 1 second

# Move to the middle position (90 degrees)
set_servo_angle(90)
time.sleep(1)

# Move to the full position (180 degrees)
set_servo_angle(180)
time.sleep(1)

# Return to the start position
set_servo_angle(0)
time.sleep(1)
```

## What Each Line Does

| Line | Purpose |
|------|---------|
| `PWM(Pin(15))` | Creates a PWM output on GP15 to send servo signals |
| `servo_pwm.freq(50)` | Sets 50 Hz — the standard frequency all servos expect |
| `min_pulse = 3277` | The duty value for a 1 ms pulse — moves servo to 0° |
| `max_pulse = 6554` | The duty value for a 2 ms pulse — moves servo to 180° |
| `(angle_degrees / 180) * (max_pulse - min_pulse)` | Scales the angle to a pulse width |
| `servo_pwm.duty_u16(duty_value)` | Sends the calculated pulse to the servo |
| `time.sleep(1)` | Waits 1 second so the servo has time to reach its position |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If your servo twitches or buzzes at the end positions (0° or 180°), your min and max pulse values may need slight adjustments. Try `min_pulse = 3500` and `max_pulse = 6500` as a starting point.

## Try It: Sweep the Servo

This program sweeps the servo back and forth like a windshield wiper:

```python
from machine import Pin, PWM
import time

servo_pwm = PWM(Pin(15))  # servo on GP15
servo_pwm.freq(50)        # 50 Hz standard servo signal

def set_servo_angle(angle_degrees):
    """Move the servo to the given angle (0 to 180 degrees)."""
    min_pulse = 3277   # duty value for 0 degrees
    max_pulse = 6554   # duty value for 180 degrees
    duty_value = int(min_pulse + (angle_degrees / 180) * (max_pulse - min_pulse))
    servo_pwm.duty_u16(duty_value)

# Sweep back and forth 5 times
for sweep_count in range(5):
    # Sweep from 0 to 180 degrees in 10-degree steps
    for angle in range(0, 181, 10):
        set_servo_angle(angle)
        time.sleep(0.05)     # short pause so the motion looks smooth

    # Sweep back from 180 to 0 degrees in 10-degree steps
    for angle in range(180, -1, -10):
        set_servo_angle(angle)
        time.sleep(0.05)
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `for sweep_count in range(5)` | Repeats the sweep 5 times |
| `range(0, 181, 10)` | Counts from 0 to 180 in steps of 10 |
| `set_servo_angle(angle)` | Moves the servo to each angle in the loop |
| `time.sleep(0.05)` | Waits 50 ms between steps for a smooth sweep |
| `range(180, -1, -10)` | Counts backward from 180 to 0 in steps of 10 |

## References

1. [SparkFun Servos Page](https://www.sparkfun.com/servos)
2. [SparkFun Category for Servos](https://www.sparkfun.com/categories/245)
3. [eBay Servo Plastic Gears](https://www.ebay.com/itm/373083841236)
4. [eBay Servo Metal Gear](https://www.ebay.com/itm/294180115127)

!!! mascot-celebration "Excellent Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now move a servo to any angle with MicroPython! Try attaching a small cardboard arm to the servo horn and watch it wave. Next, you will explore stepper motors for even more precise motion control.
