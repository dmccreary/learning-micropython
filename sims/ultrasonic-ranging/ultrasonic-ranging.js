// Ultrasonic Ranging (HC-SR04) MicroSim
// CANVAS_HEIGHT: 450
// Students drag a wall to change the distance; the sim emits a pulse that travels
// out, bounces, and returns, then reports the echo duration and the distance
// computed with distance = duration / 58. A temperature slider changes the speed
// of sound.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// State
let sensorX = 70;
let sensorY = 175;
let wallX = 280;
let dragging = false;
let pulseTravel = 0;
let mouseOverCanvas = false;

let tempSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  tempSlider = createSlider(0, 40, 20, 1);
  tempSlider.position(sliderLeftMargin, drawHeight + 10);
  tempSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('An ultrasonic ranging simulation. An HC-SR04 sensor on the left ' +
    'sends a pulse that travels to a draggable wall and back. The echo duration ' +
    'and the distance (duration / 58) are shown on the right, and a temperature ' +
    'slider changes the speed of sound.', LABEL);
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

  let temp = tempSlider.value();
  let v = 343 + 0.6 * (temp - 20);   // speed of sound (m/s)

  let panelLeft = canvasWidth * 0.64;
  let wallMin = sensorX + 40;
  let wallMax = panelLeft - 35;
  wallX = constrain(wallX, wallMin, wallMax);

  // distance from pixels
  let dCm = map(wallX, wallMin, wallMax, 5, 400);
  // round-trip duration in microseconds: t = 2d/v
  let durationUs = (2 * (dCm / 100) / v) * 1e6;
  let calcCm = durationUs / 58;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Ultrasonic Ranging with the HC-SR04', canvasWidth * 0.42, 8);

  // ground line
  stroke('silver');
  strokeWeight(1);
  line(margin, 300, panelLeft - 10, 300);
  noStroke();

  // Pulse animation
  let wallDistPx = wallX - sensorX;
  if (mouseOverCanvas) {
    pulseTravel += map(v, 343 - 12, 343 + 12, 3.5, 4.5);
    if (pulseTravel > 2 * wallDistPx) pulseTravel = 0;
  }
  drawPulse(wallDistPx);

  // Sensor (HC-SR04: two "eyes")
  drawSensor();

  // Wall
  drawWall();

  // Distance dimension line
  stroke('gray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(sensorX, 250, wallX, 250);
  drawingContext.setLineDash([]);
  noStroke();
  fill('dimgray');
  textAlign(CENTER, BOTTOM);
  textSize(13);
  text(dCm.toFixed(0) + ' cm', (sensorX + wallX) / 2, 246);

  // Right panel
  drawPanel(panelLeft, durationUs, calcCm, dCm, v, temp);

  // Control label
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Air temperature: ' + temp + ' °C', 10, drawHeight + 22);
}

function drawSensor() {
  fill('darkslateblue');
  stroke('black');
  strokeWeight(1);
  rectMode(CENTER);
  rect(sensorX, sensorY, 44, 60, 4);
  rectMode(CORNER);
  noStroke();
  fill('silver');
  ellipse(sensorX, sensorY - 13, 22, 22);
  ellipse(sensorX, sensorY + 13, 22, 22);
  fill('black');
  textAlign(CENTER, TOP);
  textSize(11);
  text('HC-SR04', sensorX, sensorY + 34);
}

function drawWall() {
  let hot = dragging || (abs(mouseX - wallX) < 16 && mouseY > 120 && mouseY < 300);
  fill(hot ? 'peru' : 'sienna');
  stroke('saddlebrown');
  strokeWeight(2);
  rect(wallX - 8, 110, 16, 190);
  noStroke();
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(11);
  text('wall', wallX, 302);
  text('(drag)', wallX, 315);
}

function drawPulse(wallDistPx) {
  let outgoing = pulseTravel <= wallDistPx;
  let r = outgoing ? pulseTravel : (pulseTravel - wallDistPx);
  noFill();
  for (let k = 0; k < 3; k++) {
    let rr = r - k * 14;
    if (rr <= 0) continue;
    let alpha = map(k, 0, 2, 200, 60);
    if (outgoing) {
      stroke(30, 90, 200, alpha);
      strokeWeight(2);
      arc(sensorX, sensorY, rr * 2, rr * 2, -PI / 3, PI / 3);
    } else {
      stroke(200, 80, 30, alpha);
      strokeWeight(2);
      arc(wallX, sensorY, rr * 2, rr * 2, 2 * PI / 3, 4 * PI / 3);
    }
  }
  noStroke();
  // hint when paused
  if (!mouseOverCanvas) {
    fill('gray');
    textAlign(LEFT, CENTER);
    textSize(12);
    text('hover to send a pulse', sensorX + 30, sensorY - 45);
  }
}

function drawPanel(px, durationUs, calcCm, actualCm, v, temp) {
  let pw = canvasWidth - px - margin;
  let py = 60;
  fill(255, 255, 255, 240);
  stroke('silver');
  strokeWeight(1);
  rect(px, py, pw, 230, 10);
  noStroke();

  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Echo duration', px + 14, py + 12);
  fill('navy');
  textStyle(BOLD);
  textSize(22);
  text(durationUs.toFixed(0) + ' µs', px + 14, py + 28);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(13);
  text('Distance = duration / 58', px + 14, py + 64);
  fill('darkgreen');
  textStyle(BOLD);
  textSize(22);
  text(calcCm.toFixed(1) + ' cm', px + 14, py + 80);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(13);
  text('Actual distance', px + 14, py + 116);
  fill('black');
  textSize(16);
  text(actualCm.toFixed(0) + ' cm', px + 14, py + 132);

  fill('dimgray');
  textSize(13);
  text('Speed of sound', px + 14, py + 162);
  fill('black');
  textSize(15);
  text(v.toFixed(1) + ' m/s', px + 14, py + 178);
  textSize(11);
  fill('gray');
  text('at ' + temp + ' °C  (343 + 0.6×(T−20))', px + 14, py + 200, pw - 28);
}

function mousePressed() {
  if (abs(mouseX - wallX) < 16 && mouseY > 110 && mouseY < 300) {
    dragging = true;
  }
}

function mouseDragged() {
  if (dragging) wallX = mouseX;
}

function mouseReleased() {
  dragging = false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  tempSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
