# Advanced Wireless Labs

!!! mascot-welcome "Welcome to Advanced Networking!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In these advanced labs you will explore secure connections and measure how fast your Pico W can send data over WiFi. These topics are used by professional network engineers!

## Secure Communications with HTTPS

You have used Hypertext Transfer Protocol (HTTP) to send and receive data in earlier labs. HTTP sends data as plain text — anyone on the network could read it. For passwords and private data, you need a secure version called HTTPS.

The "S" in HTTPS stands for Secure. HTTPS uses a protocol called Transport Layer Security (TLS). TLS scrambles your data before sending it. Only the sender and receiver can unscramble it.

You may have heard HTTPS described as using a "Secure Sockets Layer" or SSL. TLS replaced SSL. They do the same job, but TLS is newer and more secure. When people say SSL today, they usually mean TLS.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The MicroPython `urequests` library does not yet fully support HTTPS on the Pico W. This is because TLS needs extra setup with certificates and keys. Use HTTP for lab projects, but use HTTPS for any real project with passwords or private data.

See the [MicroPython SSL/TLS Library](https://docs.micropython.org/en/latest/library/ssl.html) for the latest status.

## Testing SSL/TLS on Standard Python

You can test TLS on a regular computer first. This example uses standard Python (not MicroPython) to connect securely to `www.python.org`:

```python
import socket  # standard Python socket library
import ssl     # standard Python security library

hostname = 'www.python.org'                     # the website to connect to
context = ssl.create_default_context()          # set up a secure TLS context

with socket.create_connection((hostname, 443)) as sock:  # port 443 is the HTTPS port
    with context.wrap_socket(sock, server_hostname=hostname) as ssock:
        print(ssock.version())   # print which version of TLS is being used
```

**What each line does:**

1. `ssl.create_default_context()` — sets up security rules and certificate checking
2. `socket.create_connection((hostname, 443))` — opens a connection to port 443 (the HTTPS port)
3. `context.wrap_socket(...)` — wraps the regular connection in a secure TLS layer
4. `ssock.version()` — returns the TLS version being used

**Output:**

```
TLSv1.3
```

This tells you that TLS version 1.3 is being used — the newest and most secure version.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    When you visit a website that starts with `https://` in your browser, TLS is working behind the scenes. The little padlock icon in your browser means TLS is protecting your data.

## Performance Monitoring with uiperf3

`iperf3` is a standard tool for measuring internet speed between two devices. For MicroPython, there is a smaller version called `uiperf3`.

`uiperf3` uses a client-server model. One device runs as the server. Another device runs as the client and measures how fast data moves between them. This helps you understand the real networking speed of your Pico W.

It can test several different network protocols:

- User Datagram Protocol (UDP) — fast but does not guarantee delivery
- Transmission Control Protocol (TCP) — slower but guarantees delivery
- Streaming — measures how fast data flows in one direction

You can use `uiperf3` to measure the total WiFi throughput your Pico W can achieve.

## Installing uiperf3 with UPIP

```py
import upip
upip.install("uiperf3")  # download and install uiperf3 from PyPI
```

Make sure you are connected to WiFi first. See the [UPIP lab](./06-upip.md) for setup instructions.

## Testing Client Performance

```python
import uiperf3
uiperf3.client('MY_IP_ADDRESS')  # replace with the IP address of your iperf3 server
```

Run `iperf3` in server mode on a computer on the same network. Then run the above code on the Pico W to measure the speed of data moving from the Pico W to the server.

!!! mascot-celebrate "Keep Exploring!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You are now exploring topics that professional network engineers use every day. Secure connections and performance testing are real skills that matter in the industry. Keep going!
