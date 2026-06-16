# Sound Output Methods

Audience: students adding audio feedback or music to their MicroPython projects.
Chapter: 18 — Sound, Music & Audio

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Sound Output Methods Compared", subtitle beneath: "Passive Buzzer · Active Buzzer · Speaker + PWM · I2S DAC + Amplifier."

    Layout: a four-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a component illustration at the top. A vertical row-label strip on the far left lists the nine attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (teal blue #1389A6): Header "Passive Buzzer"; Illustration: small black disc-shaped buzzer, two pins, no marking (passive type has two equal-length pins). Rows:
    · Sound generation: Membrane vibrates at the PWM frequency you set
    · Frequency range: ~20 Hz – 20 kHz (audible range); typical use 100 Hz – 10 kHz
    · Volume: Low — approx. 60–70 dB at 10 cm
    · Tone capability: Full melody — any note frequency is possible
    · Wiring: Signal pin → buzzer → GND (2 connections total)
    · Power: Driven directly from 3.3 V GPIO PWM pin
    · MicroPython: pwm = PWM(pin); pwm.freq(440); pwm.duty_u16(32768) for middle A
    · Typical cost: $0.20–$0.50
    · Best for: Melodies, alerts, game sound effects, Morse code

    Column 2 (warm orange #E07B39): Header "Active Buzzer"; Illustration: small black disc-shaped buzzer with a white sticker on top marked "+" (active type); two pins of different lengths (longer = positive). Rows:
    · Sound generation: Internal oscillator circuit generates a fixed frequency tone
    · Frequency range: Fixed internal tone — typically ~2 kHz (varies by component)
    · Volume: Medium–loud — approx. 70–85 dB at 10 cm
    · Tone capability: On/off only — single fixed beep tone
    · Wiring: VCC (5 V) → buzzer + pin; buzzer − pin → GND (or switch with transistor)
    · Power: 5 V recommended (louder than at 3.3 V); uses ~30 mA
    · MicroPython: Pin(n, Pin.OUT).value(1) to beep; value(0) to stop
    · Typical cost: $0.20–$0.50
    · Best for: Simple alarms, button-press confirmation beeps, low-code audio feedback

    Column 3 (deep purple #6A3FB5): Header "Small Speaker + PWM"; Illustration: small round 8 Ω speaker (36 mm diameter) with two wire leads; waveform symbol beside it. Rows:
    · Sound generation: Voice coil moves cone — driven by PWM square wave from GPIO
    · Frequency range: 20 Hz – 20 kHz (wider range and better fidelity than a buzzer)
    · Volume: Very low without an amplifier — needs transistor or op-amp circuit for useful volume
    · Tone capability: Full melody with better tonal quality than passive buzzer
    · Wiring: GPIO → transistor base → speaker; collector to V+; emitter to GND (or use amp)
    · Power: GPIO PWM signal through NPN transistor (2N2222) or small amp IC
    · MicroPython: PWM(pin) — vary freq() for notes; can play simple tunes
    · Typical cost: $0.50–$2.00 speaker + ~$0.10 transistor
    · Best for: Better-sounding tones; adding volume with a small amplifier IC

    Column 4 (raspberry red #C7164E): Header "I2S DAC + Amplifier"; Illustration: small green MAX98357A breakout board with I2S pins labeled (BCLK, LRCLK, DIN) and a speaker connector. Rows:
    · Sound generation: Digital audio stream decoded by DAC, amplified to speaker
    · Frequency range: 20 Hz – 20 kHz (full audio bandwidth); 24-bit depth at up to 96 kHz sample rate
    · Volume: Loud — MAX98357A outputs up to 3.2 W into 4 Ω speaker
    · Tone capability: Full digital audio — WAV, PCM; tone synthesis, voice output
    · Wiring: 3 I2S bus pins (BCLK, LRCLK, DIN) + 5 V power + speaker
    · Power: 5 V supply to I2S amp module; I2S signal at 3.3 V
    · MicroPython: machine.I2S(id, sck, ws, sd, mode=I2S.TX, bits=16, format=I2S.STEREO, rate=44100, ibuf=20000)
    · Typical cost: $3–$8 for MAX98357A breakout module + speaker
    · Best for: Music playback, voice output, high-quality audio in advanced projects

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, monospace for MicroPython snippets, numbers bold. Footer bar: "Sources: Maxim MAX98357A datasheet · RP2040 I2S documentation (Raspberry Pi Ltd) — verified June 2026." Overall: tidy vector flat-design infographic poster, four-column grid with component illustrations, suitable for a textbook or classroom screen.
