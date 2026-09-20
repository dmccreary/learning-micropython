# Session Log: SHT40 Temperature Kit with Round Smartwatch Display

- **Date:** 2026-09-19
- **Log written:** 18:38 CDT
- **Model:** Claude Sonnet 5 (Claude Code, desktop app)
- **Repo:** `/Users/dan/Documents/ws/learning-micropython` (branch `main`)
- **Deliverable:** `src/kits/sht40-temp-display/` (new, untracked, not committed)
- **Timestamps I can vouch for (from file times):** kit copied at 18:26, first
  simulator run at 18:29. I did not record a session start time, so none is
  claimed here.

## 1. Outcome in one paragraph

Made an exact copy of `src/kits/sht40-temp/` as `src/kits/sht40-temp-display/`,
then added a round GC9A01 "smartwatch" display that shows temperature and
humidity (pressure was dropped at the user's request, see prompt 2). The
display uses the same pins as the stem-robots smartwatch kit. Two new labs were
added (`06-display-hello.py`, `07-display-temp-humidity.py`), plus the display
driver in `lib/`, new display settings in `config.py`, an updated
`upload-code.sh`, and an updated `README.md`. Everything was checked on the Mac
with a simulator that runs the real lab files against a fake display and a fake
sensor. **Nothing has been run on real hardware**, and nothing was written to
the Pico or committed to git.

## 2. Prompts, verbatim, and how each was handled

### Prompt 1 (opening request)

> Please make an exact copy of the @src/kits/sht40-temp directory into @src/kits/sht40-temp-display and then modify the source code to use a circular smartwatch display to display the temperature and humidity.  The display is a gc9a01 with the pins on the same as the config.py here: /Users/dan/Documents/ws/stem-robots/src/kits/smartwatch-compass-hmc5883l/config.py

Handled by: reading the source kit and the reference kit, then copying and
modifying.

### Prompt 3 (arrived while I was reading the display driver)

> You will find working sample code on the Pico attached to the /dev/cu* port

Handled by: listing serial ports, finding one Pico at `/dev/cu.usbmodem14201`,
and reading its files **read-only**. It held only four older SHT40 labs (no
display code). Details in section 4, finding 4.

### Prompt 4 (this log)

> Perfect!  Please create a detailed session log of your work and my prompts into logs/sht-40-temp-display-generation.md.  Include the design decisions you made and why.

Handled by: writing this file. While preparing it I opened
`CONTENT-GENERATION-GUIDELINES.md`, which I had **not** read before writing the
README, and recorded what I found in section 9.

## 3. Work timeline

1. Listed the source kit: `config.py`, `README.md`, `upload-code.sh`, labs 01-05,
   and an empty `index.md`.
2. Read the reference kit `stem-robots/src/kits/smartwatch-compass-hmc5883l/`:
   `config.py`, `upload-code.sh`, `lib/`, and labs 05, 07 and 10. Lab 07's
   comments explain how to update the screen without flicker. Lab 10 shows how
   to fit a layout in a circle.
3. Searched both repos for pressure drivers. Found only `src/sensors/bme280.py`.
4. Read the driver's `text()` code and the font headers. Found the fonts have no
   degree symbol.
5. Listed the attached Pico and copied its four files to the scratchpad for a
   diff. Read-only.
6. Made the copy (`cp -R`), created `lib/`, and copied four driver files from
   stem-robots into it. `diff -r` against the original showed only `lib/`
   differing, which confirmed the copy was exact before I edited anything.
7. Edited `config.py` (display settings, NeoPixel pin, watch-face settings).
8. Wrote `06-display-hello.py` and `07-display-temp-humidity.py`.
9. Found and fixed two layout bugs in my first draft of lab 07 (section 8).
10. Built a desktop simulator in the session scratchpad, ran the labs through it,
    rendered the face to PNG images and looked at them.
11. Cleaned up files my simulator accidentally left in the kit (section 8).
12. Updated `upload-code.sh` and `README.md`.
13. Syntax-checked every file and confirmed the final file list.
14. Wrote this log.

## 4. What I found while reading (facts the design depends on)

1. **The fonts have no degree symbol.** Both font modules have `FIRST = 0x20` and
   `LAST = 0x7f`, and the driver's `text()` silently skips any character outside
   that range. Drawing `chr(248)` would show nothing.
2. **GP2 is used twice in the original kit.** The NeoPixel strip in lab 05 used
   GP2, and GP2 is also the display's SPI clock (SCK) pin in the reference
   `config.py`.
3. **The Pico already held working SHT40 code, but no display code.** Files on
   the board: `01-i2c-scanner.py`, `02-get-single-temp-reading.py`,
   `03-continuous-logging.py`, `04-plot-temp-and-humidity.py`. No `config.py`, no
   `lib/`, no `main.py`. They are the older versions of the repo's labs, from
   before pins moved into `config.py`. The sensor logic matches (GP0/GP1,
   hardware I2C, 400 kHz, address 0x44, 15 ms wait), which confirmed that setup
   works on the real board.
4. **This driver has no frame buffer.** Every drawing call sends pixels straight
   to the glass. The reference lab 07 notes that clearing the whole screen every
   frame sends 57,600 pixels and looks like a strobe.
5. **The screen is round.** The driver addresses a 240 x 240 square, but only the
   inscribed circle is visible. The reference keeps drawing inside
   `SAFE_RADIUS = 112`.

### Commands run against the Pico (all read-only)

| Command | Purpose |
|---------|---------|
| `mpremote devs` | Find the board: `/dev/cu.usbmodem14201`, vid:pid 2e8a:0005 |
| `mpremote ... fs ls` | List files in the root of the board |
| `mpremote ... fs ls :lib` | Confirm there is no `lib/` folder (it errored, as expected) |
| `mpremote ... fs cp :<file> <scratchpad>/<file>` (x4) | Copy the four labs off the board to diff them |

No `fs cp` in the other direction, no `reset`, and no `run` was issued. One
nuance: `mpremote` briefly interrupts whatever the board is running so it can
talk to it. That does not change anything stored on the board. The board had no
`main.py`, so nothing was set to run on its own.

## 5. Design decisions and why

### Scope and hardware

**D1. Copy first, modify second, and prove the copy was exact.**
The user asked for an "exact copy". I copied with `cp -R` and ran `diff -r`
against the original before editing. Labs 01-05 are byte-identical to the
originals. The empty `index.md` was copied as-is.

**D2. The sensor stays on GP0/GP1 with hardware I2C0.**
GP0/GP1 do not overlap the display's SPI0 pins (GP2-GP6), so nothing had to
move. It is the wiring the Pico already runs successfully, and the user's
breadboard does not need to be rewired. The reference kit switched to
`SoftI2C` because of a clock-stretching problem with the HMC5883L compass, not
the SHT40, so that workaround was not carried over.

**D3. Display pins are exactly the reference's.**
SPI0, SCK GP2, MOSI GP3, DC GP4, CS GP5, RST GP6, 60 MHz, rotation 0. The user
pointed at that file, and it matches a wiring already confirmed working.

**D4. The NeoPixel pin moved from GP2 to GP7.**
Two things cannot share GP2. Options were: leave it (broken wiring), delete lab
05 (loses a lab and breaks "exact copy"), or move the pin. I moved it because
lab 05 reads its pin from `config.py`, so the lab file itself stays untouched.
GP7 is physical pin 10, right next to the display's RST wire (pin 9), so the
wires stay together on the breadboard. The change is explained in `config.py`
and in the README.

### Code structure

**D6. `gc9a01` is imported inside `init_display()`, not at the top of
`config.py`.**
The reference imports the driver and fonts at the top, so `import config` fails
if `lib/` is not on the board. Here, labs 01-05 also import `config`, and they
should still run on a Pico that has no display files yet. The display labs import
the fonts themselves. *Trade-off:* this differs from the reference pattern
(`config.FONT`), so someone comparing the two kits will see a difference.

**D7. Config names were made more specific.**
`DISPLAY_WIDTH`, `DISPLAY_HEIGHT` and `SPI_BAUDRATE` instead of the reference's
`WIDTH` and `BAUDRATE`. This config also holds I2C, NeoPixel and sensor
settings, and a bare `WIDTH` would be ambiguous there.

**D8. The sensor-reading code is repeated inside lab 07.**
Labs 02-05 each carry their own `crc8()` and `read_sht40()`. I matched that
idiom so a student can read one file from top to bottom. *Trade-off:* this is
the fifth copy of the same code. A shared `sht40.py` in `lib/` would remove the
copies, but it would change how every existing lab is structured.

**D9. Old-style `%` formatting in the display labs.**
The reference lab 07 says `%` is safer than `str.format` with a width on this
MicroPython. Labs 02-05 use `.format()`, so the display labs are a small
deliberate difference. *Trade-off:* mixed styles in one kit.

**D10. `main.py` is created by the upload script, not stored in the repo.**
The reference kit keeps a checked-in `main.py` that is a copy of its last lab. A
duplicate file can drift away from the lab. Here `upload-code.sh` copies
`07-display-temp-humidity.py` to `:main.py` (the name is set once in
`MAIN_LAB`). A Pico runs `main.py` on power-up, so the watch works with no
computer. *Trade-off:* there is no `main.py` file to open in the repo.

**D11. `lib/` was copied into the kit, not referenced from stem-robots.**
The kit stays self-contained and `upload-code.sh` works from its own folder.
*Trade-off:* about 1,360 lines of driver, font and shapes code now exist in two
repos and may drift apart.

### The watch face (lab 07)

**D12. Draw the fixed parts once, then only overwrite the numbers.**
With no frame buffer, clearing the screen each second would flash. The ring,
labels, divider and bar outline are drawn once. Each number goes in a
fixed-width field, and `text()` paints a background color behind each letter, so
new digits cover the old ones. The humidity bar is two rectangles side by side
(filled part and empty part), so every bar pixel is repainted each frame with
nothing to erase.

**D13. The degree symbol is a small drawn ring.**
The font cannot print one (finding 2). `shapes.ring()` draws a ring of radius 4
and thickness 2 in the 16-pixel slot after the digits, near the top of the
letters. It is redrawn every frame in the current color, which is simple and
costs only a few line draws. The small Celsius line just says "C" with no
symbol.

**D14. The number fields are five characters wide, then shifted half a slot
left.**
Five slots lets `100.0`, `-40.0` and `125.0` fit. But a normal `72.5` fills only
four of them and leaves a blank slot on the left, which pushed the visible text
about 8 pixels right of center. Shifting the line left by half a character
recentres what you can actually see.

**D15. Refresh once a second (`DISPLAY_SECONDS = 1` in `config.py`).**
Room temperature and humidity change slowly, and once a second feels live. The
existing lab 05 notes that reading ten times a second warmed the sensor by
several degrees, so I avoided a fast loop. It also matches `PLOT_SECONDS = 1`.

**D16. Temperature color bands are 65 / 78 / 90 F, kept in `config.py`.**
Cyan below 65, green up to 78, orange up to 90, red from 90. 90 F matches
`TOUCH_TARGET_F` in lab 05. These numbers are my own judgment of "comfortable",
not from any standard, so they are settings a student can change. Humidity
stays one color (cyan) because the bar already shows the amount, and fewer color
meanings are easier for a 10-year-old.

**D17. Sensor failure is shown on the screen.**
If a reading fails, the top label changes from `TEMPERATURE` to a red
`SENSOR FAIL`, the last numbers stay up, and the label goes back when a reading
succeeds. Both labels are exactly 11 characters, so one is painted over the
other with no clearing. This avoids a stale number that looks trustworthy. If
the startup soft-reset fails, the screen shows a message and the program exits
with `SystemExit`, using the same wording as labs 02-04.

**D18. Layout was placed so every element fits inside the circle.**
Rows run from y = 36 to y = 205, roughly centered on 120. Wider items sit near
the middle and narrower ones near the top and bottom. The simulator checked the
text boxes (section 7).

| Element | Font | x range | y range |
|---------|------|---------|---------|
| Ring, radius 112, 2 px thick | n/a | n/a | n/a |
| `TEMPERATURE` label | 8x16 | 76-163 | 36-51 |
| Temperature digits (` 72.5`) | 16x32 | 56-135 | 56-87 |
| Degree ring (center 144, 63) and `F` | 16x32 | 136-167 | 56-87 |
| Celsius line (` 22.5 C`) | 8x16 | 88-143 | 92-107 |
| Divider line (grey) | n/a | 50-189 | 118 |
| `HUMIDITY` label | 8x16 | 88-151 | 128-143 |
| Humidity digits (` 48.2%`) | 16x32 | 64-159 | 148-179 |
| Humidity bar (outline 124 x 14, fill 120 x 10) | n/a | 58-181 | 192-205 |

### Restraint

**D19. Things I chose not to do.** I did not commit, did not write to the Pico,
did not touch `docs/kits/sht40-temp/` or `mkdocs.yml` (both already had your
uncommitted edits), and did not create a docs page for the new kit. None of
those were asked for.

## 6. Files

New folder `src/kits/sht40-temp-display/`. Compared with the original kit:
9 files differ, +1,916 lines, -16 lines. The original `src/kits/sht40-temp/` is
unchanged (`git status` shows only the new folder under `src/kits/`).

| File | Status | Lines | Notes |
|------|--------|-------|-------|
| `01-i2c-scanner.py` | unchanged copy | 67 | |
| `02-get-single-temp-reading.py` | unchanged copy | 129 | |
| `03-continuous-logging.py` | unchanged copy | 159 | |
| `04-plot-temp-and-humidity.py` | unchanged copy | 124 | |
| `05-temp-touch-neopixel.py` | unchanged copy | 239 | Pin now comes from the moved `NEOPIXEL_PIN` |
| `06-display-hello.py` | **new** | 46 | Wiring check, no sensor needed |
| `07-display-temp-humidity.py` | **new** | 273 | The watch face |
| `config.py` | modified | 146 | Display pins and colors, `init_display()`, NeoPixel pin, watch settings |
| `upload-code.sh` | modified | 173 | Uploads `lib/`, then `config.py`, labs, and `main.py` |
| `README.md` | modified | 285 | Display wiring, labs 05-07, troubleshooting |
| `index.md` | unchanged copy | 0 | Empty in the original too |
| `lib/gc9a01.py` | **new** (from stem-robots) | 925 | Display driver |
| `lib/shapes.py` | **new** (from stem-robots) | 229 | `ring()`, `circle()`, `ellipse()` and more |
| `lib/vga1_8x16.py` | **new** (from stem-robots) | 104 | Small font |
| `lib/vga1_bold_16x32.py` | **new** (from stem-robots) | 104 | Big font |

### Wiring summary (as documented in `config.py` and the README)

| Part | Pin on the part | Pico pin |
|------|-----------------|----------|
| SHT40 | VIN / GND / SDA / SCL | 36 (3V3 OUT) / GND / 1 (GP0) / 2 (GP1) |
| Display | VCC / GND | 36 (3V3 OUT) / pin 3 or 8 |
| Display | SCL / SDA / DC / CS / RST | 4 (GP2) / 5 (GP3) / 6 (GP4) / 7 (GP5) / 9 (GP6) |
| NeoPixel (lab 05 only) | DIN | 10 (GP7) |

## 7. Verification

### Method

I wrote a simulator in the session scratchpad (`sim.py`, not in the repo). It
runs the **real** lab file, `config.py`, `shapes.py` and font modules against:

- a fake `machine` module (`Pin`, `I2C`, `SPI`),
- a fake SHT40 that returns valid 6-byte readings with correct CRC checksums,
- a fake GC9A01 that paints into a 240 x 240 canvas using the real font
  bitmaps, and fails loudly on zero-length `fill_rect` or `hline` calls.

### Results

| Check | Result |
|-------|--------|
| Lab 07, 22.5 C / 48.2 % | Prints `72.50 F  22.50 C  48.20 %`; face renders correctly |
| Lab 07, 41.0 C / 100 % | `105.8 F` in red, `100.0%`, full bar; nothing clipped |
| Lab 07, -12.3 C / 0 % | Runs clean; no zero-width bar draw |
| Lab 07, sensor dies after 1 reading | Label becomes red `SENSOR FAIL`, numbers stay, loop keeps running |
| Lab 06 | Prints `TEST PASS`, draws at x=24, y=104 |
| Pins used by lab 07 | Only 0-6 (GP0/GP1 sensor, GP2-GP6 display), so no clash |
| Text boxes vs. circle | No text box corner beyond r = 110 in any scenario (farthest in the normal case: r = 94.2; the safe radius is 112) |
| Pixels outside the visible circle | 0 in every scenario |
| Syntax, all `.py` files | Parsed OK with `ast.parse` (no bytecode written) |
| `upload-code.sh` | `bash -n` OK; file selection glob lists 7 labs, `config.py`, 4 `lib` files |
| Original kit | Unchanged |

I looked at the rendered images for the normal, hot and failure cases. The face
is centered, the degree ring sits correctly, the colors switch, and the humidity
bar fills.

### What this does not prove

- **No real hardware run.** SPI timing, actual brightness and color, how the
  ring sits against the bezel, and whether the update looks flicker-free on the
  real glass are all unchecked.
- **`main.py` auto-start** and the upload script's `mpremote` steps were not
  executed, only syntax-checked.
- **Lab 06 prints `TEST PASS` whenever its drawing calls do not raise an error.**
  The SPI link is write-only here, so a disconnected display would still "pass".
  The lab prints a line asking the student to look at the screen for that
  reason. It is a limit of the check, not a bug in the display code.
- **The simulator only covers what I built into it.** For example, it does not
  model how the real driver handles a very long `text()` call.

## 8. Mistakes and corrections during the session

1. **Wrong comment and padding logic for the Celsius line (caught before
   testing).** My first draft claimed `"(%.1f C)"` was 8 characters "for most
   readings" and padded to 8. It is 7 characters for 0.0-9.9 and 9 for 100 and
   above. I replaced it with the fixed-width `"%5.1f C"`.
2. **Numbers sat about 8 pixels right of center (caught before testing).** Cause
   and fix are in decision D14.
3. **Simulator bug: my patch script pasted a fallback into the wrong function**
   and caused a `NameError`. Fixed in the scratchpad file.
4. **Simulator bug that polluted the kit.** The simulator changes directory into
   the kit, so its relative PNG paths and Python's `__pycache__` folders landed
   **inside** `src/kits/sht40-temp-display/` (two PNGs, plus `__pycache__` in the
   kit and in `lib/`). I moved the PNGs to the scratchpad, deleted the caches, and
   listed the folder to confirm it was clean. I then made the simulator use
   absolute paths and stop writing bytecode.
5. **Shell slips.** zsh aborted one command chain on an unmatched `rm -f face-*.png`,
   and treated `echo =======` as a command. Both were harmless and re-run.
6. **I did not read `CONTENT-GENERATION-GUIDELINES.md` before writing the
   README.** Your project `CLAUDE.md` says to read it before writing any text a
   student will read. I matched the tone of the existing kit README instead. I
   read the guidelines afterwards, and section 9 records the comparison. I have
   **not** changed any files in response, so you can decide what to fix.

## 9. Check against project guidelines (done after the fact)

Source: `CONTENT-GENERATION-GUIDELINES.md` and the "Contributing Guidelines" in
the project `CLAUDE.md`.

| Rule | Status |
|------|--------|
| Avoid-list words (initialize, utilize, implement...) | **Clean.** None found in new or changed files |
| Inline comments in code | **Met.** Labs 06 and 07 are commented throughout |
| Self-explanatory names | **Met.** `led_pin`-style naming (`temperature_color`, `draw_humidity`) |
| Breadboard, no soldering (your saved preference) | **Met** |
| Troubleshooting section | **Met.** Five rows added and one edited |
| Short sentences (20 words or fewer preferred) | **Partly.** About six genuine sentences run over 20 words (32, 27, 26, 25, 24 and 22 words). My checker also reported two larger numbers, but those came from it merging list items and commands into one "sentence" |
| Spell out every acronym on first use | **Not met.** `SPI`, `MOSI`, `CLK`, `CS`, `RST` and `DIN` are not spelled out in the README (some are printed pin labels on the board) |
| Hardware steps as numbered lists | **Not met for the display.** The sensor wiring is a numbered list (from the original), but the display wiring is a table only and the NeoPixel note is prose |
| One new concept per code example | **Not met by lab 07.** It combines an I2C read, a layout, colors and error handling. Lab 06 separates out display setup, but 07 is closer to a capstone |
| Wiring diagram for every hardware example (`CLAUDE.md`) | **Not met.** There is only a table. The original kit README also had none |
| Test on real hardware before committing (`CLAUDE.md`) | **Not yet done** |
| Mascot rules | Not applied. They govern chapters, and the original kit README uses no mascot |

## 10. Loose ends and suggested next steps

1. **Run it on the Pico** (close Thonny first), then run lab 06, then lab 07, and
   unplug and replug to check `main.py`:

   ```bash
   cd /Users/dan/Documents/ws/learning-micropython/src/kits/sht40-temp-display && ./upload-code.sh
   ```

2. **Fix the README gaps in section 9:** spell out the acronyms, add numbered
   display-wiring steps, shorten the longest sentences.
3. **Add a wiring diagram** (a breadboard MicroSim would fit) and a docs page
   under `docs/kits/` with a `mkdocs.yml` entry. The existing
   `docs/kits/sht40-temp/` files have uncommitted edits of yours, so I left them
   alone.
4. **Consider splitting lab 07** into a plain-text version and the full watch
   face, to follow the one-concept-per-example rule.
5. **Remove unused constants** in `config.py`: `YELLOW`, `BLUE` and `RADIUS` are
   not used by labs 06 or 07. (`BLUE` and `RADIUS` mirror the reference config.)
6. **Pressure, if wanted later:** add a BME280 or BMP280 on the shared I2C bus,
   use `src/sensors/bme280.py` as a starting point, and re-plan the face as three
   rows.
7. **Keep or discard the scratch tools.** The simulator (`sim.py`), the five
   rendered PNGs, and the copy of the Pico's files are in the session scratchpad
   (`/Users/dan/tmp/claude/claude-501/-Users-dan-Documents-ws-learning-micropython/98bfdff4-2b95-4232-b3a3-8c1f54eb17a8/scratchpad/`)
   and are temporary. If you want the simulator or the images kept, they can be
   moved into the repo.
8. **Nothing is committed.** `git status` shows `src/kits/sht40-temp-display/`
   as untracked, plus this log file, alongside your earlier uncommitted
   `docs/kits/sht40-temp/` and `mkdocs.yml` changes.
