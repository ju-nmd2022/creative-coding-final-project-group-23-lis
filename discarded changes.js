"images/nose-septum.png",
  "images/nose-round.png",
  "images/nose-fat.png",
  "images/nose-wings.png",
  "images/nose-pig.png",
];

const angryEyeArray = [
  "images/eye-zombie.png",
  "images/eye-mad.png",
  "images/eye-close.png",
];

const angryMouthArray = [
  "images/lip-wide.png",
  "images/lip-crooked.png",
  "images/lip-open.png",
];

const happyEyeArray = [
  "images/eye-normal.png",
  "images/eye-round.png",
  "images/eye-smile.png",
];
const happyMouthArray = [
  "images/lip-kiss.png",
  "images/lip-tounge.png",
  "images/lip-edge.png",
];
const sadEyeArray = [
  "images/eye-drip.png",
  "images/eye-shiny.png",
  "images/eye-cry.png",
];
const sadMouthArray = [
  "images/lip-bite.png",
  "images/lip-frown.png",
  "images/lip-sad.png",
];

// Variables to hold the selected images for each part (to prevent re-randomization)
let selectedAngryEyeImage = null;
let selectedNoseImage = null; // Common nose image for all emotions
let selectedAngryMouthImage = null;

let selectedHappyEyeImage = null;
let selectedHappyMouthImage = null;

let selectedSadEyeImage = null;
let selectedSadMouthImage = null;

// Previous emotion states to detect changes
let previousEmotion = null;

let offsetWidth = -300;

// Function to load random images from an array and ensure they are loaded before use
function getRandomImage(imageArray) {
  return new Promise((resolve) => {
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    const img = new Image();
    img.src = imageArray[randomIndex];
    img.onload = () => resolve(img); // Resolve the promise once the image is loaded
  });
}
function draw() {
  selectedHappyMouthImage;
}
// Load the Face API models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

// Function to start the webcam video stream
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => {
      video.srcObject = stream;

      // Wait for the video to fully load its metadata (such as width and height)
      video.addEventListener("loadedmetadata", () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        }; // Use video dimensions
        faceapi.matchDimensions(canvas, displaySize);

        // Start processing the video
        setInterval(async () => {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          const canvasCtx = canvas.getContext("2d");
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
          //console.log("Detections:", detections);
          console.log("Video dimensions:", video.videoWidth, video.videoHeight);
          console.log("Canvas dimensions:", canvas.width, canvas.height);

          if (resizedDetections.length > 0) {
            const landmarks = resizedDetections[0].landmarks;
            const emotions = resizedDetections[0].expressions;

            // Determine the highest emotion
            const currentEmotion = Object.keys(emotions).reduce((a, b) =>
              emotions[a] > emotions[b] ? a : b
            );

            // Check if the emotion has changed
            if (currentEmotion !== previousEmotion) {
              previousEmotion = currentEmotion;

              // Reset all images
              selectedAngryEyeImage = null;
              selectedNoseImage = null;
              selectedAngryMouthImage = null;
              selectedHappyEyeImage = null;
              selectedHappyMouthImage = null;
              selectedSadEyeImage = null;
              selectedSadMouthImage = null;

              // Handle each emotion
              if (currentEmotion === "angry" && emotions.angry > 0.5) {
                [
                  selectedAngryEyeImage,
                  selectedNoseImage,
                  selectedAngryMouthImage,
                ] = await Promise.all([
                  getRandomImage(angryEyeArray),
                  getRandomImage(noseArray),
                  getRandomImage(angryMouthArray),
                ]);
              } else if (currentEmotion === "happy" && emotions.happy > 0.5) {
                [
                  selectedHappyEyeImage,
                  selectedNoseImage,
                  selectedHappyMouthImage,
                ] = await Promise.all([
                  getRandomImage(happyEyeArray),
                  getRandomImage(noseArray),
                  getRandomImage(happyMouthArray),
                ]);
              } else if (currentEmotion === "sad" && emotions.sad > 0.5) {
                [
                  selectedSadEyeImage,
                  selectedNoseImage,
                  selectedSadMouthImage,
                ] = await Promise.all([
                  getRandomImage(sadEyeArray),
                  getRandomImage(noseArray),
                  getRandomImage(sadMouthArray),
                ]);
            }

            // Draw images based on current emotion
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            const nose = landmarks.getNose();
            const mouth = landmarks.getMouth();

            const eyeWidth = 40,
              eyeHeight = 40;
            const noseWidth = 40,
              noseHeight = 40;
            const mouthWidth = 60,
              mouthHeight = 40;

            //canvasCtx.drawImage(getRandomImage(noseArray, 0, 0, 0, 10, 10));

            if (selectedAngryEyeImage) {
              canvasCtx.drawImage(
                selectedAngryEyeImage,
                leftEye[3].x - eyeWidth / 2,
                leftEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedAngryEyeImage,
                rightEye[3].x - eyeWidth / 2,
                rightEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedNoseImage,
                nose[3].x - noseWidth / 2,
                nose[3].y - noseHeight / 2,
                noseWidth,
                noseHeight
              );
              canvasCtx.drawImage(
                selectedAngryMouthImage,
                mouth[0].x - mouthWidth / 2,
                mouth[3].y - mouthHeight / 2,
                mouthWidth,
                mouthHeight
              );
            } else if (selectedHappyEyeImage) {
              canvasCtx.drawImage(
                selectedHappyEyeImage,
                leftEye[3].x - eyeWidth / 2,
                leftEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedHappyEyeImage,
                rightEye[3].x - eyeWidth / 2,
                rightEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedNoseImage,
                nose[3].x - noseWidth / 2,
                nose[3].y - noseHeight / 2,
                noseWidth,
                noseHeight
              );
              canvasCtx.drawImage(
                selectedHappyMouthImage,
                mouth[0].x - mouthWidth / 2,
                mouth[3].y - mouthHeight / 2,
                mouthWidth,
                mouthHeight
              );
            } else if (selectedSadEyeImage) {
              canvasCtx.drawImage(
                selectedSadEyeImage,
                leftEye[3].x - eyeWidth / 2,
                leftEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedSadEyeImage,
                rightEye[3].x - eyeWidth / 2,
                rightEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedNoseImage,
                nose[3].x - noseWidth / 2,
                nose[3].y - noseHeight / 2,
                noseWidth,
                noseHeight
              );
              canvasCtx.drawImage(
                selectedSadMouthImage,
                mouth[0].x - mouthWidth / 2,
                mouth[3].y - mouthHeight / 2,
                mouthWidth,
                mouthHeight
              );
            }
          }
        }, 100); // Update every 100ms
      });
    })
    .catch((err) => console.error("Error accessing webcam:", err));
}