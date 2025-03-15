from machine import Pin, SPI
import ssd1322
import config

spi = SPI(config.SPI_BUS, baudrate=10_000_000, sck=Pin(config.SPI_SCK_PIN), mosi=Pin(config.SPI_SDA_PIN))
disp = ssd1322.SSD1322_SPI(256, 64, spi, dc=Pin(config.SPI_DC_PIN), cs=Pin(config.SPI_CS_PIN), res=Pin(config.SPI_RES_PIN))

disp.set_orientation(h_flip=False, v_flip=True, nibble_remap=False)
disp.text("Hello World!",0,0);
disp.show()
