---
title: Rotary Encoders, Touch Sensors, and Audio Input
description: Quadrature rotary encoders with interrupt handlers, capacitive touch with TTP223, digital microphone input over I2S, sound level detection, and FFT spectrum analysis.
generated_by: claude skill chapter-content-generator
date: 2026-06-12 23:20:00
version: 0.09
---

# Rotary Encoders, Touch Sensors, and Audio Input

## Summary

This chapter covers three sensor types that rely on more advanced input techniques than a simple digital read. Rotary encoders use quadrature signals and interrupt handlers to track rotation direction and position. Capacitive touch sensors detect a finger's presence without any physical click. Digital microphones such as the INMP441 stream audio data over the I2S bus, making it possible to measure sound levels and even analyze frequency content using the Fast Fourier Transform — the mathematical foundation of the spectrum analyzer project.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Rotary Encoder
2. Rotary Encoder CLK and DT Pins
3. Encoder Interrupt Handler
4. Quadrature Encoding
5. rotary Module
6. Touch Sensor TTP223
7. Capacitive Touch Sensing
8. Touch.value() Method
9. Microphone INMP441
10. INMP441 I2S Interface
11. Sound Level Detection
12. Microphone Sensitivity
13. Audio Sampling Rate
14. Fast Fourier Transform (FFT)
15. Spectrum Analyzer Concept

## Prerequisites

This chapter builds on concepts from:

- [Chapter 6: Digital Input, Output, and Interrupts](../06-digital-io-interrupts/index.md)
- [Chapter 8: Communication Protocols: I2C, SPI, and UART](../08-communication-protocols/index.md)

---

!!! mascot-welcome "Welcome to Chapter 11"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Three powerful input types in one chapter! Rotary encoders give your projects a satisfying twist-to-control knob. Touch sensors detect your finger without any moving parts. And a digital microphone lets the Pico hear the world. By the end you will have the ingredients for a spectrum analyzer — one of the coolest visual projects in this course!

## Rotary Encoders — Spin to Control

A **rotary encoder** is a knob that you can spin continuously in either direction. Unlike a potentiometer (which has a fixed start and end point), a rotary encoder has no physical limits. It generates pulses as it turns, and you count those pulses to track position.

Most cheap rotary encoders also include a push-button (press the shaft down). They have five pins: GND, 3.3V, CLK, DT, and SW (switch).

### Quadrature Encoding

The magic of rotary encoders is **quadrature encoding**. The encoder has two output pins: **CLK** (sometimes called A) and **DT** (sometimes called B). As you turn the knob, both pins pulse HIGH and LOW, but they are 90° out of phase with each other. The phase relationship tells you the direction:

- If CLK changes and DT is different from CLK → rotating clockwise.
- If CLK changes and DT is the same as CLK → rotating counter-clockwise.

This is why it is called "quadrature" (from the Latin for "square") — the two signals form a square wave pattern.

### Encoder Interrupt Handler

Detecting every encoder pulse reliably requires interrupts (Chapter 6). You attach an interrupt to the CLK pin that fires on every FALLING edge. Inside the handler, you read the DT pin to determine direction.

```python
from machine import Pin
import utime

clk = Pin(2, Pin.IN, Pin.PULL_UP)
dt  = Pin(3, Pin.IN, Pin.PULL_UP)

position = 0
last_clk = clk.value()

def encoder_isr(pin):
    global position, last_clk
    current_clk = clk.value()
    if current_clk != last_clk and current_clk == 0:
        if dt.value() != current_clk:
            position += 1    # clockwise
        else:
            position -= 1    # counter-clockwise
    last_clk = current_clk

clk.irq(trigger=Pin.IRQ_FALLING | Pin.IRQ_RISING, handler=encoder_isr)

while True:
    print("Position:", position)
    utime.sleep(0.1)
```

### The rotary Module

MicroPython has a community library called the **`rotary` module** that handles quadrature decoding for you. Copy `rotary.py` and `rotary_irq.py` from `src/drivers/` to your Pico.

```python
from rotary_irq_rp2 import RotaryIRQ

r = RotaryIRQ(pin_num_clk=2, pin_num_dt=3,
              min_val=0, max_val=100,
              reverse=False, range_mode=RotaryIRQ.RANGE_BOUNDED)

while True:
    print("Value:", r.value())
    utime.sleep(0.1)
```

The `min_val`, `max_val`, and `range_mode` arguments let you define a bounded range (like a volume control 0–100) or an unbounded counter.

## Capacitive Touch Sensing — No Click Required

A **touch sensor** detects the electrical capacitance change caused by a finger's proximity. The human body stores a small amount of electrical charge. When a finger comes close to the sensor pad, it changes the capacitance of the circuit, which the sensor chip detects.

Because there are no moving parts, capacitive touch sensors are silent and have essentially unlimited lifespans. They are found in smartphones, laptop touchpads, and interactive kiosks.

### TTP223 Touch Sensor

The **TTP223** is a one-button capacitive touch IC on a small breakout board. It has three pins: VCC (3.3 V), GND, and I/O (the digital output).

The I/O pin works exactly like a digital input:
- Normally LOW (no touch detected)
- Goes HIGH when a finger touches the sensor pad

```python
from machine import Pin
import utime

touch = Pin(16, Pin.IN)   # TTP223 output connected to GP16

while True:
    if touch.value() == 1:    # finger detected
        print("Touched!")
    utime.sleep(0.05)
```

You can also use an interrupt instead of polling:

```python
touch.irq(trigger=Pin.IRQ_RISING, handler=lambda p: print("Touch!"))
```

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The TTP223 has two solder-bridge pads on the back. By default it is in toggle mode (output flips state on each touch). Bridge the AHLB pad for momentary mode (output is HIGH only while touching). Bridge the IOL pad to invert the output logic. Read the datasheet for your specific module — some are wired differently.

## Audio Input — Digital Microphones

A **digital microphone** converts sound waves (air pressure variations) into a stream of digital numbers. Unlike analog microphones that output a continuous voltage, digital microphones output a stream of binary data that can be fed directly into the I2S bus.

### INMP441 — I2S Digital Microphone

The **INMP441** is a MEMS (Micro-Electro-Mechanical System) omnidirectional microphone with an I2S digital output. It has six pins: VDD (3.3 V), GND, SCK (bit clock), WS (word select/frame sync), SD (serial data), and L/R (channel select — tie to GND for the left channel).

Connect it to the Pico's I2S peripheral:

```python
from machine import I2S, Pin
import array

# Configure I2S for INMP441 microphone input
mic = I2S(0,
    sck=Pin(10), ws=Pin(11), sd=Pin(9),
    mode=I2S.RX,
    bits=32,                   # INMP441 outputs 24-bit data in a 32-bit frame
    format=I2S.MONO,
    rate=16000,                # 16 kHz sample rate
    ibuf=4000)                 # internal buffer size in bytes
```

The **audio sampling rate** is how many times per second the microphone measures the sound pressure level. A rate of 16,000 Hz (16 kHz) means 16,000 measurements per second — sufficient for clear speech. CD quality is 44,100 Hz; voice recognition works at 16,000 Hz.

### Sound Level Detection

To measure the loudness of sound, read a buffer of samples and calculate the root mean square (RMS) — a measure of average energy:

```python
import math, array

NUM_SAMPLES = 256
buf = array.array('l', [0] * NUM_SAMPLES)   # signed 32-bit integers

while True:
    mic.readinto(buf)           # fill buffer from microphone
    # Calculate RMS sound level
    sum_sq = sum(s * s for s in buf)
    rms = math.sqrt(sum_sq / NUM_SAMPLES)
    db_approx = 20 * math.log10(rms + 1)   # rough dB estimate
    print(f"Sound level: {db_approx:.1f}")
```

**Microphone sensitivity** specifies the output level for a reference sound pressure (usually 94 dB SPL). The INMP441 has a sensitivity of −26 dBFS — a relatively quiet room produces small numbers, while a loud clap produces large ones.

### Fast Fourier Transform — Analyzing Frequencies

When you listen to music, you hear many frequencies at once — bass, midrange, and treble. A **Fast Fourier Transform (FFT)** is a mathematical algorithm that separates a time-domain audio signal into its frequency components. The result shows how much energy is present at each frequency.

The **spectrum analyzer concept** is a display that shows this frequency breakdown in real time — tall bars for frequencies with high energy, short bars for quiet frequencies. You will build a NeoPixel or OLED spectrum analyzer in a later chapter using FFT output.

```python
# Conceptual FFT usage (requires a micropython-ulab or micropython-fft library)
import ulab.numpy as np

samples = array.array('h', [0] * 512)
mic.readinto(samples)

spectrum = np.fft.fft(np.array(samples))
magnitudes = np.abs(spectrum[:256])   # first 256 bins = 0 to sample_rate/2
```

Each bin in the `magnitudes` array corresponds to a frequency band. Bin 0 is DC (0 Hz); the last bin is `sample_rate / 2` Hz (the Nyquist limit).

#### Diagram: Spectrum Analyzer Concept

<iframe src="../../sims/spectrum-analyzer-concept/main.html" width="100%" height="420px" scrolling="no"></iframe>

<details markdown="1">
<summary>Spectrum Analyzer Concept MicroSim</summary>
Type: diagram
**sim-id:** spectrum-analyzer-concept<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain
Learning Objective: Students can explain how an FFT converts a time-domain audio signal into a frequency-domain spectrum and identify what the bars in a spectrum analyzer represent.

Canvas layout:
- Top half: a time-domain waveform display (like an oscilloscope)
- Bottom half: frequency-domain bar graph (spectrum analyzer display)

Visual elements:
- Top: a sine wave or composite waveform; a "Frequency" slider adds harmonics
- Bottom: color-coded bars (bass = red, mid = green, treble = blue) updating live
- Arrow from top to bottom labeled "FFT"

Interactive controls:
- createSlider() for adding a low-frequency component (50–200 Hz)
- createSlider() for adding a high-frequency component (2,000–8,000 Hz)
- createSlider() for "Noise" level (0–50%)
- Bars in the spectrum update to show the energy in each frequency band

Instructional Rationale: Seeing the waveform in the top half transform into bars in the bottom half with a labeled FFT arrow makes the abstract transform concrete — students see cause and effect directly.

Implementation: p5.js. Generate composite sine wave from slider values; compute analytical FFT bins from component frequencies; draw bars.
</details>

## Key Takeaways

- A **rotary encoder** uses two quadrature signals (CLK, DT) to track direction and count rotations; uses interrupts for reliable detection.
- **Quadrature encoding** detects direction from the phase relationship between the CLK and DT signals.
- Use the **`rotary` module** for easy bounded-range encoder control without writing the ISR yourself.
- The **TTP223** capacitive touch sensor outputs HIGH when touched — wire it exactly like a digital input.
- The **INMP441** is an I2S digital microphone; connect with `I2S(mode=I2S.RX)`.
- **Audio sampling rate** (e.g., 16,000 Hz) determines the maximum detectable frequency (sample_rate / 2).
- An **FFT** converts a time-domain audio buffer into frequency-domain magnitudes for spectrum analysis.

??? question "Quick Check: A rotary encoder CLK fires a FALLING interrupt. DT reads LOW (same as CLK). Which direction is it turning? (Click to reveal)"
    **Counter-clockwise.** When DT is the same as CLK at the moment CLK goes LOW, the encoder is moving counter-clockwise. When DT is different from CLK, it is clockwise.

!!! mascot-celebration "Input Toolkit Complete!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Knobs, touch, and sound — you now have an impressive input toolkit! Chapter 12 shifts to outputs with teeth: DC motors, servo motors, and stepper motors. Your Pico is about to move things in the physical world. Get ready to build something that actually drives around!
