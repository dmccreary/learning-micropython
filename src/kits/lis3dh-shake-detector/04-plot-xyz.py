# Plot X, Y and Z in Thonny's Plotter
#
# Run 01-i2c-scanner.py and 02-get-single-reading.py first.
#
# This program prints three numbers on every line and nothing else:
#
#     0.02 -0.01 1.01
#     0.03 -0.02 1.00
#
# They are the pushes along the X, Y and Z arrows, in g. Thonny's Plotter
# draws a moving line graph of any numbers your program prints, so you get
# a live picture of what the sensor is feeling, twenty times a second.
#
# To see the graph:
#   1. Start Thonny and open this file.
#   2. Choose View > Plotter from the menu. A graph panel appears
#      next to the Shell.
#   3. Click the green Run button.
#   4. Slowly tip the board forward, back and to each side. Watch one line
#      rise while another falls. Then give it a quick shake!
#
# There are three lines on the graph, one for each arrow, in the same order
# they are printed: X, then Y, then Z.
#
# Press Ctrl-C or the red Stop button to stop.
#
# IMPORTANT: this program prints ONLY numbers. The Plotter tries to
# graph every number it sees, so a stray "Hello" or "TEST PASS" would
# either clutter the graph or be drawn as a bogus data point. That is
# why there is no heading row and no summary here. Use
# 03-continuous-logging.py when you want labels, CSV and a summary.
#
# Wiring (standard Pico breadboard):
#   LIS3DH VCC -> 3V3 OUT (pin 36)  <- NOT pin 40 (VBUS), that is 5V
#   LIS3DH GND -> GND
#   LIS3DH SDA -> GP0 (pin 1)
#   LIS3DH SCL -> GP1 (pin 2)
#   LIS3DH CS  -> 3V3 OUT
#   LIS3DH SDO -> GND

from machine import Pin, I2C
import time
import config

# All of these come from config.py so you only ever edit them in one place.
LIS3DH_ADDR = config.LIS3DH_ADDR
SAMPLE_MS = config.PLOT_MS   # wait between points on the graph

# Register numbers from the LIS3DH datasheet (see 02-get-single-reading.py).
WHO_AM_I = 0x0F
CTRL_REG1 = 0x20
CTRL_REG4 = 0x23
OUT_X_L = 0x28
AUTO_NEXT = 0x80

RATE_CODES = {1: 1, 10: 2, 25: 3, 50: 4, 100: 5, 200: 6, 400: 7}
RANGE_CODES = {2: 0, 4: 1, 8: 2, 16: 3}
MG_PER_STEP = {2: 1, 4: 2, 8: 4, 16: 12}

sda = Pin(config.I2C_SDA_PIN)
scl = Pin(config.I2C_SCL_PIN)
i2c = I2C(config.I2C_BUS, sda=sda, scl=scl, freq=config.I2C_BUS_FREQ)


def start_lis3dh():
    """Check the chip's ID, then turn it on. Raises OSError if it will not answer."""
    chip_id = i2c.readfrom_mem(LIS3DH_ADDR, WHO_AM_I, 1)[0]
    if chip_id != config.LIS3DH_ID:
        raise ValueError("WHO_AM_I is {}, not {}".format(hex(chip_id), hex(config.LIS3DH_ID)))
    rate = RATE_CODES[config.LIS3DH_RATE_HZ]
    i2c.writeto_mem(LIS3DH_ADDR, CTRL_REG1, bytes([(rate << 4) | 0x07]))
    size = RANGE_CODES[config.LIS3DH_RANGE_G]
    i2c.writeto_mem(LIS3DH_ADDR, CTRL_REG4, bytes([0x80 | (size << 4) | 0x08]))
    time.sleep_ms(20)


def to_g(low, high):
    """Glue two bytes into one signed number and turn it into g."""
    raw = (high << 8) | low
    if raw >= 32768:
        raw = raw - 65536
    raw = raw >> 4
    return raw * MG_PER_STEP[config.LIS3DH_RANGE_G] / 1000.0


def read_lis3dh():
    """Return one (x, y, z) reading, in g."""
    data = i2c.readfrom_mem(LIS3DH_ADDR, OUT_X_L | AUTO_NEXT, 6)
    return to_g(data[0], data[1]), to_g(data[2], data[3]), to_g(data[4], data[5])


# Give the sensor a clean start.
#
# If the last program was stopped in the middle of a reading, the sensor can
# be left half way through a conversation and it will refuse to answer.
# Unplugging the Pico and plugging it back in always clears this.
try:
    start_lis3dh()
except (OSError, ValueError):
    print("The sensor is not answering.")
    print()
    print("Run 01-i2c-scanner.py to check the wiring. If the scanner passes,")
    print("unplug the Pico from USB, plug it back in, and run this again.")
    raise SystemExit

while True:
    try:
        x, y, z = read_lis3dh()

        # Three numbers, one space between each, nothing else.
        # Thonny draws one line on the graph for each number.
        print("{:.2f} {:.2f} {:.2f}".format(x, y, z))

    except OSError:
        # A reading failed. We print nothing at all and try again next
        # time around, because printing an error message here would draw
        # junk on the graph. If you see the graph freeze, stop the
        # program and run 01-i2c-scanner.py to check the wiring.
        pass

    time.sleep_ms(SAMPLE_MS)
