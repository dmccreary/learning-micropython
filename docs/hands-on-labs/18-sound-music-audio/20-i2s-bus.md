# The I2S Bus

!!! mascot-welcome "Welcome to the I2S Bus Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will learn why the Inter-IC Sound (I2S) bus is the best way to play high-quality audio on the Pico, and you will build a robot sound player!

## Why Use I2S?

The **Inter-IC Sound (I2S)** bus on the Raspberry Pi Pico is a great choice for digital audio projects. Here is why:

### 1. High-Quality Digital Audio

I2S transfers digital audio without any loss of quality. Analog signals can pick up electrical noise and sound scratchy. I2S keeps the audio in digital form until the very last moment.

### 2. Low Pin Count

I2S only needs three pins to transmit high-quality audio. That leaves most of the Pico's other GPIO pins free for sensors, buttons, and displays.

### 3. Stereo Audio Support

The I2S bus can carry stereo audio — a separate left and right channel at the same time. This makes it great for music players, audio recorders, and interactive sound art.

### 4. Works With Many Audio Chips

Most digital audio chips — **Digital-to-Analog Converters (DACs)**, **Analog-to-Digital Converters (ADCs)**, and audio codecs — support I2S directly. You can connect them to the Pico with just three wires.

### 5. Less Electrical Interference

Because the audio stays digital until it reaches the DAC chip, it does not pick up the electrical noise that affects analog wires. The result is cleaner sound.

### 6. Many Sample Rates and Bit Depths

I2S supports audio at different qualities: 16-bit at 8 kHz (good for voice), 16-bit at 44.1 kHz (CD quality), or even 24-bit at 48 kHz (studio quality). The Pico handles all of these.

### 7. Great for Audio Projects

I2S is perfect for:

- Building audio streaming devices
- Making digital radios or podcast players
- Creating smart speakers or voice assistants
- Building voice-controlled robots

### 8. Easy in MicroPython

MicroPython's `machine.I2S` class makes it simple to send and receive I2S audio without writing complex low-level code.

### 9. Learning Opportunity

Working with I2S teaches you about digital audio processing and how modern audio equipment works. The skills you learn here apply to professional audio devices too.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    I2S keeps the audio signal digital until it reaches the DAC chip. Keeping audio digital for as long as possible means less noise and better sound quality.

## Robot Sounds Project

Here is a fun project that plays robot sound files on the Raspberry Pi Pico using I2S.

### Project: Robot Sound Player

This project uses the Pico with an I2S DAC to play robot sound files (beeps, boops, speech) stored on a microSD card. A button press triggers each sound.

### Components Needed

1. Raspberry Pi Pico (with headers for easy wiring)
2. I2S DAC module (for example, PCM5102)
3. MicroSD card module (for storing sound files)
4. Speaker (connected to the DAC output)
5. Push button or slider switch (to trigger sounds)
6. Jumper wires and a breadboard

### Steps to Build

#### 1. Prepare the Sound Files

- Convert your robot sound files to 16-bit PCM WAV format at 44.1 kHz.
- Save the WAV files on a microSD card with names like `robot1.wav`, `robot2.wav`.

#### 2. Connect the Components

**MicroSD Module to Pico:**

1. Connect `VCC` on the SD module to `3.3V` on the Pico.
2. Connect `GND` on the SD module to `GND` on the Pico.
3. Connect `MISO` on the SD module to `GP16` on the Pico.
4. Connect `MOSI` on the SD module to `GP19` on the Pico.
5. Connect `SCK` on the SD module to `GP18` on the Pico.
6. Connect `CS` on the SD module to `GP17` on the Pico.

**I2S DAC to Pico:**

1. Connect `BCK` on the DAC to `GP10` on the Pico.
2. Connect `LRCK` on the DAC to `GP11` on the Pico.
3. Connect `DIN` on the DAC to `GP9` on the Pico.
4. Connect `GND` on the DAC to `GND` on the Pico.
5. Connect `VCC` on the DAC to `3.3V` or `5V` on the Pico (check your module's label).

**Speaker to DAC:**

1. Connect the `+` speaker terminal to the `+` output on the DAC module.
2. Connect the `−` speaker terminal to the `−` output on the DAC module.

**Button to Pico:**

1. Connect one side of the button to `GP14` on the Pico.
2. Connect the other side of the button to `GND`.
3. Connect a 10 kΩ pull-up resistor from `GP14` to `3.3V`.

#### 3. Install the Required Software

- Make sure MicroPython is installed on your Pico.
- Upload the I2S audio library (for example, `i2s_audio.py`) to the Pico.
- Upload the SD card library to the Pico.
- Format the microSD card as FAT32 before copying sound files to it.

#### 4. Write the Code

```python
from machine import Pin, I2S, SPI  # import Pin, I2S, and SPI classes
import uos                          # import the operating-system module

# Set up I2S for the DAC
audio_out = I2S(
    0,                              # use I2S peripheral 0
    sck=Pin(10),                    # bit clock pin
    ws=Pin(11),                     # word select (left/right channel) pin
    sd=Pin(9),                      # serial data output pin
    mode=I2S.TX,                    # TX = transmit (play audio)
    bits=16,                        # 16-bit audio samples
    format=I2S.MONO,                # single channel
    rate=44100                      # 44,100 samples per second
)

# Set up the SPI bus for the SD card
spi = SPI(0, sck=Pin(18), mosi=Pin(19), miso=Pin(16))
sd_cs = Pin(17, Pin.OUT)            # chip-select pin for the SD card
uos.mount(SDCard(spi, sd_cs), "/sd")  # mount the SD card at /sd

# Set up the button with a pull-up resistor
button = Pin(14, Pin.IN, Pin.PULL_UP)  # button reads LOW when pressed

def play_sound(file_path):
    """Open a WAV file and play it through the I2S DAC."""
    with open(file_path, "rb") as wav:
        wav.seek(44)               # skip past the 44-byte WAV file header
        while True:
            buf = wav.read(2048)   # read 2 KB of audio data at a time
            if not buf:
                break              # stop when we reach the end of the file
            audio_out.write(buf)   # send the audio data to the DAC

print("Ready to play robot sounds!")
while True:
    if not button.value():         # button pressed (value is LOW with PULL_UP)
        print("Playing sound!")
        play_sound("/sd/robot1.wav")  # play the first robot sound
```

### What Each Section Does

1. `I2S(0, mode=I2S.TX, ...)` — sets up I2S peripheral 0 to transmit audio.
2. `SPI(0, ...)` and `uos.mount(...)` — connects to the SD card over SPI and mounts it as a drive at `/sd`.
3. `Pin(14, Pin.IN, Pin.PULL_UP)` — sets the button pin as an input with an internal pull-up resistor.
4. `wav.seek(44)` — skips the WAV file header. The first 44 bytes describe the file format, not audio.
5. `wav.read(2048)` — reads 2 KB of audio at a time to avoid running out of memory.
6. `audio_out.write(buf)` — sends the audio chunk to the DAC over I2S.
7. `if not button.value()` — the button reads `False` (LOW) when pressed, because of the pull-up resistor.

#### 5. Test the Setup

1. Power up the Pico.
2. Press the button to play `robot1.wav`.
3. Swap in different sound files or add more buttons for additional sounds.

### Extensions

1. **Multiple buttons**: Add more buttons to trigger different sound effects.
2. **Random playback**: Use the `random` module to pick a random sound from the SD card.
3. **Sensor triggers**: Connect a distance sensor and play a sound when something gets close.

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Setting up I2S with an SD card can feel like a lot of steps. Take it one step at a time — connect the SD card first, then add the DAC, then add the button. You've got this!

## Storing Sounds in the Pico's Built-In Flash Memory

You do not need an SD card for short sound effects. You can store WAV files directly in the Pico's 2 MB of built-in flash memory. Here are the trade-offs:

### Considerations

- The Pico has 2 MB of flash, shared with MicroPython and your code. A WAV file at 16-bit, 44.1 kHz uses about 88 KB per second. A file at 8 kHz uses only about 16 KB per second.
- Mono files use half as much space as stereo.
- Copy files to the Pico using Thonny's file manager or the `mpremote` command-line tool.
- Flash memory is a bit slower to read than an SD card, but for short clips this is not a problem.

### Steps to Store and Play Sounds From Flash

#### 1. Prepare the Sound Files

Convert your files to a smaller format using ffmpeg:

```bash
ffmpeg -i input.wav -ar 16000 -ac 1 -b:a 8k output.wav
```

This creates a mono file at 16,000 samples per second.

#### 2. Upload Files to the Pico

1. Open Thonny.
2. Connect your Pico.
3. Use the **File** menu to upload your WAV file to the Pico's flash memory.

#### 3. Play the Sound From Flash

```python
from machine import I2S, Pin     # import I2S and Pin classes

# Set up I2S for the DAC
audio_out = I2S(
    0,                            # use I2S peripheral 0
    sck=Pin(10),                  # bit clock pin
    ws=Pin(11),                   # word select pin
    sd=Pin(9),                    # serial data output pin
    mode=I2S.TX,                  # TX = transmit (play audio)
    bits=16,                      # 16-bit audio samples
    format=I2S.MONO,              # single channel
    rate=16000                    # must match the WAV file's sample rate
)

def play_sound(file_path):
    """Open a WAV file from flash and play it through the I2S DAC."""
    try:
        with open(file_path, "rb") as wav:
            wav.seek(44)          # skip the 44-byte WAV header
            while True:
                buf = wav.read(2048)   # read 2 KB at a time
                if not buf:
                    break              # stop at the end of the file
                audio_out.write(buf)   # send audio to the DAC
    except Exception as e:
        print(f"Error playing sound: {e}")  # print any error message

# Play the sound stored on the Pico
print("Playing robot sound...")
play_sound("robot1.wav")          # the file is in the root folder on the Pico
```

#### 4. Optimize and Test

- Use `uos.listdir()` to list the files in flash and confirm your WAV file is there.
- Make sure the `rate` value in the I2S setup matches the sample rate of your WAV file.
- If the sound skips or stutters, try a smaller buffer size or a lower sample rate.

### Advantages of Using Flash

- No extra hardware needed — just the Pico.
- Simple wiring.
- Good for a few short sound clips in a self-contained project.

### Limitations of Using Flash

- Only 2 MB of space, shared with your code and MicroPython.
- Use low sample rates (8 kHz or 16 kHz) to fit more sounds.
- Flash memory wears out after many write cycles, so do not write new files too often.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    For a small robot with just a few sound effects, flash storage is perfect. For a music player with many songs, use an SD card instead.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just built a robot sound player using the I2S bus! Your Pico can now play real audio files — not just buzzer beeps.
