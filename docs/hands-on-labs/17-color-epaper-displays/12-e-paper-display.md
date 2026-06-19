# Raspberry Pi E-Paper Display

!!! mascot-welcome "Welcome to E-Paper Displays"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will learn about a very special kind of screen called an e-paper display. It works like magic — it keeps showing your image even when the power is off!

## What Is an E-Paper Display?

An **e-paper display** (also called an **e-ink display**) is a screen that works very differently from a normal LCD or LED screen. A regular screen needs constant power to stay lit. An e-paper display only uses power when the image changes.

Think of it like a printed page. Once words are on a page, the page does not need power to keep showing them. E-paper works the same way. It "remembers" the last image it showed, even when you unplug it.

This is why e-readers (like Kindles) have such long battery life. The screen only uses power when you turn the page.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    An e-paper display only uses power when the image changes. This is why devices with e-paper screens can run for weeks on a single battery charge.

## Specifications

Here are the key facts about this e-paper module:

1. **Screen size:** 2.9 inches diagonal
2. **Resolution:** 296 pixels wide by 128 pixels tall
3. **Touch support:** Yes — up to 5 touch points at once
4. **Backlight:** None — e-paper reflects room light like real paper
5. **Power use:** Very low — power is only needed when refreshing the image
6. **Interface:** Serial Peripheral Interface (SPI) or Inter-Integrated Circuit (I2C)
7. **GPIO pins needed:** Very few

## How E-Paper Works

Normal screens use tiny lights (pixels) that turn on and off. E-paper works differently. It has millions of tiny capsules filled with black and white particles. When electricity hits a capsule, the black particles move to the top (making a dark dot) or the white particles move to the top (making a light dot).

The key thing is: once the particles move, they stay in place. No more electricity is needed to hold them there.

## Why Use E-Paper?

E-paper displays are great for projects where:

- The image does not change often (like a clock, weather station, or name badge)
- You need very low power use (battery-powered projects)
- You want the screen to be readable in bright sunlight

Regular LCD screens are hard to read in sunlight because they glow. E-paper reflects light like real paper, so it looks great outdoors.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    E-paper displays are slow to refresh — it takes about a second to update the full screen. Use them for displays that change slowly, like a price tag or a calendar.

## What Is Capacitive Touch?

This display also has a **capacitive touch** screen. Capacitive means it senses the tiny electrical charge in your finger. When you touch the screen, it detects exactly where your finger is.

This display supports up to 5 touch points at the same time. That means it can track 5 fingers touching the screen together.

You can also set up your own **wakeup gesture** — a special touch pattern that wakes the device from sleep mode.

## Interface Options

This display can communicate with the Pico in two ways:

- **SPI (Serial Peripheral Interface):** Fast, uses more pins, good for quick updates
- **I2C (Inter-Integrated Circuit):** Slower, uses fewer pins, good for simple projects

Both interfaces work well. SPI is faster, but I2C needs only two wires.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never bend or press hard on the e-paper surface. The tiny capsules inside can break and leave permanent marks on the screen.

## Resources

1. [Waveshare Product Page](https://www.waveshare.com/pico-captouch-epaper-2.9.htm)
2. [Waveshare Wiki](https://www.waveshare.com/wiki/Pico-CapTouch-ePaper-2.9)
3. [Sample MicroPython Driver](https://github.com/waveshare/Pico_ePaper_Code/blob/main/python/0Pico-ePaper-5.65f.py)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now understand what makes e-paper displays special. Next, you will write MicroPython code to display text and images on this remarkable screen!
