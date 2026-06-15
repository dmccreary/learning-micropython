# Quiz: NeoPixels and Non-Graphical Displays

Test your understanding of NeoPixels, RGB/HSV color, LED matrices, and character displays with these questions.

---

#### 1. What makes NeoPixels (WS2812B LEDs) special compared to ordinary LEDs?

<div class="upper-alpha" markdown>
1. NeoPixels run at 5 V while ordinary LEDs run at 3.3 V
2. Each NeoPixel contains RGB sub-LEDs and a controller chip, and they chain together on a single data wire
3. NeoPixels are brighter and last longer because they use laser diodes
4. NeoPixels can be read as sensors as well as used as lights
</div>

??? question "Show Answer"
    The correct answer is **B**. Each WS2812B NeoPixel contains three sub-LEDs (red, green, blue) and a tiny integrated controller chip. Multiple NeoPixels chain together: the data-out pin of one connects to the data-in of the next. Your Pico sends one long data stream over a single GPIO pin, and each LED extracts its own color data as the stream passes through.

    **Concept Tested:** NeoPixel LED / WS2812B Protocol

---

#### 2. In the NeoPixel color model, what does `np[0] = (255, 0, 0)` produce?

<div class="upper-alpha" markdown>
1. White — all channels at maximum
2. Green — the second channel is 255
3. Red — full red channel, no green or blue
4. Black (off) — 255 is the "off" value
</div>

??? question "Show Answer"
    The correct answer is **C**. NeoPixels use the RGB color model where each channel (red, green, blue) ranges from 0 (off) to 255 (full brightness). Setting red to 255 and both green and blue to 0 produces pure red. `(255, 255, 255)` is white, `(0, 255, 0)` is green, and `(0, 0, 0)` is off/black.

    **Concept Tested:** RGB Color Model / NeoPixel LED

---

#### 3. Why must you call `np.show()` after setting NeoPixel colors?

<div class="upper-alpha" markdown>
1. `show()` calculates the checksum to verify the color data is correct
2. `show()` converts RGB values to the WS2812B signal format and transmits the data to the strip
3. Without `show()`, the colors are stored to flash memory instead of displayed
4. `show()` is only needed for strips with more than 30 LEDs
</div>

??? question "Show Answer"
    The correct answer is **B**. When you set `np[0] = (255, 0, 0)`, the color is stored in the NeoPixel object's internal array in RAM — the LEDs do not change yet. `np.show()` transmits the entire color array to the physical LED strip using the WS2812B protocol. This batching lets you update all colors before any pixel changes, preventing partial-update flicker.

    **Concept Tested:** NeoPixel.show() Method

---

#### 4. What is the advantage of using the HSV color model for NeoPixel animations instead of RGB?

<div class="upper-alpha" markdown>
1. HSV produces brighter colors because the value channel boosts intensity
2. HSV is the native format of WS2812B chips, so no conversion is needed
3. HSV separates hue (color position on the wheel) from brightness, making rainbow and color-cycling animations easier to write
4. HSV uses only two numbers instead of three, making the code shorter
</div>

??? question "Show Answer"
    The correct answer is **C**. In HSV, the Hue value (0–360°) moves around a color wheel from red through yellow, green, cyan, blue, and magenta. To create a rainbow, you simply cycle the hue for each LED across the 0–360 range. Doing the same in RGB requires complex trigonometric calculations. HSV still needs to be converted to RGB before sending to the NeoPixel.

    **Concept Tested:** HSV Color Model / Rainbow Pattern / Color Wheel Animation

---

#### 5. You have a strip of 60 NeoPixels all set to full white. Approximately how much current does the strip draw?

<div class="upper-alpha" markdown>
1. 60 mA — 1 mA per LED
2. 3,600 mA (3.6 A) — up to 60 mA per LED at full white
3. 180 mA — 3 mA per LED
4. 12 mA — the GPIO pin's maximum current rating
</div>

??? question "Show Answer"
    The correct answer is **B**. Each WS2812B LED draws up to 60 mA at full white brightness (20 mA per color channel × 3 channels). For 60 LEDs: 60 × 60 mA = 3,600 mA = 3.6 A. This is far more than the Pico's power pins can supply — you must use an external 5 V power supply capable of at least 4 A for a strip this size.

    **Concept Tested:** NeoPixel Power Requirements

---

#### 6. What interface does the TM1637 chip use to drive a 4-digit 7-segment display?

<div class="upper-alpha" markdown>
1. SPI (4 wires: MOSI, MISO, SCK, CS)
2. UART at 9600 baud
3. A simple 2-wire protocol (CLK and DIO)
4. I2C at address 0x70
</div>

??? question "Show Answer"
    The correct answer is **C**. The TM1637 uses its own simple 2-wire protocol with CLK (clock) and DIO (data input/output) pins. The driver library handles all the timing details. You simply call `tm.number(1234)` to display "1234" or `tm.numbers(12, 34)` to show "12:34" with the colon separator for a clock display.

    **Concept Tested:** 4-Digit 7-Segment Display / TM1637 Display Driver

---

#### 7. The MAX7219 chip drives an 8×8 LED matrix over which interface?

<div class="upper-alpha" markdown>
1. I2C (2 wires)
2. UART (2 wires)
3. SPI (3 wires from the Pico: MOSI, SCK, CS)
4. 1-Wire with a special matrix driver extension
</div>

??? question "Show Answer"
    The correct answer is **C**. The MAX7219 LED driver communicates over SPI, requiring just 3 wires from the Pico (MOSI for data, SCK for clock, and CS for chip select). Internally, it handles the multiplexing of all 64 LEDs in the 8×8 matrix, saving you from needing 64 individual GPIO pins.

    **Concept Tested:** MAX7219 LED Driver / MAX7219 SPI Interface

---

#### 8. How does the `lcd_api` library simplify writing text to a character LCD?

<div class="upper-alpha" markdown>
1. It converts Python text to the LCD's 7-segment encoding automatically
2. It handles the I2C communication details so you can use simple commands like `lcd.putstr("Hello")`
3. It allows the LCD to display graphics and icons, not just text
4. It converts the I2C signal to SPI for compatibility with more display types
</div>

??? question "Show Answer"
    The correct answer is **B**. A character LCD with I2C backpack (PCF8574) normally requires sending complex timing sequences and nibble-mode commands to the HD44780 controller. The `lcd_api` and `i2c_lcd` libraries wrap all this complexity. You simply call `lcd.putstr("Hello!")` and `lcd.move_to(col, row)` to place text anywhere on the display.

    **Concept Tested:** Character LCD Display / lcd_api Module

---

#### 9. What is brightness scaling for NeoPixels, and why is it useful?

<div class="upper-alpha" markdown>
1. Doubling the number of LEDs to make the display twice as bright
2. Multiplying all three RGB channel values by a factor between 0 and 1 to dim a color without changing its hue
3. Setting all LEDs to the same brightness to create a uniform white display
4. Using PWM to flicker the NeoPixels faster than the eye can see
</div>

??? question "Show Answer"
    The correct answer is **B**. Brightness scaling multiplies all three RGB components by a factor (e.g., 0.5 for half-brightness). `scale((255, 165, 0), 0.5)` gives `(127, 82, 0)` — the same orange color at half brightness. This preserves the color's hue and saturation while reducing its intensity, which is useful for smooth fade effects and trail animations.

    **Concept Tested:** Brightness Scaling

---

#### 10. A student wants to display a 10-LED bar graph showing a sensor value from 0–100. With the sensor at 70, how many LEDs should light up?

<div class="upper-alpha" markdown>
1. 7 LEDs
2. 10 LEDs
3. 70 LEDs
4. 3 LEDs
</div>

??? question "Show Answer"
    The correct answer is **A**. The formula `lit = int(value / max_value * 10)` calculates how many LEDs should light up. With value=70 and max_value=100: `int(70/100 × 10) = int(7.0) = 7` LEDs. This scales the 0–100 sensor range onto the 0–10 LED range proportionally, creating a visual bar meter.

    **Concept Tested:** LED Level Meter / 10-Bar LED Array

---
