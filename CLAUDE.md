# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive educational repository for learning MicroPython and physical computing with microcontrollers. The project targets students aged 10-18 but is suitable for all ages. It focuses on hands-on programming with hardware like Raspberry Pi Pico, ESP32, and various sensors/actuators.

**Main documentation site**: https://dmccreary.github.io/learning-micropython/

## Development Workflow

### Documentation Site (MkDocs)
```bash
# Install dependencies 
pip install -r requirements.txt

# Serve documentation locally for development
mkdocs serve

# Build static site
mkdocs build

# Deploy to GitHub Pages
mkdocs gh-deploy
```

### MicroPython Development Tools
- **Primary IDE**: Thonny (recommended for beginners)
- **Advanced IDE**: VS Code with MicroPython extensions
- **File management**: `rshell` for copying files to/from microcontrollers
- **Serial communication**: `mpremote` for advanced device interaction

### Hardware Deployment Scripts
Located in `src/unix-scripts/`:
```bash
# Deploy driver libraries to Pico
./src/unix-scripts/load-libs.sh

# Initialize Pico setup
./src/unix-scripts/init-pico.sh

# Check USB connections
./src/unix-scripts/check-usb.sh
```

## Architecture and Code Organization

### Documentation Structure (`docs/`)
- **9 progressive learning sections**: Introduction → Getting Started → Basic Examples → Sensors → Motors → Displays → Sound → Wireless → Advanced Labs
- **Educational kits**: Pre-configured projects in `docs/kits/`
- **Debugging guides**: Comprehensive troubleshooting in `docs/debugging/`
- **AI prompts**: Concept explanation prompts in `docs/prompts/`

### Source Code Structure (`src/`)

#### **Hardware Drivers** (`src/drivers/`)
Reusable MicroPython libraries:
- Display drivers: `ssd1306.py`, `sh1106.py`, `lcd_api.py`
- Sensor drivers: `VL53L0X.py` (time-of-flight), `hmc5883l.py` (compass), `APDS9960.py` (gesture)
- Utility modules: `rotary.py`, `max7219.py`

#### **Organized by Hardware Type**
- `src/sensors/`: Sensor integration examples
- `src/displays/`: Display driver tests and demos
- `src/motors/`: Motor control implementations
- `src/neopixels/`: LED strip pattern generators
- `src/network/`: WiFi, web server, IoT examples
- `src/sound/`: Audio generation and playback
- `src/robots/`: Complete robot implementations

#### **Educational Kits** (`src/kits/`)
Complete projects for popular educational hardware:
- **Maker Pi RP2040**: Full robot development platform
- **NeoPixel projects**: LED programming kits
- **Spectrum Analyzer**: Audio visualization

### Key Hardware Platforms

#### **Primary Microcontrollers**
- **Raspberry Pi Pico/Pico W**: Main development platform ($4, 264KB RAM)
- **ESP32**: WiFi-enabled alternative
- **Cytron Maker Pi RP2040**: Integrated educational board ($11)

#### **Supported Hardware Categories**
- **Sensors**: Temperature (DHT11, BME280), distance (HC-SR04, VL53L0X), light, gesture (APDS9960), compass
- **Displays**: OLED (SSD1306, SH1106), LCD, LED matrices, 7-segment
- **Motors**: DC motors, servos, steppers with L293D/DRV8833 drivers  
- **Audio**: Buzzers, speakers, I2S audio devices
- **LEDs**: NeoPixel strips, matrices, individual LEDs

## Common Development Patterns

### Standard MicroPython Project Structure
```python
# Typical sensor reading pattern
from machine import Pin, I2C
import time

# Initialize hardware
i2c = I2C(0, scl=Pin(1), sda=Pin(0))
sensor = SensorClass(i2c)

# Main loop
while True:
    value = sensor.read()
    print(f"Sensor: {value}")
    time.sleep(1)
```

### Display Integration Pattern
```python
# OLED display setup (common across projects)
from machine import Pin, I2C
from ssd1306 import SSD1306_I2C

i2c = I2C(0, scl=Pin(1), sda=Pin(0))
oled = SSD1306_I2C(128, 64, i2c)

oled.text("Hello", 0, 0)
oled.show()
```

### Hardware Abstraction
- All projects use consistent pin assignments
- Driver libraries provide hardware abstraction
- Examples include both I2C and SPI variants where applicable

## Testing and Validation

- **No centralized test framework**: Each component has individual test scripts
- **Hardware-in-the-loop testing**: All examples designed for real hardware
- **Progressive complexity**: Examples build from simple to complex implementations

## Educational Features

### Learning Progression
1. **Basics**: LED blink, button input, potentiometer reading
2. **Intermediate**: Sensor integration, display output, motor control
3. **Advanced**: Wireless communication, multi-sensor robots, real-time audio processing

### Code Documentation Standards
- Extensive inline comments explaining hardware concepts
- Circuit connection diagrams in markdown
- Step-by-step wiring instructions
- Troubleshooting sections for common issues

## Development Dependencies

Key tools from `requirements.txt`:
- `rshell==0.0.30`: File management for MicroPython devices
- `pyserial==3.5`: Serial communication
- `numpy==1.24.2`: Data analysis and visualization
- `plotly==5.13.0`: Interactive plotting for sensor data

## Contributing Guidelines

- All hardware examples must include wiring diagrams
- Code should be extensively commented for educational purposes
- Examples should progress from simple to complex
- Include troubleshooting sections for common hardware issues
- Test on actual hardware before committing