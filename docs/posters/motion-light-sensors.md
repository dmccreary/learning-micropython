# Motion and Light Sensors

Audience: students adding environmental awareness to their MicroPython projects.
Chapter: 10 — Motion & Light Sensors

![Motion and Light Sensors Comparison Infographic](../chapters/10-motion-light-sensors/motion-and-light-sensors-infographic.png)

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic for "Motion and Light Sensors".

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Motion & Light Sensors Compared", subtitle beneath: "Four sensors that let your project sense the world around it."

    Layout: a four-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a small top-view illustration of the module. A vertical row-label strip on the far left lists the nine attributes. Generous white space, friendly textbook feel.

    Column 1 (raspberry red #C7164E): Header "PIR Motion Sensor"; Module name "HC-SR501"; Illustration: white dome on a green PCB with two yellow potentiometers. Rows:
    · Sensing principle: Passive infrared — detects heat from warm bodies (humans, animals)
    · Interface: Digital output — HIGH when motion detected, LOW otherwise
    · Power supply: 5 V–12 V (signal output is 3.3 V safe)
    · Detection range: Up to 7 m; ~110° cone angle
    · Response time: 0.3 s minimum delay between triggers
    · Adjustable: Sensitivity potentiometer + time-delay potentiometer on board
    · MicroPython: Pin(n, Pin.IN) → read 0 or 1
    · Typical cost: $1–$3
    · Best for: Intruder alarm, automatic light, people counter

    Column 2 (deep purple #6A3FB5): Header "Accelerometer + Gyroscope"; Module name "MPU-6050 (IMU)"; Illustration: small rectangular blue PCB with a tiny MEMS chip labeled MPU-6050 and 8 header pins. Rows:
    · Sensing principle: MEMS — measures acceleration (g) and angular rate (°/s) on 3 axes each
    · Interface: I2C (address 0x68 default; 0x69 if AD0 pin pulled HIGH)
    · Power supply: 3.3 V or 5 V (on-board voltage regulator)
    · Measurement range: Accel ±2/4/8/16 g; Gyro ±250/500/1000/2000 °/s (configurable)
    · Axes: 6 DOF — X, Y, Z acceleration + X, Y, Z rotation rate
    · Response time: Up to 1 kHz sample rate (default 100 Hz in MicroPython use)
    · MicroPython: i2c.readfrom_mem(0x68, 0x3B, 14) — read 14 bytes raw data
    · Typical cost: $1–$4
    · Best for: Tilt detection, step counter, robot balance, shake detection

    Column 3 (forest green #2D8A4E): Header "Light Sensor (LDR)"; Module name "Photoresistor + voltage divider"; Illustration: small disc-shaped component with squiggly lines on surface (light symbol), two leads, sitting in a voltage-divider circuit sketch. Rows:
    · Sensing principle: Photoresistance — resistance drops as light intensity increases
    · Interface: Analog output — connect middle of voltage divider to ADC pin
    · Power supply: 3.3 V (one end to 3.3 V, other end to GND through 10 kΩ resistor)
    · Measurement range: ~100 Ω (bright light) to ~10 MΩ (darkness)
    · Axes: N/A — single analog value
    · Response time: ~10 ms (not suitable for fast light changes)
    · MicroPython: ADC(26).read_u16() → returns 0–65535
    · Typical cost: $0.10–$0.50
    · Best for: Day/night detection, automatic brightness, plant light monitor

    Column 4 (teal blue #1389A6): Header "Color, Proximity & Gesture"; Module name "APDS-9960"; Illustration: small rectangular PCB with a flat black APDS-9960 sensor IC and 6 header pins. Rows:
    · Sensing principle: Ambient light (RGBC), proximity (IR), and gesture direction detection
    · Interface: I2C (address 0x39 fixed)
    · Power supply: 3.3 V only (not 5 V tolerant — use level shifter if needed)
    · Measurement range: RGB+Clear: 16-bit per channel; Proximity: 0–255; Gesture: Up/Down/Left/Right/Near/Far
    · Axes: 4-directional gesture (requires IR photodiodes in 4-corner array)
    · Response time: Gesture: ~100 ms; Proximity/light: configurable integration time
    · MicroPython: Uses apds9960.py library; gesture = sensor.gesture()
    · Typical cost: $5–$12
    · Best for: Touchless gesture control, proximity alarm, color sorting robot

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, monospace for MicroPython snippets, numbers bold. Footer bar: "Sources: InvenSense MPU-6060 datasheet · Avago APDS-9960 datasheet · HC-SR501 datasheet." Overall: tidy vector flat-design infographic poster, four-column grid with module illustrations, suitable for a textbook or classroom screen.
