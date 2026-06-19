# Get the Weather Forecast

!!! mascot-welcome "Welcome to Weather Data!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab your Pico W will fetch a real weather forecast from the internet! You will see temperatures for the next five days.

In this lab you will use a free web service called [Open Weather Map](http://openweathermap.org). You will send a request to the service and it will reply with predicted temperatures and weather conditions. The service gives forecasts for every three hours over the next 40 time periods — that is five days of weather data!

## How to Use the Open Weather Map API

An Application Programming Interface (API) is a way for your program to talk to a web service. The Open Weather Map API gives you weather data in exchange for a key (like a password). You must register on their website to get your own API key.

Once you have your key, add it to your `secrets.py` file:

```python
# secrets.py
SSID = "MY_WIFI_NETWORK_NAME"     # your WiFi network name
PASSWORD = "MY_WIFI_PASSWORD"     # your WiFi password
appid = 'f2b1...'                 # your Open Weather Map API key
```

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Always store API keys in `secrets.py` and add that file to `.gitignore`. Never share your API key publicly — someone else could use it and use up your free quota.

You then build the web address (URL) for your city. Each city has a number called a GeoNames ID. The city of Minneapolis, Minnesota has the ID `5037649`. You can find your city's ID at [GeoNames](https://www.geonames.org/).

```python
base = 'http://api.openweathermap.org/data/2.5/forecast?units=imperial&'
location = '5037649'   # GeoNames ID for Minneapolis, Minnesota, USA
url = base + 'id=' + location + '&appid=' + secrets.appid  # build the full URL
```

You can also use the `curl` command on a computer to test the URL before running it on the Pico:

```sh
curl 'http://api.openweathermap.org/data/2.5/forecast?\
      units=imperial&\
      id=5037649&\
      appid=f2b1...'
```

## Parsing the JSON Response

The service sends back a JavaScript Object Notation (JSON) file. JSON is a way to organize data using labels and values. Think of it like a nested set of labeled boxes.

Here is part of what the JSON looks like:

```json
{
    "cod": "200",
    "message": 0,
    "cnt": 40,
    "list": [
        {
            "dt": 1660078800,
            "main": {
                "temp": 80.83,
                "feels_like": 81.23,
                "temp_min": 80.83,
                "temp_max": 84.67,
                "pressure": 1019,
                "humidity": 47
            },
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky"
                }
            ],
            "wind": {
                "speed": 6.08,
                "deg": 226
            },
            "dt_txt": "2022-08-09 21:00:00"
        }, 
        /* ...repeated 40 times */
    ],
    "city": {
        "id": 5037649,
        "name": "Minneapolis",
        "coord": {
            "lat": 44.98,
            "lon": -93.2638
        },
        "country": "US",
        "timezone": -18000
    }
}
```

The main data is in the `list` section. There are 40 entries — one for every three-hour period. Each entry has temperature, humidity, wind, and weather description.

To get the temperature for each time period you loop through the list:

```python
# get the temperature and humidity for each of the next 40 time periods
for i in range(0, 39):
    print('temp:', weather['list'][i]['main']['temp'], end='')   # temperature
    print(' humidity:', weather['list'][i]['main']['humidity'])  # humidity
```

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    JSON path statements look like addresses inside a dictionary. `weather['list'][0]['main']['temp']` means: inside `weather`, go into `list`, get the first item (index 0), then go into `main`, and read the value called `temp`.

## Sample Output

Here is the output shown in the Thonny shell for the first 16 temperature values:

![Network Weather Results](../../img/network-weather-results.png)

## Plotting the Forecast with Thonny Plot

Thonny has a built-in Plotter that can draw live graphs from the console output. If you print values in the right format, Thonny will graph them for you automatically.

![Wireless Forecast Thonny Plot](../../img/network-forecast-thonny-plot.png)

Each printed line needs:

1. A label string
2. A colon
3. The numeric value

Here is what that format looks like:

```
Temperature: 63 Feels Like:  63.52
Temperature: 62 Feels Like:  62.56
Temperature: 70 Feels Like:  69.69
```

## Sample Code

```python
import network
import secrets
import urequests                           # library for HTTP requests
from utime import sleep, ticks_ms, ticks_diff

print('Connecting to WiFi Network Name:', secrets.SSID)
wlan = network.WLAN(network.STA_IF)       # create WiFi object in station mode
wlan.active(True)                         # power on the WiFi chip

start = ticks_ms()                        # start a connection timer

if not wlan.isconnected():
    wlan.connect(secrets.SSID, secrets.PASSWORD)  # connect to WiFi
    print("Waiting for connection...")
    counter = 0
    while not wlan.isconnected():
        sleep(1)                          # wait one second
        print(counter, '.', sep='', end='')
        counter += 1

delta = ticks_diff(ticks_ms(), start)
print("Connect Time:", delta, 'milliseconds')
print("IP Address:", wlan.ifconfig()[0])  # show our IP address

# build the weather API URL
base = 'http://api.openweathermap.org/data/2.5/forecast?units=imperial&'
location = '5037649'  # change this to your city's GeoNames ID
url = base + 'id=' + location + '&appid=' + secrets.appid  # add your API key

weather = urequests.get(url).json()       # fetch and parse the weather data

print('City:', weather['city']['name'])
print('Timezone:', weather['city']['timezone'])

max_times = 16  # how many 3-hour periods to display

# print the date/time labels
for i in range(0, max_times):
    print(weather['list'][i]['dt_txt'][5:13], ' ', sep='', end='')  # show month-day hour
print()

# print the temperatures
for i in range(0, max_times):
    print(round(weather['list'][i]['main']['temp']), '      ', end='')  # round to nearest degree
```

**What each line does:**

1. `urequests.get(url).json()` — fetches the URL and converts the JSON text to a Python dictionary
2. `weather['city']['name']` — reads the city name from the JSON
3. `weather['list'][i]['dt_txt'][5:13]` — reads the date/time string and slices out just the month-day and hour
4. `round(weather['list'][i]['main']['temp'])` — reads the temperature and rounds to the nearest degree

## Displaying Predicted Temperatures in a Thonny Plot

Thonny has a [Plot object](https://github.com/thonny/thonny/blob/707e69ec3a567df5f82205c5a2ae0d79f186ed25/thonny/plugins/help/plotter.rst) that draws a live graph from your output. Print one temperature per line and Thonny will graph them automatically:

```python
print()
for i in range(0, max_times):
    print(round(weather['list'][i]['main']['temp']))  # one temperature per line for the Thonny Plotter
```

!!! mascot-celebration "Excellent Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your Pico W just fetched a five-day weather forecast! In the next lab you will display this forecast on an OLED screen attached to your Pico W.
