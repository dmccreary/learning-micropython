# Measuring VSYS Input Voltage on Raspberry Pi Pico

## Learning Objectives

By the end of this lesson, students will be able to:

* Understand what VSYS is and why monitoring input voltage is important
* Use the Pico's built-in ADC to measure VSYS voltage
* Write MicroPython code to read and display voltage measurements
* Apply voltage divider concepts to interpret ADC readings

## What is VSYS?

`VSYS` is the main power input pin on the Raspberry Pi Pico. It accepts voltages from 1.8V to 5.5V and is the primary way to power your Pico when not using USB. Understanding the input voltage is crucial for:

* Battery monitoring in portable projects
* Ensuring stable operation
* Detecting power supply issues
* Implementing low-voltage warnings

`VSYS` typically comes from the positive battery as opposed to power from a USB cable (`VBUS`).

Sometimes we need to be able to measure the voltage on VSYS to determine
how much power our battery has left.

You need to set GP25 to output and set it high and also set GP29 to input with no pull resistors before reading. 
And don't forget that the input from VSYS to ADC is divided by 3, so you have to multiply your result to get real value. 
When I do that I get around 4.7 V when powered from USB, so it definitely works.

## Hardware Requirements

* Raspberry Pi Pico with MicroPython firmware
* USB cable for programming
* Optional: External power supply (battery pack, DC adapter)

## Theory: How Voltage Measurement Works

The Pico has a built-in voltage divider circuit that allows the ADC to safely measure VSYS. The internal circuit divides the VSYS voltage by 3, making it safe for the 3.3V ADC to read. This means:

* VSYS voltage range: 1.8V - 5.5V
* After division: 0.6V - 1.83V
* ADC can safely measure this range

The voltage divider is connected to ADC channel 3 (ADC pin 29).

## Sample Code

Here's a complete example that measures and displays the VSYS voltage:

```python
from machine import ADC, Pin
import time

# Create ADC object for VSYS measurement
# ADC(3) corresponds to the internal voltage divider for VSYS
vsys_adc = ADC(3)

def read_vsys_voltage():
    """
    Read VSYS voltage using the internal voltage divider
    
    The Pico has an internal voltage divider that divides VSYS by 3
    This allows the 3.3V ADC to safely measure VSYS up to ~10V
    
    Returns:
        float: VSYS voltage in volts
    """
    # Read raw ADC value (0-65535 for 16-bit ADC)
    adc_reading = vsys_adc.read_u16()
    
    # Convert to voltage (ADC reference is 3.3V)
    adc_voltage = (adc_reading / 65535) * 3.3
    
    # Account for the voltage divider (multiply by 3)
    vsys_voltage = adc_voltage * 3
    
    return vsys_voltage

def format_voltage(voltage):
    """Format voltage for display with appropriate precision"""
    return f"{voltage:.3f}V"

print("VSYS Voltage Monitor")
print("===================")
print("Press Ctrl+C to stop")
print()

try:
    while True:
        # Read the voltage
        voltage = read_vsys_voltage()
        
        # Display the result
        print(f"VSYS: {format_voltage(voltage)}")
        
        # Check for low voltage warning
        if voltage < 3.0:
            print("  ⚠️  LOW VOLTAGE WARNING!")
        elif voltage > 5.0:
            print("  ⚠️  HIGH VOLTAGE WARNING!")
        
        # Wait before next reading
        time.sleep(1)
        
except KeyboardInterrupt:
    print("\nMonitoring stopped")
```

## Enhanced Example with Data Logging

Here's a more advanced version that logs voltage data:

```python
from machine import ADC, Pin, RTC
import time

# Initialize components
vsys_adc = ADC(3)
rtc = RTC()

# Data storage
voltage_log = []
MAX_LOG_ENTRIES = 100

def read_vsys_voltage():
    """Read VSYS voltage with improved accuracy"""
    # Take multiple readings for better accuracy
    readings = []
    for _ in range(10):
        adc_reading = vsys_adc.read_u16()
        adc_voltage = (adc_reading / 65535) * 3.3
        vsys_voltage = adc_voltage * 3
        readings.append(vsys_voltage)
        time.sleep_ms(10)  # Small delay between readings
    
    # Return average of readings
    return sum(readings) / len(readings)

def log_voltage(voltage):
    """Log voltage with timestamp"""
    timestamp = time.time()
    voltage_log.append((timestamp, voltage))
    
    # Keep only the most recent entries
    if len(voltage_log) > MAX_LOG_ENTRIES:
        voltage_log.pop(0)

def get_voltage_stats():
    """Calculate voltage statistics"""
    if not voltage_log:
        return None
    
    voltages = [v for t, v in voltage_log]
    return {
        'min': min(voltages),
        'max': max(voltages),
        'avg': sum(voltages) / len(voltages),
        'count': len(voltages)
    }

def display_status(voltage):
    """Display voltage with status indicators"""
    print(f"VSYS: {voltage:.3f}V", end="")
    
    if voltage < 2.5:
        print(" 🔴 CRITICAL")
    elif voltage < 3.0:
        print(" 🟡 LOW")
    elif voltage > 5.2:
        print(" 🔴 HIGH")
    else:
        print(" 🟢 OK")

print("Enhanced VSYS Voltage Monitor")
print("============================")
print()

try:
    while True:
        # Read and log voltage
        voltage = read_vsys_voltage()
        log_voltage(voltage)
        
        # Display current reading
        display_status(voltage)
        
        # Show statistics every 10 readings
        if len(voltage_log) % 10 == 0:
            stats = get_voltage_stats()
            if stats:
                print(f"  Stats - Min: {stats['min']:.3f}V, "
                      f"Max: {stats['max']:.3f}V, "
                      f"Avg: {stats['avg']:.3f}V "
                      f"({stats['count']} readings)")
        
        time.sleep(2)
        
except KeyboardInterrupt:
    print("\nFinal Statistics:")
    stats = get_voltage_stats()
    if stats:
        print(f"Min: {stats['min']:.3f}V")
        print(f"Max: {stats['max']:.3f}V") 
        print(f"Average: {stats['avg']:.3f}V")
        print(f"Total readings: {stats['count']}")
    print("Monitoring stopped")
```

## Key Concepts Explained

### ADC Resolution
The Pico's ADC provides 16-bit resolution (0-65535), giving precise voltage measurements.

### Voltage Divider
The internal voltage divider divides VSYS by 3, allowing measurement of voltages up to ~10V safely.

### Reference Voltage
The ADC uses 3.3V as its reference voltage, so the maximum measurable voltage at the ADC input is 3.3V.

## Practical Applications

* **Battery Monitoring**: Track battery voltage in portable projects
* **Power Supply Validation**: Ensure your power supply is delivering correct voltage
* **Low Battery Warnings**: Implement automatic shutdown when voltage gets too low
* **Data Logging**: Record voltage over time for analysis

## Troubleshooting

**Problem**: Readings seem inaccurate
**Solution**: Take multiple readings and average them, ensure good connections

**Problem**: Voltage reads 0V
**Solution**: Check that VSYS is properly powered, verify code is using ADC(3)

**Problem**: Readings are noisy
**Solution**: Add filtering (averaging multiple readings) or use a capacitor on VSYS

## Extension Activities

1. Create a voltage alarm that lights an LED when voltage is too low
2. Log voltage data to a file for later analysis
3. Create a simple voltmeter display using an OLED screen
4. Implement automatic power management based on voltage levels

## Safety Notes

* Never exceed 5.5V on VSYS
* Be careful when connecting external power supplies
* Always verify polarity before connecting power
* Use appropriate current limiting if needed

This lesson provides a foundation for understanding power monitoring in embedded systems and demonstrates practical ADC usage in MicroPython.

## References

[VSYS on the Raspberry Pi Forum](https://forums.raspberrypi.com/viewtopic.php?t=301152)
