# Quiz: Analog Signals, ADC, and Pulse-Width Modulation

Test your understanding of analog signals, ADC readings, potentiometers, and PWM with these questions.

---

#### 1. What is the key difference between an analog signal and a digital signal?

<div class="upper-alpha" markdown>
1. Analog signals are faster; digital signals are slower
2. Analog signals can take any value between 0 V and 3.3 V; digital signals are only HIGH or LOW
3. Digital signals come from sensors; analog signals come from buttons
4. Analog signals require two wires; digital signals require only one wire
</div>

??? question "Show Answer"
    The correct answer is **B**. An analog signal can take any continuous voltage value between its minimum and maximum — for example, a potentiometer might output 0.5 V, 1.2 V, or 2.7 V. A digital signal has only two states: HIGH (3.3 V) or LOW (0 V). Temperature sensors, microphones, and joysticks produce analog signals.

    **Concept Tested:** Analog Signal / Digital Signal

---

#### 2. Which GPIO pins on the Raspberry Pi Pico can be used as ADC inputs?

<div class="upper-alpha" markdown>
1. Any of the 26 GPIO pins
2. GP0 through GP7 only
3. GP26, GP27, and GP28
4. Only GP0 and GP1 (the I2C pins)
</div>

??? question "Show Answer"
    The correct answer is **C**. The Pico has three ADC-capable pins: GP26 (ADC0), GP27 (ADC1), and GP28 (ADC2). There is also an internal temperature sensor on ADC channel 4. Not every GPIO pin can read analog voltages — only these three external ones are connected to the ADC hardware.

    **Concept Tested:** machine.ADC Class

---

#### 3. What range of values does `ADC.read_u16()` return?

<div class="upper-alpha" markdown>
1. 0 to 1023 (10-bit)
2. 0 to 65535 (16-bit)
3. 0 to 255 (8-bit)
4. −32768 to 32767 (signed 16-bit)
</div>

??? question "Show Answer"
    The correct answer is **B**. `ADC.read_u16()` returns an unsigned 16-bit integer from 0 to 65535. A reading of 0 corresponds to 0 V (GND), and 65535 corresponds to the full ADC reference voltage of 3.3 V. The "u16" in the method name means "unsigned 16-bit integer."

    **Concept Tested:** ADC.read_u16() Method / ADC Resolution

---

#### 4. A potentiometer is connected with one end to 3.3 V, the other end to GND, and the wiper to GP26. The ADC reads 32768. Where is the potentiometer knob?

<div class="upper-alpha" markdown>
1. Turned fully counterclockwise (at GND)
2. At the halfway (center) position
3. Turned fully clockwise (at 3.3 V)
4. The reading indicates a broken connection
</div>

??? question "Show Answer"
    The correct answer is **B**. A reading of 32768 is approximately halfway between 0 and 65535, meaning the wiper is at the midpoint of the potentiometer, which outputs approximately 1.65 V (half of 3.3 V). A reading near 0 would mean the knob is fully counterclockwise, and near 65535 means fully clockwise.

    **Concept Tested:** Potentiometer as Voltage Divider / Scaling ADC Values

---

#### 5. How would you scale an ADC reading to a percentage from 0 to 100?

<div class="upper-alpha" markdown>
1. `percent = raw / 100`
2. `percent = raw * 65535 / 100`
3. `percent = raw / 65535 * 100`
4. `percent = (raw - 32768) / 328.68`
</div>

??? question "Show Answer"
    The correct answer is **C**. To convert a 0–65535 ADC reading to a 0–100 percentage, divide the raw reading by the maximum value (65535) to get a fraction between 0 and 1, then multiply by 100. For example, a reading of 32768 gives `32768 / 65535 × 100 ≈ 50%`. This pattern applies to any target range.

    **Concept Tested:** Scaling ADC Values

---

#### 6. What is PWM, and how does it simulate a variable voltage?

<div class="upper-alpha" markdown>
1. A way to convert analog signals to digital by sampling at high speed
2. Pulse-Width Modulation — rapidly switching a pin on and off so the average voltage equals the desired level
3. A protocol for sending audio data over a single wire at high frequency
4. A method for reading multiple ADC channels simultaneously
</div>

??? question "Show Answer"
    The correct answer is **B**. PWM (Pulse-Width Modulation) rapidly switches a GPIO pin between HIGH and LOW thousands of times per second. By changing the fraction of each cycle that the pin is HIGH (the duty cycle), you control the average voltage the connected device receives. An LED with 50% duty cycle appears half as bright as with 100%.

    **Concept Tested:** Pulse-Width Modulation (PWM)

---

#### 7. What PWM frequency must be used to control a standard hobby servo motor?

<div class="upper-alpha" markdown>
1. 1,000 Hz
2. 10,000 Hz
3. 50 Hz
4. 440 Hz
</div>

??? question "Show Answer"
    The correct answer is **C**. Standard hobby servo motors require exactly 50 Hz PWM (one cycle every 20 ms). The servo reads the pulse width within each 20 ms cycle to determine the target angle. Using a different frequency will cause the servo to behave unpredictably or not move at all. LEDs and motors can use much higher frequencies.

    **Concept Tested:** PWM Frequency / PWM for Servo Control

---

#### 8. What `duty_u16` value sets an LED to approximately 25% brightness?

<div class="upper-alpha" markdown>
1. 25
2. 16384
3. 250
4. 49151
</div>

??? question "Show Answer"
    The correct answer is **B**. The `duty_u16()` method accepts values from 0 (always off) to 65535 (always on, full brightness). To get 25% brightness: 25% × 65535 ≈ 16,384. The value 16384 tells the Pico to keep the pin HIGH for 25% of each cycle, making the LED appear at quarter brightness.

    **Concept Tested:** PWM.duty_u16() Method / Brightness Control

---

#### 9. A student connects a potentiometer output directly to `pot.read_u16()` and wants to control an LED's brightness with it. Which code correctly does this with minimum extra calculation?

<div class="upper-alpha" markdown>
1. `led.duty_u16(pot.read_u16() / 256)`
2. `led.duty_u16(pot.read_u16() * 255)`
3. `led.duty_u16(pot.read_u16())`
4. `led.duty_u16(pot.read_u16() / 65535 * 1000)`
</div>

??? question "Show Answer"
    The correct answer is **C**. Both `ADC.read_u16()` and `PWM.duty_u16()` use the same 0–65535 scale. This means you can pass the potentiometer reading directly to the PWM duty cycle with no conversion needed. Turn the pot to maximum, and the ADC returns 65535, which sets the LED to full brightness — a perfect match.

    **Concept Tested:** LED Fade with PWM / ADC.read_u16() Method

---

#### 10. What is "soft PWM" and when should you avoid it?

<div class="upper-alpha" markdown>
1. PWM at very low frequencies (below 1 Hz); avoid it to prevent visible flicker
2. PWM generated by the CPU toggling a pin in software; less precise and should be avoided when hardware PWM is available
3. PWM used only for soft materials like foam and cloth sensors; avoid for hard plastic components
4. PWM where the duty cycle is set to exactly 50%; use a different duty cycle for real control
</div>

??? question "Show Answer"
    The correct answer is **B**. Soft PWM uses the CPU itself to toggle a pin HIGH and LOW with `sleep_us()` loops, rather than using the Pico's dedicated PWM hardware. Because the CPU can be interrupted by other tasks, the timing is imprecise and jittery. Hardware PWM runs from dedicated silicon that operates completely independently of your code — always prefer it.

    **Concept Tested:** Soft PWM / PWM for Motor Speed

---
