---
title: Analog Signals, ADC, and Pulse-Width Modulation
description: Reading varying voltages with the Pico's ADC, scaling 16-bit readings, using potentiometers and light sensors, and controlling brightness and speed with PWM.
generated_by: claude skill chapter-content-generator
date: 2026-06-12 22:40:00
version: 0.09
---

# Analog Signals, ADC, and Pulse-Width Modulation

## Summary

Not everything in the physical world is simply on or off — sensors produce varying voltages, and lights can glow at any brightness. This chapter explains how the Pico's analog-to-digital converter (ADC) reads continuous voltages from potentiometers and light sensors, and how to scale those raw 16-bit readings into useful numbers. You will also learn pulse-width modulation (PWM), a clever technique that uses rapid on/off switching to simulate variable voltages — enabling LED fading, brightness control, and the motor and servo control skills used in later chapters.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Analog Signal
2. Digital Signal
3. Analog-to-Digital Converter (ADC)
4. ADC Resolution (bits)
5. machine.ADC Class
6. ADC.read_u16() Method
7. ADC Voltage Reference
8. Potentiometer
9. Potentiometer as Voltage Divider
10. Voltage Divider Circuit
11. Reading Analog Values
12. Scaling ADC Values
13. Light Sensor (Photoresistor)
14. LDR (Light-Dependent Resistor)
15. Pulse-Width Modulation (PWM)
16. PWM Frequency
17. PWM Duty Cycle
18. machine.PWM Class
19. PWM.duty_u16() Method
20. LED Fade with PWM
21. Brightness Control
22. PWM for Servo Control
23. PWM for Motor Speed
24. Soft PWM

## Prerequisites

This chapter builds on concepts from:

- [Chapter 6: Digital Input, Output, and Interrupts](../06-digital-io-interrupts/index.md)

---

!!! mascot-welcome "Welcome to Chapter 7"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    The real world is not made of just ones and zeros — it has shades of brightness, degrees of warmth, and gradients of everything in between. In this chapter you will read that continuous world with the Pico's ADC, and control it smoothly with PWM. By the end you will be fading LEDs and setting up the concepts that drive motors and servos in later chapters!

## Analog vs Digital Signals

A **digital signal** has exactly two states: HIGH (3.3 V) or LOW (0 V). That is what you worked with in Chapter 6.

An **analog signal** can take any value between 0 V and 3.3 V. A potentiometer turned halfway gives 1.65 V. A light sensor in a dim room might give 0.8 V; in sunlight, 3.0 V. Temperature sensors, microphones, and joysticks all produce analog signals.

To use an analog signal in a Python program, you must convert it to a number. That is the job of the **analog-to-digital converter (ADC)**.

## The ADC — Turning Voltage into Numbers

An **ADC** samples the voltage on a pin and converts it to a whole number. The Pico's ADC has **12-bit resolution** internally, but MicroPython reports values as 16-bit unsigned integers (0–65535) to maintain compatibility across different hardware.

**ADC resolution** tells you how finely the converter can measure:
- 16-bit: 65,536 possible values between 0 V and 3.3 V
- Each step = 3.3 V ÷ 65,535 ≈ 0.00005 V (50 µV per step)

The **ADC voltage reference** is the maximum voltage the ADC can read. On the Pico it is 3.3 V — do not apply more than 3.3 V to an ADC pin.

The Pico has three ADC-capable pins: **GP26 (ADC0)**, **GP27 (ADC1)**, and **GP28 (ADC2)**. There is also a built-in temperature sensor on ADC channel 4.

### The machine.ADC Class

Import `ADC` from `machine`, then create an ADC object using the GPIO pin number:

```python
from machine import ADC

pot = ADC(26)   # potentiometer on GP26 (ADC channel 0)
```

### ADC.read_u16() Method

The **`ADC.read_u16()` method** reads the current voltage and returns an integer from 0 to 65535.

- `0` means 0 V (GND)
- `65535` means 3.3 V (full scale)

```python
raw = pot.read_u16()
print(raw)   # e.g., 32768 when the potentiometer is at 50%
```

## Potentiometers — Variable Resistors

A **potentiometer** (pot) is a three-terminal resistor with a sliding wiper. As you turn the knob, the wiper moves, changing how much resistance is between each terminal and the wiper.

When wired with one end to 3.3 V, the other end to GND, and the wiper to an ADC pin, the potentiometer acts as a **voltage divider**. A **voltage divider circuit** takes an input voltage and outputs a fraction of it, set by the ratio of two resistances.

As you turn the pot:
- Fully counterclockwise: wiper at GND → ADC reads ~0
- Fully clockwise: wiper at 3.3 V → ADC reads ~65535
- Middle: wiper at 1.65 V → ADC reads ~32768

### Scaling ADC Values

Raw ADC values (0–65535) are not usually the most useful form. **Scaling** maps them to a range that makes sense for your application.

```python
from machine import ADC

pot = ADC(26)

while True:
    raw = pot.read_u16()

    # Scale to a percentage (0–100)
    percent = raw / 65535 * 100

    # Scale to a voltage (0.0–3.3 V)
    voltage = raw / 65535 * 3.3

    # Scale to an angle (0–180 degrees, for a servo)
    angle = raw / 65535 * 180

    print(f"Raw: {raw}  %: {percent:.1f}  V: {voltage:.2f}  Angle: {angle:.0f}")
```

## Light Sensors — Photoresistors and LDRs

A **photoresistor** (also called a **light-dependent resistor** or **LDR**) changes its resistance based on the amount of light hitting it. In bright light, resistance is low (a few hundred ohms). In darkness, resistance is high (a few megaohms).

Wire an LDR and a fixed resistor (10 kΩ) as a voltage divider between 3.3 V and GND, with the ADC pin in the middle. As light changes, the ADC reading changes.

```python
from machine import ADC

ldr = ADC(27)     # LDR voltage divider on GP27

while True:
    reading = ldr.read_u16()
    # Higher reading = more light (with LDR on top, fixed resistor on bottom)
    if reading > 40000:
        print("Bright")
    elif reading > 20000:
        print("Dim")
    else:
        print("Dark")
```

#### Diagram: ADC and Potentiometer Explorer

<iframe src="../../sims/adc-potentiometer-explorer/main.html" width="100%" height="482px" scrolling="no"></iframe>

<details markdown="1">
<summary>ADC and Potentiometer Explorer MicroSim</summary>
Type: microsim
**sim-id:** adc-potentiometer-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: calculate
Learning Objective: Students can read a potentiometer value, interpret the raw ADC reading, and scale it to volts, percent, and a target range.

Canvas layout:
- Left 40%: a rotary knob (drag to turn) representing the potentiometer
- Center 30%: four labeled readouts — raw (0–65535), voltage (V), percent (%), and a user-defined target range slider
- Right 30%: a bar graph showing the scaled value in the chosen range

Visual elements:
- Rotary knob drawn with an arc indicating position; draggable
- Waveform line below the knob showing the last 2 seconds of readings
- Readouts update every 50 ms to simulate a real ADC sample

Interactive controls:
- Drag knob left/right to change value
- createSlider() for "Target range min" (0–1000) and "Target range max" (0–1000)
- Result formula shown: `scaled = raw / 65535 × (max - min) + min`

Instructional Rationale: Connecting the physical knob action to the live readout and scaling formula makes the abstract conversion concrete and interactive.

Implementation: p5.js. Knob as an arc; mouse drag changes value; three createSlider() for min, max, update rate; formula displayed dynamically.
</details>

## Pulse-Width Modulation (PWM)

A GPIO pin can only be HIGH or LOW — it cannot output 1.65 V. So how do you control LED brightness smoothly, or set a motor to half speed?

The answer is **pulse-width modulation (PWM)**. PWM rapidly switches the pin HIGH and LOW thousands of times per second. By changing the fraction of time it is HIGH, you control the *average* voltage the device receives.

Two parameters define a PWM signal:

- **PWM frequency** — how many complete on/off cycles happen per second, measured in hertz (Hz). For LEDs: 50–1,000 Hz is typical (faster prevents flicker). For servos: 50 Hz is required. For motors: 10–20 kHz is common.
- **PWM duty cycle** — the fraction of each cycle that the pin is HIGH. A 0% duty cycle is always off. A 100% duty cycle is always on. A 50% duty cycle means the pin is on for half of each cycle.

```
Duty cycle 10%:   ▌   ▌   ▌   (LED barely glows)
Duty cycle 50%:   ▌▌▌  ▌▌▌  ▌▌▌   (LED at half brightness)
Duty cycle 90%:   ▌▌▌▌▌▌▌▌▌  ▌  (LED nearly full brightness)
```

### The machine.PWM Class

```python
from machine import Pin, PWM

# Wrap an output pin in a PWM object
pwm_led = PWM(Pin(15))

# Set frequency (1,000 Hz for an LED)
pwm_led.freq(1000)

# Set duty cycle: 0 = always off, 65535 = always on
pwm_led.duty_u16(32768)   # 50% — half brightness
```

### PWM.duty_u16() Method

**`PWM.duty_u16(value)`** sets the duty cycle as a number from 0 to 65535. The scale matches `ADC.read_u16()` output — this makes it convenient to connect a potentiometer directly to PWM brightness:

```python
from machine import Pin, ADC, PWM

pot = ADC(26)
led = PWM(Pin(15))
led.freq(1000)

while True:
    duty = pot.read_u16()   # 0–65535 from the potentiometer
    led.duty_u16(duty)      # directly controls brightness!
```

## LED Fade with PWM

The classic **LED fade** gradually increases the duty cycle from 0 to full, then decreases it back to 0, creating a breathing effect:

```python
from machine import Pin, PWM
import utime

led = PWM(Pin(25))   # onboard LED
led.freq(1000)

while True:
    for duty in range(0, 65536, 512):   # ramp up
        led.duty_u16(duty)
        utime.sleep_ms(5)
    for duty in range(65535, -1, -512): # ramp down
        led.duty_u16(duty)
        utime.sleep_ms(5)
```

### PWM for Servo Control

Servo motors require a very specific PWM signal: **50 Hz frequency** and a pulse width between 1 ms (0°) and 2 ms (180°). At 50 Hz, each cycle is 20 ms, so:

- 1 ms pulse = 1/20 = 5% duty cycle = `0.05 × 65535 ≈ 3277`
- 2 ms pulse = 2/20 = 10% duty cycle = `0.10 × 65535 ≈ 6554`

```python
from machine import Pin, PWM

servo = PWM(Pin(16))
servo.freq(50)    # MUST be 50 Hz for servos

def set_angle(degrees):
    min_duty = 3277   # 1 ms pulse = 0 degrees
    max_duty = 6554   # 2 ms pulse = 180 degrees
    duty = int(min_duty + (max_duty - min_duty) * degrees / 180)
    servo.duty_u16(duty)

set_angle(90)   # center position
```

### PWM for Motor Speed

DC motors respond to the average voltage — higher duty cycle means faster rotation. You typically pair PWM with a motor driver chip (Chapter 12), but the PWM concept is the same:

```python
motor = PWM(Pin(17))
motor.freq(10000)       # 10 kHz — above audible range, no motor whine
motor.duty_u16(32768)   # 50% speed
```

!!! mascot-thinking "What Is Soft PWM?"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    **Soft PWM** (software PWM) generates a PWM-like signal using the CPU itself — switching a pin HIGH and LOW with `utime.sleep_us()` loops. It works on any GPIO pin but is imprecise because the CPU can be interrupted. Hardware PWM uses dedicated silicon that runs independently of your code. Always use hardware PWM when you can. Soft PWM is only for quick experiments on pins that do not have hardware PWM support.

## Key Takeaways

- **Analog signals** have continuous voltage levels; **digital signals** are only HIGH or LOW.
- The Pico's **ADC** on GP26–GP28 reads 0–3.3 V and returns 0–65535 (16-bit).
- `ADC.read_u16()` reads the current value; scale with `value / 65535 × target_range`.
- A **potentiometer** wired as a voltage divider provides a variable 0–3.3 V to the ADC.
- An **LDR** changes resistance with light; use a voltage divider to make it readable by the ADC.
- **PWM** rapidly switches a pin to simulate a variable average voltage.
- **PWM frequency** sets how fast; **duty cycle** (0–65535) sets how much on-time.
- Servos need 50 Hz; LEDs work at 500–1,000 Hz; motors work well at 10–20 kHz.

??? question "Quick Check: What duty_u16 value gives 25% brightness? (Click to reveal)"
    **16,383** (or 16384) — 25% of 65,535 is 16,383.75, so `65535 × 0.25 ≈ 16384`.

!!! mascot-celebration "Analog and PWM Mastered!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now read the analog world and control devices with smooth PWM signals. A potentiometer controls an LED's brightness, and the same concept drives servos and motors. In Chapter 8 you will learn the communication protocols — I2C, SPI, and UART — that let the Pico talk to sensors, displays, and other chips. The sensor library chapters are almost in reach!

## References

[See the Annotated References for this chapter](references.md)
