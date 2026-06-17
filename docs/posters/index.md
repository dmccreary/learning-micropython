---
hide:
  toc
---
# Infographic Posters for Learning MicroPython

These comparison infographic posters are designed for classroom display, science fairs, and textbook reference.
We use the `/verified-infographic-generator` skill to generate the image descriptions and then use 
OpenAI ChatGPT to render the infographics.

Each poster follows the same visual style: landscape 16:9, flat-design, off-white background (#F7F9FC), dark slate (#2A2E3A) text, and a palette of four accent colors drawn from the series palette below.

## Series Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Raspberry Red | ![](https://placehold.co/20x20/C7164E/C7164E) | `#C7164E` |
| Magenta Pink | ![](https://placehold.co/20x20/E5398A/E5398A) | `#E5398A` |
| Deep Purple | ![](https://placehold.co/20x20/6A3FB5/6A3FB5) | `#6A3FB5` |
| Teal Blue | ![](https://placehold.co/20x20/1389A6/1389A6) | `#1389A6` |
| Forest Green | ![](https://placehold.co/20x20/2D8A4E/2D8A4E) | `#2D8A4E` |
| Warm Orange | ![](https://placehold.co/20x20/E07B39/E07B39) | `#E07B39` |

---

<div class="grid cards" markdown style="grid-template-columns: repeat(2, 1fr);">

-   [![Python vs. MicroPython](../chapters/01-python-basics/python-vs-micropython-infographic.png)](python-vs-micropython/)

    **[Python vs. MicroPython](python-vs-micropython/)**

    Side-by-side feature comparison for students switching from desktop Python.

-   [![MicroPython IDEs Compared](../chapters/03-micropython-environment/ide-comparison-infographic.png)](ides/)

    **[MicroPython IDEs Compared](ides/)**

    Thonny, VS Code, Mu Editor, and Wokwi Simulator.

-   [![Microcontroller Boards Compared](../chapters/04-microcontrollers-hardware/microcontroller-infographic-v2.png)](microncontrollers/)

    **[Microcontroller Boards Compared](microncontrollers/)**

    Pico, Pico W, Pico 2, and ESP32 side by side.

-   [![Common Electronic Components](../chapters/05-electronics-fundamentals/electrical-components-infographic.png)](electronic-components/)

    **[Common Electronic Components](electronic-components/)**

    Visual ID guide to resistors, LEDs, capacitors, buttons, transistors, and potentiometers.

-   [![Resistor Color Codes](../chapters/05-electronics-fundamentals/resistor-color-codes-infographic.png)](resistor-color-codes/)

    **[Resistor Color Codes](resistor-color-codes/)**

    4-band color chart with mnemonic.

-   [![GPIO Pin Functions on the Pico](../chapters/06-digital-io-interrupts/pico-pin-infographic.png)](gpio-functions/)

    **[GPIO Pin Functions on the Pico](gpio-functions/)**

    Digital I/O, PWM, ADC, I2C, SPI, and UART capabilities per pin type.

-   [![Digital vs. Analog Signals](../chapters/07-analog-adc-pwm/analog-adc-pwm-infographic.png)](digital-vs-analog/)

    **[Digital vs. Analog Signals](digital-vs-analog/)**

    Signal types, PWM as a bridge, and ADC conversion.

-   [![Serial Protocols Compared: I2C vs. SPI vs. UART](../chapters/08-communication-protocols/specialized-communication-protocols-infographic.png)](serial-protocols/)

    **[Serial Protocols Compared: I2C vs. SPI vs. UART](serial-protocols/)**

    Wires, speed, addressing, full-duplex, and typical devices.

-   [![Communication Protocols Overview](../chapters/08-communication-protocols/communication-protocols-infographic.png)](communication-protocols/)

    **[Communication Protocols Overview](communication-protocols/)**

    General-purpose and specialized protocols compared.

-   [![Temperature & Distance Sensors](../chapters/09-temp-distance-sensors/temp-sensors-infographic.png)](sensors/)

    **[Temperature & Distance Sensors](sensors/)**

    DHT11/DHT22/BMP280 and HC-SR04/VL53L0X.

-   [![Motion & Light Sensors](../chapters/10-motion-light-sensors/motion-and-light-sensors-infographic.png)](motion-light-sensors/)

    **[Motion & Light Sensors](motion-light-sensors/)**

    PIR, MPU-6050, LDR photoresistor, and APDS-9960.

-   [![Motor Types Compared](../chapters/12-motors-servos-steppers/motor-comparison-infographic.png)](motor-types/)

    **[Motor Types Compared](motor-types/)**

    DC motor, servo motor, and stepper motor.

-   [![Motor Driver ICs Compared](../chapters/12-motors-servos-steppers/motor-drivers-infographic.png)](motor-drivers/)

    **[Motor Driver ICs Compared](motor-drivers/)**

    L293D, DRV8833, and TB6612FNG.

-   [![Robot Drive Configurations](../chapters/13-robots-mobile-systems/robot-drive-configurations.png)](robot-configurations/)

    **[Robot Drive Configurations](robot-configurations/)**

    Differential, 4WD, tricycle/Ackermann, mecanum, and legged.

-   [![LED Types Compared](../chapters/14-neopixels-displays/led-types-infographic.png)](led-types/)

    **[LED Types Compared](led-types/)**

    Single LED, RGB LED, NeoPixel/WS2812B, and LED Matrix.

-   [![Display Technologies Compared](../chapters/15-oled-setup/display-technologies-infographic.png)](display-technologies/)

    **[Display Technologies Compared](display-technologies/)**

    OLED (SSD1306), TFT Color LCD (ILI9341), and ePaper (SSD1680).

-   [![Sound Output Methods](../chapters/18-sound-music-audio/sound-output-infographic.png)](sound-output/)

    **[Sound Output Methods](sound-output/)**

    Passive buzzer, active buzzer, speaker+PWM, and I2S DAC+amp.

-   [![Wireless Technologies Compared](../chapters/19-wireless-iot/wireless-types-infographics.png)](wireless-technologies/)

    **[Wireless Technologies Compared](wireless-technologies/)**

    WiFi 802.11n, Bluetooth BLE 5.x, LoRa, and Zigbee.

-   [![IoT Architecture Layers](../chapters/19-wireless-iot/iot-architecture-infographic.png)](iot-architecture/)

    **[IoT Architecture Layers](iot-architecture/)**

    Perception → Network → Edge → Cloud → Application.

-   [![MicroPython Memory Types](../chapters/20-timers-multicore/memeory-types-infographic.png)](memory-types/)

    **[MicroPython Memory Types](memory-types/)**

    Internal flash, SRAM, microSD card, and I2C EEPROM.

-   [![Common MicroPython Errors](../chapters/21-file-systems-debugging/common-micropython-errors.png)](micropython-errors/)

    **[Common MicroPython Errors](micropython-errors/)**

    Eight frequent exceptions with causes and fixes.

-   [![Input Device Comparison](../chapters/06-digital-io-interrupts/input-devices-infographic.png)](input-devices/)

    **[Input Device Comparison](input-devices/)**

    Push button, potentiometer, rotary encoder, capacitive touch, keypad, and joystick.

-   [![Edge AI on Microcontrollers](../chapters/22-advanced-hardware-ai/edge-ai-software-stack.png)](edge-ai/)

    **[Edge AI on Microcontrollers](edge-ai/)**

    MicroPython + TensorFlow Lite Micro + Edge Impulse comparison.

</div>
