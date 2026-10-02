# shake_ctx.py -- what every display mode shares.
#
# "ctx" is short for context. It holds the display, the latest reading, the
# shake detector and the recent history. Each mode gets the same ctx, so a
# mode never has to ask for the display or the sensor by itself.
#
# THE SHAKE DETECTOR
# A still sensor feels 1 g, the pull of gravity. The shake strength is how
# far the total push is from that 1 g. A shake STARTS when the strength
# climbs over SHAKE_THRESHOLD_G. It ENDS when the strength has stayed under
# the threshold for SHAKE_QUIET_MS. Waiting for the quiet is what turns the
# many wiggles of one shake into ONE shake.
#
# This file also holds Mode, the pattern every mode follows. A mode has
# these jobs:
#
#   enter(ctx)                  Wipe the screen and draw the parts that never change.
#   update(ctx)                 Draw the numbers. Called ten times a second,
#                               right after ctx.take_peak().
#   tick(ctx, now)              Optional. Called all the time, for small animations.
#   shake_done(ctx, now, new)   Optional. Called when a shake ends. new is True
#                               if that shake set a new record.
#   hold(ctx, ms, now)          Optional. Called when the button is held down.
#                               Return True if this mode did something with it.
import math
import time
import config
import widgets
import vga1_8x16 as SMALL_FONT


class Context:
    def __init__(self, display, records, mode_count):
        self.display = display
        self.records = records
        self.mode_count = mode_count
        self.mode_index = 0
        self.sensor_ok = True

        # The latest reading, in g.
        self.x = None
        self.y = None
        self.z = None
        self.strength = 0.0        # the latest shake strength
        self.peak = 0.0            # the biggest strength since the last redraw
        self.draw_peak = 0.0       # the peak the modes draw this time

        # The shake detector.
        self.shaking = False
        self.shake_peak = 0.0      # the biggest strength in the shake going on now
        self.last_loud = 0         # when the strength was last over the threshold
        self.last_shake = 0.0      # how strong the last finished shake was
        self.shake_count = 0       # shakes since the program started

        # The bubble level's "this is level" point. Hold the button in the
        # Bubble mode to change it.
        self.level_x = 0.0
        self.level_y = 0.0

        # One peak for every redraw, oldest overwritten first. The Graph
        # mode draws from this, so it can show the past.
        self.history = [0.0] * config.GRAPH_WIDTH
        self.sample_count = 0

    # --- readings -------------------------------------------------------
    def add_reading(self, x, y, z, now):
        """Store a reading and run the shake detector.

        Returns True when a shake has just ended."""
        self.x = x
        self.y = y
        self.z = z
        total = math.sqrt(x * x + y * y + z * z)
        strength = abs(total - 1.0)
        self.strength = strength
        if strength > self.peak:
            self.peak = strength

        if strength >= config.SHAKE_THRESHOLD_G:
            if not self.shaking:
                self.shaking = True            # a new shake begins
                self.shake_peak = 0.0
            self.last_loud = now
            if strength > self.shake_peak:
                self.shake_peak = strength
        elif self.shaking and time.ticks_diff(now, self.last_loud) >= config.SHAKE_QUIET_MS:
            self.shaking = False               # quiet for long enough: it is over
            self.last_shake = self.shake_peak
            self.shake_count += 1
            return True
        return False

    def take_peak(self):
        """Hand back the biggest strength since the last redraw, and start over.
        The peak also goes into the history for the graph."""
        peak = self.peak
        self.peak = 0.0
        self.draw_peak = peak
        self.history[self.sample_count % len(self.history)] = peak
        self.sample_count += 1
        return peak

    def have_reading(self):
        return self.x is not None

    # --- colors ---------------------------------------------------------
    def color_for(self, strength):
        return widgets.shake_color(strength, config.SHAKE_FULL_G)

    # --- shared screen parts ---------------------------------------------
    def begin(self):
        """Start a new screen: wipe it, and draw the page dots."""
        self.display.fill(config.BLACK)
        self.draw_page_dots()

    def draw_page_dots(self):
        """One dot for each mode. The bright one is the mode you are in."""
        start = config.CENTER_X - (self.mode_count - 1) * 6
        for i in range(self.mode_count):
            color = config.GREY
            if i == self.mode_index:
                color = config.WHITE
            self.display.fill_rect(start + i * 12 - 2, 216, 5, 5, color)


class Mode:
    """The pattern every display mode follows."""
    NAME = "Mode"

    # The line of small text near the top. When the sensor stops answering it
    # turns into a red SENSOR FAIL, and it goes back when the sensor returns.
    TITLE = ""
    TITLE_Y = 36
    TITLE_COLOR = config.WHITE

    def enter(self, ctx):
        pass

    def update(self, ctx):
        pass

    def tick(self, ctx, now):
        pass

    def shake_done(self, ctx, now, new_record):
        pass

    def hold(self, ctx, ms, now):
        return False

    def draw_status(self, ctx, ok):
        if ok:
            text = self.TITLE
            color = self.TITLE_COLOR
        else:
            text = "SENSOR FAIL"
            color = config.RED
        widgets.draw_centered(ctx.display, SMALL_FONT, widgets.pad_center(text, 12),
                              config.CENTER_X, self.TITLE_Y, color, config.BLACK)
