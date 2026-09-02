# Continuously Log Temperature and Humidity from the SHT40
#
# Run 01-i2c-scanner.py and 02-get-single-temp-reading.py first.
# If both of those print "TEST PASS", this program will work too.
#
# This program takes a reading every few seconds and prints it as a row
# of comma separated values (CSV).  CSV is the format spreadsheets like,
# so you can copy the output from Thonny, paste it into a spreadsheet,
# and draw a graph of how the temperature changed over time.
#
# Press Ctrl-C (or the Stop button in Thonny) to stop logging.  The
# program will then print a summary of everything it saw.
#
# Try this: hold your thumb on the sensor and watch the numbers climb.
#
# Wiring (standard Pico breadboard):
#   SHT40 VIN -> 3V3 OUT (pin 36)  <- NOT pin 40 (VBUS), that is 5V
#   SHT40 GND -> GND
#   SHT40 SDA -> GP0 (pin 1)
#   SHT40 SCL -> GP1 (pin 2)

from machine import Pin, I2C
import time

SHT40_ADDR = 0x44        # the I2C address the scanner found
CMD_MEASURE_HIGH = 0xFD  # measure temperature + humidity, high precision
CMD_SOFT_RESET = 0x94    # restart the sensor

SAMPLE_SECONDS = 2       # how long to wait between readings

sda = Pin(0)
scl = Pin(1)
i2c = I2C(0, sda=sda, scl=scl, freq=400000)


def crc8(data):
    """Check that the bytes we read were not scrambled on the way."""
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
    i2c.writeto(SHT40_ADDR, bytes([CMD_MEASURE_HIGH]))
    time.sleep_ms(15)
    data = i2c.readfrom(SHT40_ADDR, 6)

    if crc8(data[0:2]) != data[2]:
        raise ValueError("Temperature checksum failed")
    if crc8(data[3:5]) != data[5]:
        raise ValueError("Humidity checksum failed")

    temp_ticks = (data[0] << 8) | data[1]
    humidity_ticks = (data[3] << 8) | data[4]

    temperature_c = -45.0 + 175.0 * temp_ticks / 65535.0
    humidity = -6.0 + 125.0 * humidity_ticks / 65535.0

    if humidity > 100.0:
        humidity = 100.0
    if humidity < 0.0:
        humidity = 0.0

    return temperature_c, humidity


# Give the sensor a clean start
i2c.writeto(SHT40_ADDR, bytes([CMD_SOFT_RESET]))
time.sleep_ms(10)

# These keep track of the highest and lowest numbers we have seen so far.
# We start them at None, which means "we have not seen anything yet".
sample_count = 0
error_count = 0
min_temp = None
max_temp = None
min_humidity = None
max_humidity = None

print("Logging every", SAMPLE_SECONDS, "seconds.  Press Ctrl-C to stop.")
print()
print("seconds,temp_c,temp_f,humidity")

# ticks_ms() counts milliseconds since the Pico turned on.  We remember
# the starting value so we can report seconds since logging began.
start_ms = time.ticks_ms()

try:
    while True:
        try:
            temperature_c, humidity = read_sht40()

            elapsed_ms = time.ticks_diff(time.ticks_ms(), start_ms)
            elapsed_seconds = elapsed_ms / 1000.0
            temperature_f = temperature_c * 9.0 / 5.0 + 32.0

            print("{:.1f},{:.2f},{:.2f},{:.2f}".format(
                elapsed_seconds, temperature_c, temperature_f, humidity))

            sample_count = sample_count + 1

            # The first reading becomes both the highest and the lowest.
            # After that we only replace them when we see a new record.
            if min_temp is None or temperature_c < min_temp:
                min_temp = temperature_c
            if max_temp is None or temperature_c > max_temp:
                max_temp = temperature_c
            if min_humidity is None or humidity < min_humidity:
                min_humidity = humidity
            if max_humidity is None or humidity > max_humidity:
                max_humidity = humidity

        except (OSError, ValueError) as error:
            # One bad reading should not stop a long logging run, so we
            # count the problem, print it, and keep going.
            error_count = error_count + 1
            print("# skipped a reading:", error)

        time.sleep(SAMPLE_SECONDS)

except KeyboardInterrupt:
    # Ctrl-C lands here.  Now we can print what we learned.
    print()
    print("Logging stopped.")
    print()
    print("Readings taken:", sample_count)
    print("Readings skipped:", error_count)

    if sample_count > 0:
        print("Coldest: {:.2f} C".format(min_temp))
        print("Warmest: {:.2f} C".format(max_temp))
        print("Driest:  {:.2f} %".format(min_humidity))
        print("Dampest: {:.2f} %".format(max_humidity))
        print()
        print("TEST PASS")
    else:
        print("No readings were taken.")
        print("TEST FAIL")
