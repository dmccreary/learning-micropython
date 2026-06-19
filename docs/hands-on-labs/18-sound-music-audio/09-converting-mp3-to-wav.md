# Converting MP3 to WAV Format

!!! mascot-welcome "Welcome to Audio Conversion"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will learn how to convert MP3 music files into WAV files that your Pico can play. You do this work on your computer, not on the Pico!

## Why Convert to WAV?

In the last lab, you learned how to play WAV files stored on the Pico's flash memory. The Pico uses a simple WAV player that needs a specific format: **8,000 samples per second (8 kHz), 16-bit depth, mono channel**. MP3 files use compression and are much harder to decode on a microcontroller.

All the audio conversion work happens on your computer. Your computer has powerful tools that can convert files in seconds — tools that would be too slow or too large to run on the Pico.

## Method 1: Use the ffmpeg Command-Line Tool

**ffmpeg** is a free, open-source tool that converts audio and video files. You run it by typing commands in a terminal window.

Download it from [ffmpeg.org](https://www.ffmpeg.org/download.html). On a Mac, you will need to go into System Preferences and mark the downloaded programs as trusted before they will run.

Here are the direct download links for macOS:

1. [ffmpeg (Mac)](https://evermeet.cx/ffmpeg/ffmpeg-104676-g5593f5cf24.zip)
2. [ffprobe (Mac)](https://evermeet.cx/ffprobe-104676-g5593f5cf24.zip)
3. [ffplay (Mac)](https://evermeet.cx/ffmpeg/ffplay-104454-gd92fdc7144.zip)

Each download is a zip file. Unzip them and copy the programs to `~/bin`. Then add that folder to your PATH so your terminal can find them:

```
PATH=$PATH:~/bin
```

Add that line to your `.bash_profile` file. After you do, run this to check that it worked:

```sh
which ffmpeg
```

This should print the path to ffmpeg. You can also see all its options:

```sh
ffmpeg --help
```

## Converting One MP3 to 8 kHz, 16-bit WAV

Use the `-i` flag for the input file and `-ar 8000` to set the output to 8,000 samples per second. The output file name must end in `.wav`:

```sh
ffmpeg -i r2d2-beeping.mp3 -ar 8000 r2d2-beeping-8k.wav
```

The default bit depth is 16 bits, which is what the Pico's wave player expects.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The output file name tells ffmpeg what format to use. If the name ends in `.wav`, ffmpeg automatically saves it as a WAV file.

## Converting a Whole Folder at Once

You can convert every MP3 in a folder with one shell command. This uses `ls`, `awk`, and `sed` together:

```sh
ls -1 *.mp3 | awk '{print "ffmpeg -i " $1 " -ar 8000 ../wav-8k/"$1}' | sed s/mp3$/wav/ | sh
```

This command:
1. Lists all `.mp3` files in the current folder.
2. Builds an ffmpeg command for each one.
3. Changes the output file extension from `.mp3` to `.wav`.
4. Runs all the commands one by one.

## Checking Your Converted Files

After converting, use the Unix `file` command to confirm the format:

```sh
cd ../wav-8k
file *.wav
```

Sample output:

```
r2d2-another-beep.wav:          RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-beeping-2.wav:             RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-beeping-4.wav:             RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-beeping-8k.wav:            RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-beeping-like-an-alarm.wav: RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-beeping.wav:               RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-cheerful.wav:              RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-determined.wav:            RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-excited.wav:               RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-laughing.wav:              RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-more-chatter.wav:          RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-processing.wav:            RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-sad.wav:                   RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-shocked.wav:               RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-surprised.wav:             RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-taking-to-himself.wav:     RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
r2d2-unsure.wav:                RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 8000 Hz
```

Each file shows `WAVE audio, Pulse-code Modulation (PCM), 16 bit, mono 8000 Hz` — exactly the format the Pico's wave player needs.

## Method 2: Use the pydub Python Module

!!! Note
    This method is for experienced Python developers who prefer to use Python instead of command-line tools.

### Set Up a Python Environment With Conda

```sh
conda create -n mp3-to-wav python=3
conda activate mp3-to-wav
pip install pydub ffprobe ffmpeg
```

Check the installed versions:

```sh
pip freeze
```

Expected output:

```
ffmpeg==1.4
ffprobe==0.5
pydub==0.25.1
```

### Convert a File With pydub

```python
from pydub import AudioSegment  # import the audio processing library

# load the MP3 file
sound = AudioSegment.from_mp3("r2d2-beeping.mp3")
# export as WAV with a metadata tag
sound.export("r2d2-beeping.wav", format="wav", tags={'Robot name': 'R2D2'})
```

### What Each Line Does

1. `AudioSegment.from_mp3(...)` — loads the MP3 file into memory.
2. `sound.export(...)` — saves it as a WAV file. The `tags` parameter adds optional metadata.

## Transferring the Files to the Pico With rshell

After converting your files, copy them to the Pico using rshell:

```sh
cd ../wav-8k                        # go to the folder with converted WAV files
rshell -p /dev/cu.usbmodem14101     # connect to the Pico (use your port name)
cp *.wav /pico/sounds               # copy all WAV files to the Pico's sounds folder
```

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The Pico only has 2 MB of flash memory. Check the total size of your WAV files before copying. If you fill up the flash, the Pico may not be able to save your code!

## References

1. [PyDub Documentation](http://pydub.com/)
2. [File Formats for Audio from ffmpeg](http://www.ffmpeg.org/general.html#Audio-Codecs)
3. [File Formats — ffmpeg General Reference](http://www.ffmpeg.org/general.html#File-Formats)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now convert any MP3 file into the WAV format your Pico needs. Next, you will learn about Musical Instrument Digital Interface (MIDI) and how to send music messages to other devices.
