let video;
let handpose;
let predictions = [];
let sadArtist, happyArtist, angryArtist, misArtist, benArtist;
let mood = "happy";

function preload() {
  handpose = ml5.handPose(modelLoaded);

    sadArtist = loadImage("images/artist-sad.PNG");
    happyArtist = loadImage("images/artist-happy.PNG");
    angryArtist = loadImage("images/artist-angry.PNG");
    misArtist = loadImage("images/artist-mis.PNG");
    benArtist = loadImage("images/artist-ben.PNG");
}

function setup() {
  createCanvas(740, 580);
  video = createCapture(VIDEO);
  video.size(740, 580);
  video.hide();

  handpose.detectStart(video, getHandsData);

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
}

function getHandsData(results) {
  predictions = results;
}

function draw() {
  background(255, 255, 255);
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


  if (mood === "sad") {
    image(sadArtist, 0, 0, 300, 300);
  } else if (mood === "angry") {
    image(angryArtist, 0, 0, 300, 300);
  } else if (mood === "mischievous") {
    image(misArtist, 0, 0, 300, 300);
  } else if (mood === "benevolent") {
    image(benArtist, 0, 0, 300, 300);
  } else {
    image(happyArtist, 0, 0, 300, 300);
  }
}

function modelLoaded() {
  console.log("Model Loaded!");
}



  
