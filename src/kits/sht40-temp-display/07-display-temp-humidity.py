# Temperature and Humidity on a Round Display
#
# Run 01-i2c-scanner.py, 02-get-single-temp-reading.py and
# 06-display-hello.py first. If all three print "TEST PASS", this program
# will work too.
#
# This program reads the SHT40 once a second and draws this on the screen:
#
#   - The top half is the temperature in big letters, with the same
#     temperature in Celsius underneath. The color tells you how warm it
#     is: cyan is cool, green is comfy, orange is warm and red is hot.
#     (You can change where those colors switch in config.py.)
#   - The bottom half is the humidity, with a bar that fills up as the
#     air gets damper.
#   - A ring runs around the rim, just inside the edge of the glass.
#
# If the sensor stops answering, the word TEMPERATURE turns into a red
# SENSOR FAIL and the numbers freeze until the sensor comes back.
#
# Press Ctrl-C (or the Stop button in Thonny) to stop.
#
# HOW WE STOP THE FLICKER
# This display has no frame buffer, so we cannot "clear and redraw" like a
# game does. Wiping the whole screen every second would flash like a strobe
# light. Instead we draw everything that never changes (the ring, the
# labels, the divider line) ONCE, and every second we only write the
# numbers. Each number is always the same width, and text() paints a
# background color behind every letter, so the new digits land right on top
# of the old ones. No clearing, no flicker, no leftover digits.
#
# Wiring is in config.py. Change pin numbers there, not here.

from machine import Pin, I2C
import time
import config
import shapes
import vga1_8x16 as SMALL_FONT            # 8 x 16, for the labels
import vga1_bold_16x32 as BIG_FONT         # 16 x 32, for the numbers

# --- Set up the hardware ---------------------------------------------
i2c = I2C(config.I2C_BUS,
          sda=Pin(config.I2C_SDA_PIN),
          scl=Pin(config.I2C_SCL_PIN),
          freq=config.I2C_BUS_FREQ)

display = config.init_display()

# --- Where everything goes on the 240 x 240 screen --------------------
# The screen is round, so the rows near the top and bottom are narrower
# than the rows in the middle. Everything below was placed so its widest
# part still fits inside the circle.
CENTER_X = config.CENTER_X
CENTER_Y = config.CENTER_Y

TEMP_LABEL_Y = 36
TEMP_VALUE_Y = 56
TEMP_C_Y = 92
DIVIDER_Y = 118
HUMIDITY_LABEL_Y = 128
HUMIDITY_VALUE_Y = 148
BAR_Y = 194
BAR_WIDTH = 120
BAR_HEIGHT = 10
BAR_X = CENTER_X - BAR_WIDTH // 2

# The temperature line is seven slots of 16 pixels: five for the digits,
# one for the little degree ring, and one for the letter F. Being exactly
# the same width every time is what lets each new reading paint right over
# the old one.
#
# The digits are five slots wide so that 100.0 and -10.0 still fit, but a
# normal reading like 72.5 only fills four of them and leaves a blank slot
# on the left. We slide the whole line half a slot to the left, so the part
# you can SEE sits in the middle of the screen.
TEMP_DIGITS = 5
TEMP_LINE_WIDTH = (TEMP_DIGITS + 2) * BIG_FONT.WIDTH
TEMP_X = CENTER_X - TEMP_LINE_WIDTH // 2 - BIG_FONT.WIDTH // 2

# The humidity line is six slots: five for the digits and one for the "%".
# It has the same blank slot on the left, so it slides half a slot too.
HUMIDITY_LINE_WIDTH = 6 * BIG_FONT.WIDTH
HUMIDITY_X = CENTER_X - HUMIDITY_LINE_WIDTH // 2 - BIG_FONT.WIDTH // 2

# Both labels are exactly 11 letters, so a swap between them lands on the
# same pixels too.
LABEL_TEXT = "TEMPERATURE"
LABEL_ERROR_TEXT = "SENSOR FAIL"
LABEL_X = CENTER_X - (len(LABEL_TEXT) * SMALL_FONT.WIDTH) // 2

# The little Celsius line under the big number is seven small slots
# ("%5.1f C"), with the same blank slot on the left.
TEMP_C_X = CENTER_X - (7 * SMALL_FONT.WIDTH) // 2 - SMALL_FONT.WIDTH // 2


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
    i2c.writeto(config.SHT40_ADDR, bytes([config.SHT40_CMD_MEASURE_HIGH]))
    time.sleep_ms(config.SHT40_MEASURE_MS)
    data = i2c.readfrom(config.SHT40_ADDR, 6)

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


def temperature_color(temperature_f):
    """Pick the color of the big temperature number."""
    if temperature_f < config.TEMP_COOL_F:
        return config.CYAN
    if temperature_f < config.TEMP_WARM_F:
        return config.GREEN
    if temperature_f < config.TEMP_HOT_F:
        return config.ORANGE
    return config.RED


def show_message(*lines):
    """Wipe the screen and write a few short lines of text on it."""
    display.fill(config.BLACK)
    for row, line in enumerate(lines):
        x = CENTER_X - (len(line) * SMALL_FONT.WIDTH) // 2
        display.text(SMALL_FONT, line, x, 96 + row * 20, config.WHITE, config.BLACK)


def draw_watch_face():
    """Draw everything that never changes. We do this once."""
    display.fill(config.BLACK)
    shapes.ring(display, CENTER_X, CENTER_Y, config.SAFE_RADIUS, config.WHITE, 2)

    display.text(SMALL_FONT, LABEL_TEXT, LABEL_X, TEMP_LABEL_Y,
                 config.WHITE, config.BLACK)

    # A thin line splits the temperature half from the humidity half.
    display.hline(CENTER_X - 70, DIVIDER_Y, 140, config.GREY)

    label = "HUMIDITY"
    display.text(SMALL_FONT, label,
                 CENTER_X - (len(label) * SMALL_FONT.WIDTH) // 2,
                 HUMIDITY_LABEL_Y, config.WHITE, config.BLACK)

    # An outline for the humidity bar. The inside is filled in every update.
    display.rect(BAR_X - 2, BAR_Y - 2, BAR_WIDTH + 4, BAR_HEIGHT + 4, config.WHITE)


def draw_temperature(temperature_c, temperature_f):
    color = temperature_color(temperature_f)

    # "%5.1f" pads the number with spaces on the left to make it exactly
    # five letters wide. (We use old-style % formatting here because it is
    # the safest choice for numbers with a fixed width on MicroPython.)
    digits = "%5.1f" % temperature_f
    display.text(BIG_FONT, digits, TEMP_X, TEMP_VALUE_Y, color, config.BLACK)

    # The font has no degree symbol, so we draw one: a tiny ring that sits
    # near the top of the letters, just after the digits.
    degree_x = TEMP_X + TEMP_DIGITS * BIG_FONT.WIDTH + BIG_FONT.WIDTH // 2
    shapes.ring(display, degree_x, TEMP_VALUE_Y + 7, 4, color, 2)

    display.text(BIG_FONT, "F",
                 TEMP_X + (TEMP_DIGITS + 1) * BIG_FONT.WIDTH, TEMP_VALUE_Y,
                 color, config.BLACK)

    # The same temperature in Celsius, small, so both scales are on show.
    # "%5.1f" is five letters wide every time, just like the big number.
    celsius = "%5.1f C" % temperature_c
    display.text(SMALL_FONT, celsius, TEMP_C_X, TEMP_C_Y,
                 config.WHITE, config.BLACK)


def draw_humidity(humidity):
    text = "%5.1f%%" % humidity      # %% is how you print a real % sign
    display.text(BIG_FONT, text, HUMIDITY_X, HUMIDITY_VALUE_Y,
                 config.CYAN, config.BLACK)

    # The bar is two rectangles side by side: a blue one for the humidity
    # and a dark grey one for the empty part. Every pixel of the bar gets
    # painted every time, so there is nothing to erase.
    filled = int(BAR_WIDTH * humidity / 100.0)
    if filled > 0:
        display.fill_rect(BAR_X, BAR_Y, filled, BAR_HEIGHT, config.CYAN)
    if filled < BAR_WIDTH:
        display.fill_rect(BAR_X + filled, BAR_Y, BAR_WIDTH - filled, BAR_HEIGHT,
                          config.GREY)


def draw_sensor_status(ok):
    """Swap the top label to SENSOR FAIL (red) when a reading goes wrong."""
    if ok:
        display.text(SMALL_FONT, LABEL_TEXT, LABEL_X, TEMP_LABEL_Y,
                     config.WHITE, config.BLACK)
    else:
        display.text(SMALL_FONT, LABEL_ERROR_TEXT, LABEL_X, TEMP_LABEL_Y,
                     config.RED, config.BLACK)


# Give the sensor a clean start.
#
# If the last program was stopped in the middle of taking a reading, the
# sensor can be left half way through a conversation and it will refuse to
# answer. Unplugging the Pico and plugging it back in always clears this.
try:
    i2c.writeto(config.SHT40_ADDR, bytes([config.SHT40_CMD_SOFT_RESET]))
    time.sleep_ms(10)
except OSError:
    show_message("Sensor is not", "answering.", "Unplug the Pico,", "plug it back in.")
    print("The sensor is not answering.")
    print()
    print("This almost always means the last program was stopped in the")
    print("middle of a reading. Unplug the Pico from USB, plug it back in,")
    print("and run this program again.")
    raise SystemExit

draw_watch_face()
print("Display is running. Press Ctrl-C to stop.")

last_reading_ok = True

try:
    while True:
        try:
            temperature_c, humidity = read_sht40()
            temperature_f = temperature_c * 9.0 / 5.0 + 32.0

            if not last_reading_ok:
                draw_sensor_status(True)
                last_reading_ok = True

            draw_temperature(temperature_c, temperature_f)
            draw_humidity(humidity)

            print("%.2f F  %.2f C  %.2f %%" % (temperature_f, temperature_c, humidity))

        except (OSError, ValueError) as error:
            # One bad reading should not stop the display. We keep the last
            # numbers on the screen, turn the top label red so nobody trusts
            # them, and try again next second.
            if last_reading_ok:
                draw_sensor_status(False)
                last_reading_ok = False
            print("# skipped a reading:", error)

        time.sleep(config.DISPLAY_SECONDS)

except KeyboardInterrupt:
    print("Got Ctrl-C, stopping.")
    show_message("Stopped")
