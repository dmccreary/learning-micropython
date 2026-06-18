---
title: Python vs. MicroPython
description: An interactive side-by-side comparison of Python 3 and MicroPython — platform, RAM, libraries, package managers, storage, hardware access, startup time, and uses — with a built-in quiz.
image: /posters/python-vs-micropython/python-vs-micropython-infographic.png
og:image: /posters/python-vs-micropython/python-vs-micropython-infographic.png
twitter:image: /posters/python-vs-micropython/python-vs-micropython-infographic.png
social:
   cards: false
hide:
    toc
---

Audience: students transitioning from desktop Python to embedded MicroPython.
Chapter: 1 — Python Basics / Chapter 3 — MicroPython Environment

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Side-by-side comparison of Python 3 (desktop) and MicroPython (microcontrollers) across eight key attributes: platform, RAM, standard library, package manager, file storage, hardware access, startup time, and typical uses. Click each column to explore; use Quiz Me to test your understanding.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly — do not invent content to fill it.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Python vs. MicroPython", subtitle beneath: "Same language — different worlds."

    Layout: two main columns on a light off-white background (#F7F9FC), separated by a thin vertical divider. Left column accent: deep cobalt blue #1E4DB7. Right column accent: teal blue #1389A6. Each column has a rounded-corner header card. A vertical row-label strip on the far left lists the eight comparison attributes. Generous white space, thin divider lines, friendly textbook feel.

    Left column (deep cobalt blue #1E4DB7): Header "Python 3"; small icon: classic computer monitor. Rows:
    · Platform: Desktop & server computers (Windows, macOS, Linux)
    · Minimum RAM: ~50 MB (interpreter alone)
    · Standard library: Full — json, re, socket, os, math, random, threading, and thousands more
    · Package manager: pip — over 500,000 packages on PyPI
    · File storage: OS file system (HDD, SSD, NVMe)
    · Hardware access: Via third-party libraries (RPi.GPIO, pyserial)
    · Startup time: 50–200 ms
    · Typical uses: Web servers, data science, automation scripts, desktop apps

    Right column (teal blue #1389A6): Header "MicroPython 1.x"; small icon: Raspberry Pi Pico board top-view. Rows:
    · Platform: Microcontrollers — RP2040, RP2350, ESP32, STM32
    · Minimum RAM: ~32 KB (runs in 256 KB–520 KB on typical boards)
    · Standard library: Subset — ujson, ure, uos, math (micropython-lib; no threading)
    · Package manager: mip (small curated set) or manual file copy to board
    · File storage: Flash file system (LittleFS or FAT, typically 2–16 MB)
    · Hardware access: Built-in machine module — Pin, I2C, SPI, ADC, PWM, UART
    · Startup time: < 1 ms (instant boot)
    · Typical uses: Sensors, motors, displays, wireless IoT, robotics

    Row labels down the left strip (bold dark slate #2A2E3A), each with a small monochrome line icon: Platform (computer chip), Minimum RAM (memory bar), Standard library (books), Package manager (box with arrow), File storage (folder), Hardware access (circuit board), Startup time (clock), Typical uses (lightbulb).

    At the bottom, a two-cell note row spanning both columns: "Key rule: if it fits in a micropython import, it works on both platforms. If it needs more than ~200 KB of RAM or a full OS, use Python 3 on a computer."

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold headers, numbers slightly larger and bold so specs pop, high contrast, fully legible. Footer bar: "Sources: MicroPython 1.x documentation (micropython.org) · Python 3 documentation (docs.python.org)." Overall: tidy vector flat-design infographic poster, balanced two-column grid, lots of breathing room, no photographic clutter, suitable for a textbook or classroom screen.
