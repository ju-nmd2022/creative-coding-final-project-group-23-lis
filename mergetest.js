// Select the video and canvas elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let handposeModel, facemeshModel;

// Set up the camera to capture the video feed
async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

// Load HandPose and FaceMesh models
async function loadModels() {
  handposeModel = await handpose.load();
  facemeshModel = await facemesh.load(); 

}
  
  // Set options for FaceMesh
 

// Detect hand and face landmarks and draw them on the video feed
async function detect() {
  // Predict hand landmarks
  const handPredictions = await handposeModel.estimateHands(video);
  // Predict face landmarks
  const facePredictions = await facemeshModel.estimateFaces(video);

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw hand landmarks
  if (handPredictions.length > 0) {
    handPredictions.forEach(prediction => {
      prediction.landmarks.forEach(point => {
        ctx.beginPath();
        ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      });
    });
  }

  

  
  // Draw face landmarks
  if (facePredictions.length > 0) {
    facePredictions.forEach(prediction => {
      prediction.scaledMesh.forEach(point => {
        ctx.beginPath();
        ctx.arc(point[0], point[1], 1, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
      });
    });
  }

  // Keep detecting in a loop
  requestAnimationFrame(detect);
}


// Start the process: set up camera, load models, and start detection
async function main() {
  await setupCamera();
  await loadModels();
  detect(); // Start the detection loop
}

main();
