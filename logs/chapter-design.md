# Chapter Design Log — Learning MicroPython and Physical Computing

**Date:** 2026-06-15
**Skill:** book-chapter-generator
**Source graph:** docs/learning-graph/learning-graph.json (485 concepts, 913 edges, 24 taxonomy groups)

---

## Design Summary

- **Total chapters:** 22
- **Total concepts:** 485 (all assigned exactly once, 0 missing, 0 duplicates)
- **Dependency violations:** 0 (after 8 fixes — see below)
- **Average concepts per chapter:** 22.0
- **Range:** 14–30 concepts per chapter

---

## Chapter List

| # | Title | Concepts | URL Slug | Taxonomy Groups |
|---|-------|----------|----------|-----------------|
| 01 | Python Foundations | 30 | python-foundations | FOUND |
| 02 | MicroPython Environment | 20 | micropython-environment | UENV |
| 03 | Electronics Fundamentals | 26 | electronics-fundamentals | ELEC (minus concept 103) |
| 04 | Microcontrollers and Hardware | 29 | microcontrollers-and-hardware | MCU + concept 103 |
| 05 | Digital Input and Output | 29 | digital-input-and-output | IO (106–134) |
| 06 | PWM and Communication Protocols | 27 | pwm-and-communication | IO PWM (minus 142,143) + COMM (minus 162) |
| 07 | Temperature and Humidity Sensors | 16 | temperature-humidity-sensors | STEMP |
| 08 | Distance and Light Sensors | 18 | distance-and-light-sensors | SDIST (minus 192) + SENS (193–199) |
| 09 | Motion and Advanced Sensors | 21 | motion-and-advanced-sensors | SMOT + SENS (219–225, minus encoder group) |
| 10 | Motors, Servos and Steppers | 25 | motors-servos-and-steppers | ACT + concepts 142,143 |
| 11 | Robots and Robotics | 14 | robots-and-robotics | ROB + concept 192 |
| 12 | NeoPixels and LED Strips | 15 | neopixels-and-led-strips | NEO |
| 13 | Non-Graphical Displays | 16 | non-graphical-displays | DISP |
| 14 | OLED Displays | 23 | oled-displays | OLED (minus 306) |
| 15 | Color TFT and E-Paper Displays | 25 | color-tft-and-epaper-displays | TFT + EPAP + concept 306 |
| 16 | Sound and Audio | 15 | sound-and-audio | SND (minus 349–352) + concept 162 |
| 17 | Wireless and IoT | 24 | wireless-and-iot | WIFI |
| 18 | Advanced MicroPython Programming | 27 | advanced-micropython | ADV + rotary encoder group (211–215) |
| 19 | File System, Debugging and Audio Playback | 26 | file-system-and-debugging | FS + DBG + concepts 349,350,351,352 |
| 20 | Advanced Hardware Topics | 18 | advanced-hardware-topics | HADV |
| 21 | AI Tools and Educational Kits | 19 | ai-tools-and-kits | APP (445–463) |
| 22 | Computational Thinking and Project Design | 22 | computational-thinking-and-projects | APP (464–485) |

---

## Dependency Violations Found and Fixed

Eight violations were detected in the initial design and resolved by moving concepts to later chapters:

| # | Concept Moved | From Ch | To Ch | Reason |
|---|---------------|---------|-------|--------|
| 1 | 142 — PWM for Servo Control | 06 | 10 | Depends on Servo Motor (238, ACT) |
| 2 | 143 — PWM for Motor Speed | 06 | 10 | Depends on DC Motor (226, ACT) |
| 3 | 162 — I2S for Audio | 06 | 16 | Depends on Passive Buzzer (341, SND) |
| 4 | 192 — Collision Avoidance Logic | 08 | 11 | Depends on Robot Chassis (249, ROB) |
| 5–7 | 211–215 — Rotary Encoder cluster | 09 | 18 | All depend on Interrupt Handler (383, ADV) |
| 8 | 306 — OLED Framebuffer | 14 | 15 | Depends on Framebuf Module (326, TFT) |
| 9–12 | 349,350,351,352 — WAV/Audio Playback | 16 | 19 | 349 depends on File Read and Write (407, FS) |

Note: items 9–12 were discovered as a cascade from fix #9 (WAV Audio File → MP3 Conversion, Audio Playback, I2S Audio Output all depend on WAV Audio File).

---

## Chapter Size Analysis

Chapters within the optimal 12–25 range:

```
Ch02: 20  Ch07: 16  Ch08: 18  Ch09: 21  Ch10: 25
Ch11: 14  Ch12: 15  Ch13: 16  Ch14: 23  Ch15: 25
Ch16: 15  Ch17: 24  Ch20: 18  Ch21: 19  Ch22: 22
```

Chapters slightly above 25 (all justified by natural grouping density):

```
Ch01: 30  — FOUND: Python syntax has many atomic, non-splittable primitives
Ch03: 26  — ELEC: 27 foundational electronics concepts, one moved to Ch04
Ch04: 29  — MCU: board variants + all GPIO/pin/power concepts belong together
Ch05: 29  — IO: digital + analog I/O is a single coherent programming interface
Ch06: 27  — PWM (8 concepts) + COMM (19 concepts) both control signal busses
Ch18: 27  — ADV (22) + rotary encoders (5) co-located with their interrupt dependency
Ch19: 26  — FS (10) + DBG (12) + audio playback (4) all depend on file-system primitives
```

---

## Key Design Decisions

### ELEC before MCU (Ch3 before Ch4)
Several MCU concepts depend on basic electronics:
- Pull-Up/Down Resistors (65, 66) → Current-Limiting Resistor (87, ELEC)
- 3.3V/5V Logic Level (69, 70) → Voltage (79, ELEC)
- Ground GND (71) → Voltage (79) + Series Circuit (84, ELEC)

Solution: teach Electronics Fundamentals in Ch3, Microcontrollers in Ch4. One ELEC concept — Wiring Diagram (103) — depends on GPIO Pin (62, MCU), so it was moved into Ch4.

### Rotary Encoders in the ADV chapter (Ch18)
The `rotary` module implementation depends on interrupt handlers. Concepts 211–215 (Rotary Encoder through rotary Module) all trace a dependency to Interrupt Handler (383), which is taught in Advanced MicroPython. Moving the cluster to Ch18 keeps the conceptual thread intact.

### Audio Playback in the FS/DBG chapter (Ch19)
`WAV Audio File` (349) was assigned dependency `File Read and Write` (407) in the learning graph, reflecting that WAV playback requires reading a file from disk. This pulled `MP3 to WAV Conversion`, `Audio Playback`, and `I2S Audio Output` out of the SND chapter into Ch19 alongside the file-system concepts.

### I2S for Audio in the SND chapter (Ch16)
`I2S for Audio` (162) was tagged COMM in the taxonomy but depends on `Passive Buzzer` (341, SND). Since its purpose is audio output context rather than protocol mechanics, it fits better in Ch16 Sound and Audio, where students need it before WAV playback.

### APP split across two chapters (Ch21 and Ch22)
The APP taxonomy contained 41 concepts — too many for one chapter. Natural sub-groups:
- **Ch21 (AI + Kits):** AI prompt engineering (7) + educational kit projects (12) = 19 concepts
- **Ch22 (CT + Projects):** Computational thinking (10) + project design and build (12) = 22 concepts

---

## Next Steps

1. **User approval received** — generate 22 chapter directories under `docs/chapters/`
2. Create `docs/chapters/index.md` (chapter overview)
3. Create each `docs/chapters/NN-slug/index.md` with title, summary, concept list, prerequisites
4. Update `mkdocs.yml` navigation with the Chapters section
5. Run `/chapter-content-generator` for each chapter (after reviewing outlines)
