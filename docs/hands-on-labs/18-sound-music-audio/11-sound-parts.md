# Sound Parts and Components

!!! mascot-welcome "Welcome to the Parts Guide"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Before you start the sound labs, it helps to know which parts you need and what each one does. This page is your shopping guide!

This page lists the electronic parts you will need for the sound labs in this section. Most parts cost under $5 and are available on eBay, AliExpress, Amazon, or Adafruit.

## Speakers

A speaker turns an electrical signal into sound waves. For MicroPython projects, you need a **small passive speaker** — one with no built-in amplifier.

| Part | Specifications | Use |
|------|---------------|-----|
| Small round speaker | 4 Ω, 0.5 W, 40 mm | General purpose, works with PAM8302A |
| Small round speaker | 8 Ω, 1 W, 50 mm | Louder, works with MAX98357A |
| Mini speaker (28 mm) | 8 Ω, 0.25 W | Very small projects, low volume |

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never connect a speaker directly to a GPIO pin. The pin can only supply about 3 mA of current — not nearly enough to move a speaker cone. You will damage the GPIO pin or get no sound at all. Always use an amplifier module between the Pico and the speaker.

## Amplifier Modules

An amplifier takes the small signal from the Pico and boosts it enough to drive a speaker.

### PAM8302A — Mono Class D Amplifier

The **PAM8302A** is a miniature mono amplifier that delivers up to **2.5 W** into a 4 Ω speaker. It is great for simple projects that need one speaker.

- **Input**: standard 3.3 V audio signal from the Pico
- **Output**: up to 2.5 W into 4 Ω
- **Power supply**: 2.5 V to 5.5 V
- **Cost**: about $0.50–$1 each

Search eBay or AliExpress for [PAM8302A](https://www.ebay.com/sch/i.html?_nkw=PAM8302A).

### MAX98357A — I2S Mono DAC + Amplifier

The **MAX98357A** is the best choice for playing WAV files and digital audio. It combines a **Digital-to-Analog Converter (DAC)** and a 3 W amplifier in one small board. It connects to the Pico over the **Inter-IC Sound (I2S)** bus.

- **Input**: I2S digital audio from the Pico
- **Output**: up to 3 W into 4 Ω
- **Power supply**: 3.3 V or 5 V
- **Cost**: about $1–$2 each

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The MAX98357A does two jobs at once: it converts the Pico's digital audio signal into an analog voltage (DAC), and then it amplifies that voltage enough to drive a speaker. That is why it is so popular for beginners.

## Buzzers

A **buzzer** is the simplest way to make sound with the Pico.

| Type | How it works | Notes |
|------|-------------|-------|
| **Active buzzer** | Beeps at a fixed pitch when you apply power | Easiest — just turn it on and off |
| **Passive buzzer** | Needs a PWM signal at the frequency you want | More flexible — play any tone you choose |

Most labs in this section use a **passive buzzer** so you can control the pitch. A passive buzzer costs about $0.10–$0.50.

## Microphones

To record sound or detect noise levels, you need a microphone module.

| Module | Interface | Use |
|--------|-----------|-----|
| INMP441 | I2S digital | High-quality voice recording |
| MAX9814 | Analog | Simple noise level detection |
| KY-037 | Digital + analog | Basic clap or sound trigger |

The **INMP441** is the best choice for voice and audio recording. It connects over I2S and produces clean 24-bit digital audio.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If you are just getting started, a passive buzzer is all you need for the first four labs. You can add an amplifier and speaker later when you are ready for louder sound.

## Complete Parts List for the Sound Labs

| Part | Labs that use it | Approximate cost |
|------|-----------------|-----------------|
| Passive buzzer | Play a Tone, Play a Scale, Play Mario | $0.10–$0.50 |
| PAM8302A amplifier | Eight Key Piano, Tone Generator | $0.50–$1 |
| 4 Ω speaker (40 mm) | With PAM8302A | $0.50–$1 |
| MAX98357A I2S amp | Playing Audio File, DAC lab | $1–$2 |
| 8 Ω speaker (50 mm) | With MAX98357A | $0.50–$1 |
| INMP441 I2S microphone | Microphone INMP441 lab | $1–$3 |

## Where to Buy

- [eBay — PAM8302A](https://www.ebay.com/sch/i.html?_nkw=PAM8302A)
- [Adafruit — MAX98357A](https://www.adafruit.com/product/3006)
- [Adafruit — INMP441](https://www.adafruit.com/product/3421)
- [AliExpress — passive buzzer](https://www.aliexpress.com/wholesale?SearchText=passive+buzzer+3.3v)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Now you know which parts you need for every lab. Pick up a passive buzzer and you are ready to start the first sound lesson!
