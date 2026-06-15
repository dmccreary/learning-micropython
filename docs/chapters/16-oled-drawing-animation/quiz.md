# Quiz: OLED Drawing Methods, Framebuffer, and Animation

Test your understanding of OLED drawing commands, framebuffers, and creating animations with these questions.

---

#### 1. What is a framebuffer?

<div class="upper-alpha" markdown>
1. A special folder on the Pico where display images are stored as files
2. A block of RAM that holds the pixel values for the entire display screen before they are sent to the hardware
3. A buffer that stores network frames when using Wi-Fi
4. A feature of Thonny that lets you preview what will appear on a display
</div>

??? question "Show Answer"
    The correct answer is **B**. A framebuffer is an area of memory (RAM) that stores the color or brightness value for every single pixel on the screen. When you call `oled.text()` or `oled.fill_rect()`, you are writing into this buffer. Nothing changes on the actual display until you call `oled.show()`, which sends the entire buffer over I2C/SPI to the display controller.

    **Concept Tested:** Framebuffer Concept

---

#### 2. What does `oled.fill(0)` do?

<div class="upper-alpha" markdown>
1. Sets all pixels to white (maximum brightness)
2. Fills the entire screen with black (turns all pixels off) by writing 0 to every pixel in the framebuffer
3. Fills only the first row of pixels with black
4. Resets the OLED controller and restarts the initialization sequence
</div>

??? question "Show Answer"
    The correct answer is **B**. `oled.fill(0)` writes the value 0 to every pixel in the framebuffer, setting them all to black. On a monochrome OLED, 0 = off (black) and 1 = on (white). This is typically the first step before drawing new content — it clears the previous frame so old pixels do not "bleed through" into the new image.

    **Concept Tested:** oled.fill() Method

---

#### 3. What are the arguments for `oled.text("Hi", 10, 20)`?

<div class="upper-alpha" markdown>
1. Text string "Hi", font size 10, brightness 20
2. Text string "Hi", x-coordinate 10 (pixels from left), y-coordinate 20 (pixels from top)
3. Text string "Hi", column 10 (characters), row 20 (characters)
4. Text string "Hi", I2C address 10, page 20
</div>

??? question "Show Answer"
    The correct answer is **B**. The `oled.text(string, x, y)` method places text starting at pixel column x from the left edge and pixel row y from the top edge. On a 128×64 OLED, valid x values are 0–127 and valid y values are 0–63. Each character is 8 pixels wide and 8 pixels tall, so 8 characters fit across a 64-pixel-wide area starting at x=0.

    **Concept Tested:** oled.text() Method

---

#### 4. In a bounce animation, a ball moves right across the screen and reaches x=128. What should the code do?

<div class="upper-alpha" markdown>
1. Stop the animation — the ball has reached the boundary
2. Teleport the ball to x=0 so it wraps to the left side
3. Reverse the x direction (multiply speed_x by -1) so the ball bounces back
4. Increase the ball's speed to skip past the boundary quickly
</div>

??? question "Show Answer"
    The correct answer is **C**. In a bounce animation, when the ball hits a wall (x >= max_x or x <= 0), the velocity component for that axis is reversed by multiplying by -1. If `speed_x = 3` and the ball hits the right wall, `speed_x = -3` sends it back to the left. The same logic applies to the Y axis for top/bottom boundaries.

    **Concept Tested:** Bounce Animation / Framebuffer Animation

---

#### 5. Why must you call `oled.fill(0)` at the start of every animation frame?

<div class="upper-alpha" markdown>
1. Calling `fill(0)` charges the OLED's internal capacitors for the next frame
2. Without clearing the screen, the old position of the ball stays visible and you see a trail of pixels instead of smooth movement
3. The OLED controller requires a clear command before each I2C transmission
4. `fill(0)` prevents screen burn-in on OLED displays
</div>

??? question "Show Answer"
    The correct answer is **B**. The framebuffer keeps whatever was drawn last. If you draw a ball at position (50, 30) in frame 1, that pixel stays in the buffer until something overwrites it. In frame 2, if you just draw at (53, 33) without clearing, both the old and new positions are visible — leaving a trail. Clearing with `fill(0)` first ensures only the current frame's content appears.

    **Concept Tested:** Framebuffer Animation / Clear Before Draw

---

#### 6. What does `oled.pixel(64, 32, 1)` do?

<div class="upper-alpha" markdown>
1. Draws a 64x32 pixel white rectangle in the top-left corner
2. Sets the single pixel at column 64, row 32 to white (on)
3. Draws a white circle with radius 1 centered at (64, 32)
4. Reads the color of the pixel at (64, 32) — 1 means it is currently white
</div>

??? question "Show Answer"
    The correct answer is **B**. `oled.pixel(x, y, color)` operates on one pixel at a time. `oled.pixel(64, 32, 1)` sets the pixel at column 64 from the left, row 32 from the top, to white (color=1). Calling `oled.pixel(64, 32, 0)` would turn that same pixel off. This is the most precise drawing tool — useful for custom graphics and games.

    **Concept Tested:** oled.pixel() Method

---

#### 7. What is the purpose of `framebuf.FrameBuffer` in MicroPython?

<div class="upper-alpha" markdown>
1. It is used to buffer UART serial data to avoid missing bytes
2. It creates an off-screen drawing surface in RAM that you can draw into and then copy to the display
3. It provides frame-rate control so animations run at exactly 30 fps
4. It manages the file buffer when reading large image files from the SD card
</div>

??? question "Show Answer"
    The correct answer is **B**. `framebuf.FrameBuffer` creates a pixel buffer in RAM — essentially an invisible canvas. You draw shapes, text, and sprites onto it, then use `oled.blit()` to copy the buffer onto the display's framebuffer at any position. This is useful for creating sprites or UI elements that can be moved around the screen without redrawing them each frame.

    **Concept Tested:** framebuf.FrameBuffer / MicroPython framebuf

---

#### 8. A student wants to display a temperature sensor reading that updates every second. What is the correct pattern?

<div class="upper-alpha" markdown>
1. Initialize the display once, then call `oled.text()` every second without clearing
2. In a loop: clear the buffer with `fill(0)`, draw the new value with `text()`, call `show()`, then `sleep(1)`
3. Call `oled.show()` before drawing and `oled.fill(0)` after drawing for best performance
4. Draw all possible temperature values during startup and switch between them using `blit()`
</div>

??? question "Show Answer"
    The correct answer is **B**. The correct pattern for updating a display is: (1) clear the old content with `oled.fill(0)`, (2) draw the new value with `oled.text()`, (3) send to the screen with `oled.show()`, (4) wait with `time.sleep(1)`. Skipping step 1 leaves old digits visible behind new ones. Calling `show()` before drawing would display a blank frame first.

    **Concept Tested:** Real-Time Sensor Display

---

#### 9. What does `oled.rect(10, 10, 50, 30, 1)` draw?

<div class="upper-alpha" markdown>
1. A filled white rectangle 10 pixels wide and 10 pixels tall at position (50, 30)
2. A white outline rectangle starting at (10, 10) that is 50 pixels wide and 30 pixels tall
3. A white line from (10, 10) to (50, 30)
4. A rounded rectangle with corner radius 1 at position (10, 10)
</div>

??? question "Show Answer"
    The correct answer is **B**. `oled.rect(x, y, width, height, color)` draws an outline (unfilled) rectangle. With arguments `(10, 10, 50, 30, 1)`: the top-left corner is at pixel (10, 10), the rectangle is 50 pixels wide and 30 pixels tall, and color=1 draws it white. To draw a filled rectangle, use `oled.fill_rect(10, 10, 50, 30, 1)` instead.

    **Concept Tested:** oled.rect() Method / oled.fill_rect() Method

---

#### 10. In the Pong game concept for OLED, what data must the program update every frame to animate the ball and paddles?

<div class="upper-alpha" markdown>
1. The OLED I2C address and display brightness
2. The ball's x/y position and velocity, and each paddle's y position, based on input and physics
3. The score values stored in flash memory so they are not lost if the Pico loses power
4. The framebuffer pixel format between MONO_HLSB and RGB565 to switch between game and menu screens
</div>

??? question "Show Answer"
    The correct answer is **B**. A Pong game on OLED must track: the ball's current x and y position (updated by adding velocity each frame), the ball's x and y velocity (reversed when hitting walls or paddles), and each paddle's y position (updated when the player presses a button). Each frame: clear screen, draw paddles at new positions, draw ball at new position, call show().

    **Concept Tested:** Framebuffer Animation / Pong Game Concept

---
