# TODO

Repository-level to-do list for learning-micropython. Per-MicroSim to-do
files live next to each sim under `docs/sims/`.

## New kit: Theremin

**Added:** 2026-10-31
**Status:** not started
**Goes in:** `src/kits/theremin/` (code) and `docs/kits/theremin/` (docs)

Create a new project kit called **theremin**: a Raspberry Pi Pico that plays
a tone through a MAX98357A I2S amplifier, with the pitch and volume
controlled by the distance of a hand from two VL53L0X time-of-flight
sensors. One sensor is mounted horizontally and the other vertically. An
**optional** smartwatch display shows the two distances and the frequency
so the player gets feedback.

### Parts

- Raspberry Pi Pico (the clocks-and-watches kits use a Pico 2 W)
- MAX98357A I2S amplifier breakout and a small speaker
- 2 x VL53L0X time-of-flight distance sensors
- Optional: GC9B72 2.1" 360x360 round display (the smartwatch display)

### Design notes to settle first

- **Which sensor does what.** Assumed: the horizontal sensor sets the
  pitch and the vertical sensor sets the volume. Confirm before writing
  the docs.
- **Two sensors, one default address.** Every VL53L0X powers up at I2C
  address `0x29`. Either put one sensor on each of the Pico's two I2C
  buses (I2C0 and I2C1), or wire each sensor's XSHUT pin to a GPIO and
  give them different addresses at startup. Decide which is simpler for
  students.
- **Driver.** `src/drivers/VL53L0X.py` already exists. Check that it
  supports changing the address and a fast ranging mode.
- **Reading quality.** Range readings jump around. Plan on smoothing
  (median or moving average) and a dead zone at the near and far ends.
  Measure the useful range on the bench before choosing the mapping.
- **Pitch mapping.** Map distance to frequency exponentially so equal hand
  movements give equal musical steps. Consider an optional "snap to
  notes" mode.
- **Volume is software.** The amplifier's GAIN pin is fixed by wiring, so
  volume has to scale the samples in code.
- **Reuse the Study Buddy sound code.** The clocks-and-watches repo
  (`src/kits/study-buddy/`) has a working `sound.py` that plays through the
  MAX98357A on core 1, and a button theremin (Lab 08) that steers a held
  note with `sound.hold()` and `sound.pitch()`.
- **Amplifier constraints** (from the MAX98357A datasheet, see
  `clocks-and-watches/logs/MAX98367A-updates.md`):
  - use a sample rate the amplifier accepts: 8, 16, 32, 44.1, or 48 kHz.
    **Not** 11.025 or 22.05 kHz.
  - SD can be left on the breakout's pull-up or tied to 3.3 V. Put it on a
    GPIO only if the kit needs software mute or 8 kHz audio.
  - GAIN to GND gives 12 dB, the loudest setting that needs no resistor.
    The clocks-and-watches kit defaults to 9 dB.
- **Optional display.** The kit must run with no display. Use a config flag
  or a guarded import so the sound and sensor code never depends on it.
  The GC9B72 driver is `src/kits/sw-gc9b72/lib/gc9b72.py` in the
  clocks-and-watches repo.

### Tasks

- [ ] Choose the sensor wiring (two I2C buses or XSHUT addressing) and
  draw the wiring diagram
- [ ] Write the labs, building up in small steps:
  - [ ] read one VL53L0X and print the distance
  - [ ] read two sensors at the same time
  - [ ] play a steady tone through the MAX98357A
  - [ ] pitch follows the horizontal sensor
  - [ ] volume follows the vertical sensor
  - [ ] smoothing, dead zones, and the final theremin program
  - [ ] optional: show distances and frequency on the GC9B72 display
- [ ] Test everything on real hardware, with the display attached and
  without it
- [ ] Add the kit page under `docs/kits/theremin/` and link it from
  `docs/kits/index.md` and the `mkdocs.yml` nav
- [ ] Add the new parts to `docs/kits/suggested-parts.md`
- [ ] Make the display images with the GC9B72 simulator in
  `clocks-and-watches/src/display-simulators/gc9b72`, not hand-drawn
  mockups
- [ ] Read `CONTENT-GENERATION-GUIDELINES.md` before writing any
  student-facing text
- [ ] Run `mkdocs build` and deploy
