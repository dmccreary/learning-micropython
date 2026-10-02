# records.py -- remember the best shake and the number of shakes, even after unplugging.
#
# The two records live in a tiny text file on the Pico, like this:
#
#     2.84 57
#
# That is: the strongest shake ever (in g), and how many shakes in all.
#
# Flash memory wears out if you write to it too often, so we do NOT save on
# every shake. When a record changes we just make a note of it, and the
# note is saved when at least save_seconds have passed since the last save.
import time


class Records:
    def __init__(self, filename, save_seconds):
        self.filename = filename
        self.save_ms = save_seconds * 1000
        self.best = 0.0                # the strongest shake, in g
        self.total = 0                 # how many shakes in all
        self.changed = False           # True when there is something to save
        self.last_save = time.ticks_ms()
        self.load()

    def load(self):
        """Read the records file. If it is missing or broken, start fresh."""
        try:
            with open(self.filename) as f:
                parts = f.read().split()
            if len(parts) == 2:
                self.best = float(parts[0])
                self.total = int(parts[1])
        except (OSError, ValueError):
            pass

    def save(self):
        try:
            with open(self.filename, "w") as f:
                f.write("%.2f %d\n" % (self.best, self.total))
            self.changed = False
        except OSError:
            pass                       # a full or busy disk must not stop the display
        self.last_save = time.ticks_ms()

    def add_shake(self, strength):
        """Count one finished shake. Returns True if it set a new record."""
        self.total += 1
        self.changed = True
        if strength > self.best:
            self.best = strength
            return True
        return False

    def save_if_due(self, now):
        if self.changed and time.ticks_diff(now, self.last_save) >= self.save_ms:
            self.save()

    def clear(self):
        """Forget everything, and delete the file."""
        self.best = 0.0
        self.total = 0
        self.changed = False
        try:
            import os
            os.remove(self.filename)
        except OSError:
            pass
