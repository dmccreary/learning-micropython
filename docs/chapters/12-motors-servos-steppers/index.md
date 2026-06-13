# Motors, Servos, and Stepper Motor Control

## Summary

Motors are the muscles of physical computing — they spin wheels, sweep arms, and move mechanisms. This chapter starts with DC motors and explains why you need a transistor or H-bridge IC (L293D, DRV8833) to safely drive them from the Pico's low-current GPIO pins. You will control motor speed with PWM and direction with an H-bridge. Then you will move to servo motors, which use a 50 Hz PWM signal to hold a precise angle, and finish with stepper motors — devices that move in exact, countable steps using the ULN2003 driver.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

1. DC Motor
2. Motor Direction Control
3. Motor Speed Control
4. H-Bridge Circuit
5. L293D Motor Driver IC
6. DRV8833 Motor Driver IC
7. L298N Motor Driver IC
8. Transistor Motor Control
9. Motor Stall Current
10. Motor Free-Run Current
11. Back-EMF Protection
12. Flyback Diode
13. Servo Motor
14. Servo Signal (50Hz PWM)
15. Servo Angle Control
16. Servo Min/Max Pulse Width
17. machine.PWM for Servo
18. Continuous Rotation Servo
19. Stepper Motor
20. Stepper Motor Phases
21. Half-Step vs Full-Step
22. Stepper Driver (ULN2003)
23. Stepper Steps Per Revolution

## Prerequisites

This chapter builds on concepts from:

- [Chapter 7: Analog Signals, ADC, and PWM](../07-analog-adc-pwm/index.md)

---

TODO: Generate Chapter Content
