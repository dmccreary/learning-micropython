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
SAMPLES_TO_DISPLAY = DISPLAY_WIDTH  # One sample per pixel column

# Buffer to store samples for display
sample_buffer = [DISPLAY_HEIGHT // 2] * SAMPLES_TO_DISPLAY
sample_history = []
max_samples = 100  # For calculating dynamic range

# Initialize values for dynamic scaling
global_min = 65535
global_max = 0

def map_value(value, in_min, in_max, out_min, out_max):
    """Map a value from one range to another"""
    # Handle the case where in_max and in_min are equal or nearly equal
    if in_max <= in_min:
        return (out_min + out_max) // 2
    
    return int((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

def draw_waveform():
    """Draw the waveform on the OLED display"""
    # Clear the display
    oled.fill(0)
    
    # Draw each point in the sample buffer
    for x in range(SAMPLES_TO_DISPLAY):
        # Invert y-coordinate since OLED has 0,0 at top-left
        y = DISPLAY_HEIGHT - sample_buffer[x]
        
        # Draw a single pixel for each point
        oled.pixel(x, y, 1)
    
    # Update the display
    oled.show()

try:
    print("Starting sound visualizer - press Ctrl+C to stop")
    
    # Initial calibration
    print("Calibrating... please wait")
    for i in range(50):  # Collect 50 samples for initial calibration
        value = mic_adc.read_u16()
        sample_history.append(value)
        
        # Update global statistics
        if value < global_min:
            global_min = value
        if value > global_max:
            global_max = value
        
        utime.sleep_ms(10)
    
    print("Calibration complete - visualizing")
    
    while True:
        # Read current microphone value
        current_value = mic_adc.read_u16()
        
        # Update min/max
        if current_value < global_min:
            global_min = current_value
        if current_value > global_max:
            global_max = value
        
        # Add to history and maintain buffer size
        sample_history.append(current_value)
        if len(sample_history) > max_samples:
            sample_history.pop(0)
        
        # Calculate dynamic range
        window_min = min(sample_history)
        window_max = max(sample_history)
        
        # Map the current value to display height and add to buffer
        if window_max > window_min:
            y_pos = map_value(current_value, window_min, window_max, 0, DISPLAY_HEIGHT - 1)
        else:
            y_pos = DISPLAY_HEIGHT // 2
        
        # Add new sample to the buffer and remove oldest
        sample_buffer.append(y_pos)
        sample_buffer.pop(0)
        
        # Update the display
        draw_waveform()
        
        # No delay to maximize speed
        # Optional minimal delay to prevent potential hardware issues
        # utime.sleep_ms(1)
        
except KeyboardInterrupt:
    print("Visualizer stopped")
    print(f"Global min value: {global_min}")
    print(f"Global max value: {global_max}")
    print(f"Global range: {global_max - global_min}")