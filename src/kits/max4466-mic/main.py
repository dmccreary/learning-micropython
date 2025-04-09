from machine import Pin, SPI, ADC
import ssd1306
import utime
import config

# Configure display
SCL = Pin(config.SPI_SCL_PIN)     # SPI Clock
SDA = Pin(config.SPI_SDA_PIN)     # SPI Data (MOSI)
RESET = Pin(config.SPI_RESET_PIN) # Reset
DC = Pin(config.SPI_DC_PIN)       # Data/Command
CS = Pin(config.SPI_CS_PIN)       # Chip Select

# Initialize SPI and OLED
spi = SPI(config.SPI_BUS, sck=SCL, mosi=SDA)
oled = ssd1306.SSD1306_SPI(config.DISPLAY_WIDTH, config.DISPLAY_HEIGHT, spi, DC, RESET, CS)

# Configure the ADC pin for the MAX4466 microphone
mic_adc = ADC(config.MAX4466_PIN)

# Constants for display
DISPLAY_WIDTH = config.DISPLAY_WIDTH
DISPLAY_HEIGHT = config.DISPLAY_HEIGHT
MIDDLE_Y = DISPLAY_HEIGHT // 2

# Buffer to store samples for display - one for each pixel column
waveform_buffer = [MIDDLE_Y] * DISPLAY_WIDTH

# Parameters for scaling
BASELINE = 0            # Will be set during calibration
NOISE_FLOOR = 500        # Minimal noise level to ignore
MAX_AMPLITUDE = 2000    # Initial value, will adjust dynamically
ATTACK_FACTOR = 0.5     # How quickly to respond to louder sounds (0-1, higher = faster)
DECAY_FACTOR = 0.01     # How quickly to respond to quieter sounds (0-1, higher = faster)

def draw_waveform():
    """Draw the sound waveform visualization on the OLED display"""
    # Clear the display
    oled.fill(0)
    
    # Draw centerline
    oled.hline(0, MIDDLE_Y, DISPLAY_WIDTH, 1)
    
    # Draw each point in the waveform buffer
    # Connect each point to the next point with a line
    for i in range(DISPLAY_WIDTH - 1):
        # Get the current and next point
        y1 = waveform_buffer[i]
        y2 = waveform_buffer[i + 1]
        
        # Draw a line between the points
        oled.line(i, y1, i + 1, y2, 1)
    
    # Update the display
    oled.show()

try:
    print("Starting sound visualizer - press Ctrl+C to stop")
    
    # Initial calibration to find the baseline (average microphone reading when quiet)
    print("Calibrating... please wait")
    sum_values = 0
    sample_count = 100
    max_value = 0
    min_value = 65535
    
    for i in range(sample_count):
        value = mic_adc.read_u16()
        sum_values += value
        if value > max_value:
            max_value = value
        if value < min_value:
            min_value = value
        utime.sleep_ms(10)
    
    # Set baseline as the average reading
    BASELINE = sum_values // sample_count
    # Initial amplitude estimate based on calibration
    initial_range = max_value - min_value
    if initial_range > NOISE_FLOOR:
        MAX_AMPLITUDE = initial_range * 3  # Give some headroom
    
    print(f"Baseline value: {BASELINE}")
    print(f"Initial amplitude range: {initial_range}")
    print("Calibration complete - visualizing")
    
    # Initialize variables for the main loop
    current_max_amplitude = MAX_AMPLITUDE
    
    while True:
        # Take a new sample
        current_value = mic_adc.read_u16()
        
        # Calculate the difference from baseline
        value_diff = current_value - BASELINE
        
        # Track the maximum amplitude we're seeing to adjust scaling
        abs_diff = abs(value_diff)
        if abs_diff > NOISE_FLOOR:
            if abs_diff > current_max_amplitude:
                # If we see a larger amplitude, quickly increase our scale
                current_max_amplitude = current_max_amplitude * (1 - ATTACK_FACTOR) + abs_diff * ATTACK_FACTOR
            else:
                # Otherwise, slowly decrease the scale to adapt to quieter environments
                current_max_amplitude = current_max_amplitude * (1 - DECAY_FACTOR) + abs_diff * DECAY_FACTOR
        
        # Ensure we don't divide by zero
        if current_max_amplitude < NOISE_FLOOR:
            current_max_amplitude = NOISE_FLOOR
            
        # Calculate a running average of the baseline to keep it centered
        # This helps compensate for baseline drift in the microphone
        BASELINE = BASELINE * 0.999 + current_value * 0.001
            
        # Scale the value to display height, centered on the middle
        # For very small values (below noise floor), keep close to center
        if abs_diff < NOISE_FLOOR:
            display_value = 0
        else:
            # Scale to use 80% of display height (leave margins)
            max_height = DISPLAY_HEIGHT * 0.4  # 40% up, 40% down from center
            display_value = int(value_diff * max_height / current_max_amplitude)
        
        y_pos = MIDDLE_Y - display_value  # Subtract because OLED is top-down
        
        # Keep within bounds
        y_pos = max(0, min(DISPLAY_HEIGHT - 1, y_pos))
        
        # Shift the buffer to make room for the new sample (older samples move right)
        # This makes new samples appear on the left, like an oscilloscope
        waveform_buffer.pop()  # Remove the last (rightmost) sample
        waveform_buffer.insert(0, y_pos)  # Add new sample at the beginning (left)
        
        # Update the display
        draw_waveform()
        
except KeyboardInterrupt:
    print("Visualizer stopped")
    print(f"Final baseline: {BASELINE}")
    print(f"Final max amplitude: {current_max_amplitude}")
    print(f"Final noise floor: {NOISE_FLOOR}")