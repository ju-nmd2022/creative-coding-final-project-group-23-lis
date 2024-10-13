let video;
let handpose;
let predictions = [];
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let mood = "happy";
let comment = document.getElementById("artist-comment");
let moodTimeout;
let happyFilterArray = [];
let happyFilterShowing = [];

// Preload images and models
function preload() {
  handpose = ml5.handpose(modelLoaded);

  // Load the artist mood images
  sadArtist = loadImage("images/artist-sad.PNG");
  happyArtist = loadImage("images/artist-happy.PNG");
  angryArtist = loadImage("images/artist-angry.PNG");
  misArtist = loadImage("images/artist-mis.PNG");
  benArtist = loadImage("images/artist-ben.PNG");
  impatientArtist = loadImage("images/artist-impatient.PNG");

  // Load facial features
  headHeart = loadImage("images/head-heart.PNG");
  browsLift = loadImage("images/brows-lift.PNG");
  eyesCross = loadImage("images/eyes-cross.PNG");
  noseSeptum = loadImage("images/nose-septum.PNG");
  lipBite = loadImage("images/lip-bite.PNG");
  happyFilterArray = [headHeart, browsLift, eyesCross, noseSeptum, lipBite];
}

function setup() {
  createCanvas(740, 580);
  video = createCapture(VIDEO);
  video.size(740, 580);
  video.hide();

  // Start detecting hands
  handpose.on("predict", getHandsData);
  randomizeMood();
}

// Randomize artist mood
function randomizeMood() {
  let randomizedMood = Math.floor(Math.random() * 16);
  if (randomizedMood <= 3) {
    console.log("The artist is sad.");
    mood = "sad";
  } else if (randomizedMood <= 7) {
    console.log("The artist is angry.");
    mood = "angry";
  } else if (randomizedMood <= 9) {
    console.log("The artist is feeling mischievous.");
    mood = "mischievous";
  } else if (randomizedMood <= 11) {
    console.log("The artist is feeling benevolent.");
    mood = "benevolent";
  } else {
    console.log("The artist is happy.");
    mood = "happy";
  }
  updateMoodImages();

  // Change mood to "impatient" after 20 seconds
  moodTimeout = setTimeout(() => {
    transitionToImpatient();
  }, 20000);
}

function transitionToImpatient() {
  console.log("The artist has become impatient.");
  mood = "impatient";
  updateMoodImages();

  // Refresh mood again after being impatient for 10 seconds
  moodTimeout = setTimeout(() => {
    randomizeMood();
  }, 10000);
}

function updateMoodImages() {
  document.getElementById("sad-image").style.display = "none";
  document.getElementById("angry-image").style.display = "none";
  document.getElementById("mischievous-image").style.display = "none";
  document.getElementById("benevolent-image").style.display = "none";
  document.getElementById("happy-image").style.display = "none";
  document.getElementById("impatient-image").style.display = "none";

  if (mood === "sad") {
    document.getElementById("sad-image").style.display = "block";
    comment.innerHTML = "Artist is sad.";
  } else if (mood === "angry") {
    document.getElementById("angry-image").style.display = "block";
    comment.innerHTML = "Artist is angry.";
  } else if (mood === "mischievous") {
    document.getElementById("mischievous-image").style.display = "block";
    comment.innerHTML = "Artist is feeling mischievous.";
  } else if (mood === "benevolent") {
    document.getElementById("benevolent-image").style.display = "block";
    comment.innerHTML = "Artist is feeling benevolent.";
  } else if (mood === "happy") {
    document.getElementById("happy-image").style.display = "block";
    comment.innerHTML = "Artist is happy.";
  } else if (mood === "impatient") {
    document.getElementById("impatient-image").style.display = "block";
    comment.innerHTML =
      "Artist is impatient. If you don't do something interesting soon, his mood will change.";
  }
}

function getHandsData(results) {
  predictions = results;
}

function draw() {
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, 740, 580);

  for (let hand of predictions) {
    const keypoints = hand.keypoints;
    for (let keypoint of keypoints) {
      push();
      noStroke();
      fill(0, 255, 0);
      ellipse(keypoint.x, keypoint.y, 10);
      pop();
    }
  }
  displayFilter();
}

function filterObject() {
  happyFilterShowing = [];
  let numberOfFilters = Math.floor(
    Math.random() * (happyFilterArray.length + 1)
  );

  for (let i = 0; i < numberOfFilters; i++) {
    happyFilterShowing.push(
      happyFilterArray[Math.floor(Math.random() * happyFilterArray.length)]
    );
  }
}

function displayFilter() {
  for (let feature of happyFilterShowing) {
    image(feature, 300, 200, 200, 100);
  }
}

function modelLoaded() {
  console.log("Model Loaded!");
}
