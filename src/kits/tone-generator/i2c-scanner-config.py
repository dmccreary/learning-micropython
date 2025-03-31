from machine import Pin, I2C
import config

# Pins on the Grove Connector 1 on the Maker Pi RP2040 are GP0 and GP1
sda=Pin(config.I2C_SDA_PIN)
scl=Pin(config.I2C_SCL_PIN)
i2c=I2C(config.I2C_BUS, sda=sda, scl=scl, freq=config.I2C_BUS_FREQ)

device_ids = i2c.scan()
print("found", len(device_ids), "items")
for i in device_ids:
    print(i)