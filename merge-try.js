const videoElement = document.querySelector(".input_video");
const canvasElement = document.querySelector(".output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const loadingScreen = document.querySelector(".loading");

let handpose;
let predictions = [];
let mood = "happy";
let comment = document.getElementById("artist-comment");
let moodTimeout;
let happyFilterArray = [];
let happyFilterShowing = [];

// Preload images and set up HandPose
function preload() {
  handpose = ml5.handPose(modelLoaded);

  // Load artist mood images
  // Add your image loading code here
}

// Setup the canvas and video feed
async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve(videoElement);
      };
    });
  } catch (error) {
    console.error("Error accessing the camera: ", error);
    alert("Please allow camera access and reload the page.");
    throw error;
  }
}

// Initialize MediaPipe FaceMesh
const faceMesh = new FaceMesh({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});

// Set options for FaceMesh
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// Callback when FaceMesh results are ready
faceMesh.onResults((results) => {
  // Clear and draw the new frame
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  // Draw facial landmarks and track eyebrow movements
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
        color: "#C0C0C070",
        lineWidth: 1,
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
        color: "#FF3030",
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
        color: "#30FF30",
      });
      drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
        color: "#E0E0E0",
      });
      trackEyebrows(landmarks);
      trackMouth(landmarks);
    }
  }
});

// Initialize handpose
function modelLoaded() {
  console.log("HandPose Model Loaded!");
}

// Detect hands
function getHandsData(results) {
  predictions = results;
}

// Start camera and run faceMesh and handpose detection
setupCamera()
  .then((video) => {
    video.play();
    const detectFaces = async () => {
      // Send video frame to FaceMesh and HandPose models
      await faceMesh.send({ image: video });
      await handpose.detect(video, getHandsData);
      requestAnimationFrame(detectFaces);
    };
    detectFaces();
  })
  .catch((error) => {
    console.error("Camera setup failed:", error);
  });

// Track eyebrow movements
function trackEyebrows(landmarks) {
  const rightEyebrowY = landmarks[295].y; // Adjust based on landmark indexing
  const leftEyebrowY = landmarks[334].y; // Adjust based on landmark indexing
  const threshold = 5; // Adjust the threshold as needed

  if (
    rightEyebrowY < landmarks[274].y - threshold ||
    leftEyebrowY < landmarks[463].y - threshold
  ) {
    console.log("Eyebrows raised!");
  }
}

// Track mouth movements
function trackMouth(landmarks) {
  const upperLipY = landmarks[13].y; // Adjust based on landmark indexing
  const lowerLipY = landmarks[14].y; // Adjust based on landmark indexing
  const gap = lowerLipY - upperLipY;

  if (gap > 10) {
    // Adjust the gap threshold as needed
    console.log("Mouth open wide!");
  }
}

// Draw function to render the video and hand predictions
function draw() {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    videoElement,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  // Draw hand predictions
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

  // Display filters based on mood (add your display logic)
  displayFilter();
  canvasCtx.restore();
}

// Function to filter and show artist mood images (implement as needed)
function displayFilter() {
  for (let feature of happyFilterShowing) {
    image(feature, 300, 200, 200, 100);
  }
}
