// Blocking vs Non-Blocking MicroSim
// CANVAS_HEIGHT: 495
// Students compare two timelines: a blocking program (long sleeps that miss button
// presses) and a non-blocking program (a fast loop that catches them). A draggable
// press marker shows MISSED vs detected, with response-latency stats.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 115;  // Play button row + 2 slider rows
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 230;
let defaultTextSize = 16;

let WINDOW = 5000;       // ms shown
let PRESS_DUR = 60;      // momentary press length (ms)
let LOOP_TICK = 20;      // non-blocking loop period (ms)

let sleepSlider, pressSlider, playButton;
let isPlaying = false;
let playT = 0;

// timeline geometry (set each frame)
let tlLeft, tlRight;
let blkY = 92, blkH = 44;
let nbY = 188, nbH = 44;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  playButton = createButton('Play animation');
  playButton.position(10, drawHeight + 8);
  playButton.mousePressed(() => { isPlaying = true; playT = 0; });

  sleepSlider = createSlider(100, 2000, 1000, 50);
  sleepSlider.position(sliderLeftMargin, drawHeight + 44);
  sleepSlider.size(canvasWidth - sliderLeftMargin - margin);

  pressSlider = createSlider(0, WINDOW, 1500, 10);
  pressSlider.position(sliderLeftMargin, drawHeight + 80);
  pressSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('A comparison of blocking and non-blocking code. The top timeline shows ' +
    'a blocking program with long sleep periods that miss a button press; the bottom ' +
    'shows a non-blocking loop that detects it within one cycle. A draggable marker ' +
    'sets the press time and the response latency is shown for each approach.', LABEL);
}

function draw() {
  updateCanvasSize();
  tlLeft = margin + 10;
  tlRight = canvasWidth - margin;

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  let sleepMs = sleepSlider.value();
  let pressT = pressSlider.value();

  if (isPlaying) { playT += deltaTime * 1.0; if (playT > WINDOW) isPlaying = false; }

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Blocking vs Non-Blocking', canvasWidth / 2, 8);

  // Blocking detection
  let blkDetect = blockingLatency(pressT, sleepMs);
  // Non-blocking detection
  let nbDetect = (Math.ceil(pressT / LOOP_TICK) * LOOP_TICK) - pressT;

  drawBlockingTimeline(sleepMs, pressT, blkDetect);
  drawNonBlockingTimeline(pressT, nbDetect);
  drawPressMarker(pressT);

  // Playhead
  if (isPlaying) {
    let x = mapT(playT);
    stroke('purple'); strokeWeight(2);
    line(x, blkY - 6, x, nbY + nbH + 6);
    noStroke();
  }

  // Stats
  drawStats(sleepMs, blkDetect, nbDetect);

  // Control labels
  fill('black'); noStroke(); textAlign(LEFT, CENTER); textSize(defaultTextSize);
  text('Sleep duration: ' + sleepMs + ' ms', 10, drawHeight + 54);
  text('Button press time: ' + pressT + ' ms', 10, drawHeight + 90);
}

function mapT(t) { return map(t, 0, WINDOW, tlLeft, tlRight); }

// Returns latency in ms if the blocking program detects the press, or -1 if MISSED
function blockingLatency(pressT, cycle) {
  // checks happen at t = 0, cycle, 2*cycle, ...; press lasts PRESS_DUR
  for (let k = 0; k * cycle <= WINDOW; k++) {
    let c = k * cycle;
    if (c >= pressT && c <= pressT + PRESS_DUR) return c - pressT;
  }
  return -1; // missed
}

function drawBlockingTimeline(sleepMs, pressT, detect) {
  fill('black'); noStroke(); textAlign(LEFT, BOTTOM); textSize(14); textStyle(BOLD);
  text('Blocking: time.sleep(' + (sleepMs / 1000).toFixed(2) + ')', tlLeft, blkY - 6);
  textStyle(NORMAL);

  // sleeping background
  fill(220, 220, 220);
  stroke('silver'); strokeWeight(1);
  rect(tlLeft, blkY, tlRight - tlLeft, blkH, 4);
  noStroke();

  // check-and-act moments (orange bars) at each cycle boundary
  for (let k = 0; k * sleepMs <= WINDOW; k++) {
    let x = mapT(k * sleepMs);
    fill('darkorange');
    rect(x, blkY, 5, blkH);
  }
  fill('dimgray'); textAlign(CENTER, CENTER); textSize(11);
  text('gray = sleeping (button ignored);  orange = check & act', (tlLeft + tlRight) / 2, blkY + blkH / 2);

  // detection verdict near the press
  let px = mapT(pressT);
  textAlign(CENTER, BOTTOM); textSize(12); textStyle(BOLD);
  if (detect < 0) { fill('crimson'); text('MISSED', px, blkY - 2 + 0); }
  textStyle(NORMAL);
}

function drawNonBlockingTimeline(pressT, detect) {
  fill('black'); noStroke(); textAlign(LEFT, BOTTOM); textSize(14); textStyle(BOLD);
  text('Non-blocking: check every loop', tlLeft, nbY - 6);
  textStyle(NORMAL);

  fill(220, 245, 220);
  stroke('silver'); strokeWeight(1);
  rect(tlLeft, nbY, tlRight - tlLeft, nbH, 4);

  // dense loop ticks
  stroke('seagreen'); strokeWeight(1);
  for (let t = 0; t <= WINDOW; t += 120) {
    let x = mapT(t);
    line(x, nbY + 4, x, nbY + nbH - 4);
  }
  noStroke();
  fill('darkgreen'); textAlign(CENTER, CENTER); textSize(11);
  text('green ticks = constant looping (button always checked)', (tlLeft + tlRight) / 2, nbY + nbH / 2);

  // detection verdict
  let px = mapT(pressT);
  textAlign(CENTER, TOP); textSize(12); textStyle(BOLD);
  fill('darkgreen');
  text('detected', px, nbY + nbH + 2);
  textStyle(NORMAL);
}

function drawPressMarker(pressT) {
  let x = mapT(pressT);
  // press duration band
  let x2 = mapT(pressT + PRESS_DUR);
  fill(255, 215, 0, 120);
  noStroke();
  rect(x, blkY - 8, max(2, x2 - x), nbY + nbH + 16 - (blkY - 8));
  // marker line
  stroke('red'); strokeWeight(2);
  line(x, blkY - 12, x, nbY + nbH + 18);
  noStroke();
  fill('red'); textAlign(CENTER, BOTTOM); textSize(11);
  text('button press', x, blkY - 26);
  // arrow head
  fill('red'); triangle(x, blkY - 12, x - 4, blkY - 18, x + 4, blkY - 18);
}

function drawStats(sleepMs, blkDetect, nbDetect) {
  let y = 264;
  fill(255, 255, 255, 240);
  stroke('silver'); strokeWeight(1);
  rect(margin, y, canvasWidth - 2 * margin, 100, 10);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
  text('Response to this button press', margin + 12, y + 8);
  textStyle(NORMAL); textSize(13);

  // blocking
  fill('crimson');
  text('Blocking:', margin + 12, y + 34);
  fill('black');
  text(blkDetect < 0 ? 'MISSED (pressed during a sleep)' : ('detected after ' + blkDetect + ' ms'),
    margin + 110, y + 34);
  fill('dimgray'); textSize(12);
  text('worst-case delay: up to ' + sleepMs + ' ms', margin + 110, y + 52);

  // non-blocking
  fill('darkgreen'); textSize(13);
  text('Non-blocking:', margin + 12, y + 70);
  fill('black');
  text('detected after ' + nbDetect + ' ms', margin + 130, y + 70);
  fill('dimgray'); textSize(12);
  text('worst-case delay: ~' + LOOP_TICK + ' ms (one loop)', margin + 130, y + 84);
}

function mousePressed() {
  // click on the timelines sets the press time
  if (mouseY > blkY - 12 && mouseY < nbY + nbH + 18 && mouseX > tlLeft && mouseX < tlRight) {
    setPressFromMouse();
  }
}
function mouseDragged() {
  if (mouseY > blkY - 30 && mouseY < nbY + nbH + 30 && mouseX > tlLeft - 10 && mouseX < tlRight + 10) {
    setPressFromMouse();
  }
}
function setPressFromMouse() {
  let t = map(constrain(mouseX, tlLeft, tlRight), tlLeft, tlRight, 0, WINDOW);
  pressSlider.value(Math.round(t / 10) * 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  sleepSlider.size(canvasWidth - sliderLeftMargin - margin);
  pressSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
