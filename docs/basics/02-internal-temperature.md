# Raspberry Pi Pico Internal Temperature Sensor

## Learning Objectives

By the end of this lesson, students will be able to:

- Understand how the Raspberry Pi Pico's internal temperature sensor works
- Use the `machine` module to access the ADC (Analog to Digital Converter)
- Convert raw ADC readings to temperature values in Celsius and Fahrenheit
- Display temperature readings on the Thonny console
- Implement a continuous temperature monitoring loop

## Prerequisites

- Basic understanding of Python programming
- Familiarity with MicroPython on the Raspberry Pi Pico
- Thonny IDE installed and configured for the Pico
- Understanding of variables, loops, and basic math operations

## Background Information

### What is the Internal Temperature Sensor?

The Raspberry Pi Pico includes a built-in temperature sensor connected to the RP2040 chip's fourth ADC channel. This sensor measures the temperature of the chip itself, which is typically a few degrees warmer than the ambient (room) temperature.

### Key Concepts

**ADC (Analog to Digital Converter)**: A component that converts analog signals (like temperature) into digital values that the microcontroller can process.

**Temperature Sensor**: The Pico's internal sensor provides a voltage that changes with temperature. We need to convert this voltage reading into actual temperature values.

**Voltage Reference**: The Pico uses a 3.3V reference voltage for its ADC readings.

## Materials Needed

- Raspberry Pi Pico
- USB cable
- Computer with Thonny IDE
- MicroPython firmware installed on the Pico

## Lesson Steps

### Step 1: Understanding the Hardware

The internal temperature sensor is already built into the RP2040 chip. Unlike external sensors, we don't need to wire anything - we just need to access it through code using ADC channel 4.

### Step 2: Basic Temperature Reading

Let's start with a simple program to read the temperature once:

```python
import machine
import time

# Create an ADC object for the internal temperature sensor
# The internal temperature sensor is on ADC channel 4
temp_sensor = machine.ADC(4)

# Read the raw ADC value (0-65535)
raw_value = temp_sensor.read_u16()

# Convert to voltage (0-3.3V)
voltage = raw_value * (3.3 / 65535)

# Convert voltage to temperature in Celsius
# Formula from RP2040 datasheet
temp_celsius = 27 - (voltage - 0.706) / 0.001721

print(f"Raw ADC value: {raw_value}")
print(f"Voltage: {voltage:.3f}V")
print(f"Temperature: {temp_celsius:.1f}°C")
```

### Step 3: Continuous Temperature Monitoring

Now let's create a program that continuously monitors and displays the temperature:

```python
import machine
import time

def read_temperature():
    """
    Read the internal temperature sensor and return temperature in Celsius
    """
    # Create ADC object for internal temperature sensor
    temp_sensor = machine.ADC(4)
    
    # Read raw ADC value
    raw_value = temp_sensor.read_u16()
    
    # Convert to voltage
    voltage = raw_value * (3.3 / 65535)
    
    # Convert to temperature using RP2040 formula
    temp_celsius = 27 - (voltage - 0.706) / 0.001721
    
    return temp_celsius

def celsius_to_fahrenheit(celsius):
    """
    Convert Celsius to Fahrenheit
    """
    return (celsius * 9/5) + 32

print("Raspberry Pi Pico Internal Temperature Monitor")
print("Press Ctrl+C to stop")
print("-" * 40)

try:
    while True:
        # Read temperature
        temp_c = read_temperature()
        temp_f = celsius_to_fahrenheit(temp_c)
        
        # Display results
        print(f"Temperature: {temp_c:.1f}°C / {temp_f:.1f}°F")
        
        # Wait 2 seconds before next reading
        time.sleep(2)
        
except KeyboardInterrupt:
    print("\\nTemperature monitoring stopped")
```

### Step 4: Enhanced Version with Statistics

Let's create a more advanced version that tracks minimum, maximum, and average temperatures:

```python
import machine
import time

class TemperatureMonitor:
    def __init__(self):
        self.temp_sensor = machine.ADC(4)
        self.readings = []
        self.min_temp = None
        self.max_temp = None
    
    def read_temperature(self):
        """Read temperature in Celsius"""
        raw_value = self.temp_sensor.read_u16()
        voltage = raw_value * (3.3 / 65535)
        temp_celsius = 27 - (voltage - 0.706) / 0.001721
        return temp_celsius
    
    def celsius_to_fahrenheit(self, celsius):
        """Convert Celsius to Fahrenheit"""
        return (celsius * 9/5) + 32
    
    def update_statistics(self, temp):
        """Update min, max, and average temperature statistics"""
        self.readings.append(temp)
        
        # Keep only the last 10 readings for moving average
        if len(self.readings) > 10:
            self.readings.pop(0)
        
        # Update min and max
        if self.min_temp is None or temp < self.min_temp:
            self.min_temp = temp
        if self.max_temp is None or temp > self.max_temp:
            self.max_temp = temp
    
    def get_average(self):
        """Calculate average of recent readings"""
        if self.readings:
            return sum(self.readings) / len(self.readings)
        return 0
    
    def display_status(self, temp_c):
        """Display current temperature and statistics"""
        temp_f = self.celsius_to_fahrenheit(temp_c)
        avg_temp = self.get_average()
        
        print(f"Current: {temp_c:.1f}°C / {temp_f:.1f}°F")
        
        if self.min_temp is not None and self.max_temp is not None:
            print(f"Min: {self.min_temp:.1f}°C  Max: {self.max_temp:.1f}°C  Avg: {avg_temp:.1f}°C")
        
        print("-" * 50)

# Main program
monitor = TemperatureMonitor()

print("Enhanced Temperature Monitor")
print("Tracking Min/Max/Average temperatures")
print("Press Ctrl+C to stop")
print("=" * 50)

try:
    reading_count = 0
    while True:
        # Read current temperature
        current_temp = monitor.read_temperature()
        
        # Update statistics
        monitor.update_statistics(current_temp)
        
        # Display every 3 seconds
        reading_count += 1
        print(f"Reading #{reading_count}")
        monitor.display_status(current_temp)
        
        time.sleep(3)
        
except KeyboardInterrupt:
    print("\\nFinal Statistics:")
    print(f"Total readings: {len(monitor.readings)}")
    if monitor.min_temp and monitor.max_temp:
        print(f"Temperature range: {monitor.min_temp:.1f}°C to {monitor.max_temp:.1f}°C")
        print(f"Final average: {monitor.get_average():.1f}°C")
    print("Temperature monitoring stopped")
```

## Understanding the Code

### Temperature Conversion Formula

The formula `temp_celsius = 27 - (voltage - 0.706) / 0.001721` comes from the RP2040 datasheet. Here's what it means:

- `27` is the reference temperature in Celsius
- `0.706` is the reference voltage at 27°C
- `0.001721` is the temperature coefficient (how much voltage changes per degree)

### ADC Reading Process

1. **Raw Reading**: `read_u16()` returns a 16-bit value (0-65535)
2. **Voltage Conversion**: Scale the raw value to actual voltage (0-3.3V)
3. **Temperature Calculation**: Use the RP2040 formula to convert voltage to temperature

## Exercises and Extensions

### Exercise 1: Temperature Alarm
Modify the code to print a warning when the temperature exceeds a certain threshold (e.g., 35°C).

### Exercise 2: Data Logging
Save temperature readings to a file with timestamps.

### Exercise 3: Temperature Trends
Add code to detect if the temperature is rising, falling, or stable.

### Exercise 4: Multiple Temperature Units
Add support for Kelvin temperature scale.

## Troubleshooting

**Problem**: Temperature readings seem too high
**Solution**: Remember that this measures the chip temperature, which is typically warmer than room temperature due to the processor's heat.

**Problem**: Erratic readings
**Solution**: Add a small delay between readings and consider averaging multiple samples.

**Problem**: Program won't stop with Ctrl+C
**Solution**: Make sure you're using the correct exception handling with `KeyboardInterrupt`.

## Real-World Applications

- Thermal monitoring of electronic devices
- Environmental data logging
- Overheating protection systems
- Climate control systems
- Scientific data collection

## Summary

In this lesson, you learned how to:

- Access the Raspberry Pi Pico's internal temperature sensor
- Convert ADC readings to temperature values
- Create continuous monitoring programs
- Implement basic statistics tracking
- Handle user interrupts gracefully

The internal temperature sensor is a valuable tool for monitoring your Pico's operating conditions and can be the foundation for more complex environmental monitoring projects.