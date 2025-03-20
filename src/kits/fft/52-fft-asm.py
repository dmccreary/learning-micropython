# Sound Spectrum Analyzer with Optimized FFT
# Combines INMP441 I2S microphone with SSD1306 OLED display
from machine import I2S, Pin, SPI
import ssd1306
import math
import struct
import time
import array

# Try to import the DFT module with adjusted expectations
print("Importing FFT modules...")
try:
    # Try to import the base modules
    import dft
    import dftclass
    import polar
    import window
    
    # Define constants if they don't exist
    FORWARD = 1  # Forward transform
    REVERSE = 0  # Inverse transform
    POLAR = 3    # Polar conversion
    DB = 7       # dB conversion
    
    print("FFT modules imported successfully")
    print("Available functions:", dir(dftclass))
    
    # Check if DFT class exists
    has_dft_class = hasattr(dftclass, 'DFT')
    print(f"DFT class available: {has_dft_class}")
    
    if has_dft_class:
        DFT = dftclass.DFT
    
except ImportError as e:
    print(f"Could not import FFT modules: {e}")
    # We'll implement a fallback FFT later if needed

# OLED Display configuration
SCL = Pin(2)  # SPI Clock
SDA = Pin(3)  # SPI Data
RES = Pin(4)  # Reset
DC = Pin(5)   # Data/Command
CS = Pin(6)   # Chip Select

# Initialize SPI and OLED
print("Initializing OLED display...")
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
SAMPLE_RATE = 8000
BUFFER_LENGTH_IN_BYTES = 40000

# Initialize I2S for microphone
print("Initializing I2S microphone...")
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
FFT_SIZE = 256

# Create a Hanning window function (for later use)
def hanning(x, length):
    return 0.5 - 0.5 * math.cos(2 * math.pi * x / (length - 1))

# Try to initialize the DFT object
fft_processor = None
using_dft_class = False
try:
    if 'DFT' in locals():
        print("Creating DFT instance...")
        # Check the constructor parameters
        import inspect
        if hasattr(inspect, 'signature'):
            sig = inspect.signature(DFT.__init__)
            print(f"DFT constructor parameters: {sig.parameters}")
        
        # Try different parameter combinations based on inspection
        try:
            # Try with the standard parameters we expected
            fft_processor = DFT(FFT_SIZE, None, hanning)
            using_dft_class = True
            print("DFT instance created successfully with our expected parameters")
        except TypeError:
            try:
                # Try with just the length parameter
                fft_processor = DFT(FFT_SIZE)
                using_dft_class = True
                print("DFT instance created with just length parameter")
            except Exception as e:
                print(f"Could not create DFT instance: {e}")
except Exception as e:
    print(f"Error while trying to create DFT instance: {e}")

# Arrays for FFT input/output if we need to use a fallback
fft_re = array.array('f', [0] * FFT_SIZE)
fft_im = array.array('f', [0] * FFT_SIZE)

# Define a simple fallback FFT implementation using the Cooley-Tukey algorithm
def simple_fft(real, imag, inverse=False):
    """Simple FFT implementation as fallback"""
    n = len(real)
    if n <= 1:
        return
    
    # Bit-reverse permutation
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        
        if i < j:
            real[i], real[j] = real[j], real[i]
            imag[i], imag[j] = imag[j], imag[i]
    
    # Cooley-Tukey FFT
    step = 2
    while step <= n:
        half_step = step // 2
        angle_step = (-2 if inverse else 2) * math.pi / step
        
        for m in range(0, n, step):
            for k in range(half_step):
                angle = k * angle_step
                cos_val = math.cos(angle)
                sin_val = math.sin(angle)
                
                a_re = real[m + k]
                a_im = imag[m + k]
                b_re = real[m + k + half_step]
                b_im = imag[m + k + half_step]
                
                t_re = b_re * cos_val - b_im * sin_val
                t_im = b_re * sin_val + b_im * cos_val
                
                real[m + k] = a_re + t_re
                imag[m + k] = a_im + t_im
                real[m + k + half_step] = a_re - t_re
                imag[m + k + half_step] = a_im - t_im
        
        step *= 2
    
    # Scale if inverse
    if inverse:
        for i in range(n):
            real[i] /= n
            imag[i] /= n

# Convert to polar coordinates
def to_polar(real, imag):
    """Convert complex values to polar (magnitude, phase)"""
    n = len(real)
    for i in range(n):
        magnitude = math.sqrt(real[i]*real[i] + imag[i]*imag[i])
        phase = math.atan2(imag[i], real[i])
        real[i] = magnitude
        imag[i] = phase

# Raw audio buffer for incoming samples
raw_samples = bytearray(FFT_SIZE * 4)  # 32-bit samples = 4 bytes each

def capture_audio_samples():
    """Capture audio samples and populate the FFT input arrays"""
    try:
        # Read samples from I2S microphone
        num_bytes_read = audio_in.readinto(raw_samples)
        
        if num_bytes_read == 0:
            print("No data received from microphone")
            return False
        
        # Process raw samples
        samples_count = num_bytes_read // 4
        format_str = "<{}i".format(samples_count)
        samples = struct.unpack(format_str, raw_samples[:num_bytes_read])
        
        # Populate the real array, zero the imaginary array
        sample_count = min(len(samples), FFT_SIZE)
        for i in range(sample_count):
            # Need to shift right by 8 bits for INMP441 (24-bit samples in 32-bit words)
            if using_dft_class:
                fft_processor.re[i] = samples[i] >> 8
            else:
                # Apply Hanning window directly
                fft_re[i] = (samples[i] >> 8) * hanning(i, FFT_SIZE)
                fft_im[i] = 0.0
        
        # If we didn't fill the array, zero the rest
        for i in range(sample_count, FFT_SIZE):
            if using_dft_class:
                fft_processor.re[i] = 0
            else:
                fft_re[i] = 0
                fft_im[i] = 0
        
        return True
    except Exception as e:
        print(f"Error in capture_audio_samples: {e}")
        return False

def process_fft():
    """Process the FFT with appropriate implementation"""
    try:
        if using_dft_class:
            # Run the FFT with polar conversion using the DFT class
            fft_processor.run(POLAR)
            return True
        else:
            # Use our fallback FFT implementation
            simple_fft(fft_re, fft_im)
            to_polar(fft_re, fft_im)
            return True
    except Exception as e:
        print(f"Error in process_fft: {e}")
        return False

def draw_spectrum():
    """Draw the frequency spectrum on the OLED display"""
    try:
        # Clear the display
        oled.fill(0)
        
        # Number of frequency bins to display
        num_bins = 64
        
        # Calculate the frequency range being displayed
        nyquist_freq = SAMPLE_RATE / 2
        bin_freq_width = nyquist_freq / (FFT_SIZE // 2)
        freq_end = int(bin_freq_width * (FFT_SIZE // 2))
        
        # Combine frequency bins to fit display
        display_bins = array.array('f', [0] * num_bins)
        bin_width = (FFT_SIZE // 2) // num_bins
        
        # Simple averaging of bins, focusing on lower frequencies
        for i in range(num_bins):
            start_idx = i * bin_width
            end_idx = min((i + 1) * bin_width, FFT_SIZE // 2)
            
            # Fast averaging
            bin_sum = 0
            for j in range(start_idx, end_idx):
                if using_dft_class:
                    bin_sum += fft_processor.re[j]  # Magnitudes are in the real array after POLAR transform
                else:
                    bin_sum += fft_re[j]  # Magnitudes are in fft_re after to_polar
            display_bins[i] = bin_sum / (end_idx - start_idx) if end_idx > start_idx else 0
        
        # Find maximum value for scaling (avoid division by zero)
        max_magnitude = 1.0
        for mag in display_bins:
            if mag > max_magnitude:
                max_magnitude = mag
        
        # Reserve top row for frequency labels
        top_margin = 8
        
        # Use display height minus top margin
        display_height = 54  # 64 - top margin - 2
        baseline = 63        # Start from the bottom of the screen
        scaling_factor = 1.0  # Adjust scaling to distribute bars
        
        # Find the frequency bin with the highest magnitude
        max_idx = 0
        max_val = 0
        for i in range(FFT_SIZE // 2):
            curr_val = fft_processor.re[i] if using_dft_class else fft_re[i]
            if curr_val > max_val:
                max_val = curr_val
                max_idx = i
        
        # Calculate the peak frequency in Hz
        peak_freq = int(max_idx * bin_freq_width)
        
        # Display peak frequency on the left and max range on the right
        oled.text(f"{peak_freq}", 0, 0, 1)
        end_text = f"{freq_end}"
        # Position end frequency text right-aligned
        end_x = 128 - (len(end_text) * 8)  # Each character is ~8 pixels wide
        oled.text(end_text, end_x, 0, 1)
        
        # Draw the spectrum - each bin takes 2 pixels width
        for i in range(len(display_bins)):
            # Apply sqrt scaling for more balanced distribution
            normalized = display_bins[i] / max_magnitude
            # Use sqrt scaling for better visual distribution
            height = int(math.sqrt(normalized) * display_height * scaling_factor)
            
            # Draw vertical bar
            x = i * 2  # Each bar is 2 pixels wide
            for y in range(baseline, baseline - height, -1):
                if y >= top_margin:  # Ensure we don't write over the frequency text
                    oled.pixel(x, y, 1)
                    oled.pixel(x + 1, y, 1)  # Make bars 2 pixels wide
        
        # Draw baseline
        oled.hline(0, baseline, 128, 1)
        
        # Update the display
        oled.show()
        return True
    except Exception as e:
        print(f"Error in draw_spectrum: {e}")
        # Try to show error on display
        try:
            oled.fill(0)
            oled.text("FFT Error", 0, 0, 1)
            oled.text(str(e)[:16], 0, 10, 1)
            oled.show()
        except:
            pass
        return False

try:
    print("\n" + "="*40)
    print("Sound Spectrum Analyzer")
    print("="*40)
    
    # Welcome message on OLED
    oled.fill(0)
    oled.text("FFT Analyzer", 0, 0, 1)
    if using_dft_class:
        oled.text("Using DFT lib", 0, 10, 1)
    else:
        oled.text("Using fallback", 0, 10, 1)
    oled.text("Starting...", 0, 20, 1)
    oled.show()
    time.sleep(1)
    
    # Calculate and print frequency range information
    nyquist_freq = SAMPLE_RATE / 2
    bin_freq_width = nyquist_freq / (FFT_SIZE // 2)
    max_freq = int(bin_freq_width * (FFT_SIZE // 2))
    
    print("\nAnalyzer configuration:")
    print(f"- Using DFT class: {using_dft_class}")
    print(f"- Frequency resolution: {bin_freq_width:.2f} Hz per bin")
    print(f"- Display frequency range: 0 Hz to {max_freq} Hz")
    print(f"- FFT size: {FFT_SIZE}")
    print(f"- Sample rate: {SAMPLE_RATE} Hz")
    print("\nStarting main loop...")
    
    # Main processing loop
    while True:
        # Capture audio samples
        if capture_audio_samples():
            # Process FFT
            if process_fft():
                # Draw the spectrum
                draw_spectrum()
        
        # Small delay to avoid hammering the CPU
        time.sleep(0.01)

except KeyboardInterrupt:
    print("Monitoring stopped by user")
except Exception as e:
    print(f"Fatal error: {e}")
finally:
    # Clean up
    try:
        audio_in.deinit()
    except:
        pass
    print("Program terminated")