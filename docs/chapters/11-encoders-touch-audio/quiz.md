# Quiz: Rotary Encoders, Touch Sensors, and Audio Input

Test your understanding of quadrature encoders, capacitive touch, digital microphones, and FFT with these questions.

---

#### 1. What makes a rotary encoder different from a potentiometer?

<div class="upper-alpha" markdown>
1. Potentiometers are digital; rotary encoders are analog
2. Rotary encoders can spin continuously with no fixed start or end; potentiometers have limited rotation
3. Rotary encoders require more GPIO pins than potentiometers
4. Potentiometers require interrupt handlers; rotary encoders do not
</div>

??? question "Show Answer"
    The correct answer is **B**. A potentiometer has physical stops that limit rotation to about 270°, and its resistance changes from one end to the other. A rotary encoder can spin continuously in either direction with no stops — it generates pulses as it turns, and you count those pulses to track position. This makes encoders ideal for volume controls and menus without limits.

    **Concept Tested:** Rotary Encoder

---

#### 2. What is quadrature encoding?

<div class="upper-alpha" markdown>
1. A method of encoding four different sensor values on one wire
2. Using two signals (CLK and DT) that are 90° out of phase to detect both direction and position
3. A way to encode 4-bit binary data in a single PWM pulse
4. Connecting four encoders to the same interrupt pin for simultaneous reading
</div>

??? question "Show Answer"
    The correct answer is **B**. Quadrature encoding uses two output pins (CLK and DT) that generate overlapping square wave pulses 90° out of phase with each other. The phase relationship reveals direction: if DT is different from CLK when CLK changes, the encoder rotates clockwise; if DT is the same as CLK, it rotates counter-clockwise.

    **Concept Tested:** Quadrature Encoding

---

#### 3. Why do rotary encoders use interrupt handlers instead of polling in a simple `while` loop?

<div class="upper-alpha" markdown>
1. Interrupt handlers run faster in a special processor cache reserved for encoder code
2. Polling can miss fast pulses if the main loop is busy doing other things
3. The MicroPython `rotary` module requires interrupts by design
4. Polling would reset the encoder position counter after each reading
</div>

??? question "Show Answer"
    The correct answer is **B**. Encoder pulses happen at the speed you turn the knob — potentially several times per millisecond. If the main loop is doing other work (updating a display, reading a sensor), it might not check the encoder pins between pulses, missing rotations entirely. An interrupt fires immediately when the CLK pin changes, regardless of what the main loop is doing.

    **Concept Tested:** Encoder Interrupt Handler

---

#### 4. The TTP223 capacitive touch sensor output goes HIGH when your finger touches it. How should you wire and read it in MicroPython?

<div class="upper-alpha" markdown>
1. Connect the output to an ADC pin and read analog values between 0 and 65535
2. Connect the output to a GPIO input pin and check `if touch.value() == 1:`
3. Connect the output to a PWM pin and measure the duty cycle
4. Connect the output to the SDA pin and read it over I2C
</div>

??? question "Show Answer"
    The correct answer is **B**. The TTP223 outputs a simple digital HIGH (1) when touched and LOW (0) when not touched — exactly like a digital button. Connect the I/O pin to any GPIO input pin and read it with `pin.value()`. Check for `1` to detect a touch. You can also attach an interrupt on `Pin.IRQ_RISING` for immediate response.

    **Concept Tested:** Touch Sensor TTP223 / Touch.value() Method

---

#### 5. What type of microphone is the INMP441, and which interface does it use?

<div class="upper-alpha" markdown>
1. An electret condenser microphone using the analog ADC input
2. A ribbon microphone using the SPI bus
3. A MEMS digital microphone using the I2S serial audio interface
4. A piezoelectric microphone using a GPIO interrupt input
</div>

??? question "Show Answer"
    The correct answer is **C**. The INMP441 is a MEMS (Micro-Electro-Mechanical System) omnidirectional digital microphone. Unlike analog microphones that output a varying voltage, it digitizes audio internally and outputs a stream of binary data over the I2S bus. This digital output is more immune to noise and connects directly to the Pico's `machine.I2S` peripheral.

    **Concept Tested:** Microphone INMP441 / INMP441 I2S Interface

---

#### 6. An audio system uses a 16,000 Hz sampling rate. What is the highest frequency it can accurately capture?

<div class="upper-alpha" markdown>
1. 16,000 Hz — the same as the sampling rate
2. 32,000 Hz — twice the sampling rate
3. 8,000 Hz — half the sampling rate (the Nyquist limit)
4. 4,000 Hz — one-quarter of the sampling rate
</div>

??? question "Show Answer"
    The correct answer is **C**. The Nyquist theorem states that the maximum accurately captured frequency is exactly half the sampling rate — called the Nyquist limit. At 16,000 Hz sampling, you can capture audio up to 8,000 Hz. This is sufficient for clear speech recognition but not for high-quality music (which needs at least 20,000 Hz).

    **Concept Tested:** Audio Sampling Rate

---

#### 7. What does a Fast Fourier Transform (FFT) do to an audio signal?

<div class="upper-alpha" markdown>
1. Amplifies the audio signal by filtering out background noise
2. Converts a time-domain audio buffer into a frequency-domain spectrum showing energy at each frequency
3. Compresses audio data so it takes less space when stored on the SD card
4. Synchronizes the microphone sampling rate with the I2S clock signal
</div>

??? question "Show Answer"
    The correct answer is **B**. An FFT transforms an array of audio samples (a time-domain signal showing pressure over time) into a frequency spectrum (showing how much energy is present at each frequency). Bass notes appear in the low-frequency bins; treble appears in the high bins. The FFT is the math behind spectrum analyzers, equalizers, and pitch detection.

    **Concept Tested:** Fast Fourier Transform (FFT) / Spectrum Analyzer Concept

---

#### 8. A rotary encoder CLK fires an interrupt, and at that moment DT reads HIGH while CLK just went LOW. Which direction is the encoder turning?

<div class="upper-alpha" markdown>
1. Clockwise, because DT is different from CLK when CLK goes LOW
2. Counter-clockwise, because both pins will read the same value momentarily
3. The direction cannot be determined from a single interrupt
4. Neither — the encoder is stationary and the interrupt was caused by noise
</div>

??? question "Show Answer"
    The correct answer is **A**. In quadrature encoding: when CLK goes LOW and DT is different from CLK (DT is HIGH, CLK is LOW), the encoder is turning clockwise. When DT is the same as CLK (both LOW), it is counter-clockwise. This phase comparison of the two signals is the fundamental way quadrature encoding detects direction.

    **Concept Tested:** Quadrature Encoding / Encoder Interrupt Handler

---

#### 9. What unit is used to measure microphone sensitivity, and what does a value of −26 dBFS mean in practice?

<div class="upper-alpha" markdown>
1. Hz — the microphone responds best to signals at −26 Hz (infrasound)
2. dBFS — decibels relative to full scale; −26 dBFS means a reference sound produces a digital output 26 dB below the maximum possible value
3. mV — the microphone outputs −26 millivolts at room temperature
4. Ω — the output impedance is 26 ohms, affecting amplifier matching
</div>

??? question "Show Answer"
    The correct answer is **B**. dBFS (decibels relative to full scale) describes where a reference sound (94 dB SPL) lands in the microphone's digital output range. A sensitivity of −26 dBFS means the reference sound produces a signal 26 dB below the maximum digital value. Lower dBFS numbers (more negative) mean a quieter microphone that requires more amplification.

    **Concept Tested:** Microphone Sensitivity / Sound Level Detection

---

#### 10. You want to add a smooth, bounded volume control to a music player. Which input device is most appropriate?

<div class="upper-alpha" markdown>
1. A TTP223 capacitive touch sensor
2. A push-button connected to an interrupt
3. A rotary encoder configured with `min_val=0, max_val=100`
4. An INMP441 microphone measuring ambient sound level
</div>

??? question "Show Answer"
    The correct answer is **C**. A rotary encoder with the `rotary` module configured for `min_val=0, max_val=100` and `RANGE_BOUNDED` mode creates a perfect volume knob: turning clockwise increases the value, counter-clockwise decreases it, and the value clamps between 0 and 100. A TTP223 is just on/off. A button press is on/off. A microphone reads environmental sound, not user intent.

    **Concept Tested:** rotary Module / Rotary Encoder

---
