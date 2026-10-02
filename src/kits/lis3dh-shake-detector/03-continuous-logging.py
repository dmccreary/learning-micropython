# Continuously Log the LIS3DH Accelerometer
#
# Run 01-i2c-scanner.py and 02-get-single-reading.py first.
# If both of those print "TEST PASS", this program will work too.
#
# This program takes a reading four times a second and prints it as a row
# of comma separated values (CSV). CSV is the format spreadsheets like, so
# you can copy the output from Thonny, paste it into a spreadsheet, and
# draw a graph of how the sensor moved.
#
# Each row has the time, the three arrows X, Y and Z, the total push, and
# the "shake strength". Shake strength is how far the total push is from
# the 1 g that gravity gives a sensor sitting still:
#
#     shake strength = the total push minus 1 g, without the minus sign
#
# Sitting still, the shake strength is close to 0. Shake the board and it
# jumps up.
#
# Press Ctrl-C (or the Stop button in Thonny) to stop logging. The program
# will then print a summary of everything it saw.
#
# Try this: slowly tip the board on its side. X, Y and Z change a lot, but
# the shake strength hardly moves. Tipping is not shaking!
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
SAMPLE_MS = config.LOG_MS   # how long to wait between readings

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

print("Logging every {} ms. Press Ctrl-C to stop.".format(SAMPLE_MS))
print()
print("seconds,x,y,z,total,shake")

start = time.ticks_ms()
count = 0
failures = 0
biggest_shake = 0.0
biggest_shake_time = 0.0
shakes = 0
was_shaking = False

try:
    while True:
        try:
            x, y, z = read_lis3dh()
        except OSError:
            # A reading failed. Count it and try again next time.
            failures = failures + 1
        else:
            seconds = time.ticks_diff(time.ticks_ms(), start) / 1000.0
            total = math.sqrt(x * x + y * y + z * z)
            shake = abs(total - 1.0)
            print("{:.2f},{:.2f},{:.2f},{:.2f},{:.2f},{:.2f}".format(
                seconds, x, y, z, total, shake))
            count = count + 1

            if shake > biggest_shake:
                biggest_shake = shake
                biggest_shake_time = seconds

            # Count a new shake each time the strength climbs over the line.
            shaking = shake >= config.SHAKE_THRESHOLD_G
            if shaking and not was_shaking:
                shakes = shakes + 1
            was_shaking = shaking

        time.sleep_ms(SAMPLE_MS)

except KeyboardInterrupt:
    print()
    print("Got Ctrl-C, stopping.")
    print()
    print("Summary")
    print("  readings:       {}".format(count))
    print("  failed reads:   {}".format(failures))
    print("  biggest shake:  {:.2f} g at {:.2f} seconds".format(
        biggest_shake, biggest_shake_time))
    print("  shakes counted: {} (each time the strength went over {} g)".format(
        shakes, config.SHAKE_THRESHOLD_G))
    print()
    if count > 0:
        print("TEST PASS")
    else:
        print("No readings were taken. Run 01-i2c-scanner.py to check the wiring.")
        print("TEST FAIL")
