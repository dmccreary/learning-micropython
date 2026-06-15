# Non-Graphical Displays with MicroPython

!!! mascot-welcome "Welcome to the Non-Graphical Displays Section"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Not every display needs to draw pictures! LED bars, 7-segment digits, and
    character LCD screens can show exactly what you need — with very simple code.
    Let's build something amazing!

## What Is a Non-Graphical Display?

A **non-graphical display** shows information without drawing pixels one at a time.
Instead of a blank canvas you paint on, these displays use fixed shapes:

- **LEDs** — individual lights you turn on or off
- **LED bar graphs** — a row of 10 LEDs that work like a level meter
- **7-segment displays** — seven LED segments that combine to form digits (0–9)
- **Character LCD screens** — a grid of tiny rectangles that each show one letter

These displays are simpler and cheaper than graphical screens, and they work well
for showing numbers, text, and status information.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Graphical displays show anything by controlling thousands of tiny pixels.
    Non-graphical displays control a small number of fixed segments or characters.
    Simpler hardware means simpler code!

## How They Connect to the Pico

| Display type | Common interface | Typical wires needed |
|-------------|-----------------|---------------------|
| Single LED | GPIO direct | 2 (signal + GND) |
| LED bar graph | GPIO (one pin per LED) | Up to 12 |
| 7-segment (single digit) | GPIO direct | 8 |
| 7-segment with driver chip (MAX7219) | SPI | 4 |
| Character LCD (16×2) | I2C with adapter | 4 |
| 4-digit 7-segment display | I2C (TM1637) | 4 |

Most modern displays use an **I2C adapter board** that reduces wiring to just
four wires: GND, VCC (3.3 V), SDA (data), and SCL (clock).

## What's in This Section

- **[LED Button](02-led-button.md)** — combine a button and an LED in one part
- **[7-Segment Display](seven-segment.md)** — display single digits
- **[10-Bar LED Graph](03-10-bar-leds.md)** — make a level meter
- **[Level Meter](03a-10-bar-level.md)** — drive the bar with a sensor reading
- **[8×8 LED Matrix](04-8x8-led-matrix.md)** — show patterns on an LED grid
- **[Character LCD](10-character-lcd-display.md)** — print text on a 16×2 screen
- **[4-Digit LED Display](05-4-digit.md)** — show a 4-digit number or clock

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Start with the single LED button lab to practice wiring, then move to the
    7-segment display to practice sending digit codes. Each lab builds on the
    skills from the one before it.
