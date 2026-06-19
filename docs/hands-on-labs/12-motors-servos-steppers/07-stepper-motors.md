# Controlling a Stepper Motor with MicroPython

![Stepper Motor](../../img/stepper-motor.png)

!!! mascot-welcome "Welcome to the Stepper Motor Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Stepper motors move in tiny, exact steps. They are used in 3D printers, CNC machines, and robots that need to move to a precise position. Let's learn how they work!

## What Is a Stepper Motor?

A **stepper motor** is a specialized motor that rotates in small, exact steps. Instead of spinning freely like a DC motor, a stepper motor moves one step at a time. Each step rotates the shaft by a fixed angle.

For example, a common stepper motor moves **1.8 degrees per step**. That means it takes **200 steps** to spin the shaft one full turn (200 × 1.8° = 360°).

Stepper motors are used to carefully position objects that move along an axis. For example, a 3D printer uses stepper motors to move the print head left, right, forward, and backward with great precision. Stepper motors are also more expensive than DC hobby motors or mini servos, so they are used in projects where precise movement matters most.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A stepper motor has several electromagnets inside. You energize them one at a time in a sequence. Each energized magnet pulls the shaft a tiny bit. Do this in order, and the shaft turns steadily and precisely.

## How Stepper Motors Work

Inside a stepper motor there are multiple electromagnets arranged in a ring. The shaft has magnets on it too. When you turn on one electromagnet, it pulls the shaft toward it. When you turn on the next electromagnet, the shaft moves to that one. This sequence of steps is called a **step sequence**.

There are two common step sequences:

- **Full step**: You energize one coil at a time. The motor moves in full steps.
- **Half step**: You energize two coils at a time, alternating. The motor moves in smaller, smoother steps.

## What You Need

- A **28BYJ-48 stepper motor** — a common, inexpensive stepper that works at 5 V
- A **ULN2003 driver board** — this takes your Pico's signals and provides enough power to drive the motor coils
- A **Raspberry Pi Pico** and USB cable
- **4 jumper wires** to connect the driver to the Pico

## Wiring Steps

Connect the ULN2003 driver board to the Pico like this:

1. Plug the stepper motor's connector into the ULN2003 driver board.
2. Connect the driver board's **IN1** pin to Pico **GP15**.
3. Connect the driver board's **IN2** pin to Pico **GP14**.
4. Connect the driver board's **IN3** pin to Pico **GP16**.
5. Connect the driver board's **IN4** pin to Pico **GP17**.
6. Connect the driver board's **VCC** pin to Pico **VBUS** (5 V from USB).
7. Connect the driver board's **GND** pin to Pico **GND**.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Stepper motors draw more current than a Pico pin can supply. Always use a driver board like the ULN2003. Never connect a stepper coil directly to a GPIO pin.

## Sample Code

The code below sends a **full step sequence** to the stepper motor. This energizes one coil at a time, in order, to rotate the shaft.

```python
from machine import Pin
import utime

# Set up four output pins for the stepper motor coils
coil_pin_1 = Pin(15, Pin.OUT)  # connected to IN1 on the ULN2003
coil_pin_2 = Pin(14, Pin.OUT)  # connected to IN2 on the ULN2003
coil_pin_3 = Pin(16, Pin.OUT)  # connected to IN3 on the ULN2003
coil_pin_4 = Pin(17, Pin.OUT)  # connected to IN4 on the ULN2003

# Group the pins into a list so we can loop through them easily
motor_pins = [coil_pin_1, coil_pin_2, coil_pin_3, coil_pin_4]

# Full step sequence — one coil at a time, in order
# Each row is one step: 1 = energize that coil, 0 = leave it off
full_step_sequence = [
    [1, 0, 0, 0],  # step 1: energize coil 1
    [0, 1, 0, 0],  # step 2: energize coil 2
    [0, 0, 1, 0],  # step 3: energize coil 3
    [0, 0, 0, 1],  # step 4: energize coil 4
]

# Spin the motor continuously
while True:
    for single_step in full_step_sequence:     # go through each step
        for pin_index in range(len(motor_pins)):  # set each coil pin
            motor_pins[pin_index].value(single_step[pin_index])
        utime.sleep_ms(1)  # wait 1 ms between steps — controls speed
```

## What Each Line Does

| Line | Purpose |
|------|---------|
| `Pin(15, Pin.OUT)` | Sets up GP15 as an output pin to control one motor coil |
| `motor_pins = [...]` | Groups all four coil pins into a list for easy looping |
| `full_step_sequence` | A list of four steps — each step turns on one coil |
| `[1, 0, 0, 0]` | Step 1: coil 1 is ON, all others are OFF |
| `for single_step in full_step_sequence` | Loops through each of the four steps |
| `motor_pins[pin_index].value(...)` | Turns each coil pin on or off for the current step |
| `utime.sleep_ms(1)` | Waits 1 millisecond — increase this number to slow the motor down |

## Changing the Speed

The speed of a stepper motor depends on how long you wait between steps. Change `utime.sleep_ms(1)` to control speed:

- `utime.sleep_ms(1)` → fast (1 ms between steps)
- `utime.sleep_ms(5)` → medium speed
- `utime.sleep_ms(20)` → slow and easy to watch

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If the motor vibrates but does not turn, your wiring order might be wrong. Try swapping IN1 and IN3, or check that each pin in `motor_pins` matches the right connector on the driver board.

## Reversing the Direction

To spin the motor backward, reverse the step sequence:

```python
# Reversed step sequence — runs the motor backward
reverse_step_sequence = [
    [0, 0, 0, 1],  # step 4 first
    [0, 0, 1, 0],  # step 3
    [0, 1, 0, 0],  # step 2
    [1, 0, 0, 0],  # step 1 last
]
```

Just replace `full_step_sequence` with `reverse_step_sequence` in the loop to spin backward.

## References

1. [Wikipedia Page on Stepper Motors](https://en.wikipedia.org/wiki/Stepper_motor)
2. [Raspberry Pi L293D Example](https://tutorials-raspberrypi.com/how-to-control-a-stepper-motor-with-raspberry-pi-and-l293d-uln2003a/)
3. [YoungWonks Stepper Motor Example with Pico](https://www.youngwonks.com/blog/How-to-use-a-stepper-motor-with-the-Raspberry-Pi-Pico)

!!! mascot-celebration "Fantastic Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now control a stepper motor with MicroPython! Stepper motors are used in 3D printers, robotic arms, and CNC machines. You just learned a skill that real engineers use every day.
