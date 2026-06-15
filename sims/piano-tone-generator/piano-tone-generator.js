// Piano Keyboard Tone Generator MicroSim
// CANVAS_HEIGHT: 450
// Students click (or press a-s-d-f-g-h-j-k for) an 8-key piano keyboard to hear a
// tone and see the note name, frequency in Hz, the matching buzzer.freq() code,
// and an animated waveform at that frequency.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

let whiteNotes = [
  { n: 'C4', f: 261.63, key: 'a' },
  { n: 'D4', f: 293.66, key: 's' },
  { n: 'E4', f: 329.63, key: 'd' },
  { n: 'F4', f: 349.23, key: 'f' },
  { n: 'G4', f: 392.00, key: 'g' },
  { n: 'A4', f: 440.00, key: 'h' },
  { n: 'B4', f: 493.88, key: 'j' },
  { n: 'C5', f: 523.25, key: 'k' }
];
let blackNotes = [
  { n: 'C#4', f: 277.18, after: 0 },
  { n: 'D#4', f: 311.13, after: 1 },
  { n: 'F#4', f: 369.99, after: 3 },
  { n: 'G#4', f: 415.30, after: 4 },
  { n: 'A#4', f: 466.16, after: 5 }
];

let activeNote = null;
let activeFreq = 0;
let playing = false;
let playStart = 0;
let phase = 0;

let audioCtx = null;
let waveSelect;

// keyboard geometry (computed each frame)
let kbTop = 150, kbH = 140;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  waveSelect = createSelect();
  ['sine', 'square', 'triangle', 'sawtooth'].forEach(o => waveSelect.option(o));
  waveSelect.selected('sine');
  waveSelect.position(150, drawHeight + 10);

  describe('A piano keyboard tone generator. Eight white keys (C4 to C5) and five ' +
    'black keys play tones using the Web Audio API. The current note name, ' +
    'frequency in Hz, and the matching buzzer.freq() MicroPython code are shown, ' +
    'with an animated waveform.', LABEL);
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

  if (playing && millis() - playStart > 500) playing = false;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Piano Keyboard Tone Generator', canvasWidth / 2, 8);

  // Oscilloscope
  drawScope(margin, 40, canvasWidth - 2 * margin, 90);

  // Keyboard
  drawKeyboard();

  // Frequency + code
  drawInfo(300);

  // Control label
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Waveform:', 10, drawHeight + 24);
}

function drawScope(x, y, w, h) {
  fill(20, 30, 25);
  stroke('gray');
  strokeWeight(1);
  rect(x, y, w, h, 6);
  stroke(60, 90, 70);
  line(x, y + h / 2, x + w, y + h / 2);
  noStroke();
  fill('lightgreen');
  textAlign(LEFT, TOP);
  textSize(11);
  text(activeNote ? activeNote + ' waveform' : 'waveform (click a key)', x + 6, y + 4);

  if (playing) phase += 0.15;

  let cycles = activeFreq ? map(activeFreq, 261, 523, 3, 7) : 3;
  let amp = playing ? (h / 2 - 12) : (h / 2 - 12) * 0.25;
  stroke('springgreen');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = 0; px <= w - 12; px += 2) {
    let t = px / (w - 12);
    let val = waveValue(waveSelect.value(), TWO_PI * cycles * t + phase);
    vertex(x + 6 + px, y + h / 2 - val * amp);
  }
  endShape();
  noStroke();
}

function waveValue(type, ang) {
  let p = (ang / TWO_PI) % 1;
  if (p < 0) p += 1;
  switch (type) {
    case 'square': return p < 0.5 ? 1 : -1;
    case 'triangle': return p < 0.5 ? (4 * p - 1) : (3 - 4 * p);
    case 'sawtooth': return 2 * p - 1;
    default: return sin(ang);
  }
}

function drawKeyboard() {
  let whiteW = (canvasWidth - 2 * margin) / 8;
  // white keys
  for (let i = 0; i < whiteNotes.length; i++) {
    let x = margin + i * whiteW;
    let active = (activeNote === whiteNotes[i].n && playing);
    fill(active ? 'gold' : 'white');
    stroke('black');
    strokeWeight(1);
    rect(x, kbTop, whiteW - 1, kbH, 0, 0, 4, 4);
    noStroke();
    fill('dimgray');
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text(whiteNotes[i].n, x + whiteW / 2, kbTop + kbH - 6);
    fill('silver');
    textSize(10);
    text('[' + whiteNotes[i].key + ']', x + whiteW / 2, kbTop + kbH - 22);
  }
  // black keys
  let blackW = whiteW * 0.6;
  let blackH = kbH * 0.6;
  for (let b of blackNotes) {
    let x = margin + (b.after + 1) * whiteW - blackW / 2;
    let active = (activeNote === b.n && playing);
    fill(active ? 'darkorange' : 'black');
    stroke('black');
    strokeWeight(1);
    rect(x, kbTop, blackW, blackH, 0, 0, 3, 3);
    noStroke();
    fill('white');
    textAlign(CENTER, BOTTOM);
    textSize(9);
    text(b.n, x + blackW / 2, kbTop + blackH - 4);
  }
}

function drawInfo(y) {
  // frequency display
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  fill('dimgray');
  text('Note', margin, y);
  fill('navy');
  textStyle(BOLD);
  textSize(24);
  text(activeNote || '—', margin, y + 18);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(14);
  text('Frequency', margin + 120, y);
  fill('darkgreen');
  textStyle(BOLD);
  textSize(24);
  text(activeFreq ? activeFreq.toFixed(1) + ' Hz' : '—', margin + 120, y + 18);
  textStyle(NORMAL);

  // code panel
  let cx = canvasWidth * 0.55;
  fill(245, 245, 250);
  stroke('silver');
  strokeWeight(1);
  rect(cx, y, canvasWidth - cx - margin, 56, 6);
  noStroke();
  fill('navy');
  textFont('monospace');
  textSize(14);
  text('buzzer = PWM(Pin(15))', cx + 8, y + 8);
  text('buzzer.freq(' + (activeFreq ? Math.round(activeFreq) : 'XXX') + ')', cx + 8, y + 30);
  textFont('Arial');
}

function triggerNote(name, freq) {
  activeNote = name;
  activeFreq = freq;
  playing = true;
  playStart = millis();
  playTone(freq);
}

function playTone(freq) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    let osc = audioCtx.createOscillator();
    let g = audioCtx.createGain();
    osc.type = waveSelect.value();
    osc.frequency.value = freq;
    let t0 = audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.5);
  } catch (e) {
    // audio not available; the visual still works
  }
}

function mousePressed() {
  let whiteW = (canvasWidth - 2 * margin) / 8;
  let blackW = whiteW * 0.6;
  let blackH = kbH * 0.6;
  // black keys first (on top)
  for (let b of blackNotes) {
    let x = margin + (b.after + 1) * whiteW - blackW / 2;
    if (mouseX > x && mouseX < x + blackW && mouseY > kbTop && mouseY < kbTop + blackH) {
      triggerNote(b.n, b.f);
      return;
    }
  }
  for (let i = 0; i < whiteNotes.length; i++) {
    let x = margin + i * whiteW;
    if (mouseX > x && mouseX < x + whiteW && mouseY > kbTop && mouseY < kbTop + kbH) {
      triggerNote(whiteNotes[i].n, whiteNotes[i].f);
      return;
    }
  }
}

function keyPressed() {
  let k = key.toLowerCase();
  for (let w of whiteNotes) {
    if (w.key === k) { triggerNote(w.n, w.f); return; }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
