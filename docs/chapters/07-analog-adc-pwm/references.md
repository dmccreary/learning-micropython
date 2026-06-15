# References: Analog Signals, ADC, and Pulse-Width Modulation

1. [Analog-to-digital converter](https://en.wikipedia.org/wiki/Analog-to-digital_converter) - Wikipedia - Explains how an ADC turns a varying voltage into a number, including resolution and sampling. Directly supports this chapter's potentiometer and light-sensor reading.

2. [Pulse-width modulation](https://en.wikipedia.org/wiki/Pulse-width_modulation) - Wikipedia - Describes how varying the duty cycle of a square wave controls average power. Background for the chapter's LED-fading and motor-speed examples.

3. [Potentiometer](https://en.wikipedia.org/wiki/Potentiometer) - Wikipedia - Covers the variable resistor used as an analog input throughout this chapter. Explains the voltage-divider behavior students read with the ADC.

4. Make: Electronics (3rd Edition) - Charles Platt - Make Community - Hands-on chapters on analog signals, potentiometers, and PWM-style control that reinforce this chapter's experiments.

5. Practical Electronics for Inventors (4th Edition) - Paul Scherz & Simon Monk - McGraw-Hill - Detailed coverage of ADCs, sampling, and PWM for students who want the engineering theory behind this chapter.

6. [machine.ADC](https://docs.micropython.org/en/latest/library/machine.ADC.html) - MicroPython - Official reference for reading analog values, including `read_u16()` scaling. The authoritative companion to the chapter's ADC code.

7. [machine.PWM](https://docs.micropython.org/en/latest/library/machine.PWM.html) - MicroPython - Official reference for setting PWM frequency and duty cycle with `duty_u16()`. Directly supports the chapter's fading and servo examples.

8. [Analog-to-Digital Conversion](https://learn.sparkfun.com/tutorials/analog-to-digital-conversion) - SparkFun - A beginner tutorial on resolution, reference voltage, and reading analog signals. Reinforces the chapter's ADC concepts.

9. [Pulse Width Modulation](https://learn.sparkfun.com/tutorials/pulse-width-modulation) - SparkFun - Explains duty cycle and how PWM dims LEDs and drives motors. A clear companion to the chapter's PWM section.

10. [Introduction to Pulse Width Modulation (PWM)](https://www.allaboutcircuits.com/technical-articles/introduction-to-pulse-width-modulation-pwm/) - All About Circuits - A technical-but-readable article with waveforms and duty-cycle math. Expands on the chapter's PWM explanation.
