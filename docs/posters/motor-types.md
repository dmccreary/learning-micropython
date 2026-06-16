# Motor Types Compared

Audience: students selecting motors for robotics and automation projects.
Chapter: 12 — Motors, Servos & Steppers

![](../chapters/12-motors-servos-steppers/motor-comparison-infographic.png)

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Motor Types Compared", subtitle beneath: "DC Motor · Servo Motor · Stepper Motor — which motor fits your project?"

    Layout: a three-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a clean mechanical illustration of the motor at the top of the column. A vertical row-label strip on the far left lists the ten attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (raspberry red #C7164E): Header "DC Motor"; Illustration: small cylindrical brushed DC motor with two wire leads (red and black) and a protruding shaft; simple side-view drawing. Rows:
    · Operating principle: Electromagnetic — current through brushes rotates armature
    · Control method: H-bridge for direction; PWM duty cycle for speed
    · Position control: None — spins freely; encoder needed for position feedback
    · Rotation: Continuous 360° in either direction
    · Typical speed: 100–30,000 RPM (depends on voltage and load)
    · Typical torque: Low–medium (varies widely by size)
    · Operating voltage: 3 V–12 V DC
    · Typical cost: $1–$5
    · MicroPython: Two GPIO pins (direction) + one PWM pin via motor-driver IC
    · Best for: Robot wheels, fans, propellers, any continuous rotation task

    Column 2 (deep purple #6A3FB5): Header "Servo Motor"; Illustration: rectangular plastic servo body (e.g., SG90) with a white plastic control horn on top and three-wire lead (orange signal, red power, brown GND); simple isometric view. Rows:
    · Operating principle: DC motor + gear reduction + potentiometer position feedback
    · Control method: PWM pulse width — 1 ms = 0°; 1.5 ms = 90°; 2 ms = 180°; at 50 Hz
    · Position control: Yes — holds target angle; ±1° precision typical
    · Rotation: 0°–180° (standard); 360° continuous rotation servos also available
    · Typical speed: ~60°/0.1 s (SG90 at 4.8 V, no load)
    · Typical torque: 1.8 kg·cm (SG90) to 15 kg·cm (MG996R)
    · Operating voltage: 4.8 V–6 V
    · Typical cost: $2–$10 (SG90 ~$2; metal-gear $5–$10)
    · MicroPython: One PWM pin — pwm.duty_u16() maps 0° → ~2000, 180° → ~8000
    · Best for: Robot arm joints, camera pan/tilt, RC steering, door latch

    Column 3 (teal blue #1389A6): Header "Stepper Motor"; Illustration: NEMA 17 square motor body with four colored wire leads (A+, A−, B+, B−) and protruding shaft; simple front-view sketch. Rows:
    · Operating principle: Electromagnetic coils energized in sequence to rotate shaft in precise steps
    · Control method: Step-and-direction pulses sent to driver IC (e.g., A4988, DRV8825)
    · Position control: Yes — each step is a fixed angle; no encoder needed (open-loop)
    · Rotation: Continuous; standard step = 1.8° (200 steps per revolution)
    · Typical speed: 1–1,000 steps/s; torque drops above ~600 steps/s
    · Typical torque: High and held at rest (2.0 kg·cm NEMA 14 to 40 kg·cm NEMA 23)
    · Operating voltage: 4 V–12 V (bipolar, coil-rated)
    · Typical cost: $3–$15 (+ $2–$5 driver board)
    · MicroPython: Two GPIO pins (STEP, DIR) + driver IC; step by toggling STEP pin
    · Best for: 3D printers, CNC machines, camera sliders, precision positioning

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, numbers bold, monospace for MicroPython notes. Footer bar: "Specifications: SG90 servo datasheet (Tower Pro) · NEMA 17 datasheet · general brushed DC motor specifications." Overall: tidy vector flat-design infographic poster, three-column grid with motor illustrations, suitable for a textbook or classroom screen.
