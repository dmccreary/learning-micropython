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
NUM_BARS = 32  # Number of history bars to show
BAR_WIDTH = DISPLAY_WIDTH // NUM_BARS
BAR_GAP = 1  # Gap between bars
HISTORY_SIZE = 64  # How many recent amplitude values to keep

# Buffer to store sound intensity history
intensity_history = [0] * HISTORY_SIZE
smoothed_level = 0
level_index = 0

# Parameters for dynamic scaling
BASELINE = 0            # Will be set during calibration
NOISE_FLOOR = 100       # Minimal noise level to ignore
MAX_AMPLITUDE = 5000    # Initial value, will adjust dynamically
ATTACK_FACTOR = 0.7     # How quickly to respond to louder sounds (0-1, higher = faster)
DECAY_FACTOR = 0.05     # How quickly to respond to quieter sounds (0-1, higher = faster)

def draw_sound_intensity():
    """Draw the sound intensity visualization on the OLED display"""
    # Clear the display
    oled.fill(0)
    
    # Draw bars representing recent sound intensity
    for i in range(NUM_BARS):
        # Get history index (circular buffer)
        idx = (level_index - NUM_BARS + i) % HISTORY_SIZE
        
        # Calculate bar height (0 to DISPLAY_HEIGHT)
        bar_height = intensity_history[idx]
        
        # Calculate x position for this bar
        x = i * (BAR_WIDTH + BAR_GAP)
        
        # Draw the bar (bottom to top)
        if bar_height > 0:
            oled.fill_rect(x, DISPLAY_HEIGHT - bar_height, BAR_WIDTH, bar_height, 1)
    
    # Update the display
    oled.show()

try:
    print("Starting sound intensity monitor - press Ctrl+C to stop")
    
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
        MAX_AMPLITUDE = initial_range * 2  # Give some headroom
    
    print(f"Baseline value: {BASELINE}")
    print(f"Initial amplitude range: {initial_range}")
    print("Calibration complete - visualizing")
    
    # Initialize variables for the main loop
    current_max_amplitude = MAX_AMPLITUDE
    
    while True:
        # Take multiple readings and find the peak-to-peak amplitude
        samples = []
        for _ in range(10):  # Sample more often for better peak detection
            samples.append(mic_adc.read_u16())
        
        min_sample = min(samples)
        max_sample = max(samples)
        peak_to_peak = max_sample - min_sample
        
        # Ignore values below noise floor
        if peak_to_peak < NOISE_FLOOR:
            peak_to_peak = 0
            
        # Dynamic scaling - adapt to sound environment
        if peak_to_peak > current_max_amplitude:
            # Quick attack for louder sounds
            current_max_amplitude = current_max_amplitude * (1 - ATTACK_FACTOR) + peak_to_peak * ATTACK_FACTOR
        else:
            # Slow decay for quieter environments
            current_max_amplitude = current_max_amplitude * (1 - DECAY_FACTOR) + peak_to_peak * DECAY_FACTOR
        
        # Ensure amplitude range is reasonable
        if current_max_amplitude < NOISE_FLOOR * 2:
            current_max_amplitude = NOISE_FLOOR * 2
            
        # Calculate the display intensity (0 to DISPLAY_HEIGHT)
        if current_max_amplitude > 0:
            display_intensity = int(peak_to_peak * DISPLAY_HEIGHT / current_max_amplitude)
            display_intensity = min(display_intensity, DISPLAY_HEIGHT)  # Cap at display height
        else:
            display_intensity = 0
            
        # Smooth the level changes for more pleasing visual effect
        smoothed_level = smoothed_level * 0.7 + display_intensity * 0.3
        
        # Store in history buffer
        intensity_history[level_index] = int(smoothed_level)
        level_index = (level_index + 1) % HISTORY_SIZE
        
        # Update the display
        draw_sound_intensity()
        
except KeyboardInterrupt:
    print("Visualizer stopped")
    print(f"Final baseline: {BASELINE}")
    print(f"Final max amplitude: {current_max_amplitude}")
    print(f"Final noise floor: {NOISE_FLOOR}")