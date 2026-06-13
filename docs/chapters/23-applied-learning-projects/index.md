---
title: Applied Learning and Capstone Projects
description: Complete kit projects (Maker Pi RP2040 robot, Spectrum Analyzer, NeoPixel Rotary, RFID), computational thinking, the full project design process, and an original capstone invention.
generated_by: claude skill chapter-content-generator
date: 2026-06-13 01:20:00
version: 0.09
---

# Applied Learning and Capstone Projects

## Summary

This final chapter brings together everything from the course into complete, working projects and introduces the problem-solving mindset that turns a student into a maker. You will explore ready-to-build project kits — the Maker Pi RP2040 robot, the NeoPixel Rotary display, the Spectrum Analyzer, and RFID card reader — and learn the four pillars of computational thinking: decomposition, pattern recognition, abstraction, and algorithm design. The chapter then guides you through the full design process for an original project: writing requirements, choosing components, building a breadboard prototype, drawing a wiring diagram, organizing your code, and preparing a demonstration. The course ends with your capstone project — an invention of your own design.

## Concepts Covered

This chapter covers the following 34 concepts from the learning graph:

1. Maker Pi RP2040 Kit
2. Maker Pi Pico Kit
3. Maker Nano RP2040 Kit
4. PWM Kit Project
5. Tone Generator Kit
6. Spectrum Analyzer Kit
7. NeoPixel Rotary Kit
8. Larson Scanner Kit
9. RFID RC522 Module
10. RFID RC522 SPI Interface
11. RFID Card Reading
12. Moving Rainbow Project
13. Decomposition
14. Pattern Recognition
15. Abstraction
16. Algorithm Design
17. Pseudocode
18. Flowchart
19. Loop Invariant
20. State Machine
21. Event-Driven Programming
22. Modular Programming
23. Project Requirements
24. Prototype Design
25. Breadboard Prototype
26. Wiring Diagram Creation
27. Component Selection
28. Bill of Materials (BOM)
29. Solderless Assembly
30. Code Organization
31. Version Control Basics
32. Git Basics
33. README Documentation
34. Project Demonstration

## Prerequisites

This chapter builds on concepts from:

- [Chapter 6: Digital Input, Output, and Interrupts](../06-digital-io-interrupts/index.md)
- [Chapter 12: Motors, Servos, and Stepper Motor Control](../12-motors-servos-steppers/index.md)
- [Chapter 14: NeoPixels and Non-Graphical Displays](../14-neopixels-displays/index.md)
- [Chapter 19: Wireless Connectivity and Internet of Things](../19-wireless-iot/index.md)

---

!!! mascot-welcome "Welcome to Chapter 23 — The Capstone!"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This is it — the final chapter! Everything you have learned across 22 chapters comes together here. You will build complete projects, learn computational thinking, and design your own original invention. This is not the end of your maker journey — it is the launch pad. Let's build something amazing that is entirely yours!

## Complete Project Kits

Before designing your own project, studying well-designed complete projects is the fastest way to level up. Here are six featured kits.

### Maker Pi RP2040 Robot Kit

The **Maker Pi RP2040 Kit** is a complete mobile robot platform from Cytron. The board has two motor channels, four servo connectors, a buzzer, four RGB LEDs, and eleven grove sensor connectors — all connected to an RP2040 chip. No breadboard needed.

A complete autonomous robot program uses almost every concept from this course:

```python
# Maker Pi RP2040 Robot — simplified structure
from machine import Pin, PWM
import utime

# Motor control (DRV8833 built in)
motor_a = PWM(Pin(8)); motor_a.freq(10000)
motor_b = PWM(Pin(9)); motor_b.freq(10000)

# Distance sensor on grove port
# Line sensors on grove ports
# Buzzer on pin 22

# State machine: FORWARD, AVOID, LINE_FOLLOW
state = "FORWARD"

while True:
    if state == "FORWARD":
        # drive forward, check distance sensor
        pass
    elif state == "AVOID":
        # back up and turn
        pass
```

### NeoPixel Rotary Kit

The **NeoPixel Rotary Kit** combines a rotary encoder with a ring of 12–24 NeoPixel LEDs. Turning the encoder moves a bright LED around the ring while all others dim. Pressing the encoder cycles through color modes.

Key concepts used: rotary encoder interrupts (Chapter 11), NeoPixel HSV color wheel (Chapter 14), non-blocking timer for idle animation (Chapter 20).

### Spectrum Analyzer Kit

The **Spectrum Analyzer Kit** uses an INMP441 digital microphone, an I2S interface (Chapter 11), FFT via ulab (Chapter 22), and a NeoPixel matrix or OLED display to show a real-time frequency spectrum.

Sound makes the bars jump. Bass frequencies show up on the left; treble on the right. The finished project looks like a professional audio visualizer.

### Larson Scanner Kit

A **Larson Scanner** (named after the Battlestar Galactica creator) is the classic "KITT" sweeping LED effect: a bright spot bounces back and forth across a LED strip, with a fade trail. It demonstrates smooth NeoPixel animation and bounce logic from Chapter 14.

```python
pos = 0
direction = 1

while True:
    for i in range(NUM_LEDS):
        # Brightness falls off with distance from pos
        distance = abs(i - pos)
        brightness = max(0, 255 - distance * 60)
        np[i] = (0, brightness, 0)   # green trail
    np.show()
    pos += direction
    if pos >= NUM_LEDS - 1 or pos <= 0:
        direction = -direction
    utime.sleep_ms(30)
```

### RFID RC522 — Card Reader Project

The **RFID RC522 Module** reads passive RFID/NFC cards. Wave a credit card, student ID, or Mifare key fob near the antenna and the RC522 reads its unique 4-byte UID.

The **RFID RC522 SPI interface** connects to the Pico over SPI. Copy the `mfrc522.py` driver to your Pico from `src/drivers/`.

```python
from machine import SPI, Pin
from mfrc522 import MFRC522

spi = SPI(0, sck=Pin(2), mosi=Pin(3), miso=Pin(4))
cs  = Pin(5, Pin.OUT)

reader = MFRC522(spi=spi, gpioCs=5, gpioRst=0)

print("Waiting for card...")
while True:
    stat, tag_type = reader.request(reader.REQIDL)
    if stat == reader.OK:
        stat, uid = reader.anticoll()
        if stat == reader.OK:
            uid_str = ":".join(f"{b:02X}" for b in uid)
            print(f"Card UID: {uid_str}")

            # Check against authorized list
            if uid_str == "AB:CD:EF:12":
                print("Access granted!")
```

**RFID card reading** applications: attendance tracking, access control, sorting stations, interactive scavenger hunts.

## Computational Thinking — The Maker's Mindset

**Computational thinking** is not programming — it is the problem-solving approach that makes programming possible. There are four pillars.

### Decomposition

**Decomposition** means breaking a large problem into smaller pieces that are each easier to solve. A weather station is not one big problem — it is: (1) connect DHT22, (2) connect OLED, (3) read temperature, (4) display temperature, (5) repeat every 2 seconds.

Ask yourself: "What is the smallest piece I can build and test independently?" Start there.

### Pattern Recognition

**Pattern recognition** means noticing when a problem you are solving is similar to a problem you have solved before. LED brightness control ↔ servo angle control ↔ motor speed control — all three are "scale a sensor value to a PWM duty cycle." Once you recognize the pattern, the solution writes itself.

### Abstraction

**Abstraction** means hiding complexity behind a simple interface. The `SSD1306_I2C` class is an abstraction: you call `oled.text()` without knowing how I2C packets are assembled. Your own functions do the same — `move(left_speed, right_speed)` hides the H-bridge detail from the robot logic above it.

### Algorithm Design

**Algorithm design** means writing a precise sequence of steps that solves a problem for all valid inputs. Before writing code, write **pseudocode** — English-language steps:

```
Algorithm: line follower
1. Read left IR sensor
2. Read right IR sensor
3. IF both sensors are on floor THEN drive forward
4. IF left sensor is on line THEN turn left
5. IF right sensor is on line THEN turn right
6. Repeat from step 1
```

A **flowchart** is a visual version of pseudocode. A **state machine** is an algorithm that chooses behavior based on a current state — used in the robot (FORWARD / AVOID / LINE_FOLLOW states above).

**Event-driven programming** structures code around events (button press, sensor threshold crossed, timer fired) rather than a fixed sequential flow. Interrupts and timer callbacks are the MicroPython tools for event-driven design.

## Designing Your Own Project

Here is the complete design process, from idea to demonstration.

### Step 1: Write Project Requirements

**Project requirements** define what your project must do. Write them as testable statements:

```
Requirements for "Plant Monitor":
1. Measure soil moisture every 5 minutes.
2. Display current moisture and last-watered time on OLED.
3. Sound a buzzer alarm when soil is dry (moisture < 20%).
4. Log timestamps and readings to SD card.
5. Run for at least 24 hours on 3 AA batteries without charging.
```

### Step 2: Choose Components

**Component selection** matches requirements to hardware. Use the sensor and display chapters to choose the right parts:

| Requirement | Component | Chapter |
|------------|----------|---------|
| Soil moisture sensor | Capacitive soil sensor (ADC) | Ch 7 |
| Display | SSD1306 OLED 128×64 | Ch 15–16 |
| Buzzer alarm | Passive buzzer | Ch 18 |
| Data logging | SD card module | Ch 21 |
| Low power | `machine.deepsleep()` | Ch 22 |

### Step 3: Create a Bill of Materials

A **Bill of Materials (BOM)** lists every component, quantity, and estimated cost:

```
BOM — Plant Monitor
- Raspberry Pi Pico W     1×   $6.00
- Capacitive moisture sensor  1×   $3.00
- SSD1306 OLED 128×64     1×   $4.00
- Passive buzzer          1×   $0.50
- MicroSD card + SPI board    1×   $5.00
- 330 Ω resistors (×5)    1×   $0.25
- Breadboard              1×   $3.00
Total: ~$21.75
```

### Step 4: Build the Breadboard Prototype

A **breadboard prototype** is a non-permanent assembly for testing your circuit before soldering. **Solderless assembly** means everything is held by the breadboard clip contacts — no solder, no permanent commitment.

Wiring order: always connect GND first, then power, then signal wires. Test each component individually before combining them.

### Step 5: Create the Wiring Diagram

A **wiring diagram** shows exactly which physical wire connects where. Draw it on paper or use a free tool like Fritzing. Label every wire with its signal name. Include the **bill of materials** as a legend.

### Step 6: Organize Your Code

**Code organization** for a multi-file project:

```
plant-monitor/
├── main.py              # main loop, state machine
├── boot.py              # Wi-Fi connection, RTC sync
├── sensors.py           # read_moisture(), read_battery()
├── display.py           # update_oled(), show_alarm()
├── logger.py            # log_reading(timestamp, value)
└── config.py            # ALARM_THRESHOLD, LOG_INTERVAL, SSID
```

**Modular programming** means each file has one job. Functions in `sensors.py` do not write to the display. Functions in `display.py` do not read sensors. This separation makes testing and debugging much easier.

### Step 7: Version Control with Git

**Version control** saves a history of every change you make. **Git basics** for a MicroPython project:

```bash
git init                          # start tracking in this directory
git add main.py sensors.py        # stage specific files
git commit -m "Add moisture alarm"  # save a snapshot
git log --oneline                 # see history
```

Create a `.gitignore` file and add `secrets.py` and `*.pyc` to it — never commit passwords to a public repository.

A **README** document describes what your project does, what hardware it uses, how to install it, and how to use it. A good README lets a stranger understand and rebuild your project without asking you any questions.

#### Diagram: Project Design Process Flowchart

<iframe src="../../sims/project-design-process/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>Project Design Process Flowchart MicroSim</summary>
Type: diagram
**sim-id:** project-design-process<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Create (L6)
Bloom Verb: design
Learning Objective: Students can apply the seven-step project design process to plan an original capstone project, identifying requirements, components, and code structure before building.

Canvas layout:
- Seven labeled boxes in a flowchart: Requirements → Components → BOM → Prototype → Wiring Diagram → Code Organization → Documentation
- Arrows between boxes; each box clickable to reveal a checklist

Visual elements:
- Active step highlighted in green when clicked
- Each step's checklist appears in a right-side panel with checkboxes the student can tick
- Progress bar at the top showing completion (steps ticked ÷ total steps)

Interactive controls:
- Click any step box to see its checklist
- Checkboxes are persistent for the session
- "Print checklist" button opens a text summary of all checked items

Instructional Rationale: An interactive checklist version of the design process gives students a concrete scaffold for capstone planning rather than an abstract description.

Implementation: p5.js with seven clickable rect boxes; createCheckbox() for each checklist item; JSON data structure for all checklist items by step.
</details>

### Step 8: Prepare Your Demonstration

A great **project demonstration** shows the project working, explains how it was built, and tells the story of challenges overcome:

1. **Introduce the problem** — What does your project solve? For whom?
2. **Demo the working project** — Show every feature live.
3. **Explain one interesting part** — Walk through one algorithm or circuit you designed.
4. **Describe one challenge** — What broke? How did you fix it?
5. **Answer questions** — Be proud of what you built.

## Your Capstone Project

The capstone project is your original invention. It must:

- Solve a real problem or create a genuine experience.
- Use at least three different hardware components from this course.
- Include at least 50 lines of organized, commented MicroPython code.
- Have a wiring diagram, a README, and a bill of materials.
- Work reliably for a 5-minute demonstration.

**Project idea starters** (choose one or invent your own):

| Category | Project idea |
|---------|-------------|
| Environment | Indoor air quality monitor (CO₂, temp, humidity on OLED + Pico W dashboard) |
| Robotics | Autonomous robot that navigates a maze using IR sensors and a compass |
| Music | MIDI controller with 16 touch pads and a spectrum analyzer display |
| Security | RFID door lock with access log on SD card and Wi-Fi alert |
| Art | Interactive NeoPixel installation that responds to motion and sound |
| Accessibility | Large-text OLED display for sensor readings for low-vision users |

!!! mascot-tip "Start Small, Iterate Fast"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The most common capstone mistake is designing too large a project and running out of time. Start with the smallest version that demonstrates your core idea — the "minimum viable product." Get that working first. Then add features one at a time. A fully working simple project is far more impressive than a half-working complex one.

## Loop Invariants and State Machines

Two final programming concepts that appear in every complex project:

A **loop invariant** is a condition that is always true at the start of every loop iteration. For the line follower: "The robot is always pointing in the direction it should be moving before checking sensors." Keeping track of invariants helps you prove your algorithm is correct.

A **state machine** is a model where the system is always in exactly one of a finite set of states. Transitions between states are triggered by events. State machines eliminate the "what happens if two things occur at once?" problem because only one state is active at a time.

## Key Takeaways

- **Decomposition** breaks large problems into manageable pieces; start with the smallest testable unit.
- **Pattern recognition** identifies when a new problem matches a solved pattern — save time by reusing solutions.
- **Abstraction** hides complexity; write functions so the caller does not need to know the implementation.
- **Algorithm design** → pseudocode → flowchart → code. Plan before you type.
- A **state machine** manages complex behavior by defining clear states and transitions.
- **Project requirements** must be testable; **BOM** lists every component and cost.
- **Modular code** separates concerns — one file per responsibility.
- **Git** saves your history; **README** tells your story; **wiring diagram** shows your circuit.
- A demonstration tells a story: problem → demo → one interesting detail → one challenge overcome.

??? question "Quick Check: In the four pillars of computational thinking, what is abstraction? (Click to reveal)"
    **Abstraction** is hiding the complexity of a system behind a simple interface. When you call `oled.text("Hello", 0, 0)`, you do not need to know how I2C protocol works, how the SSD1306 converts bytes to pixels, or how the OLED hardware illuminates each pixel — all of that is abstracted away. You only need to know that `text(string, x, y)` draws text at a position.

!!! mascot-celebration "Course Complete — You Are a Maker!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Twenty-three chapters. Hundreds of concepts. You have journeyed from Python variables all the way to PIO state machines, dual-core programming, and AI-assisted development. You have blinked LEDs, read sensors, driven motors, built robots, displayed graphics, made music, connected to the internet, and now you are ready to invent something original. The maker community is waiting to see what you build. Go create something amazing — and remember: every great project started exactly where you are right now.

---

*"The best way to predict the future is to invent it." — Alan Kay*
