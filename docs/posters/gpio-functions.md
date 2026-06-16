# GPIO Pin Functions on the Raspberry Pi Pico

Audience: students learning what each GPIO pin can do on the RP2040.
Chapter: 6 — Digital I/O & Interrupts

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "All 26" or a specific pin list, render it exactly.

    A clean, modern, flat-design educational reference infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "GPIO Functions on the Raspberry Pi Pico (RP2040)", subtitle beneath: "Every GPIO pin can do more than just on/off."

    Layout: a 7-row function table plus a pinout diagram on a light off-white background (#F7F9FC). The left side (60%) holds the comparison table; the right side (40%) shows a simplified top-down outline of the Pico board with pins labeled.

    LEFT TABLE — seven rows, each with an accent-color left-edge bar. Columns: Function · Available Pins · MicroPython Class · Max Speed / Resolution · Typical Devices / Uses. Rows:

    Row 1 (raspberry red #C7164E): Function "Digital Output"; Available Pins "All 26 GPIO (GP0–GP28)"; MicroPython Class "Pin(n, Pin.OUT)"; Max Speed/Resolution "3.3 V logic, up to ~80 MHz toggle via PIO"; Typical Uses "LEDs, relays, H-bridge direction signals"

    Row 2 (magenta pink #E5398A): Function "Digital Input"; Available Pins "All 26 GPIO (GP0–GP28)"; MicroPython Class "Pin(n, Pin.IN, Pin.PULL_UP)"; Max Speed/Resolution "3.3 V logic; internal 50 kΩ pull-up or pull-down"; Typical Uses "Buttons, switches, encoder signals, digital sensors"

    Row 3 (deep purple #6A3FB5): Function "PWM (Pulse Width Modulation)"; Available Pins "All 26 GPIO (8 slices × 2 channels = 16 unique channels)"; MicroPython Class "PWM(pin)"; Max Speed/Resolution "Frequency: 8 Hz–62.5 MHz; duty: 16-bit (0–65535)"; Typical Uses "LED brightness, servo control, motor speed, buzzer tones"

    Row 4 (teal blue #1389A6): Function "ADC (Analog-to-Digital)"; Available Pins "GP26, GP27, GP28 (+ internal temp sensor on ADC4)"; MicroPython Class "ADC(pin)"; Max Speed/Resolution "12-bit SAR ADC; 0–3.3 V range; ~500 kSps"; Typical Uses "Potentiometers, light sensors (LDR), microphone, temperature"

    Row 5 (forest green #2D8A4E): Function "I2C (Inter-Integrated Circuit)"; Available Pins "Any 2 GPIO; hardware blocks I2C0 and I2C1"; MicroPython Class "I2C(id, scl=Pin(x), sda=Pin(y))"; Max Speed/Resolution "100 kbps (standard) · 400 kbps (fast) · 1 Mbps (fast+)"; Typical Uses "OLED displays, BMP280, MPU-6050, RTC modules"

    Row 6 (warm orange #E07B39): Function "SPI (Serial Peripheral Interface)"; Available Pins "Any 4 GPIO; hardware blocks SPI0 and SPI1"; MicroPython Class "SPI(id, baudrate, sck, mosi, miso)"; Max Speed/Resolution "Up to 62.5 MHz (full-duplex)"; Typical Uses "SD cards, TFT color displays, ADC chips, NOR flash"

    Row 7 (dark slate header #2A2E3A with white text): Function "UART (Universal Async Receiver-Transmitter)"; Available Pins "Any 2 GPIO; hardware blocks UART0 and UART1"; MicroPython Class "UART(id, baudrate)"; Max Speed/Resolution "Up to 921,600 baud (configurable)"; Typical Uses "GPS modules, HC-05 Bluetooth, serial monitor/REPL"

    RIGHT DIAGRAM — simplified Pico top-down outline (green PCB, 40-pin DIP form factor). Label the 4 corners: top-left "GP0/UART0 TX", top-right "VBUS 5V", bottom-left "GND", bottom-right "GP28 ADC2". Mark the three ADC pins (GP26, GP27, GP28) with a teal dot. Add a small legend: red dot = all pins support Digital I/O + PWM; teal dot = also ADC.

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold row function names, monospace font for MicroPython class names, smaller data text. Footer bar: "Specifications: RP2040 Datasheet, Raspberry Pi Ltd, 2021 · Pico Pinout: datasheets.raspberrypi.com." Overall: tidy vector flat-design reference poster, balanced table+diagram layout, suitable for a classroom wall or textbook quick-reference page.
