# Quiz: Sound, Music, and Audio Generation

Test your understanding of buzzers, PWM tones, musical frequencies, I2S audio, and MIDI with these questions.

---

#### 1. What is the main difference between a passive buzzer and an active buzzer?

<div class="upper-alpha" markdown>
1. Passive buzzers are louder; active buzzers are quieter
2. A passive buzzer requires a PWM signal to produce sound; an active buzzer beeps at its own fixed frequency when given power
3. Passive buzzers connect to SPI; active buzzers connect to I2C
4. Active buzzers can play music; passive buzzers can only beep once
</div>

??? question "Show Answer"
    The correct answer is **B**. An active buzzer has its own oscillator circuit built in — apply 3.3 V and it beeps at one fixed frequency. A passive buzzer is just a piezoelectric element with no oscillator; it needs an external PWM signal to vibrate. By changing the PWM frequency sent to a passive buzzer, you can play different musical notes — making passive buzzers far more versatile for music.

    **Concept Tested:** Passive vs Active Buzzer

---

#### 2. The musical note A4 has a standard frequency of 440 Hz. What does 440 Hz mean physically?

<div class="upper-alpha" markdown>
1. The sound wave travels at 440 meters per second through air
2. The speaker or buzzer vibrates back and forth 440 times per second
3. The note lasts exactly 440 milliseconds when played
4. The PWM duty cycle is set to 440 out of 65,535
</div>

??? question "Show Answer"
    The correct answer is **B**. Frequency in Hz (hertz) means cycles per second. At 440 Hz, the speaker cone (or piezo element) vibrates back and forth 440 times every second, creating pressure waves in the air that your ear detects as the pitch A4. Higher frequencies produce higher-pitched notes; lower frequencies produce lower-pitched notes.

    **Concept Tested:** Musical Note Frequency / Sound Generation with PWM

---

#### 3. What MicroPython code sets a passive buzzer (on Pin 15) to play a 440 Hz tone?

<div class="upper-alpha" markdown>
1. `Pin(15, Pin.OUT).value(440)`
2. `ADC(15).read_u16(440)`
3. `buzzer = PWM(Pin(15)); buzzer.freq(440); buzzer.duty_u16(32768)`
4. `I2C(0).writeto(15, bytes([440]))`
</div>

??? question "Show Answer"
    The correct answer is **C**. To play a tone with a passive buzzer, create a `PWM` object on the buzzer pin, set the frequency to the desired note in Hz with `.freq()`, and set the duty cycle with `.duty_u16()`. A duty cycle of 32768 (50%) gives maximum volume for a square wave tone. Setting duty to 0 silences the buzzer without stopping the PWM object.

    **Concept Tested:** Sound Generation with PWM / machine.PWM for Sound

---

#### 4. How does one musical octave relate to frequency?

<div class="upper-alpha" markdown>
1. Each octave adds 440 Hz to the previous note's frequency
2. Each octave doubles the frequency — A4 is 440 Hz and A5 is 880 Hz
3. Each octave reduces the frequency by half — A4 is 440 Hz and A5 is 220 Hz
4. Octaves are unrelated to frequency — they describe the volume of a note
</div>

??? question "Show Answer"
    The correct answer is **B**. Going up one octave exactly doubles the frequency. A3 = 220 Hz, A4 = 440 Hz, A5 = 880 Hz, A6 = 1760 Hz. This doubling relationship is why notes with the same letter name sound similar — they share many harmonic overtones. Going down an octave halves the frequency.

    **Concept Tested:** Musical Octave / Note Frequency Relationships

---

#### 5. What is the purpose of the `time.sleep_ms(duration)` call between notes when playing a melody?

<div class="upper-alpha" markdown>
1. It prevents the buzzer from overheating by giving it rest time between high-frequency pulses
2. It sets the note duration — how long each pitch sounds before moving to the next note
3. It synchronizes the buzzer with an external metronome signal on a GPIO pin
4. It resets the PWM frequency to zero between notes to prevent audio artifacts
</div>

??? question "Show Answer"
    The correct answer is **B**. Each note in a melody must play for a specific duration (quarter note, half note, whole note). `time.sleep_ms(duration)` holds the current PWM frequency for that many milliseconds before the code moves to the next note and changes the frequency. Without this delay, all notes would play instantaneously and the melody would be inaudible.

    **Concept Tested:** Note Duration Control / Melody Playback

---

#### 6. What does the I2S (Inter-IC Sound) interface provide that PWM buzzer control cannot?

<div class="upper-alpha" markdown>
1. I2S is simpler to wire — it uses only one signal wire instead of PWM's three
2. I2S transmits high-quality digital audio data (e.g., 16-bit stereo WAV samples) to an external DAC and amplifier for speaker-quality sound
3. I2S allows the Pico to receive sound from a passive buzzer as a microphone
4. I2S automatically generates musical note frequencies without any code
</div>

??? question "Show Answer"
    The correct answer is **B**. PWM creates simple square waves — adequate for beeps and simple melodies but with limited sound quality. I2S (Inter-IC Sound) is a digital audio bus that streams 16-bit or 24-bit audio sample data to an external DAC chip (like the MAX98357A), which converts the digital stream into analog signals for driving a speaker. This produces WAV-quality sound reproduction.

    **Concept Tested:** I2S Audio Interface / MAX98357A Amplifier

---

#### 7. What is MIDI in the context of music and microcontrollers?

<div class="upper-alpha" markdown>
1. A compressed audio file format similar to MP3 but smaller
2. A serial communication protocol that sends note-on/note-off commands and pitch values between musical devices
3. A type of digital-to-analog converter chip used in audio amplifier circuits
4. The method of calculating PWM frequency from a note name like "C4"
</div>

??? question "Show Answer"
    The correct answer is **B**. MIDI (Musical Instrument Digital Interface) is a serial protocol that sends musical events — not audio samples. A MIDI "Note On" message says "start playing note 69 (A4) at velocity 100." MIDI note 69 corresponds to 440 Hz. A synthesizer or sound module receives these commands and generates the actual audio. MIDI uses a 31,250 baud serial connection.

    **Concept Tested:** MIDI Protocol

---

#### 8. A student writes a simple piano program where pressing a button plays middle C (261.63 Hz). What needs to happen when the button is RELEASED?

<div class="upper-alpha" markdown>
1. Nothing — the note continues until the next button is pressed
2. Set `buzzer.duty_u16(0)` to silence the buzzer while keeping the PWM object ready
3. Call `buzzer.deinit()` to completely stop PWM and save power
4. Set `buzzer.freq(0)` to return to the resting pitch
</div>

??? question "Show Answer"
    The correct answer is **B**. Setting `duty_u16(0)` drops the duty cycle to zero, which means the buzzer pin stays LOW the entire time and makes no sound — the PWM is technically running but producing silence. This is preferred over `deinit()` because the PWM object stays configured and can immediately resume sound when the next button is pressed without needing to reinitialize it.

    **Concept Tested:** Sound Generation with PWM / 8-Key Piano

---

#### 9. A Super Mario theme tune uses notes C5, E5, G5 at specific durations. What determines the tempo (speed) of the song?

<div class="upper-alpha" markdown>
1. The PWM frequency — higher frequencies make the song play faster
2. The buzzer's physical resonance frequency — it naturally plays at its own speed
3. The duration values passed to `sleep_ms()` for each note — shorter durations produce a faster tempo
4. The number of GPIO pins used — more pins allow parallel note playback
</div>

??? question "Show Answer"
    The correct answer is **C**. The tempo of a melody is entirely controlled by the duration of each note. A quarter note at 120 BPM lasts 500 ms; at 240 BPM it lasts 250 ms. By reducing all `sleep_ms()` duration values proportionally, you speed up the entire melody. Increasing them slows it down. The PWM frequency only controls the pitch (which note is playing), not how fast the song progresses.

    **Concept Tested:** Note Duration Control / Melody Playback

---

#### 10. What hardware is needed to play a WAV audio file through a speaker using a Pico?

<div class="upper-alpha" markdown>
1. Only the Pico and a speaker — the analog output pin handles everything
2. A passive buzzer — WAV files are just square wave data that buzzers can play directly
3. An I2S digital amplifier module (such as the MAX98357A) and a speaker — the Pico sends digital audio data over I2S and the amplifier converts it to sound
4. An OLED display — WAV audio requires a visual waveform display to work correctly
</div>

??? question "Show Answer"
    The correct answer is **C**. The Pico has no built-in DAC or audio amplifier. To play WAV files, the Pico reads 16-bit PCM audio samples from a file and streams them over the I2S bus to an amplifier module like the MAX98357A. The MAX98357A includes both a DAC (digital-to-analog converter) and a small class D audio amplifier to drive a speaker directly.

    **Concept Tested:** WAV Audio Playback / I2S Audio Interface

---
