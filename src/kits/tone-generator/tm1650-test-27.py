# TM1650 Display Test - Displaying digits 0-9 on leftmost digit

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

# Confirmed control values for all digits 0-9
DIGIT_CONTROL_VALUES = {
    0: 0x3F,
    1: 0x30,
    2: 0x5B,
    3: 0x4F,
    4: 0x66,
    5: 0x6D,
    6: 0x7D,
    7: 0x07,
    8: 0x7F,
    9: 0x6F
}

def display_digit(digit):
    """Display a specific digit (0-9) on the leftmost position"""
    if digit not in range(10):
        print(f"Invalid digit: {digit}")
        return
    
    # Reset display
    i2c.writeto(CONTROL_ADDR, b'\x00')
    sleep(0.1)
    
    # Set "0" pattern on all positions
    for addr in DISPLAY_ADDR:
        i2c.writeto(addr, b'\x3F')
    
    # Use F pattern on positions 2-4
    for addr in DISPLAY_ADDR[1:]:
        i2c.writeto(addr, b'\x71')  # "F" pattern
    
    # Activate display with the appropriate control value
    control_value = DIGIT_CONTROL_VALUES[digit]
    i2c.writeto(CONTROL_ADDR, bytes([control_value]))
    
    print(f"Displaying digit {digit} with control value 0x{control_value:02X}")

def display_all_digits():
    """Display all digits 0-9 in sequence"""
    print("Displaying all digits 0-9...")
    
    for digit in range(10):
        display_digit(digit)
        sleep(2)  # Display each digit for 2 seconds

def count_up_and_down():
    """Count up from 0 to 9 and back down to 0"""
    print("Counting up from 0 to 9 and back down...")
    
    # Count up
    for digit in range(10):
        display_digit(digit)
        sleep(1)  # Display each digit for 1 second
    
    # Count down
    for digit in range(9, -1, -1):
        display_digit(digit)
        sleep(1)  # Display each digit for 1 second

# Ask user which test to run
print("TM1650 Display Test - All Digits 0-9")
print("1: Display all digits 0-9 (2 seconds each)")
print("2: Count up from 0 to 9 and back down (1 second each)")
print("Enter any specific digit (0-9) to display just that digit")
choice = input("Enter choice: ")

if choice == "1":
    display_all_digits()
elif choice == "2":
    count_up_and_down()
elif choice.isdigit() and 0 <= int(choice) <= 9:
    digit = int(choice)
    print(f"Displaying digit {digit} continuously...")
    display_digit(digit)
    # Keep displaying until interrupted
    try:
        while True:
            sleep(1)
    except KeyboardInterrupt:
        # Reset display on exit
        i2c.writeto(CONTROL_ADDR, b'\x00')
        print("\nTest stopped")
else:
    print("Invalid choice")

# Reset display on exit
i2c.writeto(CONTROL_ADDR, b'\x00')
print("\nTest completed")