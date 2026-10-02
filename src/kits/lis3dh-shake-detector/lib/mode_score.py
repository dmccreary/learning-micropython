# mode_score.py -- mode 4: the shake score.
#
# The display remembers the strongest shake it has ever felt and how many
# shakes it has counted. It keeps track in EVERY mode, not just this one,
# and it saves the records in a file, so they survive unplugging.
#
# Try to set a new record! To start over, hold the button for three seconds
# while you are in this mode.
import time
import config
import widgets
from shake_ctx import Mode
import vga1_8x16 as SMALL_FONT
import vga1_bold_16x32 as BIG_FONT

CENTER_X = config.CENTER_X

BEST_LABEL_Y = 56
BEST_Y = 74
TOTAL_LABEL_Y = 112
TOTAL_Y = 130
LAST_Y = 168
HINT_Y = 190

VALUE_WIDTH = 4 * BIG_FONT.WIDTH + 4 + SMALL_FONT.WIDTH
VALUE_X = CENTER_X - VALUE_WIDTH // 2
UNIT_X = VALUE_X + 4 * BIG_FONT.WIDTH + 4

HINT = "hold %ds: clear" % (config.CLEAR_PRESS_MS // 1000)


class ScoreMode(Mode):
    NAME = "Score"
    TITLE = "SHAKE SCORE"
    TITLE_Y = 32

    def __init__(self):
        self.message_until = 0
        self.shown = None

    def enter(self, ctx):
        d = ctx.display
        ctx.begin()
        self.draw_status(ctx, ctx.sensor_ok)
        widgets.draw_centered(d, SMALL_FONT, "BEST SHAKE", CENTER_X, BEST_LABEL_Y,
                              config.WHITE, config.BLACK)
        widgets.draw_centered(d, SMALL_FONT, "SHAKES", CENTER_X, TOTAL_LABEL_Y,
                              config.WHITE, config.BLACK)
        self.message_until = 0
        self.shown = None
        self.draw_hint(ctx, HINT, config.GREY)

    def draw_hint(self, ctx, text, color):
        widgets.draw_centered(ctx.display, SMALL_FONT, widgets.pad_center(text, 16),
                              CENTER_X, HINT_Y, color, config.BLACK)

    def update(self, ctx):
        records = ctx.records
        # Only redraw when a number has changed. Most of the time none has.
        now_showing = (records.best, records.total, ctx.last_shake)
        if now_showing == self.shown:
            return
        self.shown = now_showing
        d = ctx.display

        best = records.best
        if best > 9.99:
            best = 9.99
        color = ctx.color_for(best)
        d.text(BIG_FONT, "%4.2f" % best, VALUE_X, BEST_Y, color, config.BLACK)
        d.text(SMALL_FONT, "g", UNIT_X, BEST_Y + 16, color, config.BLACK)

        total = records.total
        if total > 99999:
            total = 99999
        widgets.draw_centered(d, BIG_FONT, widgets.pad_center("%d" % total, 5),
                              CENTER_X, TOTAL_Y, config.CYAN, config.BLACK)

        last = "last %4.2f g" % ctx.last_shake
        widgets.draw_centered(d, SMALL_FONT, widgets.pad_center(last, 12),
                              CENTER_X, LAST_Y, config.GREY, config.BLACK)

    def shake_done(self, ctx, now, new_record):
        if new_record:
            self.message_until = time.ticks_add(now, 2000)
            self.draw_hint(ctx, "NEW RECORD!", config.YELLOW)

    def hold(self, ctx, ms, now):
        if ms < config.CLEAR_PRESS_MS:
            return False
        ctx.records.clear()
        self.shown = None
        self.update(ctx)
        self.message_until = time.ticks_add(now, 2000)
        self.draw_hint(ctx, "RECORDS CLEARED", config.YELLOW)
        return True

    def tick(self, ctx, now):
        if self.message_until and time.ticks_diff(now, self.message_until) >= 0:
            self.message_until = 0
            self.draw_hint(ctx, HINT, config.GREY)
