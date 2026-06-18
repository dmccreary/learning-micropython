---
title: Distance Sensors
description: An interactive comparison of IR reflective, HC-SR04 ultrasonic, and VL53L0X laser time-of-flight distance sensors — range, accuracy, and interface — with a built-in quiz.
image: /posters/distance-sensors/distance-sensors-infographic.png
og:image: /posters/distance-sensors/distance-sensors-infographic.png
twitter:image: /posters/distance-sensors/distance-sensors-infographic.png
social:
   cards: false
hide:
    toc
---

Audience: students adding distance and proximity sensing to their MicroPython projects.
Chapter: 09 — Temperature & Distance Sensors

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

A three-column comparison of the distance sensors used in this course — the
binary **IR reflective** sensor, the **HC-SR04** ultrasonic "ping" sensor, and
the **VL53L0X** time-of-flight laser sensor — with pinouts, key specifications,
and guidance on when to use each. Click each column to see its facts, then use
**Quiz Me** to test which sensor fits a given job.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic for "Distance Sensor Comparison".

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Distance Sensor Comparison", subtitle beneath: "Three ways to measure distance with MicroPython on the Raspberry Pi Pico — IR Reflective · HC-SR04 Ultrasonic · VL53L0X Laser ToF." Place a small line-art double-headed measuring-arrow icon at the left and right ends of the title bar.

    Layout: EXACTLY THREE equal-width column cards on a light off-white background (#F7F9FC), arranged side by side. Each card occupies exactly one-third of the usable width, separated by a single uniform gutter, with equal left and right page margins. All three cards share the same top edge and the same bottom edge. Each card is a rounded-corner panel with a full-width colored title bar across its top; the title bar text is centered and spans the entire width of that card, with a one-line descriptive subtitle directly beneath the title inside the bar. Keeping the three columns equal in width and perfectly aligned is important — the column titles must line up across the top in a strict three-column grid. Within each card, stack four blocks top to bottom in the same order for all three columns: (1) a top-view illustration of the module, (2) a "PINOUT" block listing each pin as a small numbered colored circle followed by its name and role, (3) a "DESCRIPTION" block, (4) a "FEATURES" block with green check-mark bullets. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 — title bar (forest green #2D8A4E): title "IR Distance Sensor", subtitle "Binary HIGH/LOW reflective detection". Illustration: a small IR reflective module on a black PCB with a side-by-side pair of IR LEDs (one clear emitter, one black detector) and a blue trimmer potentiometer.
    PINOUT (3 pins):
    1. VCC — 3.3 V to 5 V
    2. OUT — Digital Output
    3. GND — Ground
    DESCRIPTION: Uses an IR LED and photodiode to detect reflected infrared light from nearby objects. The output is binary: LOW when an object is detected, HIGH when the path is clear.
    FEATURES:
    · Operating voltage: 3.3 V to 5 V
    · Adjustable detection range (via potentiometer)
    · Typical range: 2 to 30 cm (varies with object)
    · Fast response time
    · Small size and low cost
    · Works best on reflective surfaces
    · Great for obstacle avoidance and line following

    Column 2 — title bar (teal blue #1389A6): title "HC-SR04 Ultrasonic", subtitle "Ping (echo-timing) distance". Illustration: a blue HC-SR04 board with two silver ultrasonic transducer cylinders labeled "T" and "R".
    PINOUT (4 pins):
    1. VCC — 5 V
    2. TRIG — Trigger Input
    3. ECHO — Echo Output
    4. GND — Ground
    DESCRIPTION: Sends a 40 kHz ultrasonic burst and times how long until the echo returns. Distance is calculated from the round-trip time.
    FEATURES:
    · Operating voltage: 5 V
    · Measuring range: 2 cm to ~400 cm
    · Accuracy: ±3 mm
    · Trigger input: minimum 10 µs HIGH pulse
    · Echo output: HIGH pulse, ~58 µs per cm
    · Beam angle: < 15°
    · Inexpensive and easy to use
    · Ideal for robotics, level sensing, and parking sensors

    Column 3 — title bar (deep purple #6A3FB5): title "VL53L0X Laser ToF", subtitle "I2C time-of-flight ranging". Illustration: a small purple VL53L0X breakout board labeled "VL53L0X" with a tiny laser sensor and labeled header pins.
    PINOUT (I2C board, 6 pins):
    1. VCC — 2.6 V to 5.5 V
    2. GND — Ground
    3. SCL — I2C Clock
    4. SDA — I2C Data
    5. XSHUT — Shutdown / Reset
    6. GPIO1 — Interrupt Output
    DESCRIPTION: Uses ST's VL53L0X time-of-flight sensor to measure how long a laser pulse takes to reflect back. High precision with excellent ambient-light immunity.
    FEATURES:
    · Operating voltage: 2.6 V to 5.5 V (1.8 V I/O compatible)
    · Measuring range: 3 to 120 cm default (up to 200 cm in long-range mode)
    · Accuracy: ±3% (best case; degrades with distance and ambient light)
    · I2C interface (up to 400 kHz)
    · Fast reading: up to 50 Hz (maximum update rate)
    · Field of view: ~25° cone
    · Low power consumption
    · Best for precision distance measurement

    Footer bar (full width, below the three columns): a lightbulb icon then "TIPS: The IR sensor gives simple presence detection, not precise distance. The HC-SR04 is great for general-purpose and longer-range sensing. The VL53L0X gives high accuracy in a compact I2C package. All three work great with MicroPython on the Raspberry Pi Pico."

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, monospace for pin labels, numbers bold. Footer source line: "Sources: STMicroelectronics VL53L0X datasheet · HC-SR04 ultrasonic module datasheet · generic FC-51-style IR reflective sensor datasheet." Overall: tidy vector flat-design infographic poster, three equal-width columns with module illustrations, suitable for a textbook or classroom screen.
