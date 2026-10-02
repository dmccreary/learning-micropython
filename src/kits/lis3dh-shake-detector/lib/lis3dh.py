# lis3dh.py -- talk to the LIS3DH accelerometer.
#
# Labs 02 to 07 each carry their own copy of this code so you can read one
# file from top to bottom. Lab 09 has five modes that all need the sensor, so
# the code lives here, in one place, instead.
#
#     sensor = LIS3DH(i2c, 0x18, 4, 100)
#     sensor.start()
#     x, y, z = sensor.read()        # in g
import time

WHO_AM_I = 0x0F
CTRL_REG1 = 0x20
CTRL_REG4 = 0x23
OUT_X_L = 0x28
AUTO_NEXT = 0x80
LIS3DH_ID = 0x33

RATE_CODES = {1: 1, 10: 2, 25: 3, 50: 4, 100: 5, 200: 6, 400: 7}
RANGE_CODES = {2: 0, 4: 1, 8: 2, 16: 3}
MG_PER_STEP = {2: 1, 4: 2, 8: 4, 16: 12}


class LIS3DH:
    def __init__(self, i2c, address, range_g, rate_hz):
        self.i2c = i2c
        self.address = address
        self.range_g = range_g
        self.rate_hz = rate_hz
        self.g_per_step = MG_PER_STEP[range_g] / 1000.0
        self.buffer = bytearray(6)       # reused for every reading, so no new memory

    def start(self):
        """Check the chip's ID and turn it on.

        Raises OSError if it will not answer, and ValueError if the chip is
        not a LIS3DH."""
        chip_id = self.i2c.readfrom_mem(self.address, WHO_AM_I, 1)[0]
        if chip_id != LIS3DH_ID:
            raise ValueError("WHO_AM_I is {}, not 0x33".format(hex(chip_id)))
        rate = RATE_CODES[self.rate_hz]
        self.i2c.writeto_mem(self.address, CTRL_REG1, bytes([(rate << 4) | 0x07]))
        size = RANGE_CODES[self.range_g]
        self.i2c.writeto_mem(self.address, CTRL_REG4, bytes([0x80 | (size << 4) | 0x08]))
        time.sleep_ms(20)

    def _to_g(self, low, high):
        raw = (high << 8) | low
        if raw >= 32768:
            raw = raw - 65536
        return (raw >> 4) * self.g_per_step

    def read(self):
        """Return one (x, y, z) reading, in g. Raises OSError if the sensor does not answer."""
        data = self.buffer
        self.i2c.readfrom_mem_into(self.address, OUT_X_L | AUTO_NEXT, data)
        return (self._to_g(data[0], data[1]),
                self._to_g(data[2], data[3]),
                self._to_g(data[4], data[5]))
