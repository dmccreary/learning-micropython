# Take a Single Temperature and Humidity Reading from the SHT40
#
# Run 01-i2c-scanner.py first.  If the scanner does not print "TEST PASS"
# this program will not work either - fix the wiring first.
#
# How the SHT40 works:
#   1. We send it a one-byte command that says "take a measurement".
#   2. We wait about 10 milliseconds while the sensor does its work.
#   3. We read back 6 bytes: 2 bytes of temperature, 1 checksum byte,
#      2 bytes of humidity, and 1 more checksum byte.
#   4. We turn those raw numbers ("ticks") into degrees and percent.
#
# Wiring (standard Pico breadboard):
#   SHT40 VIN -> 3.3V (pin 36)
#   SHT40 GND -> GND
#   SHT40 SDA -> GP0 (pin 1)
#   SHT40 SCL -> GP1 (pin 2)

from machine import Pin, I2C
import time

SHT40_ADDR = 0x44        # the I2C address the scanner found
CMD_MEASURE_HIGH = 0xFD  # measure temperature + humidity, high precision
CMD_SOFT_RESET = 0x94    # restart the sensor, like unplugging and replugging

sda = Pin(0)
scl = Pin(1)
i2c = I2C(0, sda=sda, scl=scl, freq=400000)


def crc8(data):
    """Check that the bytes we read were not scrambled on the way.

    The SHT40 sends a checksum byte after each measurement.  We do the
    same math the sensor did, and if we get the same answer we know the
    data arrived safely.
    """
    crc = 0xFF
    for byte in data:
        crc = crc ^ byte
        for _ in range(8):
            if crc & 0x80:
                crc = ((crc << 1) ^ 0x31) & 0xFF
            else:
                crc = (crc << 1) & 0xFF
    return crc


def read_sht40():
    """Return one (temperature_c, humidity_percent) reading."""
    # Step 1: ask for a measurement
    i2c.writeto(SHT40_ADDR, bytes([CMD_MEASURE_HIGH]))

    # Step 2: wait for the sensor to finish (high precision needs 8.3 ms)
    time.sleep_ms(15)

    # Step 3: read the 6 bytes of the answer
    data = i2c.readfrom(SHT40_ADDR, 6)

    # Step 4: make sure nothing got scrambled
    if crc8(data[0:2]) != data[2]:
        raise ValueError("Temperature checksum failed")
    if crc8(data[3:5]) != data[5]:
        raise ValueError("Humidity checksum failed")

    # Step 5: glue each pair of bytes into one big number 0..65535
    temp_ticks = (data[0] << 8) | data[1]
    humidity_ticks = (data[3] << 8) | data[4]

    # Step 6: use the formulas from the SHT40 datasheet
    temperature_c = -45.0 + 175.0 * temp_ticks / 65535.0
    humidity = -6.0 + 125.0 * humidity_ticks / 65535.0

    # The humidity math can drift slightly past the ends, so clamp it
    if humidity > 100.0:
        humidity = 100.0
    if humidity < 0.0:
        humidity = 0.0

    return temperature_c, humidity


print("Reading the SHT40 at", hex(SHT40_ADDR), "...")
print()

# Give the sensor a clean start
i2c.writeto(SHT40_ADDR, bytes([CMD_SOFT_RESET]))
time.sleep_ms(10)

try:
    temperature_c, humidity = read_sht40()
    temperature_f = temperature_c * 9.0 / 5.0 + 32.0

    print("Temperature: {:.2f} C".format(temperature_c))
    print("Temperature: {:.2f} F".format(temperature_f))
    print("Humidity:    {:.2f} %".format(humidity))
    print()

    # A sanity check: room temperature should be somewhere in this range.
    # If your reading is way off, the sensor may be reading the heat of a
    # nearby part, or the wiring may be picking up noise.
    if -40.0 < temperature_c < 125.0:
        print("TEST PASS")
    else:
        print("Reading is outside the SHT40 range of -40 C to 125 C")
        print("TEST FAIL")

except OSError:
    print("Could not talk to the sensor at", hex(SHT40_ADDR))
    print("Run 01-i2c-scanner.py to check the wiring.")
    print("TEST FAIL")
except ValueError as error:
    print("Bad data from the sensor:", error)
    print("Try shorter jumper wires or a slower I2C speed.")
    print("TEST FAIL")
