# MicroPython Memory Types

Audience: students debugging MemoryError and planning data storage for their projects.
Chapter: 20 — Timers & Multicore / Chapter 21 — File Systems & Debugging

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Memory Types in MicroPython", subtitle beneath: "Internal Flash · SRAM · microSD · I2C EEPROM — where does your data live?"

    Layout: a four-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a simple storage-device illustration at the top. A vertical row-label strip on the far left lists the nine attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (raspberry red #C7164E): Header "Internal Flash"; Sub-header "Program storage"; Illustration: small square chip labeled "W25Q16" (QSPI NOR flash, silver-on-black) mounted on the underside of a Pico board outline. Rows:
    · Size (Pico): 2 MB QSPI NOR flash (Pico 2: 4 MB)
    · Volatile: No — data survives power-off and resets
    · Read speed: ~400 kB/s (via XIP — execute in place; cached for code)
    · Write speed: ~100 kB/s (in 4 KB erase sectors; ~100,000 write cycles)
    · File system: LittleFS (default MicroPython) or FAT
    · Used for: .py source files, compiled .mpy bytecode, boot.py, main.py
    · Accessed via: os.listdir('/'); open('/myfile.txt', 'w')
    · Typical cost: Included in board price
    · Best for: Storing your program, configuration files, small data logs

    Column 2 (teal blue #1389A6): Header "SRAM (Internal RAM)"; Sub-header "Working memory"; Illustration: two rectangular memory block outlines labeled "SRAM Bank 0" and "SRAM Bank 1" inside a chip outline (RP2040). Rows:
    · Size (Pico): 264 KB total SRAM — split into 6 banks on RP2040
    · Volatile: Yes — all data lost on reset or power-off
    · Read/write speed: ~133 MHz access (single-cycle via bus fabric)
    · MicroPython heap: ~170–200 KB available to Python objects (rest used by firmware)
    · File system: N/A — RAM is not a file system
    · Used for: Variables, lists, dictionaries, bytearray buffers, network buffers
    · Accessed via: Normal Python variables; check with micropython.mem_info()
    · Monitor: import micropython; micropython.mem_info() shows free heap
    · Best for: All runtime data — free memory is the #1 constraint on embedded Python

    Column 3 (forest green #2D8A4E): Header "microSD Card (SPI)"; Sub-header "Large external storage"; Illustration: micro-SD card (very small) inserted into a SPI breakout module with 6 labeled pins (VCC, GND, MOSI, MISO, SCK, CS). Rows:
    · Capacity: 1 GB–32 GB (FAT32); up to 2 TB (exFAT)
    · Volatile: No — data survives power-off
    · Read speed: 0.5–4 MB/s via SPI (much less than native SDIO speeds)
    · Write speed: 0.3–2 MB/s via SPI
    · File system: FAT16 / FAT32 / exFAT (standard; works with PCs)
    · Used for: Data logging CSV files, audio sample files, large datasets, images
    · Accessed via: Requires sdcard.py driver; mounts as /sd; open('/sd/log.csv', 'a')
    · Typical cost: $1–$5 for card + $1–$3 for SPI breakout module
    · Best for: Long-term data logging, audio file storage, transferring data to PC

    Column 4 (deep purple #6A3FB5): Header "I2C EEPROM"; Sub-header "Byte-addressable non-volatile"; Illustration: small 8-pin DIP IC labeled "AT24C32" on a tiny breakout board with I2C and power pins. Rows:
    · Capacity: 4 KB (AT24C32) · 32 KB (AT24C256) · 512 KB (AT24CM02)
    · Volatile: No — data survives power-off; retains data for 100+ years (spec)
    · Read speed: ~100 kbps (I2C standard mode)
    · Write speed: ~100 kbps; 5 ms write cycle time per page (8–64 bytes per page)
    · Write endurance: Up to 1,000,000 write cycles per byte address
    · Used for: Device configuration, calibration constants, serial numbers, counters
    · Accessed via: i2c.writeto_mem(addr, reg, data); i2c.readfrom_mem(addr, reg, n)
    · Typical cost: $0.50–$2.00 (breakout board)
    · Best for: Settings that must survive power loss; small structured configuration data

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, monospace for code snippets and addresses, numbers bold. Footer bar: "Sources: RP2040 Datasheet §2.6 (SRAM) §4.10 (Flash) — Raspberry Pi Ltd · Microchip AT24C datasheet — verified June 2026." Overall: tidy vector flat-design infographic poster, four-column grid with storage-device illustrations, suitable for a textbook or classroom screen.
