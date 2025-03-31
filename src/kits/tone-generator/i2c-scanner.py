import machine
# Pins on the Grove Connector 1 on the Maker Pi RP2040 are GP0 and GP1
sda=machine.Pin(0)
scl=machine.Pin(1)
i2c=machine.I2C(0, sda=sda, scl=scl, freq=1_000_000)
device_ids = i2c.scan()
print("found", len(device_ids), "items")
for i in device_ids:
    print(i)