# HSTX Display Interface

!!! mascot-welcome "Welcome to the HSTX Interface Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will learn about HSTX — a brand-new high-speed interface on the RP2350 chip. This technology can send video signals fast enough to drive a full computer monitor!

## What Is the HSTX Display Interface?

**HSTX** stands for **High-Speed Serial Transmit**. It is a special interface built into the Raspberry Pi **RP2350** microcontroller chip. The RP2350 is the newer, more powerful chip used in the Raspberry Pi Pico 2.

HSTX can send data at very high speeds. It is designed for one job: sending video signals to displays. On the RP2350, pins **GP12 through GP19** are HSTX-capable.

HSTX is an **output-only** interface. That means it can only send data — it cannot receive data back from a display.

[Learn more at CNX Software](https://www.cnx-software.com/2024/08/15/raspberry-pi-rp2350-hstx-high-speed-serial-transmit-interface/)

!!! mascot-thinking "What Makes HSTX Special?"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The older RP2040 chip had to use its programmable hardware (called PIO) to create video signals. The RP2350 has HSTX built-in, so the PIO blocks are free to do other things at the same time.

## Key Features of HSTX

HSTX has two major features that make it great for video:

**Speed:** With a 150 MHz clock and 8 available pins, HSTX can move data at up to 2,400 megabits per second. That is 2.4 billion bits per second — very fast!

**DVI Output:** HSTX can create **Digital Visual Interface (DVI)** video signals. DVI is the standard used by computer monitors and many HDMI devices. It uses a method called **Transition-Minimized Differential Signaling (TMDS)** encoding, which reduces electrical interference and keeps the signal clean over long cables.

[Learn more at Hackaday](https://hackaday.com/2024/08/20/close-up-on-the-rp2350-hstx-peripheral/)

## Support on the RP2350

The HSTX interface is built into the RP2350 chip. The RP2350 also has:

- Hardware floating-point math support (faster math operations)
- Three **Programmable I/O (PIO)** blocks (the RP2040 only had two)
- TrustZone secure boot (keeps programs safe from tampering)
- The HSTX peripheral for 4-lane differential data transmission — great for DVI video output

Because HSTX handles video, the PIO blocks are free to control motors, sensors, LEDs, and other hardware at the same time as video output is running.

[Learn more at Electronics-lab](https://www.electronics-lab.com/adafruit-feather-rp2350-development-board-with-raspberry-pi-rp2350a-mcu-and-22-pin-hstx-display-interface/)

## Programming HSTX

**CircuitPython** already supports HSTX in version 9.2.0 and later. CircuitPython is a programming language very similar to MicroPython. Support for HSTX video output was added to help makers create DVI display projects.

The easiest way to use HSTX with CircuitPython is through the **PicoDVI** core module. PicoDVI creates a frame buffer in memory. A frame buffer is like a drawing canvas — you draw on it in code, and the HSTX hardware automatically sends the image to the display. This works on both RP2040 and RP2350 boards.

[Learn more at Adafruit](https://learn.adafruit.com/adafruit-metro-rp2350/hstx-display)

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    MicroPython support for HSTX is still developing. If you want to try HSTX video output right now, CircuitPython with the PicoDVI module is the easiest path to get started.

## Hardware That Uses HSTX

Several development boards include the HSTX interface:

**Adafruit Feather RP2350:** This board has a 22-pin HSTX connector. The connector is designed specifically for video output and display interfaces. The older RP2040-based Feather used PIO to create video signals. The new RP2350 Feather has dedicated HSTX hardware for this job instead.

[Learn more at CNX Software](https://www.cnx-software.com/2024/09/24/adafruit-feather-rp2350-board-with-hstx-port-enables-video-output-and-display-interfaces/)

## Other Uses for HSTX

HSTX is not only for displays. It can also be used for **high-speed data collection** (called data acquisition).

Steve Markgraf showed how to combine a Raspberry Pi Pico 2 with a DVI Sock board and an HDMI-to-USB 3.0 video capture device. This combination can stream data to a computer at up to **75 megabytes per second**. That is fast enough to capture signals from many types of sensors.

[Learn more at CNX Software](https://www.cnx-software.com/2024/11/19/high-speed-data-acquisition-raspberry-pi-pico-2-hstx-interface-cheaper-hdmi-to-usb-3-0-video-capture-dongle/)

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    HSTX is an advanced topic. You do not need to understand every detail right now. Just knowing it exists — and what it can do — puts you ahead of most beginners!

## References

- [SparkFun HSTX Breakout Board](https://www.sparkfun.com/sparkfun-hstx-pth-breakout.html) — $250
- [CNX Software — RP2350 HSTX Overview](https://www.cnx-software.com/2024/08/15/raspberry-pi-rp2350-hstx-high-speed-serial-transmit-interface/)
- [Hackaday — Close-up on RP2350 HSTX](https://hackaday.com/2024/08/20/close-up-on-the-rp2350-hstx-peripheral/)
- [Adafruit Metro RP2350 HSTX Display Guide](https://learn.adafruit.com/adafruit-metro-rp2350/hstx-display)
- [Electronics-lab — Adafruit Feather RP2350 with HSTX](https://www.electronics-lab.com/adafruit-feather-rp2350-development-board-with-raspberry-pi-rp2350a-mcu-and-22-pin-hstx-display-interface/)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know about one of the most exciting new features in the RP2350 chip. When MicroPython adds full HSTX support, you will be ready to use it to build your own video projects!
