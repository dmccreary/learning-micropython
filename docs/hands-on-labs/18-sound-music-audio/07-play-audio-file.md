# Playing an Audio File

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ax7XAhnwQ24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

!!! mascot-welcome "Welcome to Audio Playback"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will play a real audio file stored on your Pico. This is much better quality than a buzzer tone!

!!! Note
    This lesson is still a work in progress. The wavePlayer is in an early draft form and has unpredictable interactions with other components. See the WAV file test results section below. There are also known problems when using GPIO pins other than GPIO 2 and 3. If you stick to pins 2 and 3 for the two channels, the tests run correctly.

## Playing Sounds on the RP2040 Chip

Pulse-Width Modulation (PWM) square waves can produce tones, but the sound quality is not close to what you hear from a music player. In this lab, you will play high-quality audio files stored in the Pico's built-in memory.

The Raspberry Pi Pico has 2 MB of on-board flash memory (non-volatile storage that keeps your files even when unplugged). You can store short sound effects there. By adding an SD card reader, you can store much longer audio files and even full songs.

## Background on Audio Encoding

![PCM Encoding Example](../../img/PCM-example.png)

Audio files come in many formats. Two ideas are important for this lab:

1. **Sampling rate** — how many times per second the audio is measured. A rate of 8,000 samples per second (8 kHz) gives decent quality for speech and robot sounds. A rate of 44,100 samples per second (44.1 kHz) gives CD quality.
2. **Bit depth** — how many bits store each sample. A 16-bit depth gives good accuracy. An 8-bit depth saves space but sounds noisier.

For these labs, you will use mono audio (one channel, not stereo) at 8,000 samples per second with 16-bit depth. This is a good balance between small file size and useful sound quality.

A one-second robot sound effect at 8 kHz and 16-bit depth takes about 20 KB. The Pico's 2 MB flash can hold about 10 such sound effects while leaving plenty of space for your code.

You will use standard WAV files with **Pulse-Code Modulation (PCM)** encoding. WAV files take more space than compressed MP3 files, but they are much easier for the microcontroller to play because there is almost no decoding needed.

## Overall Architecture

1. WAV files are stored in the `/sounds` folder on the Pico's flash memory or on an SD card.
2. The `wave.py` module reads the WAV files.
3. The `myPWM.py`, `chunk.py`, and `myDMA.py` modules stream the audio data to the PWM output.
4. The file's own metadata sets the playback sample rate automatically.

## Checking Your Sound File Sizes

Use this program to see the files in your `/sounds` folder and their sizes:

```python
import os                      # import the operating-system module

wave_folder = "/sounds"        # folder where sound files are stored

total = 0
# loop through every file in the sounds folder
for file in os.listdir(wave_folder):
    size = os.path.getsize(file)  # get the size in bytes
    print(file, size)             # print the file name and size
    total += size                 # add to the running total
print('Total sound directory size:', total)  # show total bytes used
```

## Connections

Some of this documentation comes from [Dan Perron's Pico Audio GitHub Repo](https://github.com/danjperron/PicoAudioPWM).

In these tests, GPIO pins 2 and 3 drive the left and right audio channels. Those signals go to a stereo amplifier. You can also connect headphones with a 1 kΩ resistor in series on each pin to limit the current.

The PWM is set to 10-bit depth (values from 0 to 1023) at about 122.5 kHz. The DMA (Direct Memory Access) controller transfers each audio chunk at the correct sample rate so the main CPU does not have to handle every byte.

You will need to install `wave.py` and `chunk.py` from the [Jokey GitHub Awesome MicroPython Repo](https://github.com/joeky888/awesome-micropython-lib/tree/master/Audio) into the root folder or the `/lib` folder on the Pico.

The playback process follows these steps:

1. Set the PWM range to 255 at 122 kHz.
2. Read the WAV file using `wave.py`, which provides the sample rate and audio data.
3. Convert each chunk from 16-bit signed to unsigned values with the midpoint at 128 (or 512 for 10-bit).
4. Wait for the previous DMA transfer to finish.
5. Pass the converted chunk to DMA for transfer at the sample rate.
6. Repeat from step 2 until the file ends.

## Steps to Test Playing a WAV File

### Clone the Pico Audio PWM GitHub Repository

```sh
git clone https://github.com/danjperron/PicoAudioPWM
cd PicoAudioPWM
```

## Download Some Test Robot WAV Files

This GitHub folder contains a set of 8 kHz, 16-bit robot sounds:

[https://github.com/CoderDojoTC/robot-media/tree/master/wav-8k](https://github.com/CoderDojoTC/robot-media/tree/master/wav-8k)

## Converting MP3 to WAV Files

This software only supports WAV files because they are easy to decode on a microcontroller. WAV files store uncompressed audio. MP3 files are smaller but need complex decoding algorithms.

The standard WAV encoding is **Linear Pulse-Code Modulation (LPCM)**.

If you have just a few MP3 files, you can use this website to convert them:

[Cloud Convert Service that Converts MP3 to WAV files](https://cloudconvert.com/mp3-to-wav)

The [next lab](09-converting-mp3-to-wav.md) shows you how to convert a whole folder of MP3 files to 8 kHz, 16-bit WAV format using a command-line script.

## Copy Sound Files to the Pico

Your Pico has 2 MB of flash storage. A typical one-second robot sound effect takes about 20 KB, so you can store many effects. Use the `rshell` program to copy files from your computer to the Pico.

Lines starting with `pc$` are commands you type in your computer's terminal. Lines starting with `rs$` are commands you type inside rshell.

```sh
# list USB devices (Mac and Linux only)
pc$ ls /dev/cu.modem*
# start rshell and connect to the Pico
pc$ rshell -p /dev/cu.modem*
# give the device a friendly name
rs$ echo 'name="pico"' > /pyboard/board.py
# exit rshell
CONTROL-C
# reconnect to rshell
$pc rshell -p /dev/cu.modem*
# go into the Pico filesystem
$rs cd /pico
# create a folder for all the sound files
mkdir sounds
# copy WAV files from your computer to the Pico
rs$ cp ~/tmp/sounds/*.wav /pico/sounds
rs$ ls /pico/sounds
```

## Listing the Wave Files

After copying files, verify them with this program:

```python
import os                          # import the operating-system module

wave_folder = "/sounds"            # path to the sounds folder on the Pico
wave_list = []                     # start with an empty list

# loop through every file in the sounds folder
for item in os.listdir(wave_folder):
    if item.find(".wav") >= 0:     # check for lowercase .wav extension
        wave_list.append(wave_folder + "/" + item)
    elif item.find(".WAV") >= 0:   # check for uppercase .WAV extension
        wave_list.append(wave_folder + "/" + item)
            
if not wave_list:
    print("Warning: NO '.wav' files found")  # warn if no files found
else:
    for item in wave_list:
        print(item)                # print each file path
```

Sample console output:

```
/sounds/cylon-attention.wav
/sounds/cylon-by-your-command.wav
/sounds/cylon-excellent.wav
/sounds/cylon-eye-scanner.wav
/sounds/cylon-see-that-the-humans.wav
/sounds/cylon-those-are-not-the-sounds.wav
```

## Checking the WAV File Format

The `wave.py` module can read the metadata inside each WAV file and show you its format. WAV files come in many formats — single channel, stereo, and different bit depths. This program prints the details in neat columns:

```python
import os
import wave                        # import the wave module to read WAV metadata

wave_folder = "/sounds"
wave_list = []

for item in os.listdir(wave_folder):
    if item.find(".wav") >= 0:
        wave_list.append(wave_folder + "/" + item)
    elif item.find(".WAV") >= 0:
        wave_list.append(wave_folder + "/" + item)
            
if not wave_list:
    print("Warning: NO '.wav' files found")
else:
    # print a header row with fixed-width columns
    print("{0:<45}".format('File Path'), 'Frame Rate  Width Chans Frames')
    for filename in wave_list:
        f = wave.open(filename, 'rb')  # open the WAV file for reading
        # "{0:<50}" means: print left-justified in a 50-character wide column
        print("{0:<50}".format(filename),
              "{0:>5}".format(f.getframerate()),   # sample rate in Hz
              "{0:>5}".format(f.getsampwidth()),   # bytes per sample
              "{0:>6}".format(f.getnchannels()),   # number of channels
              "{0:>6}".format(f.getnframes())      # total number of frames
              )
```

Sample output:

```
File Path                                     Frame Rate  Width Chans Frames
/sounds/cylon-attention.wav                         8000     1      1   6399
/sounds/cylon-by-your-command.wav                  11025     1      1  12583
/sounds/cylon-excellent.wav                        22050     1      1  48736
/sounds/cylon-eye-scanner.wav                      16000     2      2  24768
/sounds/cylon-see-that-the-humans.wav              11025     1      1  30743
/sounds/cylon-those-are-not-the-sounds.wav         22050     1      1  64137
```

## Adding an Interrupt

If you stop the RP2040 while it is playing a sound, the PWM hardware keeps generating the tone on its own. To stop it cleanly, use a `try/except` block:

```python
import os as uos
from wavePlayer import wavePlayer  # import the wave player module
player = wavePlayer()              # create a wave player object

try:
    while True:
        # keep playing the file in a loop until the user presses Ctrl-C
        player.play('/sounds/cylon-eye-scanner.wav')
except KeyboardInterrupt:
    player.stop()              # stop the PWM hardware cleanly
    print("wave player terminated")
```

## Playing the Same Sound Repeatedly

```python
import os as uos
from wavePlayer import wavePlayer  # import the wave player module
player = wavePlayer()              # create a wave player object

try:
    while True:
        player.play('/sounds/cylon-eye-scanner.wav')  # play the file over and over
except KeyboardInterrupt:
    player.stop()              # stop the PWM hardware cleanly
    print("wave player terminated")
```

## Downloading the Audio Libraries

Both `wave.py` and `chunk.py` are available here:

[https://github.com/joeky888/awesome-micropython-lib/tree/master/Audio](https://github.com/joeky888/awesome-micropython-lib/tree/master/Audio)

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Copy `wave.py` and `chunk.py` to the `/lib` folder on your Pico. That way they load automatically for any program that needs them.

## References

1. [Daniel Perron](https://github.com/danjperron/PicoAudioPWM)
2. [Wikipedia — WAV File](https://en.wikipedia.org/wiki/WAV)
3. [Web-Based Audio Conversion Service Convertio](https://convertio.co/audio-converter/)
4. [Wikipedia — Audio Interchange File Format](https://en.wikipedia.org/wiki/Audio_Interchange_File_Format)
5. [Wikipedia — Pulse-Code Modulation](https://en.wikipedia.org/wiki/Pulse-code_modulation)
6. [Raspberry Pi Pico Forum on Sound Files](https://forums.raspberrypi.com/viewtopic.php?p=1847611)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have learned how to store and play real audio files on your Pico. Next, you will test your stereo audio connections to make sure both channels work correctly.
