# Getting Your MAC Address

!!! mascot-welcome "Welcome to MAC Addresses!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab you will read your Pico W's unique hardware address. Every WiFi device in the world has one of these!

## What Is a MAC Address?

A Media Access Control (MAC) address is a unique identifier built into every device that can connect to a network. Think of it like a serial number that is permanently set at the factory. No two devices in the world should have the same MAC address.

Every WiFi chip, Ethernet card, and Bluetooth device has a MAC address. The MAC address has nothing to do with Apple's Macintosh computers — they just share the same word.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A MAC address is like a home address for your device on the local network. Your router uses it to know exactly which device to send data to.

A MAC address is six bytes long. Each byte is written in hexadecimal (base 16) and separated by colons. For example:

```
28:cd:c1:01:35:54
```

The first three bytes identify the company that made the device. The last three bytes are a unique number assigned by that company. Here are two Pico W devices purchased together — notice how similar they are:

```
28:cd:c1:1:35:54
28:cd:c1:1:35:58
```

They differ by only a few bits because they were manufactured at the same time. A Pico W from a different supplier still shares the same first three bytes:

```
28:cd:c1:0:9e:19
```

This shows that all three Pico W devices were made by the same company (Infineon's CYW43439 chip).

Understanding MAC addresses helps you debug network problems. You can see which devices are connected to a network and trace data back to a specific device.

## Getting the MAC Address in MicroPython

You can read your Pico W's MAC address with this program. It also measures how long the WiFi chip takes to start up.

```python
import network
from utime import sleep, ticks_us, ticks_diff

print('Getting MAC/Ethernet Address for this device.')

start = ticks_us()          # start a microsecond timer to measure startup time
wlan = network.WLAN(network.STA_IF)  # create a WiFi object in station mode
wlan.active(True)           # power on the WiFi chip — this takes about 2.5 seconds

# read the MAC address — returns 6 bytes stored as a byte array
mac_address = wlan.config('mac')
print('Time in microseconds:', ticks_diff(ticks_us(), start))  # show startup time

# each MAC address is 6 bytes (48 bits) long
print("Hex byte array:", mac_address, 'length:', len(mac_address))

# print in standard MAC notation: xx:xx:xx:xx:xx:xx
for digit in range(0, 5):
    print(str(hex(mac_address[digit]))[2:4], ':', sep='', end='')  # print each byte with a colon
print(str(hex(mac_address[5]))[2:4])  # print the last byte without a trailing colon
```

**What each line does:**

1. `ticks_us()` — reads the current time in microseconds (millionths of a second)
2. `network.STA_IF` — station interface mode — means your Pico is a client, not a router
3. `wlan.active(True)` — powers up the WiFi chip (required before reading the MAC address)
4. `wlan.config('mac')` — returns the MAC address as 6 bytes
5. `hex(mac_address[digit])` — converts one byte to a hexadecimal string like `0x28`
6. `[2:4]` — slices off the `0x` prefix so only the hex digits remain

**First time after power on:**

```
Getting MAC/Ethernet Address for this device.
Time in microseconds: 2584424
Hex byte array: b'(\xcd\xc1\x015X' length: 6
28:cd:c1:1:35:58
```

It takes about 2.5 seconds to power on the WiFi chip the first time.

**Subsequent runs** (the chip is already on):

```
Getting MAC/Ethernet Address for this device.
Time in microseconds: 211
Hex byte array: b'(\xcd\xc1\x015X' length: 6
28:cd:c1:1:35:58
```

After the first run, the same call takes only about 211 microseconds. That is about 12,000 times faster! The chip is already powered on, so no startup delay is needed.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    You must call `wlan.active(True)` before reading the MAC address. If you skip this line, the WiFi chip will not be powered on and the function will return all zeros.

## MAC Addresses and Privacy

MAC addresses stay on your local network. They are never sent to websites on the internet. But people who manage local networks can see them. For example, the WiFi router at a coffee shop can log every MAC address that connects.

To protect users, some devices like Apple iPhones generate a different MAC address for each WiFi network they connect to. This makes it harder for different stores or locations to track the same device.

Your Pico W has one fixed MAC address. It is the same every time.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have read your Pico W's unique hardware address! This is useful for network troubleshooting and security. Next you will learn how to install extra libraries over WiFi.
