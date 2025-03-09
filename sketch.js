let mic, song, fft, amp;
let volume;
let vol, punch;
let bassIntensity, midIntensity, trebleIntensity;
let isPlaying = false;
let currentSongName = "Szamár Madár - Venetian Snares";
let ySlide, xSlide;
let sWeight;
let x = 0;
let img;
let font;
let space = 200;
let pg;

function preload() {
  song = loadSound("https://cfabregas82.github.io/P5Sound/10.mp3");
  font = loadFont("https://cfabregas82.github.io/P5Sound/Jersey15-Regular.ttf");
}

console.log("Canción cargada: " + currentSongName);

function setup() {
  
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

  button1 = createButton("Play").position(10, 35).mouseClicked(play);
  button2 = createButton("Pause").position(100, 35).mouseClicked(pausa).addClass("but2");

  fileInput = createFileInput(handleFile);
  fileInput.position(10, 5).addClass("file-input");

  slider4 = createSlider(0, 1, 0.5, 0.001).position(ySlide, xSlide).size(300).addClass("sli4");
  slider4.input(() => { if (song) song.setVolume(slider4.value()); });

  slider5 = createSlider(100, 200, 150, 1).position(8, 80).size(300).addClass("sli5");
  slider7 = createSlider(100, 400, 200, 1).position(8, 100).size(300).addClass("sli7");
  slider8 = createSlider(10, 40, 20, 1).position(8, 120).size(300).addClass("sli8");
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

  if (slider4.position().y !== ySlide || slider4.position().x !== xSlide) {
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

  sWeight = slider5.value();
  let diam = slider7.value();
  
  noFill();  
  
  let centro = 0;
  let targetX = 0;
  
  targetX = map(bassIntensity, 0, 1, -100, width);

  if (bassIntensity > 0.7) {
    centro = targetX;
  } else {
    centro = lerp(centro, targetX, 0.9);
  }
  
  push();
  translate(0,0);
  for (let x1 = 0 - 600; x1 + space < width + 300; x1 += space) {
    push();
    translate(x1, 0, 10);
    beginShape();
    strokeWeight(10);
    noFill();
    stroke(255, 5);

    vertex(0, 0);
    vertex(centro, height / 3);
    vertex(0, height / 2);
    vertex(centro, height / 1.5);
    vertex(0, height);

    endShape();
    pop();
  } 
  pop();    
  
  translate(0, 0, 5);

  beginShape();
  strokeWeight(punchi * 4);
  stroke(fft.getEnergy("bass")/2, fft.getEnergy("mid")/2, fft.getEnergy("treble") / 2);
  vertex(width / 2, 0);
  vertex(centro, 250);
  vertex(width / 2, height / 2);
  vertex(centro, 550);
  vertex(width / 2, height);
  endShape();
  
  orbitControl(0, 0, 1);
  
  translate(0, 0, 100);
  push();
  beginShape();
  stroke(fft.getEnergy("bass"), fft.getEnergy("mid"), fft.getEnergy("treble"));
  strokeWeight(sWeight);
  circle(width / 2, height / 2, (punch * 1.1) + diam);
  endShape();
  pop();

  translate(width / 2, height / 2, 400);
  
  /*push();
  rotateY(frameCount * -0.002);
  textSize(punchi * 0.6);  
  fill(255);
  text(currentSongName, 0, 0);
  pop();*/
  
  let rot = lerp(frameCount * -0.009, frameCount * -0.002, 0.9);
  
  let pTxt = slider8.value();
  
  rotateY(rot);
  textSize(pTxt);//(punchi * 0.6);
  
  push();
  noSmooth();
  for(let i = 0; i < 10; i++) {
    fill(map(i, 0, 10, 0, 255), random(255), random(255), 50);
    translate(0, 0, 1);
    text(currentSongName, 0, 0);
  }
  pop();

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
