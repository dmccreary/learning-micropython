# Hardware Real-Time Clock (RTC)

!!! mascot-welcome "Welcome to Timekeeping!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    What if your Pico could keep track of the exact time, even when it is not connected to WiFi? In this lab, you will use the Pico's built-in Real-Time Clock to track time and build a standalone clock. Let's build something amazing!

A **Real-Time Clock (RTC)** is a circuit that counts seconds accurately. Your Raspberry Pi Pico has an RTC built right into its RP2040 chip. You do not need any extra hardware for basic timekeeping.

The difference between the Pico's RTC and the WiFi clock lab is simple:
- **WiFi clock** — syncs the exact time from the internet each time it boots. Requires WiFi.
- **Hardware RTC** — sets the time once (by hand or via WiFi) and then keeps counting on its own. Works anywhere, even without internet.

## How the Pico RTC Works

When you set the time, the RTC starts counting from that moment. It keeps counting as long as the Pico has power. When you unplug the Pico, the RTC resets to January 1, 2021 at midnight.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    To keep time when unplugged, you need an external RTC module with its own small battery (like the DS3231). The Pico's built-in RTC works great for projects that stay powered on.

## Lab 1: Reading the Built-In RTC

This program reads the current date and time from the Pico's RTC and prints it every second.

```python
from machine import RTC         # import the Real-Time Clock module
from utime import sleep

# Create an RTC object
rtc = RTC()

# Check what the RTC currently says
current = rtc.datetime()
print("Current RTC datetime tuple:", current)
print("Format: (year, month, day, weekday, hour, minute, second, microsecond)")

# Print the time every second
while True:
    dt = rtc.datetime()             # read the current date and time
    year    = dt[0]
    month   = dt[1]
    day     = dt[2]
    weekday = dt[3]                 # 0=Monday, 6=Sunday
    hour    = dt[4]
    minute  = dt[5]
    second  = dt[6]

    # Format as a readable string
    print(f"{year}-{month:02d}-{day:02d}  {hour:02d}:{minute:02d}:{second:02d}")
    sleep(1)
```

### What Each Line Does

1. `RTC()` — creates a connection to the Pico's built-in real-time clock.
2. `rtc.datetime()` — returns a tuple (a fixed-length list) with eight values.
3. `dt[0]` through `dt[6]` — pulls out year, month, day, weekday, hour, minute, second.
4. `f"{hour:02d}:{minute:02d}:{second:02d}"` — formats with leading zeros (01, 02, ... 09, 10).

## Lab 2: Setting the RTC Manually

The RTC starts at a default time when you power up the Pico. You can set it to the correct time by passing a datetime tuple.

```python
from machine import RTC
from utime import sleep

rtc = RTC()

# Set the time: (year, month, day, weekday, hour, minute, second, microsecond)
# weekday: 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday, 6=Sunday
rtc.datetime((2025, 6, 15, 6, 14, 30, 0, 0))  # set to June 15, 2025, Saturday, 2:30 PM

print("Time has been set. Counting from now...")

while True:
    dt = rtc.datetime()
    hour   = dt[4]
    minute = dt[5]
    second = dt[6]

    # Display 12-hour format with AM/PM
    am_pm = "AM" if hour < 12 else "PM"
    display_hour = hour if hour <= 12 else hour - 12
    if display_hour == 0:
        display_hour = 12             # midnight and noon show as 12

    print(f"{display_hour}:{minute:02d}:{second:02d} {am_pm}")
    sleep(1)
```

### What Each Line Does

1. `rtc.datetime((2025, 6, 15, 6, 14, 30, 0, 0))` — the first 0 after 6 is the weekday (Saturday=5... wait — this uses 0=Mon). The microsecond field is always 0 when setting.
2. `hour if hour <= 12 else hour - 12` — converts 24-hour format to 12-hour format.

## Lab 3: Displaying the Clock on an OLED

This program shows the current time on an SSD1306 OLED display. It updates every second.

Connect your SSD1306 via I2C: **SDA → GPIO 0**, **SCL → GPIO 1**.

```python
from machine import RTC, Pin, I2C
from utime import sleep
import ssd1306

# Set up the OLED display
i2c = I2C(0, sda=Pin(0), scl=Pin(1))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

# Set up the RTC and set a starting time
rtc = RTC()
rtc.datetime((2025, 6, 15, 6, 14, 30, 0, 0))  # set your current date/time here

DAYS   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

while True:
    dt = rtc.datetime()             # read the clock
    year, month, day, weekday, hour, minute, second, _ = dt

    # Build time string in 12-hour format
    am_pm = "AM" if hour < 12 else "PM"
    h12   = hour if 1 <= hour <= 12 else (12 if hour == 0 else hour - 12)
    time_str = f"{h12}:{minute:02d}:{second:02d} {am_pm}"

    # Build date string
    date_str = f"{DAYS[weekday]} {MONTHS[month]} {day}, {year}"

    # Draw on the OLED
    oled.fill(0)                                    # clear the screen
    oled.text(time_str, 10, 20, 1)                  # show the time in the middle
    oled.text(date_str, 5, 40, 1)                   # show the date below
    oled.show()                                     # update the display

    sleep(1)
```

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Put a call to `rtc.datetime(...)` with today's actual date and time at the top of your program. Every time you run the program fresh it will start from that time.

## Lab 4: Syncing the RTC from WiFi at Boot

The best approach for accuracy: sync the RTC once from the internet at startup, then use the RTC for all timekeeping. This way the clock keeps working even if WiFi drops out.

```python
import ntptime, network
from machine import RTC
from utime import sleep, sleep_ms, time, localtime
import config                            # your WiFi credentials file

TIME_ZONE = -6                           # hours offset from UTC (US Central = -6)

rtc = RTC()

def connect_wifi():
    wifi = network.WLAN(network.STA_IF)
    wifi.active(True)
    wifi.connect(config.wifi_ssid, config.wifi_pass)
    for _ in range(10):                  # try for 10 seconds
        if wifi.isconnected():
            print("Connected:", wifi.ifconfig()[0])
            return wifi
        sleep(1)
        print(".", end="")
    print("Could not connect to WiFi")
    return wifi

def sync_rtc_from_ntp():
    try:
        ntptime.settime()               # set the Pico's clock to UTC from NTP
        sleep_ms(200)

        # Apply the local time zone offset
        offset_seconds = TIME_ZONE * 3600
        local = localtime(time() + offset_seconds)   # convert UTC to local time

        # Set the RTC to local time
        rtc.datetime((local[0], local[1], local[2],
                       local[6], local[3], local[4], local[5], 0))
        print("Clock synced successfully!")
        return True
    except Exception as e:
        print("NTP sync failed:", e)
        return False

# --- Main program ---
wifi = connect_wifi()
if wifi.isconnected():
    sync_rtc_from_ntp()               # sync once at startup
    wifi.active(False)                # disconnect WiFi to save power

print("Running on local RTC — no WiFi needed anymore.")

while True:
    dt = rtc.datetime()
    print(f"{dt[4]:02d}:{dt[5]:02d}:{dt[6]:02d}")   # print hh:mm:ss
    sleep(1)
```

### What Each Line Does

1. `ntptime.settime()` — asks an internet time server for the current UTC time and sets the internal clock.
2. `time() + offset_seconds` — converts UTC (universal time) to your local time zone.
3. `rtc.datetime(...)` — saves the local time into the RTC so it keeps counting from here.
4. `wifi.active(False)` — turns off the WiFi radio to save power after the sync is done.

## Experiments

1. Set the RTC to a time 5 minutes in the past. Wait and confirm the clock is actually counting up in real time.
2. Modify Lab 3 to show a large font. Use `oled.text()` twice on the same position with slightly different coordinates to make bold-looking text.
3. Add an alarm: check if the current time matches a target hour and minute, then flash the onboard LED when it does.
4. Run the WiFi sync program. Watch the RTC before and after `ntptime.settime()`. How far off was the default time?

!!! mascot-celebration "Your Pico Knows the Time!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have built a standalone clock that works without WiFi. You know how to set, read, and display the Pico's built-in RTC. In the next lab, you will explore creating a non-blocking async web server.
