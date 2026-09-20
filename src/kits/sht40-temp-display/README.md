# SHT40 Temperature and Humidity Kit with a Round Smartwatch Display

Measure the temperature and humidity of the air around you, then show
both numbers on a low-cost round display, the kind made for smartwatches.

The SHT40 is a tiny sensor made by Sensirion. It measures two things at
once: how warm the air is, and how much water is floating in it. It talks
to your Pico over I2C, which is a two-wire system that lets chips send
numbers to each other.

The screen is a GC9A01, a round 240 x 240 color display that costs about $5.
It was made for smartwatches, but here it is a window that lets you watch the
very precise, very fast SHT40 at work. It talks to your Pico over SPI, a faster wiring system with
five wires.

This kit is the plain SHT40 kit plus the round display and a push button.
Programs 01 to 04 are the same lessons as before. Programs 05 to 09 are new.
Program 05 plots the temperature on its own. Programs 06 and 07 put the
readings on the screen. Programs 08 and 09 add a button and six display
modes.

This kit has no NeoPixel strip. The plain SHT40 kit uses program 05 to
light a NeoPixel strip, so here that number is used for the temperature
plot instead.

## What You Need

| Part | Notes |
|------|-------|
| Raspberry Pi Pico | Any Pico or Pico W with MicroPython already installed |
| SHT40 breakout board | About $1.65 on eBay. Adafruit #4885 or SparkFun SEN-18652 cost more but ship faster |
| GC9A01 round display | 240 x 240, 1.28 inch, with SPI pins (SCL, SDA, DC, CS, RST) |
| Solderless breadboard | Half-size is plenty |
| Push button | Any small push button (a tactile switch). It needs two wires |
| About 13 jumper wires | 4 for the sensor (male-to-male), 7 for the display and 2 for the button. Use female-to-male wires for the display if its pins stick out |
| USB cable | Must be a data cable, not a charge-only cable |

## Wiring

Both parts run on 3.3 volts. Do **not** connect either one to pin 40
(VBUS), which carries 5 volts straight from the USB cable. Too much
voltage can damage them.

### The SHT40 sensor

1. Put the Pico on the breadboard with the USB port facing off the edge.
2. Connect SHT40 **VIN** to Pico pin 36 (3V3 OUT).
3. Connect SHT40 **GND** to any Pico GND pin, such as pin 38.
4. Connect SHT40 **SDA** to Pico pin 1 (GP0).
5. Connect SHT40 **SCL** to Pico pin 2 (GP1).

| SHT40 pin | Pico pin | Pico name | What it does |
|-----------|----------|-----------|--------------|
| VIN | 36 | 3V3 OUT | Power in |
| GND | 38 | GND | Ground |
| SDA | 1 | GP0 | Data line |
| SCL | 2 | GP1 | Clock line |

SDA is short for Serial Data. It carries the numbers. SCL is short for
Serial Clock. It keeps both chips in step, like a metronome.

### The round display

| Display pin | Pico pin | Pico name | What it does |
|-------------|----------|-----------|--------------|
| VCC | 36 | 3V3 OUT | Power in (share this pin with the sensor's VIN) |
| GND | 3 or 8 | GND | Ground |
| SCL (or CLK) | 4 | GP2 | Clock line |
| SDA (or MOSI) | 5 | GP3 | Data line |
| DC | 6 | GP4 | Tells the display "this is a command" or "this is a pixel" |
| CS | 7 | GP5 | Picks this display when more than one chip is listening |
| RST | 9 | GP6 | Restarts the display |

Some displays also have a **BL** pin, short for backlight. Most boards keep
the backlight on by themselves. If your screen stays dark even though
everything else is right, connect BL to pin 36 (3V3 OUT).

The display's pins are labeled SCL and SDA just like the sensor's, but
they are **not** the I2C wires. The display's SCL and SDA go to GP2 and
GP3. The sensor's SCL and SDA go to GP0 and GP1. Do not mix them up.

### The push button

The button needs no outside resistor. Program 09 turns on the Pico's own
**pull-up resistor**, which holds the pin at 3.3 volts. Pressing the button
connects the pin to GND, so a press reads as 0.

1. Connect one leg of the button to Pico pin 20 (GP15). This is the pin in
   the bottom left corner of the Pico when the USB port is at the top.
2. Connect the other leg of the button to Pico pin 18 (GND).

| Button | Pico pin | Pico name | What it does |
|--------|----------|-----------|--------------|
| One leg | 20 | GP15 | Reads 1 normally and 0 while pressed |
| Other leg | 18 | GND | Ground |

It does not matter which leg goes where. Run program 08 to test the button.

Every pin number lives in `config.py`, so if you wire something to a
different pin, change it there and every program follows.

## Upload the Programs

Plug the Pico into your computer, then run:

```bash
./upload-code.sh
```

The script lists every serial port on your Mac, works out which one is
your Pico, and copies everything onto it:

- the `lib` folder, which holds the display driver, two fonts, a shapes
  helper, and the small files the display modes share (the display
  programs cannot run without it)
- `config.py`
- every numbered lesson program
- a second copy of program 09, saved as `main.py`

A Pico runs `main.py` all by itself when it powers up. Once the script
finishes, unplug the Pico and plug it back in. The display starts with
no computer needed, so you can power it from a phone charger or a battery
pack. To stop it, plug the Pico into Thonny and click the red Stop button.

Want a different program to start by itself? Change the `MAIN_LAB` line at
the top of `upload-code.sh`.

If you have two boards plugged in, the script stops and asks you to pick
one:

```bash
PORT=/dev/cu.usbmodem14301 ./upload-code.sh
```

If the script says something else is using the port, close Thonny and try
again. Only one program can talk to the Pico at a time.

## The Programs

The source files live in this same folder, next to this README. Run them
in order.

### 01-i2c-scanner.py

Asks the I2C bus "who is out there?" and prints every address that
answers. Run this one first, every time. If the scanner cannot see the
sensor, nothing else will work either.

A working scan looks like this:

```
Found 1 device(s):
  decimal: 68  hex: 0x44
SHT40 found at 0x44 - SHT40-AD1B (most common)
TEST PASS
```

An address is like a house number on the I2C street. The SHT40 lives at
0x44 on most boards. A few boards use 0x45 or 0x46, and the scanner
knows all three.

### 02-get-single-temp-reading.py

Takes one reading and prints it in Celsius, Fahrenheit and percent.

```
Temperature: 26.81 C
Temperature: 80.25 F
Humidity:    49.76 %
TEST PASS
```

This program also checks the sensor's math. The SHT40 sends a checksum
with every reading, which is a small number the sensor calculates from
the data. Your Pico does the same calculation. If the two answers match,
the data arrived safely.

### 03-continuous-logging.py

Takes a reading every 2 seconds and prints it as comma separated values
(CSV). CSV is the format spreadsheets like best.

```
seconds,temp_c,temp_f,humidity
0.0,26.91,80.44,51.18
2.0,26.93,80.48,50.71
4.1,26.94,80.48,50.32
```

Copy the output out of Thonny, paste it into a spreadsheet, and draw a
graph of how your room changed. Press Ctrl-C to stop. The program then
prints the warmest, coldest, dampest and driest values it saw.

### 04-plot-temp-and-humidity.py

Prints just two numbers per line so Thonny can draw them as a live graph.

1. Open the file in Thonny.
2. Choose **View > Plotter** from the menu.
3. Click the green Run button.
4. Breathe on the sensor and watch both lines jump.

This program prints no headings and no messages. Thonny's Plotter graphs
every number it sees, so a stray word would draw junk on your graph.

### 05-plot-temperature.py

The same idea as program 04, but it draws only one line: the temperature.
It prints one number per line, in degrees Fahrenheit, and nothing else.

1. Open the file in Thonny.
2. Choose **View > Plotter** from the menu.
3. Click the green Run button.
4. Press a fingertip on the sensor and watch the line climb.

```
80.49
80.53
80.56
```

Program 05 only checks the temperature half of each reading. If the
humidity half of a reading gets scrambled, program 04 skips the whole
reading, but program 05 still plots the temperature.

The sensor measures in Celsius, so the program changes each reading to
Fahrenheit before it prints. Want Celsius instead? Print `temperature_c`
instead of `temperature_f` in the loop at the bottom of the program.

### 06-display-hello.py

Writes "Hello World!" in big letters in the middle of the round screen.
It never touches the sensor, so you can run it before the SHT40 is
plugged in. Run it before program 07 so you know the display works.

```
Drew 'Hello World!' at x=24, y=104
Look at the display. Do you see Hello World?
TEST PASS
```

If the screen stays dark, check the display wiring table above.

### 07-display-temp-humidity.py

The full display. Once a second it reads the SHT40 and draws:

- the temperature in big letters, in Fahrenheit, with Celsius underneath
- the humidity in big letters, with a bar that fills from empty to full
- a white ring around the edge of the screen

The temperature changes color as the air gets warmer: cyan for cool,
green for comfortable, orange for warm and red for hot. Open `config.py`
and change `TEMP_COOL_F`, `TEMP_WARM_F` and `TEMP_HOT_F` to move the
places where the colors switch.

If the sensor stops answering, the word TEMPERATURE at the top turns into
a red SENSOR FAIL, and the numbers stay frozen until the sensor answers
again.

The program also prints every reading in the Shell, so you can watch the
numbers on the screen and on your computer at the same time.

**Why does the screen not flicker?** This display has no frame buffer, so
you cannot wipe it and redraw it fast like a game does. Wiping the whole
screen every second would flash like a strobe light. So the program draws
everything that never changes once (the ring, the labels, the divider
line) and then, each second, writes only the numbers. Each number is
always the same width, and every letter is drawn with a black background,
so the new digits land right on top of the old ones and cover them up.

### 08-button-and-led-test.py

Tests the push button and the blinking LED. It does not need the sensor
or the screen.

1. Run the program. The green LED on the Pico blinks once a second. That
   blink is called a **heartbeat**.
2. Press the button three times. Try a quick tap, and try holding it for a
   second or more.

```
Button on GP15. Press it 3 times.
Taps shorter than 50 ms are ignored as button bounce.
The green LED blinks once a second. Press Ctrl-C to give up.

Press 1: 120 ms, a tap (next mode)
Press 2: 1100 ms, a hold (switch F and C)
Press 3: 3300 ms, a long hold (clear the records in Hi/Lo)

The button works!
TEST PASS
```

If the program says the button reads PRESSED when nobody is touching it,
check the two button wires.

The button waits until it has been still for 50 milliseconds before it
trusts what it sees. That wait is called a **debounce**. It means a very
quick tap, shorter than 50 milliseconds, is ignored. Normal taps are much longer.

### 09-smartwatch-modes.py

The six-mode sensor display. A tap on the button switches to the next of six screens.

| # | Mode | What you see |
|---|------|--------------|
| 1 | Classic | The classic display from program 07 |
| 2 | Buddy | A cartoon face that feels the air. The whole face is a mood-ring color: blue when it is cold, green when it is comfy, red when it is hot. Buddy shivers, smiles, sweats and blinks |
| 3 | Live | A graph of the last three minutes of temperature. The line changes color with the temperature |
| 4 | Ring | Two rainbow ring gauges. The outer ring is the temperature and the inner ring is the humidity |
| 5 | Finger | Press a fingertip on the sensor and watch a thermometer fill up to 90 F |
| 6 | Hi/Lo | The highest and lowest temperature and humidity ever felt, saved even after you unplug the Pico |

A row of small dots at the bottom of the screen shows which mode you are
in. The bright dot is the current mode.

**The button**

| What you do | What happens |
|-------------|--------------|
| Tap | Go to the next mode. After Hi/Lo it starts over at Classic |
| Hold for about a second | Switch between Fahrenheit (F) and Celsius (C) |
| Hold for 3 seconds (in Hi/Lo) | Clear the records |

**The blinking LED**

The green LED on the Pico blinks once every time the sensor is read, so
the speed of the blinking is the speed of the readings. Try the Finger
mode: it reads faster, so the LED blinks faster too. Two quick blinks mean
a reading failed. If the LED stops blinking, the program has stopped.

**Mood-ring colors**

A mood ring changes color with how you feel. The display does the same with
the temperature. It spreads the colors along a line from blue (cold)
through cyan, green and orange to red (hot), and each temperature gets its
own color. Look for it in the dots around the rim, Buddy's face, the graph
line, the Ring gauges and the thermometer. The two ends of the line are
`MOOD_COLD_F` and `MOOD_HOT_F` in `config.py`.

**Things to know**

- The display keeps track of the highest and lowest readings in **every**
  mode, not just Hi/Lo. Touching the sensor with a warm finger will set a
  new high!
- The records are saved in a file called `records.txt` on the Pico. To be
  kind to the Pico's flash memory, a new record is saved at most once a
  minute, and when you press Ctrl-C.
- The Live graph draws one dot column for every reading. When it reaches
  the right edge it starts over on the left.
- If the sensor stops answering, the title at the top of the screen turns
  into a red SENSOR FAIL. The display keeps trying and comes back to life by
  itself when the sensor answers.

**Settings in `config.py`**

| Setting | What it does |
|---------|--------------|
| `BUTTON_PIN`, `BUTTON_DEBOUNCE_MS` | The pin the button is wired to (15), and how long it must be still before we trust it (50 ms) |
| `LONG_PRESS_MS`, `CLEAR_PRESS_MS` | How long to hold the button to switch F and C, and to clear the records |
| `MOOD_COLD_F`, `MOOD_HOT_F` | The two ends of the mood-ring color line |
| `BUDDY_COLD_F` and `TEMP_*_F` | Where Buddy starts shivering, and when Buddy looks cool, comfy, warm and hot |
| `LIVE_WIDTH` | How many readings wide the Live graph is |
| `FINGER_TARGET_F` | The temperature that fills the thermometer in Finger mode |
| `HEARTBEAT_MS` | How long each blink of the LED lasts |

**How the program is built**

Program 09 is short because most of the work lives in small files in the
`lib` folder. Open them and read them!

| File | What it does |
|------|--------------|
| `sht40.py` | Reads the sensor |
| `button.py` | The button. It uses an **interrupt**, so a press is never missed, even while the screen is busy drawing. It waits for the button to stop bouncing (50 ms) before it decides what happened |
| `heartbeat.py` | The blinking LED |
| `records.py` | The highest and lowest readings, saved in a file |
| `widgets.py` | Colors, the water drop and thermometer icons, and the ring gauges. They are all built from rectangles, circles and triangles |
| `watch_ctx.py` | What every mode shares, and the pattern every mode follows: draw the fixed parts once, then update the numbers |
| `mode_*.py` | One small file for each of the six modes |

## Things to Try

- Breathe on the sensor while the display is running. Watch the
  humidity bar jump, then slowly drain back down.
- Change `TEMP_WARM_F` in `config.py` to 70, upload again, and see when
  the temperature turns orange.
- Change `DISPLAY_SECONDS` in `config.py` to 10. How does the display feel
  when it updates less often?
- In program 09, go to Buddy and breathe on the sensor. Does Buddy's
  caption change?
- Try the Finger mode. Can you make the thermometer reach the goal in under
  ten seconds? What happens when you take your finger away?
- Change `MOOD_COLD_F` and `MOOD_HOT_F` to squeeze the rainbow into a
  smaller range, then watch how the colors change in your room.
- Watch the green LED while you switch to the Finger mode. Why does it
  blink faster?

- Put the sensor in the refrigerator for a minute, then watch it warm back up.
- Hold the sensor near a window on a cold day and compare it to the middle
  of the room.
- Breathe on the sensor. Which line moves first, temperature or humidity?
- Change `SAMPLE_SECONDS` in program 03 to 10 and log your bedroom overnight.

## When Things Go Wrong

| What you see | What to try |
|--------------|-------------|
| Scanner finds no devices | Check VIN goes to pin 36 (3V3 OUT), not pin 40 (VBUS). Check GND is connected. |
| Scanner finds no devices | Try swapping the SDA and SCL wires. They are easy to mix up. |
| Scanner finds a device, but not at 0x44 | Read the number it found. Your board may use 0x45 or 0x46. Change `SHT40_ADDR` in the programs. |
| "Checksum failed" | Use shorter jumper wires, or lower `freq=400000` to `freq=100000`. |
| Temperature reads a few degrees high | Normal. The Pico and the sensor both make a little heat. The display's backlight makes some too, so keep the sensor a little way from the display as well as the board. |
| Upload script says the port is busy | Close Thonny, or click its red Stop button. |
| The display stays dark | Check VCC is on pin 36 (3V3 OUT) and GND is connected. Then check DC, CS and RST, the three wires that are easiest to swap. Run program 06 to test the display by itself. |
| The display shows static or garbage | SCL and SDA on the display go to GP2 and GP3, not GP0 and GP1. Check they are not swapped with each other. |
| "ImportError: no module named 'gc9a01'" | The `lib` folder is not on the Pico. Run `./upload-code.sh` again. |
| The program starts by itself and Thonny cannot connect | That is `main.py` running. Click Thonny's red Stop button, or press Ctrl-C in the Shell. |
| The display says SENSOR FAIL | The sensor is not answering. Run program 01 to check the wiring. If program 01 passes, unplug the Pico and plug it back in. |
| Program 08 says the button reads PRESSED, or never sees a press | Check the button wires: one leg to pin 20 (GP15) and the other to pin 18 (GND). Push both wires all the way in. |
| The button changes modes on its own | A loose wire can act like a press. Check that both button wires are pushed in firmly. |
| The green LED never blinks | Program 09 is not running. Unplug the Pico and plug it back in, or run program 09 in Thonny. |
| The green LED stops blinking | The program has stopped. Unplug the Pico and plug it back in. |
| The green LED blinks twice, quickly | A reading failed. Run program 01 to check the sensor wiring. |
| "MemoryError" when program 09 starts | The Pico ran out of memory. Unplug it, plug it back in and run program 09 again without running anything else first. |
| The Hi/Lo records look wrong | Touching the sensor or breathing on it sets records too. Hold the button for 3 seconds in the Hi/Lo mode to clear them. |

## How the Math Works

The sensor does not send degrees. It sends a raw count between 0 and
65535, which the datasheet calls "ticks". Your program turns ticks into
real units with these two formulas:

```python
temperature_c = -45.0 + 175.0 * temp_ticks / 65535.0
humidity = -6.0 + 125.0 * humidity_ticks / 65535.0
```

The temperature formula spreads the range -45 C to 130 C across all the
possible ticks. The humidity formula spreads -6 % to 119 % the same way.
Humidity cannot really go below 0 or above 100, so the programs trim any
value that lands outside those limits.

## Sensor Facts

| Item | Value |
|------|-------|
| Temperature range | -40 C to 125 C |
| Temperature accuracy | Plus or minus 0.2 C |
| Humidity range | 0 % to 100 % |
| Humidity accuracy | Plus or minus 1.8 % |
| I2C address | 0x44, 0x45 or 0x46 depending on the board |
| Supply voltage | 1.08 V to 3.6 V (use 3.3 V) |
| Measurement time | About 8.3 milliseconds at high precision |
