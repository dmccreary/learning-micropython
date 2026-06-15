# Quiz: Communication Protocols — I2C, SPI, and UART

Test your understanding of I2C, SPI, UART, 1-Wire, and I2S communication protocols with these questions.

---

#### 1. How many wires does the I2C protocol use for data communication (not counting power and ground)?

<div class="upper-alpha" markdown>
1. One (DIN)
2. Two (SDA and SCL)
3. Four (MOSI, MISO, SCK, CS)
4. Three (TX, RX, CLK)
</div>

??? question "Show Answer"
    The correct answer is **B**. I2C uses exactly two wires: SDA (Serial Data) for data bits, and SCL (Serial Clock) for timing. This minimal wiring is one of I2C's biggest advantages — up to 127 different devices can share the same two wires, each identified by its unique address.

    **Concept Tested:** I2C Protocol / I2C Bus SDA and SCL

---

#### 2. What is an I2C device address?

<div class="upper-alpha" markdown>
1. The physical pin number the device connects to on the Pico
2. A unique 7-bit number that identifies each device on the I2C bus
3. The speed in hertz at which the device sends data
4. The file name of the Python driver needed for the device
</div>

??? question "Show Answer"
    The correct answer is **B**. Every device on an I2C bus has a unique 7-bit address (0 to 127) — like a street address. When the Pico sends a message, it specifies the destination address, and only the device with that address responds. Common addresses include `0x3C` for OLED displays and `0x76` for the BME280 sensor.

    **Concept Tested:** I2C Address

---

#### 3. What does `i2c.scan()` return?

<div class="upper-alpha" markdown>
1. A list of all possible I2C addresses from 0 to 127
2. A list of addresses that responded to the probe — i.e., detected devices
3. The data from the last I2C read operation
4. A string showing the current bus frequency setting
</div>

??? question "Show Answer"
    The correct answer is **B**. `I2C.scan()` probes all 127 possible I2C addresses and returns a list of only those that acknowledged — meaning a device is present and responding at that address. Running the I2C scanner should always be the first step when connecting a new I2C device to verify wiring and confirm the correct address.

    **Concept Tested:** I2C Scanner / I2C.scan() Method

---

#### 4. What extra pin does SPI require for each device that I2C does not need?

<div class="upper-alpha" markdown>
1. A dedicated power pin (VCC) for each device
2. A CS (Chip Select) pin per device to select which one is being communicated with
3. An IRQ pin per device for interrupt-based communication
4. A RESET pin to initialize each device before use
</div>

??? question "Show Answer"
    The correct answer is **B**. SPI uses MOSI, MISO, and SCK shared by all devices, plus a separate CS (Chip Select) pin for each device. To talk to a device, you pull its CS pin LOW, send data, then release it HIGH. This is how SPI avoids the need for addresses — physical pin selection replaces software addressing.

    **Concept Tested:** SPI Protocol / SPI Bus Pins

---

#### 5. Which protocol is the best choice when you need to connect many sensors to just two wires at a reasonable speed?

<div class="upper-alpha" markdown>
1. SPI, because it is faster
2. UART, because it needs no clock wire
3. I2C, because it supports up to 127 devices on two wires
4. 1-Wire, because it only needs one wire
</div>

??? question "Show Answer"
    The correct answer is **C**. I2C supports up to 127 devices sharing the same SDA and SCL wires. Each device has a unique address, so the Pico can talk to any one of them at any time. SPI is faster but needs one extra CS wire per device. UART is point-to-point only. 1-Wire is very slow and specialized.

    **Concept Tested:** I2C Protocol / Choosing the Right Protocol

---

#### 6. What is the baud rate in UART communication?

<div class="upper-alpha" markdown>
1. The size of data packets in bytes
2. The I2C address equivalent for UART devices
3. The communication speed measured in bits per second
4. The number of devices that can connect to one UART bus
</div>

??? question "Show Answer"
    The correct answer is **C**. Baud rate is the speed of UART communication, measured in bits per second (bps). Since UART is asynchronous (no clock wire), both sender and receiver must be configured with exactly the same baud rate in advance. Common rates are 9600 bps (for GPS modules) and 115200 bps (for Bluetooth adapters and debug serial).

    **Concept Tested:** UART Protocol / Bus Frequency Setting

---

#### 7. The DS18B20 temperature sensor uses which protocol?

<div class="upper-alpha" markdown>
1. I2C with address 0x29
2. SPI with four wires
3. 1-Wire — a single data wire plus GND
4. UART at 9600 baud
</div>

??? question "Show Answer"
    The correct answer is **C**. The DS18B20 uses the 1-Wire protocol, which carries both data and power on a single wire (plus a GND connection) with a 4.7 kΩ pull-up resistor. MicroPython includes the `onewire` and `ds18x20` modules specifically for working with these sensors. Multiple DS18B20 sensors can share the same wire.

    **Concept Tested:** 1-Wire Protocol

---

#### 8. Which protocol is used to transfer digital audio data from a microphone or DAC to a microcontroller?

<div class="upper-alpha" markdown>
1. UART with high baud rate
2. SPI in continuous read mode
3. I2C with fast-mode plus (1 MHz)
4. I2S (Inter-IC Sound)
</div>

??? question "Show Answer"
    The correct answer is **D**. I2S (Inter-IC Sound) is specifically designed for digital audio. It uses three wires: SCK (bit clock), WS (word select/frame sync), and SD (serial data). The Pico's `machine.I2S` class supports both receive (from a microphone like the INMP441) and transmit (to an audio DAC for playback).

    **Concept Tested:** I2S Protocol / machine.I2S Class

---

#### 9. A student connects an OLED display but `i2c.scan()` returns an empty list. What is the most likely cause?

<div class="upper-alpha" markdown>
1. The OLED's address is 0x00, which scan() skips
2. Wrong pin wiring — SDA and SCL may be swapped, or missing pull-up resistors
3. The I2C bus is running too fast; scan() only works at 10 kHz
4. The OLED needs to be initialized with `oled.begin()` before scan() can see it
</div>

??? question "Show Answer"
    The correct answer is **B**. An empty `scan()` result almost always means a wiring problem: SDA and SCL pins are swapped, the display's VCC is not powered, a GND connection is missing, or the required pull-up resistors (4.7 kΩ to 3.3 V on SDA and SCL) are absent. Many OLED breakout boards include pull-ups, but some do not. Check wiring first.

    **Concept Tested:** I2C Scanner / I2C Debugging

---

#### 10. What is the advantage of SPI over I2C for a display that needs to update quickly?

<div class="upper-alpha" markdown>
1. SPI displays never need a CS pin, simplifying wiring
2. SPI can operate at MHz speeds while I2C tops out at 400 kHz, enabling much faster screen refreshes
3. SPI uses fewer wires than I2C, reducing the chance of wiring errors
4. SPI supports up to 127 devices, while I2C only supports one
</div>

??? question "Show Answer"
    The correct answer is **B**. SPI can run at speeds of 10–40 MHz or more, while standard I2C tops out at 400 kHz (fast mode). For a 240×320 color display, that speed difference means the difference between a 30 ms full-screen refresh (SPI at 40 MHz) and hundreds of milliseconds (I2C). This is why most fast displays use SPI.

    **Concept Tested:** SPI Protocol / Bus Frequency Setting

---
