# I2C Scanner for the SHT40 Temperature and Humidity Sensor
#
# The SHT40 is an I2C device.  Before we can read a temperature from it
# we have to prove the Pico can actually "see" the sensor on the I2C bus.
# This program asks the I2C bus "who is out there?" and prints every
# address that answers back.
#
# Wiring (standard Pico breadboard):
#   SHT40 VIN -> 3.3V (pin 36)     <- do NOT use 5V
#   SHT40 GND -> GND
#   SHT40 SDA -> GP0 (pin 1)       <- row one on our standard breadboard
#   SHT40 SCL -> GP1 (pin 2)       <- row two on our standard breadboard

from machine import Pin, I2C

# The SHT40 always answers at one of these three addresses.
# Most breakout boards (Adafruit, SparkFun) use 0x44.
SHT40_ADDRESSES = {
    0x44: "SHT40-AD1B (most common)",
    0x45: "SHT40-BD1B",
    0x46: "SHT40-CD1B",
}

sda = Pin(0)  # row one on our standard Pico breadboard
scl = Pin(1)  # row two on our standard Pico breadboard
i2c = I2C(0, sda=sda, scl=scl, freq=400000)

# i2c.scan() returns a list of the addresses of every device it found
devices = i2c.scan()

print("Scanning the I2C bus on SDA=GP0 and SCL=GP1...")
print()

if len(devices) == 0:
    print("No I2C devices found.")
    print()
    print("Things to check:")
    print("  1. Is VIN connected to 3.3V (not 5V)?")
    print("  2. Is GND connected?")
    print("  3. Are SDA and SCL swapped? Try swapping them.")
    print("  4. Are the jumper wires pushed all the way into the breadboard?")
    print("TEST FAIL")
else:
    print("Found", len(devices), "device(s):")
    for device in devices:
        print("  decimal:", device, " hex:", hex(device))

    # Now check if any of those devices is our SHT40
    found_sht40 = False
    for device in devices:
        if device in SHT40_ADDRESSES:
            print()
            print("SHT40 found at", hex(device), "-", SHT40_ADDRESSES[device])
            found_sht40 = True

    print()
    if found_sht40:
        print("TEST PASS")
    else:
        print("Devices were found, but none of them is an SHT40.")
        print("The SHT40 should appear at 0x44, 0x45 or 0x46.")
        print("TEST FAIL")
