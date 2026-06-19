# Non-Graphical Displays with MicroPython

!!! mascot-welcome "Welcome to the Non-Graphical Displays Section"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Not every display needs to draw pictures! Light-Emitting Diode (LED) bars, 7-segment digits, and character screens can show exactly what you need — with very simple code. Let's build something amazing!

## What Is a Non-Graphical Display?

A **non-graphical display** shows information without drawing tiny dots called pixels. Instead of a blank canvas you paint on, these displays use fixed shapes. Here are the most common types:

- **LEDs** — individual lights you turn on or off
- **LED bar graphs** — a row of 10 LEDs that work like a level meter
- **7-segment displays** — seven LED segments that combine to form digits (0–9)
- **Character LCD screens** — a grid of tiny rectangles, each showing one letter

These displays are simpler and cheaper than graphical screens. They work great for showing numbers, text, and status information.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Graphical displays show anything by controlling thousands of tiny pixels. Non-graphical displays control a small number of fixed segments or characters. Simpler hardware means simpler code!

## How They Connect to the Pico

Every display needs wires to carry power and signals. The table below shows how many wires each type needs.

| Display type | Common interface | Typical wires needed |
|-------------|-----------------|---------------------|
| Single LED | General-Purpose Input/Output (GPIO) direct | 2 (signal + GND) |
| LED bar graph | GPIO (one pin per LED) | Up to 12 |
| 7-segment (single digit) | GPIO direct | 8 |
| 7-segment with driver chip (MAX7219) | Serial Peripheral Interface (SPI) | 4 |
| Character LCD (16×2) | Inter-Integrated Circuit (I2C) with adapter | 4 |
| 4-digit 7-segment display | I2C (TM1637) | 4 |

Most modern displays use an **I2C adapter board**. That board reduces wiring to just four wires: GND, VCC (3.3 V), SDA (data), and SCL (clock).

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Start with the single LED button lab to practice wiring. Then move to the 7-segment display to practice sending digit codes. Each lab builds on the skills from the one before it.

## What's in This Section

Each lab below teaches you a new type of display. Start at the top and work your way down.

- **[LED Button](02-led-button.md)** — combine a button and an LED in one part
- **[7-Segment Display](seven-segment.md)** — display single digits
- **[10-Bar LED Graph](03-10-bar-leds.md)** — make a level meter
- **[Level Meter](03a-10-bar-level.md)** — drive the bar with a sensor reading
- **[8×8 LED Matrix](04-8x8-led-matrix.md)** — show patterns on an LED grid
- **[Character LCD](10-character-lcd-display.md)** — print text on a 16×2 screen
- **[4-Digit LED Display](05-4-digit.md)** — show a 4-digit number or clock

Each lab includes wiring steps, sample code, and explanations. You will always see what each line of code does.

## Why Learn Non-Graphical Displays?

You might wonder why you should bother with simple displays. Graphical screens can show anything! But non-graphical displays have real advantages.

They cost much less. A 10-bar LED graph costs about 40 cents. A character LCD costs about $2. They also use less power. That matters when your project runs on batteries.

They are also easier to wire up. Fewer wires mean fewer mistakes. And fewer mistakes mean more time spent coding and less time debugging.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know the types of non-graphical displays and why they are useful. Click the first lab link above and let's start building!
