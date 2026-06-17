# Serial Protocols: I2C vs. SPI vs. UART

Audience: students choosing a communication protocol for sensors and peripherals.
Chapter: 8 — Communication Protocols

![](../chapters/08-communication-protocols/communication-protocols-infographic.png)

![](../chapters/08-communication-protocols/specialized-communication-protocols-infographic.png)

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "No" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Serial Protocols Compared", subtitle beneath: "I2C · SPI · UART — connecting microcontrollers to the world."

    Layout: a three-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge. A vertical row-label strip on the far left lists the ten attributes. A small wiring-diagram icon above each column header shows the wire connections. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (teal blue #1389A6): Header "I2C"; sub-header "Inter-Integrated Circuit"; wiring icon: two lines labeled SDA (data) and SCL (clock) connecting to three small device blocks in a chain. Rows:
    · Signal wires: 2 — SDA (data) + SCL (clock); share GND and power
    · Multi-device on one bus: Yes — up to 127 devices (7-bit addressing)
    · Addressing: Each device has a unique 7-bit address (e.g., 0x3C, 0x68)
    · Speed: 100 kbps (standard) · 400 kbps (fast) · 1 Mbps (fast+)
    · Full-duplex: No — half-duplex (one direction at a time)
    · Typical cable distance: < 1 m (short runs only)
    · Complexity: Medium — need to know device addresses
    · MicroPython: I2C(id, scl=Pin(x), sda=Pin(y), freq=400_000)
    · Typical devices: OLED displays (SSD1306), BMP280, MPU-6050, DS3231 RTC
    · Best for: Multiple slow sensors on a two-wire bus

    Column 2 (deep purple #6A3FB5): Header "SPI"; sub-header "Serial Peripheral Interface"; wiring icon: four lines labeled MOSI, MISO, SCK, CS connecting controller to one device block; second device shown with its own CS line. Rows:
    · Signal wires: 4 — MOSI, MISO, SCK, CS (+ 1 extra CS wire per additional device)
    · Multi-device on one bus: Yes — one CS (chip-select) line per device
    · Addressing: No addresses — CS pin selects device
    · Speed: Up to 62.5 MHz on RP2040 (full-duplex)
    · Full-duplex: Yes — send and receive simultaneously
    · Typical cable distance: < 1 m (short runs only)
    · Complexity: Simple protocol, but more wires
    · MicroPython: SPI(id, baudrate=1_000_000, sck=Pin(x), mosi=Pin(y), miso=Pin(z))
    · Typical devices: SD cards, ILI9341 TFT displays, MAX7219 LED matrices
    · Best for: High-speed displays and storage; one or two devices

    Column 3 (forest green #2D8A4E): Header "UART"; sub-header "Universal Async Receiver-Transmitter"; wiring icon: two crossed lines TX↔RX connecting two device blocks. Rows:
    · Signal wires: 2 — TX (transmit) + RX (receive); cross-connect TX→RX each side; share GND
    · Multi-device on one bus: No — point-to-point only (no addressing)
    · Addressing: None — each pair is a direct link
    · Speed: 9,600 · 115,200 · 921,600 baud (must match both ends)
    · Full-duplex: Yes — TX and RX are independent lines
    · Typical cable distance: Up to 15 m at 9,600 baud (RS-232 standard)
    · Complexity: Simple — just agree on baud rate, 8N1 format
    · MicroPython: UART(id, baudrate=9600, tx=Pin(x), rx=Pin(y))
    · Typical devices: GPS modules, HC-05 Bluetooth, serial debug console
    · Best for: Long-distance point-to-point; simple ASCII data streams

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, monospace for MicroPython snippets, numbers bold so speeds pop, high contrast. Footer bar: "Sources: RP2040 Datasheet (I2C §4.3, SPI §4.4, UART §4.2) — Raspberry Pi Ltd, 2021." Overall: tidy vector flat-design infographic poster, balanced three-column grid, wiring-diagram icons reinforce the wire count per protocol, suitable for a textbook or classroom screen.
