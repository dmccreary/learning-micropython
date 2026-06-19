# MicroPython Package Installer (UPIP)

!!! mascot-welcome "Welcome to UPIP!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab you will install extra Python libraries directly onto your Pico W — straight from the internet!

Python has a package manager called `pip` that lets you download and install extra libraries. MicroPython has its own version called `upip`. Once your Pico W is connected to WiFi, you can use `upip` to download libraries directly to the device.

This is very useful in a classroom. Each time you get a new Pico W, you can run one program to install all the libraries you need. You do not need to copy files from your PC.

## Installing UPIP From Thonny

You need to install `upip` itself before you can use it. Use Thonny's package manager to do this.

1. Open Thonny.
2. Go to the **Tools** menu and click **Manage Packages...**.
3. Type `upip` in the search box.
4. Click the **Search on PyPI** button.

![Thonny UPIP Search](../../img/thonny-upip.png)

5. Click on the first result: **micropython-upip**.

![Thonny UPIP Search Details](../../img/thonny-upip-details.png)

6. Click **Install** to add it to your Pico W.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    PyPI (the Python Package Index) is a huge library of free Python packages. `upip` connects your Pico W to PyPI and downloads exactly what you need — just like an app store for your microcontroller!

## Installing a Package with UPIP

This program connects to WiFi and then uses `upip` to install a test library. The library installed here is `micropython-pystone_lowmem`, a simple CPU speed test. You can replace it with any MicroPython-compatible package.

Make sure you have a `secrets.py` file set up from the [Connecting to WiFi](./02-connecting-to-wifi.md) lab first.

```python
import upip                                    # the MicroPython package installer
import network                                 # WiFi library
import secrets                                 # your network name and password
from utime import sleep, ticks_ms, ticks_diff  # timing functions

print('Connecting to WiFi Network Name:', secrets.SSID)
wlan = network.WLAN(network.STA_IF)           # create WiFi object in station mode
wlan.active(True)                             # power on the WiFi chip

start = ticks_ms()  # start a timer to measure connection time

if not wlan.isconnected():
    wlan.connect(secrets.SSID, secrets.PASSWORD)  # try to connect
    print("Waiting for connection...")
    counter = 0
    while not wlan.isconnected():   # keep checking until we connect
        sleep(1)                    # wait one second between checks
        counter += 1
        print(counter, '.', sep='', end='')  # show progress dots

delta = ticks_diff(ticks_ms(), start)  # calculate connection time
print("Connect Time:", delta)          # show how long it took to connect

start = ticks_ms()  # restart the timer for the download

# change this package name to install a different library
upip.install("micropython-pystone_lowmem")

print("Download Time:", ticks_diff(ticks_ms(), start), "milliseconds")  # show download time
```

**What each line does:**

1. `import upip` — loads the package installer
2. `upip.install("micropython-pystone_lowmem")` — downloads and installs the named package to `/lib/` on your Pico W
3. `ticks_ms()` before and after — measures how many milliseconds the download takes

**Expected output:**

```
Connecting to WiFi Network Name: MY_NETWORK_NAME
Waiting for connection...
1.2.3.4.Connect Time: 4641
Installing to: /lib/
Warning: micropython.org SSL certificate is not validated
Installing micropython-pystone_lowmem 3.4.2.post4 from https://micropython.org/pi/pystone_lowmem/pystone_lowmem-3.4.2.post4.tar.gz
Download Time: 4918 milliseconds
```

The library is now saved on your Pico W. You can use it every time you restart without downloading it again.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    To install a different library, just change the package name in the `upip.install()` line. Search for `micropython-` packages on [PyPI](https://pypi.org/) to find what is available.

## Testing Your Newly Installed Library

After installing, test the new library to make sure it works.

```python
import pystone_lowmem     # import the library we just installed
pystone_lowmem.main()     # run its built-in test function
```

**Expected output:**

```
Pystone(1.2) time for 500 passes = 410ms
This machine benchmarks at 1219 pystones/second
```

This confirms the library installed correctly. The numbers measure how fast your Pico W's processor runs.

## Getting UPIP Help

You can ask `upip` to explain itself:

```python
import upip
upip.help()  # print instructions for using upip
```

**Output:**

```
upip - Simple PyPI package manager for MicroPython
Usage: micropython -m upip install [-p <path>] <package>... | -r <requirements.txt>
import upip; upip.install(package_or_list, [<path>])

If <path> isn't given, packages will be installed to sys.path[1], or
sys.path[2] if the former is .frozen (path can be set from MICROPYPATH
environment variable if supported).
Default install path: /lib

Note: only MicroPython packages (usually, named micropython-*) are supported
for installation, upip does not support arbitrary code in setup.py.
```

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your Pico W can now download and install new libraries from the internet! This makes it easy to add new features to any project.
