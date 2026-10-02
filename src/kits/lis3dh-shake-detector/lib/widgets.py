# widgets.py -- colors, text helpers and gauges shared by the display modes.
#
# Everything here is built from the drawing tools in shapes.py and the
# display driver: filled rectangles, filled circles and filled polygons.
# There are no picture files.
import math
from array import array
import shapes

# ---------------------------------------------------------------------------
# Colors
# ---------------------------------------------------------------------------
# The screen wants RGB565 colors: 5 bits of red, 6 of green, 5 of blue, packed
# into one number. We do our color math with normal (red, green, blue) numbers
# from 0 to 255, and pack them at the very end.


def color565(red, green, blue):
    return ((red & 0xF8) << 8) | ((green & 0xFC) << 3) | (blue >> 3)


def split565(color):
    """Undo color565: give back (red, green, blue), each 0 to 255."""
    red = ((color >> 11) & 0x1F) * 255 // 31
    green = ((color >> 5) & 0x3F) * 255 // 63
    blue = (color & 0x1F) * 255 // 31
    return red, green, blue


def dim(color, amount_percent):
    """Make a color darker. 100 keeps it, 50 is half as bright, 0 is black."""
    red, green, blue = split565(color)
    return color565(red * amount_percent // 100,
                    green * amount_percent // 100,
                    blue * amount_percent // 100)


def gradient(stops, position):
    """Slide along a list of (red, green, blue) colors.

    position 0.0 gives the first color and 1.0 gives the last. Anything in
    between is a smooth mix of the two colors on either side. This is how a
    handful of colors becomes a whole rainbow."""
    if position <= 0.0:
        stop = stops[0]
        return color565(stop[0], stop[1], stop[2])
    if position >= 1.0:
        stop = stops[-1]
        return color565(stop[0], stop[1], stop[2])

    gaps = len(stops) - 1
    scaled = position * gaps
    index = int(scaled)
    if index >= gaps:
        index = gaps - 1
    blend = scaled - index

    start = stops[index]
    end = stops[index + 1]
    return color565(int(start[0] + (end[0] - start[0]) * blend),
                    int(start[1] + (end[1] - start[1]) * blend),
                    int(start[2] + (end[2] - start[2]) * blend))


# Calm is green. A bigger shake slides through yellow and orange to red, and
# the very biggest shakes turn magenta.
SHAKE_STOPS = ((0, 200, 90), (230, 230, 40), (255, 150, 0), (255, 30, 30), (255, 0, 255))


def shake_color(strength_g, full_g):
    """The color for a shake strength. 0 g is green, full_g and more is magenta."""
    return gradient(SHAKE_STOPS, strength_g / full_g)


# ---------------------------------------------------------------------------
# Text helpers
# ---------------------------------------------------------------------------
def pad_center(text, width):
    """Pad text with spaces on both sides so it is exactly `width` letters."""
    extra = width - len(text)
    if extra <= 0:
        return text
    left = extra // 2
    return " " * left + text + " " * (extra - left)


def draw_centered(display, font, text, center_x, y, color, background):
    x = center_x - (len(text) * font.WIDTH) // 2
    display.text(font, text, x, y, color, background)


# ---------------------------------------------------------------------------
# Segmented arc gauge
# ---------------------------------------------------------------------------
class ArcGauge:
    """A curved gauge made of little blocks, like the rings on a smartwatch.

    Each block is a four-sided polygon. Angles are measured clockwise from
    12 o'clock. A lit block glows in its own color from the gradient; an
    unlit block is a dim version of the same color. When the value changes we
    only repaint the blocks that changed, which keeps the screen quick."""

    def __init__(self, center_x, center_y, r_in, r_out, segments,
                 start_deg, sweep_deg, gap_deg, stops):
        self.segments = segments
        self.polygons = []
        self.lit_colors = []
        self.dim_colors = []
        self.state = [None] * segments      # None = never drawn
        step = sweep_deg / segments
        for i in range(segments):
            a0 = math.radians(start_deg + i * step + gap_deg / 2)
            a1 = math.radians(start_deg + (i + 1) * step - gap_deg / 2)
            self.polygons.append(array('h', [
                self._x(center_x, r_in, a0), self._y(center_y, r_in, a0),
                self._x(center_x, r_out, a0), self._y(center_y, r_out, a0),
                self._x(center_x, r_out, a1), self._y(center_y, r_out, a1),
                self._x(center_x, r_in, a1), self._y(center_y, r_in, a1)]))
            color = gradient(stops, i / (segments - 1))
            self.lit_colors.append(color)
            self.dim_colors.append(dim(color, 18))

    @staticmethod
    def _x(center, radius, angle):
        return int(center + radius * math.sin(angle) + 0.5)

    @staticmethod
    def _y(center, radius, angle):
        return int(center - radius * math.cos(angle) + 0.5)

    def forget(self):
        """Call this after the screen has been wiped, so every block is redrawn."""
        self.state = [None] * self.segments

    def set_level(self, display, lit_count):
        """Light the first lit_count blocks. Only blocks that changed are drawn."""
        if lit_count < 0:
            lit_count = 0
        if lit_count > self.segments:
            lit_count = self.segments
        for i in range(self.segments):
            lit = i < lit_count
            if self.state[i] is not lit:
                self.state[i] = lit
                if lit:
                    color = self.lit_colors[i]
                else:
                    color = self.dim_colors[i]
                shapes.poly(display, 0, 0, self.polygons[i], color, 1)
