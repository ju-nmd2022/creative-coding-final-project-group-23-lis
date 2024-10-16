// Arrays holding the images for different emotions
const angryEyeArray = [
  "images/eye-zombie.png",
  "images/eye-mad.png",
  "images/eye-close.png",
];

const angryNoseArray = [
  "images/nose-septum.png",
  "images/nose-round.png",
  "images/nose-pig.png",
];

const angryMouthArray = [
  "images/lip-open.png",
  "images/lip-crooked.png",
  "images/lip-edge.png",
];

const happyMouthArray = [
  "images/lip-open.png",
  "images/lip-crooked.png",
  "images/lip-edge.png",
];
// Variables to hold the selected images for each part (to prevent re-randomization)
let selectedAngryEyeImage = null;
let selectedAngryNoseImage = null;
let selectedAngryMouthImage = null;

// Function to load random images from an array
function getRandomImage(imageArray) {
  const randomIndex = Math.floor(Math.random() * imageArray.length);
  const img = new Image();
  img.src = imageArray[randomIndex];
  return img;
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

        // Start processing the video at intervals
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

          if (resizedDetections.length > 0) {
            const landmarks = resizedDetections[0].landmarks;
            const emotions = resizedDetections[0].expressions;

            // Angry threshold check
            const angryThreshold = 0.5; // Adjust this value as needed
            if (emotions.angry > angryThreshold) {
              // Get the face landmark positions (unmirrored)
              const leftEye = landmarks.getLeftEye();
              const rightEye = landmarks.getRightEye();
              const nose = landmarks.getNose();
              const mouth = landmarks.getMouth();

              // Randomize only once when angry is detected for the first time
              if (!selectedAngryEyeImage) {
                selectedAngryEyeImage = getRandomImage(angryEyeArray);
                selectedAngryNoseImage = getRandomImage(angryNoseArray);
                selectedAngryMouthImage = getRandomImage(angryMouthArray);
              }

              // Draw images over the detected positions

              // Eyes
              const eyeWidth = 40,
                eyeHeight = 40;
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

              // Nose
              const noseWidth = 40,
                noseHeight = 40;
              canvasCtx.drawImage(
                selectedAngryNoseImage,
                nose[3].x - noseWidth / 2,
                nose[3].y - noseHeight / 2,
                noseWidth,
                noseHeight
              );

              // Mouth
              const mouthWidth = 60,
                mouthHeight = 40;
              canvasCtx.drawImage(
                selectedAngryMouthImage,
                mouth[0].x - mouthWidth / 2,
                mouth[3].y - mouthHeight / 2,
                mouthWidth,
                mouthHeight
              );
            } else {
              // Reset the selected images when angry is no longer detected
              selectedAngryEyeImage = null;
              selectedAngryNoseImage = null;
              selectedAngryMouthImage = null;
            }
          }
        }, 100);
      });
    })
    .catch((err) => console.error("Error accessing webcam:", err));
}
