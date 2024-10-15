let video;
let faceMesh;
let predictions = [];

function setup() {
  createCanvas(640, 480);
  // Create a video capture
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); // Hide the HTML video element, display through p5

  // Initialize FaceMesh from ml5.js
  faceMesh = ml5.faceMesh(video, modelReady);
  faceMesh.on("predict", (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log("FaceMesh model loaded!");
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // Example: Check for raised eyebrows or mouth shape for emotions
    let emotion = detectEmotion(keypoints);
    document.getElementById("emotion").textContent = emotion;

    // Draw keypoints for debugging
    for (let i = 0; i < keypoints.length; i++) {
      const [x, y] = keypoints[i];
      fill(0, 255, 0);
      ellipse(x, y, 5, 5);
    }
  }
}

// Function to detect emotion based on keypoints
function detectEmotion(keypoints) {
  // Example logic: Define conditions for emotions like "happy" or "surprised"
  let leftEyebrow = keypoints[70][1]; // Y-coordinate of left eyebrow
  let rightEyebrow = keypoints[300][1]; // Y-coordinate of right eyebrow
  let mouthTop = keypoints[13][1]; // Y-coordinate of upper lip
  let mouthBottom = keypoints[14][1]; // Y-coordinate of lower lip

  if (mouthBottom - mouthTop > 20) {
    return "Surprised";
  } else if (leftEyebrow < 300 && rightEyebrow < 300) {
    return "Happy";
  } else {
    return "Neutral";
  }
}
