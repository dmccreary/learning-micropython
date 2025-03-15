# Sound Level Display with Scrolling Graph
# Combines INMP441 I2S microphone with SSD1306 OLED display
from machine import I2S, Pin, SPI
import ssd1306
import math
import struct
import time

# OLED Display configuration
SCL = Pin(2)  # SPI Clock
SDA = Pin(3)  # SPI Data
RES = Pin(4)  # Reset
DC = Pin(5)   # Data/Command
CS = Pin(6)   # Chip Select

# Initialize SPI and OLED
spi = SPI(0, sck=SCL, mosi=SDA)
oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

# I2S Microphone configuration
SCK_PIN = 10  # Serial Clock
WS_PIN = 11   # Word Select
SD_PIN = 12   # Serial Data

# I2S configuration parameters
I2S_ID = 0
SAMPLE_SIZE_IN_BITS = 32
FORMAT = I2S.MONO
SAMPLE_RATE = 16000
BUFFER_LENGTH_IN_BYTES = 40000

# Initialize I2S for microphone
audio_in = I2S(
    I2S_ID,
    sck=Pin(SCK_PIN),
    ws=Pin(WS_PIN),
    sd=Pin(SD_PIN),
    mode=I2S.RX,
    bits=SAMPLE_SIZE_IN_BITS,
    format=FORMAT,
    rate=SAMPLE_RATE,
    ibuf=BUFFER_LENGTH_IN_BYTES,
)

def sound_level():
    """Capture audio and calculate sound level"""
    # Number of samples to read each time
    NUM_SAMPLE_BYTES = 2048
    
    # Raw samples will be stored in this buffer (signed 32-bit integers)
    samples_raw = bytearray(NUM_SAMPLE_BYTES)
    
    # Read samples from I2S microphone
    num_bytes_read = audio_in.readinto(samples_raw)
    
    if num_bytes_read == 0:
        return 0
    
    # Process raw samples
    format_str = "<{}i".format(num_bytes_read // 4)  # '<' for little-endian, 'i' for 32-bit signed integer
    samples = struct.unpack(format_str, samples_raw[:num_bytes_read])
    
    # Calculate RMS (Root Mean Square) which represents sound level
    sum_squares = 0
    for sample in samples:
        # Need to shift right by 8 bits for INMP441 (24-bit samples in 32-bit words)
        adjusted_sample = sample >> 8
        sum_squares += adjusted_sample * adjusted_sample
    
    # Calculate RMS
    rms = math.sqrt(sum_squares / len(samples))
    
    # Scale to 0-100 range
    # The maximum value for a 24-bit sample is 2^23 = 8388608
    MAX_VALUE = 8388608
    level = min(100, (rms / MAX_VALUE) * 1000)  # Multiply by 1000 for better scaling
    
    return level

def draw_graph(values):
    """Draw the scrolling graph on the OLED display"""
    # Clear the display
    oled.fill(0)
    
    # Find the max value in the buffer for dynamic scaling
    max_value = max(max(values), 1)  # Avoid division by zero
    
    # Draw the graph - use full display height with dynamic scaling
    graph_height = 64
    graph_width = min(128, len(values))
    
    for i in range(graph_width):
        # Calculate Y position (inverted since display origin is top-left)
        value = values[len(values) - graph_width + i]
        y_pos = 63 - int((value / max_value) * (graph_height - 1))
        
        # Ensure y position is within bounds
        y_pos = max(0, min(63, y_pos))
        
        # Draw the point
        oled.pixel(i, y_pos, 1)
    
    # Update the display
    oled.show()

try:
    print("Sound Level Monitor with OLED Display")
    print("Press Ctrl+C to stop")
    
    # Buffer to store sound levels for scrolling display
    # 128 values to match the width of the display
    buffer_size = 128
    sound_buffer = [0] * buffer_size
    
    # Moving average window for smoothing the sound level
    window_size = 3
    smoothing_buffer = [0] * window_size
    
    while True:
        # Get current sound level
        level = sound_level()
        
        # Apply simple moving average for smoothing
        smoothing_buffer.pop(0)
        smoothing_buffer.append(level)
        smoothed_level = sum(smoothing_buffer) / window_size
        
        # Shift the graph buffer and add new value
        sound_buffer.pop(0)
        sound_buffer.append(smoothed_level)
        
        # Update the display
        draw_graph(sound_buffer)
        
        # Small delay to control update rate
        # time.sleep(0.05)

except KeyboardInterrupt:
    print("Monitoring stopped")
finally:
    # Clean up
    audio_in.deinit()
    #oled.fill(0)
    #oled.show()
    print("Program terminated")