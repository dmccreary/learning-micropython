// Project Design Process MicroSim
// CANVAS_HEIGHT: 490
// Students click through a seven-step project design process. Each step opens a
// checklist of planning tasks; ticking items fills a progress bar. A summary
// button lists everything the student has checked so far.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

let steps = [
  { name: 'Requirements', items: ['Define what it must do', 'List who will use it', 'Note constraints (budget, size, power)'] },
  { name: 'Components', items: ['Choose the microcontroller', 'List the sensors needed', 'List actuators and outputs'] },
  { name: 'Bill of Materials', items: ['List every part with quantity', 'Find a supplier and price', 'Total the project cost'] },
  { name: 'Prototype', items: ['Build on a breadboard first', 'Test each part on its own', 'Combine parts step by step'] },
  { name: 'Wiring Diagram', items: ['Draw every connection', 'Label each pin used', 'Check power and ground'] },
  { name: 'Code Organization', items: ['Plan functions and modules', 'Write pseudocode for the loop', 'Decide on error handling'] },
  { name: 'Documentation', items: ['Write a README', 'Comment the code', 'Take photos or a demo video'] }
];

let activeStep = 0;
let checkboxes = [];   // checkboxes[step] = [cb, cb, cb]
let showSummary = false;
let printButton;

let boxTop = 76, boxPitch = 50, boxH = 42;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  for (let s = 0; s < steps.length; s++) {
    let group = [];
    for (let i = 0; i < steps[s].items.length; i++) {
      let cb = createCheckbox(' ' + steps[s].items[i], false);
      cb.parent(document.querySelector('main'));
      cb.style('font-size', '13px');
      cb.hide();
      group.push(cb);
    }
    checkboxes.push(group);
  }

  printButton = createButton('Print checklist');
  printButton.position(10, drawHeight + 10);
  printButton.mousePressed(toggleSummary);

  layoutCheckboxes();

  describe('A seven-step project design process: Requirements, Components, Bill of ' +
    'Materials, Prototype, Wiring Diagram, Code Organization, and Documentation. ' +
    'Clicking a step shows its checklist of planning tasks. A progress bar tracks ' +
    'completion and a button shows a summary of checked items.', LABEL);
}

function layoutCheckboxes() {
  let px = canvasWidth * 0.50 + 12;
  for (let s = 0; s < checkboxes.length; s++) {
    for (let i = 0; i < checkboxes[s].length; i++) {
      let cb = checkboxes[s][i];
      if (s === activeStep && !showSummary) {
        cb.show();
        cb.position(px, 134 + i * 40);
        cb.size(canvasWidth - px - margin);
      } else {
        cb.hide();
      }
    }
  }
}

function toggleSummary() {
  showSummary = !showSummary;
  layoutCheckboxes();
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

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Seven-Step Project Design Process', canvasWidth / 2, 8);

  // Progress bar
  let total = 0, done = 0;
  for (let s = 0; s < checkboxes.length; s++)
    for (let cb of checkboxes[s]) { total++; if (cb.checked()) done++; }
  drawProgress(done, total);

  if (showSummary) {
    drawSummaryPanel();
    return;
  }

  // Step boxes (left)
  for (let s = 0; s < steps.length; s++) {
    drawStepBox(s);
    if (s < steps.length - 1) {
      let y = boxTop + s * boxPitch + boxH;
      stroke('silver'); strokeWeight(2); fill('silver');
      let bx = margin + (canvasWidth * 0.46 - margin) / 2;
      line(bx, y, bx, y + (boxPitch - boxH));
      noStroke();
    }
  }

  // Right panel: active step checklist
  let px = canvasWidth * 0.50;
  fill(255, 255, 255, 240);
  stroke('silver'); strokeWeight(1);
  rect(px, boxTop, canvasWidth - px - margin, drawHeight - boxTop - 14, 10);
  noStroke();
  fill('seagreen');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(16);
  text('Step ' + (activeStep + 1) + ': ' + steps[activeStep].name, px + 12, boxTop + 10);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(12);
  text('Tick each task as you plan it:', px + 12, boxTop + 34);
  // (checkboxes are positioned here as DOM elements)
}

function drawStepBox(s) {
  let x = margin;
  let y = boxTop + s * boxPitch;
  let w = canvasWidth * 0.46 - margin;
  let active = (s === activeStep);
  // count checked for this step
  let c = 0;
  for (let cb of checkboxes[s]) if (cb.checked()) c++;
  let complete = (c === checkboxes[s].length);

  stroke(active ? 'seagreen' : 'silver');
  strokeWeight(active ? 3 : 1.5);
  fill(complete ? 'honeydew' : (active ? 'mintcream' : 'white'));
  rect(x, y, w, boxH, 8);
  noStroke();
  fill(active ? 'seagreen' : 'black');
  textAlign(LEFT, CENTER);
  textStyle(active ? BOLD : NORMAL);
  textSize(14);
  text((s + 1) + '. ' + steps[s].name, x + 10, y + boxH / 2);
  textStyle(NORMAL);
  // progress badge
  fill(complete ? 'seagreen' : 'gray');
  textAlign(RIGHT, CENTER);
  textSize(12);
  text(c + '/' + checkboxes[s].length, x + w - 10, y + boxH / 2);
}

function drawProgress(done, total) {
  let x = margin, y = 42, w = canvasWidth - 2 * margin, h = 16;
  fill('white'); stroke('gray'); strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();
  let frac = total ? done / total : 0;
  fill('mediumseagreen');
  rect(x, y, w * frac, h, 8);
  fill('black');
  textAlign(RIGHT, CENTER);
  textSize(12);
  text(done + ' / ' + total + ' tasks planned', x + w, y + h + 12);
  textAlign(LEFT, CENTER);
  text('Progress', x, y + h + 12);
}

function drawSummaryPanel() {
  fill(255, 255, 255, 245);
  stroke('silver'); strokeWeight(1);
  rect(margin, 76, canvasWidth - 2 * margin, drawHeight - 90, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(16);
  text('Your Project Plan — checked items', margin + 14, 88);
  textStyle(NORMAL);
  textSize(13);
  let y = 116;
  let any = false;
  for (let s = 0; s < steps.length; s++) {
    let checkedItems = [];
    for (let i = 0; i < checkboxes[s].length; i++)
      if (checkboxes[s][i].checked()) checkedItems.push(steps[s].items[i]);
    if (checkedItems.length === 0) continue;
    any = true;
    fill('seagreen'); textStyle(BOLD);
    text(steps[s].name + ':', margin + 14, y);
    textStyle(NORMAL); fill('black');
    y += 20;
    for (let it of checkedItems) {
      text('  ✓ ' + it, margin + 24, y, canvasWidth - 2 * margin - 40);
      y += 19;
    }
    y += 4;
  }
  if (!any) {
    fill('dimgray');
    text('No tasks checked yet. Click a step and tick its tasks.', margin + 14, y);
  }
  fill('dimgray');
  textAlign(RIGHT, BOTTOM);
  textSize(12);
  text('(press "Print checklist" again to go back)', canvasWidth - margin - 10, drawHeight - 18);
}

function mousePressed() {
  if (showSummary) return;
  for (let s = 0; s < steps.length; s++) {
    let x = margin, y = boxTop + s * boxPitch, w = canvasWidth * 0.46 - margin;
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + boxH) {
      activeStep = s;
      layoutCheckboxes();
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutCheckboxes();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
