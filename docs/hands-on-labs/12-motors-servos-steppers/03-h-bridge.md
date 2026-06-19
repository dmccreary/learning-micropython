# H-Bridge Circuits

!!! mascot-welcome "Welcome to the H-Bridge Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    To make a motor spin in two directions, you need a clever circuit called an H-bridge. Understanding H-bridges will help you understand every motor driver chip you ever use. Let's build something amazing!

## What Is an H-Bridge?

An H-bridge is a circuit made of four switches arranged around a motor. The arrangement looks like the letter **"H"**, with the motor forming the crossbar in the middle.

By opening and closing different pairs of switches, you can send current through the motor in either direction. This makes the motor spin forward or backward.

![H-Bridge Circuit Diagram](../../img/h-bridge.png)

## How the H-Bridge Works

Think about what happens when you connect a battery directly to a motor:

- Positive terminal → motor → negative terminal → motor spins clockwise.
- Flip the wires → motor spins counter-clockwise.

An H-bridge does the same thing electronically. You do not have to unplug and re-plug any wires. The four switches are numbered 1, 2, 3, and 4 around the H.

| Switch pair | Motor direction |
|-------------|----------------|
| 1 and 4 CLOSED, 2 and 3 OPEN | Forward (clockwise) |
| 2 and 3 CLOSED, 1 and 4 OPEN | Backward (counter-clockwise) |
| All switches OPEN | Motor coasts to a stop |
| 1 and 2 CLOSED at the same time | Short circuit — never do this! |

![H-Bridge Switch States](../../img/H_bridge_operating.svg.png)

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never close both switches on the same side of the H at the same time. For example, do not close switches 1 and 2 together, or 3 and 4 together. This creates a **short circuit** — a direct path from power to ground with no motor in between. It can destroy the switches instantly.

## Speed Control with PWM

You can control motor speed by switching the motor on and off very rapidly. This technique is called **Pulse-Width Modulation (PWM)**. You apply a PWM signal to one of the active switches instead of holding it fully on.

Here is how duty cycle affects speed:

- PWM duty cycle 100% → motor runs at full speed
- PWM duty cycle 50% → motor runs at half speed
- PWM duty cycle 0% → motor stops

The motor averages out the rapid switching and spins at a speed between stopped and full.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    An H-bridge is really just four fast electronic switches — usually transistors. Chips like the **L293D** and **DRV8833** put a complete H-bridge inside a single package so you do not have to wire up the individual switches yourself.

## Building an H-Bridge from Transistors

You can build a simple H-bridge with four NPN transistors (like 2N2222A) and four diodes (like 1N4148). However, this gets complex quickly. If you switch the wrong transistors at the same time, you can damage them.

For most projects, use a ready-made H-bridge chip instead. Here are some common choices:

| Chip | Motor channels | Max voltage | Max current | Cost |
|------|---------------|-------------|-------------|------|
| L293D | 2 | 36 V | 600 mA | about $0.50 |
| L298N | 2 | 46 V | 2 A | about $1 |
| DRV8833 | 2 | 10.8 V | 1.2 A | about $1 |
| TB6612FNG | 2 | 13.5 V | 1.2 A | about $1.50 |

The **L293D** and **DRV8833** are covered in the next labs.

## References

1. [Wikipedia — H-Bridge](https://en.wikipedia.org/wiki/H-bridge)
2. [SparkFun Motor Driver Hookup Guide](https://learn.sparkfun.com/tutorials/motor-driver-hookup-guide)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now understand how H-bridge circuits work — the idea behind every motor driver you will ever use. Head to the next lab to put an L293D H-bridge chip to work in a real circuit!
