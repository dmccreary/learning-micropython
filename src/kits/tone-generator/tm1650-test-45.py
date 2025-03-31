# TM1650 Test - Three-Digit Counter (Right 3 Digits)

from machine import Pin, I2C
import config
from utime import sleep

# Configure I2C
sda = Pin(config.I2C_SDA_PIN)
scl = Pin(config.I2C_SCL_PIN)
i2c = I2C(config.I2C_BUS, sda=sda, scl=scl, freq=50000)  # 50 kHz

# Display addresses - one for each digit
DIGIT_ADDR = [0x34, 0x35, 0x36, 0x37]  # Left to right

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
    'F': 0x71,
    ' ': 0x00  # Blank display
}

def reset_display():
    """Reset the display"""
    for addr in DIGIT_ADDR:
        i2c.writeto(addr, b'\x00')
    sleep(0.1)

def test_second_digit():
    """Test controlling the second digit while keeping first digit working"""
    print("Testing control of second digit...")
    
    # First, make the first digit display "1" and others display "F"
    reset_display()
    
    # Set "F" pattern on all positions
    for addr in DIGIT_ADDR:
        i2c.writeto(addr, bytes([SEGMENT_PATTERNS['F']]))
    
    # Set the control value for first digit to show "1"
    i2c.writeto(DIGIT_ADDR[0], bytes([SEGMENT_PATTERNS[1]]))
    print("Current display: 1FFF")
    sleep(2)
    
    # Now try to control the second digit
    for digit in range(10):
        print(f"Trying to set second digit to {digit}")
        
        # Reset display
        reset_display()
        
        # Set "F" pattern on all positions
        for addr in DIGIT_ADDR:
            i2c.writeto(addr, bytes([SEGMENT_PATTERNS['F']]))
        
        # Set first digit to "1"
        i2c.writeto(DIGIT_ADDR[0], bytes([SEGMENT_PATTERNS[1]]))
        
        # Try to set second digit
        i2c.writeto(DIGIT_ADDR[1], bytes([SEGMENT_PATTERNS[digit]]))
        
        sleep(1)

def test_all_digits():
    """Test controlling each digit individually"""
    print("Testing control of all digits...")
    
    # Try each digit position
    for pos in range(4):
        for digit in range(10):
            reset_display()
            print(f"Setting position {pos} to digit {digit}")
            
            # Set the digit at the current position
            i2c.writeto(DIGIT_ADDR[pos], bytes([SEGMENT_PATTERNS[digit]]))
            sleep(0.2)

def count_to_100():
    """Count from 0 to 100 using the right three digits (positions 1, 2, 3)"""
    print("Counting from 0 to 100 on the right three digits...")
    
    # Ensure display is reset
    reset_display()
    
    # Loop from 0 to 100
    for num in range(101):
        # Split the number into individual digits
        hundreds = (num // 100) % 10
        tens = (num // 10) % 10
        ones = num % 10
        
        # Display hundreds digit in position 1 (second from left)
        if hundreds > 0:
            i2c.writeto(DIGIT_ADDR[1], bytes([SEGMENT_PATTERNS[hundreds]]))
        else:
            i2c.writeto(DIGIT_ADDR[1], bytes([SEGMENT_PATTERNS[' ']]))  # Blank if zero
        
        # Display tens digit in position 2 (third from left)
        if num >= 10:
            i2c.writeto(DIGIT_ADDR[2], bytes([SEGMENT_PATTERNS[tens]]))
        else:
            i2c.writeto(DIGIT_ADDR[2], bytes([SEGMENT_PATTERNS[' ']]))  # Blank if not used
        
        # Display ones digit in position 3 (rightmost)
        i2c.writeto(DIGIT_ADDR[3], bytes([SEGMENT_PATTERNS[ones]]))
        
        print(f"Counting: {num}")
        sleep(0.1)  # Delay between counts

# Main program
print("TM1650 Three-Digit Counter")
print("1: Test control of second digit")
print("2: Test all digits individually")
print("3: Count from 0 to 100 on right three digits")
choice = input("Enter choice: ")

try:
    if choice == "1":
        test_second_digit()
    elif choice == "2":
        test_all_digits()
    elif choice == "3":
        count_to_100()
    else:
        print("Invalid choice")
except KeyboardInterrupt:
    print("\nTest interrupted by user")
finally:
    # Reset display
    reset_display()
    print("\nTest completed")