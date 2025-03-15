# Sound Spectrum Analyzer with FFT - For SSD1322 OLED display and INMP441 microphone
# Using configuration from config.py
from machine import I2S, Pin, SPI
import ssd1322
import config
import math
import struct
import time
import array

# Initialize SPI and OLED from config.py
spi = SPI(config.SPI_BUS, 
          baudrate=10_000_000, 
          sck=Pin(config.SPI_SCK_PIN), 
          mosi=Pin(config.SPI_SDA_PIN))

disp = ssd1322.SSD1322_SPI(config.DISPLAY_WIDTH, 
                          config.DISPLAY_HEIGHT, 
                          spi, 
                          dc=Pin(config.SPI_DC_PIN), 
                          cs=Pin(config.SPI_CS_PIN), 
                          res=Pin(config.SPI_RES_PIN))

# Set display orientation - adjust as needed based on your setup
disp.set_orientation(h_flip=False, v_flip=True, nibble_remap=False)

# I2S Microphone configuration from config.py
SCK_PIN = config.I2S_SCK_PIN
WS_PIN = config.I2S_WS_PIN
SD_PIN = config.I2S_SD_PIN

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

# FFT size (must be a power of 2)
FFT_SIZE = 512

# Precompute the Hanning window coefficients
hanning_window = array.array('f', [0] * FFT_SIZE)
for i in range(FFT_SIZE):
    hanning_window[i] = 0.5 * (1 - math.cos(2 * math.pi * i / (FFT_SIZE - 1)))

# Precompute bit-reversal table - MicroPython compatible version
def bit_reverse(n, bits):
    result = 0
    for i in range(bits):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result

bit_reverse_table = array.array('H', [0] * FFT_SIZE)
bits = int(math.log2(FFT_SIZE))
for i in range(FFT_SIZE):
    bit_reverse_table[i] = bit_reverse(i, bits)

# Precompute twiddle factors (complex exponentials)
twiddle_factors_real = array.array('f', [0] * (FFT_SIZE // 2))
twiddle_factors_imag = array.array('f', [0] * (FFT_SIZE // 2))
for i in range(FFT_SIZE // 2):
    angle = -2 * math.pi * i / FFT_SIZE
    twiddle_factors_real[i] = math.cos(angle)
    twiddle_factors_imag[i] = math.sin(angle)

def capture_audio_samples():
    """Capture audio samples for FFT processing"""
    # For 32-bit samples, we need 4 bytes per sample
    NUM_SAMPLE_BYTES = FFT_SIZE * 4
    
    # Raw samples will be stored in this buffer (signed 32-bit integers)
    samples_raw = bytearray(NUM_SAMPLE_BYTES)
    
    # Read samples from I2S microphone
    num_bytes_read = audio_in.readinto(samples_raw)
    
    if num_bytes_read == 0:
        return None
    
    # Process raw samples
    format_str = "<{}i".format(num_bytes_read // 4)
    samples = struct.unpack(format_str, samples_raw[:num_bytes_read])
    
    # Convert to float array and apply windowing function
    # Reuse the same arrays to avoid memory allocation
    real = array.array('f', [0] * len(samples))
    imag = array.array('f', [0] * len(samples))
    
    for i in range(len(samples)):
        # Shift right by 8 bits for INMP441 and apply window
        real[i] = (samples[i] >> 8) * hanning_window[i]
        imag[i] = 0  # Imaginary part is zero for real input
    
    return (real, imag)

def iterative_fft(real, imag):
    """Compute FFT in-place using an iterative algorithm"""
    n = len(real)
    assert n == len(imag)
    assert n == FFT_SIZE, "FFT size must match precomputed tables"
    
    # Bit-reverse reordering
    for i in range(n):
        j = bit_reverse_table[i]
        if i < j:
            real[i], real[j] = real[j], real[i]
            imag[i], imag[j] = imag[j], imag[i]
    
    # Cooley-Tukey iterative FFT
    for stage in range(1, int(math.log2(n)) + 1):
        m = 2 ** stage  # Distance between butterflies
        m2 = m // 2     # Distance between butterfly pairs
        
        # Process each group of butterflies
        for k in range(0, n, m):
            # Process each butterfly pair
            for j in range(m2):
                # Get twiddle factor
                twiddle_idx = j * (n // m)
                wr = twiddle_factors_real[twiddle_idx]
                wi = twiddle_factors_imag[twiddle_idx]
                
                # Get indices for butterfly operation
                idx1 = k + j
                idx2 = idx1 + m2
                
                # Calculate butterfly
                tr = real[idx2] * wr - imag[idx2] * wi
                ti = real[idx2] * wi + imag[idx2] * wr
                
                # Store results
                real[idx2] = real[idx1] - tr
                imag[idx2] = imag[idx1] - ti
                real[idx1] = real[idx1] + tr
                imag[idx1] = imag[idx1] + ti
    
    return (real, imag)

def calculate_magnitudes(real, imag):
    """Calculate magnitude spectrum from complex FFT result"""
    # Only need the first half due to symmetry for real input
    mags = array.array('f', [0] * (FFT_SIZE // 2))
    
    # Use a fast approximation for magnitude calculation
    # |z| ≈ max(|Re(z)|, |Im(z)|) + 0.4 * min(|Re(z)|, |Im(z)|)
    for i in range(FFT_SIZE // 2):
        re_abs = abs(real[i])
        im_abs = abs(imag[i])
        if re_abs > im_abs:
            mags[i] = re_abs + 0.4 * im_abs
        else:
            mags[i] = im_abs + 0.4 * re_abs
    
    return mags

def draw_spectrum(magnitudes):
    """Draw the frequency spectrum on the SSD1322 OLED display"""
    # Clear the display
    disp.fill(0)
    
    # Number of frequency bins to display - use close to full display width
    num_bins = config.DISPLAY_WIDTH // 4  # Each bar uses 4 pixels (2 for bar, 2 for spacing)
    
    # Combine frequency bins to fit display
    display_bins = array.array('f', [0] * num_bins)
    bin_width = len(magnitudes) // num_bins
    
    # Simple averaging of bins
    for i in range(num_bins):
        start_idx = i * bin_width
        end_idx = min((i + 1) * bin_width, len(magnitudes))
        if start_idx >= len(magnitudes):
            break
            
        # Fast averaging
        bin_sum = 0
        for j in range(start_idx, end_idx):
            bin_sum += magnitudes[j]
        display_bins[i] = bin_sum / (end_idx - start_idx)
    
    # Find maximum value for scaling (avoid division by zero)
    max_magnitude = 1
    for mag in display_bins:
        if mag > max_magnitude:
            max_magnitude = mag
    
    # Use full display height with small margin
    display_height = config.DISPLAY_HEIGHT - 2
    baseline = config.DISPLAY_HEIGHT - 1
    
    # Draw frequency scale at the top
    # disp.text("FREQUENCY", 80, 2, 8)  # Dimmer text
    
    # Draw the spectrum
    for i in range(len(display_bins)):
        # Apply log scaling for more balanced distribution
        normalized = display_bins[i] / max_magnitude
        height = int(math.sqrt(normalized) * display_height * 0.9)  # Scale to 90% of display height
        
        # Draw vertical bar - SSD1322 supports 16 gray levels (0-15)
        x = i * 4  # Each bar is 2 pixels wide with 2 pixels spacing
        
        # Create gradient for bars using different gray levels
        for y in range(baseline, baseline - height, -1):
            if y >= 0:
                # Calculate gradient from bottom to top (15->8)
                level = max(8, int(15 - (7 * (baseline - y) / height)))
                disp.line(x, y, x + 1, y, level)  # Use line to draw 2px wide with same gray level
    
    # Draw baseline
    disp.line(0, baseline, config.DISPLAY_WIDTH - 1, baseline, 15)
    
    # Draw decorative elements
    # disp.text("SPECTRUM ANALYZER", 60, config.DISPLAY_HEIGHT - 10, 15)
    
    # Update the display
    disp.show()

try:
    print("Sound Spectrum Analyzer for SSD1322")
    print("Press Ctrl+C to stop")
    
    # Display startup message
    disp.fill(0)
    # disp.text("Sound Spectrum Analyzer", 30, 10, 15)
    #disp.text("Starting...", 80, 30, 10)
    disp.show()
    time.sleep(1)
    
    # Main processing loop
    while True:
        # Capture audio samples
        samples = capture_audio_samples()
        
        if samples:
            # Get real and imaginary arrays
            fft_real, fft_imag = samples
            
            # Compute FFT in-place
            iterative_fft(fft_real, fft_imag)
            
            # Calculate magnitude spectrum
            magnitudes = calculate_magnitudes(fft_real, fft_imag)
            
            # Draw the spectrum
            draw_spectrum(magnitudes)

except KeyboardInterrupt:
    print("Monitoring stopped")
finally:
    # Clean up
    audio_in.deinit()
    # Clear display on exit
    # disp.fill(0)
    #disp.text("Program terminated", 50, 30, 15)
    #disp.show()
    print("Program terminated")