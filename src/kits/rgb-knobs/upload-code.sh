#!/bin/bash
# upload-code.sh — upload all RGB Knobs kit files to the Pico using mpremote
#
# Usage:
#   chmod +x upload-code.sh   # make executable (first time only)
#   ./upload-code.sh
#
# Requires: pip install mpremote
#
# Port detection:
#   mpremote auto-detects the Pico by its USB ID — no port name needed when
#   only one Pico is connected.  To list detected devices run:
#     mpremote connect list
#   To target a specific port when multiple Picos are connected:
#     Mac/Linux:  mpremote connect /dev/tty.usbmodem101 cp main.py :main.py
#     Windows:    mpremote connect COM3 cp main.py :main.py

echo "Uploading RGB Knobs kit files to Pico..."

# copy the test blink script
mpremote cp 01-blink.py :01-blink.py
echo "  uploaded 01-blink.py"

# copy the main RGB knobs program (runs automatically on power-up)
mpremote cp main.py :main.py
echo "  uploaded main.py"

echo "Done. Files on Pico:"
mpremote ls
