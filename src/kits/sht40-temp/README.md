# SHT40 Temperature and Humidity Kit

Measure the temperature and humidity of the air around you, then watch
both numbers change on a live graph.

The SHT40 is a tiny sensor made by Sensirion. It measures two things at
once: how warm the air is, and how much water is floating in it. It talks
to your Pico over I2C, which is a two-wire system that lets chips send
numbers to each other.

## What You Need

| Part | Notes |
|------|-------|
| Raspberry Pi Pico | Any Pico or Pico W with MicroPython already installed |
| SHT40 breakout board | About $1.65 on eBay. Adafruit #4885 or SparkFun SEN-18652 cost more but ship faster |
| Solderless breadboard | Half-size is plenty |
| 4 jumper wires | Male-to-male |
| USB cable | Must be a data cable, not a charge-only cable |

## Wiring

The SHT40 runs on 3.3 volts. Do **not** connect it to the 5V pin. Too much
voltage can damage the sensor.

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

## Upload the Programs

Plug the Pico into your computer, then run:

```bash
./upload-code.sh
```

The script lists every serial port on your Mac, works out which one is
your Pico, and copies all four lesson programs onto it.

If you have two boards plugged in, the script stops and asks you to pick
one:

```bash
PORT=/dev/cu.usbmodem14301 ./upload-code.sh
```

If the script says something else is using the port, close Thonny and try
again. Only one program can talk to the Pico at a time.

## The Programs

The source files live in
[`src/sensors/sht40-temp/`](../../sensors/sht40-temp/). Run them in order.

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

## Things to Try

- Put the sensor in the refrigerator for a minute, then watch it warm back up.
- Hold the sensor near a window on a cold day and compare it to the middle
  of the room.
- Breathe on the sensor. Which line moves first, temperature or humidity?
- Change `SAMPLE_SECONDS` in program 03 to 10 and log your bedroom overnight.

## When Things Go Wrong

| What you see | What to try |
|--------------|-------------|
| Scanner finds no devices | Check VIN goes to 3.3V, not 5V. Check GND is connected. |
| Scanner finds no devices | Try swapping the SDA and SCL wires. They are easy to mix up. |
| Scanner finds a device, but not at 0x44 | Read the number it found. Your board may use 0x45 or 0x46. Change `SHT40_ADDR` in the programs. |
| "Checksum failed" | Use shorter jumper wires, or lower `freq=400000` to `freq=100000`. |
| Temperature reads a few degrees high | Normal. The Pico and the sensor both make a little heat. Move the sensor away from the board. |
| Upload script says the port is busy | Close Thonny, or click its red Stop button. |

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
