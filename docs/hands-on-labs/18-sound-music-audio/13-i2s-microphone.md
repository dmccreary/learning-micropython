# INMP441 I2S Digital Microphone

!!! mascot-welcome "Welcome to Digital Audio Input!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You have made sounds come out of your Pico — now you will make your Pico listen! In this lab, you will connect a high-quality digital microphone and measure sound levels and frequencies. Let's build something amazing!

The **INMP441** is a tiny digital microphone. Unlike cheap analog microphones, it sends its audio data over a digital bus called **I2S** (Inter-IC Sound). This means the signal stays clean and clear even over long wires. The same technology is used in smart speakers and voice assistants.

**I2S** (pronounced "eye-squared-ess") is a three-wire audio bus:
- **SCK** — Serial Clock (the timing signal)
- **WS** — Word Select (tells the device which audio channel is being sent)
- **SD** — Serial Data (the actual audio samples)

## Parts You Need

- Raspberry Pi Pico
- INMP441 MEMS I2S microphone module
- 5 jumper wires
- Breadboard
- (Optional) SSD1306 OLED display for visualization

## Wiring Steps

1. Connect **VDD** on the microphone to the Pico's **3.3V** pin.
2. Connect **GND** on the microphone to any **GND** pin on the Pico.
3. Connect **SCK** on the microphone to **GPIO 10** on the Pico.
4. Connect **WS** on the microphone to **GPIO 11** on the Pico.
5. Connect **SD** on the microphone to **GPIO 12** on the Pico.
6. Connect the microphone's **L/R** pin to **GND** (this selects the left channel).

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The L/R pin selects which stereo channel the microphone sends. Connecting it to GND means left channel. If you want to use two microphones, connect one to GND and the other to 3.3V.

## Lab 1: Checking RAM Before You Start

The INMP441 needs a large audio buffer — a chunk of memory where it stores audio samples while your Pico is processing them. Check that your Pico has enough free RAM first.

```python
import gc                   # import the garbage collector
gc.collect()                # free any unused memory first

free_bytes = gc.mem_free()  # check how many bytes are available
print("Free RAM:", free_bytes, "bytes")

# We need at least 40,000 bytes for the audio buffer
if free_bytes < 40000:
    print("Warning: not enough free RAM for the audio buffer!")
else:
    print("RAM is OK — ready to connect the microphone.")
```

A standard Raspberry Pi Pico should show about 180,000 to 200,000 bytes free. If you see less, restart your Pico and try again.

## Lab 2: Testing the Microphone Connection

This program reads audio samples and prints the raw values. If you see numbers other than zero, the microphone is connected and working.

```python
from machine import I2S, Pin
import struct

# Pin assignments for the I2S bus
SCK_PIN = 10     # Serial Clock
WS_PIN  = 11     # Word Select
SD_PIN  = 12     # Serial Data

# I2S configuration
I2S_ID              = 0           # use I2S bus 0
SAMPLE_SIZE_IN_BITS = 32          # INMP441 always sends 32-bit words
SAMPLE_RATE         = 16000       # 16,000 samples per second
BUFFER_SIZE         = 4096        # bytes in the receive buffer

# Set up the I2S bus in receive (RX) mode
audio_in = I2S(
    I2S_ID,
    sck  = Pin(SCK_PIN),
    ws   = Pin(WS_PIN),
    sd   = Pin(SD_PIN),
    mode = I2S.RX,                # RX = receiving (listening)
    bits = SAMPLE_SIZE_IN_BITS,
    format = I2S.MONO,            # one channel
    rate = SAMPLE_RATE,
    ibuf = 40000,                 # internal buffer size in bytes
)

print("Microphone connected. Make some noise!")
print("You should see non-zero numbers below.")

# Create a buffer to hold one chunk of raw audio data
samples_raw = bytearray(BUFFER_SIZE)

for _ in range(5):                           # read 5 chunks
    num_bytes = audio_in.readinto(samples_raw)   # fill the buffer from the mic
    # Unpack raw bytes into a list of 32-bit integers
    num_samples = num_bytes // 4
    fmt = "<{}i".format(num_samples)             # little-endian signed integers
    samples = struct.unpack(fmt, samples_raw[:num_bytes])
    print("First 4 samples:", samples[:4])       # print a few raw values

audio_in.deinit()                            # shut down the I2S bus cleanly
```

### What Each Line Does

1. `I2S.RX` — sets the bus to receive mode (listening to the microphone).
2. `ibuf=40000` — reserves 40,000 bytes of internal buffer space for incoming audio.
3. `audio_in.readinto(samples_raw)` — fills your buffer with the latest audio samples.
4. `struct.unpack(fmt, ...)` — converts raw bytes into usable integer values.
5. `audio_in.deinit()` — releases the hardware so other programs can use it.

## Lab 3: Measuring Sound Level

This program reads audio samples and calculates the **RMS** (Root Mean Square) level — a measure of how loud the sound is.

```python
from machine import I2S, Pin
import math, struct, time

SCK_PIN = 10
WS_PIN  = 11
SD_PIN  = 12

audio_in = I2S(
    0,
    sck  = Pin(SCK_PIN),
    ws   = Pin(WS_PIN),
    sd   = Pin(SD_PIN),
    mode = I2S.RX,
    bits = 32,
    format = I2S.MONO,
    rate = 16000,
    ibuf = 40000,
)

NUM_SAMPLE_BYTES = 2048       # bytes to read each time (512 samples × 4 bytes)
samples_raw = bytearray(NUM_SAMPLE_BYTES)

print("# Sound level monitor — clap or speak into the microphone")
print("# Values range from 0 (silent) to about 100 (very loud)")

try:
    while True:
        num_bytes = audio_in.readinto(samples_raw)    # get a chunk of audio

        # Unpack 32-bit signed integers from the raw bytes
        fmt = "<{}i".format(num_bytes // 4)
        samples = struct.unpack(fmt, samples_raw[:num_bytes])

        # Calculate RMS (how loud is it?)
        sum_squares = 0
        for s in samples:
            adjusted = s >> 8          # INMP441 sends 24-bit data in a 32-bit word
            sum_squares += adjusted * adjusted

        rms = math.sqrt(sum_squares / len(samples))

        # Scale to 0–100 for easy reading
        MAX_VALUE = 8388608            # 2^23 = max value of a 24-bit sample
        level = min(100, (rms / MAX_VALUE) * 1000)
        print(int(level))             # Thonny plotter can graph this number

        time.sleep(0.1)

except KeyboardInterrupt:
    print("Stopped")
finally:
    audio_in.deinit()                 # always clean up the I2S bus
```

Open the **Thonny plotter** (View → Plotter) to see the sound level as a live graph. Speak, clap, or play music and watch the line jump up and down.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    RMS stands for Root Mean Square. It is the standard way to measure the "average loudness" of an audio signal. Squaring each sample makes all values positive, then taking the square root at the end brings the scale back.

## Lab 4: Spectrum Analyzer on an OLED Display

This advanced lab performs a **Fast Fourier Transform (FFT)** on the audio. An FFT splits a sound into its frequency components — like seeing which musical notes are present. The result is displayed as a bar chart on an SSD1306 OLED screen.

You need an SSD1306 OLED connected via SPI:
- SCL → GPIO 2, SDA → GPIO 3, RES → GPIO 4, DC → GPIO 5, CS → GPIO 6

```python
from machine import I2S, Pin, SPI
import ssd1306
import math, struct, time, array

# Set up SPI OLED display
spi = SPI(0, sck=Pin(2), mosi=Pin(3))
oled = ssd1306.SSD1306_SPI(128, 64, spi, Pin(5), Pin(4), Pin(6))

# Set up I2S microphone
audio_in = I2S(
    0,
    sck=Pin(10), ws=Pin(11), sd=Pin(12),
    mode=I2S.RX,
    bits=32,
    format=I2S.MONO,
    rate=16000,
    ibuf=40000,
)

FFT_SIZE = 512                        # number of audio samples for one FFT frame

def capture_samples():
    raw = bytearray(FFT_SIZE * 4)     # 4 bytes per 32-bit sample
    audio_in.readinto(raw)
    samples = struct.unpack("<{}i".format(FFT_SIZE), raw)
    # Apply a Hanning window to reduce noise at the edges of each frame
    windowed = array.array('f', [0.0] * FFT_SIZE)
    for i in range(FFT_SIZE):
        adjusted = samples[i] >> 8    # shift right 8 to get 24-bit value
        hann = 0.5 * (1 - math.cos(2 * math.pi * i / (FFT_SIZE - 1)))
        windowed[i] = adjusted * hann
    return windowed

def compute_magnitudes(samples):
    # Simple DFT magnitude calculation for 64 display bins
    num_bins = 64
    magnitudes = []
    step = FFT_SIZE // (num_bins * 2)  # frequency resolution
    for k in range(num_bins):
        re = 0.0
        im = 0.0
        freq = k * step
        for n in range(0, FFT_SIZE, 8):   # sample every 8th point for speed
            angle = 2 * math.pi * freq * n / FFT_SIZE
            re += samples[n] * math.cos(angle)
            im -= samples[n] * math.sin(angle)
        magnitudes.append(math.sqrt(re*re + im*im))
    return magnitudes

def draw_spectrum(magnitudes):
    oled.fill(0)
    max_mag = max(max(magnitudes), 1)   # avoid division by zero
    for i, mag in enumerate(magnitudes[:64]):
        height = int(math.sqrt(mag / max_mag) * 62)  # scale to display height
        x = i * 2                        # each bin is 2 pixels wide
        for y in range(63, 63 - height, -1):
            oled.pixel(x, y, 1)
    oled.hline(0, 63, 128, 1)           # draw baseline
    oled.show()

try:
    print("Spectrum analyzer running — make noise!")
    while True:
        samples = capture_samples()
        magnitudes = compute_magnitudes(samples)
        draw_spectrum(magnitudes)

except KeyboardInterrupt:
    print("Stopped")
finally:
    audio_in.deinit()
```

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    The FFT math looks complicated — and it is! You do not need to understand every line right now. Focus on the result: each bar on the OLED shows the strength of a different frequency in the sound.

## Experiments

1. In Lab 3, whistle a single note. Watch the level jump. Then try humming a lower note. Is the level the same?
2. In Lab 3, try printing a bar of `=` characters instead of a number to make a text-based level meter: `print('=' * int(level))`.
3. In Lab 4, play music from a phone speaker near the microphone. Watch the bars dance with the beat.
4. Try different `SAMPLE_RATE` values (8000, 22050, 44100). Higher rates capture higher frequencies but use more memory.

!!! mascot-celebration "Your Pico Can Hear!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have built a digital audio input system and a live spectrum analyzer. These are the same building blocks used in voice assistants and audio visualizers. Next, you will give your Pico an accurate hardware clock that keeps time even without WiFi.
