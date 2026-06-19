# Play Mario on MicroPython

!!! mascot-welcome "Welcome to the Mario Song Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will play the famous Super Mario theme song on your Pico! You will use a dictionary of note names and a list of notes to play a real melody.

## How This Program Works

To play a real song, you need two things:

1. A **dictionary** that maps note names (like `"E7"`) to their exact frequencies in Hz.
2. A **list** of note names in the order they should be played.

The program loops through the note list, looks up each frequency in the dictionary, and plays that tone.

## The Mario Program

```python
from machine import Pin, PWM  # import Pin and PWM classes
from utime import sleep        # import sleep to pause between notes

buzzer = PWM(Pin(16))          # create a PWM object on pin 16 for the buzzer

# Dictionary mapping note names to their frequencies in Hz
tones = {
"B0": 31,"C1": 33,"CS1": 35,"D1": 37,"DS1": 39,"E1": 41,"F1": 44,"FS1": 46,
"G1": 49,"GS1": 52,"A1": 55,"AS1": 58,"B1": 62,"C2": 65,
"CS2": 69,"D2": 73,"DS2": 78,"E2": 82,"F2": 87,"FS2": 93,"G2": 98,
"GS2": 104,"A2": 110,"AS2": 117,"B2": 123,"C3": 131,"CS3": 139,
"D3": 147,"DS3": 156,"E3": 165,"F3": 175,"FS3": 185,
"G3": 196,"GS3": 208,"A3": 220,"AS3": 233,"B3": 247,"C4": 262,"CS4": 277,"D4": 294,"DS4": 311,
"E4": 330,"F4": 349,"FS4": 370,"G4": 392,"GS4": 415,"A4": 440,"AS4": 466,"B4": 494,"C5": 523,"CS5": 554,"D5": 587,"DS5": 622,"E5": 659,"F5": 698,
"FS5": 740,"G5": 784,"GS5": 831,"A5": 880,"AS5": 932,"B5": 988,"C6": 1047,"CS6": 1109,"D6": 1175,"DS6": 1245,"E6": 1319,"F6": 1397,"FS6": 1480,"G6": 1568,"GS6": 1661,
"A6": 1760,"AS6": 1865,"B6": 1976,"C7": 2093,"CS7": 2217,"D7": 2349,"DS7": 2489,"E7": 2637,"F7": 2794,"FS7": 2960,"G7": 3136,"GS7": 3322,"A7": 3520,
"AS7": 3729,"B7": 3951,"C8": 4186,"CS8": 4435,"D8": 4699,"DS8": 4978
}

# A short test song
song = ["E5","G5","A5","P","E5","G5","B5","A5","P","E5","G5","A5","P","G5","E5"]

# The Mario theme melody — 0 means a rest (silence)
mario = ["E7", "E7", 0, "E7", 0, "C7", "E7", 0, "G7", 0, 0, 0, "G6", 0, 0, 0, "C7", 0, 0, "G6",
         0, 0, "E6", 0, 0, "A6", 0, "B6", 0, "AS6", "A6", 0, "G6", "E7", 0, "G7", "A7", 0, "F7", "G7",
         0, "E7", 0,"C7", "D7", "B6", 0, 0, "C7", 0, 0, "G6", 0, 0, "E6", 0, 0, "A6", 0, "B6", 0,
         "AS6", "A6", 0, "G6", "E7", 0, "G7", "A7", 0, "F7", "G7", 0, "E7", 0,"C7", "D7", "B6", 0, 0]

def play_tone(frequency):
    """Turn the buzzer on at the given frequency."""
    buzzer.duty_u16(1000)      # turn the buzzer on
    buzzer.freq(frequency)     # set the pitch

def be_quiet():
    """Turn the buzzer off (silence)."""
    buzzer.duty_u16(0)         # set duty cycle to 0 to silence the buzzer

def play_song(note_list):
    """Play every note in note_list one at a time."""
    for i in range(len(note_list)):        # loop through each position in the list
        if note_list[i] == "P" or note_list[i] == 0:
            be_quiet()                     # 0 or "P" means a rest — play silence
        else:
            play_tone(tones[note_list[i]]) # look up the frequency and play the tone
        sleep(0.3)                         # each note lasts 0.3 seconds
    be_quiet()                             # turn the buzzer off when the song ends

play_song(mario)               # play the Mario theme!
```

### What Each Line Does

1. `tones = {...}` — a dictionary with over 80 note names. Each name maps to a frequency in Hz.
2. `mario = [...]` — a list of note names in the order they play in the melody. `0` means silence (a rest).
3. `def play_tone(frequency):` — a function that turns the buzzer on at a given pitch.
4. `def be_quiet():` — a function that sets the duty cycle to 0, silencing the buzzer.
5. `def play_song(note_list):` — a function that loops through the note list and plays each one.
6. `if note_list[i] == "P" or note_list[i] == 0:` — checks if the current item is a rest.
7. `play_tone(tones[note_list[i]])` — looks up the note name in the dictionary and plays that frequency.
8. `sleep(0.3)` — waits 0.3 seconds before moving to the next note.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The `tones` dictionary is the key to this program. It connects human-readable note names like `"E7"` to the exact frequency numbers your buzzer needs. Without it, you would have to look up every frequency by hand!

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Try replacing `play_song(mario)` with `play_song(song)` to hear the short test melody first. It is much shorter and easier to check that your wiring is correct!

!!! mascot-celebration "You Did It!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your Pico is now playing the Mario theme song! Next, you will wire up eight buttons to build a playable piano keyboard.
