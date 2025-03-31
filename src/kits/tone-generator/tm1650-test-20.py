# TM1650 Test 20 - note the left-most digit changes!

from machine import Pin, I2C
import config
from utime import sleep

# Configure I2C
sda = Pin(config.I2C_SDA_PIN)
scl = Pin(config.I2C_SCL_PIN)
i2c = I2C(config.I2C_BUS, sda=sda, scl=scl, freq=50000)  # 100 kHz

# Display addresses
DISPLAY_ADDR = [0x24, 0x25, 0x26, 0x27]  # Display registers
CONTROL_ADDR = 0x34  # Main control register

# Use the successful mode (0x79 or the mode that showed different patterns)
DISPLAY_MODE = 0x79

def test_alternative_controls():
    """Test alternative control register values"""
    alternative_modes = [
        0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
        0x78, 0x79, 0x7A, 0x7B, 0x7C, 0x7D, 0x7E, 0x7F,
        0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
        0x88, 0x89, 0x8A, 0x8B, 0x8C, 0x8D, 0x8E, 0x8F
    ]
    
    print("Testing alternative control values (showing 0)...")
    # Testing control mode:
    # Digits 2, 3 and 4 are always just "F"
    # Here is a list of the first leftmost digit:
    # 0x71 = F
    # 0x73 = P
    # 0x76 = H
    # 0x77 = A
    # 0x79 = E
    # 0x7c = 6
    # 0x7f = 8
    # 0x78 = 7
    # 0x80 = all off
    # 0x81 = segment a
    # 0x82 = segment b
    # 0x83 = segments a and b
    # 0x84 = segment c
    # 0x85 = segment a and c
    # 0x86 = sebments b and c which is the digit 1
    for mode in alternative_modes:
        # Reset display
        i2c.writeto(CONTROL_ADDR, b'\x00')
        sleep(0.1)
        
        # Clear all segments
        for addr in DISPLAY_ADDR:
            i2c.writeto(addr, b'\x00')
        
        # Set zero pattern on all positions
        for addr in DISPLAY_ADDR:
            i2c.writeto(addr, b'\x3F')  # "0" pattern
        
        # Set the new control mode
        print(f"Testing control mode: 0x{mode:02x}")
        i2c.writeto(CONTROL_ADDR, bytes([mode]))
        sleep(3.0)


print("\nTesting alternative controls...")
test_alternative_controls()

print("\nTests completed")