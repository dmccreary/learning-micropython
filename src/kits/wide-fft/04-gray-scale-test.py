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
spi = SPI(0, baudrate=1_000_000, sck=scl, mosi=sda)

# Initialize display
disp = ssd1322v2.SSD1322_SPI(256, 64, spi, dc, cs, res)

# Basic test sequence
print("Starting display grayscale test...")

# disp.rotate(0x06)

# the left side is off by 15
x_left = 15

for i in range(0,16):
    # x1, y1, x2, y2, col
    # draw 4 vertical lines of the same shade
    disp.line(x_left, i*4,   DISPLAY_WIDTH-1, i*4,   i)
    disp.line(x_left, i*4+1, DISPLAY_WIDTH-1, i*4+1, i)
    disp.line(x_left, i*4+2, DISPLAY_WIDTH-1, i*4+2, i)
    disp.line(x_left, i*4+3, DISPLAY_WIDTH-1, i*4+3, i)
disp.show()

