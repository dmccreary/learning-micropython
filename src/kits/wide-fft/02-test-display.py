from machine import Pin, SPI
from ssd1322 import Display

# TODO - read from config.py
DISPLAY_WIDTH = 256
DISPLAY_HEIGHT = 64
# Default for SPI bus 0
SPI_BUS = 0
SPI_SCK_PIN = 2
SPI_SDA_PIN = 3
# Other display control signals
SPI_RES_PIN = 4
SPI_DC_PIN = 5
SPI_CS_PIN = 6


spi = SPI(SPI_BUS, baudrate=3000000, sck=Pin(SPI_SCK_PIN), mosi=Pin(SPI_SDA_PIN))

display = Display(spi, dc=Pin(SPI_DC_PIN), cs=Pin(SPI_CS_PIN), rst=Pin(SPI_RES_PIN))

display.clear()
display.fill_rectangle(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT)
display.present()