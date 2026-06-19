# Using a Digital-to-Analog Converter (DAC)

!!! mascot-welcome "Welcome to the DAC Lab"
    ![Monty waving welcome](../../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your Pico speaks in digital numbers — ones and zeros. But speakers need a smooth, changing voltage to make sound. A DAC is the translator that turns digital numbers into smooth audio signals. Let's build something amazing!

## What Is a DAC?

A **Digital-to-Analog Converter (DAC)** takes a stream of digital numbers and turns them into a smoothly changing voltage. That smooth voltage is what you feed into a speaker or amplifier to produce sound.

Without a DAC:

- The Pico can only output a square wave (buzzer-style tones).
- Audio quality is harsh and robotic.

With a DAC:

- The Pico outputs real audio waveforms.
- You can play music, speech, and sound effects at CD quality.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of the DAC like a very fast water faucet. The Pico tells it a number (say, 127 out of 255), and the DAC opens the faucet to exactly halfway. Change the number thousands of times per second, and you get smooth audio.

## Types of DAC Connections

There are two common ways to add a DAC to a MicroPython project:

### 1. I2S DAC Modules

The most popular approach. The Pico sends audio data over the **Inter-IC Sound (I2S)** bus to a DAC chip. The chip converts the digital data into an analog signal.

Popular I2S DAC modules:

| Module | Max Power | Notes |
|--------|-----------|-------|
| MAX98357A | 3 W mono | Has a built-in amplifier — connect speaker directly |
| PCM5102A | headphone level | High-quality stereo, no amplifier |
| UDA1334A | headphone level | Stereo with I2S and optical input |

The MAX98357A is the best choice for beginners because it combines the DAC and a speaker amplifier in one board. No extra amplifier needed.

### 2. Pulse-Width Modulation (PWM) as a Rough DAC

The Pico does not have a true analog output pin. But you can use **PWM with a low-pass filter** (a resistor and capacitor) to create a rough version of analog audio. This works for speech playback and simple sound effects but is not good enough for music.

## Wiring a MAX98357A to the Pico

| MAX98357A Pin | Pico Pin | Signal |
|---------------|----------|--------|
| VIN | 3V3 (pin 36) | 3.3 V power |
| GND | GND | Ground |
| BCLK | GP10 | I2S bit clock (SCK) |
| LRC | GP11 | I2S word select (WS) |
| DIN | GP9 | I2S serial data (SD) |
| + (speaker) | Speaker + | Speaker positive terminal |
| − (speaker) | Speaker − | Speaker negative terminal |

Connect a small **4 Ω or 8 Ω speaker** (0.5 W to 3 W) to the + and − output terminals on the MAX98357A module.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never connect a speaker directly to a GPIO pin. The GPIO pin can only supply about 3 mA — not nearly enough to drive a speaker. Always use an amplifier like the MAX98357A between the Pico and the speaker.

## Sample Program: Play a Sine Wave

This program generates a 440 Hz sine wave (the note A4) and plays it through a MAX98357A. A **sine wave** is the smoothest possible wave shape — it sounds like a pure, clean tone.

```python
from machine import I2S, Pin   # import I2S and Pin classes
import math                     # import math for the sine function

# I2S pin numbers for the MAX98357A
SCK_PIN = 10                    # bit clock
WS_PIN  = 11                    # word select
SD_PIN  = 9                     # serial data output

# Set up the I2S transmitter
audio_out = I2S(
    0,                          # use I2S peripheral 0
    sck=Pin(SCK_PIN),           # connect the bit clock
    ws=Pin(WS_PIN),             # connect the word select
    sd=Pin(SD_PIN),             # connect the serial data
    mode=I2S.TX,                # TX = transmit (play audio)
    bits=16,                    # 16-bit audio samples
    format=I2S.MONO,            # single channel
    rate=22050,                 # 22,050 samples per second
    ibuf=10000                  # internal buffer: 10,000 bytes
)

SAMPLE_RATE = 22050             # must match the rate above
FREQUENCY   = 440              # Hz — the note A4 (concert A)
DURATION    = 3                 # play for 3 seconds
AMPLITUDE   = 30000            # volume — max is 32767 for 16-bit audio

# Calculate how many samples fit in one full cycle of the sine wave
samples_per_cycle = SAMPLE_RATE // FREQUENCY
# Create a buffer to hold one complete cycle
one_cycle = bytearray(samples_per_cycle * 2)  # 2 bytes per 16-bit sample

# Fill the buffer with one cycle of a sine wave
for i in range(samples_per_cycle):
    # Calculate the sine value for this sample position
    sample = int(AMPLITUDE * math.sin(2 * math.pi * i / samples_per_cycle))
    # Store the sample as two bytes (little-endian format)
    one_cycle[i * 2]     = sample & 0xFF         # low byte
    one_cycle[i * 2 + 1] = (sample >> 8) & 0xFF  # high byte

# Play the sine wave for DURATION seconds
total_bytes = SAMPLE_RATE * DURATION * 2         # total bytes to send
bytes_written = 0
while bytes_written < total_bytes:
    audio_out.write(one_cycle)                   # send one cycle of audio
    bytes_written += len(one_cycle)

audio_out.deinit()             # release the I2S hardware when done
```

## What Each Line Does

| Line | Purpose |
|------|---------|
| `I2S(0, mode=I2S.TX, ...)` | Sets up I2S transmitter on peripheral 0 |
| `bits=16` | 16-bit audio samples (standard CD quality) |
| `format=I2S.MONO` | Single audio channel |
| `rate=22050` | 22,050 samples per second |
| `math.sin(...)` | Calculates the sine wave value at each sample point |
| `audio_out.write(one_cycle)` | Sends the audio data to the DAC over I2S |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Change `FREQUENCY = 440` to other values to play different musical notes. For example, 262 Hz is Middle C, 494 Hz is B4, and 523 Hz is C5.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have connected a real DAC and generated an audio signal from scratch! Next, try playing a WAV file from the Pico's flash storage using the [Playing Audio Files](../07-play-audio-file.md) lab.

## References

1. [MAX98357A Datasheet (Maxim)](https://www.maximintegrated.com/en/products/analog/audio/MAX98357A.html)
2. [MicroPython I2S Documentation](https://docs.micropython.org/en/latest/library/machine.I2S.html)
3. [I2S Standard Overview](../08-i2s-standard.md)
