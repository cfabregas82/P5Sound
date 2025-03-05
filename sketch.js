let mic, song, fft, amp;
let volume;
let vol, punch;
let bassIntensity, midIntensity, trebleIntensity;
let isPlaying = false;
let currentSongName = "Szamár Madár | Venetian Snares";
let ySlide, xSlide;
let sWeight;
let x = 0;
let targetX = 300; // Variable para suavizar el movimiento

let img;

function preload() {
  song = loadSound("https://cfabregas82.github.io/P5Sound/10.mp3");
}

console.log("Canción cargada: " + currentSongName);

function setup() {
  noSmooth();
  
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
  
  frameRate(60);
  createCanvas(windowWidth, windowHeight, WEBGL);

  //mic = new p5.AudioIn();
  //mic.start();
  amp = new p5.Amplitude();
  fft = new p5.FFT();

  button1 = createButton("Play").position(10, 30).mouseClicked(play);
  button2 = createButton("Pause")
    .position(60, 30)
    .mouseClicked(pausa)
    .addClass("but2");

  fileInput = createFileInput(handleFile);
  fileInput.position(10, 5).addClass("file-input");

  slider4 = createSlider(0, 1, 0.5, 0.001)
    .position(ySlide, xSlide)
    .size(300)
    .addClass("sli4");
  slider4.input(() => {
    if (song) song.setVolume(slider4.value());
  });

  slider5 = createSlider(100, 200, 150, 1)
    .position(8, 70)
    .size(300)
    .addClass("sli5");
  slider7 = createSlider(200, 400, 200, 1)
    .position(8, 90)
    .size(300)
    .addClass("sli7");
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
    if (file.name !== currentSongName) {
      currentSongName = file.name; // Actualizar nombre actual

      if (song) song.stop(); // Detener la canción anterior
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  
  translate(-width / 2, -height / 2, 0);
  background(random(255), random(255), random(255));
  image(img, 0, 0);
  
  translate(0,0, 100);
  
  pointLight(255, 255, 205, 0, 100, 0);

  ySlide = width - 320;
  xSlide = height - 45;

  if (slider4.position().x !== ySlide || slider4.position().y !== xSlide) {
    slider4.position(ySlide, xSlide);
  }

  //volume = mic.getLevel() * 1000;
  //vol = map(volume, 1, 10, 50, 80);

  let spectrum = fft.analyze();
  bassIntensity = map(fft.getEnergy("bass"), 0, 255, 0, 1);
  midIntensity = map(fft.getEnergy("mid"), 0, 255, 0, 1);
  trebleIntensity = map(fft.getEnergy("treble"), 0, 255, 0, 1);

  punch = map(
    bassIntensity * 8 + midIntensity * 4 + trebleIntensity * 4,
    0,
    5,
    0,
    150
  );
  let punchi = map(punch, 200, 400, 50, 100);
  let bass1 = map(punchi, 0, 300, 0, 1);

  //orbitControl(2, 2, 1);

  noFill();
  stroke(250);

  sWeight = slider5.value();
  let diam = slider7.value();

  beginShape();
  strokeWeight(sWeight);
  circle(width / 2, height / 2, (punch * 1.3) + diam);
  endShape();

  /*beginShape();
  strokeWeight(punchi);
  line(x, 100, x, 500);
  endShape();*/

  beginShape();
  strokeWeight(punchi);
  stroke(0);
  vertex(width / 2, 0);
  vertex(x, height / 3);
  vertex(width / 2, height / 2);
  vertex(x, height / 1.5);
  vertex(width / 2, height);
  endShape();

  targetX = map(bassIntensity, 0, 1, 0, width); // Define el rango de movimiento

  if (bassIntensity > 0.4) {
    x = targetX; // Cambio brusco
  } else {
    x = lerp(x, targetX, 0.9); // Menos suavizado
  }

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
