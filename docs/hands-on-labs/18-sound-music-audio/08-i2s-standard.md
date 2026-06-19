# I2S Standard

!!! mascot-welcome "Welcome to I2S Audio"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will learn about Inter-IC Sound (I2S) — the digital bus that lets the Pico play high-quality audio. Say it like "eye-two-ess."

**Inter-IC Sound (I2S)** — pronounced "eye-two-ess" — is a serial bus that connects digital audio devices together. It sends **Pulse-Code Modulation (PCM)** audio data between chips. PCM is the same format used on CDs and in WAV files.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    **I2S** and **I2C** sound almost identical but are completely different buses. I2C is for sensors and slow devices. I2S is specifically for high-quality digital audio — it is much faster and designed to keep audio in perfect time.

## Why Use I2S?

A simple piezo buzzer can play tones, but it cannot play high-quality audio files. I2S lets you connect a proper **Digital-to-Analog Converter (DAC)** or a digital amplifier to the Pico. With I2S, you can play WAV files, synthesized music, and recorded speech at CD quality.

## How I2S Works

I2S uses three wires:

| Wire | Name | Purpose |
|------|------|---------|
| SCK | Serial Clock (Bit Clock) | Clocks each audio bit |
| WS | Word Select (Left/Right Clock) | Selects the left or right stereo channel |
| SD | Serial Data | The actual audio samples |

The clock speed depends on the audio quality you want. For standard 44.1 kHz stereo audio at 16-bit depth:

- SCK runs at 44,100 × 2 channels × 16 bits = **1.41 MHz**

The Pico's I2S hardware can handle this easily.

## MicroPython I2S Support

Since MicroPython version 1.17, the `machine.I2S` class lets you send and receive I2S audio. Here is a short example that plays a raw WAV file from the Pico's flash memory using an I2S DAC module:

```python
from machine import I2S, Pin  # import I2S and Pin classes
import os                      # import os to work with files

# I2S pins — change these numbers to match your wiring
SCK_PIN = 10   # serial clock (bit clock)
WS_PIN  = 11   # word select (left/right channel clock)
SD_PIN  = 9    # serial data (audio output)

# Set up an I2S transmitter
audio_out = I2S(
    0,                          # use I2S peripheral number 0
    sck=Pin(SCK_PIN),           # connect the bit clock to SCK_PIN
    ws=Pin(WS_PIN),             # connect the word select to WS_PIN
    sd=Pin(SD_PIN),             # connect the serial data to SD_PIN
    mode=I2S.TX,                # TX means transmit (we are playing audio)
    bits=16,                    # use 16-bit audio samples
    format=I2S.STEREO,          # stereo (left and right channels)
    rate=44100,                 # 44,100 samples per second (CD quality)
    ibuf=20000                  # internal buffer size in bytes
)

# Open a WAV file and play it (skip the 44-byte header first)
with open("audio.wav", "rb") as wav_file:
    wav_file.seek(44)           # jump past the WAV file header (44 bytes)
    buf = bytearray(4096)       # create a 4 KB buffer to read chunks into
    while True:
        num_read = wav_file.readinto(buf)   # read up to 4 KB of audio data
        if num_read == 0:
            break               # stop when we reach the end of the file
        audio_out.write(buf[:num_read])     # send the audio data to the DAC

audio_out.deinit()             # release the I2S hardware when done
```

### What Each Line Does

1. `I2S(0, mode=I2S.TX, ...)` — creates an I2S transmitter using peripheral 0.
2. `bits=16` — each audio sample is 16 bits wide.
3. `format=I2S.STEREO` — two channels (left and right).
4. `rate=44100` — 44,100 samples per second (CD quality).
5. `ibuf=20000` — the Pico buffers 20,000 bytes of audio so playback stays smooth.
6. `wav_file.seek(44)` — skips the WAV file header. The first 44 bytes describe the file format, not the audio.
7. `audio_out.write(buf[:num_read])` — sends the chunk of audio data to the DAC over I2S.
8. `audio_out.deinit()` — frees the I2S hardware so other programs can use it.

## Common I2S DAC Modules

| Module | Chip | Channels | Cost |
|--------|------|----------|------|
| MAX98357A | MAX98357A | Mono, 3 W | about $2 |
| PCM5102A | PCM5102A | Stereo | about $3 |
| UDA1334A | UDA1334A | Stereo | about $5 |

The **MAX98357A** is the most popular choice for beginners. It includes a speaker amplifier, so you can connect a small speaker directly to it with no extra parts.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Convert your audio files to **16-bit, 44.1 kHz WAV** format before copying them to the Pico. The [Converting Audio Files](09-converting-mp3-to-wav.md) lab shows you exactly how to do this with free tools.

## References

1. [Wikipedia — I2S](https://en.wikipedia.org/wiki/I%C2%B2S)
2. [MicroPython I2S Documentation](https://docs.micropython.org/en/latest/library/machine.I2S.html)
3. [The I2S Bus Lab](20-i2s-bus.md) — detailed wiring and usage examples

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now understand how I2S works and how to use it in MicroPython. Next, you will learn how to convert MP3 files into the WAV format the Pico can play.
