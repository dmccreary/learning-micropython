# H-Bridge Circuits

!!! mascot-welcome "Welcome to the H-Bridge Lab"
    ![Monty waving welcome](../img/mascot/welcome.png){ class="mascot-admonition-img" }
    To make a motor spin in two directions, you need a clever circuit called an
    H-bridge. Understanding H-bridges will help you understand every motor driver
    chip you ever use. Let's build something amazing!

## What Is an H-Bridge?

An H-bridge is a circuit made of four switches arranged around a motor. The
arrangement looks like the letter **"H"**, with the motor forming the crossbar.

By opening and closing different pairs of switches, you can send current through
the motor in either direction — which makes the motor spin forward or backward.

![H-Bridge Circuit Diagram](../img/h-bridge.png)

## H-Bridge Circuit Operation

Think about what happens when you connect a battery directly to a motor:

- Positive terminal → motor → negative terminal → motor spins clockwise
- Flip the wires → motor spins counter-clockwise

An H-bridge does the same thing electronically, without you having to unplug
and re-plug wires.

The four switches are numbered 1, 2, 3, and 4 around the H:

| Switch pair | Motor direction |
|-------------|----------------|
| 1 and 4 CLOSED, 2 and 3 OPEN | Forward (clockwise) |
| 2 and 3 CLOSED, 1 and 4 OPEN | Backward (counter-clockwise) |
| All OPEN | Motor coasts to a stop |
| 1 and 2 CLOSED (same side) | **Short circuit — never do this!** |

![H-Bridge Switch States](../img/H_bridge_operating.svg.png)

!!! mascot-warning "Watch Out!"
    ![Monty warning](../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never close switches on the same side of the H at the same time (for example,
    1 and 2, or 3 and 4). This creates a **short circuit** — a direct path from
    power to ground with no motor in between. It can destroy the switches or
    blow a fuse instantly.

## Speed Control with PWM

You can control motor speed by switching the motor on and off very rapidly using
**Pulse-Width Modulation (PWM)**. Apply a PWM signal to one of the active
switches instead of holding it fully on.

- PWM duty cycle 100% → full speed
- PWM duty cycle 50% → half speed
- PWM duty cycle 0% → stopped

The motor averages out the rapid switching and spins at a speed between stopped
and full.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../img/mascot/thinking.png){ class="mascot-admonition-img" }
    An H-bridge is really just four fast electronic switches — usually transistors
    or MOSFETs. Chips like the **L293D** and **DRV8833** put a complete H-bridge
    inside a single package so you do not have to wire the individual switches yourself.

## Building an H-Bridge from Transistors

You can build a simple H-bridge with four NPN transistors (like 2N2222A) and
four diodes (like 1N4148). However, this gets complex quickly and the transistors
can be damaged if switched incorrectly.

For most projects, use a dedicated H-bridge chip instead:

| Chip | Motor channels | Max voltage | Max current | Cost |
|------|---------------|-------------|-------------|------|
| L293D | 2 | 36 V | 600 mA | ~$0.50 |
| L298N | 2 | 46 V | 2 A | ~$1 |
| DRV8833 | 2 | 10.8 V | 1.2 A | ~$1 |
| TB6612FNG | 2 | 13.5 V | 1.2 A | ~$1.50 |

The **L293D** and **DRV8833** are covered in the next labs.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now understand how H-bridge circuits work — the idea behind every motor
    driver you will ever use. Head to the next lab to put an L293D H-bridge chip
    to work in a real circuit!

## References

1. [Wikipedia — H-Bridge](https://en.wikipedia.org/wiki/H-bridge)
2. [SparkFun Motor Driver Hookup Guide](https://learn.sparkfun.com/tutorials/motor-driver-hookup-guide)

