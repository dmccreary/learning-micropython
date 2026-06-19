# Drawing Bitmaps with MicroPython

!!! mascot-welcome "Welcome to Bitmaps"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will learn how to draw bitmap images on your OLED display. Let's build something amazing!

A **bitmap** is an image stored as a grid of pixels. Each pixel is either on (white) or off (black). Bitmaps let you draw logos, icons, and small pictures on your screen.

## Framebuffers

A [Framebuffer](../../misc/glossary.md#framebuffer) is the core data structure we use when drawing bitmaps.

Think of a framebuffer like a sheet of graph paper held in memory. You draw on the paper first. Then you paste the paper onto your screen all at once. This makes drawing fast and smooth.

## Block Image Transfers (blit)

The function we use to paste an image onto the display is called `blit()`. The name stands for **block image transfer** — it moves a block of pixel data all at once.

```py
oled.blit(frame_buffer, x, y)  # paste frame_buffer at position (x, y) on the screen
```

**What each part does:**

1. `frame_buffer` — the image you want to paste.
2. `x` — how many pixels from the left edge to start drawing.
3. `y` — how many pixels from the top edge to start drawing.

The `blit()` function checks the size of your image automatically. You only need to tell it where to start.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A `blit()` only updates the small area where your image goes. This makes it much faster than redrawing the whole screen with `oled.show()` every time something changes.

## Why blit() Is Efficient

When you call `oled.show()`, it sends all 128 x 64 pixels to the screen — every single time. That takes time.

When you use `blit()`, you only update the small area where your image is. If you have a ball moving across the screen, you only need to redraw the pixels around the ball.

For a video game, this speed difference really matters. The faster your screen updates, the smoother your game looks.

One thing to watch: `blit()` can cover up other things already on the screen. You need to keep track of where objects are so they do not overwrite each other by accident.

## Working with ByteArrays

Bitmaps in MicroPython are stored as a **bytearray** (byte array). A bytearray is a list of bytes — each byte holds 8 bits, and each bit controls one pixel.

Here is how a bytearray looks in code:

```py
my_bytearray = (b"\xFF\xFF\xFF\xBF\xDF\xEF\xF7\xFF\xFB\xFF\xFD")
```

The `b` at the start tells Python that everything inside the quotes is binary data (raw bytes). The `\x` before each pair of letters means the value is written in **hexadecimal** (base-16 numbers). For example, `\xFF` means all 8 bits are on (11111111 in binary).

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    You do not need to write bytearrays by hand! There are online tools that convert images into MicroPython bytearrays for you. See the reference at the bottom of this page.

## Creating a Solid Block of Pixels

Sometimes you want to fill a region of the screen with all-white or all-black pixels. Here is how to do it step by step.

```python
import framebuf                                       # import the framebuffer tool

# create memory for a 10x10 solid white block
# 10 pixels wide * 10 pixels tall = 100 pixels
# each byte holds 8 pixels, so we need ceil(100/8) = 13 bytes -> use 20 for safety
on_buffer = bytearray(20)                            # create 20 bytes of empty memory
on_buffer[:] = b'\xff' * 20                          # fill all bytes with 1s (all pixels on)

# wrap the bytearray in a FrameBuffer so we can draw with it
on_square = framebuf.FrameBuffer(on_buffer, 10, 10, framebuf.MONO_HLSB)

oled.blit(on_square, 5, 5)                           # paste the white square at position (5, 5)
oled.show()                                          # send the result to the screen
```

**What each line does:**

1. `import framebuf` — loads the framebuffer tool.
2. `on_buffer = bytearray(20)` — creates 20 bytes of memory, all set to zero.
3. `on_buffer[:] = b'\xff' * 20` — fills every byte with `0xFF` (all 8 bits on = all pixels white).
4. `framebuf.FrameBuffer(on_buffer, 10, 10, framebuf.MONO_HLSB)` — wraps the memory into a 10x10 drawable image.
5. `oled.blit(on_square, 5, 5)` — pastes the white square 5 pixels from the left and 5 from the top.
6. `oled.show()` — updates the screen so you can see it.

## Image Encoding Options

There are a few different ways to arrange the bits inside a bytearray. The arrangement is called the **encoding format**. You must use the right format when you create your `FrameBuffer`.

### Vertical Least Significant Bit (MONO_VLSB)

`framebuf.MONO_VLSB`

In this format, bits go from top to bottom. Each byte covers 8 pixels stacked vertically. Bit 0 is at the top. After 8 pixels down, the next byte starts one column to the right.

### Horizontal Least Significant Bit (MONO_HLSB)

`framebuf.MONO_HLSB`

In this format, bits go from left to right. Each byte covers 8 pixels in a row. Bit 7 is on the left. After 8 pixels across, the next byte starts on the same row.

Most image converters let you choose which format to use. Check which format your display driver expects before you paste an image.

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Bytearrays and bit formats can feel confusing at first. That is completely normal — even experienced coders look these up every time. Start with the solid block example and build from there!

## References

[MicroPython Bitmap Tool Video](https://www.youtube.com/watch?v=a7MzPA0T_MM) — this video by Lucky Resistor gives a great overview of image formats used in MicroPython.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know how to use bitmaps and the `blit()` function to draw images on your OLED display! Next, you will learn how to draw shapes that the standard library does not include — like circles.
