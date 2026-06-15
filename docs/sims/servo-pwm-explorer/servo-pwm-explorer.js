// Servo PWM Explorer MicroSim
// CANVAS_HEIGHT: 495
// Students set a servo angle and see the arm rotate, the PWM pulse width within
// the 20 ms (50 Hz) period, and the duty_u16 value to use in MicroPython. Min and
// max pulse sliders allow calibration practice.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 115;  // 3 slider rows
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 220;
let defaultTextSize = 16;

// Controls
let angleSlider, minSlider, maxSlider;
let displayAngle = 90;  // animated toward target

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  angleSlider = createSlider(0, 180, 90, 1);
  angleSlider.position(sliderLeftMargin, drawHeight + 8);
  angleSlider.size(canvasWidth - sliderLeftMargin - margin);

  minSlider = createSlider(500, 1500, 500, 10);
  minSlider.position(sliderLeftMargin, drawHeight + 43);
  minSlider.size(canvasWidth - sliderLeftMargin - margin);

  maxSlider = createSlider(1600, 2500, 2500, 10);
  maxSlider.position(sliderLeftMargin, drawHeight + 78);
  maxSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('A servo PWM explorer. An angle slider rotates a servo arm on the left. ' +
    'The center shows the PWM waveform with the 20 ms period and the highlighted ' +
    'pulse width. The right panel shows the angle, pulse width in microseconds, and ' +
    'the duty_u16 value. Min and max pulse sliders allow calibration.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  let angle = angleSlider.value();
  let minPulse = minSlider.value();
  let maxPulse = maxSlider.value();
  if (maxPulse <= minPulse) maxPulse = minPulse + 10;

  // Smoothly rotate the arm toward the target angle
  displayAngle = lerp(displayAngle, angle, 0.2);

  let pulseUs = minPulse + (angle / 180) * (maxPulse - minPulse);
  let duty = Math.round(pulseUs / 20000 * 65535);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Servo Angle → PWM → duty_u16', canvasWidth / 2, 8);

  // Servo (left)
  drawServo(canvasWidth * 0.20, 200, displayAngle);

  // PWM waveform (center)
  drawWaveform(canvasWidth * 0.40, 110, canvasWidth * 0.30, 130, pulseUs);

  // Numeric panel (right)
  drawPanel(canvasWidth * 0.72, angle, pulseUs, duty);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Angle: ' + angle + '°', 10, drawHeight + 18);
  text('Min pulse (µs): ' + minPulse, 10, drawHeight + 53);
  text('Max pulse (µs): ' + maxPulse, 10, drawHeight + 88);
}

function drawServo(cx, cy, angle) {
  // body
  fill('dimgray');
  stroke('black');
  strokeWeight(1);
  rectMode(CENTER);
  rect(cx, cy, 80, 56, 4);
  // mounting tabs
  fill('gray');
  rect(cx, cy - 36, 100, 10, 2);
  rect(cx, cy + 36, 100, 10, 2);
  rectMode(CORNER);

  // hub
  fill('white');
  stroke('black');
  ellipse(cx, cy - 6, 18, 18);

  // arm: 0deg points left, 180deg points right, 90 up
  let sa = radians(map(angle, 0, 180, 180, 0));
  let armLen = 64;
  let ax = cx + cos(sa) * armLen;
  let ay = (cy - 6) - sin(sa) * armLen;
  stroke('crimson');
  strokeWeight(7);
  line(cx, cy - 6, ax, ay);
  noStroke();
  fill('crimson');
  ellipse(ax, ay, 12, 12);

  // angle arc indicator
  noFill();
  stroke('gray');
  strokeWeight(1);
  arc(cx, cy - 6, 110, 110, -PI, 0);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(12);
  text(round(angle) + '°', cx, cy + 30);
  text('Servo', cx, cy + 46);
}

function drawWaveform(x, y, w, h, pulseUs) {
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 6);
  noStroke();
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(12);
  text('Period = 20 ms (50 Hz)', x + w / 2, y + 4);

  let plotX = x + 10;
  let plotW = w - 20;
  let highY = y + 34;
  let lowY = y + h - 28;

  let frac = pulseUs / 20000;
  let pulseW = frac * plotW;

  // highlight pulse region
  noStroke();
  fill(255, 235, 120);
  rect(plotX, highY, pulseW, lowY - highY);

  // waveform: HIGH for pulse, then LOW
  stroke('blue');
  strokeWeight(2);
  noFill();
  beginShape();
  vertex(plotX, lowY);
  vertex(plotX, highY);
  vertex(plotX + pulseW, highY);
  vertex(plotX + pulseW, lowY);
  vertex(plotX + plotW, lowY);
  endShape();

  // level labels (placed in the empty right region where the signal is LOW)
  noStroke();
  fill('silver');
  textSize(10);
  textAlign(RIGHT, CENTER);
  text('HIGH', plotX + plotW - 4, highY);
  text('LOW', plotX + plotW - 4, lowY - 12);
  // time-axis labels
  fill('dimgray');
  textAlign(LEFT, TOP);
  text('0 ms', plotX, lowY + 4);
  textAlign(RIGHT, TOP);
  text('20 ms', plotX + plotW, lowY + 4);
  // pulse annotation, to the right of the narrow pulse
  fill('darkgoldenrod');
  textAlign(LEFT, CENTER);
  textSize(12);
  text('← ' + pulseUs.toFixed(0) + ' µs pulse', plotX + pulseW + 6, highY + 10);
}

function drawPanel(px, angle, pulseUs, duty) {
  let pw = canvasWidth - px - margin;
  let py = 90;
  fill(255, 255, 255, 240);
  stroke('silver');
  strokeWeight(1);
  rect(px, py, pw, 180, 10);
  noStroke();

  fill('dimgray'); textAlign(LEFT, TOP); textSize(13);
  text('Angle', px + 12, py + 12);
  fill('black'); textStyle(BOLD); textSize(22);
  text(angle + '°', px + 12, py + 28);
  textStyle(NORMAL);

  fill('dimgray'); textSize(13);
  text('Pulse width', px + 12, py + 64);
  fill('darkgoldenrod'); textStyle(BOLD); textSize(22);
  text(pulseUs.toFixed(0) + ' µs', px + 12, py + 80);
  textStyle(NORMAL);

  fill('dimgray'); textSize(13);
  text('duty_u16', px + 12, py + 116);
  fill('navy'); textStyle(BOLD); textSize(22);
  text(duty, px + 12, py + 132);
  textStyle(NORMAL);

  fill('gray'); textSize(11);
  textFont('monospace');
  text('servo.duty_u16(' + duty + ')', px + 12, py + 162, pw - 20);
  textFont('Arial');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  angleSlider.size(canvasWidth - sliderLeftMargin - margin);
  minSlider.size(canvasWidth - sliderLeftMargin - margin);
  maxSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
