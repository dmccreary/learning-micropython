---
title: I2C vs SPI Communication Protocols
description: An interactive side-by-side comparison of the I2C and SPI serial communication protocols covering wires, topology, speed, addressing, and best uses with a built-in quiz.
image: /posters/communication-protocols/communication-protocols-infographic.png
og:image: /posters/communication-protocols/communication-protocols-infographic.png
twitter:image: /posters/communication-protocols/communication-protocols-infographic.png
social:
   cards: false
hide:
    toc
---

Audience: students connecting sensors, displays, and modules to a microcontroller.
Chapter: 8 — Communication Protocols

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Side-by-side comparison of the two most common serial bus protocols you will use on a Pico: I2C (two wires, many devices, unique addresses) and SPI (four wires, full-duplex, very fast). Click each column to explore its wires, speed, and best uses, then use Quiz Me to test which protocol fits a given device.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "I2C vs SPI COMMUNICATION PROTOCOLS", with small clock/waveform line icons flanking the title.

    Layout: two main columns on a light off-white background, separated by a thin vertical divider. Left column accent: green header band. Right column accent: blue header band. Each column has a rounded-corner header card, a connection diagram, a key-features list, and a row of common physical connectors. A full-width footer spans both columns with a quick-comparison table and a "WHEN TO USE" note.

    Left column (green): Header "I2C (Inter-Integrated Circuit)"; subtitle "Two-wire serial bus with multi-master, multi-slave support." Sections:
    · I2C 4-wire standard wire table: VCC (Power), GND (Ground), SDA (Bidirectional, Serial Data Line), SCL (Unidirectional, Serial Clock Line)
    · Typical I2C connection diagram: I2C MASTER (MCU) with SDA and SCL pull-up resistors to VCC, connected to I2C SLAVE 1, SLAVE 2, SLAVE 3
    · I2C key features: Uses 2 signal wires (SDA, SCL); multi-master and multi-slave support; each slave has a unique 7-bit or 10-bit address; half-duplex communication; Standard Mode 100 kbps, Fast Mode 400 kbps, Fast Mode Plus 1 Mbps, High Speed Mode 3.4 Mbps; simple wiring, fewer pins; pull-up resistors required on SDA and SCL
    · Common physical connectors for I2C: Grove (4-pin), JST-PH (4-pin), Qwiic / STEMMA QT (4-pin)

    Right column (blue): Header "SPI (Serial Peripheral Interface)"; subtitle "High-speed, full-duplex serial communication for master-slave devices." Sections:
    · SPI wires (typical 4-wire) table: VCC (Power), GND (Ground), SCK (Clock), MOSI (Master Out, Slave In), MISO (Master In, Slave Out), CS / SS (Chip Select, Active Low)
    · Typical SPI connection diagram: SPI MASTER (MCU) with SCK, MOSI, MISO shared and a separate CS line to each of SLAVE 1, SLAVE 2, SLAVE 3
    · SPI key features: Uses 4 signal wires (SCK, MOSI, MISO, CS); single master, multiple slaves (each needs its own CS); full-duplex communication; very high speed, typically up to 10–50 MHz; no pull-up resistors required; more pins required on MCU; ideal for displays, SD cards, ADCs, fast high-speed devices
    · Common physical connectors for SPI: Grove (5/6-pin), JST-PH (6-pin), Dupont / Header (6-pin)

    Footer quick-comparison table (rows: When signals only, Topology, Speed typical, Addressing, Best for):
    · I2C: 2 (SDA, SCL) · Multi-master, multi-slave (shared bus) · 100 kbps – 3.4 Mbps · 7-bit or 10-bit per slave · Sensors, RTCs, EEPROMs, low to medium speed devices
    · SPI: 4 (SCK, MOSI, MISO, CS) · Single master, multiple slaves (separate CS) · Up to 10–50+ MHz · No address; CS per device · Displays, SD cards, ADCs, fast, high-speed devices

    "WHEN TO USE" note: Choose I2C when you need simple wiring and many devices on one bus. Choose SPI when you need high speed and maximum data throughput.

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, monospace for signal names, numbers bold. Overall: tidy vector flat-design infographic poster, balanced two-column grid with connection diagrams and connector illustrations, suitable for a textbook or classroom screen.
