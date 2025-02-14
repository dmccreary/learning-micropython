# Sample hardware configuration file for the Cytron Maker Pi RP2040 board

# SPIN OLED Display Connections
# VCC, GND Clock and Data are on Grove Port 2
SPI_CLK_PIN = 2
SPI_SDA_PIN = 3
# We are using the servo data pins on the Cytron board
SPI_CS_PIN = 13
SPI_DC_PIN = 14
SPI_RESET_PIN = 15

# I2C Connections for the Time of Flight Sensor on Grove Port 1
I2C_BUS = 0
I2C_SDA_PIN = 0 # white Grove wire
I2C_SCL_PIN = 1 # yellow Grove wire
# use the following line to create the I2C object
# i2c=machine.I2C(I2C_BUS,sda=Pin(I2C_SDA_PIN), scl=Pin(I2C_SCL_PIN), freq=400000)

# Speaker Pin
SPEAKER_PIN = 22

# Motor Pins
MOTOR_RIGHT_FORWARD = 11
MOTOR_RIGHT_BACKWARD = 10
MOTOR_LEFT_FORWARD = 8
MOTOR_LEFT_REVERSE = 9