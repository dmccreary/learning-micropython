from machine import Pin, SPI
import ssd1306
import config

# customize these numbers if your hardware config is different
SCL   = Pin(config.SPI_SCL_PIN) # SPI CLock
SDA   = Pin(config.SPI_SDA_PIN) # SPI Data
RESET = Pin(config.SPI_RESET_PIN) # Reset
DC    = Pin(config.SPI_DC_PIN) # Data/command
CS    = Pin(config.SPI_CS_PIN) # Chip Select

spi=SPI(config.SPI_BUS, sck=SCL, mosi=SDA)
oled = ssd1306.SSD1306_SPI(config.DISPLAY_WIDTH, config.DISPLAY_HEIGHT, spi, DC, RESET, CS)

# erase the entire screen with black (0=black)
oled.fill(0)

# place a hello message at point (0,0) in white (1=white text)
oled.text("Hello world!", 0, 0, 1)

# send the entire frame buffer to the display via the SPI bus
oled.show()