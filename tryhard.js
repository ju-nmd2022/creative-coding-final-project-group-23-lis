//-------------------------------LOAD WINDOW-------------------------------
// Wait for the window to fully load before running the script
window.addEventListener("load", () => {
  // Load the face-api models
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  ]).then(startVideo);
});

//-------------------------------SET UP-------------------------------
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => (video.srcObject = stream))
    .catch((err) => console.error("Error accessing the camera: ", err));
}
const video = document.getElementById("video");

//-------------------------------FILTERS-------------------------------

//-------------------------------ARTIST BOT-------------------------------
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let comment = document.getElementById("artist-comment");
let moodTimeout;

function preload() {
  //IMAGES FOR THE ARTIST EMOTIONS
  sadArtist = loadImage(
    "images/artist-sad.PNG",
    () => console.log("Sad image loaded."),
    () => console.error("Failed to load sad image.")
  );
  happyArtist = loadImage(
    "images/artist-happy.PNG",
    () => console.log("Happy image loaded."),
    () => console.error("Failed to load happy image.")
  );
  angryArtist = loadImage(
    "images/artist-angry.PNG",
    () => console.log("Angry image loaded."),
    () => console.error("Failed to load angry image.")
  );
  misArtist = loadImage(
    "images/artist-mis.PNG",
    () => console.log("Mischievous image loaded."),
    () => console.error("Failed to load mischievous image.")
  );
  benArtist = loadImage(
    "images/artist-ben.PNG",
    () => console.log("Benevolent image loaded."),
    () => console.error("Failed to load benevolent image.")
  );
  impatientArtist = loadImage(
    "images/artist-impatient.PNG",
    () => console.log("Impatient image loaded."),
    () => console.error("Failed to load impatient image.")
  );
}

const videoElement = document.getElementById("video");

//-------------------------------FACE API-------------------------------

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  const videoContainer = document.getElementById("video-container");
  videoContainer.append(canvas); // Append canvas inside video container

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    if (detections.length > 0) {
      const emotions = detections[0].expressions;
      const maxEmotion = Object.keys(emotions).reduce((a, b) =>
        emotions[a] > emotions[b] ? a : b
      );

      // Determine "Good" or "Bad" mode
      const mode = Math.random() < 0.5 ? "good" : "bad";

      // Function to generate art based on emotion and mode
      generateArt(maxEmotion, mode);

      // Display emotion in UI
      const box = detections[0].detection.box;
      const emotionBoxX = box.x + box.width / 2;
      const emotionBoxY = box.y - 10;

      document.getElementById("emotion").style.position = "absolute";
      document.getElementById("emotion").style.left = `${emotionBoxX}px`;
      document.getElementById("emotion").style.top = `${emotionBoxY}px`;
      document.getElementById("emotion").textContent = `${maxEmotion} (${(
        emotions[maxEmotion] * 100
      ).toFixed(2)}%)`;
    }
  }, 100);
});

//-------------------------------ART GENERATION-------------------------------

// Function to generate art based on emotion and mode
function generateArt(emotion, mode) {
  if (mode === "good") {
    switch (emotion) {
      case "happy":
        drawHappyGoodArt();
        break;
      case "sad":
        drawSadGoodArt();
        break;
      case "angry":
        drawAngryGoodArt();
        break;
      // Add more cases for other emotions
    }
  } else {
    switch (emotion) {
      case "happy":
        drawHappyBadArt();
        break;
      case "sad":
        drawSadBadArt();
        break;
      case "angry":
        drawAngryBadArt();
        break;
      // Add more cases for other emotions
    }
  }
}

// Placeholder functions to draw the specific art based on emotion and mode
function drawHappyGoodArt() {
  console.log("Drawing happy art in good mode");
  // Draw or generate happy and positive art here (bright colors, smiling faces, etc.)
}

function drawSadGoodArt() {
  console.log("Drawing sad art in good mode");
  // Draw or generate positive art for sadness (e.g., hope, light at the end of the tunnel)
}

function drawAngryGoodArt() {
  console.log("Drawing angry art in good mode");
  // Draw or generate art that channels anger positively (e.g., energy, abstract shapes)
}

function drawHappyBadArt() {
  console.log("Drawing happy art in bad mode");
  // Draw or generate unsettling or ironic happy art (e.g., overly bright but with distortions)
}

function drawSadBadArt() {
  console.log("Drawing sad art in bad mode");
  // Draw or generate negative art for sadness (e.g., darker colors, heavy lines)
}

function drawAngryBadArt() {
  console.log("Drawing angry art in bad mode");
  // Draw or generate destructive or chaotic art (e.g., jagged lines, aggressive colors)
}
