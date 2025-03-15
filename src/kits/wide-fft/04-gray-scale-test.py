# display grascale test

from machine import Pin, SPI
import ssd1322
import config

spi = SPI(config.SPI_BUS, baudrate=10_000_000, sck=Pin(config.SPI_SCK_PIN), mosi=Pin(config.SPI_SDA_PIN))
disp = ssd1322.SSD1322_SPI(256, 64, spi, dc=Pin(config.SPI_DC_PIN), cs=Pin(config.SPI_CS_PIN), res=Pin(config.SPI_RES_PIN))
disp.set_orientation(h_flip=False, v_flip=True, nibble_remap=False)

DISPLAY_WIDTH = config.DISPLAY_WIDTH
DISPLAY_HEIGHT = config.DISPLAY_HEIGHT

# Basic test sequence
print("Starting display grayscale test...")

for i in range(0,15):
    # line(x1, y1, x2, y2, color)
    # draw 4 horizontal lines of the same shade
    disp.line(0, i*4,   DISPLAY_WIDTH-1, i*4,   i)
    disp.line(0, i*4+1, DISPLAY_WIDTH-1, i*4+1, i)
    disp.line(0, i*4+2, DISPLAY_WIDTH-1, i*4+2, i)
    disp.line(0, i*4+3, DISPLAY_WIDTH-1, i*4+3, i)
disp.show()

