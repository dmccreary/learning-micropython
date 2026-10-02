# Pin and hardware settings for the LIS3DH Shake Detector kit with the
# round GC9A01 smartwatch display.
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

# --- I2C bus, used by the LIS3DH sensor ------------------------------
I2C_BUS = 0
I2C_SDA_PIN = 0          # GP0, physical pin 1
I2C_SCL_PIN = 1          # GP1, physical pin 2
I2C_BUS_FREQ = 400_000   # 400 kHz. Drop to 100_000 if you use long wires.

# --- GC9A01 round display (240 x 240, SPI0) ---------------------------
# Wiring, the same as the smartwatch kits:
#   Display pin    Pico pin
#   -----------    --------
#   SCL / CLK      GP2  (physical pin 4)
#   SDA / MOSI     GP3  (physical pin 5)
#   DC             GP4  (physical pin 6)
#   CS             GP5  (physical pin 7)
#   RST            GP6  (physical pin 9)
#   VCC            3V3 OUT (pin 36), the same rail as the sensor
#   GND            any GND pin, such as pin 3 or pin 8
#
# None of these touch GP0 and GP1, so the sensor and the display live on the
# Pico side by side without sharing a pin.
DISPLAY_WIDTH = 240
DISPLAY_HEIGHT = 240
SPI_ID = 0
SCK_PIN = 2
MOSI_PIN = 3
DC_PIN = 4
CS_PIN = 5
RES_PIN = 6
SPI_BAUDRATE = 60_000_000

# Colors are RGB565: five bits of red, six of green, five of blue.
BLACK = 0x0000
WHITE = 0xFFFF
RED = 0xF800
GREEN = 0x07E0
BLUE = 0x001F
CYAN = 0x07FF
YELLOW = 0xFFE0
ORANGE = 0xFC00
MAGENTA = 0xF81F
GREY = 0x4208    # dark grey, for the empty part of a bar

# A round screen is still a 240 x 240 square to the driver, but only the
# circle inscribed in it is visible. Keep everything inside SAFE_RADIUS.
# The last few pixels out toward RADIUS sit under the bezel.
CENTER_X = DISPLAY_WIDTH // 2    # 120
CENTER_Y = DISPLAY_HEIGHT // 2   # 120
RADIUS = DISPLAY_WIDTH // 2      # 120, the physical edge of the glass
SAFE_RADIUS = 112


def init_display():
    """Start the SPI bus and the GC9A01. Returns the display object.

    This driver has no frame buffer, so every drawing call goes straight to
    the glass and there is no show() to call afterwards.

    gc9a01 is imported here, inside the function, on purpose. Labs 01 to 05
    never touch the display, and this way they still run on a Pico that does
    not have the display files in :lib yet.
    """
    from machine import Pin, SPI
    import gc9a01
    spi = SPI(SPI_ID, baudrate=SPI_BAUDRATE, sck=Pin(SCK_PIN), mosi=Pin(MOSI_PIN))
    return gc9a01.GC9A01(
        spi,
        dc=Pin(DC_PIN, Pin.OUT),
        cs=Pin(CS_PIN, Pin.OUT),
        reset=Pin(RES_PIN, Pin.OUT),
        rotation=0)

# --- LIS3DH accelerometer ----------------------------------------------
# Power the sensor from 3V3 OUT (pin 36). Never from VBUS (pin 40).
# Many low-cost LIS3DH boards have no voltage regulator, and the chip is
# damaged above 3.6 volts.
#
# The address depends on the board's SDO pin:
#   SDO wired to GND  -> 0x18
#   SDO wired to 3V3  -> 0x19
# Run 01-i2c-scanner.py. It tells you which one your board uses.
LIS3DH_ADDR = 0x18
LIS3DH_ID = 0x33          # the LIS3DH always answers WHO_AM_I with 0x33

# How big a push the sensor can measure: 2, 4, 8 or 16 g.
# A hard shake by hand is about 2 to 3 g, so 4 g leaves room to spare.
LIS3DH_RANGE_G = 4
# How many times a second the sensor measures: 1, 10, 25, 50, 100, 200 or 400.
LIS3DH_RATE_HZ = 100

# --- Shake settings -----------------------------------------------------
# When the sensor sits still it feels exactly 1 g, the pull of gravity.
# "Shake strength" is how far the total push is from that 1 g. Sitting
# still is about 0.00 g. A gentle wiggle is about 0.3 g. A hard shake is 2 g
# or more.
SHAKE_THRESHOLD_G = 0.5   # this much shake strength counts as a shake
SHAKE_QUIET_MS = 400      # the shake is over after this long below the threshold
SHAKE_FULL_G = 3.0        # the top of every meter, gauge and graph

# --- How often each lab works -------------------------------------------
LOG_MS = 250      # 03-continuous-logging.py, four CSV rows a second
PLOT_MS = 50      # 04 and 05, the Plotter programs, twenty points a second
READ_MS = 20      # 07 and 09 read the sensor fifty times a second
DRAW_MS = 100     # 07 and 09 redraw the screen ten times a second

# --- Onboard LED ------------------------------------------------------
BUILT_IN_LED_PIN = 25   # GP25 is the LED on a plain Pico. heartbeat.py tries Pin("LED")
                        # first, which also works on a Pico W

# --- Push button and heartbeat LED (labs 08 and 09) --------------------
# One push button, wired between GP15 and any GND pin:
#   button leg 1 -> GP15 (physical pin 20, the bottom left corner of the
#                   Pico when the USB port is at the top)
#   button leg 2 -> GND  (physical pin 18 is the closest GND pin)
#
# No outside resistor is needed. The program turns on the Pico's own
# pull-up resistor, which holds GP15 at 3.3 V. Pressing the button connects
# GP15 to GND, so a press reads as 0.
BUTTON_PIN = 15
BUTTON_DEBOUNCE_MS = 50   # a button change must be quiet this long before we trust it.
                          # Taps shorter than this are ignored as bounce.
LONG_PRESS_MS = 800       # hold this long in the Bubble mode to say "this is level"
CLEAR_PRESS_MS = 3000     # hold this long in the Score mode to clear the records

# The onboard LED blinks once a second while the sensor is working. If it
# stops blinking, the program has stopped. A failed reading blinks twice
# quickly, and the program tries the sensor again once a second.
HEARTBEAT_MS = 60         # how long each blink lasts
RETRY_MS = 1000           # how long to wait before asking a silent sensor again

# --- Display modes (lab 09) ----------------------------------------
# Meter. The gauge jumps up at once and then falls back slowly, like the
# lights on a music player. Each redraw keeps this share of the last level.
METER_FALL = 0.80

# Bubble level. The bubble moves this many pixels for each 1 g of tilt.
# If the bubble runs downhill instead of uphill, or sideways, change the
# three lines under it until it behaves like a real bubble level.
BUBBLE_PX_PER_G = 120
BUBBLE_SWAP_XY = False    # True swaps the sensor's X and Y arrows
BUBBLE_FLIP_X = False     # True makes the bubble go the other way left and right
BUBBLE_FLIP_Y = False     # True makes the bubble go the other way up and down
LEVEL_DEGREES = 1.0       # tilted less than this counts as level
BUBBLE_SMOOTHING = 0.4    # 0.1 is slow and syrupy, 1.0 follows every jitter

# Shake graph. One bar is drawn every DRAW_MS, so the graph is
# GRAPH_WIDTH bars wide. At ten bars a second, that is 18 seconds.
GRAPH_WIDTH = 180         # 60 to 190 fits inside the round screen

# Score. The best shake and the number of shakes are saved in this file,
# so they are still there after you unplug the Pico. To be kind to the
# Pico's flash memory, they are saved at most once every RECORDS_SAVE_SECONDS.
RECORDS_FILE = "shake-records.txt"
RECORDS_SAVE_SECONDS = 60

# Ask Me. The answer stays on the screen this long before the next question.
ANSWER_SECONDS = 8
