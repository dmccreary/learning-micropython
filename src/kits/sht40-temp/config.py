# Pin and hardware settings for the SHT40 temperature kit.
#
# Every program in this kit reads its pin numbers from this one file. If you
# move a wire, change the number here and all the programs follow. You never
# have to hunt through each program looking for a pin number.
#
# Use it like this:
#
#     import config
#     from machine import Pin, I2C
#     i2c = I2C(config.I2C_BUS,
#               sda=Pin(config.I2C_SDA_PIN),
#               scl=Pin(config.I2C_SCL_PIN),
#               freq=config.I2C_BUS_FREQ)

# --- I2C bus, used by the SHT40 sensor -------------------------------
I2C_BUS = 0
I2C_SDA_PIN = 0          # GP0, physical pin 1
I2C_SCL_PIN = 1          # GP1, physical pin 2
I2C_BUS_FREQ = 400_000   # 400 kHz. Drop to 100_000 if you use long wires.

# --- SHT40 temperature and humidity sensor ---------------------------
# Power the sensor from 3V3 OUT (pin 36). Never from VBUS (pin 40).
SHT40_ADDR = 0x44               # 0x45 or 0x46 on some boards
SHT40_CMD_MEASURE_HIGH = 0xFD   # measure both values at high precision
SHT40_CMD_SOFT_RESET = 0x94     # restart the sensor
SHT40_MEASURE_MS = 15           # datasheet says 8.3 ms, we wait a little longer

# --- NeoPixel strip ---------------------------------------------------
# Wiring:
#   strip DIN -> GP2 (physical pin 4)
#   strip GND -> any GND pin, such as pin 3
#   strip VCC -> 3V3 OUT (pin 36), the same rail as the sensor
#
# Eight pixels at low brightness draw well under 100 mA, which the Pico's
# 3.3 V rail handles easily. If you want them at full blazing brightness,
# move strip VCC to VBUS (pin 40) for 5 V instead. Do NOT move the sensor.
NEOPIXEL_PIN = 2
NUMBER_PIXELS = 8
NEOPIXEL_BRIGHTNESS = 0.35   # 0.0 is off, 1.0 is blinding. 0.35 is comfortable.

# Do the glowing pixels warm the sensor and spoil the reading? We measured
# it. With the strip about an inch from the sensor, lighting all eight
# pixels full white for 90 seconds changed the reading by -0.3 F, which is
# the sensor still cooling, not warming. So an inch of air is far enough.
# If you crowd the strip right up against the sensor, check it again.

# --- Onboard LED ------------------------------------------------------
BUILT_IN_LED_PIN = 25   # use Pin("LED") on a Pico W instead

# --- How often each lab takes a reading --------------------------------
LOG_SECONDS = 2      # 03-continuous-logging.py, one CSV row every 2 seconds
PLOT_SECONDS = 1     # 04-plot-temp-and-humidity.py, one point per second

# --- Touch thermometer settings ---------------------------------------
# A student's fingertip warms the sensor to somewhere near 90 F. That is
# the temperature that lights all eight pixels red.
TOUCH_TARGET_F = 90.0
BASELINE_SAMPLES = 5    # readings averaged at startup to set the baseline

# The sensor holds onto heat for a few minutes after someone touches it or
# after a fast-sampling program has been running. If the baseline is taken
# while the sensor is still warm, the gap up to 90 F would be tiny and the
# bar would slam to red at the lightest touch. These two settings keep the
# program usable even when it starts warm.
MIN_SPAN_F = 5.0         # never squeeze the whole bar into less than this
BASELINE_DECAY = 0.02    # how fast the baseline follows a cooling sensor
