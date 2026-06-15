# Quiz: Color Displays and E-Paper Screens

Test your understanding of TFT color displays, RGB565 color format, and e-paper technology with these questions.

---

#### 1. What does TFT stand for in the context of color displays?

<div class="upper-alpha" markdown>
1. Tiny Framebuffer Technology
2. Thin-Film Transistor — a type of LCD screen where each pixel has its own transistor
3. True Full Transparency — meaning the display is see-through when off
4. Timed Frame Transfer — the method used to send pixel data over SPI
</div>

??? question "Show Answer"
    The correct answer is **B**. TFT stands for Thin-Film Transistor. Each pixel in a TFT LCD display has its own transistor that controls it individually. This allows fast, precise control over millions of pixels, enabling smooth color video and graphics. TFT displays require a backlight (unlike OLED displays, where each pixel produces its own light).

    **Concept Tested:** TFT Display Technology

---

#### 2. What is the RGB565 color format used by TFT displays?

<div class="upper-alpha" markdown>
1. A format where each color channel uses 5 bits for red, 6 bits for green, and 5 bits for blue — totaling 16 bits per pixel
2. A format where red, green, and blue each use 5.65 bits for maximum accuracy
3. A compression scheme that reduces 24-bit color to 8 bits by removing the blue channel
4. A 3-byte format (5 bytes red, 6 bytes green, 5 bytes blue) used for high-resolution images
</div>

??? question "Show Answer"
    The correct answer is **A**. RGB565 packs one pixel's color into 16 bits: 5 bits for red (0–31), 6 bits for green (0–63), and 5 bits for blue (0–31). Green gets one extra bit because the human eye is most sensitive to green. This halves the memory requirement compared to 24-bit RGB (3 bytes per pixel), which is important for small microcontrollers with limited RAM.

    **Concept Tested:** RGB565 Color Format

---

#### 3. Which interface do most TFT color displays like the ILI9341 and ST7789V use to communicate with the Pico?

<div class="upper-alpha" markdown>
1. I2C — because it only requires 2 signal wires
2. UART — because it supports the highest data rates
3. SPI — because it provides fast enough data transfer for full-color pixel updates
4. 1-Wire — the same protocol used by temperature sensors
</div>

??? question "Show Answer"
    The correct answer is **C**. TFT displays use SPI for data transfer. A 240×320 pixel display at 16 bits per pixel contains 240 × 320 × 2 = 153,600 bytes of pixel data per frame. SPI at 40–80 MHz can transfer this data fast enough for smooth display updates. I2C at 400 kHz would be far too slow for a full-color screen refresh.

    **Concept Tested:** TFT SPI Interface / ILI9341 Display

---

#### 4. What is the resolution of the popular ILI9341 TFT display module?

<div class="upper-alpha" markdown>
1. 128 × 64 pixels — the same as a standard OLED
2. 240 × 320 pixels in portrait mode (or 320 × 240 in landscape)
3. 480 × 320 pixels — twice the width of the ST7789V
4. 800 × 600 pixels — standard VGA resolution
</div>

??? question "Show Answer"
    The correct answer is **B**. The ILI9341 controller drives a 240×320 pixel display. In portrait orientation it is 240 pixels wide and 320 pixels tall; rotated to landscape it becomes 320 wide and 240 tall. This is significantly more pixels than a 128×64 OLED, enabling readable text at multiple font sizes and detailed color graphics.

    **Concept Tested:** ILI9341 Display / TFT Display Technology

---

#### 5. How does e-paper (e-ink) technology differ from both OLED and TFT displays?

<div class="upper-alpha" markdown>
1. E-paper uses sound waves to arrange colored particles, while OLED and TFT use light
2. E-paper only draws power when updating — it holds its image with zero power once the update is complete
3. E-paper supports full color (16 million colors) while OLED and TFT only support monochrome
4. E-paper refreshes 120 times per second, making it faster than OLED or TFT
</div>

??? question "Show Answer"
    The correct answer is **B**. E-paper displays use charged particles (tiny black and white capsules) that move into position when voltage is applied, then stay in place permanently with no power needed. A price tag in a store can display text for months on a tiny battery. The major tradeoff is slow refresh speed (1–4 seconds per update) and limited color options.

    **Concept Tested:** E-Paper / E-Ink Display Technology

---

#### 6. A student wants to use an e-paper display to show a weather forecast that updates every 10 minutes. Is e-paper a good choice?

<div class="upper-alpha" markdown>
1. No — e-paper cannot display numbers or weather symbols, only text
2. No — e-paper requires constant power to maintain its image between updates
3. Yes — e-paper's slow refresh is fine for 10-minute updates, and its zero idle power makes it ideal for battery-powered projects
4. Yes, but only if the Pico W is used — standard Pico cannot drive e-paper displays
</div>

??? question "Show Answer"
    The correct answer is **C**. A weather display updating every 10 minutes is a perfect use case for e-paper. The 1–4 second refresh time is barely noticeable when updates happen infrequently. Between updates, the display holds its image for free — zero power consumption. For a battery-powered outdoor sensor station, this can extend battery life from days to months compared to an OLED.

    **Concept Tested:** E-Paper Use Cases / E-Paper Power Consumption

---

#### 7. What conversion is needed to display a pure blue color on an RGB565 TFT display?

<div class="upper-alpha" markdown>
1. No conversion — send the bytes (0, 0, 255) directly as the color value
2. Convert to the 16-bit value 0x001F — full blue (5 bits = 31), zero red, zero green
3. Convert to the string "blue" — the display driver accepts color names
4. Convert to the grayscale equivalent — TFT displays cannot show pure blue
</div>

??? question "Show Answer"
    The correct answer is **B**. In RGB565, blue occupies the lowest 5 bits of the 16-bit value. Full blue = 0b0000000000011111 = 0x001F. Full red = 0xF800 (top 5 bits), full green = 0x07E0 (middle 6 bits), white = 0xFFFF, black = 0x0000. You cannot send a 3-byte (R, G, B) tuple directly — the driver expects a 16-bit integer.

    **Concept Tested:** RGB565 Color Format

---

#### 8. Why does an e-paper display sometimes show a "ghost" of the previous image during a refresh?

<div class="upper-alpha" markdown>
1. The e-paper controller has a bug in its firmware that was never patched
2. Particles that did not fully move to their new position during the last update leave a faint residual image
3. The Pico's SPI bus is too slow to transmit the full image in a single frame
4. The e-paper display is not properly grounded, causing electrical interference
</div>

??? question "Show Answer"
    The correct answer is **B**. E-paper particles are physically moved by electric fields, but some particles may not fully complete their journey to the new position — especially in cold temperatures or after many updates. This leaves a faint "ghost" of the old image. Many e-paper drivers include a full refresh cycle that first turns all pixels black then white to clear residual charge before drawing the new image.

    **Concept Tested:** E-Paper Ghosting / E-Paper Display Technology

---

#### 9. The ST7789V display has a resolution of 240×240. Which display orientation does this resolution suggest?

<div class="upper-alpha" markdown>
1. Landscape only — the display is wider than it is tall
2. Portrait only — the display is taller than it is wide
3. Square — width and height are equal, so any rotation gives the same dimensions
4. Diagonal — pixels are arranged at a 45-degree angle for anti-aliased graphics
</div>

??? question "Show Answer"
    The correct answer is **C**. The ST7789V drives a 240×240 square display panel. Because width equals height, rotating the display 0°, 90°, 180°, or 270° produces the same 240×240 usable area. This makes the ST7789V popular for round smartwatch-style displays and compact square widgets where rotation does not matter.

    **Concept Tested:** ST7789V Display / TFT Display Technology

---

#### 10. A maker wants to build a battery-powered name badge that shows their name and contact details. Which display type is the best choice?

<div class="upper-alpha" markdown>
1. ILI9341 TFT — for bright color and fast refresh
2. OLED (SSD1306) — for low power and easy setup
3. E-paper — for zero standby power and high readability in bright sunlight
4. MAX7219 LED matrix — for high visibility across a room
</div>

??? question "Show Answer"
    The correct answer is **C**. A name badge never needs to update rapidly — the text changes only when the wearer reprograms it. E-paper holds its image indefinitely with no power once written, making a tiny coin cell battery last months or even years. E-paper is also highly readable in direct sunlight (unlike OLED or TFT) and has a professional paper-like look perfect for a name badge.

    **Concept Tested:** E-Paper Use Cases / Display Selection

---
