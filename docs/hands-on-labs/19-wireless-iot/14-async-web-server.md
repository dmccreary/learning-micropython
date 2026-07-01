# Async Web Server

!!! mascot-welcome "Welcome to Async Programming!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, your Pico W will run a web server that can handle multiple visitors at the same time — without freezing or missing requests. The secret is `uasyncio`, MicroPython's built-in tool for doing several things at once. Let's build something amazing!

The web server you built in the earlier lab (Lab 4) uses **blocking** code. When it handles one web browser's request, everything else must wait. That is fine for one user, but real servers need to handle many requests without losing any.

**Async programming** (short for **asynchronous**) lets your Pico do other work while waiting for a web request to arrive. Instead of sitting still waiting, your code can blink an LED, read a sensor, or check a button while the server waits.

## How Async Works

In normal (blocking) code:
```
handle request → wait for it to finish → handle next request
```

In async code:
```
start handling request → while waiting for data, do something else → finish the request
```

The key words are `async def` (marks a function as async) and `await` (pauses the current task and lets other tasks run).

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    `await` does not mean "stop and wait doing nothing." It means "pause this task and let other tasks run while I wait for data." It is like telling your Pico "I will wait here, but go do something useful until my data arrives."

## Parts You Need

- Raspberry Pi Pico W (the W model has built-in WiFi)
- An LED connected to **GPIO 15** through a 330Ω resistor
- A `config.py` file with your WiFi credentials (see below)

## Setting Up config.py

Store your WiFi password in a separate file so it is not in your main code:

```python
# config.py — save this file on your Pico W
wifi_ssid = "YourNetworkName"    # your WiFi name (SSID)
wifi_pass = "YourPassword"       # your WiFi password
```

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never share or upload your `config.py` file to GitHub. It contains your WiFi password. Add `config.py` to your `.gitignore` file to protect it.

## Lab 1: The Async Web Server

This server controls an LED at GPIO 15. Visit `/light/on` in a browser to turn the LED on. Visit `/light/off` to turn it off. Meanwhile, the Pico keeps running a "heartbeat" task that blinks the onboard LED every few seconds to show it is still alive.

```python
import network
import socket
import time
from machine import Pin
import uasyncio as asyncio        # MicroPython's async library
import config                     # your WiFi credentials

# Set up the controllable LED (connected to GPIO 15)
led = Pin(15, Pin.OUT)

# Set up the onboard LED (the one built into the Pico W)
onboard = Pin("LED", Pin.OUT, value=0)

# The HTML page the server will send back
HTML_PAGE = """<!DOCTYPE html>
<html>
  <head>
    <title>Pico W Async Server</title>
    <style>
      body {{ font-family: sans-serif; text-align: center; padding: 40px; }}
      a {{ display: inline-block; margin: 10px; padding: 15px 30px;
          background: #333; color: white; text-decoration: none;
          border-radius: 8px; font-size: 18px; }}
      a:hover {{ background: #555; }}
    </style>
  </head>
  <body>
    <h1>Pico W Async Web Server</h1>
    <p>LED status: <strong>{status}</strong></p>
    <a href="/light/on">Turn ON</a>
    <a href="/light/off">Turn OFF</a>
  </body>
</html>"""

wlan = network.WLAN(network.STA_IF)   # create a WiFi client (station mode)

def connect_to_network():
    wlan.active(True)
    wlan.config(pm=0xa11140)          # disable WiFi power-save mode for reliability
    wlan.connect(config.wifi_ssid, config.wifi_pass)

    max_wait = 10                      # try for up to 10 seconds
    while max_wait > 0:
        if wlan.status() >= 3:
            break                      # status 3 = connected
        max_wait -= 1
        print("Waiting for WiFi...", end="")
        time.sleep(1)

    if wlan.status() != 3:
        raise RuntimeError("WiFi connection failed")

    print("Connected! IP address:", wlan.ifconfig()[0])

async def serve_client(reader, writer):
    # This function runs once for each browser that connects
    print("Client connected")
    request_line = await reader.readline()   # await: wait for the first line of the HTTP request
    print("Request:", request_line)

    # Skip the rest of the HTTP headers (we only need the first line)
    while await reader.readline() != b"\r\n":
        pass

    request = str(request_line)
    status  = "unknown"

    if "/light/on" in request:
        led.value(1)                   # turn the LED on
        status = "ON"
        print("LED turned ON")

    elif "/light/off" in request:
        led.value(0)                   # turn the LED off
        status = "OFF"
        print("LED turned OFF")

    # Send the HTML response back to the browser
    response = HTML_PAGE.format(status=status)
    writer.write("HTTP/1.0 200 OK\r\nContent-type: text/html\r\n\r\n")
    writer.write(response)

    await writer.drain()               # await: wait for the data to finish sending
    await writer.wait_closed()         # await: wait for the connection to close
    print("Client disconnected")

async def heartbeat():
    # This task runs in the background while the server handles requests
    while True:
        onboard.on()
        print("Pico is alive — heartbeat")
        await asyncio.sleep(0.25)     # let other tasks run for 0.25 seconds
        onboard.off()
        await asyncio.sleep(5)        # wait 5 seconds before the next heartbeat

async def main():
    print("Connecting to WiFi...")
    connect_to_network()

    print("Starting web server on port 80...")
    # Start the server: call serve_client for every new connection
    asyncio.create_task(asyncio.start_server(serve_client, "0.0.0.0", 80))

    # Also start the heartbeat task running in the background
    asyncio.create_task(heartbeat())

    # Keep the main task alive forever
    while True:
        await asyncio.sleep(1)

# Start the async event loop
try:
    asyncio.run(main())
finally:
    asyncio.new_event_loop()          # reset the loop if an error occurs
```

## What Each Part Does

| Part | What it does |
|------|-------------|
| `async def serve_client(reader, writer)` | Handles ONE browser connection. `await` pauses while waiting for data so other connections can run. |
| `async def heartbeat()` | Runs in the background, blinking the onboard LED every 5 seconds. Proves the Pico is not frozen. |
| `asyncio.create_task(...)` | Schedules a task to run concurrently. Both the server and the heartbeat run at the same time. |
| `await asyncio.sleep(n)` | Pauses this task for `n` seconds and lets other tasks run. Unlike `time.sleep()`, this does not block everything. |
| `asyncio.run(main())` | Starts the async event loop — the engine that switches between tasks. |

## Testing Your Server

1. Upload the code and `config.py` to your Pico W.
2. Open the Thonny console. Wait for the message `Connected! IP address: 192.168.x.x`.
3. Type that IP address into your phone or computer's web browser.
4. You should see two buttons: **Turn ON** and **Turn OFF**.
5. Click a button. The LED on your breadboard should respond.
6. Watch the Thonny console. You will see heartbeat messages appearing between client requests.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If multiple people visit your server at the same time, each gets their own `serve_client` task. The async system handles all of them without any one blocking the others.

## Lab 2: Adding a Sensor Reading to the Page

Extend the server to show a live sensor reading (like a potentiometer value) on the web page.

```python
from machine import ADC, Pin

pot = ADC(Pin(26))             # potentiometer connected to GPIO 26

# Replace the HTML_PAGE and serve_client body with this version
HTML_PAGE_WITH_SENSOR = """<!DOCTYPE html>
<html>
  <head><title>Pico W Sensor Server</title>
  <meta http-equiv="refresh" content="2">
  </head>
  <body>
    <h1>Pico W Sensor Server</h1>
    <p>Potentiometer: <strong>{pot_pct}%</strong></p>
    <p>LED: <strong>{led_status}</strong></p>
    <a href="/light/on">ON</a>  <a href="/light/off">OFF</a>
  </body>
</html>"""

# Inside serve_client, build the response like this:
# pot_raw = pot.read_u16()
# pot_pct = int(pot_raw / 65535 * 100)
# led_status = "ON" if led.value() else "OFF"
# response = HTML_PAGE_WITH_SENSOR.format(pot_pct=pot_pct, led_status=led_status)
```

The `<meta http-equiv="refresh" content="2">` tag tells the browser to reload the page every 2 seconds so the sensor reading stays fresh.

## Experiments

1. Add a second LED on GPIO 14. Add `/led2/on` and `/led2/off` routes to the server.
2. Change the heartbeat interval from 5 seconds to 1 second. How does this affect the console output?
3. Open two browser tabs to your Pico's IP address at the same time. Click a button in each tab. Does the server handle both?
4. Add a `/status` page that shows the current LED state and potentiometer reading in plain text (no HTML). This is what an API endpoint looks like.

!!! mascot-celebration "Your Pico Is a Web Server!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have built a non-blocking web server that handles multiple users and runs background tasks at the same time. This is the same architecture used by real web frameworks. You are writing professional-style code now, coder!
