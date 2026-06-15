# References: Rotary Encoders, Touch Sensors, and Audio Input

1. [Rotary encoder](https://en.wikipedia.org/wiki/Rotary_encoder) - Wikipedia - Explains quadrature encoding and how two phased signals reveal direction and steps. Directly supports this chapter's encoder-reading logic.

2. [Capacitive sensing](https://en.wikipedia.org/wiki/Capacitive_sensing) - Wikipedia - Describes how touch sensors detect a finger by measuring capacitance changes. Reinforces the chapter's touch-input section.

3. [Fast Fourier transform](https://en.wikipedia.org/wiki/Fast_Fourier_transform) - Wikipedia - Covers the algorithm that converts an audio sample buffer into frequency components. Background for the chapter's audio-input and spectrum work.

4. Make: Sensors - Tero Karvinen, Kimmo Karvinen & Ville Valtokari - Maker Media - Hands-on projects with encoders, touch, and sound input that parallel the chapter's hardware.

5. Practical Electronics for Inventors (4th Edition) - Paul Scherz & Simon Monk - McGraw-Hill - Reference on the signal conditioning and input electronics behind the sensors in this chapter.

6. [Rotary Encoder Tutorial](https://lastminuteengineers.com/rotary-encoder-arduino-tutorial/) - Last Minute Engineers - Step-by-step guide to reading an encoder with polling and interrupts. Reinforces the chapter's CLK/DT direction logic.

7. [Adafruit MPR121 Capacitive Touch Sensor](https://learn.adafruit.com/adafruit-mpr121-12-key-capacitive-touch-sensor-breakout-tutorial) - Adafruit - Guide to a 12-channel capacitive touch breakout over I2C. Directly supports the chapter's touch-sensing examples.

8. [machine.Pin](https://docs.micropython.org/en/latest/library/machine.Pin.html) - MicroPython - Reference for the interrupt-driven pin reading used to track encoder rotation. Connects the chapter to working MicroPython code.

9. [machine.ADC](https://docs.micropython.org/en/latest/library/machine.ADC.html) - MicroPython - Reference for sampling an analog microphone signal, the first step in audio input. Supports the chapter's audio-capture section.

10. [An Interactive Guide to the Fourier Transform](https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/) - BetterExplained - An intuitive, visual explanation of how signals break into frequencies. Makes the chapter's FFT concept approachable for beginners.
