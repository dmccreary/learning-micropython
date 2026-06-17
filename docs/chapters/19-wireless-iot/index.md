---
title: Wireless Connectivity and Internet of Things
description: Pico W Wi-Fi connection, HTTP GET requests, JSON parsing, web server on socket, NTP time sync, weather API integration, web-controlled NeoPixels, and MQTT IoT basics.
generated_by: claude skill chapter-content-generator
date: 2026-06-13 00:40:00
version: 0.09
---

# Wireless Connectivity and Internet of Things

## Summary

The Raspberry Pi Pico W and ESP32 can connect to Wi-Fi, turning your projects into Internet of Things devices that fetch live data and serve web pages. This chapter walks through connecting to a Wi-Fi network, making HTTP GET requests to APIs, parsing JSON responses, and building a simple web server that lets you control hardware from a browser. You will build a weather station that displays the forecast, a Wi-Fi clock that sets itself automatically using NTP time servers, and a web-controlled NeoPixel display — all running on your microcontroller.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Wi-Fi Basics
2. SSID and Password
3. network Module
4. network.WLAN Class
5. WLAN.connect() Method
6. WLAN.isconnected() Method
7. IP Address
8. MAC Address
9. HTTP Protocol
10. HTTP GET Request
11. urequests Module
12. JSON Parsing
13. ujson Module
14. Web Server on Pico W
15. socket Module
16. socket.socket() Class
17. TCP vs UDP
18. REST API Basics
19. Weather API Integration
20. NTP Time Sync
21. WiFi Clock Project
22. Web Server NeoPixel Control
23. upip Package Manager
24. Over-the-Air Update Concept

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Microcontrollers and Hardware Platforms](../04-microcontrollers-hardware/index.md)

---

!!! mascot-welcome "Welcome to Chapter 19"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your Pico W has a Wi-Fi radio built in — and that means the entire internet is one import away. Today you will fetch real weather data, sync the time from a global server, and let anyone on your local network control your NeoPixels from a browser. The Internet of Things starts here!

<iframe src="../../posters/iot-architecture/main.html" width="100%" height="800" scrolling="no"></iframe>

## Wi-Fi Basics

**Wi-Fi** is a wireless networking standard that lets devices communicate over radio waves. Two key pieces of information connect your Pico W to a network:

- **SSID** (Service Set Identifier) — the name of the Wi-Fi network (what you see in the list of available networks on your phone).
- **Password** — the WPA2 passphrase for the network.

Each device on a Wi-Fi network has an **IP address** — a four-part number like `192.168.1.42` that uniquely identifies it on the local network. The Pico W gets its IP address automatically from the router via DHCP.

Each device also has a **MAC address** — a fixed, hardware-assigned 6-byte identifier like `28:CD:C1:00:AB:CD`. The MAC address is permanent and used at the network hardware level.

## Connecting to Wi-Fi

MicroPython for the Pico W includes the **`network` module**. The **`network.WLAN` class** represents the wireless interface.

```python
import network
import utime

SSID     = "MyNetwork"
PASSWORD = "mypassword"

wlan = network.WLAN(network.STA_IF)   # station mode (connect to existing network)
wlan.active(True)
wlan.connect(SSID, PASSWORD)

# Wait for connection (poll every 500 ms)
while not wlan.isconnected():
    print("Connecting...")
    utime.sleep(0.5)

print("Connected!")
print("IP:", wlan.ifconfig()[0])   # e.g., "192.168.1.42"
```

Key steps:
1. `WLAN(network.STA_IF)` — select station mode (connecting to an existing network, not creating one).
2. `wlan.active(True)` — power on the Wi-Fi radio.
3. `wlan.connect(SSID, PASSWORD)` — begin the connection attempt.
4. `wlan.isconnected()` — returns `True` when a successful connection and IP address have been obtained.

!!! mascot-warning "Store Credentials Safely"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never hardcode Wi-Fi passwords in code that you share with others. Instead, put your credentials in a separate `secrets.py` file on the Pico, add that file to `.gitignore`, and import it: `from secrets import SSID, PASSWORD`. This prevents accidental password exposure when you share your project code.

## Making HTTP Requests

**HTTP** (HyperText Transfer Protocol) is the language of the web. When you type a URL into a browser, it sends an **HTTP GET request** to a server, which responds with the page content.

Your Pico W can make the same requests. The **`urequests` module** (a MicroPython-compatible version of the popular `requests` library) makes this simple:

```python
import urequests

response = urequests.get("http://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current_weather=true")
print(response.status_code)   # 200 = success
print(response.text)           # raw JSON string
response.close()               # always close to free memory
```

## JSON Parsing

Most web APIs return data in **JSON** (JavaScript Object Notation) format — a human-readable text format that represents data as nested dictionaries and lists.

The **`ujson` module** parses a JSON string into a Python dictionary:

```python
import urequests, ujson

url = "http://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current_weather=true"
response = urequests.get(url)
data = ujson.loads(response.text)   # parse JSON string to dict
response.close()

temp   = data["current_weather"]["temperature"]
wind   = data["current_weather"]["windspeed"]
print(f"Temp: {temp}°C  Wind: {wind} km/h")
```

**REST API basics**: Most modern web services provide a REST API — a set of URLs that you GET, POST, or DELETE to retrieve or update data. You form the URL with query parameters (like `?latitude=40.71`) and parse the JSON response.

## NTP Time Sync — WiFi Clock Project

An **NTP** (Network Time Protocol) server provides the current time to any device that asks. The Pico W can query an NTP server and set its internal clock automatically — no need for a separate RTC chip.

```python
import ntptime
import utime

# After connecting to Wi-Fi:
ntptime.settime()   # fetches UTC time from pool.ntp.org and sets RTC

t = utime.localtime()   # returns (year, month, day, hour, min, sec, weekday, yearday)
print(f"{t[0]}-{t[1]:02d}-{t[2]:02d}  {t[3]:02d}:{t[4]:02d}:{t[5]:02d} UTC")
```

The **WiFi clock project** extends this by displaying the current time on an OLED or LCD:

```python
while True:
    t = utime.localtime()
    time_str = f"{t[3]:02d}:{t[4]:02d}:{t[5]:02d}"
    date_str = f"{t[0]}-{t[1]:02d}-{t[2]:02d}"
    oled.fill(0)
    oled.text(time_str, 32, 20)
    oled.text(date_str, 20, 36)
    oled.show()
    utime.sleep(1)
```

## Building a Web Server on the Pico W

The Pico W can also act as a **web server** — serving HTML pages that other devices on the local network can visit. This lets you build a browser-based control panel for your project.

Web servers use **sockets** — the low-level networking interface. Before looking at the code, here are three concepts to understand:

- **TCP** (Transmission Control Protocol): guarantees delivery of data in order. Used for web pages.
- **UDP** (User Datagram Protocol): sends packets without guaranteed delivery. Used for real-time data like video streaming.
- **socket.socket()**: a Python object representing a network connection endpoint.

A minimal web server:

```python
import socket

addr = socket.getaddrinfo("0.0.0.0", 80)[0][-1]  # listen on all interfaces, port 80
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(addr)
s.listen(1)

print("Listening at:", wlan.ifconfig()[0])

while True:
    conn, addr = s.accept()      # wait for a browser to connect
    request = conn.recv(1024)    # read the HTTP request
    
    html = """<!DOCTYPE html>
<html><body>
<h1>Pico W Web Server</h1>
<p><a href="/led/on">LED ON</a></p>
<p><a href="/led/off">LED OFF</a></p>
</body></html>"""
    
    conn.send("HTTP/1.0 200 OK\r\nContent-type: text/html\r\n\r\n")
    conn.send(html)
    conn.close()
    
    if "/led/on" in str(request):
        led.value(1)
    elif "/led/off" in str(request):
        led.value(0)
```

## Web Server NeoPixel Control

The **web server NeoPixel control** project extends the basic web server to accept color commands from a browser. Clicking a color button on the HTML page sends a request like `/color/255/0/0` (for red), which the Pico parses to set the NeoPixel color.

#### Diagram: IoT Data Flow Explorer

<iframe src="../../sims/iot-data-flow/main.html" width="100%" height="482px" scrolling="no"></iframe>

<details markdown="1">
<summary>IoT Data Flow Explorer MicroSim</summary>
Type: diagram
**sim-id:** iot-data-flow<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: trace
Learning Objective: Students can trace the path of an HTTP GET request from the Pico W through the router to an API server and back as JSON.

Canvas layout:
- Left to right: Pico W icon → Router icon → Internet cloud → API server icon
- Below: response flow with JSON arrow returning
- Bottom panel: the request URL and JSON response side by side

Visual elements:
- Animated packet (moving dot) travels from Pico W to server and back
- Hovering over each hop reveals: "TCP port 80", "DNS lookup", "JSON parse"
- Status indicators: Wi-Fi strength bar on Pico W; HTTP status code on server

Interactive controls:
- "Send Request" button triggers the animation
- Input fields: "Latitude" and "Longitude" — updates the URL shown at the bottom
- Toggle: "GET (fetch data)" vs "POST (send data)"

Instructional Rationale: Animating the round trip from device to internet and back makes the abstract HTTP request cycle tangible for students who have only used web APIs as end users.

Implementation: p5.js. Animated circle moves along Bezier path from Pico to server; JSON response displayed in a monospace box at the bottom.
</details>

## Package Management — upip

The **`upip` package manager** (MicroPython's package manager, equivalent to Python's pip) lets you install community libraries directly onto the Pico W over Wi-Fi:

```python
import upip
upip.install("micropython-umqtt.simple")   # install MQTT library
```

This downloads and installs the package from PyPI to the Pico's file system — no computer needed.

**Over-the-Air (OTA) update concept**: OTA updates allow the Pico to download new versions of its own code from a server and install them without a USB connection. This is how commercial IoT devices update their firmware in the field. A simple OTA system fetches a new `main.py` from a URL, saves it to flash, and reboots.

## TCP vs UDP

| Protocol | Delivery guarantee | Order guarantee | Use case |
|---------|------------------|----------------|---------|
| TCP | Yes | Yes | Web pages, file transfer, MQTT |
| UDP | No | No | Video streaming, DNS, real-time sensors |

For most web projects you will use TCP automatically through HTTP and the socket interface.

## Key Takeaways

- Use `network.WLAN(network.STA_IF)` to connect the Pico W to an existing Wi-Fi network.
- Poll `wlan.isconnected()` until connection is established; then read the IP with `wlan.ifconfig()[0]`.
- `urequests.get(url)` makes an HTTP GET request; `.text` contains the response body; always call `.close()`.
- `ujson.loads(text)` converts a JSON string to a Python dictionary for easy data access.
- `ntptime.settime()` synchronizes the Pico's clock to UTC via a network time server.
- A socket web server listens on port 80; parse the request string to detect which URL was requested.
- `upip.install("package-name")` downloads MicroPython libraries over Wi-Fi.
- Store Wi-Fi credentials in a separate `secrets.py` file and never commit it to a public repository.

??? question "Quick Check: What does wlan.isconnected() return before the Pico W has an IP address? (Click to reveal)"
    **`False`** — the method returns `False` until a full Wi-Fi connection including DHCP IP assignment is complete. Use a loop with `utime.sleep()` to wait before making network requests.

!!! mascot-celebration "Your Pico Is on the Internet!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Weather data, synchronized time, browser-controlled LEDs — your Pico W is a fully connected IoT device! Chapter 20 digs deeper into the Pico's timing system: hardware timers, multi-core programming, and the tricks that let two processors run truly simultaneously. Two cores are better than one!

## References

[See the Annotated References for this chapter](references.md)
