// IoT Data Flow MicroSim
// CANVAS_HEIGHT: 480
// Students trace an HTTP request from a Pico W through a router and the internet
// to an API server and back. A packet animates the round trip, each hop has a
// hover detail, and the request URL and JSON response are shown at the bottom.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

let nodes = [
  { name: 'Pico W',   detail: 'Wi-Fi client opens a TCP socket on port 80' },
  { name: 'Router',   detail: 'NAT forwards the packet to the internet' },
  { name: 'Internet', detail: 'DNS lookup finds the server, packets are routed' },
  { name: 'API Server', detail: 'Server replies with JSON (HTTP 200 OK)' }
];

let phase = 'idle';   // idle | request | response | done
let progress = 0;

let sendButton, methodSelect, latInput, lonInput;
let nodeY = 130;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  sendButton = createButton('Send Request');
  sendButton.position(10, drawHeight + 8);
  sendButton.mousePressed(() => { phase = 'request'; progress = 0; });

  methodSelect = createSelect();
  methodSelect.option('GET (fetch data)');
  methodSelect.option('POST (send data)');
  methodSelect.selected('GET (fetch data)');
  methodSelect.position(135, drawHeight + 8);

  latInput = createInput('44.98');
  latInput.position(50, drawHeight + 46);
  latInput.size(60);
  lonInput = createInput('-93.26');
  lonInput.position(180, drawHeight + 46);
  lonInput.size(60);

  describe('An IoT data flow diagram. A packet travels from a Pico W through a ' +
    'router and the internet to an API server and back as JSON. A Send Request ' +
    'button starts the animation, latitude and longitude inputs build the URL, and ' +
    'a GET/POST toggle changes the request type.', LABEL);
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

  let method = methodSelect.value().startsWith('GET') ? 'GET' : 'POST';

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('IoT Data Flow: HTTP Round Trip', canvasWidth / 2, 8);

  // node x positions
  let xs = [canvasWidth * 0.13, canvasWidth * 0.37, canvasWidth * 0.62, canvasWidth * 0.87];

  // connecting wires
  stroke('silver');
  strokeWeight(2);
  for (let i = 0; i < 3; i++) line(xs[i], nodeY, xs[i + 1], nodeY);
  noStroke();

  // advance animation
  if (phase === 'request') { progress += 0.012; if (progress >= 1) { phase = 'response'; progress = 0; } }
  else if (phase === 'response') { progress += 0.012; if (progress >= 1) { phase = 'done'; progress = 1; } }

  // packet
  if (phase === 'request' || phase === 'response') {
    let span = xs[3] - xs[0];
    let pktX, pktY, col;
    if (phase === 'request') { pktX = xs[0] + progress * span; pktY = nodeY - 26; col = 'royalblue'; }
    else { pktX = xs[3] - progress * span; pktY = nodeY + 26; col = 'seagreen'; }
    fill(col);
    noStroke();
    ellipse(pktX, pktY, 16, 16);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(9);
    text(phase === 'request' ? 'REQ' : 'JSON', pktX, pktY);
  }

  // arrows indicating directions
  noStroke();
  fill('royalblue'); textAlign(CENTER, BOTTOM); textSize(11);
  text('request →', (xs[0] + xs[3]) / 2, nodeY - 34);
  fill('seagreen'); textAlign(CENTER, TOP);
  text('← JSON response', (xs[0] + xs[3]) / 2, nodeY + 34);

  // nodes
  let hover = -1;
  for (let i = 0; i < 4; i++) {
    drawNode(i, xs[i], nodeY);
    if (dist(mouseX, mouseY, xs[i], nodeY) < 34) hover = i;
  }

  // status indicators
  drawWifi(xs[0], nodeY - 44);
  if (phase === 'done') {
    fill('green'); noStroke(); textAlign(CENTER, TOP); textSize(12);
    text('200 OK', xs[3], nodeY + 44);
  }

  // bottom panel: URL + JSON
  drawPanel(method);

  // hover tooltip
  if (hover >= 0) {
    let tw = 260, th = 30;
    let tx = constrain(mouseX + 10, 0, canvasWidth - tw);
    let ty = constrain(mouseY - 36, 0, drawHeight - th);
    fill('black'); rect(tx, ty, tw, th, 5);
    fill('white'); textAlign(LEFT, CENTER); textSize(12);
    text(nodes[hover].detail, tx + 8, ty + th / 2, tw - 16);
  }

  // control labels
  fill('black'); noStroke(); textAlign(LEFT, CENTER); textSize(defaultTextSize);
  text('Lat:', 14, drawHeight + 56);
  text('Lon:', 144, drawHeight + 56);
}

function drawNode(i, x, y) {
  push();
  translate(x, y);
  noStroke();
  if (i === 0) { // Pico W
    fill('#2e5d34'); rectMode(CENTER); rect(0, 0, 44, 30, 3);
    fill('silver'); rect(0, -8, 12, 6, 1);
  } else if (i === 1) { // router
    fill('dimgray'); rectMode(CENTER); rect(0, 0, 46, 24, 3);
    stroke('dimgray'); strokeWeight(2); line(-10, -12, -14, -22); line(10, -12, 14, -22); noStroke();
  } else if (i === 2) { // internet cloud
    fill('lightsteelblue');
    ellipse(-14, 4, 28, 24); ellipse(14, 4, 28, 24); ellipse(0, -6, 34, 28);
  } else { // server
    fill('slategray'); rectMode(CENTER);
    rect(0, -8, 36, 14, 2); rect(0, 8, 36, 14, 2);
    fill('lightgreen'); ellipse(-12, -8, 5, 5); ellipse(-12, 8, 5, 5);
  }
  rectMode(CORNER);
  pop();
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(12);
  text(nodes[i].name, x, y + 22);
}

function drawWifi(x, y) {
  noStroke();
  fill('seagreen');
  for (let i = 0; i < 3; i++) {
    rect(x - 8 + i * 7, y - i * 4, 4, 6 + i * 4, 1);
  }
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(10);
  text('Wi-Fi', x + 16, y);
}

function drawPanel(method) {
  let py = 250;
  let lat = latInput.value();
  let lon = lonInput.value();
  let url = 'https://api.example.com/weather?lat=' + lat + '&lon=' + lon;

  // request box
  fill(245, 245, 250); stroke('silver'); strokeWeight(1);
  rect(margin, py, canvasWidth - 2 * margin, 56, 6);
  noStroke();
  fill('dimgray'); textAlign(LEFT, TOP); textSize(12);
  text('Request:', margin + 10, py + 6);
  fill('navy'); textFont('monospace'); textSize(13);
  text(method + ' ' + url, margin + 10, py + 26, canvasWidth - 2 * margin - 20);
  textFont('Arial');

  // response box
  let ry = py + 66;
  fill(245, 250, 245); stroke('silver'); strokeWeight(1);
  rect(margin, ry, canvasWidth - 2 * margin, 64, 6);
  noStroke();
  fill('dimgray'); textAlign(LEFT, TOP); textSize(12);
  text('JSON response:', margin + 10, ry + 6);
  fill('darkgreen'); textFont('monospace'); textSize(13);
  if (phase === 'done') {
    text('{ "temp_c": 21.5, "humidity": 60, "wind": 8 }', margin + 10, ry + 26, canvasWidth - 2 * margin - 20);
  } else {
    fill('gray');
    text('(press "Send Request" to fetch data)', margin + 10, ry + 26);
  }
  textFont('Arial');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
