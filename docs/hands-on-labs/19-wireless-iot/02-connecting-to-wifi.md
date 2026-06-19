# Connecting to a WiFi Network

!!! mascot-welcome "Welcome to WiFi!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab you will connect your Pico W to a WiFi network for the first time. This is the most important skill in all the wireless labs!

Every WiFi network has two pieces of information you need. The first is the network name, called the Service Set Identifier (SSID). The second is the password. You need both to connect.

## Setting Up Your WiFi secrets.py File

We never put passwords directly in our main code. Instead, we store them in a separate file called `secrets.py`. This keeps your password safe. Never share this file or check it into a public repository like GitHub.

Create a file called `secrets.py` on your Pico W with this content:

```python
SSID = "MY_WIFI_NETWORK_NAME"   # replace with your actual network name
PASSWORD = "MY_WIFI_PASSWORD"   # replace with your actual password
```

Add `secrets.py` to your `.gitignore` file so it is never uploaded to GitHub.

You can then use the values in any program like this:

```python
print('Connecting to WiFi Network Name:', secrets.SSID)  # prints your network name
```

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Store your WiFi password in `secrets.py` — never put passwords directly in your main code. Keeping secrets separate is a great habit for every programmer!

## Testing Your WiFi Access Point Connection

Here is a simple script to test whether your network name and password are correct. It connects to your WiFi access point. An access point is the router or hub that provides WiFi in your home or classroom.

```python
import network          # MicroPython library for WiFi and networking
import secrets          # your SSID and password file
from utime import sleep # lets us pause the program for a few seconds

print('Connecting to WiFi Network Name:', secrets.SSID)
wlan = network.WLAN(network.STA_IF)  # create a WiFi object in station mode (client mode)
wlan.active(True)                    # power on the WiFi chip
print('Waiting for wifi chip to power up...')
sleep(3)  # wait 3 seconds for the chip to finish starting up
wlan.connect(secrets.SSID, secrets.PASSWORD)  # try to connect to the network
print('Waiting for access point to log us in.')
sleep(2)  # wait 2 more seconds for the connection to finish
if wlan.isconnected():
    print('Success! We have connected to your access point!')
    print('Try to ping the device at', wlan.ifconfig()[0])  # show our IP address
else:
    print('Failure! We have not connected to your access point! Check your secrets.py file.')
```

**What each line does:**

1. `import network` — loads the MicroPython networking library
2. `import secrets` — loads your WiFi name and password
3. `network.WLAN(network.STA_IF)` — creates a WiFi connection object in "station" (client) mode
4. `wlan.active(True)` — turns on the WiFi chip
5. `sleep(3)` — waits 3 seconds for the chip to start up
6. `wlan.connect(...)` — sends the network name and password to connect
7. `wlan.isconnected()` — checks if the connection worked
8. `wlan.ifconfig()[0]` — returns the Internet Protocol (IP) address assigned to your Pico W

**Expected output:**

```
Connecting to WiFi Network Name: MY_WIFI_NETWORK_NAME
Waiting for wifi chip to power up...
Waiting for access point to log us in...
Success! We have connected to your access point!
Try to ping the device at 10.0.0.70
```

If you see `Failure!`, check your network name and password in `secrets.py`. Also make sure you have a strong WiFi signal where you are testing.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The Pico W only connects to 2.4 GHz WiFi networks. It cannot connect to 5 GHz networks. If your router uses both, make sure your `secrets.py` has the 2.4 GHz network name.

## Waiting for a Valid Access Point Connection

The simple script above uses fixed delays. But sometimes WiFi takes longer or shorter to connect. A better approach is to use a loop that keeps checking until we are connected.

```python
import network
import secrets
from utime import sleep, ticks_ms, ticks_diff

print('Connecting to WiFi Network Name:', secrets.SSID)
wlan = network.WLAN(network.STA_IF)  # create a WiFi object in station mode
wlan.active(True)                    # power on the WiFi chip

start = ticks_ms()  # record the time we started connecting (in milliseconds)

if not wlan.isconnected():
    wlan.connect(secrets.SSID, secrets.PASSWORD)  # start the connection
    print("Waiting for connection...")
    counter = 0
    while not wlan.isconnected():  # keep looping until we connect
        sleep(1)                   # wait one second before checking again
        print(counter, '.', sep='', end='')  # print a dot to show progress
        counter += 1               # count how many seconds we have waited

delta = ticks_diff(ticks_ms(), start)  # calculate total connection time
print("Connect Time:", delta, 'milliseconds')
print('IP Address:', wlan.ifconfig()[0])  # show our assigned IP address
```

**What each line does:**

1. `ticks_ms()` — reads the current time in milliseconds, like a stopwatch start
2. `while not wlan.isconnected()` — repeats the loop until we are connected
3. `sleep(1)` — waits one second between each check
4. `ticks_diff(...)` — calculates how many milliseconds passed since we started
5. `wlan.ifconfig()[0]` — returns our IP address

**First run output** (when the chip is cold and needs a few seconds):

```
>>> %Run -c $EDITOR_CONTENT
Connecting to WiFi Network Name: MY_NETWORK_NAME
Waiting for connection...
0.1.2.3.Connect Time: 4640
IP Address: 10.0.0.70
```

**Second run output** (the connection is already cached, so it is instant):

```
>>> %Run -c $EDITOR_CONTENT
Connecting to WiFi Network Name: MY_NETWORK_NAME
Connect Time: 0 milliseconds
IP Address: 10.0.0.70
```

## Error Handling

Sometimes the connection fails. Good programs handle errors gracefully. This version tries to connect for up to 10 seconds and raises an error if it fails.

```python
import network
import time
import secrets

wlan = network.WLAN(network.STA_IF)  # create a WiFi object in station mode
wlan.active(True)                    # power on the WiFi chip
wlan.connect(secrets.SSID, secrets.PASSWORD)  # start the connection

# count down from 10 while waiting for a connection
max_wait = 10
while max_wait > 0:
    if wlan.status() < 0 or wlan.status() >= 3:
        break          # stop waiting — either connected or an error occurred
    max_wait -= 1      # subtract 1 from the countdown
    print('waiting for connection...')
    time.sleep(1)      # wait one second

# check if we connected successfully (status code 3 means connected)
if wlan.status() != 3:
    raise RuntimeError('network connection failed')  # stop the program with an error
else:
    print('connected')
    status = wlan.ifconfig()     # get network details
    print('ip = ' + status[0])  # print our IP address
```

**What each line does:**

1. `wlan.status()` — returns a number showing the connection state (3 = connected, negative = error)
2. `raise RuntimeError(...)` — stops the program and shows an error message
3. `wlan.ifconfig()` — returns a list: IP address, subnet mask, gateway, and DNS server

The full Transmission Control Protocol / Internet Protocol (TCP/IP) stack runs on your Pico W after connecting. You can ping the Pico W from another computer using the IP address shown.

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Networking code can look complicated at first. That is completely normal. Once you have connected once, the rest of the wireless labs become much easier!

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your Pico W is now connected to the internet! Next, you will fetch real data from the web using an HTTP request.
