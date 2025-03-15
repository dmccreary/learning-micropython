import time
from machine import Pin, SPI
from utime import sleep
import ssd1322v2

DISPLAY_WIDTH = 256
DISPLAY_HEIGHT = 64

# Create Pin objects
scl = Pin(2)
sda = Pin(3)
res = Pin(4, Pin.OUT)
dc = Pin(5, Pin.OUT)
cs = Pin(6, Pin.OUT)

# Initialize with lower baud rate
spi = SPI(0, baudrate=10_000_000, sck=scl, mosi=sda)

# Initialize display
disp = ssd1322v2.SSD1322_SPI(256, 64, spi, dc, cs, res)

# Set orientation
# h_flip=False, v_flip=True, nibble_remap=False
disp.set_orientation(False, True, False)

# Display text
disp.text("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 0, 0)
disp.text(f"H:{False} V:{True} N:{False}", 0, 15)
disp.show()

