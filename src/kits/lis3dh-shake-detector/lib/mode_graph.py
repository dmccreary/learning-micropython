# mode_graph.py -- mode 3: a live graph of the shake strength.
#
# Ten times a second, one new bar is added to the graph, moving from left to
# right. The taller the bar, the harder the shake. When the graph reaches the
# right edge it starts over on the left, like the sweep of a heart monitor.
# A thin grey line (the cursor) marks where the next bar goes, and
# everything behind it is the recent past.
#
# The dotted line is SHAKE_THRESHOLD_G. A bar that pokes above it counts as
# a shake.
#
# Drawing one bar takes only two or three drawing calls: erase the old
# column, then draw the new bar as one thin rectangle.
import config
import widgets
from shake_ctx import Mode
import vga1_8x16 as SMALL_FONT
import vga1_bold_16x32 as BIG_FONT

CENTER_X = config.CENTER_X

PLOT_W = config.GRAPH_WIDTH
PLOT_H = 80
PLOT_X = CENTER_X - PLOT_W // 2
PLOT_Y = 92
PLOT_BOTTOM = PLOT_Y + PLOT_H - 1

VALUE_Y = 50
SPAN_Y = 180

VALUE_WIDTH = 4 * BIG_FONT.WIDTH + 4 + SMALL_FONT.WIDTH
VALUE_X = CENTER_X - VALUE_WIDTH // 2
UNIT_X = VALUE_X + 4 * BIG_FONT.WIDTH + 4

CURSOR = widgets.dim(config.WHITE, 40)


def y_for(strength):
    """Turn a shake strength into a height on the screen."""
    fraction = strength / config.SHAKE_FULL_G
    if fraction > 1.0:
        fraction = 1.0
    return PLOT_BOTTOM - int(fraction * (PLOT_H - 1))


THRESHOLD_Y = y_for(config.SHAKE_THRESHOLD_G)


class GraphMode(Mode):
    NAME = "Graph"
    TITLE = "SHAKE GRAPH"
    TITLE_Y = 32

    def enter(self, ctx):
        d = ctx.display
        ctx.begin()
        self.draw_status(ctx, ctx.sensor_ok)
        d.rect(PLOT_X - 1, PLOT_Y - 1, PLOT_W + 2, PLOT_H + 2, config.GREY)

        seconds = PLOT_W * config.DRAW_MS // 1000
        widgets.draw_centered(d, SMALL_FONT, "last %d sec" % seconds,
                              CENTER_X, SPAN_Y, config.GREY, config.BLACK)
        self.replot(ctx)

    def draw_bar(self, ctx, n):
        """Draw peak number n as one column of the graph."""
        d = ctx.display
        column = n % PLOT_W
        x = PLOT_X + column
        strength = ctx.history[column]
        d.fill_rect(x, PLOT_Y, 1, PLOT_H, config.BLACK)
        if column % 4 == 0:
            d.pixel(x, THRESHOLD_Y, config.WHITE)      # the dotted threshold line
        top = y_for(strength)
        if top < PLOT_BOTTOM:
            d.fill_rect(x, top, 1, PLOT_BOTTOM - top + 1, ctx.color_for(strength))

    def draw_cursor(self, ctx, n):
        """The thin line that shows where bar number n will go."""
        x = PLOT_X + n % PLOT_W
        ctx.display.fill_rect(x, PLOT_Y, 1, PLOT_H, CURSOR)

    def replot(self, ctx):
        """Wipe the graph and draw all the recent bars again."""
        d = ctx.display
        d.fill_rect(PLOT_X, PLOT_Y, PLOT_W, PLOT_H, config.BLACK)
        for x in range(PLOT_X, PLOT_X + PLOT_W, 4):
            d.pixel(x, THRESHOLD_Y, config.WHITE)
        latest = ctx.sample_count - 1
        count = min(ctx.sample_count, PLOT_W)
        for n in range(latest - count + 1, latest + 1):
            if ctx.history[n % PLOT_W] > 0.0:
                self.draw_bar(ctx, n)
        self.draw_cursor(ctx, latest + 1)

    def update(self, ctx):
        d = ctx.display
        latest = ctx.sample_count - 1
        self.draw_bar(ctx, latest)
        self.draw_cursor(ctx, latest + 1)

        peak = ctx.draw_peak
        color = ctx.color_for(peak)
        if peak > 9.99:
            peak = 9.99
        d.text(BIG_FONT, "%4.2f" % peak, VALUE_X, VALUE_Y, color, config.BLACK)
        d.text(SMALL_FONT, "g", UNIT_X, VALUE_Y + 16, color, config.BLACK)
