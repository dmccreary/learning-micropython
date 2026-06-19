# Waveshare LCD Display

!!! mascot-welcome "Welcome to the Waveshare LCD Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will connect a small color screen to your Raspberry Pi Pico. Get ready to see bright colors on a tiny display!

## What Is This Display?

The Waveshare Pico LCD 1.8 is a small color screen. It plugs right onto your Raspberry Pi Pico. No extra wires are needed — it uses a built-in pin header that slides directly onto the Pico's pins.

The screen uses a technology called **Thin-Film Transistor Liquid Crystal Display (TFT LCD)**. Think of it like a tiny TV. Each pixel on the screen can show one of 65,000 different colors.

The display talks to the Pico using **Serial Peripheral Interface (SPI)**. SPI is a way for two devices to send data back and forth very quickly. It uses just a few wires to move a lot of information fast.

## Specifications

Here are the key facts about this display:

1. **Screen size:** 1.8 inches diagonal
2. **List price:** $10 plus shipping
3. **Colors:** 65,000 different RGB colors
4. **Resolution:** 160 pixels wide by 128 pixels tall
5. **Interface:** Serial Peripheral Interface (SPI)
6. **Driver chip:** ST7735S
7. **Connection:** Plugs directly onto the Raspberry Pi Pico
8. **Pixel size:** 0.219 mm by 0.219 mm
9. **Board size:** 52.0 mm by 34.5 mm
10. **Operating voltage:** 2.6V to 5.5V
11. **Color depth:** 18 bits per pixel (6 bits for each color)

!!! mascot-thinking "What Does Resolution Mean?"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Resolution is the number of tiny dots (called pixels) on the screen. This display has 160 columns and 128 rows of pixels. More pixels means a sharper, clearer picture.

## What Is a Driver Chip?

A **driver chip** is a small computer inside the display. It receives instructions from the Pico and turns them into pixels on the screen. The ST7735S driver chip on this display is very popular. Many small color screens use it.

## How Colors Work

This display uses the **RGB color system**. RGB stands for Red, Green, Blue. Every color you see is made by mixing these three colors. For example:

- Red + Green = Yellow
- Red + Blue = Purple
- Green + Blue = Cyan
- Red + Green + Blue = White

Each pixel stores 18 bits of color information. That means 6 bits for red, 6 bits for green, and 6 bits for blue. Together, this gives you 65,000 possible colors.

## Why Use This Display?

This display is great for beginners because:

- It plugs directly onto the Pico with no wiring needed.
- It is very affordable at about $10.
- It uses the popular ST7735S driver, which has good MicroPython support.
- It is small and easy to carry in a project box.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    SPI displays refresh faster than I2C displays. Use SPI when you want animations or fast-changing graphics on your screen.

## How the Display Connects

Because this display plugs directly onto the Pico, connection is very simple:

1. Hold the Pico flat on your table with the USB port facing up.
2. Line up the display's female pin header with the Pico's male pins.
3. Press the display gently and evenly down onto the Pico until it is snug.
4. Make sure all pins are fully seated before plugging in USB power.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never force the display onto the Pico. If it does not slide on easily, check that the pins are lined up correctly before pressing again.

## What You Can Do with This Display

Once you have the display working, you can:

- Show text messages in many colors
- Draw shapes like rectangles, lines, and circles
- Display sensor readings in real time
- Create simple games with moving objects

## References

- [Waveshare Product Page](https://www.waveshare.com/pico-lcd-1.8.htm)
- [Waveshare Wiki](https://www.waveshare.com/wiki/Pico-LCD-1.8)
- [Demo Code Download](https://www.waveshare.com/w/upload/9/9c/Pico_LCD_code.zip)
- [ST7735S Datasheet (PDF)](https://www.waveshare.com/w/upload/e/e2/ST7735S_V1.1_20111121.pdf)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know how the Waveshare LCD display works and how to connect it to your Pico. Next, you will write MicroPython code to show colors and text on the screen!
