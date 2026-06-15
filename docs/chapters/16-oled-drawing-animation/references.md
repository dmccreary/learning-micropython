# References: OLED Drawing Methods, Framebuffer, and Animation

1. [Framebuffer](https://en.wikipedia.org/wiki/Framebuffer) - Wikipedia - Explains the pixel buffer that all drawing commands modify before the screen updates. Central to this chapter's draw-then-`show()` model.

2. [Raster graphics](https://en.wikipedia.org/wiki/Raster_graphics) - Wikipedia - Describes how images are stored as grids of pixels. Background for the chapter's pixel-based drawing and animation.

3. [Bresenham's line algorithm](https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm) - Wikipedia - Covers the classic integer method for drawing straight lines on a pixel grid. Explains how the chapter's `line()` method works under the hood.

4. Get Started with MicroPython on Raspberry Pi Pico - Gareth Halfacree & Ben Everard - Raspberry Pi Press - The official book's graphics chapters cover drawing shapes and text on an OLED, paralleling this chapter.

5. Programming with MicroPython - Nicholas H. Tollervey - O'Reilly Media - Explains the MicroPython display and framebuffer workflow that this chapter builds on.

6. [framebuf](https://docs.micropython.org/en/latest/library/framebuf.html) - MicroPython - Official reference for `pixel()`, `line()`, `rect()`, `text()`, and the pixel formats used in this chapter. The authoritative companion to the drawing code.

7. [Adafruit GFX Graphics Library](https://learn.adafruit.com/adafruit-gfx-graphics-library) - Adafruit - Explains the graphics-primitive concepts (lines, rectangles, circles, text) shared by most display libraries. Reinforces the chapter's drawing methods.

8. [Raspberry Pi Pico SSD1306 OLED (MicroPython)](https://randomnerdtutorials.com/raspberry-pi-pico-ssd1306-oled-micropython/) - Random Nerd Tutorials - Shows drawing pixels, shapes, and text on a Pico OLED with code. Good practice for the chapter's exercises.

9. [Bresenham's Line Generation Algorithm](https://www.geeksforgeeks.org/bresenhams-line-generation-algorithm/) - GeeksforGeeks - A worked explanation with Python code for drawing lines pixel by pixel. Deepens understanding of the chapter's line drawing.

10. [Adafruit GFX Graphics Primitives](https://learn.adafruit.com/adafruit-gfx-graphics-library/graphics-primitives) - Adafruit - Detailed reference for each drawing primitive and its parameters. A handy lookup while building the chapter's animations.
