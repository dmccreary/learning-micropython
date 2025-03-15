# Sound Spectrum Analyzer with FFT
# Combines INMP441 I2S microphone with SSD1306 OLED display and performs FFT
from machine import I2S, Pin, SPI
import ssd1306
import math
import struct
import time
import array

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

# FFT size (must be a power of 2)
# 512 is a good balance between resolution and performance for a small MCU
FFT_SIZE = 512

def capture_audio_samples():
    """Capture audio samples for FFT processing"""
    # We need FFT_SIZE samples for the FFT
    # For 32-bit samples, we need 4 bytes per sample
    NUM_SAMPLE_BYTES = FFT_SIZE * 4
    
    # Raw samples will be stored in this buffer (signed 32-bit integers)
    samples_raw = bytearray(NUM_SAMPLE_BYTES)
    
    # Read samples from I2S microphone
    num_bytes_read = audio_in.readinto(samples_raw)
    
    if num_bytes_read == 0:
        return None
    
    # Process raw samples
    format_str = "<{}i".format(num_bytes_read // 4)  # '<' for little-endian, 'i' for 32-bit signed integer
    samples = struct.unpack(format_str, samples_raw[:num_bytes_read])
    
    # Convert to float array and apply windowing function (Hanning window)
    # to reduce spectral leakage
    windowed_samples = array.array('f', [0] * len(samples))
    for i in range(len(samples)):
        # Need to shift right by 8 bits for INMP441 (24-bit samples in 32-bit words)
        adjusted_sample = samples[i] >> 8
        # Apply Hanning window
        hanning = 0.5 * (1 - math.cos(2 * math.pi * i / (len(samples) - 1)))
        windowed_samples[i] = adjusted_sample * hanning
    
    return windowed_samples

def compute_fft(samples):
    """Compute the FFT of the given samples"""
    # Implementation of the Cooley-Tukey FFT algorithm
    # This is a simple recursive implementation of the FFT
    # For a real-world application, you might want to use a more optimized version
    
    def _fft(x):
        N = len(x)
        if N <= 1:
            return x
        
        # Split into even and odd
        even = _fft([x[i] for i in range(0, N, 2)])
        odd = _fft([x[i] for i in range(1, N, 2)])
        
        # Combine
        result = [0] * N
        for k in range(N // 2):
            t = odd[k] * complex(math.cos(-2 * math.pi * k / N), math.sin(-2 * math.pi * k / N))
            result[k] = even[k] + t
            result[k + N // 2] = even[k] - t
        
        return result
    
    # Make sure we have the right number of samples (power of 2)
    if len(samples) != FFT_SIZE:
        return None
    
    # Convert samples to complex numbers
    complex_samples = [complex(samples[i], 0) for i in range(FFT_SIZE)]
    
    # Compute FFT
    fft_result = _fft(complex_samples)
    
    # Compute magnitude (only need the first half due to symmetry for real input)
    magnitudes = [abs(fft_result[i]) for i in range(FFT_SIZE // 2)]
    
    return magnitudes

def compute_fft_optimized(samples):
    """Compute the FFT of the given samples using the optimized FFT function if available"""
    try:
        # First try to use the FFT module if available in the firmware
        import fft
        complex_input = array.array('f', [0] * (2 * len(samples)))
        for i in range(len(samples)):
            complex_input[2*i] = samples[i]  # Real part
            complex_input[2*i+1] = 0         # Imaginary part
        
        # Perform FFT in-place
        fft.fft(complex_input)
        
        # Extract magnitudes (only first half due to symmetry)
        magnitudes = []
        for i in range(FFT_SIZE // 2):
            real = complex_input[2*i]
            imag = complex_input[2*i+1]
            magnitudes.append(math.sqrt(real*real + imag*imag))
        
        return magnitudes
    except ImportError:
        # Fall back to the basic implementation
        return compute_fft(samples)

def draw_spectrum(magnitudes):
    """Draw the frequency spectrum on the OLED display"""
    # Clear the display
    oled.fill(0)
    
    # Number of frequency bins to display
    # We'll use 64 bins to match display width constraints
    num_bins = 64
    
    # Combine frequency bins to fit display (simple averaging)
    display_bins = []
    bin_width = len(magnitudes) // num_bins
    
    for i in range(num_bins):
        start_idx = i * bin_width
        end_idx = min((i + 1) * bin_width, len(magnitudes))
        if start_idx >= len(magnitudes):
            break
        avg_magnitude = sum(magnitudes[start_idx:end_idx]) / (end_idx - start_idx)
        display_bins.append(avg_magnitude)
    
    # Apply logarithmic scaling to better visualize the spectrum
    # Find maximum value for scaling
    max_magnitude = max(max(display_bins), 1)  # Avoid division by zero
    
    # Use full display height
    display_height = 62  # Leave a little margin at the top
    baseline = 63        # Start from the bottom of the screen
    scaling_factor = 0.5  # Adjust scaling to distribute bars across the height
    
    # Draw the spectrum
    display_width = min(128, len(display_bins) * 2)  # Each bin takes 2 pixels width
    
    for i in range(len(display_bins)):
        if i * 2 >= display_width:
            break
        
        # Apply sqrt scaling for more balanced distribution
        normalized = display_bins[i] / max_magnitude
        # Use sqrt scaling for better visual distribution
        height = int(math.sqrt(normalized) * display_height * scaling_factor)
        
        # Draw vertical bar from the baseline upward
        for y in range(baseline, baseline - height, -1):
            if 0 <= y < 64:  # Ensure we're within display bounds
                oled.pixel(i * 2, y, 1)
                oled.pixel(i * 2 + 1, y, 1)  # Make bars 2 pixels wide
    
    # Draw baseline
    oled.hline(0, baseline, 128, 1)
    
    # Update the display
    oled.show()

try:
    print("Sound Spectrum Analyzer with OLED Display")
    print("Press Ctrl+C to stop")
    
    # Main processing loop
    while True:
        # Capture audio samples
        samples = capture_audio_samples()
        
        if samples:
            # Compute FFT
            try:
                magnitudes = compute_fft_optimized(samples)
                
                # Draw the spectrum
                draw_spectrum(magnitudes)
            except Exception as e:
                print("Error processing FFT:", e)
        
        # Small delay to control update rate (can be adjusted)
        # time.sleep(0.05)

except KeyboardInterrupt:
    print("Monitoring stopped")
finally:
    # Clean up
    audio_in.deinit()
    print("Program terminated")