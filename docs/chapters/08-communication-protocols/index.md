---
title: Communication Protocols — I2C, SPI, and UART
description: I2C two-wire bus, SPI four-wire bus, UART serial, 1-Wire, and I2S audio protocols — MicroPython classes, addresses, scanning, and bus frequency settings.
generated_by: claude skill chapter-content-generator
date: 2026-06-12 22:50:00
version: 0.09
---

# Communication Protocols: I2C, SPI, and UART

## Summary

Modern sensors and displays rarely connect through a single wire — they use standard communication protocols that let many devices share just a few wires. This chapter introduces the most common protocols you will encounter: I2C (two wires, up to 127 devices), SPI (four wires, very fast), UART (serial communication), 1-Wire (temperature sensors), and I2S (digital audio). You will learn to use MicroPython's `machine.I2C`, `machine.SPI`, `machine.UART`, and `machine.I2S` classes, and you will use an I2C scanner to discover which devices are connected to your bus — a skill that will save you hours of debugging.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. I2C Protocol
2. I2C Bus SDA and SCL
3. I2C Address
4. I2C Scanner
5. machine.I2C Class
6. I2C.scan() Method
7. I2C.writeto() Method
8. I2C.readfrom() Method
9. SPI Protocol
10. SPI Bus Pins (MOSI MISO SCK CS)
11. machine.SPI Class
12. SPI.write() Method
13. SPI.read() Method
14. UART Protocol
15. machine.UART Class
16. 1-Wire Protocol
17. I2S Protocol
18. machine.I2S Class
19. Bus Frequency Setting

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Microcontrollers and Hardware Platforms](../04-microcontrollers-hardware/index.md)

---

!!! mascot-welcome "Welcome to Chapter 8"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Time to learn how your Pico talks to other chips! I2C, SPI, and UART are the languages of electronics. Once you know these three protocols, you can connect hundreds of different sensors, displays, and modules to your Pico. Let's build the vocabulary!

## Why Communication Protocols?

Sensors, displays, and peripheral chips generate data as electrical signals. To transfer that data to a microcontroller reliably, both sides must agree on a set of rules: which wire carries data, which carries timing, how fast data travels, and how to signal the start and end of a message. These rules are a **communication protocol**.

Instead of a different wiring scheme for every sensor, a small number of standard protocols cover almost every device you will connect. The Pico supports four: **I2C**, **SPI**, **UART**, and **1-Wire**, plus **I2S** for audio.

## I2C — Two Wires, Many Devices

**I2C** (pronounced "I-squared-C", short for Inter-Integrated Circuit) is the most common protocol for connecting sensors and displays to a microcontroller. It uses exactly two wires:

- **SDA** (Serial Data) — carries the data bits.
- **SCL** (Serial Clock) — carries the timing signal that keeps both sides in sync.

The **I2C bus** is the pair of SDA and SCL wires that can carry traffic for many devices at once. Every device on the bus has a unique **I2C address** — a 7-bit number (0 to 127) that acts like a street address. The Pico calls out one address, and only the device with that address responds. Up to 127 different devices can share the same two wires.

On the Pico, the default I2C pins are:
- I2C bus 0: SDA = GP0, SCL = GP1
- I2C bus 1: SDA = GP2, SCL = GP3 (or other pin pairs — check the pinout)

### The machine.I2C Class

Create an I2C object by specifying the bus ID and pin numbers:

```python
from machine import I2C, Pin

# Create I2C bus 0 at 400 kHz (fast mode)
i2c = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)
```

The `freq` argument sets the **bus frequency** — how fast bits are sent. Standard I2C is 100 kHz; fast mode is 400 kHz. Most sensors support 400 kHz. Some slow sensors need 100 kHz.

### I2C.scan() — The I2C Scanner

Before you can use a device, you need to know its address. The **`I2C.scan()` method** sends a probe to every possible address and returns a list of addresses that responded.

```python
devices = i2c.scan()
print("I2C devices found:", [hex(d) for d in devices])
# Example output: I2C devices found: ['0x3c', '0x76']
```

Running the scanner is always the first step when connecting a new I2C device. A common address for OLED displays is `0x3C`. The BME280 temperature sensor is typically `0x76`.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Run the I2C scanner whenever a sensor does not respond. Wrong address is one of the top three causes of I2C failures. The other two are: wrong pin assignment (SDA and SCL swapped) and missing pull-up resistors (I2C lines need 4.7 kΩ pull-ups to 3.3 V; many breakout boards include them).

### I2C.writeto() and I2C.readfrom()

The two fundamental I2C operations are:

- **`I2C.writeto(address, data)`** — sends bytes to a device.
- **`I2C.readfrom(address, count)`** — reads a specified number of bytes from a device.

```python
# Write one byte (command 0x01) to device at address 0x3C
i2c.writeto(0x3C, bytes([0x01]))

# Read 2 bytes from device at address 0x76
data = i2c.readfrom(0x76, 2)
print(data)   # e.g., b'\x65\x40'
```

In practice you rarely call these directly — driver libraries (like `ssd1306.py`) wrap them for you.

## SPI — Four Wires, Maximum Speed

**SPI** (Serial Peripheral Interface) is faster than I2C but requires more wires. It is common for displays and SD card modules that need high data throughput. SPI uses four wires:

- **MOSI** (Master Out Slave In) — data from Pico to the device.
- **MISO** (Master In Slave Out) — data from the device to the Pico.
- **SCK** (Serial Clock) — timing signal.
- **CS** (Chip Select, sometimes called SS) — one wire per device; pulled LOW to select that device.

Because CS wires are separate per device, SPI does not use addresses. You select a device by pulling its CS line LOW before sending data.

### The machine.SPI Class

```python
from machine import SPI, Pin

# SPI bus 0 at 10 MHz
spi = SPI(0, baudrate=10_000_000, polarity=0, phase=0,
          sck=Pin(2), mosi=Pin(3), miso=Pin(4))

cs = Pin(5, Pin.OUT)
cs.value(1)   # deselect all devices at start

# Send and receive data
cs.value(0)               # select device
spi.write(bytes([0xAB]))  # send command
data = spi.read(2)        # read 2 bytes response
cs.value(1)               # deselect device
```

## UART — Serial Communication

**UART** (Universal Asynchronous Receiver/Transmitter) is the oldest and simplest protocol. It uses just two wires — **TX** (transmit) and **RX** (receive) — and is used for GPS modules, Bluetooth adapters, and the USB-serial connection from your Pico to Thonny.

UART is **asynchronous** — there is no shared clock wire. Both sides must agree on the same **baud rate** (speed in bits per second) in advance.

```python
from machine import UART

uart = machine.UART(1, baudrate=9600, tx=Pin(4), rx=Pin(5))

uart.write("Hello from Pico!\n")   # send a string
if uart.any():
    data = uart.read(10)           # read up to 10 bytes if available
    print(data)
```

Common baud rates: 9600, 115200. GPS modules typically use 9600; Bluetooth adapters often use 115200.

## 1-Wire — One Wire for Temperature Sensors

The **1-Wire protocol** is unusual: it carries both data and power on a single wire (plus GND). It is almost exclusively used for the **DS18B20** waterproof temperature sensor, which is common in robotics and weather projects.

MicroPython includes a `onewire` module and a `ds18x20` module for these sensors. You will use 1-Wire in Chapter 9.

## I2S — Digital Audio

**I2S** (Inter-IC Sound) is a protocol for transferring digital audio data between chips. It is used to connect the Pico to digital microphones (MEMS mics) and audio DACs (digital-to-analog converters) for playing WAV files.

```python
from machine import I2S, Pin

audio_out = I2S(0,
    sck=Pin(10), ws=Pin(11), sd=Pin(9),
    mode=I2S.TX, bits=16, format=I2S.MONO,
    rate=22050, ibuf=20000)
```

You will use I2S in Chapter 18 (Sound and Audio).

#### Diagram: Protocol Comparison Explorer

<iframe src="../../sims/protocol-comparison/main.html" width="100%" height="420px" scrolling="no"></iframe>

<details markdown="1">
<summary>Communication Protocol Comparison MicroSim</summary>
Type: diagram
**sim-id:** protocol-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: compare
Learning Objective: Students can select the appropriate protocol (I2C, SPI, UART, 1-Wire) for a given sensor or peripheral based on its wire count, speed, and use case.

Canvas layout:
- Top: protocol selector tabs: I2C | SPI | UART | 1-Wire | I2S
- Center: animated waveform showing the selected protocol's bus signals
- Bottom: summary panel: wire count, typical speed, max devices, best for

Visual elements:
- I2C: two waveforms (SDA, SCL); address byte highlighted in purple; data bytes in blue
- SPI: four waveforms (SCK, MOSI, MISO, CS); CS pulse visible
- UART: two waveforms (TX, RX); start/stop bits highlighted
- 1-Wire: single waveform with presence pulse animation

Interactive controls:
- Tab buttons to switch protocol
- A "Send data" button triggers a one-shot waveform animation
- Bottom panel updates automatically with: Wires, Speed, Addressing, Best use

Instructional Rationale: Side-by-side animated waveforms with a clear summary panel give students a mental model to match protocols to real devices before they wire anything.

Implementation: p5.js. Each protocol stored as an array of timed state changes; draw() animates the waveform; createButton() for tab switching.
</details>

## Choosing the Right Protocol

Before the summary table, here is how to reason about protocol selection:

- If the device has two wires labeled SDA and SCL — use **I2C**. Check the address in the datasheet.
- If the device has MOSI, MISO, SCK, and CS — use **SPI**. It will be faster than I2C.
- If the device has TX and RX — use **UART**. Match the baud rate exactly.
- If the device has a single data wire and is a temperature sensor — use **1-Wire**.
- If the device sends or receives PCM audio — use **I2S**.

| Protocol | Wires | Speed | Devices | Common Uses |
|----------|-------|-------|---------|------------|
| I2C | 2 (SDA, SCL) | 100–400 kHz | Up to 127 | OLED, sensors, RTCs |
| SPI | 4 (MOSI, MISO, SCK, CS) | 1–80 MHz | 1 per CS | Displays, SD cards, ADCs |
| UART | 2 (TX, RX) | 1,200–115,200 baud | 1:1 only | GPS, Bluetooth, debug |
| 1-Wire | 1 + GND | ~16 kbps | Many | DS18B20 temperature |
| I2S | 3 (SCK, WS, SD) | Audio rates | 1 | Microphones, DACs |

!!! mascot-thinking "I2C or SPI: Which Should I Choose?"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Choose **I2C** when you want simplicity and you have multiple sensors (they share two wires). Choose **SPI** when you need speed — especially for displays that must update quickly. Many devices (like the BME280 sensor) support both; the breakout board determines which connector you use.

## Key Takeaways

- **I2C** uses SDA + SCL (2 wires) with unique device addresses; up to 127 devices per bus.
- `I2C.scan()` lists all responding addresses — run it first when connecting any new I2C device.
- **SPI** uses MOSI + MISO + SCK + CS (4 wires); faster than I2C; one CS per device.
- **UART** uses TX + RX (2 wires); match baud rates exactly; point-to-point only.
- **1-Wire** uses one data wire; specialized for temperature sensors like DS18B20.
- **I2S** carries digital audio; used for microphones and audio playback chips.
- **Bus frequency** controls speed; I2C runs at 100–400 kHz; SPI can reach MHz speeds.

??? question "Quick Check: Which I2C method discovers all connected device addresses? (Click to reveal)"
    **`i2c.scan()`** — it probes all 127 possible addresses and returns a list of the ones that acknowledge.

!!! mascot-celebration "You Speak the Language of Electronics!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    I2C, SPI, and UART are the three handshakes that unlock almost every sensor and display on the market. In Chapter 9 you will use these protocols for real — reading temperature, humidity, and distance from physical sensors. The world is about to tell your Pico many interesting things!
