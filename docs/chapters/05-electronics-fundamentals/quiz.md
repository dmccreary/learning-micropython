# Quiz: Electronics Fundamentals

Test your understanding of voltage, current, resistance, Ohm's Law, and basic electronic components with these questions.

---

#### 1. Which quantity describes the electrical pressure that pushes electrons through a circuit?

<div class="upper-alpha" markdown>
1. Current (measured in amps)
2. Resistance (measured in ohms)
3. Voltage (measured in volts)
4. Power (measured in watts)
</div>

??? question "Show Answer"
    The correct answer is **C**. Voltage is the electrical "pressure" that drives current through a circuit — like water pressure pushing water through a pipe. Current is the flow rate of electrons. Resistance is how much something opposes current flow. Power is energy consumed per second.

    **Concept Tested:** Voltage

---

#### 2. What does Ohm's Law state?

<div class="upper-alpha" markdown>
1. Power equals current times resistance: P = I × R
2. Voltage equals current times resistance: V = I × R
3. Current equals voltage times resistance: I = V × R
4. Resistance equals power times voltage: R = P × V
</div>

??? question "Show Answer"
    The correct answer is **B**. Ohm's Law is V = I × R, where V is voltage in volts, I is current in amps, and R is resistance in ohms. You can rearrange it to find any unknown: I = V/R to find current, or R = V/I to find resistance. This formula is used constantly in electronics to calculate safe resistor values.

    **Concept Tested:** Ohm's Law

---

#### 3. You want to connect a red LED (forward voltage 2.0 V, current 20 mA) to a 3.3 V Pico pin. What resistor value should you use?

<div class="upper-alpha" markdown>
1. 330 Ω (voltage drop = 1.3 V, current = 20 mA: R = 1.3 / 0.02 = 65 Ω, round up to 68–330 Ω)
2. 10 kΩ
3. 4.7 Ω
4. 10 Ω
</div>

??? question "Show Answer"
    The correct answer is **A**. The voltage across the resistor is 3.3 V − 2.0 V = 1.3 V. Using Ohm's Law: R = V/I = 1.3 V / 0.02 A = 65 Ω. The nearest standard values are 68 Ω or 100 Ω. 330 Ω is a safe conservative choice that limits current further and still provides good brightness. Values below 65 Ω would allow too much current.

    **Concept Tested:** Current-Limiting Resistor / Ohm's Law

---

#### 4. What is a short circuit?

<div class="upper-alpha" markdown>
1. A circuit where all components are connected in series
2. A circuit with no current flowing due to a broken wire
3. A direct low-resistance path from power to ground that causes dangerous high current
4. A circuit where LEDs are connected without resistors
</div>

??? question "Show Answer"
    The correct answer is **C**. A short circuit occurs when current finds a path with almost no resistance — usually a direct wire from the power supply to GND. This causes very high current to flow instantly, which can damage the Pico, burn components, or drain your battery dangerously fast. Always double-check wiring before applying power.

    **Concept Tested:** Short Circuit

---

#### 5. What is the purpose of a current-limiting resistor when used with an LED?

<div class="upper-alpha" markdown>
1. To make the LED blink on and off automatically
2. To prevent too much current from flowing through and burning out the LED
3. To increase the brightness of the LED
4. To convert AC current to DC current for the LED
</div>

??? question "Show Answer"
    The correct answer is **B**. Without a current-limiting resistor, the LED would draw as much current as the power supply can provide — far more than the LED's 10–20 mA rating. Too much current heats the LED junction until it burns out within seconds. The resistor limits the current to a safe level by dropping the extra voltage across itself.

    **Concept Tested:** LED / Current-Limiting Resistor

---

#### 6. A resistor has color bands Brown-Black-Red. What is its resistance value?

<div class="upper-alpha" markdown>
1. 100 Ω
2. 120 Ω
3. 10 Ω
4. 1,000 Ω
</div>

??? question "Show Answer"
    The correct answer is **D**. Using the resistor color code: Brown = 1, Black = 0, Red = ×100 (multiplier). So the digits are 1 and 0, and the multiplier is ×100: 10 × 100 = 1,000 Ω = 1 kΩ. The color code reads the first two bands as digits and the third band as a power-of-10 multiplier.

    **Concept Tested:** Resistor Color Code

---

#### 7. How do breadboard power rails differ from breadboard rows?

<div class="upper-alpha" markdown>
1. Power rails run horizontally across the center; rows run vertically along the edges
2. Power rails are the long columns along the edges (for 3.3 V and GND); rows are the short horizontal groups in the center for components
3. Power rails connect to GPIO pins; rows connect to analog pins only
4. There is no difference — both terms describe the same connections
</div>

??? question "Show Answer"
    The correct answer is **B**. Breadboard power rails are the two long columns running along the top and bottom edges of the breadboard, marked + and −. They provide power (3.3 V or 5 V) and GND across the whole board. The rows in the center (labeled a–j) are short horizontal groups of five holes where components plug in and connect to each other.

    **Concept Tested:** Breadboard Rails / Breadboard Rows

---

#### 8. What does the continuity test function on a multimeter do?

<div class="upper-alpha" markdown>
1. Measures how many volts are present in a circuit
2. Beeps when two test points are electrically connected
3. Converts AC voltage to DC voltage for safe measurement
4. Measures how much resistance the LED is producing
</div>

??? question "Show Answer"
    The correct answer is **B**. The continuity test mode on a multimeter beeps (or lights an indicator) when the two probes are touching points that are electrically connected. This is invaluable for checking that jumper wires are properly seated in the breadboard, that switches are working, and that you have connected the right pin to the right place.

    **Concept Tested:** Continuity Test / Multimeter

---

#### 9. In a parallel circuit with two LEDs, what happens if one LED burns out?

<div class="upper-alpha" markdown>
1. Both LEDs go out because they share the same current path
2. The other LED gets twice as bright because all the current goes through it
3. The other LED continues working because each has its own independent path
4. The power supply shuts down to prevent damage to the remaining LED
</div>

??? question "Show Answer"
    The correct answer is **C**. In a parallel circuit, each component has its own independent path from power to GND. If one path breaks (an LED burns out), the other paths continue to work normally. This is why your home lights are wired in parallel — one bulb going out does not turn off all the others.

    **Concept Tested:** Parallel Circuit

---

#### 10. What component does an NPN transistor act as when used with a Pico GPIO pin to control a motor?

<div class="upper-alpha" markdown>
1. A battery that provides extra voltage for the motor
2. A capacitor that smooths the motor's power supply
3. A diode that blocks reverse current from the motor
4. An electronically controlled switch that lets a small GPIO current control a larger motor current
</div>

??? question "Show Answer"
    The correct answer is **D**. An NPN transistor acts as a switch controlled by current. A small current from a GPIO pin (up to 12 mA) flows into the transistor's base, which switches on a much larger current through the collector-emitter path — enough to run a motor drawing hundreds of milliamps. The GPIO pin controls the switch; the transistor provides the power.

    **Concept Tested:** Transistor / NPN Transistor

---
