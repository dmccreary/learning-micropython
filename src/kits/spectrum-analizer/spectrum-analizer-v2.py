import machine
import ssd1306
import uarray as array
import math
import time

# Display setup (same as hello world example)
SCL = machine.Pin(2)  # SPI CLock
SDA = machine.Pin(3)  # SPI Data
RES = machine.Pin(4)  # Reset
DC = machine.Pin(5)   # Data/command
CS = machine.Pin(6)   # Chip Select

# Initialize the SPI for the display
spi = machine.SPI(0, sck=SCL, mosi=SDA, baudrate=100000)
oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

# Setup ADC for microphone
mic = machine.ADC(machine.Pin(29))

# Constants for FFT
SAMPLES = 128  # Must be a power of 2
SAMPLE_RATE = 10000  # Hz
MAX_FREQ = SAMPLE_RATE // 2
BARS = 16  # Number of frequency bars to display

def get_samples():
    """Collect audio samples from microphone"""
    samples = array.array('H', [0] * SAMPLES)
    for i in range(SAMPLES):
        samples[i] = mic.read_u16()
        time.sleep_us(int(1000000/SAMPLE_RATE))  # Delay for sample rate
    return samples

def compute_fft(samples):
    """Compute FFT using Cooley-Tukey algorithm"""
    n = len(samples)
    if n <= 1:
        return samples
    
    even = compute_fft(samples[0::2])
    odd = compute_fft(samples[1::2])
    
    T = [0] * n
    for k in range(n//2):
        t = odd[k] * math.exp(-2j * math.pi * k / n)
        T[k] = even[k] + t
        T[k + n//2] = even[k] - t
        
    return T

def draw_spectrum(magnitudes):
    """Draw the spectrum on the OLED display"""
    oled.fill(0)  # Clear display
    
    # Calculate bar width and spacing
    bar_width = 128 // BARS
    spacing = 1
    
    # Draw each bar
    for i in range(BARS):
        height = int(magnitudes[i] * 64)  # Scale to display height
        height = min(height, 64)  # Clip to display height
        
        # Draw vertical bar
        x = i * (bar_width + spacing)
        oled.fill_rect(x, 64-height, bar_width, height, 1)
    
    oled.show()

def main():
    while True:
        # Get samples from microphone
        samples = get_samples()
        
        # Remove DC offset
        avg = sum(samples) / len(samples)
        samples = [s - avg for s in samples]
        
        # Apply Hanning window
        for i in range(SAMPLES):
            samples[i] *= 0.5 * (1 - math.cos(2 * math.pi * i / (SAMPLES - 1)))
        
        # Compute FFT
        spectrum = compute_fft(samples)
        
        # Calculate magnitude of each frequency bin
        magnitudes = [abs(c) for c in spectrum[:SAMPLES//2]]
        
        # Normalize magnitudes
        max_magnitude = max(magnitudes) if max(magnitudes) > 0 else 1
        magnitudes = [m/max_magnitude for m in magnitudes]
        
        # Average into bars
        bar_magnitudes = []
        samples_per_bar = (SAMPLES//2) // BARS
        for i in range(BARS):
            start = i * samples_per_bar
            end = start + samples_per_bar
            avg_magnitude = sum(magnitudes[start:end]) / samples_per_bar
            bar_magnitudes.append(avg_magnitude)
        
        # Draw the spectrum
        draw_spectrum(bar_magnitudes)
        
        # Small delay to prevent display flicker
        time.sleep_ms(50)

if __name__ == "__main__":
    main()