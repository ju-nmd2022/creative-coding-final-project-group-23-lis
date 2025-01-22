// Arrays holding the images for different emotions
const noseArray = [
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

let randomizedMood = Math.floor(Math.random() * 15);

let mood = "normal";

//SET MOOD BASED ON RANDOM NUMBER
if (randomizedMood <= 2) {
  mood = "sad";
} else if (randomizedMood <= 5) {
  mood = "angry";
} else if (randomizedMood <= 8) {
  mood = "mischievous";
} else if (randomizedMood <= 11) {
  mood = "benevolent";
} else {
  mood = "happy";
}
// Hide or display images and text based on the current mood
function updateMoodImages() {
  document.getElementById("sad-image").style.display = "none";
  document.getElementById("angry-image").style.display = "none";
  document.getElementById("mischievous-image").style.display = "none";
  document.getElementById("benevolent-image").style.display = "none";
  document.getElementById("happy-image").style.display = "none";
  document.getElementById("impatient-image").style.display = "none";

  // Update the displayed image and comment based on the current mood
  if (mood === "sad") {
    //document.getElementById("sad-image").style.display = "block";
    //comment.innerHTML = "Oh... I guess I could paint you blue :(";
    console.log("mood is sad");
  } else if (mood === "angry") {
    //document.getElementById("angry-image").style.display = "block";
    //comment.innerHTML =
    //"AARRGH!!! Here you go stupid, I'll paint you in red >:(";
    console.log("mood is angry");
  } else if (mood === "mischievous") {
    //document.getElementById("mischievous-image").style.display = "block";
    //comment.innerHTML =
    //"Look at you! Ridiculous. This is how you look, haha! >:)";
    console.log("mood is mean");
  } else if (mood === "benevolent") {
    //document.getElementById("benevolent-image").style.display = "block";
    //comment.innerHTML =
    //"Aww, you look lovely today, let's make you look even cuter! :)"
    console.log("mood is kind");
  } else if (mood === "happy") {
    //document.getElementById("happy-image").style.display = "block";
    //comment.innerHTML = "Ah look, I can paint you in a lovely yellow shade :D";
    console.log("mood is happy");
  } else if (mood === "impatient") {
    //document.getElementById("impatient-image").style.display = "block";
    //comment.innerHTML =
    // "I'm a little impatient, and this is boring. If you don't do something interesting soon, my mood will change.";
    console.log("mood is impatient");
  }
}

// Function to load random images from an array and ensure they are loaded before use
function getRandomImage(imageArray) {
  return new Promise((resolve) => {
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    const img = new Image();
    img.src = imageArray[randomIndex];
    img.onload = () => resolve(img); // Resolve the promise once the image is loaded
  });
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
            }

            // Draw images based on current emotion
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            const nose = landmarks.getNose();
            const mouth = landmarks.getMouth();

            const eyeWidth = 70,
              eyeHeight = 60;
            const noseWidth = 60,
              noseHeight = 60;
            const mouthWidth = 80,
              mouthHeight = 60;

            if (selectedAngryEyeImage) {
              canvasCtx.drawImage(
                selectedAngryEyeImage,
                leftEye[3].x - eyeWidth / 2 - 10,
                leftEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedAngryEyeImage,
                rightEye[3].x - eyeWidth / 2 - 10,
                rightEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedNoseImage,
                nose[3].x - noseWidth / 2,
                nose[3].y - noseHeight / 2 - 15,
                noseWidth,
                noseHeight
              );
              canvasCtx.drawImage(
                selectedAngryMouthImage,
                mouth[0].x - mouthWidth / 2 + 35,
                mouth[3].y - mouthHeight / 2 + 20,
                mouthWidth,
                mouthHeight
              );
            } else if (selectedHappyEyeImage) {
              canvasCtx.drawImage(
                selectedHappyEyeImage,
                leftEye[3].x - eyeWidth / 2 - 10,
                leftEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedHappyEyeImage,
                rightEye[3].x - eyeWidth / 2 - 10,
                rightEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedNoseImage,
                nose[3].x - noseWidth / 2,
                nose[3].y - noseHeight / 2 - 15,
                noseWidth,
                noseHeight
              );
              canvasCtx.drawImage(
                selectedHappyMouthImage,
                mouth[0].x - mouthWidth / 2 + 40,
                mouth[3].y - mouthHeight / 2 + 20,
                mouthWidth,
                mouthHeight
              );
            } else if (selectedSadEyeImage) {
              canvasCtx.drawImage(
                selectedSadEyeImage,
                leftEye[3].x - eyeWidth / 2 - 10,
                leftEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedSadEyeImage,
                rightEye[3].x - eyeWidth / 2 - 10,
                rightEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedNoseImage,
                nose[3].x - noseWidth / 2,
                nose[3].y - noseHeight / 2 - 15,
                noseWidth,
                noseHeight
              );
              canvasCtx.drawImage(
                selectedSadMouthImage,
                mouth[0].x - mouthWidth / 2 + 35,
                mouth[3].y - mouthHeight / 2 + 15,
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

// Hide or display images and text based on the current mood
function updateMoodImages() {
  document.getElementById("sad-image").style.display = "none";
  document.getElementById("angry-image").style.display = "none";
  document.getElementById("mischievous-image").style.display = "none";
  document.getElementById("benevolent-image").style.display = "none";
  document.getElementById("happy-image").style.display = "none";
  document.getElementById("impatient-image").style.display = "none";

  // Update the displayed image and comment based on the current mood
  if (mood === "sad") {
    document.getElementById("sad-image").style.display = "block";
    comment.innerHTML = "Oh... I guess I could paint you blue :(";
  } else if (mood === "angry") {
    document.getElementById("angry-image").style.display = "block";
    comment.innerHTML =
      "AARRGH!!! Here you go stupid, I'll paint you in red >:(";
  } else if (mood === "mischievous") {
    document.getElementById("mischievous-image").style.display = "block";
    comment.innerHTML =
      "Look at you! Ridiculous. This is how you look, haha! >:)";
  } else if (mood === "benevolent") {
    document.getElementById("benevolent-image").style.display = "block";
    comment.innerHTML =
      "Aww, you look lovely today, let's make you look even cuter! :)";
  } else if (mood === "happy") {
    document.getElementById("happy-image").style.display = "block";
    comment.innerHTML = "Ah look, I can paint you in a lovely yellow shade :D";
  } else if (mood === "impatient") {
    document.getElementById("impatient-image").style.display = "block";
    comment.innerHTML =
      "I'm a little impatient, and this is boring. If you don't do something interesting soon, my mood will change.";
  }
}
