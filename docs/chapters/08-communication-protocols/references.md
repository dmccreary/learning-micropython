# References: Communication Protocols — I2C, SPI, and UART

1. [I²C](https://en.wikipedia.org/wiki/I%C2%B2C) - Wikipedia - Explains the two-wire bus, device addressing, and master/peripheral roles. Directly supports this chapter's I2C scanning and sensor-communication examples.

2. [Serial Peripheral Interface](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface) - Wikipedia - Describes the four-wire SPI bus and its MOSI, MISO, SCK, and CS lines. Reinforces the chapter's coverage of fast SPI devices.

3. [Universal asynchronous receiver-transmitter](https://en.wikipedia.org/wiki/Universal_asynchronous_receiver-transmitter) - Wikipedia - Covers UART serial communication, baud rate, and TX/RX wiring. Background for the chapter's UART section.

4. Make: Electronics (3rd Edition) - Charles Platt - Make Community - Approachable coverage of how chips talk to each other over digital buses, complementing this chapter's protocol overview.

5. Programming with MicroPython - Nicholas H. Tollervey - O'Reilly Media - Explains using I2C and SPI from MicroPython to talk to sensors and displays, matching this chapter's code patterns.

6. [I2C](https://learn.sparkfun.com/tutorials/i2c) - SparkFun - A clear, diagram-rich tutorial on how the I2C bus works and how addressing avoids conflicts. Reinforces the chapter's I2C material.

7. [Serial Peripheral Interface (SPI)](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi) - SparkFun - Explains SPI signals and timing with helpful illustrations. Directly supports the chapter's SPI coverage.

8. [Serial Communication](https://learn.sparkfun.com/tutorials/serial-communication) - SparkFun - Covers asynchronous serial (UART), baud rate, and framing. A good companion to the chapter's UART section.

9. [machine.I2C](https://docs.micropython.org/en/latest/library/machine.I2C.html) - MicroPython - Official reference for `scan()`, `readfrom()`, and `writeto()` used throughout this chapter. The authoritative source for the I2C code.

10. [Basics of the I2C Communication Protocol](https://www.circuitbasics.com/basics-of-the-i2c-communication-protocol/) - Circuit Basics - A step-by-step walkthrough of I2C messages, start/stop conditions, and acknowledgements. Expands on the chapter's bus explanation.
