# mode_bubble.py -- mode 2: a bubble level.
#
# This mode does not look for shakes at all. It uses gravity instead. When
# the board is flat, gravity pulls straight down the Z arrow, and X and Y
# read almost zero. Tip the board and some of gravity's pull moves onto X or
# Y. We move the bubble by that much, so it drifts to the high side, just
# like the air bubble in a real carpenter's level.
#
# Get the bubble into the small circle in the middle and the screen says the
# board is level. Hold the button for about a second to say "THIS is level"
# (handy if your table is not quite flat). If the bubble runs the wrong way,
# change the BUBBLE_ settings in config.py.
import math
import time
import config
import shapes
import widgets
from shake_ctx import Mode
import vga1_8x16 as SMALL_FONT

CENTER_X = config.CENTER_X
CENTER_Y = config.CENTER_Y

OUTER_R = 104            # the ring around the edge
TARGET_R = 16            # the small circle in the middle
BUBBLE_R = 10
MAX_TRAVEL = 50          # the bubble never goes farther than this from the middle
CROSS = 50               # half the length of the cross hair lines
ANGLE_Y = 184


class BubbleMode(Mode):
    NAME = "Bubble"
    TITLE = "BUBBLE LEVEL"
    TITLE_Y = 36

    def __init__(self):
        self.bx = None           # where the bubble is drawn now
        self.by = None
        self.bubble_color = None
        self.message_until = 0
        self.angle_text = None
        self.right = 0.0         # the smoothed tilt
        self.down = 0.0

    def enter(self, ctx):
        d = ctx.display
        ctx.begin()
        shapes.ring(d, CENTER_X, CENTER_Y, OUTER_R, config.GREY, 2)
        self.draw_status(ctx, ctx.sensor_ok)
        self.draw_cross(ctx)
        self.bx = None
        self.by = None
        self.bubble_color = None
        self.message_until = 0
        self.angle_text = None
        self.right, self.down = self.tilt(ctx) if ctx.have_reading() else (0.0, 0.0)

    def draw_cross(self, ctx):
        d = ctx.display
        d.hline(CENTER_X - CROSS, CENTER_Y, CROSS * 2 + 1, config.GREY)
        d.vline(CENTER_X, CENTER_Y - CROSS, CROSS * 2 + 1, config.GREY)
        shapes.circle(d, CENTER_X, CENTER_Y, TARGET_R, config.WHITE)

    def tilt(self, ctx):
        """How far the board is tipped, in g, as (right, down) on the screen."""
        right = ctx.x - ctx.level_x
        up = ctx.y - ctx.level_y
        if config.BUBBLE_SWAP_XY:
            right, up = up, right
        if config.BUBBLE_FLIP_X:
            right = -right
        if config.BUBBLE_FLIP_Y:
            up = -up
        return right, -up        # the screen counts y downward

    def update(self, ctx):
        d = ctx.display

        # Move only part of the way toward the new tilt each time. This
        # smooths out the sensor's tiny jitters so the bubble glides.
        right, down = self.tilt(ctx)
        self.right += (right - self.right) * config.BUBBLE_SMOOTHING
        self.down += (down - self.down) * config.BUBBLE_SMOOTHING
        right = self.right
        down = self.down

        # How many degrees the board is tipped. The sideways pull is the sine
        # of the angle, so asin() turns it back into an angle.
        sideways = math.sqrt(right * right + down * down)
        if sideways > 1.0:
            sideways = 1.0
        degrees = math.degrees(math.asin(sideways))
        level = degrees < config.LEVEL_DEGREES

        # Where the bubble goes, kept inside MAX_TRAVEL.
        dx = right * config.BUBBLE_PX_PER_G
        dy = down * config.BUBBLE_PX_PER_G
        distance = math.sqrt(dx * dx + dy * dy)
        if distance > MAX_TRAVEL:
            dx = dx * MAX_TRAVEL / distance
            dy = dy * MAX_TRAVEL / distance
        bx = CENTER_X + int(dx)
        by = CENTER_Y + int(dy)

        color = config.CYAN
        if level:
            color = config.GREEN

        if (bx, by) != (self.bx, self.by):
            if self.bx is not None:
                # Paint over the old bubble with black, then fix the cross
                # hair lines it was sitting on.
                shapes.circle(d, self.bx, self.by, BUBBLE_R, config.BLACK, 1)
                self.draw_cross(ctx)
            shapes.circle(d, bx, by, BUBBLE_R, color, 1)
            self.bx = bx
            self.by = by
            self.bubble_color = color
        elif color != self.bubble_color:
            shapes.circle(d, bx, by, BUBBLE_R, color, 1)
            self.bubble_color = color

        if not self.message_until:
            if level:
                text = "LEVEL!"
            else:
                text = "tilt %4.1f deg" % degrees
            self.draw_angle(ctx, text, color)

    def draw_angle(self, ctx, text, color):
        text = widgets.pad_center(text, 14)
        if text != self.angle_text:
            self.angle_text = text
            widgets.draw_centered(ctx.display, SMALL_FONT, text,
                                  CENTER_X, ANGLE_Y, color, config.BLACK)

    def hold(self, ctx, ms, now):
        if ms < config.LONG_PRESS_MS or ctx.x is None:
            return False
        ctx.level_x = ctx.x          # from now on, this tilt counts as level
        ctx.level_y = ctx.y
        self.message_until = time.ticks_add(now, 2000)
        self.draw_angle(ctx, "LEVEL SET", config.YELLOW)
        return True

    def tick(self, ctx, now):
        if self.message_until and time.ticks_diff(now, self.message_until) >= 0:
            self.message_until = 0
            self.angle_text = None       # the next update draws the angle again
