# References: Sound, Music, and Audio Generation

1. [Sound](https://en.wikipedia.org/wiki/Sound) - Wikipedia - Explains sound as pressure waves and how frequency sets pitch. Background for this chapter's tone-generation work.

2. [Musical note](https://en.wikipedia.org/wiki/Musical_note) - Wikipedia - Describes how notes map to specific frequencies, the basis for playing melodies. Directly supports the chapter's music examples.

3. [Pulse-width modulation](https://en.wikipedia.org/wiki/Pulse-width_modulation) - Wikipedia - Covers how a PWM square wave at a chosen frequency drives a buzzer to make a tone. Explains the core technique used throughout this chapter.

4. Get Started with MicroPython on Raspberry Pi Pico - Gareth Halfacree & Ben Everard - Raspberry Pi Press - The official book covers making sounds with a buzzer and PWM, matching this chapter's approach.

5. Practical Electronics for Inventors (4th Edition) - Paul Scherz & Simon Monk - McGraw-Hill - Reference on speakers, piezo buzzers, and audio amplifiers behind the chapter's sound hardware.

6. [machine.PWM](https://docs.micropython.org/en/latest/library/machine.PWM.html) - MicroPython - Official reference for setting the frequency that produces a musical pitch on a buzzer. The authoritative companion to the chapter's tone code.

7. [pico-micropython-examples](https://github.com/raspberrypi/pico-micropython-examples) - Raspberry Pi - Official MicroPython example code, including PWM and tone examples for the Pico. Practical reference for the chapter's projects.

8. [Table of Musical Note Frequencies](https://www.liutaiomottola.com/formulae/freqtab.htm) - Liutaio Mottola - A complete table of note names and their frequencies in hertz. Directly useful for programming the melodies in this chapter.

9. [Adafruit MAX98357 I2S Amplifier](https://learn.adafruit.com/adafruit-max98357-i2s-class-d-mono-amp) - Adafruit - Guide to an I2S amplifier for playing higher-quality audio than a buzzer can. Supports the chapter's advanced-audio section.

10. [machine.I2S](https://docs.micropython.org/en/latest/library/machine.I2S.html) - MicroPython - Reference for the I2S protocol used to stream digital audio to a DAC or amplifier. Connects the chapter's audio hardware to MicroPython code.
