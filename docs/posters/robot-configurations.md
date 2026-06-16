# Robot Drive Configurations

Audience: students designing their first mobile robot chassis.
Chapter: 13 — Robots & Mobile Systems

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Robot Drive Configurations", subtitle beneath: "Five ways to build a mobile robot — each with different movement capabilities."

    Layout: a 5-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a top-down schematic diagram of the wheel/motor layout at the top. A vertical row-label strip on the far left lists the seven attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (raspberry red #C7164E): Header "Differential Drive (2WD)"; Diagram: top-down view of rectangular chassis, two large driven wheels on left and right sides, one small caster wheel at the back; arrows show both wheels moving forward for straight, right wheel faster for left turn. Rows:
    · Wheels: 2 driven wheels + 1 passive caster (or ball caster)
    · Motors needed: 2
    · Turning method: Spin one wheel faster or in reverse — skid-steer
    · Pros: Simple; only 2 motors; easy to code; low cost
    · Cons: Slides sideways on turns; no smooth arc without encoder feedback
    · Difficulty: Beginner
    · Best for: First robot projects; line following; maze solving

    Column 2 (warm orange #E07B39): Header "Four-Wheel Drive (4WD)"; Diagram: top-down view of rectangular chassis with four wheels (two per side), all four driven; arrows show same-side wheels paired. Rows:
    · Wheels: 4 driven wheels (2 per side linked together)
    · Motors needed: 2 (or 4 with individual control)
    · Turning method: Skid-steer — same as 2WD but more grip
    · Pros: Better traction on rough surfaces; stable platform
    · Cons: Same skid-turn limitation as 2WD; higher current draw
    · Difficulty: Beginner–Intermediate
    · Best for: Outdoor robots; rough terrain; heavier payloads

    Column 3 (deep purple #6A3FB5): Header "Tricycle / Ackermann"; Diagram: top-down view of chassis with two rear driven wheels and one front wheel on a pivot joint with a steering servo; curved arc shows the turning radius. Rows:
    · Wheels: 2 rear driven wheels + 1 front steered wheel
    · Motors needed: 1 DC motor (drive) + 1 servo (steer)
    · Turning method: Servo rotates front wheel — natural arc like a car
    · Pros: Smooth turning arc; realistic car-like kinematics; no skidding
    · Cons: Minimum turning radius limited; more mechanical complexity
    · Difficulty: Intermediate
    · Best for: RC-car style robots; path-following; realistic vehicle simulations

    Column 4 (teal blue #1389A6): Header "Mecanum / Holonomic"; Diagram: top-down view of square chassis with four mecanum wheels (diagonal roller lines drawn on each wheel); arrows show robot strafing sideways. Rows:
    · Wheels: 4 mecanum wheels (each has 45° rollers)
    · Motors needed: 4 (each independently controlled)
    · Turning method: Vector sum of all four wheel speeds — moves in any direction
    · Pros: Full omnidirectional motion — forward, sideways, diagonal, rotate in place
    · Cons: Expensive wheels ($20–$50/set); complex control math; 4 motor drivers
    · Difficulty: Advanced
    · Best for: Warehouse robots; competition; tight-space navigation

    Column 5 (forest green #2D8A4E): Header "Quadruped (4 Legs)"; Diagram: top-down view of a body with four legs extending outward, each leg shown with 2 segments; small circles at joints indicate servo positions. Rows:
    · Legs: 4 legs × 2 servos each = 8 servos total
    · Motors needed: 8 servo motors (minimum)
    · Turning method: Gait patterns — alternating leg sequence (trot, crawl, bound)
    · Pros: Can navigate uneven terrain, steps, grass; impressive appearance
    · Cons: Complex servo coordination; 8 PWM channels needed; high power
    · Difficulty: Advanced
    · Best for: Rough terrain; showcase/competition robots; learning about gait control

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, data rows in normal weight. Footer bar: "Wheel diagrams are schematic only — not to scale. Motor counts assume typical beginner kits." Overall: tidy vector flat-design infographic poster, five-column grid with top-down wheel-layout diagrams, suitable for a textbook or classroom screen.
