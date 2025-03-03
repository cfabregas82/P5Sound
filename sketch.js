let mic, song, fft, amp;
let centerX, centerY, radius;
let totalDegrees = 360;
let r, g, b;
let bassIntensity, midIntensity, trebleIntensity;
let button1, button2, button3, button4;
let slider1, slider2, slider3;
let input1, input2, input3, input4, input5, input6, input7, input8, input9, input10, input11, input12;
let duracion, punch, current;
let isPlaying = false;
let ySlide;
let xSlide;
let vueltas = 0;

function preload() {
  song = loadSound('https://singhimalaya.github.io/Codepen/assets/music/1.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  mic = new p5.AudioIn();
  mic.start();
  amp = new p5.Amplitude();  

  button1 = createButton("Play").position(10, 20).mouseClicked(play);
  button2 = createButton("Pause").position(99, 20).mouseClicked(pausa);
  button3 = createButton("Clear").position(200, 20).mouseClicked(borra);
  button4 = createButton('Save PNG').position(297, 20).mouseClicked(captura);

  slider1 = createSlider(-1.0, 1.0, 0.30, 0.01).position(8, 125).size(150);
  slider2 = createSlider(8, 120, 30, 0.5).position(170, 125).size(150);
  slider3 = createSlider(0.01, 1.50, 0.25, 0.01).position(330, 125).size(150);

  slider4 = createSlider(0, 1, 0.5, 0.01).position(ySlide, xSlide).size(300);
  
  slider4.input(() => song.setVolume(slider4.value()));

  centerX = width / 2;
  centerY = height / 2;
  radius = random(random(width * 0.6, width * 1), random(height * 0.6, height * 1));
  angleMode(DEGREES);
  r = random(100, 255);
  g = random(0, 155);
  b = random(0, 55);

  fft = new p5.FFT();

  input1 = createInput('').position(10, 80).size(110);
  input2 = createInput('').position(130, 80).size(110);
  input3 = createInput('').position(250, 80).size(110);
  input4 = createInput('').position(370, 80).size(110);
  input5 = createInput('').position(490, 80).size(110);

  input6 = createInput('').position(10, 150).size(65);
  input7 = createInput('').position(10, 200).size(65);
  input8 = createInput('').position(10, 250).size(65);
  
  input9 = createInput('').position(10, 300).size(90);
  input10 = createInput('').position(10, 350).size(90);
  input11 = createInput('').position(10, 400).size(90);
  
  input12 = createInput('').position(10, height - 55).size(95);

  noLoop();
}

function play() {
  if (!isPlaying) {
    song.play();
    isPlaying = true;
    loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {  
  noFill();
  translate(-width / 2, -height / 2);  
  ySlide = width - 320;
  xSlide = height - 45;
  
  if (slider4.position != (ySlide, xSlide)){
    slider4.position(ySlide, xSlide);
  }

  push();
  fill(220);
  noStroke();
  duracion = song.duration();
  current = song.currentTime();
  let rectWidth = map(current, 0, duracion, 0, windowWidth);
  rect(0, windowHeight - 10, rectWidth, 15);
  pop();

  let spectrum = fft.analyze();
  bassIntensity = map(fft.getEnergy("bass"), 0, 255, 0, 1);
  midIntensity = map(fft.getEnergy("mid"), 0, 255, 0, 0.5);
  trebleIntensity = map(fft.getEnergy("treble"), 0, 255, 0, 1);

  punch = map((bassIntensity * 8) + (midIntensity * 4) + (trebleIntensity * 4), 0, 5, 0, 3);

  let rd = slider1.value();
  let onda = slider2.value();
  let multi = slider3.value();

  let r1 = constrain(r, -100, 255);
  let g1 = constrain(g, -100, 255);
  let b1 = constrain(b, -100, 255);

  stroke(r1, g1, b1, 25);
  strokeWeight(0.5);  

  beginShape();
  let noiseFactor2 = noise(onda * 5 / onda * 5);
  for (let i = 0; i <= totalDegrees - 0.8; i++) {
    var noiseFactor = noise(i / onda, frameCount / 900);    
    var x = centerX + radius * cos(i * 2) * noiseFactor2;
    var y = centerY + radius * sin(i * 2) * noiseFactor;
    curveVertex(x, y);
  }
  endShape(CLOSE);

  actualizarInputs(rd, onda, multi, vueltas);

  radius -= (punch * multi) - rd;
  r -= 0.05;
  g += 0.05;
  b += 0.05;

  if (radius <= 0) {
    radius = random(random(width * 0.5, width * 1), random(height * 0.5, height * 1));
    r = random(100, 255);
    g = random(0, 255);
    b = random(0, 225);
    strokeWeight(0.5);
    vueltas += 1;
  }

  push();
  beginShape(POINTS);
  strokeWeight(25);
  vertex(width - 40, 40);
  endShape();
  pop();

  if (!song.isPlaying()) {
    isPlaying = false;
    noLoop();
  }  
}

function actualizarInputs(rd, onda, multi, vueltas) {
  input1.value('Radius: ' + round(radius, 2));
  input2.value('Punch: ' + round(punch, 2));
  input3.value('RD: ' + rd);
  input4.value('Wave: ' + onda);
  input5.value('Mult: ' + multi);

  input6.value('R: ' + round(r));
  input7.value('G: ' + round(g));
  input8.value('B: ' + round(b));
  input9.value('Bass:   ' + round(bassIntensity, 2));
  input10.value('Mid:    ' + round(midIntensity, 2));
  input11.value('Treble: ' + round(trebleIntensity, 2));
  input12.value('Iterations: ' + vueltas);
}

function pausa() {
  song.pause();
  isPlaying = false;
  noLoop();
}

function borra() {
  clear();
}

function captura() {
  save('mycanvas.png');
}