# TM1650 Test - Focus on Second Digit

from machine import Pin, I2C
import config
from utime import sleep

# Configure I2C
sda = Pin(config.I2C_SDA_PIN)
scl = Pin(config.I2C_SCL_PIN)
i2c = I2C(config.I2C_BUS, sda=sda, scl=scl, freq=50000)  # 50 kHz

# Display addresses
DISPLAY_ADDR = [0x24, 0x25, 0x26, 0x27]  # Display registers
CONTROL_ADDR = 0x34  # Main control register

# Control addresses for position 2
POSITION2_CONTROL_ADDR = [0x35, 0x36, 0x37]  # Try these as additional control addresses

# Segment patterns
SEGMENT_PATTERNS = {
    0: 0x3F,
    1: 0x06,
    2: 0x5B,
    3: 0x4F,
    4: 0x66,
    5: 0x6D,
    6: 0x7D,
    7: 0x07,
    8: 0x7F,
    9: 0x6F,
    'F': 0x71
}

def reset_display():
    """Reset the display"""
    for addr in [0x34, 0x35, 0x36, 0x37]:
        i2c.writeto(addr, b'\x00')
    sleep(0.1)

def test_second_digit():
    """Test controlling the second digit while keeping first digit working"""
    print("Testing control of second digit...")
    
    # First, make the first digit display "1" and others display "F"
    reset_display()
    
    # Set "F" pattern on all positions
    for addr in DISPLAY_ADDR:
        i2c.writeto(addr, bytes([SEGMENT_PATTERNS['F']]))
    
    # Set the control value for first digit to show "1"
    i2c.writeto(CONTROL_ADDR, bytes([SEGMENT_PATTERNS[1]]))
    print("Current display: 1FFF")
    sleep(2)
    
    # Now try to control the second digit
    for control_addr in POSITION2_CONTROL_ADDR:
        for digit in range(10):
            print(f"Trying to set second digit to {digit} using control address 0x{control_addr:02X}")
            
            # Reset display
            reset_display()
            
            # Set "F" pattern on all positions
            for addr in DISPLAY_ADDR:
                i2c.writeto(addr, bytes([SEGMENT_PATTERNS['F']]))
            
            # Set first digit to "1"
            i2c.writeto(CONTROL_ADDR, bytes([SEGMENT_PATTERNS[1]]))
            
            # Try to set second digit
            i2c.writeto(control_addr, bytes([SEGMENT_PATTERNS[digit]]))
            
            sleep(1)

def test_alternative_approach():
    """Try a completely different approach for controlling multiple digits"""
    print("Testing alternative approaches...")
    
    # Try writing different patterns to the display addresses and then
    # cycling through different control values
    for control_val in range(0x70, 0x80):
        reset_display()
        
        # Write different patterns to each position
        i2c.writeto(DISPLAY_ADDR[0], bytes([SEGMENT_PATTERNS[1]]))
        i2c.writeto(DISPLAY_ADDR[1], bytes([SEGMENT_PATTERNS[2]]))
        i2c.writeto(DISPLAY_ADDR[2], bytes([SEGMENT_PATTERNS[3]]))
        i2c.writeto(DISPLAY_ADDR[3], bytes([SEGMENT_PATTERNS[4]]))
        
        # Set control value
        i2c.writeto(CONTROL_ADDR, bytes([control_val]))
        
        print(f"Testing control value: 0x{control_val:02X}")
        sleep(1)

# Main program
print("TM1650 Second Digit Test")
print("1: Test control of second digit")
print("2: Test alternative approach")
choice = input("Enter choice: ")

try:
    if choice == "1":
        test_second_digit()
    elif choice == "2":
        test_alternative_approach()
    else:
        print("Invalid choice")
except KeyboardInterrupt:
    print("\nTest interrupted by user")
finally:
    # Reset display
    reset_display()
    print("\nTest completed")