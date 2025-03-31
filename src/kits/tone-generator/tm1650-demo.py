# TM1650 Enhanced Demo
# Features multiple display modes while using direct digit addressing

from machine import Pin, I2C
import config
from utime import sleep, ticks_ms, ticks_diff

# Configure I2C
sda = Pin(config.I2C_SDA_PIN)
scl = Pin(config.I2C_SCL_PIN)
i2c = I2C(config.I2C_BUS, sda=sda, scl=scl, freq=50000)  # 50 kHz

# Display addresses - one for each digit
DIGIT_ADDR = [0x34, 0x35, 0x36, 0x37]  # Left to right

# Segment patterns for digits and some letters/symbols
SEGMENT_PATTERNS = {
    0: 0x3F,   # 0
    1: 0x06,   # 1
    2: 0x5B,   # 2
    3: 0x4F,   # 3
    4: 0x66,   # 4
    5: 0x6D,   # 5
    6: 0x7D,   # 6
    7: 0x07,   # 7
    8: 0x7F,   # 8
    9: 0x6F,   # 9
    'A': 0x77,  # A
    'b': 0x7C,  # b
    'C': 0x39,  # C
    'd': 0x5E,  # d
    'E': 0x79,  # E
    'F': 0x71,  # F
    'H': 0x76,  # H
    'L': 0x38,  # L
    'P': 0x73,  # P
    'U': 0x3E,  # U
    '-': 0x40,  # -
    '_': 0x08,  # _
    ' ': 0x00,  # space (blank)
}

# Decimal point bit
DP_BIT = 0x80  # Bit 7 controls the decimal point

def reset_display():
    """Reset the display by clearing all digits"""
    for addr in DIGIT_ADDR:
        i2c.writeto(addr, b'\x00')
    sleep(0.05)

def set_digit(position, value, decimal_point=False):
    """Set a specific digit (position 0-3) with optional decimal point"""
    if 0 <= position <= 3:
        # Get pattern for the value
        if isinstance(value, int) and 0 <= value <= 9:
            pattern = SEGMENT_PATTERNS[value]
        elif value in SEGMENT_PATTERNS:
            pattern = SEGMENT_PATTERNS[value]
        else:
            pattern = SEGMENT_PATTERNS[' ']  # Default to blank for unsupported characters
        
        # Add decimal point if requested
        if decimal_point:
            pattern |= DP_BIT
        
        # Write pattern to the appropriate digit address
        i2c.writeto(DIGIT_ADDR[position], bytes([pattern]))

def display_number(number, leading_zeros=False, dp_position=-1):
    """Display a number with optional leading zeros and decimal point
    
    Args:
        number: Integer number to display (0-9999)
        leading_zeros: Whether to show leading zeros
        dp_position: Position for decimal point (0-3), or -1 for none
    """
    # Ensure number is in valid range
    number = max(0, min(9999, number))
    
    # Split number into digits
    thousands = (number // 1000) % 10
    hundreds = (number // 100) % 10
    tens = (number // 10) % 10
    ones = number % 10
    
    # Display each digit
    if thousands > 0 or leading_zeros:
        set_digit(0, thousands, dp_position == 0)
    else:
        set_digit(0, ' ', dp_position == 0)  # Blank if not used and no leading zeros
    
    if hundreds > 0 or tens > 0 or ones > 0 or leading_zeros or thousands > 0:
        set_digit(1, hundreds, dp_position == 1)
    else:
        set_digit(1, ' ', dp_position == 1)  # Blank if not used
    
    if tens > 0 or ones > 0 or leading_zeros or hundreds > 0 or thousands > 0:
        set_digit(2, tens, dp_position == 2)
    else:
        set_digit(2, ' ', dp_position == 2)  # Blank if not used
    
    # Always display ones digit (or 0)
    set_digit(3, ones, dp_position == 3)

def display_text(text, align='right'):
    """Display text (up to 4 characters) with alignment option
    
    Args:
        text: String to display (up to 4 chars)
        align: Alignment ('left', 'right', or 'center')
    """
    # Process the text and handle decimal points
    display_chars = []
    decimal_points = [False, False, False, False]
    
    for char in text:
        if char == '.':
            if display_chars:
                # Add decimal point to the last character
                decimal_points[len(decimal_points) - 1] = True
        else:
            display_chars.append(char)
    
    # Truncate if longer than 4 chars
    if len(display_chars) > 4:
        display_chars = display_chars[:4]
    
    # Create a padded array based on the alignment
    padded_chars = [' '] * 4
    
    if align == 'left':
        for i in range(min(len(display_chars), 4)):
            padded_chars[i] = display_chars[i]
    elif align == 'right':
        offset = max(0, 4 - len(display_chars))
        for i in range(min(len(display_chars), 4)):
            padded_chars[offset + i] = display_chars[i]
    elif align == 'center':
        offset = max(0, (4 - len(display_chars)) // 2)
        for i in range(min(len(display_chars), 4)):
            padded_chars[offset + i] = display_chars[i]
    
    # Update display
    for i in range(4):
        # Try to get the pattern, if character isn't in the patterns, use space
        char = padded_chars[i]
        decimal_point = decimal_points[i] if i < len(decimal_points) else False
        set_digit(i, char, decimal_point)

def count_up(start, end, step=1, delay=0.1, leading_zeros=False):
    """Count up from start to end with optional step size
    
    Args:
        start: Starting number
        end: Ending number (inclusive)
        step: Increment amount
        delay: Seconds between counts
        leading_zeros: Whether to display leading zeros
    """
    print(f"Counting up from {start} to {end} by {step}")
    for num in range(start, end + 1, step):
        display_number(num, leading_zeros)
        print(f"Count: {num}")
        sleep(delay)

def count_down(start, end, step=1, delay=0.1, leading_zeros=False):
    """Count down from start to end with optional step size
    
    Args:
        start: Starting number
        end: Ending number (inclusive)
        step: Decrement amount
        delay: Seconds between counts
        leading_zeros: Whether to display leading zeros
    """
    print(f"Counting down from {start} to {end} by {step}")
    for num in range(start, end - 1, -step):
        display_number(num, leading_zeros)
        print(f"Count: {num}")
        sleep(delay)

def blink_display(count=3, on_time=0.3, off_time=0.2):
    """Blink the current display contents
    
    Args:
        count: Number of blinks
        on_time: Seconds to stay on
        off_time: Seconds to stay off
    """
    # Save current display state
    current_state = []
    for addr in DIGIT_ADDR:
        try:
            # Read current value (this might not work on all TM1650 implementations)
            i2c.writeto(addr, b'')
            current = i2c.readfrom(addr, 1)[0]
            current_state.append(current)
        except:
            # If reading fails, just use a blank
            current_state.append(0)
    
    # Blink the display
    for _ in range(count):
        # Turn off
        reset_display()
        sleep(off_time)
        
        # Turn back on
        for i, value in enumerate(current_state):
            i2c.writeto(DIGIT_ADDR[i], bytes([value]))
        sleep(on_time)

def scroll_text(text, delay=0.2):
    """Scroll text across the display from right to left
    
    Args:
        text: Text to scroll
        delay: Seconds between movements
    """
    # Add padding to ensure smooth scrolling
    padded_text = "    " + text + "    "
    
    # Scroll the text
    for i in range(len(padded_text) - 3):
        display_text(padded_text[i:i+4], align='left')
        sleep(delay)

def flash_digits(count=5, delay=0.1):
    """Flash individual digits in sequence
    
    Args:
        count: Number of complete sequences
        delay: Seconds between flashes
    """
    # Clear display
    reset_display()
    
    # Flash each digit in sequence
    for _ in range(count):
        for position in range(4):
            # Flash all segments on each digit
            set_digit(position, 8)  # 8 lights all segments
            sleep(delay)
            set_digit(position, ' ')  # Turn off
            sleep(delay/2)

def display_animation(frames, repeats=3, delay=0.2):
    """Display a sequence of animation frames
    
    Args:
        frames: List of string frames to display
        repeats: Number of times to repeat the animation
        delay: Seconds between frames
    """
    for _ in range(repeats):
        for frame in frames:
            display_text(frame)
            sleep(delay)

def temperature_demo(start_temp=20, end_temp=30, step=1, delay=0.5):
    """Simulate a temperature display with decimal point
    
    Args:
        start_temp: Starting temperature
        end_temp: Ending temperature
        step: Increment amount
        delay: Seconds between updates
    """
    print("Temperature Display Demo")
    temp = start_temp
    direction = 1  # 1 for increasing, -1 for decreasing
    
    # Run for a fixed number of steps
    for _ in range(20):
        # Display temperature with 1 decimal place
        # Format: XX.X
        display_text(f"{temp:.1f}")
        print(f"Temperature: {temp:.1f}°C")
        sleep(delay)
        
        # Update temperature
        temp += step * direction
        
        # Reverse direction if we hit the limits
        if temp >= end_temp:
            direction = -1
        elif temp <= start_temp:
            direction = 1

def clock_demo(seconds=30, hour_format=24):
    """Display a clock for the specified number of seconds
    
    Args:
        seconds: How long to run the clock demo
        hour_format: 12 or 24 hour format
    """
    print(f"Clock Demo ({seconds} seconds)")
    
    # Use start time as offset
    start_time = ticks_ms()
    end_time = start_time + (seconds * 1000)
    
    # Simulate ticking clock
    while ticks_ms() < end_time:
        # Calculate elapsed time in seconds
        elapsed = ticks_diff(ticks_ms(), start_time) // 1000
        
        # Calculate hours and minutes
        minutes = (elapsed // 60) % 60
        hours = (elapsed // 3600) % 24
        
        # Adjust for 12-hour format if needed
        if hour_format == 12:
            if hours == 0:
                hours = 12
            elif hours > 12:
                hours = hours - 12
        
        # Format time as HHMM
        time_str = f"{hours:02d}{minutes:02d}"
        
        # Display time with blinking colon (decimal point on digit 1)
        blink_colon = (elapsed % 2) == 0  # Blink every second
        
        # Display each digit
        set_digit(0, int(time_str[0]))
        set_digit(1, int(time_str[1]), blink_colon)  # Use decimal point as colon
        set_digit(2, int(time_str[2]))
        set_digit(3, int(time_str[3]))
        
        sleep(0.1)  # Update display frequently for smooth blinking

def run_demo_sequence():
    """Run a sequence of demos to showcase different features"""
    print("Running demo sequence...")
    
    # Clear display
    reset_display()
    sleep(0.5)
    
    # 1. Show text
    display_text("DEMO")
    sleep(1)
    
    # 2. Cycle through all digits (0-9)
    for digit in range(10):
        for position in range(4):
            set_digit(position, digit)
        sleep(0.3)
    
    # 3. Flash individual digits
    flash_digits(2, 0.1)
    
    # 4. Count up from 0 to 50 by 5
    count_up(0, 50, 5, 0.1)
    
    # 5. Count down from 50 to 0 by 5
    count_down(50, 0, 5, 0.1)
    
    # 6. Scroll a message
    scroll_text("HELLO WORLD", 0.15)
    
    # 7. Animate some patterns
    animations = [
        "----", 
        "_---", 
        "__--", 
        "___-", 
        "____", 
        "-___", 
        "--__", 
        "---_", 
        "----"
    ]
    display_animation(animations, 3, 0.1)
    
    # 8. Temperature demo
    temperature_demo(20, 30, 0.5, 0.2)
    
    # 9. Clock demo (run for 10 seconds)
    clock_demo(10)
    
    # 10. Blink farewell message
    display_text("End")
    blink_display(3)
    
    # Clear display at end
    reset_display()

# Main program menu
def main():
    """Main program with menu interface"""
    print("\nTM1650 Enhanced Demo")
    print("=====================")
    print("1: Count up (0 to 100)")
    print("2: Count down (100 to 0)")
    print("3: Display text")
    print("4: Scroll message")
    print("5: Clock demo")
    print("6: Temperature display")
    print("7: Animation demo")
    print("8: Flash digits")
    print("9: Run full demo sequence")
    print("0: Exit demo")
    
    try:
        while True:
            choice = input("\nEnter choice (0-9): ")
            
            # Clear display before each demo
            reset_display()
            
            if choice == "1":
                count_up(0, 100, 1, 0.05)
            elif choice == "2":
                count_down(100, 0, 1, 0.05)
            elif choice == "3":
                text = input("Enter text (up to 4 chars): ")
                display_text(text)
                input("Press Enter to continue...")
            elif choice == "4":
                text = input("Enter message to scroll: ")
                scroll_text(text, 0.15)
            elif choice == "5":
                seconds = int(input("How many seconds to run clock (10-60): ") or "20")
                clock_demo(max(10, min(60, seconds)))
            elif choice == "6":
                temperature_demo()
            elif choice == "7":
                print("Running animation demo...")
                animations = ["----", "====", "----", "===="]
                display_animation(animations, 5, 0.2)
            elif choice == "8":
                flash_digits(3, 0.1)
            elif choice == "9":
                run_demo_sequence()
            elif choice == "0":
                print("Exiting demo...")
                reset_display()
                return
            else:
                print("Invalid choice. Please try again.")
    
    except KeyboardInterrupt:
        print("\nDemo interrupted by user")
    finally:
        # Clean up before exit
        reset_display()
        print("Demo completed")

if __name__ == "__main__":
    main()