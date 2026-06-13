# Communication Protocols: I2C, SPI, and UART

## Summary

Modern sensors and displays rarely connect through a single wire — they use standard communication protocols that let many devices share just a few wires. This chapter introduces the most common protocols you will encounter: I2C (two wires, up to 127 devices), SPI (four wires, very fast), UART (serial communication), 1-Wire (temperature sensors), and I2S (digital audio). You will learn to use MicroPython's machine.I2C, machine.SPI, machine.UART, and machine.I2S classes, and you will use an I2C scanner to discover which devices are connected to your bus — a skill that will save you hours of debugging.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. I2C Protocol
2. I2C Bus SDA and SCL
3. I2C Address
4. I2C Scanner
5. machine.I2C Class
6. I2C.scan() Method
7. I2C.writeto() Method
8. I2C.readfrom() Method
9. SPI Protocol
10. SPI Bus Pins (MOSI MISO SCK CS)
11. machine.SPI Class
12. SPI.write() Method
13. SPI.read() Method
14. UART Protocol
15. machine.UART Class
16. 1-Wire Protocol
17. I2S Protocol
18. machine.I2S Class
19. Bus Frequency Setting

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Microcontrollers and Hardware Platforms](../04-microcontrollers-hardware/index.md)

---

TODO: Generate Chapter Content
