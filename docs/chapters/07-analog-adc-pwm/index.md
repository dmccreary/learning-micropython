# Analog Signals, ADC, and Pulse-Width Modulation

## Summary

Not everything in the physical world is simply on or off — sensors produce varying voltages, and lights can glow at any brightness. This chapter explains how the Pico's analog-to-digital converter (ADC) reads continuous voltages from potentiometers and light sensors, and how to scale those raw 16-bit readings into useful numbers. You will also learn pulse-width modulation (PWM), a clever technique that uses rapid on/off switching to simulate variable voltages — enabling LED fading, brightness control, and the motor and servo control skills used in later chapters.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Analog Signal
2. Digital Signal
3. Analog-to-Digital Converter (ADC)
4. ADC Resolution (bits)
5. machine.ADC Class
6. ADC.read_u16() Method
7. ADC Voltage Reference
8. Potentiometer
9. Potentiometer as Voltage Divider
10. Voltage Divider Circuit
11. Reading Analog Values
12. Scaling ADC Values
13. Light Sensor (Photoresistor)
14. LDR (Light-Dependent Resistor)
15. Pulse-Width Modulation (PWM)
16. PWM Frequency
17. PWM Duty Cycle
18. machine.PWM Class
19. PWM.duty_u16() Method
20. LED Fade with PWM
21. Brightness Control
22. PWM for Servo Control
23. PWM for Motor Speed
24. Soft PWM

## Prerequisites

This chapter builds on concepts from:

- [Chapter 6: Digital Input, Output, and Interrupts](../06-digital-io-interrupts/index.md)

---

TODO: Generate Chapter Content
