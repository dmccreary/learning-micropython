# Common MicroPython Errors

Audience: students debugging their first programs on a Raspberry Pi Pico.
Chapter: 21 — File Systems & Debugging

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any error messages, numbers, or descriptions. Every error class name and error message string must appear exactly as written.

    A clean, modern, flat-design educational quick-reference infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Common MicroPython Errors", subtitle beneath: "What the traceback is telling you — and how to fix it."

    Layout: a 2-row × 4-column grid of error cards on a light off-white background (#F7F9FC). Each card has a colored top-edge accent, the error class name in bold monospace at top, a one-line example error message in a dark code block, a "Cause" line, and a "Fix" line. Generous white space, thin card outlines.

    Card 1 — row 1 col 1 (raspberry red #C7164E): Error class "MemoryError"; Example message: MemoryError: memory allocation failed, allocating 4096 bytes; Cause: The heap is full — too many large objects loaded into RAM at once; Fix: Delete unused objects with del x; collect garbage with import gc; gc.collect(); avoid large lists and bytearrays.

    Card 2 — row 1 col 2 (warm orange #E07B39): Error class "OSError (ENOENT)"; Example message: OSError: [Errno 2] ENOENT; Cause: File or directory not found at the path you specified; Fix: Check the filename spelling; run import os; os.listdir('/') to see what is on the board.

    Card 3 — row 1 col 3 (forest green #2D8A4E): Error class "OSError (ENODEV)"; Example message: OSError: [Errno 19] ENODEV; Cause: I2C or SPI device is not responding — not connected, wrong address, or wrong voltage; Fix: Check wiring; confirm 3.3 V on VCC; scan the I2C bus with i2c.scan() to find connected devices.

    Card 4 — row 1 col 4 (teal blue #1389A6): Error class "ImportError"; Example message: ImportError: no module named 'ssd1306'; Cause: The .py library file has not been copied to the Pico's flash storage; Fix: Copy the driver file (e.g., ssd1306.py) to the Pico root folder using Thonny File → Save As or rshell.

    Card 5 — row 2 col 1 (deep purple #6A3FB5): Error class "AttributeError"; Example message: AttributeError: 'module' object has no attribute 'Pin'; Cause: Trying to use a class or function that doesn't exist in MicroPython's version of the module; Fix: Check MicroPython documentation; run import machine; dir(machine) to see available names.

    Card 6 — row 2 col 2 (magenta pink #E5398A): Error class "SyntaxError"; Example message: SyntaxError: invalid syntax; Cause: A typo, missing colon, unmatched bracket, or wrong indentation in your code; Fix: Look at the line number in the traceback; check for missing : after if/for/def, unclosed ( or ', or mixed tabs and spaces.

    Card 7 — row 2 col 3 (warm orange #E07B39, darker variant or use forest green #2D8A4E): Error class "TypeError"; Example message: TypeError: can't convert 'int' object to str implicitly; Cause: You passed the wrong data type to a function (e.g., passed a number where a string was expected); Fix: Convert explicitly: str(n) to make a string, int(s) to make an integer, float(n) for a decimal.

    Card 8 — row 2 col 4 (raspberry red accent, darker border): Error class "ValueError"; Example message: ValueError: invalid argument; Cause: The right type was passed but the value is out of the allowed range or format; Fix: Read the function's documentation for valid input ranges; check that pin numbers and frequency values are within bounds.

    Below all cards, a full-width tip banner (dark slate #2A2E3A background, white text): "Debugging tip: the last line of a Traceback (most recent call last) is WHERE the error happened. Read upward to see WHY."

    Typography: one clean geometric sans-serif (Inter/Roboto style) for labels; monospace (Courier or similar) for error class names and example messages; error messages rendered in a slightly shaded code block. Footer bar: "Error classes: MicroPython documentation — docs.micropython.org/en/latest/library/builtins.html." Overall: tidy vector flat-design reference card grid, high-contrast code blocks, balanced 2×4 layout, suitable for printing as a desk reference or classroom poster.
