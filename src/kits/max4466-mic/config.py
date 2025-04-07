# MAX4466 Microphone with built-in aplifier
MAX4466_PIN = 26

# OLED DISPLAY
# SPI Display Bus and Pins
SPI_BUS = 0
SPI_SCL_PIN = 2 # Clock
SPI_SDA_PIN = 3 # labeled SDI(MOSI) on the back of the display
SPI_RESET_PIN = 4 # Reset
SPI_DC_PIN = 5 # Data/command
SPI_CS_PIN = 6 # Chip Select

# OLED Screen Dimensions
DISPLAY_WIDTH=128
DISPLAY_HEIGHT=64

""" Sample code:
SCL   = Pin(config.SPI_SCL_PIN) # SPI CLock
SDA   = Pin(config.SPI_SDA_PIN) # SPI Data
RESET = Pin(config.SPI_RESET_PIN) # Reset
DC    = Pin(config.SPI_DC_PIN) # Data/command
CS    = Pin(config.SPI_CS_PIN) # Chip Select

spi=SPI(config.SPI_BUS, sck=SCL, mosi=SDA)
oled = ssd1306.SSD1306_SPI(config.DISPLAY_WIDTH, config.DISPLAY_HEIGHT, spi, DC, RESET, CS)
"""