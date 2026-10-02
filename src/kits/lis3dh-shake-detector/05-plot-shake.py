# Plot the Shake Strength in Thonny's Plotter
#
# Run 01-i2c-scanner.py and 02-get-single-reading.py first.
#
# Program 04 drew three lines, one for each arrow. That is a lot to watch.
# This program boils all three down to ONE number, the shake strength, and
# prints it twenty times a second:
#
#     0.01
#     0.02
#     1.84
#
# Shake strength is how far the total push is from the 1 g of gravity that
# a still sensor always feels. It is measured in g. Sitting still gives a
# flat line near 0. A shake makes a tall spike.
#
# To see the graph:
#   1. Start Thonny and open this file.
#   2. Choose View > Plotter from the menu.
#   3. Click the green Run button.
#   4. Tip the board slowly. The line barely moves!
#   5. Now shake it. Watch the spikes. How tall can you make one?
#
# Tipping changes X, Y and Z, but not the total, so it does not count as a
# shake. That is why the shake detector in programs 07 and 09 can tell a
# shake from a tilt.
#
# Press Ctrl-C or the red Stop button to stop.
#
# IMPORTANT: this program prints ONLY numbers, so the Plotter draws a
# clean graph. See 04-plot-xyz.py for why.
#
# Wiring (standard Pico breadboard):
#   LIS3DH VCC -> 3V3 OUT (pin 36)  <- NOT pin 40 (VBUS), that is 5V
#   LIS3DH GND -> GND
#   LIS3DH SDA -> GP0 (pin 1)
#   LIS3DH SCL -> GP1 (pin 2)
#   LIS3DH CS  -> 3V3 OUT
#   LIS3DH SDO -> GND

from machine import Pin, I2C
import math
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
        total = math.sqrt(x * x + y * y + z * z)
        shake = abs(total - 1.0)

        # One number, nothing else.
        print("{:.2f}".format(shake))

    except OSError:
        # A reading failed. Print nothing and try again. If the graph
        # freezes, stop and run 01-i2c-scanner.py.
        pass

    time.sleep_ms(SAMPLE_MS)
