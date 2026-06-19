# ESP32 TTGO Lab

The ESP32 is a low-cost (under $10) microcontroller. A microcontroller is a tiny computer on a single chip. This one has built-in WiFi and Bluetooth. WiFi lets it connect to the internet. Bluetooth lets it talk to phones and other devices. In this lab, you will use a special version of the ESP32 called the TTGO. The TTGO has a small color screen built right in.

!!! mascot-welcome "Welcome to This Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will set up the ESP32 microcontroller with MicroPython. Let's build something amazing!

---

## Step 1: Install the USB to UART Bridge Driver

Your computer talks to the ESP32 through a USB cable. But your computer needs a special piece of software called a **driver** to understand the ESP32's language. This driver is called the **USB to UART Bridge Virtual COM Port (VCP) Driver**. UART stands for Universal Asynchronous Receiver-Transmitter — it is the way the ESP32 sends and receives data over the cable.

Follow these steps to install the driver:

1. Go to the Silicon Labs driver page:
   [https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)
2. Download the correct driver for your operating system (Mac or Windows).
3. Run the installer and follow the on-screen instructions.
4. Plug in your ESP32 with a USB cable.
5. Open a Terminal window and type this command, then press Enter:

```sh
ls -l /dev/cu*
```

6. Look for a line that says:

```
/dev/cu.SLAB_USBtoUART
```

If you see that line, the driver is working. If you do not see it, try restarting your computer and checking again.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If you still do not see `/dev/cu.SLAB_USBtoUART` after rebooting, try a different USB cable. Some cables only carry power and cannot send data.

For more help on Mac, see the Espressif guide:
[https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html)

---

## Step 2: Create a Python Environment for the ESP32

You will use a tool called **Conda** to create a safe workspace. A Conda environment is like a separate box for your Python tools. It keeps the ESP32 tools separate from other Python projects on your computer.

Run these two commands in your Terminal, one at a time:

```sh
conda create -n esp32 python=3
```

```sh
conda activate esp32
```

**What each line does:**

1. `conda create -n esp32 python=3` — Creates a new Conda environment named `esp32` using Python 3.
2. `conda activate esp32` — Turns on (activates) that environment so the next commands run inside it.

---

## Step 3: Install the esptool

The **esptool** is a program that lets you send new software to your ESP32. You will use it to erase old software and load fresh MicroPython firmware. **Firmware** is the software that lives inside the chip and controls how it works — think of it like the chip's built-in brain.

Run this command in your Terminal:

```sh
pip3 install esptool
```

You will see output that looks like this:

```
Collecting esptool
  Downloading esptool-3.0.tar.gz (149 kB)
     |████████████████████████████████| 149 kB 2.9 MB/s
     ...
Installing collected packages: pycparser, six, cffi, reedsolo, pyserial, ecdsa, cryptography, bitstring, esptool
Successfully installed bitstring-3.1.7 cffi-1.14.5 cryptography-3.4.6 ecdsa-0.16.1 esptool-3.0 pycparser-2.20 pyserial-3.5 reedsolo-1.5.4 six-1.15.0
```

When you see `Successfully installed`, the esptool is ready to use.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Firmware is the software built into a chip. You are about to replace the old firmware with MicroPython so you can program the ESP32 in Python.

---

## Step 4: Erase the Old Firmware

Before you can load MicroPython, you must erase whatever software is already on the ESP32. This is like wiping a whiteboard clean before writing something new.

Run this command:

```sh
esptool.py --port /dev/cu.SLAB_USBtoUART erase_flash
```

**What each part does:**

1. `esptool.py` — Runs the esptool program.
2. `--port /dev/cu.SLAB_USBtoUART` — Tells esptool which USB port the ESP32 is connected to.
3. `erase_flash` — Erases all the stored software on the chip.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never unplug the ESP32 while it is erasing or flashing. Unplugging too early can break the firmware and you may need to start over.

---

## Step 5: Download the New Firmware

Now you need to download the MicroPython firmware for your ESP32. Go to this page and download the `ESP32_All` prebuilt binary file:

[https://github.com/loboris/MicroPython_ESP32_psRAM_LoBo/wiki/firmwares](https://github.com/loboris/MicroPython_ESP32_psRAM_LoBo/wiki/firmwares)

Save the downloaded file somewhere easy to find, like your Desktop or Downloads folder.

---

## Step 6: Load the New Firmware onto the ESP32

Now you will copy the new firmware onto the ESP32. This is called **flashing** the chip.

Follow these steps:

1. Open your Terminal.
2. Move into the folder where you downloaded the firmware:

```sh
cd esp32_all/
```

3. Run the flash script:

```sh
../flash.sh -p /dev/cu.SLAB_USBtoUART
```

**What each part does:**

1. `cd esp32_all/` — Moves the Terminal into the firmware folder.
2. `../flash.sh` — Runs the flash script that is one folder above.
3. `-p /dev/cu.SLAB_USBtoUART` — Tells the script which USB port to use.

You will see output like this while it works:

```sh
esptool.py v3.0
Serial port /dev/cu.SLAB_USBtoUART
Connecting........_
Detecting chip type... ESP32
Chip is ESP32-D0WDQ6 (revision 1)
Features: WiFi, BT, Dual Core, 240MHz, VRef calibration in efuse, Coding Scheme None
Crystal is 40MHz
MAC: 24:62:ab:ca:62:84
Uploading stub...
Running stub...
Stub running...
Erasing flash (this may take a while)...
Chip erase completed successfully in 2.5s
Hard resetting via RTS pin...
```

Wait until the process finishes completely before doing anything else.

---

## Configure Thonny

**Thonny** is the program you will use to write and run MicroPython code on your ESP32. You need to tell Thonny two things: which USB port the ESP32 uses, and which kind of microcontroller it is.

### Set the Serial Port

First, tell Thonny which port to use to find your ESP32.

![Thonny serial port configuration screen showing the port selection dropdown](../img/esp32-config-serial-port.png)

### Set the Interpreter

Next, tell Thonny to use the ESP32 version of MicroPython. An **interpreter** is the software that reads and runs your Python code.

![Thonny interpreter settings screen showing MicroPython (ESP32) selected](../img/micropython-esp32.png)

---

## Run a Test Program

Now let's check that everything works. This program draws a colorful background on the screen and shows some text.

Type this code into Thonny and press the Run button:

```py
# Import the tools we need
import machine, display, time, math, network, utime

# Create a display object so we can draw on the screen
tft = display.TFT()

# Set up the screen with the correct settings for this ESP32 model
tft.init(tft.ST7789, bgr=False, rot=tft.LANDSCAPE,
         miso=17, backl_pin=4, backl_on=1,
         mosi=19, clk=18, cs=5, dc=16)

# Set the area of the screen we will draw on
tft.setwin(40, 52, 320, 240)

# Draw 241 vertical colored lines to fill the screen with a rainbow
for i in range(0, 241):
    color = 0xFFFFFF - tft.hsb2rgb(i / 241 * 360, 1, 1)  # Pick a color from the rainbow
    tft.line(i, 0, i, 135, color)  # Draw one vertical line

# Set the text color to black
tft.set_fg(0x000000)

# Draw a circle on top of the rainbow
tft.ellipse(120, 67, 120, 67)

# Draw a diagonal line
tft.line(0, 0, 240, 135)

# Set the message text
text = "CoderDojo Rocks!"

# Calculate where to put the text so it appears in the center of the screen
text_x = 120 - int(tft.textWidth(text) / 2)   # Center horizontally
text_y = 67 - int(tft.fontSize()[1] / 2)        # Center vertically

# Draw the text in white
tft.text(text_x, text_y, text, 0xFFFFFF)
```

**What each section does:**

1. **Import lines** — Load the tools needed to control the screen and time.
2. `display.TFT()` — Creates a display object. You use this object to give drawing commands to the screen.
3. `tft.init(...)` — Sets up the screen. Each argument tells it which pin does which job.
4. `tft.setwin(...)` — Defines the drawing area on the screen.
5. **The `for` loop** — Draws 241 colored lines side by side to make a rainbow.
6. `tft.set_fg(0x000000)` — Changes the drawing color to black (for the circle and line).
7. `tft.ellipse(...)` — Draws a circle.
8. `tft.line(0, 0, 240, 135)` — Draws a diagonal line from the top-left to the bottom-right corner.
9. **Text lines** — Calculate the center of the screen and draw "CoderDojo Rocks!" in white.

You should see this on the ESP32 display:

![ESP32 TTGO color screen showing a rainbow background with a circle, diagonal line, and white text reading CoderDojo Rocks!](../img/color-oled.jpg)

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Setting up firmware can feel like a lot of steps. That is completely normal — even experienced coders have to go through this process. You've got this, coder!

---

## References

- [TTGO Color Display with MicroPython on Instructables](https://www.instructables.com/TTGO-color-Display-With-Micropython-TTGO-T-display/)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have set up your ESP32 with MicroPython and run your first program on it! Next, you will write more programs and start exploring what this tiny computer can do.
