# IoT Architecture Layers

Audience: students building their first connected IoT project.
Chapter: 19 — Wireless & IoT

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational architecture diagram infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "IoT Architecture Layers", subtitle beneath: "How data flows from a sensor on your desk to a dashboard in the cloud."

    Layout: five horizontal layers stacked vertically on a light off-white background (#F7F9FC), each layer a wide rounded-corner banner with a distinct accent color. Arrows point upward between layers showing data flow direction. Each layer has a left section with the layer name and number, a center section with component icons and names, and a right section with example technology names. Generous white space, friendly textbook feel.

    Layer 1 — bottom (raspberry red #C7164E): Layer name "Layer 1 — Perception (Things)"; Icon row: small icon of a thermometer, a light sensor, a motion sensor, a motor, and an LED strip; Component types: "Sensors · Actuators · Microcontrollers"; Example technologies: "DHT22 temperature sensor · HC-SR04 distance sensor · NeoPixel LED strip · Raspberry Pi Pico W · ESP32"; Role description: "Interacts with the physical world — collects data and drives outputs"

    Layer 2 (warm orange #E07B39): Layer name "Layer 2 — Network (Connectivity)"; Icon row: WiFi symbol, Bluetooth symbol, LoRa tower, Ethernet jack; Component types: "Wireless radios · Gateways · Routers"; Example technologies: "WiFi 802.11 b/g/n · Bluetooth BLE 5.x · LoRa 915 MHz · Ethernet (wired)"; Role description: "Moves data reliably between devices and the internet"

    Layer 3 (forest green #2D8A4E): Layer name "Layer 3 — Edge Processing"; Icon row: Pico W board, small router box; Component types: "Local decision-making · Data filtering · Rapid response"; Example technologies: "Pico W running a MicroPython web server · MQTT client publishing sensor readings · Local threshold alerts (no cloud needed)"; Role description: "Processes data close to the source — low latency, works offline"

    Layer 4 (teal blue #1389A6): Layer name "Layer 4 — Cloud Platform"; Icon row: server rack, MQTT symbol, database cylinder; Component types: "MQTT brokers · Cloud IoT services · Time-series databases"; Example technologies: "Adafruit IO · HiveMQ · AWS IoT Core · Google Cloud IoT · InfluxDB · MQTT broker (Mosquitto)"; Role description: "Receives, stores, routes, and processes streams of sensor data"

    Layer 5 — top (deep purple #6A3FB5): Layer name "Layer 5 — Application (Interface)"; Icon row: browser window with chart, smartphone, bell/notification; Component types: "Dashboards · Mobile apps · Alerts"; Example technologies: "Adafruit IO dashboard · Node-RED · Grafana · Home Assistant · Email / SMS alerts"; Role description: "Where humans see data, set rules, and take action"

    Right side of poster: a vertical flow arrow labeled "Data flows UP → sensors to cloud" and a downward arrow labeled "Commands flow DOWN ← cloud to actuators"

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold layer names, smaller body text for descriptions and example technologies, monospace for technology names. Footer bar: "IoT reference architecture based on ITU-T Y.2060 (overview of the Internet of Things)." Overall: tidy vector flat-design layered architecture diagram, clear upward data-flow arrows, balanced layout, suitable for a textbook or classroom screen.
