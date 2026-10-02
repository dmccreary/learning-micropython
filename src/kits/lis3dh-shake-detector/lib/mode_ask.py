# mode_ask.py -- mode 5: Ask Me, a shake-for-an-answer fortune teller.
#
# Think of a yes-or-no question. Shake the board. When the shake ends, an
# answer appears in a random color. It is only a game: the answer comes from
# a random number, not from magic!
#
# Want different answers? Change the ANSWERS list below. Keep each one to 11
# letters or fewer, or it will not fit on the round screen.
import random
import time
import config
import widgets
from shake_ctx import Mode
import vga1_8x16 as SMALL_FONT
import vga1_bold_16x32 as BIG_FONT

CENTER_X = config.CENTER_X
CENTER_Y = config.CENTER_Y

ANSWERS = (
    "YES!", "NO", "MAYBE", "FOR SURE!", "NOT TODAY",
    "ASK AGAIN", "YOU BET!", "DOUBT IT", "OH YES!", "HMM... NO",
    "LOOKS GOOD", "TRY LATER",
)
ANSWER_COLORS = (config.YELLOW, config.CYAN, config.GREEN, config.MAGENTA,
                 config.ORANGE, config.WHITE)

LINE_1_Y = 88
LINE_2_Y = 112
LINE_3_Y = 136
ANSWER_Y = CENTER_Y - BIG_FONT.HEIGHT // 2
SPIN_R = 56              # how far from the middle the spinning dots go
SPIN_DOTS = 12
DOT = 7                  # each dot is a small square. One drawing call each,
                         # so the spinner never makes the sensor wait.

WAITING = 0
SHAKING = 1
ANSWER = 2


def pick(count, not_this):
    """A random whole number from 0 to count - 1, but never not_this."""
    while True:
        n = random.getrandbits(8) % count
        if n != not_this:
            return n


class AskMode(Mode):
    NAME = "Ask"
    TITLE = "ASK ME"
    TITLE_Y = 44

    def __init__(self):
        self.state = None
        self.answer = -1
        self.answer_until = 0
        self.spin = 0

    def enter(self, ctx):
        ctx.begin()
        self.draw_status(ctx, ctx.sensor_ok)
        self.state = None
        self.show_waiting(ctx)

    def clear_middle(self, ctx):
        # The middle of the screen, between the title and the page dots.
        ctx.display.fill_rect(24, 61, 192, 146, config.BLACK)

    def show_waiting(self, ctx):
        self.state = WAITING
        self.clear_middle(ctx)
        d = ctx.display
        widgets.draw_centered(d, SMALL_FONT, "Ask a yes or no", CENTER_X, LINE_1_Y,
                              config.WHITE, config.BLACK)
        widgets.draw_centered(d, SMALL_FONT, "question, then", CENTER_X, LINE_2_Y,
                              config.WHITE, config.BLACK)
        widgets.draw_centered(d, SMALL_FONT, "SHAKE ME!", CENTER_X, LINE_3_Y,
                              config.YELLOW, config.BLACK)

    def show_shaking(self, ctx):
        self.state = SHAKING
        self.clear_middle(ctx)
        widgets.draw_centered(ctx.display, SMALL_FONT, "thinking...", CENTER_X,
                              CENTER_Y - 8, config.WHITE, config.BLACK)
        for x, y in SPIN_POINTS:
            ctx.display.fill_rect(x - DOT // 2, y - DOT // 2, DOT, DOT, config.GREY)

    def show_answer(self, ctx, now):
        self.state = ANSWER
        self.answer = pick(len(ANSWERS), self.answer)
        color = ANSWER_COLORS[random.getrandbits(8) % len(ANSWER_COLORS)]
        self.clear_middle(ctx)
        widgets.draw_centered(ctx.display, BIG_FONT, ANSWERS[self.answer],
                              CENTER_X, ANSWER_Y, color, config.BLACK)
        self.answer_until = time.ticks_add(now, config.ANSWER_SECONDS * 1000)

    def update(self, ctx):
        if ctx.shaking and self.state != SHAKING:
            self.show_shaking(ctx)
        if self.state == SHAKING:
            # Twelve grey dots in a circle. One yellow dot chases around it:
            # paint the old one grey again, and the next one yellow.
            d = ctx.display
            for i in (self.spin, (self.spin + 1) % SPIN_DOTS):
                x, y = SPIN_POINTS[i]
                color = config.GREY if i == self.spin else config.YELLOW
                d.fill_rect(x - DOT // 2, y - DOT // 2, DOT, DOT, color)
            self.spin = (self.spin + 1) % SPIN_DOTS

    def shake_done(self, ctx, now, new_record):
        self.show_answer(ctx, now)

    def tick(self, ctx, now):
        if self.state == ANSWER and time.ticks_diff(now, self.answer_until) >= 0:
            self.show_waiting(ctx)


def _spin_points():
    import math
    points = []
    for i in range(SPIN_DOTS):
        angle = math.radians(i * 360 / SPIN_DOTS)
        points.append((int(CENTER_X + SPIN_R * math.sin(angle) + 0.5),
                       int(CENTER_Y - SPIN_R * math.cos(angle) + 0.5)))
    return points


SPIN_POINTS = _spin_points()
