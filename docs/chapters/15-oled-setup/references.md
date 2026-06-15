# References: OLED Display Setup and Configuration

1. [OLED](https://en.wikipedia.org/wiki/OLED) - Wikipedia - Explains how organic LEDs emit light per pixel, giving OLED displays high contrast without a backlight. Background for this chapter's display hardware.

2. [I²C](https://en.wikipedia.org/wiki/I%C2%B2C) - Wikipedia - Describes the two-wire bus most OLED modules use, including addressing. Directly supports the chapter's wiring and `i2c.scan()` steps.

3. [Framebuffer](https://en.wikipedia.org/wiki/Framebuffer) - Wikipedia - Explains the in-memory pixel buffer that drawing commands modify before `show()`. Reinforces the chapter's display model.

4. Get Started with MicroPython on Raspberry Pi Pico - Gareth Halfacree & Ben Everard - Raspberry Pi Press - The official book covers connecting and initializing an SSD1306 OLED exactly as this chapter does.

5. Programming with MicroPython - Nicholas H. Tollervey - O'Reilly Media - Explains setting up I2C displays from MicroPython, complementing this chapter's configuration steps.

6. [Monochrome OLED Breakouts](https://learn.adafruit.com/monochrome-oled-breakouts) - Adafruit - Guide to 128x64 and 128x32 SSD1306 OLEDs, including I2C and SPI options. Directly supports the chapter's hardware setup.

7. [Raspberry Pi Pico SSD1306 OLED (MicroPython)](https://randomnerdtutorials.com/raspberry-pi-pico-ssd1306-oled-micropython/) - Random Nerd Tutorials - Step-by-step Pico OLED wiring, driver upload, and first text display. Mirrors this chapter's setup procedure.

8. [machine.I2C](https://docs.micropython.org/en/latest/library/machine.I2C.html) - MicroPython - Reference for the I2C interface that connects the Pico to the OLED. The authoritative source for the chapter's bus setup.

9. [framebuf](https://docs.micropython.org/en/latest/library/framebuf.html) - MicroPython - Reference for the framebuffer the SSD1306 driver builds on. Explains why `show()` is needed after drawing, as the chapter notes.

10. [Micro OLED Breakout Hookup Guide](https://learn.sparkfun.com/tutorials/micro-oled-breakout-hookup-guide) - SparkFun - An alternate small-OLED setup guide with SPI and I2C wiring. Reinforces the chapter's configuration choices.
