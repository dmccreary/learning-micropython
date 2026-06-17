---
title: Wireless Technologies Compared
description: An interactive comparison of WiFi, Bluetooth BLE, LoRa, and Zigbee for MicroPython IoT — range, speed, power use, and topology — with a built-in quiz.
image: /posters/wireless-technologies/wireless-types-infographics.png
og:image: /posters/wireless-technologies/wireless-types-infographics.png
twitter:image: /posters/wireless-technologies/wireless-types-infographics.png
social:
   cards: false
hide:
    toc
---
# Wireless Technologies Compared

Audience: students building connected IoT projects with MicroPython.
Chapter: 19 — Wireless & IoT

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Compares the four wireless links you will meet in MicroPython IoT projects: WiFi (high-speed internet), Bluetooth BLE (low-power phone link), LoRa (kilometre range), and Zigbee (smart-home mesh). Click each column to compare range, speed, and power, then use Quiz Me to test which technology fits a given scenario.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Wireless Technologies Compared", subtitle beneath: "WiFi · Bluetooth BLE · LoRa · Zigbee — choosing the right wireless link."

    Layout: a four-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a simple wireless-symbol illustration at the top. A vertical row-label strip on the far left lists the nine attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (teal blue #1389A6): Header "WiFi 802.11 b/g/n"; Illustration: standard WiFi fan-arc symbol in teal with radio-wave arcs. Rows:
    · Frequency: 2.4 GHz (all three standards); also 5 GHz (802.11 n, not on Pico W)
    · Typical range: 30–50 m indoors; up to 100 m outdoors (open area)
    · Data speed: Up to 150 Mbps (802.11n); real throughput 5–20 Mbps typical
    · Power use: Medium–high — ~250 mA peak during transmit
    · Topology: Star — all devices connect to a WiFi access point (router)
    · Protocol stack: TCP/IP; HTTP, HTTPS, MQTT, WebSocket
    · MicroPython boards: Raspberry Pi Pico W (CYW43439); ESP32 (built-in)
    · Typical cost: Built into Pico W ($6) or ESP32 ($6–$10)
    · Best for: Web servers, REST APIs, streaming data, cloud IoT with MQTT

    Column 2 (deep purple #6A3FB5): Header "Bluetooth Low Energy (BLE) 5.x"; Illustration: Bluetooth "B" logo with angular lines in purple. Rows:
    · Frequency: 2.4 GHz (40 channels, 2 MHz spacing)
    · Typical range: Up to 40 m (BLE 5.0 standard); up to 400 m (BLE 5 long-range mode)
    · Data speed: 2 Mbps (BLE 5.0); 1 Mbps (BLE 4.2)
    · Power use: Very low — ~15–20 mA TX; ~3 µA in sleep (BLE advertising mode ~0.1 mA avg)
    · Topology: Piconet — one central connects to up to 7 peripheral devices; also mesh (BLE 5)
    · Protocol stack: GATT profiles; iBeacon; BLE mesh
    · MicroPython boards: Pico W (CYW43439 BT 5.2); ESP32 (BT 4.2)
    · Typical cost: Built into Pico W ($6) or ESP32 ($6–$10)
    · Best for: Smartphone-to-device apps, wearables, beacons, low-power sensors

    Column 3 (forest green #2D8A4E): Header "LoRa (Long Range)"; Illustration: tower with expanding concentric range rings, labeled "km" to show long distance, in green. Rows:
    · Frequency: 915 MHz (United States); 868 MHz (Europe); 433 MHz (Asia)
    · Typical range: 2–5 km urban; 10–20 km rural line-of-sight
    · Data speed: 0.3–50 kbps (chirp spread spectrum — lower speed = longer range)
    · Power use: Very low — ~40 mA TX; ~1.4 mA RX; < 1 µA sleep
    · Topology: Star (LoRaWAN via gateway) or point-to-point (raw LoRa)
    · Protocol stack: LoRaWAN for cloud; raw LoRa for direct P2P links
    · MicroPython boards: Requires LoRa module — RFM95W, SX1276 (SPI breakout), or LilyGO T3
    · Typical cost: RFM95W module ~$5–$10; Pico + RFM95W breadboard setup ~$15–$20
    · Best for: Agriculture sensors, weather stations, outdoor/remote IoT, long-distance alarms

    Column 4 (warm orange #E07B39): Header "Zigbee 802.15.4"; Illustration: zigzag lightning-bolt style icon representing mesh networking, in orange. Rows:
    · Frequency: 2.4 GHz (global channel 11–26); 868/915 MHz regional channels
    · Typical range: 10–100 m per hop; mesh extends range to entire building
    · Data speed: 250 kbps (IEEE 802.15.4 physical layer)
    · Power use: Low — ~30 mA TX; ~1 mA RX; < 1 µA sleep (routers stay on; end devices sleep)
    · Topology: Mesh — devices relay messages for each other; self-healing network
    · Protocol stack: Zigbee Pro; Zigbee clusters; also used in Matter (Thread protocol)
    · MicroPython boards: Requires external Zigbee module — XBee, CC2530, or Zigbee USB coordinator
    · Typical cost: Zigbee module ~$10–$30; coordinator dongle ~$15–$25
    · Best for: Smart-home automation, industrial sensors, mesh networks, home assistant integration

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, numbers bold so range and speed specs pop. Footer bar: "Sources: IEEE 802.11 standard · Bluetooth SIG BLE 5.0 core spec · Semtech LoRa datasheet · Zigbee Alliance 802.15.4 spec — verified June 2026." Overall: tidy vector flat-design infographic poster, four-column grid with wireless icon illustrations, suitable for a textbook or classroom screen.
