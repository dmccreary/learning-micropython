# WiFi Clock

!!! mascot-welcome "Welcome to the WiFi Clock!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab your Pico W will get the exact time from the internet. It will keep a clock that is always correct — no batteries needed!

On the internet there is a service called the Network Time Protocol (NTP). NTP servers hold the exact time and share it with any device that asks. Your Pico W can ask an NTP server for the time and then keep track of it using its built-in Real-Time Clock (RTC). An RTC is a tiny circuit that counts seconds accurately.

In MicroPython, getting the time is easy once you are connected to WiFi:

```py
import ntptime             # the MicroPython library for Network Time Protocol
ntptime.host = 'us.pool.ntp.org'  # the address of an NTP time server
ntptime.timeout = 10       # wait up to 10 seconds for a response
ntptime.settime()          # ask the server for the time and set the internal clock
```

After these lines run, your Pico W's internal clock is set to the correct Coordinated Universal Time (UTC). UTC is the world standard time — like time zone zero. The rest of the program converts UTC to your local time zone and adjusts for Daylight Saving Time.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    UTC is the same everywhere on Earth. To get your local time, you subtract your time zone offset. For example, US Central Time is 6 hours behind UTC, so you subtract 6 hours.

## The Config File

Always keep WiFi credentials in a separate file so they do not get checked into GitHub.

```py
# config.py — store this file on your Pico W but never share it publicly
wifi_ssid = 'mywifinetworkname'   # your WiFi network name
wifi_pass = 'mypassword'          # your WiFi password
```

## Full Program

```py
import ntptime, network               # time and WiFi libraries
from machine import RTC               # Real-Time Clock module
from utime import sleep, sleep_ms, time, localtime, mktime
import config                         # your local WiFi credentials

# set your time zone offset in hours from UTC (negative = behind UTC)
time_zone = -6  # US Central time is 6 hours behind UTC

ntptime.host = 'us.pool.ntp.org'     # NTP server address
ntptime.timeout = 10                  # wait up to 10 seconds per attempt

def wifi_connect():
    wifi = network.WLAN(network.STA_IF)    # create WiFi object in station mode
    wifi.active(True)                       # power on the WiFi chip
    wifi.config(pm = 0xa11140)             # disable WiFi sleep mode for reliability
    if not wifi.isconnected():
        wifi.connect(config.wifi_ssid, config.wifi_pass)  # start connection
        print('Connecting..', end='')
        max_wait = 10                       # try for up to 10 seconds
        while max_wait > 0:
            if wifi.status() < 0 or wifi.status() >= 3:
                break                       # stop waiting — connected or error
            sleep_ms(1000)                  # wait one second
            print('.', end='')              # print a dot to show progress
            max_wait -= 1
        print()
        if wifi.status() != 3:
            print('Could not connect to wifi!')
    sleep_ms(100)                           # small delay to stabilize the connection
    return wifi

def is_daylight_saving_time():
    # calculate whether Daylight Saving Time is currently in effect (US rules)
    year, weekday = localtime()[0], localtime()[6]
    # DST starts second Sunday in March at 2:00 AM
    dst_start = mktime((year, 3, (8 - weekday) % 7 + 8, 2, 0, 0, 0, 0))
    # DST ends first Sunday in November at 2:00 AM
    dst_end = mktime((year, 11, (1 - weekday) % 7 + 1, 2, 0, 0, 0, 0))
    return dst_start <= time() < dst_end   # return True if we are in DST right now

def set_rtc():
    # try up to 5 times to get the time from the NTP server
    time_was_set = False
    attempts = 0
    max_attempts = 5
    while not time_was_set and attempts < max_attempts:
        attempts += 1
        try:
            ntptime.settime()              # ask the NTP server for the current UTC time
            time_was_set = True
        except:
            print(f'NTP update attempt # {attempts} of {max_attempts} failed!',
                  'Retrying in 15 seconds..' if attempts < max_attempts else 'Check connection/config.')
            if attempts < max_attempts:
                sleep_ms(15000)            # wait 15 seconds before trying again

        if time_was_set:
            sleep_ms(200)
            rtc = RTC()                    # access the internal Real-Time Clock
            # calculate offset including Daylight Saving Time if needed
            tz_offset = (time_zone + 1) * 3600 if is_daylight_saving_time() else time_zone * 3600
            local_time = localtime(time() + tz_offset)  # convert UTC to local time
            # set the RTC to local time
            rtc.datetime((local_time[0], local_time[1], local_time[2],
                           local_time[6], local_time[3], local_time[4], local_time[5], 0))
            sleep_ms(200)
            clock_time = rtc.datetime()   # read back the time we just set
            # format the time as hh:mm am/pm
            hour = clock_time[4]
            minute = clock_time[5]
            am_pm = 'am' if hour < 12 else 'pm'
            display_hour = 12 if hour == 0 else hour if hour < 13 else hour - 12
            time_str = '%2d:%02d%s' % (display_hour, minute, am_pm)
            date_str = f'{clock_time[1]}/{clock_time[2]}/{clock_time[0] % 100}'
            print(time_str, date_str)     # print the current local time and date
            return True

    print('ERROR! Unable to update time from server!')
    return False

def update():
    # connect to WiFi and sync the clock
    success = False
    wifi = wifi_connect()
    sleep_ms(100)
    if wifi.isconnected():
        success = set_rtc()
        sleep_ms(100)
    return wifi, success

if __name__ == '__main__':
    while True:
        update()       # connect and sync the clock
        sleep(60)      # wait one minute before syncing again
```

**What each line does:**

1. `ntptime.settime()` — asks the NTP server for the current time and sets the internal clock to UTC
2. `RTC()` — accesses the Pico W's built-in Real-Time Clock
3. `localtime(time() + tz_offset)` — converts the UTC time to your local time zone
4. `rtc.datetime(...)` — sets the RTC to the calculated local time
5. `sleep(60)` — waits 60 seconds before re-syncing

## Sample Output

```
Connecting.........
Connected:  True 
IP:  10.0.0.118
NTP update attempt # 1 of 5 failed! Retrying in 15 seconds..
...
7:41pm 9/10/23
7:42pm 9/10/23
7:43pm 9/10/23
```

Notice that the first NTP attempt failed but the second one worked. Retrying is important — internet connections are not always perfect on the first try.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    This program checks for Daylight Saving Time automatically. Change the `time_zone` variable at the top to match your location. US Eastern = -5, US Mountain = -7, US Pacific = -8.

This program needs a `config.py` file in the same folder with your WiFi credentials.

## References

[NikoKun - Pico powered clock on Reddit](https://www.reddit.com/r/raspberrypipico/comments/16f07ww/a_pico_powered_clock/)

!!! mascot-celebration "Your Pico Knows the Time!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your Pico W can now sync to internet time servers! In the next lab you will display the time on an OLED screen.
