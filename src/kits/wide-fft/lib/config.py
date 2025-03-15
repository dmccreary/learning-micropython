# MicroPython Configuration File for SSD1322 sound analizer kit
# use "import config" in your code
# then use DISPLAY_WIDTH = config.DISPLAY_WIDTH

DISPLAY_TYPE = "SSD1322"
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

# I2S configuration for INMP441 microphone
I2S_SCK_PIN = 10  # Serial Clock
I2S_WS_PIN = 11   # Word Select
I2S_SD_PIN = 12   # Serial Data