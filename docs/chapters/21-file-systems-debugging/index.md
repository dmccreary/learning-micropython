---
title: File Systems, Audio Files, and Debugging
description: Pico file system with open(), uos, SD card via SPI, WAV audio playback over I2S, systematic debugging strategies, traceback reading, Thonny's heap viewer, and common wiring errors.
generated_by: claude skill chapter-content-generator
date: 2026-06-13 01:00:00
version: 0.09
---

# File Systems, Audio Files, and Debugging

## Summary

This chapter covers two essential skills for serious MicroPython projects: working with files and debugging problems systematically. You will learn to read and write files on the Pico's built-in flash filesystem using Python's `open()` function, manage directories with the `uos` module, and extend storage with an SPI-connected SD card. The chapter also covers playing WAV audio files from storage over I2S — a technique used in the spectrum analyzer and other audio projects. The debugging section teaches a step-by-step troubleshooting strategy, how to read error messages and tracebacks, and how to use Thonny's stack and heap viewers to diagnose both software and hardware problems.

## Concepts Covered

This chapter covers the following 26 concepts from the learning graph:

1. MicroPython File System
2. open() Function
3. File Read and Write
4. os.listdir() Method
5. os.mkdir() Method
6. os.remove() Method
7. SD Card Reader
8. SPI SD Card Interface
9. uos Module
10. Persistent Storage
11. WAV Audio File
12. MP3 to WAV Conversion
13. Audio Playback
14. I2S Audio Output
15. Debugging Strategy
16. Print Debugging
17. Error Message Reading
18. Traceback Interpretation
19. I2C Debugging
20. SPI Debugging
21. Debugging with Thonny
22. Stack Trace Viewer
23. Heap Viewer
24. Minicom Serial Monitor
25. Logic Probe
26. Common Wiring Errors

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: MicroPython Environment and Development Tools](../03-micropython-environment/index.md)
- [Chapter 8: Communication Protocols: I2C, SPI, and UART](../08-communication-protocols/index.md)
- [Chapter 18: Sound, Music, and Audio Generation](../18-sound-music-audio/index.md)

---

!!! mascot-welcome "Welcome to Chapter 21"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every serious project stores and loads data. Every programmer hits bugs. This chapter arms you with both: a complete file system toolkit for the Pico and a systematic debugging strategy that will save you hours of frustration. By the end you will be reading logs, playing audio files, and diagnosing problems like a professional. Let's build the skills that make every other skill better!

## The MicroPython File System

The Raspberry Pi Pico has 2 MB of flash memory. Most of it stores your MicroPython programs. About 1.5 MB is available as a **MicroPython file system** — a FAT-formatted storage area where you can create, read, and write files from Python.

**Persistent storage** means data that survives a power cycle. Variables in RAM are cleared when the Pico resets; files on the flash file system remain until you delete them. This is essential for logging sensor data, storing configuration, and caching downloaded content.

### open() — Reading and Writing Files

Python's standard **`open()` function** works in MicroPython just as it does on a desktop computer:

```python
# Writing a file
with open("log.txt", "w") as f:   # "w" = write (creates or overwrites)
    f.write("Temp: 23.5 C\n")
    f.write("Humidity: 64%\n")

# Appending to an existing file
with open("log.txt", "a") as f:   # "a" = append (adds to end)
    f.write("Temp: 24.1 C\n")

# Reading a file
with open("log.txt", "r") as f:   # "r" = read
    content = f.read()
    print(content)

# Reading line by line
with open("log.txt", "r") as f:
    for line in f:
        print(line.strip())
```

For binary files (images, audio, raw data), use `"rb"` (read binary) or `"wb"` (write binary).

### The uos Module — Directory Operations

The **`uos` module** manages directories and file listings. The three most useful methods are:

```python
import uos

# List files in the root directory
print(uos.listdir("/"))        # e.g., ['boot.py', 'main.py', 'log.txt']

# Create a directory
uos.mkdir("/data")             # creates a /data folder

# Remove a file
uos.remove("/data/old.txt")    # deletes the file permanently

# Remove a directory (must be empty first)
uos.rmdir("/data")
```

## Extending Storage with an SD Card

The Pico's 2 MB flash fills quickly with audio samples or sensor logs. A **microSD card** provides gigabytes of additional storage. Connect it over SPI:

```
SD card CS   → Pico GP5
SD card MOSI → Pico GP3 (SPI0 MOSI)
SD card MISO → Pico GP4 (SPI0 MISO)
SD card SCK  → Pico GP2 (SPI0 SCK)
SD card VCC  → Pico 3V3
SD card GND  → Pico GND
```

The **SPI SD card interface** requires a driver. Copy `sdcard.py` from `src/drivers/` to your Pico, then mount the SD card:

```python
from machine import SPI, Pin
import sdcard, uos

spi = SPI(0, sck=Pin(2), mosi=Pin(3), miso=Pin(4))
sd  = sdcard.SDCard(spi, Pin(5))
vfs = uos.VfsFat(sd)
uos.mount(vfs, "/sd")                  # mount at /sd

# Now access SD card files with /sd/ prefix
with open("/sd/data.csv", "w") as f:
    f.write("time,temp,humid\n")

print(uos.listdir("/sd"))
```

## WAV Audio Files and Playback

A **WAV audio file** (Waveform Audio File Format) is the simplest audio format for microcontrollers — it contains raw PCM audio samples with a 44-byte header. No decoding is needed; you read the bytes and stream them to I2S.

**MP3 to WAV conversion** is how you prepare audio for the Pico. MP3 files are compressed and require a decoder chip or significant CPU power. WAV files are uncompressed and can stream directly from flash or SD card to the I2S bus.

To convert: use Audacity (free) or a command-line tool:
```bash
ffmpeg -i input.mp3 -ar 22050 -ac 1 -acodec pcm_s16le output.wav
```
Options: `-ar 22050` = 22,050 Hz sample rate; `-ac 1` = mono; `-acodec pcm_s16le` = 16-bit signed.

### I2S Audio Output — Playing a WAV File

Connect an I2S DAC (MAX98357A or PCM5102A) as described in Chapter 18, then stream the WAV file:

```python
from machine import I2S, Pin
import utime

audio = I2S(0, sck=Pin(10), ws=Pin(11), sd=Pin(9),
            mode=I2S.TX, bits=16, format=I2S.MONO,
            rate=22050, ibuf=5000)

BUF_SIZE = 1024
buf = bytearray(BUF_SIZE)

with open("/sd/sound.wav", "rb") as wav:
    wav.seek(44)                     # skip WAV header
    while True:
        n = wav.readinto(buf)        # fill buffer from file
        if n == 0:
            break                    # end of file
        audio.write(buf[:n])         # stream to I2S DAC
```

**Audio playback** at 22,050 Hz mono uses about 44 KB/s — a 10-second clip fits in about 440 KB, well within a 2 GB SD card.

## Debugging Strategy — Finding Bugs Systematically

Even experienced programmers spend significant time debugging. The key is a **systematic approach** rather than random changes.

Here is a five-step debugging strategy:

1. **Reproduce the bug** — can you make it happen reliably? A bug you cannot reproduce is hard to fix.
2. **Isolate the cause** — narrow down which component or which line is responsible. Comment out sections.
3. **Hypothesize** — what specific thing do you think is wrong?
4. **Test the hypothesis** — change only one thing at a time and observe the result.
5. **Fix and verify** — make the fix, test again, and confirm the bug is gone.

### Print Debugging — The First Tool

**Print debugging** is the simplest technique: insert `print()` statements to show the value of variables at key points.

```python
def read_sensor():
    raw = adc.read_u16()
    print(f"DEBUG: raw ADC = {raw}")      # add this line temporarily
    temp = (raw / 65535) * 3.3 * 100 - 273.15
    print(f"DEBUG: temp = {temp:.2f}")    # and this one
    return temp
```

Delete or comment out debug prints before finishing your project.

### Reading Error Messages and Tracebacks

When your program crashes, MicroPython displays a **traceback** — a trail showing which functions were active when the error occurred. Read tracebacks from the bottom up: the last line is the actual error; the lines above show the call chain.

```
Traceback (most recent call last):
  File "main.py", line 45, in <module>
  File "main.py", line 23, in read_temperature
  File "main.py", line 12, in setup_sensor
AttributeError: 'NoneType' object has no attribute 'read'
```

Reading this: line 12 (`setup_sensor`) called something that returned `None`, and line 23 then tried to call `.read()` on that `None`. The fix: `setup_sensor` should check its return value before passing it to `read_temperature`.

### I2C Debugging

The most common I2C problems and their solutions:

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `i2c.scan()` returns empty list | Wrong pins, no pull-ups, power issue | Check wiring; verify 3.3V on sensor VCC |
| Wrong data from sensor | Wrong address, wrong register | Verify address with scanner; check datasheet |
| OSError: [Errno 5] EIO | Communication failure | Check pull-up resistors (4.7 kΩ); try lower freq |

**SPI Debugging** — if a SPI device does not respond, verify: CS is pulled HIGH at startup, MOSI and MISO are not swapped, clock polarity (CPOL) and phase (CPHA) match the device datasheet.

### Debugging with Thonny

Thonny provides two useful debug views:

- **Stack Trace Viewer** — shows the function call stack at the point of an error. Open from View → Stack.
- **Heap Viewer** — shows how much heap memory is allocated vs. free. Watch this for memory leak detection in long-running programs. Open from View → Heap.

### Minicom Serial Monitor

**Minicom** is a terminal program that connects to the Pico's serial port from a Linux/Mac command line:

```bash
minicom -D /dev/tty.usbmodem0001 -b 115200
```

Use it when Thonny is not connected — it shows all `print()` output in real time.

### Logic Probe

A **logic probe** (or logic analyzer) is a debugging tool that visualizes digital signals on multiple pins at once. Connect it to your I2C, SPI, or UART pins and see the actual waveforms in software. Popular choices are the Saleae Logic or a cheap clone. Essential when you suspect a timing issue or a corrupted signal.

### Common Wiring Errors

These mistakes account for the majority of beginner hardware bugs:

| Error | Symptom | Fix |
|-------|---------|-----|
| SDA and SCL swapped | Device not found on I2C scan | Swap the two wires |
| Sensor powered from 5V, not 3.3V | Device damaged or noisy | Use 3.3V output only |
| No shared GND between Pico and sensor | Erratic readings or no response | Add a GND wire |
| Missing pull-up resistors | I2C scan returns nothing | Add 4.7 kΩ to SDA and SCL |
| Button without pull-up/pull-down | Floating input, random triggers | Add `Pin.PULL_UP` in code |

!!! mascot-tip "Monty's Debugging Golden Rule"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Change **one thing at a time** when debugging hardware. If you swap two wires and update the code in the same step, you cannot know which change fixed the problem. Fix hardware first, verify the device appears in `i2c.scan()`, then fix the code. One variable at a time.

## Key Takeaways

- The Pico's flash includes a **FAT filesystem** accessible with `open()`, `uos.listdir()`, `uos.mkdir()`, and `uos.remove()`.
- Files written to flash are **persistent** — they survive power cycles until you delete them.
- An SPI **SD card** extends storage; mount it with `uos.VfsFat(sd)` and access via `/sd/` prefix.
- **WAV files** (uncompressed PCM) can be streamed directly to I2S with no decoding needed.
- Convert MP3 to WAV with Audacity or `ffmpeg` before copying to the Pico.
- **Print debugging** is the fastest first tool; use `ticks_ms()` for timing measurements.
- Read tracebacks **bottom-up**: the last line is the actual error; upper lines show the call chain.
- Most I2C failures are caused by wrong pins, missing pull-ups, or wrong address.
- Change only **one thing at a time** when debugging hardware.

??? question "Quick Check: Why read a WAV file's bytes starting at offset 44 instead of offset 0? (Click to reveal)"
    Bytes 0–43 are the **WAV header** — metadata describing sample rate, bit depth, and channel count. The actual audio data starts at byte 44. Reading from byte 0 would feed the header bytes to the DAC as audio, producing noise or silence for the first 44-byte burst.

!!! mascot-celebration "Debugging Skills Unlocked!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    File systems, audio playback, and a complete debugging toolkit — you now have the skills to build and fix serious projects. Chapter 22 ventures into the most advanced Pico features: PIO state machines, AI-assisted coding, and the tools that push the hardware to its absolute limits. Almost at the finish line!
