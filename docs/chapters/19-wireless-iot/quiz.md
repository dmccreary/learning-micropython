# Quiz: Wireless Connectivity and Internet of Things

Test your understanding of Pico W Wi-Fi, HTTP requests, JSON, NTP, and web servers with these questions.

---

#### 1. What hardware feature does the Pico W have that the standard Raspberry Pi Pico does NOT?

<div class="upper-alpha" markdown>
1. A faster processor — the Pico W runs at 240 MHz instead of 133 MHz
2. A built-in Wi-Fi and Bluetooth radio using the CYW43439 chip
3. More GPIO pins — the Pico W has 36 pins instead of 26
4. An analog-to-digital converter — the standard Pico lacks ADC capability
</div>

??? question "Show Answer"
    The correct answer is **B**. The Pico W adds a CYW43439 wireless chip from Infineon (formerly Cypress) that provides 2.4 GHz Wi-Fi and Bluetooth LE. The processor (RP2040), GPIO count, and ADC capability are identical between the Pico and Pico W. The wireless radio connects to the RP2040 via SPI internally, leaving all GPIO pins available for your project.

    **Concept Tested:** Pico W Wi-Fi / Pico W Hardware

---

#### 2. What does the following MicroPython code do?

```python
import network
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("MySSID", "mypassword")
```

<div class="upper-alpha" markdown>
1. Creates a Wi-Fi access point named "MySSID" with password "mypassword"
2. Connects the Pico W to an existing Wi-Fi network as a client (station mode)
3. Scans for all available Wi-Fi networks and stores their names
4. Disconnects from any current Wi-Fi network and switches to offline mode
</div>

??? question "Show Answer"
    The correct answer is **B**. `network.STA_IF` selects "station" mode — the Pico W acts as a client joining an existing network (like your home router). `network.AP_IF` would create a new access point. After calling `wlan.connect()`, you must wait in a loop checking `wlan.isconnected()` until the connection is established before making HTTP requests.

    **Concept Tested:** Pico W Wi-Fi Connection / network.WLAN

---

#### 3. What does the `urequests.get(url)` function do in MicroPython?

<div class="upper-alpha" markdown>
1. Downloads a URL and saves it to a file named "get.txt" on the Pico
2. Sends an HTTP GET request to a web server and returns the response including status code and body
3. Registers the Pico W with a URL shortening service for easier access
4. Opens a TCP socket that waits for incoming connections from the specified URL
</div>

??? question "Show Answer"
    The correct answer is **B**. `urequests.get(url)` is the MicroPython equivalent of a web browser requesting a page. It opens a TCP connection to the server, sends an HTTP GET request, and returns a response object. You can then check `response.status_code` (200 = OK), read `response.text` for the raw text, or call `response.json()` to parse the body as a Python dictionary.

    **Concept Tested:** HTTP GET Request / urequests Module

---

#### 4. A Pico W receives this JSON response from a weather API: `{"temp": 22.5, "humidity": 65}`. How do you extract the temperature in MicroPython?

<div class="upper-alpha" markdown>
1. `response.temp`
2. `response.split(",")[0]`
3. `data = response.json(); temp = data["temp"]`
4. `ujson.loads(22.5)`
</div>

??? question "Show Answer"
    The correct answer is **C**. After getting the HTTP response, call `response.json()` which uses `ujson` internally to parse the JSON string into a Python dictionary. Then access values with standard dictionary syntax: `data["temp"]` returns `22.5`. Option A would work in JavaScript but not Python. Option B would give you a raw string fragment, not a numeric value.

    **Concept Tested:** JSON Parsing / ujson Module

---

#### 5. What is NTP, and why is it useful for Pico W projects?

<div class="upper-alpha" markdown>
1. Network Transfer Protocol — the method used to upload Python files to the Pico over Wi-Fi
2. Network Time Protocol — a service that provides the current date and time over the internet so the Pico can keep an accurate clock
3. NeoPixel Transfer Protocol — the serial format used to control WS2812B LED strips
4. Node Transmission Protocol — the way IoT devices register themselves with a cloud server
</div>

??? question "Show Answer"
    The correct answer is **B**. NTP (Network Time Protocol) is a standard internet protocol that delivers the current UTC time from time servers around the world. MicroPython's `ntptime.settime()` contacts an NTP server and sets the Pico's internal real-time clock. This is useful for timestamping sensor data, triggering actions at specific times, or displaying an accurate clock.

    **Concept Tested:** NTP Time Sync / ntptime Module

---

#### 6. In a simple Pico W web server, what does a "socket" represent?

<div class="upper-alpha" markdown>
1. A physical hardware connector on the Pico board that accepts GPIO cables
2. A software endpoint that listens for incoming network connections on a specific port
3. The wireless antenna built into the CYW43439 chip
4. A file that stores the web page HTML content on the Pico's flash memory
</div>

??? question "Show Answer"
    The correct answer is **B**. A socket is a software abstraction for a network connection endpoint. When you create a server socket and bind it to port 80, the Pico waits for web browsers to connect. When a browser visits the Pico's IP address, the socket accepts the connection, reads the HTTP request, and your code sends back an HTML response. This is how the Pico becomes a tiny web server.

    **Concept Tested:** Web Server / TCP Socket

---

#### 7. What is the difference between TCP and UDP?

<div class="upper-alpha" markdown>
1. TCP sends data faster but UDP checks for errors and corrects them
2. TCP guarantees delivery and order of packets; UDP sends packets without guaranteed delivery, making it faster but less reliable
3. TCP is for wireless networks; UDP is for wired Ethernet connections only
4. TCP is used for sending data to servers; UDP is used for receiving data from servers
</div>

??? question "Show Answer"
    The correct answer is **B**. TCP (Transmission Control Protocol) establishes a connection, numbers packets, and retransmits any that are lost — guaranteeing complete, in-order delivery. This makes it ideal for HTTP web requests and file transfers. UDP (User Datagram Protocol) just fires packets without checking if they arrived, making it faster and lower-overhead — useful for real-time applications like video streaming or sensor broadcasting where a missed packet is better than a delayed one.

    **Concept Tested:** TCP vs UDP

---

#### 8. A student stores their Wi-Fi password in `secrets.py` and adds `secrets.py` to `.gitignore`. Why is this important?

<div class="upper-alpha" markdown>
1. Git cannot store Python files — only markdown and text files — so secrets.py must be excluded
2. Keeping credentials out of version control prevents accidentally sharing passwords publicly when pushing to GitHub
3. `.gitignore` compresses the secrets.py file to make it smaller on the Pico's flash storage
4. MicroPython requires secrets to be in a separate file and cannot read them from the main script
</div>

??? question "Show Answer"
    The correct answer is **B**. If you commit your Wi-Fi password or API keys into a public Git repository and push to GitHub, anyone on the internet can read them. Storing credentials in a separate `secrets.py` file and adding it to `.gitignore` ensures Git never tracks that file, so it stays on your computer only. The main code imports from `secrets` to use the values without exposing them.

    **Concept Tested:** Wi-Fi Credentials / Security Best Practices

---

#### 9. What does `upip.install("package-name")` do on a Pico W?

<div class="upper-alpha" markdown>
1. Updates the MicroPython firmware to include the named package
2. Downloads and installs a MicroPython library from the internet directly onto the Pico W's file system
3. Uploads a local package file from the host computer to the Pico W over USB
4. Pins the package version so it cannot be accidentally updated later
</div>

??? question "Show Answer"
    The correct answer is **B**. `upip` is MicroPython's package installer (similar to Python's `pip`). When the Pico W has Wi-Fi access, `upip.install("some-library")` downloads the package from micropython.org's package repository over the internet and saves it to the Pico's flash file system. This lets you add libraries without manually copying files from a computer.

    **Concept Tested:** upip Package Manager / MicroPython Package Installation

---

#### 10. A student's Pico W successfully connects to Wi-Fi (wlan.isconnected() returns True) but `urequests.get()` fails with a timeout error. What is the most likely cause?

<div class="upper-alpha" markdown>
1. The Wi-Fi password is stored incorrectly in secrets.py
2. The URL is wrong, the server is down, or the Pico W does not have access to the internet (e.g., firewall or captive portal blocking it)
3. urequests is not installed — it must be added with upip before use
4. The Pico W can only connect to Wi-Fi or make HTTP requests, not both at the same time
</div>

??? question "Show Answer"
    The correct answer is **B**. If `wlan.isconnected()` is True, the Pico W has joined the local Wi-Fi network successfully. However, local network connectivity does not guarantee internet access. A school or library network may have a captive portal (login page) or firewall blocking HTTP requests. The server might also be temporarily down. Check the URL in a browser on another device to verify the server is reachable.

    **Concept Tested:** HTTP GET Request / Wi-Fi Connection Troubleshooting

---
