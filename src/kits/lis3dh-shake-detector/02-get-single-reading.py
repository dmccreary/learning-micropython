# Take a Single Reading from the LIS3DH: the Gravity Check
#
# Run 01-i2c-scanner.py first. If the scanner does not print "TEST PASS"
# this program will not work either - fix the wiring first.
#
# An accelerometer feels pushes and pulls. It measures them in "g". One g
# is the pull of Earth's gravity. The LIS3DH feels in three directions at
# once, called X, Y and Z. Look closely at your board: there are usually
# little arrows printed on it that show which way each one points.
#
# Here is the surprise: a sensor lying perfectly still is NOT reading zero.
# It feels gravity pulling down, so the arrow that points up reads about 1 g.
# This program uses that as a test. Lay the board flat, hold still, and the
# total should come out very close to 1 g.
#
# How the LIS3DH works:
#   1. We write two settings into the chip: how often to measure, and how
#      big a push to expect.
#   2. The chip measures all by itself, many times a second.
#   3. We read back 6 bytes: 2 bytes for X, 2 for Y and 2 for Z.
#   4. We turn those raw numbers into g.
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

# Register numbers from the LIS3DH datasheet. A register is a tiny memory
# box inside the chip. Some hold settings, and some hold measurements.
WHO_AM_I = 0x0F     # always holds 0x33 on a LIS3DH
CTRL_REG1 = 0x20    # how often to measure, and which arrows to use
CTRL_REG4 = 0x23    # how big a push to expect, and high resolution
OUT_X_L = 0x28      # the first of the six measurement bytes
AUTO_NEXT = 0x80    # add this to a register number to read many in a row

# The codes the datasheet uses for each setting.
RATE_CODES = {1: 1, 10: 2, 25: 3, 50: 4, 100: 5, 200: 6, 400: 7}
RANGE_CODES = {2: 0, 4: 1, 8: 2, 16: 3}
# How many thousandths of a g one step of the raw number is worth.
MG_PER_STEP = {2: 1, 4: 2, 8: 4, 16: 12}

sda = Pin(config.I2C_SDA_PIN)
scl = Pin(config.I2C_SCL_PIN)
i2c = I2C(config.I2C_BUS, sda=sda, scl=scl, freq=config.I2C_BUS_FREQ)


def start_lis3dh():
    """Check the chip's ID, then turn it on. Raises OSError if it will not answer."""
    chip_id = i2c.readfrom_mem(LIS3DH_ADDR, WHO_AM_I, 1)[0]
    if chip_id != config.LIS3DH_ID:
        raise ValueError("WHO_AM_I is {}, not {}".format(hex(chip_id), hex(config.LIS3DH_ID)))

    # CTRL_REG1: the rate goes in the top four bits. The bottom three bits
    # (0x07) switch on the X, Y and Z arrows.
    rate = RATE_CODES[config.LIS3DH_RATE_HZ]
    i2c.writeto_mem(LIS3DH_ADDR, CTRL_REG1, bytes([(rate << 4) | 0x07]))

    # CTRL_REG4: 0x80 keeps the two halves of each number together, the
    # range goes in bits 4 and 5, and 0x08 asks for high resolution.
    size = RANGE_CODES[config.LIS3DH_RANGE_G]
    i2c.writeto_mem(LIS3DH_ADDR, CTRL_REG4, bytes([0x80 | (size << 4) | 0x08]))

    # Give the chip time to take its first measurement.
    time.sleep_ms(20)


def to_g(low, high):
    """Glue two bytes into one signed number and turn it into g."""
    raw = (high << 8) | low          # a number from 0 to 65535
    if raw >= 32768:
        raw = raw - 65536            # the top half of the numbers are negative
    raw = raw >> 4                   # high resolution uses only the top 12 bits
    return raw * MG_PER_STEP[config.LIS3DH_RANGE_G] / 1000.0


def read_lis3dh():
    """Return one (x, y, z) reading, in g."""
    data = i2c.readfrom_mem(LIS3DH_ADDR, OUT_X_L | AUTO_NEXT, 6)
    x = to_g(data[0], data[1])
    y = to_g(data[2], data[3])
    z = to_g(data[4], data[5])
    return x, y, z


print("Reading the LIS3DH at", hex(LIS3DH_ADDR), "...")
print("Lay the board flat on the table and hold still.")
print()

# Give the sensor a clean start.
#
# If the last program was stopped in the middle of a reading, the sensor can
# be left half way through a conversation and it will refuse to answer.
# Unplugging the Pico and plugging it back in always clears this.
try:
    start_lis3dh()
except OSError:
    print("The sensor is not answering.")
    print()
    print("Run 01-i2c-scanner.py to check the wiring. If the scanner passes,")
    print("unplug the Pico from USB, plug it back in, and run this again.")
    raise SystemExit
except ValueError as error:
    print("This chip is not a LIS3DH:", error)
    print("Run 01-i2c-scanner.py to find out what it is.")
    raise SystemExit

try:
    x, y, z = read_lis3dh()

    # The total push, from all three arrows together. This is the
    # Pythagorean theorem, in three directions instead of two.
    total = math.sqrt(x * x + y * y + z * z)

    print("X: {:6.2f} g".format(x))
    print("Y: {:6.2f} g".format(y))
    print("Z: {:6.2f} g".format(z))
    print("Total: {:.2f} g".format(total))
    print()

    # Which arrow points most nearly up? It is the one feeling the most gravity.
    biggest = max(abs(x), abs(y), abs(z))
    if biggest == abs(x):
        name, value = "X", x
    elif biggest == abs(y):
        name, value = "Y", y
    else:
        name, value = "Z", z
    if value > 0:
        print("The {} arrow points up toward the sky.".format(name))
    else:
        print("The {} arrow points down toward the floor.".format(name))
    print()

    # The gravity check. A still sensor feels close to 1 g. Cheap sensors can
    # be off by a little, so anything from 0.8 to 1.2 passes.
    if 0.8 < total < 1.2:
        print("TEST PASS")
    else:
        print("The total should be close to 1 g when the board is still.")
        print("Hold the board still and run this again.")
        print("TEST FAIL")

except OSError:
    print("Could not talk to the sensor at", hex(LIS3DH_ADDR))
    print("Run 01-i2c-scanner.py to check the wiring.")
    print("TEST FAIL")
