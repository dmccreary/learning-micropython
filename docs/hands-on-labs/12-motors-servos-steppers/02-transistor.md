# Using a Transistor to Control a Motor

!!! mascot-welcome "Welcome to the Transistor Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will use a tiny electronic switch called a transistor to control a motor. The Pico sends a small signal, and the transistor does the heavy lifting!

## Power Requirements for Motors

A DC hobby motor needs about 200 milliamps (mA) of current to spin. That is a unit of electrical flow — like water flowing through a pipe. The problem is that the Raspberry Pi Pico's output pins can only safely switch about 17 milliamps.

That is not enough to run a motor directly. If you connected a motor straight to a Pico pin, you could damage the Pico permanently.

The solution is to use a **transistor**. A transistor is an electronic switch. A tiny signal from the Pico turns it on, and when it is on, it allows a much larger current to flow through it — enough to spin the motor.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of a transistor like a faucet handle. A small turn of the handle (the Pico's signal) controls a large flow of water (the motor current).

## Parts You Need

1. **Transistor**: NPN 2N2222A — the electronic switch
2. **Diode**: 1N4148 — protects the transistor from voltage spikes
3. **Motor**: 3–6 volt DC hobby motor

A **diode** is a component that lets current flow in only one direction. When a motor turns off, it can create a reverse voltage spike. The diode stops this spike from reaching and damaging the transistor. This is called a **flyback diode**.

![Motor Circuit](../../img/motor-circuit.png)

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never connect a motor directly to a GPIO pin on the Pico. The motor draws too much current and can permanently damage the Pico's chip.

## Wiring Steps

Connect the circuit in this order:

1. Place the 2N2222A transistor on your breadboard.
2. Connect the transistor's **base** pin to Pico GP21 through a 1 kΩ resistor.
3. Connect the transistor's **emitter** pin to the breadboard's ground rail.
4. Connect one motor wire to the transistor's **collector** pin.
5. Connect the other motor wire to your external power supply positive (+).
6. Place the 1N4148 diode across the motor terminals. The diode's stripe (cathode) goes toward the positive side.
7. Connect your external power supply ground to the breadboard's ground rail.
8. Connect the Pico's GND pin to the breadboard's ground rail.

## PWM Control

You can control how fast the motor spins using **Pulse-Width Modulation (PWM)**. PWM turns the transistor on and off many times per second. The longer it stays on during each cycle, the faster the motor spins.

### PWM Frequency

Set the frequency to 50 Hz. That means 50 on-off cycles per second. One cycle takes 20 milliseconds (ms). The duty cycle is how long the signal stays HIGH during each cycle.

- A duty value of **51** (out of 1023) means the signal is HIGH for about 1 ms per cycle. This is slow speed.
- A duty value of **102** (out of 1023) means the signal is HIGH for about 2 ms per cycle. This is faster speed.

## Sample Code

```py
import machine

# Set up GP21 as the motor control output pin
motor_pin = machine.Pin(21, machine.Pin.OUT)

# Create a PWM object to control the motor speed
motor_pwm = machine.PWM(motor_pin)

# Set PWM frequency to 50 Hz (50 cycles per second)
motor_pwm.freq(50)

# Set the duty cycle — 51 out of 1023 is a low-speed signal
motor_pwm.duty(51)
```

### What Each Line Does

| Line | What it does |
|------|-------------|
| `machine.Pin(21, machine.Pin.OUT)` | Sets GP21 as an output pin so it can send a signal |
| `machine.PWM(motor_pin)` | Creates a PWM object so we can control the speed |
| `motor_pwm.freq(50)` | Sets 50 Hz — the motor signal switches 50 times per second |
| `motor_pwm.duty(51)` | Sets the duty cycle to about 5% — a slow motor speed |

Try changing the duty value to `200`, `500`, or `900` to see the motor spin faster.

## References

1. [SparkFun Motor Lab from SIK Kit](https://learn.sparkfun.com/tutorials/sik-experiment-guide-for-arduino---v32/experiment-12-driving-a-motor)
2. [Nick Zoic MicroPython Motor Control Tutorial](http://mpy-tut.zoic.org/tut/motors.html)

!!! mascot-celebration "Nice Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You used a transistor to control a motor with MicroPython! Next, you will learn how to make a motor spin in both directions using an H-bridge circuit.
