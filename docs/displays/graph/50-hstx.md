# HSTX Display Interface

## What is the HSTX Display Interface?


HSTX (High-Speed Serial Transmit) is a specialized interface introduced in the Raspberry Pi RP2350 microcontroller that enables high-speed data transmission. On the RP2350, GPIOs 12 through 19 are HSTX-capable. This interface is output-only and is particularly useful for video outputs and display interfaces. [CNX Software](https://www.cnx-software.com/2024/08/15/raspberry-pi-rp2350-hstx-high-speed-serial-transmit-interface/)

## Key Features of HSTX:

With a 150 MHz clock and 8 available pins, HSTX can provide a combined bandwidth of up to 2400 Mbps. Unlike a traditional UART that the name might suggest, it's specifically designed for high-speed serial data transmission. [Hackaday](https://hackaday.com/2024/08/20/close-up-on-the-rp2350-hstx-peripheral/)

The HSTX interface can be used to generate DVI output using command expanders and TMDS encoders. This allows the RP2350 to drive displays directly, freeing up the Programmable I/O (PIO) blocks that were previously needed for this purpose on the older RP2040 chip. [CNX Software](https://www.cnx-software.com/2024/08/15/raspberry-pi-rp2350-hstx-high-speed-serial-transmit-interface/)

## Support on RP2350


The HSTX interface is fully supported on the RP2350 microcontroller. The RP2350 offers hardware floating point support, 3 PIO blocks, TrustZone secure boot, and an HSTX peripheral specifically designed for 4-lane differential data transmission (such as DVI output) without requiring overclocking or PIO resources. [Electronics-lab](https://www.electronics-lab.com/adafruit-feather-rp2350-development-board-with-raspberry-pi-rp2350a-mcu-and-22-pin-hstx-display-interface/)

## Programming Support:

CircuitPython 9.2.0 (currently in Alpha) already includes support for HSTX "to generate high-frequency output signals like DVI display output". Code samples for using the HSTX interface can be found in the Raspberry Pi Pico C/C++ SDK. [CNX Software](https://www.cnx-software.com/2024/08/15/raspberry-pi-rp2350-hstx-high-speed-serial-transmit-interface/)

Using HSTX with CircuitPython is relatively straightforward through the PicoDVI core module, which allows you to create a frame buffer to output a DVI signal on both RP2040 and RP2350 boards. [Adafruit](https://learn.adafruit.com/adafruit-metro-rp2350/hstx-display)

## Hardware Implementations


Several development boards now feature the HSTX interface:

Adafruit Feather RP2350 features a 22-pin HSTX port specifically designed for enabling video output and display interfaces. While the older RP2040 chip used PIO to create video signals, the new RP2350 has dedicated HSTX hardware specifically designed for making video signals. [CNX Software](https://www.cnx-software.com/2024/09/24/adafruit-feather-rp2350-board-with-hstx-port-enables-video-output-and-display-interfaces/)

## Use Cases


Beyond displays, HSTX has other applications such as high-speed data acquisition. Steve Markgraf demonstrated this by combining a Raspberry Pi Pico 2 with a DVI Sock board and an HDMI to USB 3.0 video capture dongle, achieving data streaming rates of up to 75 MB/s. [CNX Software](https://www.cnx-software.com/2024/11/19/high-speed-data-acquisition-raspberry-pi-pico-2-hstx-interface-cheaper-hdmi-to-usb-3-0-video-capture-dongle/)
