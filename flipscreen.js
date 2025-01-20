// Initialize face-api.js models
async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");
}

async function startVideo() {
  const video = document.getElementById("video");
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;

  // Once the video starts, we set up canvas and begin detecting
  video.onloadedmetadata = () => {
    const canvas = document.getElementById("overlay");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    detectEmotionAndLandmarks();
  };
}

async function detectEmotionAndLandmarks() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("overlay");
  const ctx = canvas.getContext("2d");

  const options = new faceapi.TinyFaceDetectorOptions();

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, options)
      .withFaceLandmarks()
      .withFaceExpressions();

    // Clear canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw detections and expressions
    if (detections.length > 0) {
      detections.forEach((result) => {
        const { expressions, landmarks } = result;

        // If happy expression is detected, draw happy images
        if (expressions.happy > 0.7) {
          // Adjust threshold as necessary
          drawHappyImages(ctx, landmarks);
        }
      });
    }
  }, 100); // Run detection every 100ms
}

function drawHappyImages(ctx, landmarks) {
  const eyeImage = new Image();
  const noseImage = new Image();
  const mouthImage = new Image();

  eyeImage.src = "images/happy-eye.PNG";
  noseImage.src = "images/happy-nose.PNG";
  mouthImage.src = "images/happy-mouth.PNG";

  // Wait for images to load
  eyeImage.onload = () => {
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const nose = landmarks.getNose();
    const mouth = landmarks.getMouth();

    // Draw happy eye images
    ctx.drawImage(eyeImage, leftEye[0].x - 20, leftEye[0].y - 20, 40, 40);
    ctx.drawImage(eyeImage, rightEye[0].x - 20, rightEye[0].y - 20, 40, 40);

    // Draw happy nose image
    ctx.drawImage(noseImage, nose[3].x - 20, nose[3].y - 20, 40, 40);

    // Draw happy mouth image
    ctx.drawImage(mouthImage, mouth[0].x - 40, mouth[0].y - 20, 80, 40);
  };
}

// Main
(async function () {
  await loadModels();
  startVideo();
})();
