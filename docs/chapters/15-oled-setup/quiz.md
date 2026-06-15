# Quiz: OLED Display Setup and Configuration

Test your understanding of OLED display setup, driver chips, wiring, and initialization with these questions.

---

#### 1. What does OLED stand for, and what is its main advantage over a regular LED screen?

<div class="upper-alpha" markdown>
1. Optical LED — uses a lens to focus light on the screen surface
2. Organic Light-Emitting Diode — each pixel glows on its own without a backlight
3. Output LED — sends data signals out to connected devices
4. Onboard LED — the built-in LED already on the Pico circuit board
</div>

??? question "Show Answer"
    The correct answer is **B**. OLED stands for Organic Light-Emitting Diode. Each pixel in an OLED display is itself a tiny light source — it produces its own light when electricity passes through it. Because there is no backlight, black pixels are truly black (they are just off), which makes the contrast between black and white look very sharp.

    **Concept Tested:** OLED Display Technology

---

#### 2. What are the two most common OLED controller chips used with the Pico?

<div class="upper-alpha" markdown>
1. L293D and DRV8833
2. SSD1306 and SH1106
3. MAX7219 and TM1637
4. HC-SR04 and VL53L0X
</div>

??? question "Show Answer"
    The correct answer is **B**. The SSD1306 and SH1106 are the two most common OLED controller chips. Both support 128×64 and 128×32 pixel displays. The SSD1306 is slightly more common and is the chip supported by the popular `ssd1306.py` MicroPython driver. Knowing which chip your display uses is important because the driver code is different for each.

    **Concept Tested:** SSD1306 vs SH1106 OLED Controller

---

#### 3. How many wires connect an I2C OLED display to the Pico?

<div class="upper-alpha" markdown>
1. 2 wires — data and ground
2. 3 wires — power, data, and ground
3. 4 wires — power (VCC), ground (GND), clock (SCL), and data (SDA)
4. 6 wires — the full SPI bus with chip select and data/command
</div>

??? question "Show Answer"
    The correct answer is **C**. An I2C OLED display needs exactly 4 wires: VCC (3.3 V power), GND (ground), SCL (I2C clock), and SDA (I2C data). This is one reason I2C is popular for displays — it uses only 2 signal wires (SCL and SDA) shared across all I2C devices on the same bus, reducing wiring complexity.

    **Concept Tested:** I2C OLED Wiring / I2C 4-Wire Connection

---

#### 4. What I2C address does most SSD1306 OLED displays use by default?

<div class="upper-alpha" markdown>
1. 0x27
2. 0x39
3. 0x3C
4. 0x76
</div>

??? question "Show Answer"
    The correct answer is **C**. Most SSD1306 OLED displays use I2C address `0x3C` (decimal 60). Some versions with a different resistor configuration use `0x3D`. The address `0x27` is common for character LCD displays, `0x39` is used by the APDS9960 gesture sensor, and `0x76` is used by the BME280 pressure sensor.

    **Concept Tested:** SSD1306 I2C Address

---

#### 5. What is the difference between a 128×64 and a 128×32 OLED display?

<div class="upper-alpha" markdown>
1. 128×64 has color pixels; 128×32 only shows white pixels
2. 128×64 has twice as many rows (64 vs 32), making it physically taller with more room for text and graphics
3. 128×32 is faster because it has fewer pixels to update
4. 128×64 uses SPI while 128×32 uses I2C
</div>

??? question "Show Answer"
    The correct answer is **B**. Both displays have 128 pixels across, but the 128×64 has 64 rows of pixels while the 128×32 has only 32 rows. The 128×64 display is physically about twice as tall, giving you room for up to 8 rows of small text versus 4 rows on the 128×32. Always specify the correct height when calling `SSD1306_I2C(128, 64, i2c)`.

    **Concept Tested:** OLED Resolution (128×64 vs 128×32)

---

#### 6. What happens if you forget to call `oled.show()` after drawing on the display?

<div class="upper-alpha" markdown>
1. The text is saved to flash and will appear next time the Pico reboots
2. The drawing commands are stored in RAM but the screen stays unchanged
3. The screen clears itself and shows only the loading spinner
4. The I2C bus locks up and must be reset by power-cycling the Pico
</div>

??? question "Show Answer"
    The correct answer is **B**. All drawing commands (`oled.text()`, `oled.pixel()`, `oled.fill()`, etc.) write to the display's internal framebuffer in the Pico's RAM — they do not directly change the pixels on the screen. Only `oled.show()` transmits the framebuffer contents to the OLED controller over I2C, causing the screen to actually update. This is a common beginner mistake.

    **Concept Tested:** oled.show() Method

---

#### 7. An I2C scan of your project returns the list `[60]`. What does this tell you?

<div class="upper-alpha" markdown>
1. There is an error — 60 is not a valid I2C address
2. One I2C device is connected and its address is 60 (0x3C in hexadecimal) — likely an OLED display
3. The bus is too slow — 60 kHz is below the minimum for OLED displays
4. Sixty devices are connected to the I2C bus simultaneously
</div>

??? question "Show Answer"
    The correct answer is **B**. `i2c.scan()` returns a list of integer I2C addresses for all responding devices. The decimal value 60 equals hexadecimal 0x3C — the default address for most SSD1306 OLED displays. If you expected to find a device and the list is empty, the display is either not wired correctly or not powered.

    **Concept Tested:** I2C Address Scan / i2c.scan() Method

---

#### 8. Which MicroPython module must you import to create an SSD1306 OLED object?

<div class="upper-alpha" markdown>
1. `from machine import OLED`
2. `from uos import display`
3. `from ssd1306 import SSD1306_I2C`
4. `import micropython.display`
</div>

??? question "Show Answer"
    The correct answer is **C**. The SSD1306 driver is not built into MicroPython — you must copy the `ssd1306.py` driver file to the Pico first and then import `SSD1306_I2C` from it. The `machine` module handles GPIO and I2C bus setup, but the `SSD1306_I2C` class that knows how to talk to the display comes from the separate driver file.

    **Concept Tested:** ssd1306 Module / SSD1306_I2C Constructor

---

#### 9. A student wires an OLED but the screen stays blank. They confirmed the driver file is installed. What should they check first?

<div class="upper-alpha" markdown>
1. Replace the OLED display — blank screens always mean hardware failure
2. Verify that SCL and SDA are wired to the correct Pico pins and that the I2C bus is initialized with the same pin numbers in code
3. Increase the PWM duty cycle on the backlight control pin
4. Flash a newer version of MicroPython that includes the OLED driver built-in
</div>

??? question "Show Answer"
    The correct answer is **B**. The most common reason for a blank OLED (with driver installed) is incorrect wiring — SCL connected to the wrong pin, SDA swapped with SCL, or the `I2C()` constructor using different pin numbers than the physical wiring. Run `i2c.scan()` first: if it returns an empty list `[]`, the Pico cannot see the display at all, which confirms a wiring or power issue.

    **Concept Tested:** OLED Troubleshooting

---

#### 10. Why might you choose an SPI OLED over an I2C OLED for a project?

<div class="upper-alpha" markdown>
1. SPI OLEDs are always cheaper and easier to find
2. SPI is faster than I2C (up to 50 MHz vs. 400 kHz), enabling smoother animations and faster screen updates
3. SPI OLEDs do not require a driver file — they are supported directly by MicroPython's `machine` module
4. SPI uses fewer wires than I2C, making the wiring simpler
</div>

??? question "Show Answer"
    The correct answer is **B**. SPI can run at up to 50 MHz while standard I2C tops out at 400 kHz (fast mode) or 1 MHz (fast-plus mode). This speed difference means an SPI OLED can refresh the full screen much faster than an I2C OLED, which makes a visible difference for fast-moving animations or games. The tradeoff is more wires (4–5 for SPI vs. 2 for I2C).

    **Concept Tested:** I2C vs SPI OLED

---
