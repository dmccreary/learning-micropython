# Basic Drawing Functions

!!! mascot-welcome "Welcome to OLED Drawing"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will draw shapes and text on a tiny OLED (Organic Light-Emitting Diode) display. Let's build something amazing!

An OLED display is a small screen that lights up tiny dots called **pixels**. Our display has 128 pixels across and 64 pixels tall. That gives us 8,192 pixels to work with!

## How the Screen is Organized

Think of the display like a piece of graph paper. Every square on the paper is one pixel. The top-left corner is position (0, 0). Moving right increases the X number. Moving down increases the Y number.

So the bottom-right corner is at position (127, 63).

## The Four Basic Steps

To draw anything on the screen, you follow four steps every time:

1. Set up the display object so MicroPython knows how to talk to it.
2. Clear the screen by filling it with black pixels using `oled.fill(0)`.
3. Draw your text or shapes into memory using drawing functions.
4. Send your drawing to the display with `oled.show()`.

Step 4 is very important. Nothing appears on the screen until you call `oled.show()`.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Always call `oled.show()` after drawing. Without it, nothing appears on the screen — even if your code looks correct!

## Setting Up the Display

Our display uses a chip called the **SSD1306**. The SSD1306 talks to the Pico over a two-wire connection called **I2C (Inter-Integrated Circuit)**. I2C uses one wire for a clock signal and one wire for data.

Here is the code to set up the display:

```py
from ssd1306 import SSD1306_I2C  # import the display driver
oled = SSD1306_I2C(128, 64, i2c) # create an oled object: 128 wide, 64 tall
```

**What each line does:**

1. `from ssd1306 import SSD1306_I2C` — loads the display driver file so you can use it.
2. `oled = SSD1306_I2C(128, 64, i2c)` — creates your display object and tells it the screen size is 128 wide and 64 tall.

## Drawing Functions Table

Here are the most useful drawing functions for the SSD1306 display.

Remember: color `1` means white (pixel on). Color `0` means black (pixel off).

| Function | What it does | Example |
|---|---|---|
| `oled.fill(color)` | Fill the whole screen with one color | `oled.fill(0)` clears to black |
| `oled.text("Hello", x, y)` | Draw text starting at position (x, y) | `oled.text("Hi!", 0, 0)` |
| `oled.pixel(x, y, color)` | Light up one single pixel | `oled.pixel(10, 10, 1)` |
| `oled.hline(x, y, length, color)` | Draw a horizontal line | `oled.hline(0, 0, 128, 1)` |
| `oled.vline(x, y, length, color)` | Draw a vertical line | `oled.vline(0, 0, 64, 1)` |
| `oled.line(x1, y1, x2, y2, color)` | Draw a line at any angle | `oled.line(0, 0, 127, 63, 1)` |
| `oled.rect(x, y, width, height, color)` | Draw an empty rectangle outline | `oled.rect(10, 10, 50, 30, 1)` |
| `oled.fill_rect(x, y, width, height, color)` | Draw a filled rectangle | `oled.fill_rect(10, 10, 50, 30, 1)` |
| `oled.show()` | Send your drawing to the screen | `oled.show()` |
| `oled.invert(state)` | Flip black and white on the whole screen | `oled.invert(1)` |
| `oled.scroll(x, y)` | Slide the image across the screen | `oled.scroll(20, 0)` |

## Your First Program: Hello World

Here is a complete program that displays "Hello World!" on the screen.

```py
from machine import Pin, I2C        # import Pin and I2C tools
from ssd1306 import SSD1306_I2C     # import the display driver

# set up the two I2C wires
sda = Pin(0)                        # data wire goes to GP0
scl = Pin(1)                        # clock wire goes to GP1
i2c = I2C(0, sda=sda, scl=scl)     # create the I2C connection

# set up the OLED display (128 pixels wide, 64 pixels tall)
oled = SSD1306_I2C(128, 64, i2c)

oled.fill(0)                        # clear the screen to black
oled.text("Hello World!", 0, 0)     # draw text at the top-left corner
oled.show()                         # send the drawing to the screen
```

**What each line does:**

1. `from machine import Pin, I2C` — loads the tools for controlling pins and I2C.
2. `from ssd1306 import SSD1306_I2C` — loads the display driver.
3. `sda = Pin(0)` — sets GP0 as the data wire.
4. `scl = Pin(1)` — sets GP1 as the clock wire.
5. `i2c = I2C(0, sda=sda, scl=scl)` — creates the I2C connection using those two pins.
6. `oled = SSD1306_I2C(128, 64, i2c)` — creates the display object.
7. `oled.fill(0)` — fills the screen with black (clears any old image).
8. `oled.text("Hello World!", 0, 0)` — draws the text starting at position x=0, y=0.
9. `oled.show()` — sends everything to the screen so you can see it.

This displays:

![OLED SPI Hello World](../../img/oled-hello-world.png)

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The display has a **framebuffer** — a region of memory that holds your drawing before it appears on screen. Think of it like a canvas you paint on. The `oled.show()` command hangs the canvas on the wall so everyone can see it.

## Seeing All Available Drawing Functions

You can ask MicroPython to list every function a display object has. Use the `dir()` function to see the full list.

```py
from ssd1306 import SSD1306_I2C   # import the driver
print(dir(SSD1306_I2C))           # print all available functions
```

This prints:

```py
['__class__', '__init__', '__module__', '__name__', '__qualname__',
'__bases__', '__dict__', 'blit', 'fill', 'fill_rect', 'hline',
'invert', 'line', 'pixel', 'rect', 'scroll', 'text', 'vline',
'init_display', 'write_cmd', 'show', 'poweroff', 'poweron',
'contrast', 'write_data']
```

The names that start and end with `__` (double underscores) are used by Python internally. The rest — like `fill`, `text`, and `show` — are the drawing functions you can use.

## Drawing Pixels One at a Time

You can draw a simple picture by turning individual pixels on or off. Here is an example that draws a small heart shape using a grid of 1s (white pixels) and 0s (black pixels).

```py
ICON = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],  # row 0 — all off
    [ 0, 1, 1, 0, 0, 0, 1, 1, 0],  # row 1 — two bumps of the heart
    [ 1, 1, 1, 1, 0, 1, 1, 1, 1],  # row 2 — wider
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1],  # row 3 — full width
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1],  # row 4 — full width
    [ 0, 1, 1, 1, 1, 1, 1, 1, 0],  # row 5 — narrowing
    [ 0, 0, 1, 1, 1, 1, 1, 0, 0],  # row 6 — narrowing more
    [ 0, 0, 0, 1, 1, 1, 0, 0, 0],  # row 7 — almost a point
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0],  # row 8 — the bottom tip
]

oled.fill(0)                       # clear the screen to black
for y, row in enumerate(ICON):     # loop through each row of the icon
    for x, pixel_color in enumerate(row):  # loop through each column
        oled.pixel(x, y, pixel_color)      # draw one pixel
oled.show()                        # send the finished drawing to the screen
```

**What each line does:**

1. `ICON = [...]` — defines the heart as a grid of numbers (1 = white, 0 = black).
2. `oled.fill(0)` — clears the screen before drawing.
3. `for y, row in enumerate(ICON)` — goes through each row of the grid, one at a time. `y` is the row number.
4. `for x, pixel_color in enumerate(row)` — goes through each item in the row. `x` is the column number.
5. `oled.pixel(x, y, pixel_color)` — turns that one pixel on or off.
6. `oled.show()` — sends the finished drawing to the screen.

## Power and Display Control Functions

These functions let you control the display beyond just drawing.

```py
oled.poweroff()       # turn off the display (image is saved in memory)
oled.poweron()        # turn the display back on (image reappears)
oled.contrast(0)      # make the display very dim
oled.contrast(255)    # make the display full brightness
oled.invert(1)        # flip colors: white becomes black, black becomes white
oled.invert(0)        # return to normal colors
oled.show()           # send the framebuffer to the display
```

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    OLED screens can get **burn-in** if the same image stays on screen for a long time. Always turn off or change the display when you are not watching it.

## The Framebuffer and Blit

A **framebuffer** is a region of memory (RAM) that holds an exact copy of what is on the screen. When you call `oled.fill()` or `oled.text()`, you are writing into the framebuffer — not directly to the screen. Only `oled.show()` copies the framebuffer to the real display.

The `blit()` function (short for **block image transfer**) copies a rectangular image from one framebuffer into another. This lets you draw a small image and paste it anywhere on the screen.

```py
import framebuf                                           # import the framebuffer tool

# create a tiny 8x8 pixel drawing area
small_buf = bytearray(8 * 8 * 1)                        # memory for an 8x8 image
small_fb = framebuf.FrameBuffer(small_buf, 8, 8, framebuf.MONO_VLSB)  # create the framebuffer
small_fb.line(0, 0, 7, 7, 1)                            # draw a diagonal line in it

oled.blit(small_fb, 10, 10, 0)                          # paste the small image at x=10, y=10
oled.show()                                              # show the result
```

**What each line does:**

1. `import framebuf` — loads the framebuffer tool.
2. `small_buf = bytearray(8 * 8 * 1)` — creates memory to hold an 8-by-8 pixel image.
3. `framebuf.FrameBuffer(...)` — wraps that memory into a drawable surface.
4. `small_fb.line(0, 0, 7, 7, 1)` — draws a diagonal line inside the small image.
5. `oled.blit(small_fb, 10, 10, 0)` — copies the small image onto the main screen at position (10, 10).
6. `oled.show()` — updates the screen.

## References

* [MicroPython Documentation on FrameBuffer](https://docs.micropython.org/en/latest/library/framebuf.html)
* [Drawing Primitive Shapes](https://docs.micropython.org/en/latest/library/framebuf.html#drawing-primitive-shapes)
* [Driving I2C OLED displays with MicroPython](https://www.mfitzp.com/article/oled-displays-i2c-micropython/) - by Martin Fitzpatrick
* [ST7735 Micropython Driver by Anthony Norman](https://github.com/AnthonyKNorman/MicroPython_ST7735)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now draw text, shapes, and even pixel art on your OLED display! Next, you will learn how to use bitmaps to draw more detailed images.
