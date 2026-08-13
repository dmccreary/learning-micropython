# General Kits for Learning MicroPython

This section review several kits for learning MicroPython.  Most of them use the Raspberry Pi Pico (RP2040 chip), the Raspberry Pi Pico 2 (which uses the more powerful RD2350) but there are some that also use the ESP32 when wireless communication is needed.

## General MicroPython Kits

### Seeed Studio

[Grove Starter Kit for Raspberry Pi Pico with Free Course](https://www.seeedstudio.com/Grove-Starter-Kit-for-Raspberry-Pi-Pico-p-4851.html) - this $40 kit has one of the highest values of any kit we surveyed.  It includes an extensive collection of no-solder Grove connectors that make it easy for classrooms that don't permit soldering.  Although it lacks a solderless breadboard, that can be easily added.  It includes 5 sensors, 5 actuators, 2 LEDs, 1 LCD display, 8 Grove connectors and 1 Grove shield.  I would strongly recommend this kit for getting started and then add a solderless breadboard and a NeoPixel strip for other projects.  Note that you must supply your own Raspberry Pi Pico ($4).

**Parts list:**

1. Grove - LED Pack
1. Grove - RGB LED (WS2813 Mini)
1. Grove - Light Sensor
1. Grove - Sound Sensor
1. Grove - Rotary Angle Sensor
1. Grove - Temperature & Humidity Sensor
1. Grove - mini PIR motion sensor
1. Grove - Passive Buzzer
1. Grove - Button	
1. Grove - Servo	
1. Grove - Mini Fan 	
1. Grove - Relay	
1. Grove - 16x2 LCD	
1. Grove Shield for Pi Pico
1. 8 Grove connectors 	

### SparkFun Inventors Kit

The SparkFun Inventor's Kit (SIK) is the "gold standard" kit for learning MicroPython.

[SparkFun Inventor's Kit for MicroPython](https://www.sparkfun.com/sparkfun-inventors-kit-for-micropython.html).  Sparkfun has
been building Inventor's Kits for many years and they are very
good at putting in good components and providing a guide.

There are a few downsides.  The biggest one that this kit is $125 US and that price does NOT include shipping.  The second is that instead of using
the low-cost Raspberry Pi Pico on a breadboard they provide you with
their own board attached to the base.  This makes it hard to use
with projects like costumes.  The last complaint is that
there is no NeoPixel strip.  This omissions seems unforgivable!

One other note.  The included USB cable is a USB-C to USB-C.  If you
don't have a USB-C cable on your computer you will need to purchase
an additional adapter.

The site also provides a web-based JupyterLite Notebook option that
prevents you from needing to use a local tool like Thonny to
write MicroPython.

### eBay Raspberry Pi Pico Kits

This $35 development kit is a good start.  It does include a small short NeoPixel strip and an LCD display.

[RP2040 Development Board Starter Kit Compatible with Raspberry Pi RPi PICO Kit](https://www.ebay.com/itm/326259984544) for $32

[Raspberry Pi Pico Starter Kit with LCD1602, SG90 Servo Motor & Tutorial Guide](https://www.ebay.com/itm/147321975349) for $39 which includes some transistors and a photo detector.

[Inland Brand (MicroCenter) 52Pi Raspberry Pi Pico Starter Kit K-0582](https://www.ebay.com/itm/117067417658) - $50 - this kit includes
a NeoPixel Ring

[GeeekPi Raspberry Pi Pico Development Kit with Display Module and Programming Resources](https://www.ebay.com/itm/318095183675) - $125 - this kit includes a NeoPixel ring and a very small OLED display.

[Raspberry Pi Pico W 2 Starter Kit | 224 Items | 119 Projects | 767pg Tutorial](https://www.ebay.com/itm/137469925392) - $112 - this has the upgraded W with a faster RP2350 processor.

### The ESP32 Kit

At the low-end of the cost spectrum is one of the ES32 development kits you can get on eBay for as low as $35.

[Basic Starter Kit for ESP32 ESP-32S Wifi I OT Development Board with Tutorial Co](https://www.ebay.com/itm/297842302584)

## Solderless Connectors

There are several types of solderless connectors used in these kits.  They connect sensors and motors to these kits without the need for soldering.  They are ideal for student labs that don't want the fire-hazards associated with soldering or where solderless breadboards and hot-glue is not flexible enough.

These are usually 3 and 4-wire connectors that support analog and digital input and output as well as I2C bus and UART communications.  They are typically designed to carry about 1 amp of current.

* [Grove Connectors](https://wiki.seeedstudio.com/Grove_System/) - popular with Seeed and Cyton kits.  See the manual [here](https://www.seeedstudio.com/document/pdf/Introduction%20to%20Grove.pdf)
* [Qwiic](https://www.sparkfun.com/qwiic) - SparkFun I2C connector
* [Stemma and Stemma QT](https://learn.adafruit.com/introducing-adafruit-stemma-qt) - Adafruit connectors are built around standard [JST PH 2mm](https://www.jst-mfg.com/product/detail_e.php?series=199) spacing connectors.

## Example Kits

The following list is not design to be an exhaustive list of all MicroPython development kits available on the market.  We focus on value-based kits that will help our students have fun learning computational thinking.

* Basic Kit - Our standard labs use a $4 Raspberry Pi Pico on a $2 solderless breadboard.  You will also need some 22-gauge wire or a jumper wire kit.
* [Maker Pi RP2040 Kit](maker-pi-rp2040/index.md) - this is a $9.90 kit from Cytron that features a single board with many features for small robots.  It is an ideal low-cost starter kit.

## Searching SparkFun

You can also use the MicroPython "tag" to search all the kits on the SparkFun site:

[https://www.sparkfun.com/categories/tags/micropython](https://www.sparkfun.com/categories/tags/micropython)

## References

Here are kits that we have seen but have not yet evaluated:

# Waveshare PicoGo Robot
PicoGo Mobile Robot is a $43 robot based on Raspberry Pi Pico.

1. SKU: 20380
2. Part Number: PicoGo-EN
3. Powered by 2x 14500 Li-ion batteries.  NOTE! We don't recommend these for classroom use since they are a fire hazard.
4. Battery protection circuit: over charge/discharge protection, over current protection, short circuit protection, reverse proof, more stable and safe operating
Recharge/Discharge circuit, allows programming/debugging concurrently while recharging
4. 5-ch infrared sensor, analog output, combined with PID algorithm, stable line tracking
Onboard multiple smart robot sensors like line tracking, obstacle avoidance, no more messy wiring
5. 1.14 inch IPS colorful LCD display, 240 x135 pixels, 65K colors
6. Integrates Bluetooth module, allows teleoperations like robot movement, RGB LED display color, buzzer, etc. by using mobile phone APP
6. N20 micro geared motors, with metal gears, low noise, high accuracy
7. NeoPixel
8. Line following sensors

[](https://www.waveshare.com/product/robotics/mobile-robots/picogo.htm?sku=20380)

## Getting Started Kits

### Vilros Getting Started Kit
[Vilros Getting Started With MicroPython on Raspberry Pi Pico Kit](https://vilros.com/products/vilros-getting-started-with-micropython-on-raspberry-pi-pico-kit)

This kit includes:

1. List price is $44.99
2. Raspberry Pi Pico with soldered headers
3. Includes printed *Vilros Get Started with MicroPython on Raspberry Pi Pico* booklet
4. USB Type-A to micro cable - 1 meter
5. 3AA battery pack with micro USB connector
6. 30 × Jumper wires
7. 12 LEDs: 3x red, 3x blue,3x yellow and 3x green
8. 5 Push-button switches
9. 10 330 Ω resistors
10. Piezoelectric buzzer
11. 2 10 kΩ potentiometers
12. HC-SR501 PIR sensor
13. I2C 1602 character LCD module
14. WS2812B LED strip
15. Clear hard plastic box for small part storage
16. Neoprene case With pocket
17. Raspberry Pi Pico pinout guide

The only problem with the parts is the lack of connectors for the potentiometers don't work well directly on the breadboard.  You will need to solder wires to use them on the breadboard.
