import time
from machine import Pin, SPI
import ssd1322
import config

spi = SPI(config.SPI_BUS, baudrate=10_000_000, sck=Pin(config.SPI_SCK_PIN), mosi=Pin(config.SPI_SDA_PIN))
disp = ssd1322.SSD1322_SPI(256, 64, spi, dc=Pin(config.SPI_DC_PIN), cs=Pin(config.SPI_CS_PIN), res=Pin(config.SPI_RES_PIN))
disp.set_orientation(h_flip=False, v_flip=True, nibble_remap=False)

DISPLAY_WIDTH = config.DISPLAY_WIDTH
DISPLAY_HEIGHT = config.DISPLAY_HEIGHT
# Basic test sequence
print("Starting display bounds test...")

# disp.rotate(0x06)

# Fill with black
disp.fill(0)
# Draw text

# horizontal line across the top x1, y1, x2. y2
disp.line(0, 0, DISPLAY_WIDTH-1, 0, 15)

# vertical line on the left edge
disp.line(0, 0, 0, DISPLAY_HEIGHT-1, 15)

# horizontal line on the botton edge
disp.line(0, DISPLAY_HEIGHT-1, DISPLAY_WIDTH-1, DISPLAY_HEIGHT-1, 15)

# vertical line on the right edge
disp.line(DISPLAY_WIDTH-1, 0, DISPLAY_WIDTH-1, DISPLAY_HEIGHT-1, 15)

disp.text("ABCDEFGHIJKLMNOPQRSTUVWXYZ123456", 2, 2)

disp.show()

