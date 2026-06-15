// Prompt Engineering Workshop MicroSim
// CANVAS_HEIGHT: 440
// Students critique an AI prompt for MicroPython code. A live checklist scores the
// prompt against five quality criteria (board, pins, MicroPython, behavior,
// values/error handling) and gives a 0-10 quality score. Examples are selectable.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 390;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

let promptArea, exampleSelect, checkButton;
let feedback = '';

let examples = {
  'bad': 'Write code to blink an LED.',
  'medium': 'Write MicroPython code to blink an LED on a Raspberry Pi Pico.',
  'good': 'Write MicroPython code for a Raspberry Pi Pico that blinks an LED on ' +
          'GP15 every 500 ms in a loop, and use try/except to handle the case ' +
          'where the pin is unavailable.'
};

let criteria = [
  { label: 'Names the board (Pico, ESP32, ...)', re: /pico|esp32|esp8266|rp2040|raspberry pi|microcontroller|\bboard\b/ },
  { label: 'Specifies the pin / GPIO number', re: /\bpin\b|\bgpio\b|\bgp ?\d+|\bpins\b/ },
  { label: 'Asks for MicroPython or a library', re: /micropython|\bmachine\b|\bimport\b|library|ssd1306|neopixel|\bpwm\b|\badc\b/ },
  { label: 'Describes the desired behavior', re: /blink|read|print|turn|toggle|move|display|measure|control|send|rotate|play|count|detect|light|fade/ },
  { label: 'Gives values, timing, or error handling', re: /\d+\s*(ms|s|sec|second|hz|khz|cm|mm|deg|degree|baud|%)|try|except|error|handle|timeout/ }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  promptArea = createElement('textarea', examples['bad']);
  promptArea.parent(document.querySelector('main'));
  promptArea.position(margin, 54);
  promptArea.size(canvasWidth - 2 * margin - 6, 78);
  promptArea.style('font-size', '14px');
  promptArea.style('font-family', 'Arial, sans-serif');
  promptArea.style('padding', '6px');
  promptArea.style('resize', 'none');

  exampleSelect = createSelect();
  exampleSelect.option('Load example...');
  exampleSelect.option('bad');
  exampleSelect.option('medium');
  exampleSelect.option('good');
  exampleSelect.selected('Load example...');
  exampleSelect.position(150, drawHeight + 10);
  exampleSelect.changed(loadExample);

  checkButton = createButton('Check prompt');
  checkButton.position(300, drawHeight + 10);
  checkButton.mousePressed(() => {
    let n = countMet();
    feedback = (n >= 4) ? 'Strong prompt!' : (n >= 2) ? 'Getting there — add more detail.' : 'Too vague — be specific.';
  });

  describe('A prompt engineering workshop. An editable text box holds an AI prompt ' +
    'for MicroPython code. A live checklist of five quality criteria lights up green ' +
    'as the prompt satisfies each, and a 0 to 10 score updates with color. Example ' +
    'bad, medium, and good prompts can be loaded.', LABEL);
}

function loadExample() {
  let v = exampleSelect.value();
  if (examples[v]) { promptArea.value(examples[v]); feedback = ''; }
}

function countMet() {
  let promptText = (promptArea.value() || '').toLowerCase();
  let n = 0;
  for (let c of criteria) if (c.re.test(promptText)) n++;
  return n;
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

  let promptText = (promptArea.value() || '').toLowerCase();

  // Title
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(20);
  textAlign(CENTER, TOP);
  text('Prompt Engineering Workshop', canvasWidth / 2, 8);
  textAlign(LEFT, TOP);
  textSize(13);
  fill('dimgray');
  text('Your prompt (edit it):', margin, 36);

  // checklist (textarea occupies y 54-132)
  let cy = 150;
  let met = 0;
  textSize(14);
  for (let c of criteria) {
    let ok = c.re.test(promptText);
    if (ok) met++;
    // checkbox
    stroke(ok ? 'green' : 'silver');
    strokeWeight(2);
    fill(ok ? 'palegreen' : 'white');
    rect(margin, cy, 20, 20, 4);
    if (ok) {
      stroke('green'); strokeWeight(3); noFill();
      line(margin + 4, cy + 10, margin + 9, cy + 15);
      line(margin + 9, cy + 15, margin + 16, cy + 4);
    }
    noStroke();
    fill(ok ? 'black' : 'gray');
    textAlign(LEFT, CENTER);
    text(c.label, margin + 30, cy + 10);
    cy += 30;
  }

  // score
  let score = met * 2;
  let scoreCol = score < 5 ? 'crimson' : (score < 8 ? 'darkorange' : 'green');
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Prompt quality score:', margin, cy + 8);
  fill(scoreCol);
  textStyle(BOLD);
  textSize(34);
  text(score + ' / 10', margin + 180, cy);
  textStyle(NORMAL);

  if (feedback) {
    fill(scoreCol);
    textSize(14);
    text(feedback, margin, cy + 46);
  }

  // control label
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Examples:', 10, drawHeight + 24);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  promptArea.size(canvasWidth - 2 * margin - 6, 78);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
