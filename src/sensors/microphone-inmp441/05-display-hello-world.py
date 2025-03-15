# oled using SSD1306 driver
import machine
import ssd1306

# customize these numbers if your hardware config is different
SCL=machine.Pin(2) # SPI CLock
SDA=machine.Pin(3) # SPI Data
RES = machine.Pin(4) # Reset
DC = machine.Pin(5) # Data/command
CS = machine.Pin(6) # Chip Select

spi=machine.SPI(0, sck=SCL, mosi=SDA)
oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

# erase the entire screen with black (0=black)
oled.fill(0)

# place a hello message at point (0,0) in white (1=white text)
oled.text("Hello world!", 0, 0, 1)

# send the entire frame buffer to the display via the SPI bus
oled.show()