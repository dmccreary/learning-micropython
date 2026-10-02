# I2C Scanner for the LIS3DH Accelerometer
#
# The LIS3DH is an I2C device. Before we can feel a shake with it, we have
# to prove the Pico can actually "see" the sensor on the I2C bus. This
# program asks the I2C bus "who is out there?" and prints every address that
# answers back.
#
# Then it asks the sensor "who are you?" Every chip in this family has a
# WHO_AM_I register (a tiny memory box inside the chip) that always holds the
# same ID number. The LIS3DH says 0x33. This matters, because some sellers
# ship a LIS3DSH instead. It looks the same, but it is a different chip, and
# the programs in this kit will not work with it.
#
# Wiring (standard Pico breadboard):
#   LIS3DH VCC -> 3V3 OUT (pin 36)  <- NOT pin 40 (VBUS), that is 5V
#   LIS3DH GND -> GND
#   LIS3DH SDA -> GP0 (pin 1)       <- row one on our standard breadboard
#   LIS3DH SCL -> GP1 (pin 2)       <- row two on our standard breadboard
#   LIS3DH CS  -> 3V3 OUT           <- tells the chip to use I2C
#   LIS3DH SDO -> GND               <- picks address 0x18
#
# The pin numbers come from config.py. If you move a wire, change the
# number there and every lab in this kit follows.

from machine import Pin, I2C
import config

WHO_AM_I = 0x0F   # the register that holds the chip's ID number

# The addresses where each chip can answer.
LIS3DH_ADDRESSES = {
    0x18: "LIS3DH with SDO wired to GND",
    0x19: "LIS3DH with SDO wired to 3V3",
}
LIS3DSH_ADDRESSES = (0x1D, 0x1E)
LIS3DSH_ID = 0x3F

sda = Pin(config.I2C_SDA_PIN)
scl = Pin(config.I2C_SCL_PIN)
i2c = I2C(config.I2C_BUS, sda=sda, scl=scl, freq=config.I2C_BUS_FREQ)

# i2c.scan() returns a list of the addresses of every device it found
devices = i2c.scan()

print("Scanning I2C bus {} on SDA=GP{} and SCL=GP{}...".format(
    config.I2C_BUS, config.I2C_SDA_PIN, config.I2C_SCL_PIN))
print()


def ask_id(address):
    """Read the WHO_AM_I register. Returns the ID, or None if it will not answer."""
    try:
        return i2c.readfrom_mem(address, WHO_AM_I, 1)[0]
    except OSError:
        return None


if len(devices) == 0:
    print("No I2C devices found.")
    print()
    print("Things to check:")
    print("  1. Is VCC on pin 36 (3V3 OUT), not pin 40 (VBUS)?")
    print("  2. Is GND connected?")
    print("  3. Is CS connected to 3V3? If CS floats, the chip may not use I2C.")
    print("  4. Are SDA and SCL swapped? Try swapping them.")
    print("  5. Are the jumper wires pushed all the way into the breadboard?")
    print("TEST FAIL")
else:
    print("Found", len(devices), "device(s):")
    for device in devices:
        print("  decimal:", device, " hex:", hex(device))

    found_address = None
    for device in devices:
        if device in LIS3DH_ADDRESSES:
            chip_id = ask_id(device)
            print()
            print("Something at", hex(device), "-", LIS3DH_ADDRESSES[device])
            if chip_id == config.LIS3DH_ID:
                print("WHO_AM_I says", hex(chip_id), "- it is a LIS3DH!")
                found_address = device
            else:
                print("But WHO_AM_I says", chip_id, "instead of", hex(config.LIS3DH_ID))
        if device in LIS3DSH_ADDRESSES and ask_id(device) == LIS3DSH_ID:
            print()
            print("A LIS3DSH is at", hex(device), "(WHO_AM_I says 0x3f).")
            print("That is a different chip from the LIS3DH. It needs")
            print("different code, so the programs in this kit will not work.")

    print()
    if found_address is None:
        print("None of these devices is a LIS3DH.")
        print("The LIS3DH should appear at 0x18 or 0x19.")
        print("TEST FAIL")
    elif found_address != config.LIS3DH_ADDR:
        print("config.py says LIS3DH_ADDR = {}, but your board".format(hex(config.LIS3DH_ADDR)))
        print("answers at {}. Open config.py and change that line to".format(hex(found_address)))
        print("    LIS3DH_ADDR = {}".format(hex(found_address)))
        print("then run this program again.")
        print("TEST FAIL")
    else:
        print("TEST PASS")
