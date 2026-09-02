# Touch Thermometer: light up a NeoPixel strip with your finger
#
# When the program starts it takes a few readings and remembers how warm
# the room is. That is the baseline. One blue pixel glows to show the
# program is alive and waiting.
#
# Then press a fingertip onto the SHT40. Your finger is warmer than the
# room, so the sensor warms up, and the strip fills in one pixel at a time.
# The colors climb from blue through green, yellow and orange to red.
# All eight pixels turn red at 90 F, which is about finger temperature.
#
# Take your finger away and the bar drains back down as the sensor cools.
#
# Press Ctrl-C to stop. The strip turns itself off when you do.
#
# Wiring is in config.py. Change pin numbers there, not here.

from machine import Pin, I2C
from neopixel import NeoPixel
import time
import config

# --- Set up the hardware ---------------------------------------------
i2c = I2C(config.I2C_BUS,
          sda=Pin(config.I2C_SDA_PIN),
          scl=Pin(config.I2C_SCL_PIN),
          freq=config.I2C_BUS_FREQ)

strip = NeoPixel(Pin(config.NEOPIXEL_PIN), config.NUMBER_PIXELS)

# The colors the bar passes through, coolest first.
COLOR_STOPS = [
    (0, 0, 255),      # blue   - room temperature
    (0, 255, 0),      # green
    (255, 255, 0),    # yellow
    (255, 128, 0),    # orange
    (255, 0, 0),      # red    - a warm fingertip
]

SMOOTHING = 0.25      # how fast the bar follows the temperature, 0.0 to 1.0
LOOP_SECONDS = 0.2    # five updates every second

# Why not measure faster? Every high-precision reading warms the sensor a
# little. Ten readings a second was enough to heat it several degrees over
# a couple of minutes, which slowly ruined the baseline. Five a second still
# feels instant to your eye and leaves the sensor cool.


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


def read_temperature_f():
    """Return one temperature reading in degrees Fahrenheit."""
    i2c.writeto(config.SHT40_ADDR, bytes([config.SHT40_CMD_MEASURE_HIGH]))
    time.sleep_ms(config.SHT40_MEASURE_MS)
    data = i2c.readfrom(config.SHT40_ADDR, 6)

    if crc8(data[0:2]) != data[2]:
        raise ValueError("Temperature checksum failed")

    temp_ticks = (data[0] << 8) | data[1]
    temperature_c = -45.0 + 175.0 * temp_ticks / 65535.0
    return temperature_c * 9.0 / 5.0 + 32.0


def gradient_color(position):
    """Pick a color from the blue-to-red gradient.

    position is 0.0 at the cold end and 1.0 at the hot end.
    """
    if position <= 0.0:
        return COLOR_STOPS[0]
    if position >= 1.0:
        return COLOR_STOPS[-1]

    # There are 4 gaps between our 5 colors. Work out which gap we are in
    # and how far along that gap we have travelled.
    gaps = len(COLOR_STOPS) - 1
    scaled = position * gaps
    index = int(scaled)
    if index >= gaps:
        index = gaps - 1
    blend = scaled - index

    start = COLOR_STOPS[index]
    end = COLOR_STOPS[index + 1]

    # Mix the two colors together, one channel at a time
    red = int(start[0] + (end[0] - start[0]) * blend)
    green = int(start[1] + (end[1] - start[1]) * blend)
    blue = int(start[2] + (end[2] - start[2]) * blend)
    return (red, green, blue)


def dim(color, amount):
    """Make a color darker. amount is 0.0 for off and 1.0 for full."""
    return (int(color[0] * amount),
            int(color[1] * amount),
            int(color[2] * amount))


def show_level(level):
    """Light the strip up to a height between 0.0 and NUMBER_PIXELS."""
    for pixel in range(config.NUMBER_PIXELS):
        # Each pixel keeps its own place in the gradient, so pixel 0 is
        # always blue and the top pixel is always red.
        position = pixel / (config.NUMBER_PIXELS - 1)
        color = dim(gradient_color(position), config.NEOPIXEL_BRIGHTNESS)

        if level >= pixel + 1:
            strip[pixel] = color              # fully below the level
        elif level > pixel:
            # The leading pixel fades in, so the bar glides instead of
            # jumping from one pixel to the next.
            strip[pixel] = dim(color, level - pixel)
        else:
            strip[pixel] = (0, 0, 0)          # above the level, so off

    strip.write()


def bar_text(level):
    """Draw the same bar with keyboard characters for the Shell."""
    # Round instead of chopping off the decimals. The bar creeps towards
    # its target without ever quite arriving, so a level of 7.999 has to
    # count as eight pixels or the text would never show a full strip.
    filled = int(level + 0.5)
    if filled > config.NUMBER_PIXELS:
        filled = config.NUMBER_PIXELS
    text = ""
    for pixel in range(config.NUMBER_PIXELS):
        if pixel < filled:
            text = text + "#"
        else:
            text = text + "-"
    return "[" + text + "]"


# --- Measure the baseline --------------------------------------------
# Give the sensor a clean start.
#
# If the last program was stopped in the middle of taking a reading, the
# sensor can be left half way through a conversation and it will refuse to
# answer. Unplugging the Pico and plugging it back in always clears this.
try:
    i2c.writeto(config.SHT40_ADDR, bytes([config.SHT40_CMD_SOFT_RESET]))
    time.sleep_ms(10)
except OSError:
    print("The sensor is not answering.")
    print()
    print("This almost always means the last program was stopped in the")
    print("middle of a reading. Unplug the Pico from USB, plug it back in,")
    print("and run this program again.")
    raise SystemExit

print("Measuring the room. Keep your hands off the sensor...")

total = 0.0
for _ in range(config.BASELINE_SAMPLES):
    total = total + read_temperature_f()
    time.sleep(0.2)
baseline_f = total / config.BASELINE_SAMPLES

# How many degrees the sensor must climb to fill the whole strip. If the
# sensor started out warm this gap could be tiny, or even backwards, so we
# never let it shrink below MIN_SPAN_F.
span_f = config.TOUCH_TARGET_F - baseline_f
if span_f < config.MIN_SPAN_F:
    span_f = config.MIN_SPAN_F

print("Baseline: {:.1f} F".format(baseline_f))
if baseline_f > config.TOUCH_TARGET_F - config.MIN_SPAN_F:
    print("That is warm for a room. The sensor may still be cooling down")
    print("from the last run. The baseline will drift down on its own.")
print("Touch the sensor. All eight pixels turn red at {:.0f} F."
      .format(config.TOUCH_TARGET_F))
print()

# --- Follow the temperature ------------------------------------------
level = 1.0   # start with the single blue pixel already glowing

try:
    while True:
        try:
            temperature_f = read_temperature_f()

            # If the sensor is reading colder than the baseline, the room
            # is cooler than we thought, so ease the baseline down to meet
            # it. We never let the baseline rise, because a finger warming
            # the sensor must not be mistaken for a warmer room.
            if temperature_f < baseline_f:
                baseline_f = baseline_f + (temperature_f - baseline_f) * config.BASELINE_DECAY
                span_f = config.TOUCH_TARGET_F - baseline_f
                if span_f < config.MIN_SPAN_F:
                    span_f = config.MIN_SPAN_F

            # How far between the baseline and a warm finger are we?
            climb = (temperature_f - baseline_f) / span_f
            if climb < 0.0:
                climb = 0.0
            if climb > 1.0:
                climb = 1.0

            # Never drop below one pixel, so blue always shows we are alive
            target = climb * config.NUMBER_PIXELS
            if target < 1.0:
                target = 1.0

            # Ease towards the target instead of snapping to it
            level = level + (target - level) * SMOOTHING
            show_level(level)

            print("{:5.1f} F  {:+5.1f}  {}".format(
                temperature_f, temperature_f - baseline_f, bar_text(level)))

        except (OSError, ValueError):
            # One bad reading should not stop the show. Leave the strip
            # as it was and try again on the next time around.
            pass

        time.sleep(LOOP_SECONDS)

except KeyboardInterrupt:
    # Always turn the pixels off on the way out, or they stay lit forever
    for pixel in range(config.NUMBER_PIXELS):
        strip[pixel] = (0, 0, 0)
    strip.write()
    print()
    print("Stopped. Pixels off.")
