let video;
let handpose;
let predictions = [];

function preload() {
  handpose = ml5.handPose(modelLoaded);
}

function setup() {
  createCanvas(740, 580);
  video = createCapture(VIDEO);
  video.size(740, 580);
  video.hide();

  handpose.detectStart(video, getHandsData);
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
    
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      
      push();
      noStroke();

      // If keypoints 9 to 12 (middle finger) are detected, fill red, else green
      if (i >= 9 && i <= 12) {
        fill(255, 0, 0);  // Red for middle finger
      } else {
        fill(0, 255, 0);  // Green for other fingers
      }

      ellipse(keypoint.x, keypoint.y, 10);
      pop();
    }
  }
}


function modelLoaded() {
  console.log("Model Loaded!");
}
