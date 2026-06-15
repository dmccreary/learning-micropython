# I2S Standard

[I2S](https://en.wikipedia.org/wiki/I%C2%B2S) (Inter-IC Sound) — pronounced "eye-two-ess" — is an electrical serial bus interface used for connecting digital audio devices together. It sends [PCM](https://en.wikipedia.org/wiki/Pulse-code_modulation) (Pulse-Code Modulation) audio data between chips in an electronic device.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../img/mascot/thinking.png){ class="mascot-admonition-img" }
    **I2S** and **I2C** sound almost identical but are completely different buses.
    I2C is for sensors and slow devices. I2S is specifically for high-quality
    digital audio — it is much faster and designed to keep audio in perfect time.

## Why Use I2S?

A simple piezo buzzer can play tones, but it cannot play high-quality audio files.
I2S lets you connect a proper digital-to-analog converter (DAC) or a digital
amplifier to the Pico so you can play **WAV files**, **synthesized music**, and
**recorded speech** at CD quality.

## How I2S Works

I2S uses three wires:

| Wire | Name | Purpose |
|------|------|---------|
| SCK | Serial Clock (Bit Clock) | Clocks each audio bit |
| WS | Word Select (Left/Right Clock) | Selects the left or right stereo channel |
| SD | Serial Data | The actual audio samples |

The clock rate depends on the audio quality you want. For standard 44.1 kHz
stereo audio at 16-bit depth:

- SCK runs at 44 100 × 2 channels × 16 bits = **1.41 MHz**

The Pico's I2S peripheral can handle this easily.

## MicroPython I2S Support

Since **MicroPython 1.17**, the `machine.I2S` class lets you send and receive
I2S audio data. Here is a minimal example that plays a raw WAV file from
the Pico's flash storage using an I2S DAC module:

```python
from machine import I2S, Pin
import os

# I2S pins — adjust for your wiring
SCK_PIN = 10  # serial clock (bit clock)
WS_PIN  = 11  # word select (left/right clock)
SD_PIN  = 9   # serial data (audio out)

# Create an I2S transmitter
audio_out = I2S(
    0,                          # I2S peripheral 0
    sck=Pin(SCK_PIN),
    ws=Pin(WS_PIN),
    sd=Pin(SD_PIN),
    mode=I2S.TX,                # TX = transmit (play audio)
    bits=16,                    # 16-bit audio samples
    format=I2S.STEREO,          # stereo (two channels)
    rate=44100,                 # 44.1 kHz sample rate
    ibuf=20000                  # internal buffer size in bytes
)

# Open a WAV file and play it (skip the 44-byte header first)
with open("audio.wav", "rb") as wav_file:
    wav_file.seek(44)           # skip the WAV file header
    buf = bytearray(4096)       # read in 4 KB chunks
    while True:
        num_read = wav_file.readinto(buf)
        if num_read == 0:
            break               # end of file
        audio_out.write(buf[:num_read])

audio_out.deinit()             # release the I2S peripheral when done
```

## Common I2S DAC Modules

| Module | Chip | Channels | Cost |
|--------|------|----------|------|
| MAX98357A | MAX98357A | Mono, 3 W | ~$2 |
| PCM5102A | PCM5102A | Stereo | ~$3 |
| UDA1334A | UDA1334A | Stereo | ~$5 |

The **MAX98357A** is the most popular for beginners — it includes a speaker
amplifier so you can connect a small speaker directly to it with no extra parts.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../img/mascot/tip.png){ class="mascot-admonition-img" }
    Convert your MP3 or music files to **16-bit 44.1 kHz WAV** format before
    copying them to the Pico. The [Converting Audio Files](09-converting-mp3-to-wav.md)
    lab shows you exactly how to do this using free tools.

## References

1. [Wikipedia — I2S](https://en.wikipedia.org/wiki/I%C2%B2S)
2. [MicroPython I2S Documentation](https://docs.micropython.org/en/latest/library/machine.I2S.html)
3. [The I2S Bus Lab](20-i2s-bus.md) — detailed wiring and usage examples
