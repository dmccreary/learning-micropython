---
title: Temperature Sensors
description: An interactive comparison of the DHT11, DHT22, BME280, and DS18B20 temperature sensors — pinouts, accuracy, and interfaces — with a built-in quiz.
image: /posters/temperature-sensors/temperature-sensors-infographic.png
og:image: /posters/temperature-sensors/temperature-sensors-infographic.png
twitter:image: /posters/temperature-sensors/temperature-sensors-infographic.png
social:
   cards: false
hide:
    toc
---
# Temperature Sensors

Audience: students measuring temperature and humidity in their MicroPython projects.
Chapter: 09 — Temperature & Distance Sensors

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

A three-column comparison of the temperature sensors used in this course — the
single-wire **DHT11/DHT22**, the I2C **BME280** (which also reads humidity and
pressure), and the waterproof 1-Wire **DS18B20** probe — with pinouts, key
specifications, and guidance on when to use each. Click each column to see its
facts, then use **Quiz Me** to test which sensor fits a given job.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic for "Temperature Sensor Comparison".

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Temperature Sensor Comparison", subtitle beneath: "Three ways to measure temperature with MicroPython on the Raspberry Pi Pico — DHT11/DHT22 · BME280 · DS18B20." Place a small line-art thermometer icon at the left and right ends of the title bar.

    Layout: EXACTLY THREE equal-width column cards on a light off-white background (#F7F9FC), arranged side by side. Each card occupies exactly one-third of the usable width, separated by a single uniform gutter, with equal left and right page margins. All three cards share the same top edge and the same bottom edge. Each card is a rounded-corner panel with a full-width colored title bar across its top; the title bar text is centered and spans the entire width of that card. Keeping the three columns equal in width and perfectly aligned is important — the column titles must line up across the top in a strict three-column grid. Within each card, stack four blocks top to bottom in the same order for all three columns: (1) a top-view illustration of the module, (2) a "PINOUT" block listing each pin as a small numbered colored circle followed by its name and role, (3) a "DESCRIPTION" block, (4) a "FEATURES" block with green check-mark bullets. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 — title bar (teal blue #1389A6): "DHT11 / DHT22", with a smaller line beneath inside the bar: "DHT22 = AM2302". Illustration: a light-blue DHT11 module and a white DHT22 module side by side on breakout pins, small labels "DHT11" and "DHT22".
    PINOUT (3 pins, both sensors):
    1. VCC — 3.3 V to 5 V
    2. DATA — Single-wire
    3. GND — Ground
    DESCRIPTION: Digital temperature and humidity sensors that use a single-wire protocol. Read them with MicroPython's built-in dht module. Wait at least 2 seconds between readings.
    FEATURES:
    · Measures temperature and humidity
    · DHT11: 0 to 50 °C, ±2 °C accuracy (typical)
    · DHT22: −40 to 80 °C, ±0.5 °C accuracy (typical)
    · 3.3 V to 5 V supply
    · Simple — only one data pin required
    · Not waterproof
    · Ideal for basic indoor projects

    Column 2 — title bar (forest green #2D8A4E): "BME280". Illustration: a small purple BME280 breakout board with a metal sensor can and labeled header pins.
    PINOUT (I2C, 6 pins):
    1. VIN — 1.8 V to 3.6 V
    2. GND — Ground
    3. SCL — I2C Clock
    4. SDA — I2C Data
    5. CSB — Chip Select (tie HIGH for I2C)
    6. SDO — I2C Address Select
    DESCRIPTION: An advanced environmental sensor that measures temperature, humidity, and air pressure over I2C. Copy the BME280 driver file to your Pico before use.
    FEATURES:
    · Measures temperature, humidity, and pressure
    · Temperature: −40 to 85 °C, ±1 °C accuracy (typical)
    · Humidity: 0 to 100 %RH, ±3% accuracy (typical)
    · Pressure: 300 to 1100 hPa, ±1 hPa accuracy (typical)
    · Low power consumption
    · 1.8 V to 3.6 V supply
    · I2C interface (up to 3.4 MHz)
    · Great for weather stations and advanced projects

    Column 3 — title bar (deep purple #6A3FB5): "DS18B20". Illustration: a stainless-steel cylindrical probe on a black cable, with a small breakout exposing three header pins.
    PINOUT (1-Wire, 3 pins):
    1. VDD — 3.0 V to 5.5 V
    2. DATA — 1-Wire Data
    3. GND — Ground
    DESCRIPTION: A digital temperature sensor that uses the 1-Wire protocol. The stainless-steel probe is waterproof. Read it with MicroPython's onewire and ds18x20 modules.
    FEATURES:
    · Measures temperature only
    · −55 to 125 °C, ±0.5 °C accuracy (typical)
    · Waterproof stainless-steel probe
    · 1-Wire interface — only one data wire required
    · Multiple sensors share one wire (each has a unique 64-bit address)
    · 3.0 V to 5.5 V supply
    · Perfect for outdoor, aquarium, and remote sensing

    Footer bar (full width, below the three columns): a lightbulb icon then "TIPS: Use DHT11/DHT22 for simple temperature and humidity. Use BME280 for full environmental monitoring (temperature, humidity, pressure). Use DS18B20 when you need waterproof sensing or many temperature points on one wire. All three work great with MicroPython on the Raspberry Pi Pico."

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, monospace for module names and pin labels, numbers bold. Footer source line: "Sources: Aosong DHT11 & DHT22/AM2302 datasheets · Bosch BME280 datasheet · Analog Devices/Maxim DS18B20 datasheet." Overall: tidy vector flat-design infographic poster, three equal-width columns with module illustrations, suitable for a textbook or classroom screen.
