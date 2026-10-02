# The Shake Detector: five modes, one button
#
# Run 01, 02, 06 and 08 first. If all of them print "TEST PASS", this
# program will work too.
#
# One push button switches between five screens:
#
#   1. Meter    a rainbow ring gauge that jumps when you shake
#   2. Bubble   a bubble level that uses gravity to show tilt
#   3. Graph    a graph of the last 18 seconds of shaking
#   4. Score    your strongest shake ever, saved even when unplugged
#   5. Ask      ask a yes-or-no question, then shake for an answer
#
# The button (see config.py for the wiring):
#   tap                the next mode
#   hold 0.8 seconds   (in Bubble only) "this is level"
#   hold 3 seconds     (in Score only) clear the records
#
# The green LED on the Pico blinks once a second while the sensor is
# working. Two quick blinks mean a reading failed. If the blinking STOPS, the
# program has stopped.
#
# upload-code.sh also saves a copy of THIS program on the Pico as main.py.
# A Pico runs main.py by itself when it gets power, so the shake detector
# starts with no computer at all. Try it with a USB battery pack!
#
# HOW THE PROGRAM IS BUILT
#   lis3dh.py      reads the sensor
#   button.py      the button, with an interrupt so no press is missed
#   heartbeat.py   the blinking LED
#   records.py     the shake score
#   widgets.py     colors, text helpers and the ring gauge
#   shake_ctx.py   the shake detector, everything the modes share, and the
#                  pattern each mode follows
#   mode_*.py      one small file for each mode
# Every file is in the lib folder on the Pico. Open them and read them!

import gc
import time
from machine import Pin, I2C
import config
from lis3dh import LIS3DH
from button import Button
from heartbeat import Heartbeat, onboard_led
from records import Records
from shake_ctx import Context
import vga1_8x16 as SMALL_FONT

gc.collect()


def load_modes():
    """Load the five mode files one at a time, tidying memory as we go."""
    from mode_meter import MeterMode
    gc.collect()
    from mode_bubble import BubbleMode
    gc.collect()
    from mode_graph import GraphMode
    gc.collect()
    from mode_score import ScoreMode
    gc.collect()
    from mode_ask import AskMode
    gc.collect()
    return [MeterMode(), BubbleMode(), GraphMode(), ScoreMode(), AskMode()]


# --- Set up the hardware ---------------------------------------------
i2c = I2C(config.I2C_BUS,
          sda=Pin(config.I2C_SDA_PIN),
          scl=Pin(config.I2C_SCL_PIN),
          freq=config.I2C_BUS_FREQ)
sensor = LIS3DH(i2c, config.LIS3DH_ADDR, config.LIS3DH_RANGE_G, config.LIS3DH_RATE_HZ)
display = config.init_display()
button = Button(config.BUTTON_PIN, config.BUTTON_DEBOUNCE_MS)
led = Heartbeat(onboard_led(config.BUILT_IN_LED_PIN), config.HEARTBEAT_MS)
records = Records(config.RECORDS_FILE, config.RECORDS_SAVE_SECONDS)

modes = load_modes()
ctx = Context(display, records, len(modes))
print("Display ready. {} modes. Free memory: {} bytes.".format(
    len(modes), gc.mem_free()))

# Give the sensor a clean start.
#
# If it will not answer, we do not quit. We show SENSOR FAIL and keep
# trying, so the display comes alive by itself as soon as the sensor answers.
try:
    sensor.start()
except (OSError, ValueError) as error:
    ctx.sensor_ok = False
    print("The sensor is not answering:", error)
    print("Run 01-i2c-scanner.py, or unplug the Pico and plug it back in.")


def show_mode(ctx, mode):
    """Wipe the screen, draw the mode, and fill in the latest numbers."""
    mode.enter(ctx)
    if ctx.have_reading():
        mode.update(ctx)
    gc.collect()


mode = modes[ctx.mode_index]
show_mode(ctx, mode)
now = time.ticks_ms()
next_read = now           # take the first reading right away
next_draw = now
next_beat = now

try:
    while True:
        now = time.ticks_ms()

        # --- 1. The button. Handle every press that is waiting. -------------
        redraw = False
        while True:
            press = button.next_press()
            if press == 0:
                break
            print("Button: {} ms".format(press))    # so you can see every press
            if press < config.LONG_PRESS_MS:
                ctx.mode_index = (ctx.mode_index + 1) % len(modes)     # next mode
                redraw = True
            elif not modes[ctx.mode_index].hold(ctx, press, now):
                print("A hold does nothing in the {} mode.".format(mode.NAME))

        if redraw:
            mode = modes[ctx.mode_index]
            show_mode(ctx, mode)
            print("Mode:", mode.NAME)
            next_draw = time.ticks_add(now, config.DRAW_MS)

        # --- 2. The sensor, fifty times a second. ---------------------------
        if time.ticks_diff(now, next_read) >= 0:
            next_read = time.ticks_add(now, config.READ_MS)
            try:
                if not ctx.sensor_ok:
                    sensor.start()                   # try to wake it up
                x, y, z = sensor.read()
            except (OSError, ValueError) as error:
                led.alarm(now)                       # two quick blinks
                if ctx.sensor_ok:
                    ctx.sensor_ok = False
                    mode.draw_status(ctx, False)     # the title turns into SENSOR FAIL
                    print("Sensor problem:", error)
                next_read = time.ticks_add(now, config.RETRY_MS)
            else:
                if not ctx.sensor_ok:
                    ctx.sensor_ok = True
                    mode.draw_status(ctx, True)
                    print("The sensor is back.")
                if ctx.add_reading(x, y, z, now):
                    # A shake just ended.
                    new_record = records.add_shake(ctx.last_shake)
                    mode.shake_done(ctx, now, new_record)
                    if new_record:
                        print("Shake! {:.2f} g  A NEW RECORD!".format(ctx.last_shake))
                    else:
                        print("Shake! {:.2f} g".format(ctx.last_shake))

        # --- 3. The screen, ten times a second. ---------------------------
        if time.ticks_diff(now, next_draw) >= 0:
            next_draw = time.ticks_add(now, config.DRAW_MS)
            if ctx.sensor_ok and ctx.have_reading():
                ctx.take_peak()
                mode.update(ctx)

        # --- 4. The heartbeat and a status line, once a second. -------------
        if time.ticks_diff(now, next_beat) >= 0:
            next_beat = time.ticks_add(now, 1000)
            if ctx.sensor_ok and ctx.have_reading():
                led.beat(now)                        # one blink
                print("{}: x {:5.2f}  y {:5.2f}  z {:5.2f} g".format(
                    mode.NAME, ctx.x, ctx.y, ctx.z))

        # --- 5. Save the records now and then, and small animations. --------
        records.save_if_due(now)
        mode.tick(ctx, now)
        led.tick(now)

        time.sleep_ms(2)

except KeyboardInterrupt:
    print("Got Ctrl-C, stopping.")
    led.off()
    if records.changed:
        records.save()
    display.fill(config.BLACK)
    text = "Stopped"
    display.text(SMALL_FONT, text, config.CENTER_X - (len(text) * SMALL_FONT.WIDTH) // 2,
                 config.CENTER_Y - 8, config.WHITE, config.BLACK)
