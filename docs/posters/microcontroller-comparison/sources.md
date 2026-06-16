# Sources — Microcontroller Comparison Infographic

Every numeric claim in the infographic traces to an official manufacturer
source below. Verified June 2026.

## Raspberry Pi Pico (RP2040)

- **Price $4, RAM 264 KB, Clock 133 MHz, 26 GPIO, no wireless** —
  Raspberry Pi official product page and RP2040 specifications.
  - <https://www.raspberrypi.com/products/raspberry-pi-pico/>
  - <https://www.raspberrypi.com/products/rp2040/specifications/>
  - Quote: "Dual-core Arm Cortex-M0+ … running up to 133 MHz, 264kB of SRAM,
    26 GPIO pins … from just $4."

## Raspberry Pi Pico W (RP2040)

- **Price $6, RAM 264 KB, Clock 133 MHz, 26 GPIO, Wi-Fi 802.11n (2.4 GHz) +
  Bluetooth 5.2** — Raspberry Pi official announcement.
  - <https://www.raspberrypi.com/news/raspberry-pi-pico-w-your-6-iot-platform/>
  - <https://www.raspberrypi.com/news/new-functionality-bluetooth-for-pico-w/>
  - Quote: "Pico W's wireless functionality is provided by the Infineon
    CYW43439 device, which contains a 2.4 GHz radio providing both 802.11n
    Wi-Fi and Bluetooth 5.2."

## Raspberry Pi Pico 2 (RP2350)

- **Price $5, RAM 520 KB, Clock 150 MHz, 26 GPIO, no wireless** —
  Raspberry Pi official product page / RP2350 launch coverage.
  - <https://www.raspberrypi.com/products/raspberry-pi-pico-2/>
  - <https://www.cnx-software.com/2024/08/08/raspberry-pi-pico-2-raspberry-pi-rp2350-dual-core-risc-v-or-arm-cortex-m33-microcontroller/>
  - Quote: "$5 Raspberry Pi Pico 2 … RP2350 … 150 MHz … 520 KB of SRAM …
    dual-core RISC-V or Arm Cortex-M33."

## ESP32 (WROOM-32)

- **RAM 520 KB, Clock 240 MHz, 34 GPIO, Wi-Fi 802.11 b/g/n + Bluetooth 4.2** —
  Espressif datasheet / Wikipedia summary of Espressif data. Price ~$6 is a
  typical DevKitC street price and is marked approximate because ESP32 board
  prices vary by vendor.
  - <https://en.wikipedia.org/wiki/ESP32>
  - <https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf>
  - Quote: "Dual-core Tensilica Xtensa LX6 … up to 240 MHz … 520 KiB SRAM …
    34 GPIO … Wi-Fi 802.11 b/g/n and Bluetooth v4.2 BR/EDR and BLE."

## Verification notes

- **Pico 2 price:** $5 is the official Raspberry Pi launch price. Some
  third-party retailers list higher prices (~$10); the official price is used.
- **Pico W Wi-Fi band:** 2.4 GHz 802.11n only. Some marketplace listings claim
  "2.4/5 GHz" — this is incorrect; the CYW43439 radio is 2.4 GHz only.
- **ESP32 price:** approximate (~$6) due to wide vendor variation; marked with
  "~" in the infographic.
- **Asymmetry preserved:** Pico and Pico 2 have no wireless. Those cells read
  "None" — no wireless capability was invented to balance the columns.
