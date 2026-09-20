---
title: Temperature Sensors v2
description: An interactive comparison of the DHT11, DHT22, BME280, DS18B20, and SHT40 temperature sensors, with pinouts, accuracy, interfaces, and a built-in quiz.
image: /posters/temperature-sensors-v2/temperature-sensors-v2-infographic.png
og:image: /posters/temperature-sensors-v2/temperature-sensors-v2-infographic.png
twitter:image: /posters/temperature-sensors-v2/temperature-sensors-v2-infographic.png
social:
   cards: false
hide:
    toc
---

Audience: students measuring temperature and humidity in their MicroPython projects.
Chapter: 09 — Temperature & Distance Sensors

<iframe src="main.html" width="100%" height="1180" scrolling="no"></iframe>

## About This Infographic

A four-column comparison of the temperature sensors used in this course. It
adds the high-accuracy I2C **SHT40** to the single-wire **DHT11/DHT22**, the
I2C **BME280** (which also reads humidity and pressure), and the waterproof
1-Wire **DS18B20** probe. Each column shows pinouts, key specifications, and
guidance on when to use that sensor. Click each column to see its facts, then
use **Quiz Me** to test which sensor fits a given job.

The SHT40 column uses a real photo of the purple breakout board from the
[SHT40 lab](../../kits/sht40-temp/index.md). The original three-column poster
is still available as [Temperature Sensors](../temperature-sensors/index.md).

## Which Sensor Should I Pick?

| Sensor | Measures | Interface | Temperature accuracy | Typical price | Choose it when |
|--------|----------|-----------|----------------------|---------------|----------------|
| DHT11 | Temperature, humidity | Single-wire | ±2 °C | $1–$2 | You want the simplest, cheapest indoor sensor |
| DHT22 | Temperature, humidity | Single-wire | ±0.5 °C | $2–$4 | You want a better DHT with a wider range |
| BME280 | Temperature, humidity, pressure | I2C | ±1 °C | $2–$4 | You are building a weather station |
| DS18B20 | Temperature only | 1-Wire | ±0.5 °C | $1.50–$3 | You need waterproof sensing or many probes on one wire |
| SHT40 | Temperature, humidity | I2C | ±0.2 °C | $1.65 | You want the most accurate readings |

Prices are typical eBay prices for one module, before shipping. They change
from seller to seller.

## Good Sensors Can Also Be Inexpensive

A sensor does not have to cost a lot to be good. The SHT40 is the most
accurate sensor on this poster, and it is also one of the cheapest.

I bought several SHT40 boards on eBay for US $1.65 each, plus US $1.30 for
eBay SpeedPAK Standard shipping from Shenzhen, China. They arrived in about a
week. The same board costs about $7 from Adafruit, which ships faster but
costs about four times as much.

Cheap boards are sometimes labeled wrong. When yours arrives, run the I2C
scanner in the [SHT40 lab](../../kits/sht40-temp/index.md) to check what you
really received.

## How This Poster Was Made

Unlike most posters in this section, this image is not drawn by an AI image
tool. It is an HTML page rendered by headless Chrome, so the text is exact and
the SHT40 column can use a real photo.

- Poster source: `src/posters/temperature-sensors-v2/poster.html`
- Build script: `src/posters/temperature-sensors-v2/build.py`

To change the text, edit `poster.html` and run the build script. The script
redraws the image and moves the click zones to match, so you do not need to
calibrate them with `?edit=true`.

```sh
python3 src/posters/temperature-sensors-v2/build.py
```
