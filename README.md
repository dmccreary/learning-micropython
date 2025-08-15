# Learning MicroPython

**📖 Comprehensive educational resources for teaching and learning MicroPython and physical computing**

🌐 **[View Documentation Website →](https://dmccreary.github.io/learning-micropython/)**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?logo=github)](https://dmccreary.github.io/learning-micropython/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![MicroPython](https://img.shields.io/badge/MicroPython-Supported-blue?logo=python)](https://micropython.org/)
[![GitHub stars](https://img.shields.io/github/stars/dmccreary/learning-micropython?style=social)](https://github.com/dmccreary/learning-micropython/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/dmccreary/learning-micropython?style=social)](https://github.com/dmccreary/learning-micropython/network/members)

## 🎯 About

This book contains **comprehensive educational resources** for learning MicroPython and physical computing with microcontrollers. Designed for students aged 10-18 but suitable for all ages, it provides hands-on programming experiences with real hardware including the Raspberry Pi Pico, the Raspberry Pi Pico W (wireless), the ESP32, sensors, displays, motors, and more.

### 🏆 What Makes This Special

- **📚 Progressive Learning Path**: 9 structured sections from basics to advanced robotics
- **🔧 Hardware-First Approach**: All examples tested on real microcontrollers
- **🎓 Educational Focus**: Extensively documented with troubleshooting guides
- **🤖 AI-Enhanced Learning**: Integrated AI prompts for concept explanation
- **🌍 Open Source**: Free educational resources under Creative Commons license

## 🚀 Quick Start

### For Students & Beginners

1. **Visit the documentation**: [dmccreary.github.io/learning-micropython](https://dmccreary.github.io/learning-micropython/)
2. **Get hardware**: Raspberry Pi Pico ($4) + breadboard + sensors
3. **Install Thonny IDE**: Free Python development environment
4. **Start with basics**: LED blink, buttons, sensors
5. **Build progressively**: Work through sensors, displays, motors, robots

### For Educators & Contributors

```bash
# Clone the repository
git clone https://github.com/dmccreary/learning-micropython.git
cd learning-micropython

# Install dependencies
pip install -r requirements.txt

# Serve documentation locally
mkdocs serve

# Deploy hardware examples using rshell
./src/unix-scripts/load-libs.sh
```

## 📖 Learning Sections

| Section | Topics | Hardware |
|---------|--------|----------|
| **🔰 Introduction** | Physical computing, microcontroller basics | - |
| **🛠️ Getting Started** | Board setup, IDE configuration, breadboards | Pico, ESP32 |
| **⚡ Basic Examples** | Blink, buttons, potentiometers, PWM | LEDs, switches, motors |
| **🔍 Sensors** | Temperature, distance, light, gesture, compass | DHT11, HC-SR04, APDS9960 |
| **🔧 Motors & Servos** | DC motors, H-bridges, stepper motors, servos | L293D, DRV8833, SG90 |
| **📺 Displays** | OLED, LCD, LED matrices, 7-segment | SSD1306, SH1106, MAX7219 |
| **🔊 Sound & Music** | Audio generation, music playback, I2S | Buzzers, speakers, DAC |
| **📡 Wireless** | WiFi connectivity, web servers, IoT | ESP32, Pico W |
| **🚀 Advanced Labs** | Interrupts, multi-core, memory, debugging | - |

## 🛠️ Supported Hardware

### 🎯 Primary Microcontrollers
- **Raspberry Pi Pico/Pico W** ($4, 264KB RAM)
- **ESP32** (WiFi-enabled alternative)
- **Cytron Maker Pi RP2040** ($11, educational board)

### 📦 Compatible Sensors & Components
- **Sensors**: Temperature, humidity, distance, light, gesture, compass
- **Displays**: OLED (I2C/SPI), LCD, LED matrices, 7-segment
- **Motors**: DC motors, servos, steppers with various drivers
- **Audio**: Buzzers, speakers, I2S audio devices
- **LEDs**: NeoPixel strips, matrices, individual LEDs

## 🗂️ Repository Structure

```
learning-micropython/
├── docs/                    # MkDocs documentation source
│   ├── basics/             # Basic programming examples
│   ├── sensors/            # Sensor integration guides  
│   ├── displays/           # Display programming
│   ├── motors/             # Motor control
│   ├── sound/              # Audio and music
│   ├── wireless/           # Network programming
│   └── advanced-labs/      # Advanced topics
├── src/                    # MicroPython source code
│   ├── drivers/            # Hardware driver libraries
│   ├── sensors/            # Sensor example code
│   ├── displays/           # Display demos
│   ├── motors/             # Motor control examples
│   ├── neopixels/          # LED pattern generators
│   ├── sound/              # Audio examples
│   └── kits/               # Educational kit projects
└── requirements.txt        # Development dependencies
```

## 🎓 Educational Kits & Projects

- **🤖 Maker Pi RP2040 Robot**: Complete robot development platform
- **🌈 NeoPixel Projects**: LED programming and pattern generation
- **🎵 Spectrum Analyzer**: Real-time audio visualization
- **📻 RFID Access Control**: Security system projects
- **🎮 Game Projects**: OLED-based games like Pong

## 🧑‍💻 Development

### Documentation (MkDocs)
```bash
# Serve locally for development
mkdocs serve

# Build static site
mkdocs build

# Deploy to GitHub Pages
mkdocs gh-deploy
```

### Hardware Development
```bash
# Copy driver libraries to Pico
rshell -p /dev/ttyACM0 cp src/drivers/*.py /pico/lib/

# Interactive shell with Pico
rshell -p /dev/ttyACM0

# Alternative: Use mpremote
mpremote connect /dev/ttyACM0 fs ls
```

## 🤝 Contributing

We welcome contributions! This project serves students and educators worldwide.

1. **Fork the repository**
2. **Create a feature branch**
3. **Add educational content** (include wiring diagrams and comments)
4. **Test on real hardware**
5. **Submit a pull request**

### 📝 Contribution Guidelines
- All hardware examples must include circuit diagrams
- Code should be extensively commented for educational purposes
- Include troubleshooting sections for common issues
- Progress from simple to complex examples
- Test on actual hardware before submitting

## 📜 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License**.

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**You are free to:**
- ✅ **Share** — copy and redistribute the material
- ✅ **Adapt** — remix, transform, and build upon the material

**Under these terms:**
- 🏷️ **Attribution** — Give appropriate credit and link to license
- 🚫 **NonCommercial** — Not for commercial use
- 🔄 **ShareAlike** — Distribute contributions under same license

[Full license details →](docs/license.md)

## 🙏 Acknowledgements

This project builds upon the incredible work of the open source community. We gratefully acknowledge:

### 🔧 Core Technologies
- **[MicroPython](https://micropython.org/)** - Python for microcontrollers
- **[MkDocs](https://www.mkdocs.org/)** - Documentation site generator
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** - Documentation theme

### 📦 Python Libraries
- **[rshell](https://github.com/dhylands/rshell)** - MicroPython remote shell
- **[pyserial](https://github.com/pyserial/pyserial)** - Serial communication
- **[numpy](https://numpy.org/)** - Numerical computing
- **[plotly](https://plotly.com/)** - Interactive visualization

### 🔌 Hardware Drivers & Libraries
- **[SSD1306 OLED Driver](https://github.com/micropython/micropython/tree/master/drivers/display)** - OLED display support
- **[VL53L0X Time-of-Flight](https://github.com/kevinmcaleer/VL53L0X)** - Distance sensor
- **[APDS9960 Gesture Sensor](https://github.com/rlangoy/uPy_APDS9960)** - Gesture detection
- **[HMC5883L Compass](https://github.com/gvalkov/micropython-esp8266-hmc5883l)** - Magnetic compass
- **[I2S Audio Examples](https://github.com/miketeachman/micropython-i2s-examples)** - Audio processing
- **[NeoPixel Libraries](https://github.com/adafruit/Adafruit_NeoPixel)** - LED strip control

### 📊 Visualization & Web
- **[vis-network](https://visjs.org/)** - Interactive network graphs
- **[PyMdown Extensions](https://facelessuser.github.io/pymdown-extensions/)** - Enhanced markdown

### 👥 Special Thanks

- **[Jim Tannenbaum](https://www.linkedin.com/in/jetannenbaum/)** - BIPES block programming integration
- **[Valerie Lockhart](https://www.linkedin.com/in/valockhart/)** - MicroSims inspiration and support  
- **[Carl Boudreau](https://www.linkedin.com/in/graphy-giraffe/)** - Rural education outreach
- **[Arun Batchu](https://www.linkedin.com/in/arunbatchu/)** - AI integration guidance

[Full acknowledgements →](docs/misc/acknowledgements.md)

## 📞 Contact & Support

- **📧 Author**: [Dan McCreary](https://www.linkedin.com/in/danmccreary/)
- **🐛 Issues**: [GitHub Issues](https://github.com/dmccreary/learning-micropython/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/dmccreary/learning-micropython/discussions)
- **📚 Documentation**: [learning-micropython.com](https://dmccreary.github.io/learning-micropython/)

## ⭐ Show Your Support

If this project helps you teach or learn MicroPython, please consider:

- ⭐ **Starring this repository**
- 🍴 **Forking and contributing**
- 📢 **Sharing with educators and students**
- 💡 **Submitting new project ideas**

---

**🎯 Mission**: Making physical computing and robotics accessible to students and educators worldwide through comprehensive, hands-on MicroPython education.

[![Built with ❤️](https://img.shields.io/badge/Built%20with-%E2%9D%A4%EF%B8%8F-red)](#)