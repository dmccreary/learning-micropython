# LIS3DH Shake Detector Kit with a Round Smartwatch Display

Feel every shake, wiggle and tilt with a tiny motion sensor. Then watch it
on a low-cost round display, the kind made for smartwatches.

The LIS3DH is a tiny **accelerometer** made by ST. An accelerometer feels
pushes and pulls in three directions at once. We call the directions X, Y and
Z. It measures them in **g**. One g is the pull of Earth's gravity. The
LIS3DH talks to your Pico over **I2C**, a two-wire system that lets chips
send numbers to each other.

The screen is a GC9A01, a round 240 x 240 color display that costs about $5.
It talks to your Pico over **SPI**, a faster wiring system with five wires.
It is the same display, with the same wiring, as the SHT40 Mood Ring kit
(`../sht40-temp-display`).

This kit started as a copy of that SHT40 kit. Programs 06 and 08 and the
display and button helper files are nearly the same. Only a few comment
lines changed. Programs 01 to 05, 07 and 09 are new, because a motion sensor
needs different lessons than a thermometer.

> **Status: tested on the simulator only.** This kit was written before the
> sensors arrived (AliExpress order 8214301946160233, expected around
> October 7, 2026). Every program has run on a desktop simulator, but none
> has run on a real Pico yet. See
> [Checks to Do on Real Hardware](#checks-to-do-on-real-hardware).

## What You Need

| Part | Notes |
|------|-------|
| Raspberry Pi Pico | Any Pico or Pico W with MicroPython already installed |
| LIS3DH breakout board | About $1.30 each on AliExpress (5 for $6.54). Adafruit #2809 costs more but has STEMMA QT plugs and ships faster |
| GC9A01 round display | 240 x 240, 1.28 inch, with SPI pins (SCL, SDA, DC, CS, RST) |
| Solderless breadboard | Half-size is plenty |
| Push button | Any small push button (a tactile switch). It needs two wires |
| About 15 jumper wires | 6 for the sensor, 7 for the display and 2 for the button |
| USB cable | Must be a data cable, not a charge-only cable |

**Watch out for the LIS3DSH.** Some sellers list "LIS3DSH LIS3DH" as if they
were the same part. They are two different chips. The programs in this kit
only work with the LIS3DH. Program 01 tells you which one you got.

## Wiring

Every part runs on 3.3 volts. Do **not** connect any of them to pin 40
(VBUS), which carries 5 volts straight from the USB cable. Many low-cost
LIS3DH boards have no voltage regulator, and 5 volts can destroy the chip.

### The LIS3DH sensor

1. Put the Pico on the breadboard with the USB port facing off the edge.
2. Connect LIS3DH **VCC** (sometimes labeled VIN) to Pico pin 36 (3V3 OUT).
3. Connect LIS3DH **GND** to any Pico GND pin, such as pin 38.
4. Connect LIS3DH **SDA** to Pico pin 1 (GP0).
5. Connect LIS3DH **SCL** to Pico pin 2 (GP1).
6. Connect LIS3DH **CS** to 3V3 OUT. This tells the chip to use I2C.
7. Connect LIS3DH **SDO** to GND. This sets the address to 0x18.

| LIS3DH pin | Connect to | Pico name | What it does |
|------------|-----------|-----------|--------------|
| VCC | pin 36 | 3V3 OUT | Power in |
| GND | pin 38 | GND | Ground |
| SDA | pin 1 | GP0 | Data line |
| SCL | pin 2 | GP1 | Clock line |
| CS | pin 36 | 3V3 OUT | High means "use I2C" |
| SDO | pin 38 | GND | Low means address 0x18 (high means 0x19) |
| INT1, INT2 | nothing | | Not used in this kit |

SDA is short for Serial Data. It carries the numbers. SCL is short for
Serial Clock. It keeps both chips in step, like a metronome.

Some boards already hold CS and SDO in place with tiny resistors. Wiring
them anyway does no harm, and it makes the address the same every time.

**Stick the sensor down.** The sensor must move with the breadboard, or it
feels its own wobble instead of your shake. Push it firmly into the
breadboard, and keep its wires short.

### The round display

| Display pin | Pico pin | Pico name | What it does |
|-------------|----------|-----------|--------------|
| VCC | 36 | 3V3 OUT | Power in (share this pin with the sensor) |
| GND | 3 or 8 | GND | Ground |
| SCL (or CLK) | 4 | GP2 | Clock line |
| SDA (or MOSI) | 5 | GP3 | Data line |
| DC | 6 | GP4 | Tells the display "this is a command" or "this is a pixel" |
| CS | 7 | GP5 | Picks this display when more than one chip is listening |
| RST | 9 | GP6 | Restarts the display |

The display's pins are labeled SCL and SDA just like the sensor's, but they
are **not** the I2C wires. The display's SCL and SDA go to GP2 and GP3. The
sensor's SCL and SDA go to GP0 and GP1. Do not mix them up.

If your screen stays dark even though everything else is right, look for a
**BL** (backlight) pin and connect it to pin 36 (3V3 OUT).

### The push button

1. Connect one leg of the button to Pico pin 20 (GP15). This is the pin in
   the bottom left corner of the Pico when the USB port is at the top.
2. Connect the other leg of the button to Pico pin 18 (GND).

The button needs no outside resistor. The program turns on the Pico's own
**pull-up resistor**, which holds the pin at 3.3 volts. Pressing the button
connects the pin to GND, so a press reads as 0.

Every pin number lives in `config.py`. If you wire something to a different
pin, change it there and every program follows.

## Upload the Programs

Plug the Pico into your computer, then run:

```bash
./upload-code.sh
```

The script finds your Pico and copies everything onto it:

- the `lib` folder: the display driver, two fonts, the sensor helper, and
  the small files the display modes share
- `config.py`
- every numbered program
- a second copy of program 09, saved as `main.py`

That is 26 files in all. A Pico runs `main.py` all by itself when it powers
up. Unplug the Pico and plug it back in, and the shake detector starts with
no computer. Try it with a USB battery pack! To stop it, plug the Pico into
Thonny and click the red Stop button.

Want a different program to start by itself? Change the `MAIN_LAB` line at
the top of `upload-code.sh`.

If two boards are plugged in, pick one like this:

```bash
PORT=/dev/cu.usbmodem14301 ./upload-code.sh
```

If the script says something else is using the port, close Thonny and try
again. Only one program can talk to the Pico at a time.

## The Programs

Run them in order. Each one ends with **TEST PASS** or **TEST FAIL** (except
the Plotter programs 04 and 05, which print only numbers). The outputs below
come from the desktop simulator.

### 01-i2c-scanner.py

Asks the I2C bus "who is out there?" Then it asks the sensor "who are you?"
by reading its **WHO_AM_I register**. A register is a tiny memory box inside
the chip. This one always holds 0x33 on a LIS3DH.

```
Found 1 device(s):
  decimal: 24  hex: 0x18

Something at 0x18 - LIS3DH with SDO wired to GND
WHO_AM_I says 0x33 - it is a LIS3DH!

TEST PASS
```

If your board answers at 0x19, the scanner tells you the exact line to
change in `config.py`. If you got a LIS3DSH by mistake, it says so:

```
A LIS3DSH is at 0x1e (WHO_AM_I says 0x3f).
That is a different chip from the LIS3DH. It needs
different code, so the programs in this kit will not work.
```

### 02-get-single-reading.py

The gravity check. Lay the board flat and hold still. A still sensor is
**not** reading zero. It feels gravity, so the arrow pointing up reads about
1 g.

```
X:   0.02 g
Y:  -0.01 g
Z:   1.01 g
Total: 1.01 g

The Z arrow points up toward the sky.

TEST PASS
```

The test passes when the total is between 0.8 and 1.2 g. Tip the board on
its side and run it again. Now a different arrow points up!

### 03-continuous-logging.py

Four readings a second, as comma separated values (CSV), ready to paste into
a spreadsheet. Each row has the time, X, Y, Z, the total push, and the
**shake strength**: how far the total is from the 1 g of gravity.

```
seconds,x,y,z,total,shake
0.00,0.01,-0.02,1.00,1.00,0.00
```

Press Ctrl-C to stop. You get a summary:

```
Summary
  readings:       16
  failed reads:   0
  biggest shake:  1.59 g at 1.00 seconds
  shakes counted: 2 (each time the strength went over 0.5 g)

TEST PASS
```

### 04-plot-xyz.py

Prints X, Y and Z twenty times a second, as numbers only, for Thonny's
Plotter.

1. Open the file in Thonny.
2. Choose **View > Plotter** from the menu.
3. Click the green Run button.
4. Tip the board slowly each way, then shake it.

```
0.01 -0.02 1.00
0.01 -0.02 1.00
```

### 05-plot-shake.py

The same, boiled down to one line: the shake strength. Tipping the board
barely moves the line. Shaking it makes tall spikes.

```
0.00
1.11
0.62
1.32
```

### 06-display-hello.py

Writes "Hello World!" in the middle of the round screen. It does not need
the sensor, so it proves the display wiring by itself.

```
Drew 'Hello World!' at x=24, y=104
Look at the display. Do you see Hello World?
TEST PASS
```

### 07-display-shake-meter.py

The first program that uses the sensor and the screen together. It reads the
sensor fifty times a second and draws ten times a second: the shake strength
in big numbers, a colored bar, **SHAKE!** while you shake, and a shake
counter. It teaches three ideas:

- **Read fast, draw slower.** We keep the biggest reading between drawings
  (the "peak"), so no quick shake slips through.
- **One shake, not twenty.** A shake only ends after the strength stays under
  the line for 0.4 seconds. Then it counts once.
- **No flicker.** We never wipe the screen. We paint new numbers right on top
  of the old ones, and we only redraw words that changed.

The Shell prints `Shake number 1!` and so on.

### 08-button-and-led-test.py

Press the button three times: a tap, a one-second hold and a three-second
hold. The green LED blinks once a second.

```
Press 1: 121 ms, a tap (next mode)
Press 2: 1100 ms, a hold (set the bubble level)
Press 3: 3301 ms, a long hold (clear the shake score)

The button works!
TEST PASS
```

### 09-shake-modes.py

The finished shake detector. It becomes `main.py`. A tap on the button moves
to the next of five modes. The dots at the bottom of the screen show which
mode you are in.

| Mode | What it shows | Hold the button |
|------|---------------|-----------------|
| 1. Meter | A rainbow ring gauge that jumps when you shake and falls back slowly | nothing |
| 2. Bubble | A bubble level. It uses gravity, not shaking, to show tilt | 0.8 s: "this is level" |
| 3. Graph | Bars for the last 18 seconds of shaking, with a dotted line at the shake threshold | nothing |
| 4. Score | Your strongest shake ever and how many shakes in all, saved even when unplugged | 3 s: clear the records |
| 5. Ask | Ask a yes-or-no question, shake, and get a random answer | nothing |

The Shell prints every shake, button press and mode change, plus one status
line a second:

```
Display ready. 5 modes. Free memory: ... bytes.
Shake! 2.57 g  A NEW RECORD!
Button: 80 ms
Mode: Bubble
Button: 79 ms
Mode: Graph
Shake! 1.17 g
```

If the sensor stops answering, the title turns into a red **SENSOR FAIL**,
the LED blinks twice, and the program keeps trying once a second. When the
sensor comes back, everything carries on by itself.

## Things to Try

1. Change `SHAKE_THRESHOLD_G` in `config.py`. How gentle a shake can still
   count?
2. Shake along only one arrow at a time in program 04. Which line jumps?
3. Hold the breadboard in both hands and quickly drop your hands a few
   centimeters, then stop. For that split second the total push drops
   toward **0 g**. That is free fall! Can you spot the dip in program 05?
4. Add your own answers to the `ANSWERS` list in `lib/mode_ask.py`. Keep each
   one to 11 letters or fewer.
5. Have a shake-off with a friend in the Score mode. Who sets the record?

## When Things Go Wrong

| What you see | What to try |
|--------------|-------------|
| Program 01 finds no devices | Check VCC is on pin 36, not pin 40. Check CS goes to 3V3. Try swapping SDA and SCL |
| Program 01 finds 0x19, not 0x18 | Change `LIS3DH_ADDR` to `0x19` in `config.py`, or wire SDO to GND |
| Program 01 says LIS3DSH | You got the other chip. This kit cannot read it. Try another board from the pack |
| The total in program 02 is far from 1 g | Hold the board still. If it is still off, the sensor may be loose in the breadboard |
| The bubble runs downhill or sideways | Change `BUBBLE_FLIP_X`, `BUBBLE_FLIP_Y` or `BUBBLE_SWAP_XY` in `config.py` |
| The bubble says tilted on a flat table | Hold the button for one second in the Bubble mode to say "this is level" |
| Shakes are counted twice | Make `SHAKE_QUIET_MS` bigger |
| The screen stays dark | Run program 06. Check the display wiring and the BL pin |
| SENSOR FAIL on the screen | A sensor wire came loose. Push the wires back in. It recovers by itself |
| Thonny seems stuck when you plug in | `main.py` is running. Click the red Stop button |

## How the Math Works

**Turning bytes into g.** The sensor sends two bytes for each arrow. We glue
them into one number from 0 to 65535. Numbers of 32768 and up are really
negative, so we subtract 65536. In high-resolution mode only the top 12 bits
matter, so we shift the number right by 4. At the 4 g range each step is
2 thousandths of a g.

**Total push.** The three arrows point in three different directions, so we
cannot just add them. We use the Pythagorean theorem in three directions:

    total = square root of (x² + y² + z²)

**Shake strength.** Gravity always adds 1 g, even when nothing moves. So:

    shake strength = total minus 1, without the minus sign

Tipping the board moves gravity from one arrow to another, but the total
stays at 1 g. That is how the detector tells a shake from a tilt.

**Tilt angle.** When you tip the board, part of gravity slides onto the X and
Y arrows. That sideways part is the sine of the tilt angle. The Bubble mode
uses `asin()` to turn it back into degrees.

## LIS3DH Facts

| Item | Value |
|------|-------|
| Measures | 3 directions (X, Y, Z) |
| Ranges | ±2, ±4, ±8 or ±16 g (this kit uses ±4 g) |
| Resolution | 12 bits in high-resolution mode |
| Speed | 1 to 400 readings a second (this kit uses 100), up to 5,376 in low-power mode |
| Supply voltage | 1.71 to 3.6 V. Never 5 V |
| I2C address | 0x18 (SDO low) or 0x19 (SDO high) |
| WHO_AM_I | register 0x0F, always 0x33 |
| Extras not used here | built-in tap, double-tap and free-fall detection, a 32-reading memory (FIFO), 3 analog inputs, a temperature sensor |

## Checks to Do on Real Hardware

The simulator proved the logic, the screen layouts, the shake counting, the
button handling and the recovery from sensor failures. It cannot prove
timing, memory or real sensor behavior. When the boards arrive:

1. Run program 01. Is it really a LIS3DH, and at which address?
2. Run program 02 flat and on each side. Is the total close to 1 g each time?
3. Run program 05 and shake. Is 0.5 g a good threshold for a real hand?
4. Run program 07. Does one shake count exactly once?
5. Run program 09, tap through all five modes, and paste the Shell output.
   The `Free memory` line should be over 100,000 bytes.
6. In the Bubble mode, tip the board. Does the bubble go uphill? If not,
   change the `BUBBLE_` settings.
7. Pull the SDA wire for a few seconds. Expect SENSOR FAIL, two quick LED
   blinks, and recovery when you plug it back in.
8. Look for flicker, leftover pixels, or a long pause after a tap.
