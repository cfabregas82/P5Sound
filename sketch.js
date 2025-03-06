let mic, song, fft, amp;
let volume;
let vol, punch;
let bassIntensity, midIntensity, trebleIntensity;
let isPlaying = false;
let currentSongName = "Szamár Madár - Venetian Snares";
let ySlide, xSlide;
let sWeight;
let x = 0;
let targetX = 100;

let img;

let font;

let space = 80;

function preload() {
  song = loadSound("https://cfabregas82.github.io/P5Sound/10.mp3");
  font = loadFont('Jersey15-Regular.ttf');
}

console.log("Canción cargada: " + currentSongName);

function setup() {
  noSmooth();
  
  img = createImage(windowWidth, windowHeight);
  img.loadPixels();

  for (let x = 0; x < img.width; x += 1) {
    for (let y = 0; y < img.height; y += 1) {
      let a = map(x, 0, img.width, 0, 255);
      let c = color(63, 150, 150, a);
      img.set(x, y, c);
    }
  }
  img.updatePixels();
  
  frameRate(60);
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  textFont(font);    
  textAlign(CENTER, CENTER);

  mic = new p5.AudioIn();
  mic.start();
  amp = new p5.Amplitude();
  fft = new p5.FFT();

  button1 = createButton("Play").position(10, 30).mouseClicked(play);
  button2 = createButton("Pause").position(60, 30).mouseClicked(pausa).addClass("but2");

  fileInput = createFileInput(handleFile);
  fileInput.position(10, 5).addClass("file-input");

  slider4 = createSlider(0, 1, 0.5, 0.001).position(ySlide, xSlide).size(300).addClass("sli4");
  slider4.input(() => { if (song) song.setVolume(slider4.value()); });

  slider5 = createSlider(100, 200, 150, 1).position(8, 60).size(300).addClass("sli5");
  slider7 = createSlider(100, 400, 200, 1).position(8, 80).size(300).addClass("sli7");
}

function play() {
  if (!isPlaying && song) {
    song.play();
    isPlaying = true;
    loop();
  }
}

function handleFile(file) {
  if (file.type === "audio") {
    let fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

    if (fileNameWithoutExt !== currentSongName) {
      currentSongName = fileNameWithoutExt;

      if (song) song.stop();
      song = loadSound(file.data, () => {
        console.log("Nueva canción cargada: " + currentSongName);
        loop();
      });
    } else {
      console.log("La misma canción ya está cargada.");
    }
  } else {
    alert("Por favor selecciona un archivo de audio.");
  }
}

function draw() {
  
  translate(-width / 2, -height / 2, 0);
  background(fft.getEnergy("bass"), fft.getEnergy("mid"), fft.getEnergy("treble"));
  image(img, 0, 0);
  
  ySlide = width - 320;
  xSlide = height - 45;

  if (slider4.position().x !== ySlide || slider4.position().y !== xSlide) {
    slider4.position(ySlide, xSlide);
  }

  volume = mic.getLevel() * 1000;
  vol = map(volume, 1, 10, 50, 80);

  let spectrum = fft.analyze();
  bassIntensity = map(fft.getEnergy("bass"), 0, 255, 0, 1);
  midIntensity = map(fft.getEnergy("mid"), 0, 255, 0, 1);
  trebleIntensity = map(fft.getEnergy("treble"), 0, 255, 0, 1);

  punch = map(bassIntensity * 8 + midIntensity * 4 + trebleIntensity * 4, 0, 5, 0, 150);
  let punchi = map(punch, 200, 400, 50, 100);
  let bass1 = map(punchi, 0, 300, 0, 1);
  
  targetX = map(bassIntensity, 0, 1, 0, width / 2);

  if (bassIntensity > 0.4) {
    x = targetX;
  } else {
    x = lerp(x, targetX, 0.9);
  }

  sWeight = slider5.value();
  let diam = slider7.value();
  
  noFill();  
  
  push();
  translate(0,0);
  for (let x1 = 0 - 300; x1 + space < width + 300; x1 += space) {
    push();
    translate(x1, 0, 10);
    beginShape();
    strokeWeight(10);
    noFill();
    stroke(255, 5);

    vertex((space / 2) - 40, 0);
    vertex(x, height / 3);
    vertex((space / 2) - 40, height / 2);
    vertex(x, height / 1.5);
    vertex((space / 2) - 40, height);

    endShape();
    pop();
  } 
  pop();
 
  push();
  translate(width / 2, 0, 5);
  //orbitControl(0, 0, 1);
  push();
  beginShape();
  strokeWeight(punchi * 7);
  stroke(fft.getEnergy("bass")/2, fft.getEnergy("mid")/2, fft.getEnergy("treble")/2, 50);
  
  vertex(0, 0);
  vertex(0, height / 3);
  vertex(0, height / 2);
  vertex(0, height / 1.5);
  vertex(0, height);
  
  endShape();
  pop();
  
  translate(-width / 2, 0, 100);
  push();
  beginShape();
  stroke(fft.getEnergy("bass"), fft.getEnergy("mid"), fft.getEnergy("treble"));
  strokeWeight(sWeight);
  circle(width / 2, height / 2, (punch * 1.1) + diam);
  endShape();
  pop();

  translate(width / 2, height / 2, 200);
  push();  
  //rotateY(frameCount / -90);
  //orbitControl(1, 1, 1);
  beginShape();
  textSize(punchi * 0.6);  
  fill(0);
  text(currentSongName, 0, 150);
  endShape();
  pop();
  
  /*beginShape();
  strokeWeight(punchi);
  line(x, 100, x, 500);
  endShape();*/

  /*beginShape(POINTS);
  stroke(255);
  strokeWeight(punch - diam/6);
  vertex(width / 2, height / 2);
  endShape();*/

  if (!song || !song.isPlaying()) {
    isPlaying = false;
    noLoop();
  }
}

function pausa() {
  if (song) {
    song.pause();
    isPlaying = false;
    noLoop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function doubleClicked() {
  resizeCanvas(windowWidth, windowHeight);
  img = createImage(windowWidth, windowHeight);
  img.loadPixels();

  for (let x = 0; x < img.width; x += 1) {
    for (let y = 0; y < img.height; y += 1) {
      let a = map(x, 0, img.width, 0, 255);
      let c = color(63, 191, 191, a);
      img.set(x, y, c);
    }
  }
  img.updatePixels();
}
