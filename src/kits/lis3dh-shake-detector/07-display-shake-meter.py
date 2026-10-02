# A Shake Meter on the Round Display
#
# Run 01-i2c-scanner.py, 02-get-single-reading.py and 06-display-hello.py
# first. If all three print "TEST PASS", this program will work too.
#
# This program reads the LIS3DH fifty times a second and draws this on the
# screen ten times a second:
#
#   - The shake strength in big numbers, in g.
#   - A bar that fills up as the shake gets stronger. It is green for a
#     wiggle and turns yellow, orange, red and then magenta for a big shake.
#   - The word SHAKE! while you are shaking.
#   - How many shakes it has counted.
#
# If the sensor stops answering, the title turns into a red SENSOR FAIL and
# the numbers freeze until the sensor comes back.
#
# Press Ctrl-C (or the Stop button in Thonny) to stop.
#
# READ FAST, DRAW SLOWER
# A shake can come and go in a tenth of a second. Drawing on the screen is
# slow compared to that. So we read the sensor often and remember the
# BIGGEST strength we saw (the "peak"). Each time we draw, we show that peak
# and start over. No shake slips through between drawings.
#
# ONE SHAKE, NOT TWENTY
# One shake of your hand is really many quick wiggles back and forth. If we
# counted every time the strength went over the line, one shake could count
# as ten. So a shake only ends after the strength has stayed under the line
# for SHAKE_QUIET_MS (in config.py). Then we count it, once.
#
# HOW WE STOP THE FLICKER
# This display has no frame buffer, so we cannot "clear and redraw" like a
# game does. Wiping the whole screen ten times a second would flash like a
# strobe light. Instead we draw everything that never changes ONCE, and then
# we only write the numbers. Each number is always the same width, and
# text() paints a background color behind every letter, so the new digits
# land right on top of the old ones.
#
# Wiring is in config.py. Change pin numbers there, not here.

from machine import Pin, I2C
import math
import time
import config
import shapes
import widgets
import vga1_8x16 as SMALL_FONT            # 8 x 16, for the labels
import vga1_bold_16x32 as BIG_FONT         # 16 x 32, for the numbers

LIS3DH_ADDR = config.LIS3DH_ADDR

# Register numbers from the LIS3DH datasheet (see 02-get-single-reading.py).
WHO_AM_I = 0x0F
CTRL_REG1 = 0x20
CTRL_REG4 = 0x23
OUT_X_L = 0x28
AUTO_NEXT = 0x80

RATE_CODES = {1: 1, 10: 2, 25: 3, 50: 4, 100: 5, 200: 6, 400: 7}
RANGE_CODES = {2: 0, 4: 1, 8: 2, 16: 3}
MG_PER_STEP = {2: 1, 4: 2, 8: 4, 16: 12}

# --- Set up the hardware ---------------------------------------------
i2c = I2C(config.I2C_BUS,
          sda=Pin(config.I2C_SDA_PIN),
          scl=Pin(config.I2C_SCL_PIN),
          freq=config.I2C_BUS_FREQ)

display = config.init_display()


def start_lis3dh():
    """Check the chip's ID, then turn it on. Raises OSError if it will not answer."""
    chip_id = i2c.readfrom_mem(LIS3DH_ADDR, WHO_AM_I, 1)[0]
    if chip_id != config.LIS3DH_ID:
        raise OSError("WHO_AM_I is {}, not {}".format(hex(chip_id), hex(config.LIS3DH_ID)))
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


# --- Where everything goes on the 240 x 240 screen --------------------
# The screen is round, so the rows near the top and bottom are narrower
# than the rows in the middle. Everything below was placed so its widest
# part still fits inside the circle.
CENTER_X = config.CENTER_X
CENTER_Y = config.CENTER_Y

TITLE_Y = 36
VALUE_Y = 64
BAR_Y = 112
BAR_WIDTH = 160
BAR_HEIGHT = 16
BAR_X = CENTER_X - BAR_WIDTH // 2
SHAKE_Y = 140
COUNT_Y = 180

# The number is four big letters ("1.84"), a small gap, then a small "g".
# We center all of it together.
VALUE_WIDTH = 4 * BIG_FONT.WIDTH + 4 + SMALL_FONT.WIDTH
VALUE_X = CENTER_X - VALUE_WIDTH // 2
UNIT_X = VALUE_X + 4 * BIG_FONT.WIDTH + 4


def draw_title(ok):
    """SHAKE METER in white, or SENSOR FAIL in red. Both are 11 letters,
    so each one paints right over the other."""
    if ok:
        text, color = "SHAKE METER", config.WHITE
    else:
        text, color = "SENSOR FAIL", config.RED
    widgets.draw_centered(display, SMALL_FONT, text, CENTER_X, TITLE_Y, color, config.BLACK)


def draw_frame():
    """Everything that never changes. We draw it once."""
    display.fill(config.BLACK)
    shapes.ring(display, CENTER_X, CENTER_Y, config.SAFE_RADIUS, config.WHITE, 2)
    draw_title(True)
    display.rect(BAR_X - 2, BAR_Y - 2, BAR_WIDTH + 4, BAR_HEIGHT + 4, config.WHITE)


def draw_numbers(peak):
    """The number and the bar. They change almost every time, so we draw
    them every time."""
    color = widgets.shake_color(peak, config.SHAKE_FULL_G)

    # The number. "%4.2f" always makes four letters, like 0.03 or 2.51.
    shown = peak
    if shown > 9.99:
        shown = 9.99
    display.text(BIG_FONT, "%4.2f" % shown, VALUE_X, VALUE_Y, color, config.BLACK)
    display.text(SMALL_FONT, "g", UNIT_X, VALUE_Y + 16, color, config.BLACK)

    # The bar. The colored part and the grey part always add up to the full
    # width, so the old bar is painted over and nothing needs clearing.
    filled = int(BAR_WIDTH * peak / config.SHAKE_FULL_G)
    if filled > BAR_WIDTH:
        filled = BAR_WIDTH
    if filled > 0:
        display.fill_rect(BAR_X, BAR_Y, filled, BAR_HEIGHT, color)
    if filled < BAR_WIDTH:
        display.fill_rect(BAR_X + filled, BAR_Y, BAR_WIDTH - filled, BAR_HEIGHT,
                          config.GREY)


def draw_shaking(shaking):
    """SHAKE! while shaking. Six spaces paint over it when you stop."""
    if shaking:
        text = "SHAKE!"
    else:
        text = "      "
    display.text(BIG_FONT, text, CENTER_X - 3 * BIG_FONT.WIDTH, SHAKE_Y,
                 config.YELLOW, config.BLACK)


def draw_count(shakes):
    count = widgets.pad_center("shakes: %d" % shakes, 13)
    widgets.draw_centered(display, SMALL_FONT, count, CENTER_X, COUNT_Y,
                          config.WHITE, config.BLACK)


# --- Start up ----------------------------------------------------------
draw_frame()
draw_count(0)

sensor_ok = True
try:
    start_lis3dh()
except OSError:
    sensor_ok = False
    draw_title(False)
    print("The sensor is not answering. Unplug the Pico and plug it back in.")

peak = 0.0            # the biggest strength since the last drawing
shaking = False
last_loud = 0         # when the strength was last over the line
shakes = 0
drawn_shaking = False # what the screen shows now, so we only redraw changes
drawn_shakes = 0
next_read = time.ticks_ms()
next_draw = next_read

try:
    while True:
        now = time.ticks_ms()

        # --- 1. Read the sensor, fifty times a second. --------------------
        if time.ticks_diff(now, next_read) >= 0:
            next_read = time.ticks_add(now, config.READ_MS)
            try:
                if not sensor_ok:
                    start_lis3dh()                 # try to wake it up
                x, y, z = read_lis3dh()
            except OSError:
                if sensor_ok:
                    sensor_ok = False
                    draw_title(False)
                    print("Sensor problem. Trying again once a second.")
                next_read = time.ticks_add(now, config.RETRY_MS)
            else:
                if not sensor_ok:
                    sensor_ok = True
                    draw_title(True)
                    print("The sensor is back.")

                strength = abs(math.sqrt(x * x + y * y + z * z) - 1.0)
                if strength > peak:
                    peak = strength

                # The shake detector.
                if strength >= config.SHAKE_THRESHOLD_G:
                    shaking = True
                    last_loud = now
                elif shaking and time.ticks_diff(now, last_loud) >= config.SHAKE_QUIET_MS:
                    shaking = False
                    shakes = shakes + 1
                    print("Shake number {}!".format(shakes))

        # --- 2. Draw, ten times a second. ---------------------------------
        if time.ticks_diff(now, next_draw) >= 0:
            next_draw = time.ticks_add(now, config.DRAW_MS)
            if sensor_ok:
                draw_numbers(peak)
                peak = 0.0
                # These two hardly ever change. Drawing only when they do
                # keeps each redraw short, so the next reading is not late.
                if shaking != drawn_shaking:
                    draw_shaking(shaking)
                    drawn_shaking = shaking
                if shakes != drawn_shakes:
                    draw_count(shakes)
                    drawn_shakes = shakes

        time.sleep_ms(2)

except KeyboardInterrupt:
    print("Got Ctrl-C, stopping.")
    display.fill(config.BLACK)
    text = "Stopped"
    display.text(SMALL_FONT, text, CENTER_X - (len(text) * SMALL_FONT.WIDTH) // 2,
                 CENTER_Y - 8, config.WHITE, config.BLACK)
