# Microphone MAX4466

Here is a kit that uses the low cost MAX4466 microphone.  Because it has a built=in amplifier we get a good sound signal that we can hook directly up to the ADC port on the Pico.


I've completely redesigned the visualizer to match your requirements for an Audacity-like waveform display. Here are the key features of this new version:

1.  **Full Display Resolution**:
    -   Uses all 128 pixels of the display width, with one data point per pixel
    -   Creates a smooth, connected waveform line instead of separate bars
2.  **Vertically Centered Waveform**:
    -   The display shows a horizontal center line
    -   Quiet sounds appear as a small deviation from this center line
    -   Louder sounds create larger deviations both above and below the center
3.  **Left-to-Right Flow (Similar to Audacity)**:
    -   New sound samples appear on the left side of the display
    -   Older samples move to the right and eventually scroll off
    -   Creates a scrolling oscilloscope effect like in audio editing software
4.  **Smart Noise Handling**:
    -   Uses a noise floor threshold to ignore background noise
    -   Very quiet sounds stay close to the center line
    -   The display remains stable when there's no significant sound
5.  **Dynamic Amplitude Scaling**:
    -   Automatically adjusts to both quiet and loud environments
    -   Fast response to loud sounds but avoids wild display jumps
    -   Uses 80% of the display height (40% above and 40% below center) to ensure good visibility

This should give you a nice, responsive waveform display that remains quiet with no sound but clearly shows speech, whistling, and singing with appropriate waveform patterns - just like you'd see in Audacity or similar audio software.

Would you like me to make any additional adjustments to this visualization?

Retry

[Claude can make mistakes.
Please double-check responses.](https://support.anthropic.com/en/articles/8525154-claude-is-providing-incorrect-or-misleading-responses-what-s-going-on)

3.7 Sonnet