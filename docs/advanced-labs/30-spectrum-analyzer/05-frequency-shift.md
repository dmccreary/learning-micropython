# Frequency Shift

!!! prompt
    This is working better.  I have one additional request.  To give demos of the FFT working I am whistling into the microphone.  As I change my pitch I want to see the spike move.  But my whistling range is mostly on the left side of the display.  Can we change the display so that the lower frequencies are shifted to the right by about 1/3 the screen size.  I realize this will not show the higher frequencies to the right, but that is OK.

That's a great request! Let me modify the code to focus on the lower frequencies by shifting the display. This will make your whistling demonstrations more effective by using more screen space for the frequencies you're actually working with.

I've modified the code to focus on the lower frequencies where your whistling occurs. Here's what I changed:

1. Instead of displaying the entire frequency spectrum, the display now shows only the **first third** of the frequency bins (where your whistling will be detected).

2. The code computes:

```py
lower_freq_focus = len(magnitudes) // 3
```

This means we're only using approximately the first 85 frequency bins (out of 256) and spreading them across the entire display width.

3. The bin width calculation is updated to use only this lower frequency portion:

```py
bin_width = lower_freq_focus // num_bins
```

4. The main for-loop now limits the frequency analysis to this lower range.

This change will effectively "zoom in" on the lower frequency range where your whistling occurs, making the movement of peaks much more noticeable as you change pitch. The entire display width now represents only the first third of the frequency spectrum, giving you about 3 times more horizontal resolution for your demonstrations.

## Possible Next Steps:

- Adjust the frequency range further (more or less than 1/3)
- Aapply a logarithmic scale to the frequency display to better match human hearing perception
- Highlight the peaks more prominently and display the frequencies of the peaks
