# mode_meter.py -- mode 1: the shake meter.
#
# A rainbow ring gauge runs around the edge of the screen. Shake the board
# and the ring shoots up from green toward red and magenta, then falls back
# slowly, like the lights on a music player. The big number in the middle is
# the same shake strength, in g.
import config
import widgets
from shake_ctx import Mode
import vga1_8x16 as SMALL_FONT
import vga1_bold_16x32 as BIG_FONT

CENTER_X = config.CENTER_X
CENTER_Y = config.CENTER_Y

SEGMENTS = 30
START_DEGREES = -150       # 7 o'clock, measured clockwise from 12 o'clock
SWEEP_DEGREES = 300        # the last 60 degrees at the bottom are left open

VALUE_Y = 86
STATUS_Y = 128
COUNT_Y = 150
LAST_Y = 170

# The number is four big letters ("1.84"), a small gap, then a small "g".
# Center all of it together.
VALUE_WIDTH = 4 * BIG_FONT.WIDTH + 4 + SMALL_FONT.WIDTH
VALUE_X = CENTER_X - VALUE_WIDTH // 2
UNIT_X = VALUE_X + 4 * BIG_FONT.WIDTH + 4


class MeterMode(Mode):
    NAME = "Meter"
    TITLE = "SHAKE METER"
    TITLE_Y = 64

    def __init__(self):
        self.gauge = widgets.ArcGauge(
            CENTER_X, CENTER_Y, 90, 102, SEGMENTS, START_DEGREES, SWEEP_DEGREES,
            1.6, widgets.SHAKE_STOPS)
        self.level = 0.0
        self.was_shaking = None
        self.count_text = None

    def enter(self, ctx):
        ctx.begin()
        self.gauge.forget()
        self.draw_status(ctx, ctx.sensor_ok)
        self.level = 0.0
        self.was_shaking = None
        self.count_text = None

    def update(self, ctx):
        d = ctx.display

        # Jump up at once, fall back slowly.
        self.level = self.level * config.METER_FALL
        if ctx.draw_peak > self.level:
            self.level = ctx.draw_peak

        fraction = self.level / config.SHAKE_FULL_G
        if fraction > 1.0:
            fraction = 1.0
        self.gauge.set_level(d, int(fraction * SEGMENTS + 0.5))

        color = ctx.color_for(self.level)
        value = self.level
        if value > 9.99:
            value = 9.99                 # always four letters wide
        d.text(BIG_FONT, "%4.2f" % value, VALUE_X, VALUE_Y, color, config.BLACK)
        d.text(SMALL_FONT, "g", UNIT_X, VALUE_Y + 16, color, config.BLACK)

        if ctx.shaking != self.was_shaking:
            self.was_shaking = ctx.shaking
            if ctx.shaking:
                text, text_color = "SHAKING!", config.YELLOW
            else:
                text, text_color = "SHAKE ME!", config.GREY
            widgets.draw_centered(d, SMALL_FONT, widgets.pad_center(text, 11),
                                  CENTER_X, STATUS_Y, text_color, config.BLACK)

        text = "shakes: %d" % ctx.shake_count
        if text != self.count_text:
            self.count_text = text
            widgets.draw_centered(d, SMALL_FONT, widgets.pad_center(text, 12),
                                  CENTER_X, COUNT_Y, config.WHITE, config.BLACK)
            last = "last %4.2f g" % ctx.last_shake
            widgets.draw_centered(d, SMALL_FONT, widgets.pad_center(last, 12),
                                  CENTER_X, LAST_Y, config.GREY, config.BLACK)
