# Pin and hardware settings for the SHT40 temperature kit with the round
# GC9A01 smartwatch display.
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

# --- SHT40 temperature and humidity sensor ---------------------------
# Power the sensor from 3V3 OUT (pin 36). Never from VBUS (pin 40).
SHT40_ADDR = 0x44               # 0x45 or 0x46 on some boards
SHT40_CMD_MEASURE_HIGH = 0xFD   # measure both values at high precision
SHT40_CMD_SOFT_RESET = 0x94     # restart the sensor
SHT40_MEASURE_MS = 15           # datasheet says 8.3 ms, we wait a little longer

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
LONG_PRESS_MS = 800       # hold this long to switch between F and C
CLEAR_PRESS_MS = 3000     # hold this long in the Hi/Lo mode to clear the records

# The onboard LED blinks once every time the sensor is read. If it stops
# blinking, the program has stopped. A failed reading blinks twice quickly.
HEARTBEAT_MS = 60         # how long each blink lasts

# --- How often each lab takes a reading --------------------------------
LOG_SECONDS = 2      # 03-continuous-logging.py, one CSV row every 2 seconds
PLOT_SECONDS = 1     # 04 and 05, the Plotter programs, one point per second
DISPLAY_SECONDS = 1  # 07-display-temp-humidity.py, redraw the watch face once a second

# --- Watch face settings ------------------------------------------------
# 07-display-temp-humidity.py colors the temperature by how warm it is.
# Below TEMP_COOL_F it is cyan, up to TEMP_WARM_F it is green, up to
# TEMP_HOT_F it is orange, and from TEMP_HOT_F on it is red.
# Change these numbers to match how warm your room feels.
TEMP_COOL_F = 65.0
TEMP_WARM_F = 78.0
TEMP_HOT_F = 90.0

# --- Smartwatch modes (lab 09) ----------------------------------------
# Mood ring: the temperature is spread along a color line from blue (cold)
# through cyan, green and orange to red (hot). These two numbers are the
# ends of that line.
MOOD_COLD_F = 50.0
MOOD_HOT_F = 95.0

# Buddy face. Below BUDDY_COLD_F Buddy shivers. TEMP_COOL_F, TEMP_WARM_F and
# TEMP_HOT_F (above) decide when Buddy looks cool, comfy, warm or hot.
BUDDY_COLD_F = 55.0
BUDDY_BLINK_MS = 4000     # Buddy blinks this often

# Live graph. One point is drawn for every reading, so the graph is
# LIVE_WIDTH readings wide. At one reading a second, that is three minutes.
LIVE_WIDTH = 180          # 60 to 190 fits inside the round screen
LIVE_MIN_SPAN_F = 6.0     # never zoom in tighter than this many degrees

# Finger test. Touch the sensor and the thermometer fills up until the
# sensor reaches FINGER_TARGET_F. It reads faster than the other modes so
# the thermometer feels quick. (Watch the LED blink faster too!)
FINGER_TARGET_F = 90.0
FINGER_BASELINE_SAMPLES = 5   # readings averaged to find the room temperature
FINGER_MIN_SPAN_F = 5.0       # never squeeze the thermometer into less than this
FINGER_BASELINE_DECAY = 0.02  # how fast the room temperature follows a cooling sensor
FINGER_SMOOTHING = 0.25       # how fast the thermometer follows, 0.0 to 1.0
FINGER_READ_MS = 300

# Hi/Lo records. The highest and lowest readings are saved in this file, so
# they are still there after you unplug the Pico. To be kind to the Pico's
# flash memory, a new record is saved at most once every RECORDS_SAVE_SECONDS.
RECORDS_FILE = "records.txt"
RECORDS_SAVE_SECONDS = 60
