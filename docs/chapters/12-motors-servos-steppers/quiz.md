# Quiz: Motors, Servos, and Stepper Motor Control

Test your understanding of DC motors, H-bridges, servo control, and stepper motors with these questions.

---

#### 1. Why can you NOT connect a DC motor directly to a Pico GPIO pin?

<div class="upper-alpha" markdown>
1. DC motors require AC power, not DC from a GPIO pin
2. GPIO pins can only supply 12 mA, but motors draw hundreds of milliamps or more
3. Motors operate at 5 V only, and GPIO pins are 3.3 V
4. Motors need SPI communication to set their speed
</div>

??? question "Show Answer"
    The correct answer is **B**. Each GPIO pin on the Pico can safely supply a maximum of 12 mA. A small hobby DC motor draws 50–200 mA while running freely, and up to 1 A or more when stalled. Connecting a motor directly to a GPIO pin would immediately damage the pin or the RP2040 chip. A motor driver IC or transistor must be used between the GPIO and the motor.

    **Concept Tested:** DC Motor / Motor Free-Run Current

---

#### 2. What does an H-bridge circuit allow that a single transistor cannot?

<div class="upper-alpha" markdown>
1. Control of motor speed using PWM signals
2. Bidirectional control — spinning the motor in either forward or reverse direction
3. Measuring the current drawn by the motor
4. Running two motors from a single power supply rail
</div>

??? question "Show Answer"
    The correct answer is **B**. A single transistor works as a one-way switch — current only flows in one direction through the motor, so the motor only spins one way. An H-bridge has four switches arranged so current can flow through the motor in either direction. By selecting which pair of switches is ON, you reverse the current and reverse the motor direction.

    **Concept Tested:** H-Bridge Circuit / Motor Direction Control

---

#### 3. What is back-EMF, and why does it matter for motor circuits?

<div class="upper-alpha" markdown>
1. The forward voltage that the motor requires to start spinning
2. The voltage spike generated when a motor's magnetic field collapses as the motor stops, which can damage driver ICs
3. The amount of current a motor draws when it is running at full speed
4. The resistance between the motor terminals measured with a multimeter
</div>

??? question "Show Answer"
    The correct answer is **B**. When a DC motor stops, the magnetic field in its coils collapses and generates a voltage spike in the reverse direction — called back-EMF (back electromotive force). Without protection, this spike can destroy the motor driver IC or even the Pico. A flyback diode absorbs this energy safely. The DRV8833 and L293D have built-in flyback diodes; the older L298N does not.

    **Concept Tested:** Back-EMF Protection / Flyback Diode

---

#### 4. What PWM frequency is required for standard hobby servo motors?

<div class="upper-alpha" markdown>
1. 1,000 Hz
2. 10,000 Hz
3. 50 Hz
4. 440 Hz
</div>

??? question "Show Answer"
    The correct answer is **C**. Standard hobby servo motors require exactly 50 Hz PWM (a 20 ms period). The servo reads the pulse width within each 20 ms cycle to determine the target angle: a 1 ms pulse commands 0°, a 1.5 ms pulse commands 90° (center), and a 2 ms pulse commands 180°. Using a different frequency causes the servo to behave unpredictably.

    **Concept Tested:** Servo Signal (50 Hz PWM) / Servo Motor

---

#### 5. What `duty_u16` value should you pass to position a servo at the center (90°)?

<div class="upper-alpha" markdown>
1. 32768 — half of the maximum value
2. 3277 — corresponding to a 1 ms pulse at 50 Hz
3. 65535 — the full maximum duty cycle
4. 4915 — corresponding to a 1.5 ms center pulse at 50 Hz
</div>

??? question "Show Answer"
    The correct answer is **D**. At 50 Hz, one cycle = 20 ms. A 1.5 ms pulse for center position is: `1500 µs / 20000 µs × 65535 ≈ 4915`. The value 3277 gives 0° (1 ms pulse), and 6554 gives 180° (2 ms pulse). The value 32768 would be 50% duty cycle, which is far too long for a servo at 50 Hz.

    **Concept Tested:** Servo Angle Control / machine.PWM for Servo

---

#### 6. How does a continuous rotation servo differ from a standard servo?

<div class="upper-alpha" markdown>
1. A continuous rotation servo uses more GPIO pins and a separate driver chip
2. A continuous rotation servo spins continuously; the pulse width controls speed and direction, not angle
3. A continuous rotation servo requires 5 V, while standard servos use 3.3 V
4. A continuous rotation servo can only turn clockwise; standard servos can turn either way
</div>

??? question "Show Answer"
    The correct answer is **B**. A continuous rotation servo has been modified to remove the internal position feedback, so instead of holding an angle, it spins continuously. A center pulse (1.5 ms) stops it; shorter pulses spin it one direction; longer pulses spin the other. These are popular for simple wheeled robots with a built-in gearbox.

    **Concept Tested:** Continuous Rotation Servo

---

#### 7. A 28BYJ-48 stepper motor with a ULN2003 driver needs to rotate 90° clockwise. How many half-steps are needed?

<div class="upper-alpha" markdown>
1. 90 steps — one step per degree
2. 512 half-steps — one quarter of 2048
3. 2048 half-steps — a full revolution
4. 180 half-steps — one step per 0.5 degrees
</div>

??? question "Show Answer"
    The correct answer is **B**. The 28BYJ-48 stepper motor takes 2048 half-steps for a full 360° rotation. For 90°, you need 2048 × (90/360) = 2048 × 0.25 = 512 half-steps. This precise counting of steps is what makes stepper motors useful for exact positioning in 3D printers and CNC machines.

    **Concept Tested:** Stepper Steps Per Revolution / Stepper Motor Phases

---

#### 8. What is the motor deadband, and why does it matter for robot calibration?

<div class="upper-alpha" markdown>
1. The range of PWM frequencies that cause audible motor whine — you must stay outside this range
2. The minimum PWM duty cycle at which the motor actually starts moving — below this the motor stalls
3. The maximum safe current the motor driver can supply continuously
4. The time delay between changing PWM duty cycle and the motor reaching the new speed
</div>

??? question "Show Answer"
    The correct answer is **B**. The motor deadband is the minimum duty cycle threshold below which the motor does not overcome its own friction and internal resistance. If you command 5% duty cycle but the deadband is 15%, the motor just hums without turning. Always set your minimum commanded speed above the deadband to ensure the motor actually moves.

    **Concept Tested:** Motor Stall Current / Motor Speed Control

---

#### 9. In half-step mode vs. full-step mode for a stepper motor, what is the tradeoff?

<div class="upper-alpha" markdown>
1. Half-step mode is faster but less accurate; full-step mode is slower but more precise
2. Half-step gives twice as many positions (smoother motion) but slightly lower torque; full-step gives maximum torque but coarser steps
3. Half-step requires a higher voltage; full-step works with the standard 5 V supply
4. They are equivalent in practice — the names refer only to the programming library used
</div>

??? question "Show Answer"
    The correct answer is **B**. Full-step mode energizes one or two coils at a time, giving maximum torque with the fewest number of step positions. Half-step mode alternates between energizing one and two coils, doubling the number of available positions (smoother motion) at the cost of slightly reduced holding torque. The 28BYJ-48 uses 2,048 half-steps versus 1,024 full-steps per revolution.

    **Concept Tested:** Half-Step vs Full-Step

---

#### 10. Why should stepper motor coil pins be set LOW when the motor is not moving?

<div class="upper-alpha" markdown>
1. Energized coils during idle create a large back-EMF that can damage the ULN2003 driver
2. Energized coils at rest draw continuous current, wasting power and heating the motor
3. The stepper will drift backward unless coils are powered off when stopped
4. The Pico cannot drive more than two output pins HIGH simultaneously
</div>

??? question "Show Answer"
    The correct answer is **B**. Unlike a servo that uses active feedback to hold position, a stepper holds its position by keeping its coils energized. But energized coils draw continuous current (wasting battery/power) and generate heat that can damage the motor's insulation over time. Set all four coil pins to LOW when the motor finishes moving to save power and extend component life.

    **Concept Tested:** Stepper Driver (ULN2003) / Stepper Motor

---
