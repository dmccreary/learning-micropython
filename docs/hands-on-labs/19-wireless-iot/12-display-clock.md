# Display Clock

!!! mascot-welcome "Welcome to the Display Clock!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab you will combine everything you have learned. Your Pico W will fetch the time from the internet and show it on an OLED screen!

This lab is similar to the [WiFi Clock](./10-wifi-clock.md) lab, but it adds an OLED display so you can see the time and date without a computer.

You will need:

- A Pico W
- A 128x64 SSD1306 OLED display connected over SPI
- A `secrets.py` file with your WiFi network name and password

The display will show the current time and date, updated every minute.

## The Full Program

```py
from machine import Pin
import machine
import network
import ntptime                                   # library for Network Time Protocol
import ssd1306                                   # OLED display driver
import secrets                                   # your WiFi network name and password
from utime import sleep, sleep_ms, time, localtime, mktime, ticks_ms, ticks_diff
from machine import RTC                          # built-in Real-Time Clock

# set up the OLED display over SPI
WIDTH = 128
HEIGHT = 64
SCK = machine.Pin(2)                             # SPI clock pin
SDL = machine.Pin(3)                             # SPI data pin (MOSI)
spi = machine.SPI(0, baudrate=100000, sck=SCK, mosi=SDL)
CS  = machine.Pin(4)                             # chip select pin
DC  = machine.Pin(5)                             # data/command pin
RES = machine.Pin(6)                             # reset pin
oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)
oled.poweron()                                   # turn on the OLED screen

# set your time zone offset in hours from UTC
time_zone = -6                                   # US Central time (change for your location)

ntptime.host = 'us.pool.ntp.org'                # address of the NTP time server
ntptime.timeout = 10                             # wait up to 10 seconds per attempt

def wifi_connect():
    wifi = network.WLAN(network.STA_IF)          # create WiFi object in station mode
    wifi.active(True)                            # power on the WiFi chip
    wifi.config(pm = 0xa11140)                   # disable WiFi sleep mode for stability
    if not wifi.isconnected():
        wifi.connect(secrets.SSID, secrets.PASSWORD)  # try to connect
        print('Connecting..', end='')
        max_wait = 10                            # try for up to 10 seconds
        while max_wait > 0:
            if wifi.status() < 0 or wifi.status() >= 3:
                break                            # connected or error — stop waiting
            sleep_ms(1000)                       # wait one second between checks
            print('.', end='')                   # show a dot for each second
            max_wait -= 1
        print()
        if wifi.status() != 3:
            print('Could not connect to wifi!')
    sleep_ms(100)                                # small delay to stabilize
    return wifi

def is_daylight_saving_time():
    # check whether Daylight Saving Time is in effect (US rules)
    year, weekday = localtime()[0], localtime()[6]
    dst_start = mktime((year, 3, (8 - weekday) % 7 + 8, 2, 0, 0, 0, 0))   # 2nd Sunday in March
    dst_end   = mktime((year, 11, (1 - weekday) % 7 + 1, 2, 0, 0, 0, 0))  # 1st Sunday in November
    return dst_start <= time() < dst_end  # True if we are currently in DST

# global variables to store the formatted time and date strings
time_str = ''
date_str = ''
clock_values = []

def set_rtc():
    global time_str, date_str, clock_values
    time_was_set = False
    attempts = 0
    max_attempts = 5
    while not time_was_set and attempts < max_attempts:
        attempts += 1
        try:
            ntptime.settime()           # ask the NTP server for the current UTC time
            time_was_set = True
        except:
            print(f'NTP update attempt # {attempts} of {max_attempts} failed!',
                  'Retrying in 15 seconds..' if attempts < max_attempts else 'Check connection/config.')
            if attempts < max_attempts:
                sleep_ms(15000)         # wait 15 seconds before trying again

        if time_was_set:
            sleep_ms(200)
            rtc = RTC()                 # access the internal Real-Time Clock
            # add 1 hour extra if Daylight Saving Time is active
            tz_offset = (time_zone + 1) * 3600 if is_daylight_saving_time() else time_zone * 3600
            local_time = localtime(time() + tz_offset)  # convert UTC to local time
            # store the local time in the RTC
            rtc.datetime((local_time[0], local_time[1], local_time[2],
                           local_time[6], local_time[3], local_time[4], local_time[5], 0))
            sleep_ms(200)
            clock_values = rtc.datetime()  # read back the time we just set

            # format the time as hh:mm am/pm
            hour = clock_values[4]
            minute = clock_values[5]
            am_pm = 'am' if hour < 12 else 'pm'
            display_hour = 12 if hour == 0 else hour if hour < 13 else hour - 12
            time_str = '%2d:%02d%s' % (display_hour, minute, am_pm)

            # format the date as mm/dd/yy
            date_str = f'{clock_values[1]}/{clock_values[2]}/{clock_values[0] % 100}'

            print(time_str, date_str)   # print the current time and date to the console
            return True

    print('ERROR! Unable to update time from server!')
    return False

def update():
    # connect to WiFi and sync the internal clock
    success = False
    wifi = wifi_connect()
    sleep_ms(100)
    if wifi.isconnected():
        success = set_rtc()
        sleep_ms(100)
    return wifi, success

def update_display():
    global time_str, date_str, clock_values
    oled.fill(0)                                 # clear the screen
    oled.text(time_str + ' ' + date_str, 0, 10, 1)  # show time and date on row 10
    oled.show()                                  # send the pixel buffer to the OLED screen

while True:
    update()           # connect to WiFi and sync the clock
    update_display()   # draw the time and date on the OLED
    sleep(60)          # wait one minute before updating again
```

**What each line does:**

1. `ssd1306.SSD1306_SPI(...)` — creates the OLED display object using SPI communication
2. `oled.poweron()` — turns on the OLED screen
3. `ntptime.settime()` — asks the NTP server for the UTC time and sets the internal clock
4. `localtime(time() + tz_offset)` — converts UTC time to your local time by adding the offset
5. `rtc.datetime(...)` — stores the local time in the Real-Time Clock
6. `oled.fill(0)` — clears all pixels to black
7. `oled.text(time_str + ' ' + date_str, 0, 10, 1)` — draws the time and date text starting at position (0, 10)
8. `oled.show()` — sends the display buffer to the physical screen
9. `sleep(60)` — waits 60 seconds (one minute) before the next sync

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Change `time_zone = -6` to match your location. US Eastern = -5, US Mountain = -7, US Pacific = -8. For time zones east of UTC (Europe, Asia), use positive numbers.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The SPI pin numbers in this lab (SCK=2, MOSI=3, CS=4, DC=5, RES=6) are different from the weather display lab. Double-check your wiring before running the code.

!!! mascot-celebration "You Did It!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You built an internet-connected clock that shows the time on a screen! This is a real IoT project you could put anywhere in your home or classroom.
