---
title: MicroPython Environment and Development Tools
description: Installing Thonny, flashing MicroPython firmware, using the REPL, transferring files, boot.py/main.py, and the standard library modules uos, utime, and sys.
generated_by: claude skill chapter-content-generator
date: 2026-06-12 22:00:00
version: 0.09
---

# MicroPython Environment and Development Tools

## Summary

This chapter walks you through everything you need to start writing MicroPython programs on a real microcontroller: downloading and installing the Thonny IDE, flashing the MicroPython firmware onto your Pico, and using the interactive REPL to run code instantly. You will learn how to transfer files between your computer and the Pico using Thonny's file manager, mpremote, and rshell, and how boot.py and main.py control what runs at startup. The chapter also introduces the MicroPython standard library modules — uos, utime, and sys — that your programs will use throughout the course.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. MicroPython
2. MicroPython REPL
3. MicroPython Firmware
4. Flashing Firmware
5. Thonny IDE
6. VS Code IDE
7. Thonny File Manager
8. mpremote Tool
9. rshell Tool
10. File Transfer to Pico
11. MicroPython Interpreter
12. Interactive Mode
13. Script Mode
14. Boot.py File
15. Main.py File
16. MicroPython Modules
17. MicroPython Standard Library
18. uos Module
19. utime Module
20. sys Module

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Python Basics — Programs, Variables, Data Types, and Operators](../01-python-basics/index.md)
- [Chapter 2: Collections, Control Flow, Functions, and Error Handling](../02-control-flow-functions/index.md)

---

!!! mascot-welcome "Welcome to Chapter 3"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    It is time to leave the code editor and talk to a real microcontroller! In this chapter you will set up your development tools, put MicroPython on your Pico, and run your first program on real hardware. This is one of the most exciting steps in the whole course. Let's build something amazing!

## What Is MicroPython?

**MicroPython** is a small, efficient version of Python 3 designed to run on microcontrollers. A regular computer has gigabytes of RAM and a fast operating system. A microcontroller like the Raspberry Pi Pico has only 264 KB of RAM and no operating system at all. MicroPython fits Python into that tiny space by leaving out features that microcontrollers do not need (like file sorting and web frameworks) while keeping everything that matters for hardware control.

MicroPython includes a **MicroPython interpreter** — the program that reads your Python source code and runs it directly on the microcontroller. You interact with it in two ways: **interactive mode** (one command at a time) and **script mode** (a complete program stored as a file).

## What Is an IDE?

An **IDE** (Integrated Development Environment) is a software application that combines everything you need to write, run, and debug code in one place. Instead of juggling a separate text editor, a compiler, and a terminal window, an IDE wraps them together in a single graphical interface so you can focus on writing code rather than managing tools.

For MicroPython, a good IDE connects to your microcontroller over USB, lets you write and save programs, opens a REPL window for quick experiments, and helps you copy files to the board. Four tools are widely used for MicroPython development:

- **Thonny** — the best choice for beginners; one-click setup and a built-in MicroPython REPL, no configuration needed.
- **VS Code + MicroPico** — a professional-grade editor with Git integration; best for growing projects.
- **Mu Editor** — a clean, uncluttered editor with a built-in serial plotter for visualizing sensor data.
- **Wokwi Simulator** — runs entirely in a browser; lets you simulate circuits and MicroPython code without any physical hardware.

The infographic below compares all four side by side across cost, skill level, operating system support, MicroPython features, debugger capability, and best use cases.

<iframe src="../../posters/ides/main.html" width="100%" height="800" scrolling="no"></iframe>

## Setting Up Thonny IDE

**Thonny** is the recommended editor for this course. It was designed specifically for learning Python, and it has built-in support for MicroPython and the Pico. Download it free from [thonny.org](https://thonny.org) and install it on your computer.

To configure Thonny for MicroPython:

1. Open Thonny.
2. Go to **Tools → Options → Interpreter**.
3. Select **MicroPython (Raspberry Pi Pico)** from the dropdown.
4. Click **OK**.

**VS Code** with the MicroPython extension is an alternative for students who already know VS Code. It offers more advanced features but has a steeper setup. For beginners, stick with Thonny.

## Flashing the MicroPython Firmware

Before your Pico can run MicroPython, you must install the **MicroPython firmware** — a single `.uf2` file that replaces the factory software. **Flashing** means copying this file onto the Pico.

Follow these steps exactly:

1. Hold down the **BOOTSEL** button on the Pico.
2. While holding BOOTSEL, plug the USB cable into your computer.
3. Release the BOOTSEL button. The Pico appears as a USB drive called **RPI-RP2**.
4. Download the latest MicroPython firmware from [micropython.org/download/RPI_PICO](https://micropython.org/download/RPI_PICO).
5. Drag the `.uf2` file onto the **RPI-RP2** drive.
6. The Pico restarts automatically. The USB drive disappears — that means it worked!

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If the RPI-RP2 drive does not appear, try a different USB cable. Some cables are charge-only and carry no data. A data cable is required for flashing firmware.

## The MicroPython REPL — Interactive Mode

After flashing, connect the Pico to Thonny. At the bottom of the Thonny window you will see the **MicroPython REPL** (Read-Evaluate-Print Loop). The REPL shows the `>>>` prompt, which means it is waiting for your next command.

The REPL works in **interactive mode**: you type one line of Python, press Enter, and the Pico runs it immediately. This is perfect for quick experiments:

```python
>>> 2 + 2
4
>>> print("Hello from the Pico!")
Hello from the Pico!
>>> from machine import Pin
>>> led = Pin(25, Pin.OUT)
>>> led.value(1)   # the onboard LED lights up instantly
```

Interactive mode is great for testing ideas and exploring what the hardware can do — no need to save a file first.

#### Diagram: REPL Workflow Diagram

<iframe src="../../sims/repl-workflow/main.html" width="100%" height="512px" scrolling="no"></iframe>

<details markdown="1">
<summary>REPL Workflow Interactive Diagram</summary>
Type: diagram
**sim-id:** repl-workflow<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain
Learning Objective: Students can describe the Read-Evaluate-Print Loop cycle and distinguish interactive mode from script mode.

Canvas layout:
- Center: four labeled boxes arranged in a cycle: "Read" → "Evaluate" → "Print" → "Loop back to Read"
- Below the cycle: two side-by-side columns: "Interactive Mode" vs "Script Mode"
- Each box is clickable

Visual elements:
- Four rounded rectangles in a circular arrangement with arrows between them
- "Read": "You type a Python line and press Enter"
- "Evaluate": "The MicroPython interpreter runs the code"
- "Print": "The result appears on the >>> prompt"
- "Loop": "The prompt reappears, waiting for the next command"
- Color: active step highlighted in teal; others gray

Interactive controls:
- Clicking any box reveals a pop-up with a concrete example (e.g., clicking "Read" shows `>>> 2 + 2`)
- A "Next Step" button cycles through the four stages with highlighting
- Two toggle buttons: "Interactive Mode" and "Script Mode" — each shows a brief description in a side panel

Instructional Rationale: The four-step cycle with click-to-reveal makes the REPL loop concrete. Toggling between modes clarifies the difference between one-shot commands and stored programs.

Implementation: p5.js with four clickable rounded rects; state machine cycles through steps; createButton() for Next Step and mode toggles.
</details>

## Script Mode — Writing Complete Programs

In **script mode**, you write a complete program in Thonny's editor, save it, and run it all at once. Use **File → New** to open an editor tab, write your program, then click the green **Run** button (or press **F5**).

```python
# my_program.py — a complete script
from machine import Pin
import utime

led = Pin(25, Pin.OUT)   # onboard LED

for i in range(5):       # blink 5 times
    led.value(1)         # LED on
    utime.sleep(0.5)     # wait half a second
    led.value(0)         # LED off
    utime.sleep(0.5)     # wait half a second

print("Done blinking!")
```

Script mode is how you write every real project in this course.

## Transferring Files to the Pico

When you run a script in Thonny, it runs *once* and stops. To make a program run every time the Pico powers on, you need to **transfer** it to the Pico's internal flash memory. There are three ways to do this.

### Thonny File Manager

In Thonny, go to **View → Files** to open the file manager. It shows two panels: your computer on the left, and the Pico on the right. Drag files from left to right to copy them onto the Pico.

### mpremote

**mpremote** is a command-line tool. You install it with `pip install mpremote`, then use it from a terminal:

```bash
mpremote cp my_program.py :my_program.py   # copy to Pico
mpremote ls                                 # list files on Pico
mpremote run my_program.py                  # run without copying
```

### rshell

**rshell** is another command-line tool with a shell-like interface:

```bash
rshell cp my_program.py /pyboard/my_program.py
rshell ls /pyboard
```

| Tool | How to use | Best for |
|------|-----------|----------|
| Thonny File Manager | Drag-and-drop in GUI | Beginners |
| mpremote | Short commands in terminal | Everyday file management |
| rshell | Shell-like commands | Scripted deployments |

## Managing Files with mpremote

**mpremote** is MicroPython's official command-line tool for working with your Pico from a terminal. It lets you list files, copy programs, create folders, and run quick tests — all without opening Thonny. As your projects grow, mpremote becomes one of your fastest and most useful tools.

Install mpremote once on your computer by opening a terminal and typing:

```bash
pip install mpremote   # install from the Python package registry
```

### The Colon Rule — Pico vs. Your Computer

mpremote uses one simple rule to tell the two sides apart: any path that starts with a **colon** (`:`) points to the **Pico**. A path without a colon is on **your computer**.

| Path | Where it is |
|------|-------------|
| `main.py` | your computer |
| `:main.py` | the Pico |
| `:lib/ssd1306.py` | the Pico, inside the `/lib` folder |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The colon is easy to forget! If mpremote says "file not found" when you know the file is there, check your colons. No colon = your computer; colon = the Pico.

### Listing Files on the Pico

```bash
mpremote ls           # list all files in the Pico root folder
mpremote ls :lib      # list files inside the /lib folder
```

### Copying Files to the Pico

```bash
# Copy a program file from your computer to the Pico
mpremote cp my_program.py :my_program.py
```

You can also copy the other way — from the Pico back to your computer. Just reverse the colon:

```bash
# Back up main.py from the Pico to your computer
mpremote cp :main.py my_backup.py
```

### Running a Script Without Saving It

Use `mpremote run` to send a script to the Pico and run it right away, without saving it to flash memory. This is great for quick tests:

```bash
mpremote run test_led.py   # run on the Pico but do not save to flash
```

### Loading Drivers into the /lib Folder

MicroPython searches the `/lib` folder for driver libraries. When your code says `from ssd1306 import SSD1306_I2C`, MicroPython looks for `/lib/ssd1306.py` on the Pico. You must create the `/lib` folder before you can copy drivers into it:

```bash
mpremote mkdir :lib                        # create the /lib folder on the Pico
mpremote cp ssd1306.py :lib/ssd1306.py    # copy the OLED display driver into /lib
```

After copying, your program can import the driver by name:

```python
from ssd1306 import SSD1306_I2C   # works because /lib/ssd1306.py is now on the Pico
```

### Loading All Drivers for a Hardware Kit

When you set up a new kit, you often need to load several drivers at once. Run each command in order:

```bash
# Load all drivers for a kit that uses an OLED display, encoder, and distance sensor
mpremote mkdir :lib                                  # create /lib (safe to run even if it already exists)
mpremote cp drivers/ssd1306.py :lib/ssd1306.py      # OLED display driver
mpremote cp drivers/rotary.py  :lib/rotary.py       # rotary encoder driver
mpremote cp drivers/hcsr04.py  :lib/hcsr04.py       # HC-SR04 distance sensor driver
```

You only need to do this once per Pico. The `/lib` folder and its drivers stay in flash memory even after you unplug the power.

### Installing Packages with mip

MicroPython 1.19 added **mip**, the built-in package installer. mpremote downloads the package from the internet through your computer and copies it straight to the Pico — so the Pico itself does not need a Wi-Fi connection.

The two packages you will use most in this course are `umqtt.simple` for sending data over the internet and `ntptime` for setting the clock on a Pico W:

```bash
mpremote mip install umqtt.simple   # MQTT messaging library — used in the wireless chapter
mpremote mip install ntptime        # sync the Pico W clock over Wi-Fi
```

Other useful packages from the MicroPython library:

```bash
mpremote mip install urllib.urequest   # send HTTP GET and POST requests
mpremote mip install aioble            # Bluetooth Low Energy support
```

Most hardware drivers in this course — such as `ssd1306.py` for OLED displays and `hcsr04.py` for distance sensors — are plain `.py` files that you copy with `mpremote cp`, not packages you install with `mip`. Use `mip` when a project needs a networking or protocol library that does not come built in to MicroPython.

To see all available packages, browse the MicroPython package library at [github.com/micropython/micropython-lib](https://github.com/micropython/micropython-lib).

The table below summarizes the most common mpremote commands:

| Command | What it does |
|---------|-------------|
| `mpremote ls` | List files in the Pico root folder |
| `mpremote ls :lib` | List files inside `/lib` |
| `mpremote cp file.py :file.py` | Copy a file from your computer to the Pico |
| `mpremote cp :file.py backup.py` | Copy a file from the Pico to your computer |
| `mpremote run test.py` | Run a script on the Pico without saving it |
| `mpremote mkdir :lib` | Create the `/lib` folder on the Pico |
| `mpremote mip install name` | Download and install a package |

## boot.py and main.py — Startup Files

When the Pico powers on, MicroPython automatically looks for two special files:

1. **boot.py** — runs first, every time. Use it for hardware setup, Wi-Fi connection, and configuration that must happen before your program starts.
2. **main.py** — runs second, every time. This is where your main program lives.

```python
# main.py — runs automatically after boot.py on every power-up
from machine import Pin
import utime

led = Pin(25, Pin.OUT)

while True:              # loop forever — this is normal for embedded programs!
    led.toggle()
    utime.sleep(1)
```

!!! mascot-thinking "Key Idea: main.py Runs Forever"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Unlike programs on your laptop that finish and exit, a Pico program usually runs in an infinite `while True:` loop. The Pico has one job — keep blinking, keep reading sensors, keep controlling motors — and it does it until you unplug it or reset it.

## The MicroPython Standard Library

MicroPython includes a set of built-in **modules** — the **MicroPython standard library**. These modules give you ready-made functions for hardware control, time, the file system, and system information. You will use three of them in almost every project.

### utime — Timing Functions

The **utime module** provides time and delay functions:

```python
import utime

utime.sleep(1)           # pause for 1 second (float supported)
utime.sleep_ms(500)      # pause for 500 milliseconds
utime.sleep_us(100)      # pause for 100 microseconds
ms = utime.ticks_ms()    # milliseconds since last reset (for timing)
```

### uos — Operating System / File System

The **uos module** lets you work with the Pico's file system:

```python
import uos

print(uos.listdir())     # list files: ['boot.py', 'main.py']
uos.mkdir("data")        # create a directory
uos.remove("old.py")     # delete a file
print(uos.statvfs("/"))  # disk space information
```

### sys — System Information

The **sys module** gives you information about the MicroPython environment:

```python
import sys

print(sys.version)       # MicroPython version string
print(sys.platform)      # 'rp2' on the Pico
print(sys.path)          # list of directories Python searches for modules
sys.exit()               # stop the program immediately
```

The following table summarizes the three standard library modules:

| Module | Purpose | Key functions |
|--------|---------|---------------|
| `utime` | Time and delays | `sleep()`, `sleep_ms()`, `ticks_ms()` |
| `uos` | File system | `listdir()`, `mkdir()`, `remove()` |
| `sys` | System info | `version`, `platform`, `exit()` |

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Setting up hardware tools for the first time is often the trickiest part of any course. If your Pico does not show up, if Thonny gives a connection error, or if the firmware flash did not work — that is normal. Take it one step at a time, and check the troubleshooting tips in the debugging chapter. Every maker hits these bumps at the start.

## Key Takeaways

- **MicroPython** is Python 3 designed to run on microcontrollers with very little RAM.
- **Flash the firmware** once by holding BOOTSEL while connecting USB.
- The **REPL** runs one command at a time (interactive mode).
- **Script mode** runs a complete saved program.
- Copy programs to the Pico using **Thonny's file manager**, **mpremote**, or **rshell**.
- **boot.py** runs first; **main.py** runs second — both run automatically on power-up.
- `utime`, `uos`, and `sys` are the three standard library modules you will use most.

!!! mascot-celebration "Your First Real Hardware Step!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have set up your tools, flashed your Pico, and run code on real hardware. That is a huge milestone — welcome to the world of physical computing! In Chapter 4 you will learn all about the microcontroller hardware itself: pins, power, memory, and the amazing features of the RP2040 chip inside your Pico. You've got this, maker!

## References

[See the Annotated References for this chapter](references.md)
