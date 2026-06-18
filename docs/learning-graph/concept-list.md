# Learning MicroPython — Concept List

Total concepts: 420

---

## Foundation Concepts

1. Computer Program
2. Source Code
3. Variable
4. Data Type
5. Integer
6. Float
7. String
8. Boolean
9. List
10. Dictionary
11. Tuple
12. Conditional Statement
13. If-Else Statement
14. For Loop
15. While Loop
16. Function Definition
17. Function Call
18. Return Value
19. Module Import
20. Python Syntax
21. Indentation in Python
22. Comment in Code
23. Print Statement
24. Input Validation
25. Error and Exception
26. Try-Except Block
27. Arithmetic Operators
28. Comparison Operators
29. Logical Operators
30. Assignment Operators

## MicroPython Environment

31. MicroPython
32. MicroPython REPL
33. MicroPython Firmware
34. Flashing Firmware
35. Thonny IDE
36. VS Code IDE
37. Thonny File Manager
38. mpremote Tool
39. rshell Tool
40. File Transfer to Pico
41. MicroPython Interpreter
42. Interactive Mode
43. Script Mode
44. Boot.py File
45. Main.py File
46. MicroPython Modules
47. MicroPython Standard Library
48. uos Module
49. utime Module
50. sys Module
486. mip Package Manager

## Microcontrollers and Hardware Platforms

51. Microcontroller
52. Raspberry Pi Pico
53. Raspberry Pi Pico W
54. RP2040 Chip
55. ESP32 Microcontroller
56. ESP8266 Microcontroller
57. Cytron Maker Pi RP2040
58. Maker Pi Pico
59. Maker Nano RP2040
60. Raspberry Pi 500 Keyboard
61. Micro:bit
62. GPIO Pin
63. GPIO Numbering
64. Pin Modes (Input/Output)
65. Pull-Up Resistor
66. Pull-Down Resistor
67. USB Connection
68. USB Power
69. 3.3V Logic Level
70. 5V Logic Level
71. Ground (GND)
72. VSYS Pin
73. VBUS Pin
74. Pico W Wireless Module
75. RP2040 Dual Core
76. RP2040 PIO (Programmable I/O)
77. Flash Memory on Pico
78. RAM on Pico

## Electronics Fundamentals

79. Voltage
80. Current
81. Resistance
82. Ohm's Law
83. Power (Watts)
84. Series Circuit
85. Parallel Circuit
86. Short Circuit
87. Current-Limiting Resistor
88. Resistor Color Code
89. Capacitor
90. LED (Light Emitting Diode)
91. LED Forward Voltage
92. LED Current Rating
93. Transistor
94. NPN Transistor
95. MOSFET
96. Diode
97. Breadboard
98. Breadboard Rails
99. Breadboard Rows
100. Jumper Wire
101. Multimeter
102. Continuity Test
103. Wiring Diagram
104. Schematic Symbol
105. Power Supply

## Digital Input and Output

106. Digital Output
107. Digital Input
108. HIGH and LOW States
109. machine.Pin Class
110. Pin.OUT Mode
111. Pin.IN Mode
112. Pin.value() Method
113. LED Blink Program
114. Button Input
115. Button Debouncing
116. Software Debouncing
117. Hardware Debouncing
118. Active High vs Active Low
119. Internal LED
120. External LED Circuit

## Analog Input and Output

121. Analog Signal
122. Digital Signal
123. Analog-to-Digital Converter (ADC)
124. ADC Resolution (bits)
125. machine.ADC Class
126. ADC.read_u16() Method
127. ADC Voltage Reference
128. Potentiometer
129. Potentiometer as Voltage Divider
130. Voltage Divider Circuit
131. Reading Analog Values
132. Scaling ADC Values
133. Light Sensor (Photoresistor)
134. LDR (Light-Dependent Resistor)

## Pulse-Width Modulation (PWM)

135. Pulse-Width Modulation (PWM)
136. PWM Frequency
137. PWM Duty Cycle
138. machine.PWM Class
139. PWM.duty_u16() Method
140. LED Fade with PWM
141. Brightness Control
142. PWM for Servo Control
143. PWM for Motor Speed
144. Soft PWM

## Communication Protocols

145. I2C Protocol
146. I2C Bus SDA and SCL
147. I2C Address
148. I2C Scanner
149. machine.I2C Class
150. I2C.scan() Method
151. I2C.writeto() Method
152. I2C.readfrom() Method
153. SPI Protocol
154. SPI Bus Pins (MOSI MISO SCK CS)
155. machine.SPI Class
156. SPI.write() Method
157. SPI.read() Method
158. UART Protocol
159. machine.UART Class
160. 1-Wire Protocol
161. I2S Protocol
162. I2S for Audio
163. machine.I2S Class
164. Bus Frequency Setting

## Sensors — Temperature and Humidity

165. DHT11 Sensor
166. DHT22 Sensor
167. dht Module in MicroPython
168. DHT.measure() Method
169. DHT.temperature() Method
170. DHT.humidity() Method
171. BME280 Sensor
172. BME280 Temperature Reading
173. BME280 Humidity Reading
174. BME280 Pressure Reading
175. BME280 I2C Driver
176. DS18B20 Temperature Sensor
177. DS18B20 1-Wire Interface
178. DS18B20 Multiple Sensors
179. onewire Module
180. ds18x20 Module

## Sensors — Distance and Proximity

181. HC-SR04 Ultrasonic Sensor
182. HC-SR04 Trigger Pin
183. HC-SR04 Echo Pin
184. Speed of Sound Calculation
185. Ultrasonic Ranging Formula
186. VL53L0X Time-of-Flight Sensor
187. VL53L0X I2C Driver
188. VL53L0X.range Property
189. Time-of-Flight Measurement
190. IR Distance Sensor
191. IR Emitter and Detector
192. Collision Avoidance Logic

## Sensors — Light and Color

193. Photoresistor (LDR)
194. APDS9960 Gesture Sensor
195. APDS9960 Color Detection
196. APDS9960 Proximity Detection
197. APDS9960 I2C Driver
198. Color Sensing Principles
199. Ambient Light Sensing

## Sensors — Motion and Orientation

200. Accelerometer
201. ADXL345 Accelerometer
202. MPU6050 Accelerometer/Gyroscope
203. Accelerometer X/Y/Z Axes
204. Tilt Detection
205. HMC5883L Compass Sensor
206. QMC5883L Compass Sensor
207. Compass Heading Calculation
208. Magnetic Field Sensing
209. Gyroscope
210. IMU (Inertial Measurement Unit)

## Sensors — Encoders and Touch

211. Rotary Encoder
212. Rotary Encoder CLK and DT Pins
213. Encoder Interrupt Handler
214. Quadrature Encoding
215. rotary Module
216. Touch Sensor TTP223
217. Capacitive Touch Sensing
218. Touch.value() Method

## Sensors — Audio Input

219. Microphone INMP441
220. INMP441 I2S Interface
221. Sound Level Detection
222. Microphone Sensitivity
223. Audio Sampling Rate
224. Fast Fourier Transform (FFT)
225. Spectrum Analyzer Concept

## Motors and Actuators

226. DC Motor
227. Motor Direction Control
228. Motor Speed Control
229. H-Bridge Circuit
230. L293D Motor Driver IC
231. DRV8833 Motor Driver IC
232. L298N Motor Driver IC
233. Transistor Motor Control
234. Motor Stall Current
235. Motor Free-Run Current
236. Back-EMF Protection
237. Flyback Diode

## Servos and Steppers

238. Servo Motor
239. Servo Signal (50Hz PWM)
240. Servo Angle Control
241. Servo Min/Max Pulse Width
242. machine.PWM for Servo
243. Continuous Rotation Servo
244. Stepper Motor
245. Stepper Motor Phases
246. Half-Step vs Full-Step
247. Stepper Driver (ULN2003)
248. Stepper Steps Per Revolution

## Robots

249. Robot Chassis
250. Differential Drive
251. Forward/Backward Motion
252. Left/Right Turn Control
253. Line Follower Robot
254. Line Sensor (IR)
255. Collision Avoidance Robot
256. Obstacle Detection
257. Robot Calibration
258. Motor Deadband
259. Robot Speed Tuning
260. Ping-Servo Scanner
261. MicroSwitch Bumper Bot

## NeoPixels and LEDs

262. NeoPixel LED
263. WS2812B Protocol
264. NeoPixel Strip
265. NeoPixel Matrix
266. neopixel Module
267. NeoPixel.fill() Method
268. NeoPixel.show() Method
269. RGB Color Model
270. HSV Color Model
271. Color Wheel Animation
272. Rainbow Pattern
273. Brightness Scaling
274. LED Strip Wiring
275. NeoPixel Power Requirements
276. Level Shifter for NeoPixel

## Displays — Non-Graphical

277. LED as Output Indicator
278. 7-Segment Display
279. 7-Segment Digit Encoding
280. 10-Bar LED Array
281. LED Level Meter
282. 8x8 LED Matrix
283. MAX7219 LED Driver
284. MAX7219 SPI Interface
285. MAX7219 Intensity Control
286. Character LCD Display
287. LCD 16x2
288. LCD PCF8574 I2C Backpack
289. lcd_api Module
290. LCD Cursor Control
291. 4-Digit 7-Segment Display
292. TM1637 Display Driver

## Displays — OLED

293. OLED Display
294. OLED SSD1306 Controller
295. SSD1306 I2C Interface
296. SSD1306 SPI Interface
297. SSD1306 128x64 Resolution
298. SSD1306 128x32 Resolution
299. ssd1306 Module
300. SSD1306_I2C Class
301. SSD1306_SPI Class
302. OLED SH1106 Controller
303. SH1106 I2C Interface
304. sh1106 Module
305. OLED SSD1352 Controller
306. OLED Framebuffer
307. oled.text() Method
308. oled.fill() Method
309. oled.show() Method
310. oled.pixel() Method
311. oled.line() Method
312. oled.rect() Method
313. oled.fill_rect() Method
314. OLED Bounce Animation
315. OLED Pong Game
316. OLED Real-Time Sensor Display

## Displays — Color and TFT

317. TFT Display
318. ILI9341 TFT Driver
319. ILI9341 SPI Interface
320. ILI9341 Color Depth (16-bit)
321. ST7789V Color LCD Driver
322. ST7789V SPI Interface
323. ST7789V Resolution
324. Graphic LCD (CU1609C)
325. Waveshare LCD
326. Framebuf Module
327. framebuf.FrameBuffer Class
328. framebuf.MONO_HLSB Format
329. framebuf.RGB565 Format
330. Bitmap Drawing
331. Custom Drawing Functions
332. Screen Coordinate System
333. HSTX Display Interface
334. Display Color Formats

## Displays — E-Paper

335. E-Paper Display
336. E-Ink Technology
337. E-Paper Refresh Rate
338. E-Paper Low Power
339. E-Paper SPI Interface
340. Waveshare E-Paper Driver

## Sound and Audio

341. Passive Buzzer
342. Active Buzzer
343. Tone Generation
344. Musical Note Frequencies
345. Play a Scale
346. Play a Melody
347. Mario Theme Program
348. Eight-Key Piano Program
349. WAV Audio File
350. MP3 to WAV Conversion
351. Audio Playback
352. I2S Audio Output
353. I2S Standard
354. DAC (Digital-to-Analog Converter)
355. MIDI Protocol
356. Sound Parts List
357. Audio Amplifier
358. Speaker Wiring

## Wireless and IoT

359. Wi-Fi Basics
360. SSID and Password
361. network Module
362. network.WLAN Class
363. WLAN.connect() Method
364. WLAN.isconnected() Method
365. IP Address
366. MAC Address
367. HTTP Protocol
368. HTTP GET Request
369. urequests Module
370. JSON Parsing
371. ujson Module
372. Web Server on Pico W
373. socket Module
374. socket.socket() Class
375. TCP vs UDP
376. REST API Basics
377. Weather API Integration
378. NTP Time Sync
379. WiFi Clock Project
380. Web Server NeoPixel Control
381. upip Package Manager
382. Over-the-Air Update Concept

## Advanced MicroPython

383. Interrupt Handler
384. IRQ (Interrupt Request)
385. Pin.irq() Method
386. Timer Class
387. machine.Timer
388. Timer Callback
389. Periodic vs One-Shot Timer
390. Non-Blocking Programming
391. Blocking vs Non-Blocking
392. machine.time_pulse_us()
393. utime.sleep()
394. utime.ticks_ms()
395. utime.ticks_diff()
396. Multi-Core Programming
397. _thread Module
398. Core 0 and Core 1
399. Shared Memory Between Cores
400. Memory Management
401. Garbage Collection
402. gc Module
403. Heap Memory
404. Stack Memory

## File System and OS

405. MicroPython File System
406. open() Function
407. File Read and Write
408. os.listdir() Method
409. os.mkdir() Method
410. os.remove() Method
411. SD Card Reader
412. SPI SD Card Interface
413. uos Module
414. Persistent Storage

## Debugging and Troubleshooting

415. Debugging Strategy
416. Print Debugging
417. Error Message Reading
418. Traceback Interpretation
419. I2C Debugging
420. SPI Debugging
421. Debugging with Thonny
422. Stack Trace Viewer
423. Heap Viewer
424. Minicom Serial Monitor
425. Logic Probe
426. Common Wiring Errors

## Advanced Hardware Topics

427. PIO (Programmable I/O) State Machine
428. PIO Assembly Language
429. PIO for WS2812B
430. Assembler in MicroPython
431. FFT Algorithm
432. FFT Optimization
433. DMA (Direct Memory Access)
434. Frame Buffer
435. I2C Scanner Program
436. String Formatting
437. Conda Virtual Environment
438. CircuitPython vs MicroPython
439. mpremote File Commands
440. Measuring Battery Voltage
441. VSYS Voltage Measurement
442. Watchdog Timer
443. RTC (Real-Time Clock)
444. Low-Power Sleep Mode

## AI and Prompt Engineering

445. Generative AI for Coding
446. Prompt Engineering Basics
447. AI Code Generation
448. AI Code Review
449. Debugging with AI
450. AI Concept Explanation
451. AI Hardware Suggestion

## Educational Kits

452. Maker Pi RP2040 Kit
453. Maker Pi Pico Kit
454. Maker Nano RP2040 Kit
455. PWM Kit Project
456. Tone Generator Kit
457. Spectrum Analyzer Kit
458. NeoPixel Rotary Kit
459. Larson Scanner Kit
460. RFID RC522 Module
461. RFID RC522 SPI Interface
462. RFID Card Reading
463. Moving Rainbow Project

## Computational Thinking

464. Decomposition
465. Pattern Recognition
466. Abstraction
467. Algorithm Design
468. Pseudocode
469. Flowchart
470. Loop Invariant
471. State Machine
472. Event-Driven Programming
473. Modular Programming

## Project Design and Build

474. Project Requirements
475. Prototype Design
476. Breadboard Prototype
477. Wiring Diagram Creation
478. Component Selection
479. Bill of Materials (BOM)
480. Solderless Assembly
481. Code Organization
482. Version Control Basics
483. Git Basics
484. README Documentation
485. Project Demonstration
