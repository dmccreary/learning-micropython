# Testing an HTTP GET Request

!!! mascot-welcome "Welcome to HTTP GET!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab you will ask the internet for real live data. Your Pico W will find out how many people are in space right now!

When your browser loads a webpage, it uses a request called Hypertext Transfer Protocol (HTTP). HTTP is the language that computers use to ask for and share information on the web. An HTTP GET request is how you ask a web server to send you some data.

In this lab you will send an HTTP GET request to a free website that tracks how many people are currently in space. The website sends back data in a format called JavaScript Object Notation (JSON). JSON is a way to organize data using labels and values, like a dictionary.

## The Code

This example was inspired by [Tom's Hardware](https://www.tomshardware.com/how-to/connect-raspberry-pi-pico-w-to-the-internet).

Make sure you have your `secrets.py` file set up from the [previous lab](./02-connecting-to-wifi.md) before running this code.

```python
import network                            # WiFi library
import secrets                            # your network name and password
from utime import sleep, ticks_ms, ticks_diff  # timing functions
import urequests                          # library for making HTTP requests

wlan = network.WLAN(network.STA_IF)      # create WiFi object in station (client) mode
wlan.active(True)                        # power on the WiFi chip
wlan.connect(secrets.SSID, secrets.PASSWORD)  # connect to your network

start = ticks_ms()  # start a timer to measure how long the request takes

# send a GET request to the astronaut API and parse the JSON response
astronauts = urequests.get("http://api.open-notify.org/astros.json").json()

delta = ticks_diff(ticks_ms(), start)    # calculate how long the request took

number = astronauts['number']            # pull out the count of people in space
print('There are', number, 'astronauts in space.')

for i in range(number):                  # loop through each astronaut
    print(i+1, astronauts['people'][i]['name'])  # print their name

print("HTTP GET Time in milliseconds:", delta)   # show how fast the request was
```

**What each line does:**

1. `import urequests` — loads the MicroPython library for making web requests
2. `urequests.get(url)` — sends an HTTP GET request to the given web address
3. `.json()` — converts the text response into a Python dictionary
4. `astronauts['number']` — reads the value with the key `'number'` from the dictionary
5. `astronauts['people'][i]['name']` — reads the name of the i-th person in the list

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    JSON data looks like a Python dictionary. You read values using keys in square brackets, like `data['key']`. Once you know this, you can read data from almost any website!

## Expected Output

```
There are 10 astronauts in space.
1 Oleg Artemyev
2 Denis Matveev
3 Sergey Korsakov
4 Kjell Lindgren
5 Bob Hines
6 Samantha Cristoforetti
7 Jessica Watkins
8 Cai Xuzhe
9 Chen Dong
10 Liu Yang
HTTP GET Time in milliseconds: 786
```

The exact names and count will change because real astronauts rotate in and out of the International Space Station!

The request took about 786 milliseconds — less than one second. That is how fast the internet can deliver data to your tiny Pico W.

!!! mascot-celebration "Amazing!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your Pico W just fetched live data from the internet! In the next lab, you will flip it around and turn your Pico W into a web server so other devices can connect to it.
