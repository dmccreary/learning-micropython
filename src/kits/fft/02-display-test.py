from machine import Pin, SPI
import ssd1306

spi_sck=Pin(2)
spi_tx=Pin(3)

spi=SPI(0, baudrate=100000, sck=spi_sck, mosi=spi_tx)

RES = Pin(4)
DC = Pin(5)
CS = Pin(6)

oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

# flash all pixels on oled.fill(0)
oled.show()
oled.text('MicroPython', 0, 0, 1)
oled.text('Rocks!', 10, 10, 1)
oled.show()