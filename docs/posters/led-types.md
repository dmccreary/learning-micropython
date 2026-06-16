# LED Types Compared

Audience: students adding lights and visual feedback to their projects.
Chapter: 14 — NeoPixels & Displays

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "LED Types Compared", subtitle beneath: "Single LED · RGB LED · NeoPixel (WS2812B) · LED Matrix."

    Layout: a four-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a clear component illustration at the top. A vertical row-label strip on the far left lists the nine attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (warm orange #E07B39): Header "Single-Color LED"; Illustration: clear 5 mm dome LED with flat cathode edge visible, two leads of unequal length (longer = anode); glow shown around dome. Rows:
    · Colors available: Red, green, blue, yellow, white, infrared, ultraviolet
    · Forward voltage: 1.8 V–2.2 V (red/yellow) · 3.0 V–3.5 V (blue/white)
    · Typical current: 20 mA maximum; 10 mA for dim use
    · GPIO pins needed: 1 per LED (+ series resistor 220 Ω–470 Ω from 3.3 V)
    · Colors at once: 1 (fixed color per LED)
    · Control: Digital on/off, or PWM for brightness
    · MicroPython: Pin(n, Pin.OUT).value(1) or PWM(pin).duty_u16(x)
    · Typical cost: $0.02–$0.10 each
    · Best for: Power indicators, simple blink programs, status lights

    Column 2 (deep purple #6A3FB5): Header "RGB LED (Common Cathode)"; Illustration: 5 mm LED with four leads — longest is common cathode (−); three shorter leads for R, G, B anodes; slight red-green-blue glow radiating outward. Rows:
    · Colors available: ~16 million (mix red, green, and blue channels)
    · Forward voltage: R ≈ 2.0 V; G ≈ 3.0 V; B ≈ 3.0 V (per channel)
    · Typical current: 20 mA per channel; up to 60 mA combined
    · GPIO pins needed: 3 (one per color channel; each needs its own resistor)
    · Colors at once: 1 mixed color (any combination of R/G/B)
    · Control: 3 independent PWM channels; duty cycle sets color
    · MicroPython: Three PWM objects — set duty_u16() on each
    · Typical cost: $0.10–$0.50 each
    · Best for: Color-coded status indicators; mood lights; color mixing experiments

    Column 3 (raspberry red #C7164E): Header "NeoPixel (WS2812B)"; Illustration: small 5×5 mm square SMD package with a clear diffused window and 4 solder pads; strip of five connected pixels shown below with individual glow. Rows:
    · Colors available: 16,777,216 (24-bit RGB — 8 bits per channel)
    · Forward voltage: 5 V power; data signal works at 3.3 V
    · Typical current: Up to 60 mA per pixel at full white (R+G+B = 20 mA each)
    · GPIO pins needed: 1 data pin for the entire chain; no limit on chain length
    · Colors at once: Each pixel independently programmable
    · Control: Single-wire 800 kHz serial protocol (WS2812B timing)
    · MicroPython: from neopixel import NeoPixel; np = NeoPixel(pin, n)
    · Typical cost: $0.10–$0.30 per pixel; strip of 60 ≈ $8–$15
    · Best for: Addressable lighting strips, RGB rings, pixel art, color animations

    Column 4 (teal blue #1389A6): Header "LED Matrix (8×8 + MAX7219)"; Illustration: square red 8×8 LED grid module with MAX7219 driver chip on the back; five pins along one edge (VCC, GND, DIN, CS, CLK). Rows:
    · Colors available: Single color (typically red or white)
    · Forward voltage: 5 V module power; SPI data at 3.3 V OK
    · Typical current: ~320 mA max (all 64 LEDs on); ~40 mA typical display
    · GPIO pins needed: 3 SPI pins (DIN, CS, CLK); up to 8 modules cascadable on same 3 pins
    · Colors at once: 1 fixed color; brightness controlled globally per module (0–15 levels)
    · Control: SPI via MAX7219 driver (row/column addressing)
    · MicroPython: max7219 library; matrix.pixel(x, y, 1) or matrix.text('Hi', 0, 0)
    · Typical cost: $2–$5 per 8×8 module
    · Best for: Scrolling text, simple animations, score displays, clocks

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, monospace for MicroPython snippets, numbers bold. Footer bar: "Sources: WS2812B datasheet (Worldsemi) · Maxim MAX7219 datasheet · LED forward-voltage values from typical manufacturer datasheets." Overall: tidy vector flat-design infographic poster, four-column grid with LED illustrations, suitable for a textbook or classroom screen.
