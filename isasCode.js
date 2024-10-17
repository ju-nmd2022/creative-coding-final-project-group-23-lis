//-------------------------------LOAD WINDOW-------------------------------
// Wait for the window to fully load before running the script
window.addEventListener("load", () => {
  // Load the face-api models
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  ]).then(() => {
    startVideo();
    randomizeMood(); // Randomize mood right after models are loaded
    displayCurrentMood(mood); // Display the current mood right after randomizing
  });
});

//-------------------------------SET UP-------------------------------
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => (video.srcObject = stream))
    .catch((err) => console.error("Error accessing the camera: ", err));
}
const video = document.getElementById("video");

//-------------------------------ARTIST BOT-------------------------------
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let comment = document.getElementById("artist-comment");
let moodTimeout;
let mood = "normal"; // Default mood is set to "normal"

let previousEmotion = null; // Global variable to store the previously detected emotion

function preload() {
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

//-------------------------------IMPATIENT MODE-------------------------------

function transitionToImpatient() {
  mood = "impatient";
  previousEmotion = null;
  updateMoodImages(null, mood);

  moodTimeout = setTimeout(() => {
    randomizeMood();
  }, 10000);
}

let lastInteractionTime = Date.now();
const impatienceThreshold = 5000;

//-------------------------------FACE API-------------------------------

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  const videoContainer = document.getElementById("video-container");
  videoContainer.append(canvas);

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  let lastEmotionDetection = Date.now();
  const emotionDetectionInterval = 1000;

  setInterval(async () => {
    if (Date.now() - lastEmotionDetection > emotionDetectionInterval) {
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

        if (maxEmotion !== previousEmotion) {
          previousEmotion = maxEmotion;
          generateArt(maxEmotion, mood);
        }
      }

      lastEmotionDetection = Date.now();
    }
  }, 100);
});

//-------------------------------ART GENERATION BASED ON USER MOOD-------------------------------

function randomizeMood() {
  let randomizedMood = Math.floor(Math.random() * 15);

  if (randomizedMood <= 2) {
    mood = "bene";
  } else if (randomizedMood <= 5) {
    mood = "misc";
  } else if (randomizedMood <= 8) {
    mood = "normal";
  }
}

function generateArt(emotion, mode) {
  if (emotion === "neutral") {
    comment.innerHTML =
      "You are not displaying any emotion. The artist is waiting for some emotion.";
    document.getElementById("neutral-image").style.display = "block";
    video.style.filter = "";
    ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
    return;
  }

  if (mode === "bene") {
    switch (emotion) {
      case "happy":
        drawHappyBeneArt();
        break;
      case "sad":
        drawSadBeneArt();
        break;
      case "angry":
        drawAngryBeneArt();
        break;
    }
  } else if (mode === "misc") {
    switch (emotion) {
      case "happy":
        drawHappyMiscArt();
        break;
      case "sad":
        drawSadMiscArt();
        break;
      case "angry":
        drawAngryMiscArt();
        break;
    }
  } else if (mode === "normal") {
    switch (emotion) {
      case "happy":
        drawHappyNeutralArt();
        break;
      case "sad":
        drawSadNeutralArt();
        break;
      case "angry":
        drawAngryNeutralArt();
        break;
    }
  }

  updateMoodImages(emotion, mode);
  displayCurrentMood(mode);
}

//------------------------------------------------------------------------
//-------------------------------NORMAL ART-------------------------------
//------------------------------------------------------------------------
const canvas2 = document.getElementById("artCanvas2");
const ctxx = canvas2.getContext("2d"); // Define it once for global access

//-------------------------------FUNCTIONS FOR CANVAS ART-----------------
function happyNeutralArt1() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
  ctxx.fillStyle = "yellow";
  ctxx.beginPath();
  ctxx.arc(150, 150, 50, 0, Math.PI * 2);
  ctxx.fill();
  ctxx.fillStyle = "black";
  ctxx.font = "30px Arial";
  ctxx.fillText("Smiling Sun", 100, 250);
}

function sadNeutralArt1() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
  ctxx.fillStyle = "blue";
  ctxx.beginPath();
  ctxx.arc(150, 150, 50, 0, Math.PI * 2);
  ctxx.fill();
  ctxx.fillStyle = "black";
  ctxx.font = "30px Arial";
  ctxx.fillText("Raindrop", 110, 250);
}

function angryNeutralArt1() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
  ctxx.fillStyle = "red";
  ctxx.beginPath();
  ctxx.arc(150, 150, 50, 0, Math.PI * 2);
  ctxx.fill();
  ctxx.fillStyle = "black";
  ctxx.font = "30px Arial";
  ctxx.fillText("Angry Flame", 90, 250);
}

// the array
let neutralArt = {
  happy: [happyNeutralArt1],
  sad: [sadNeutralArt1],
  angry: [angryNeutralArt1],
};

// the function for the array
function neutralArtGenerator(emotion) {
  const art = neutralArt[emotion];
  const randomIndex = Math.floor(Math.random() * art.length);
  const selectedArtFunction = art[randomIndex];

  selectedArtFunction();
}

//-------------------------------FUNCTIONS FOR DISPLAYING ALL NEUTRAL-------------------------------

function drawHappyNeutralArt() {
  console.log("Drawing normal happy art");
  document.getElementById("happy-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomNeuComment("happy");
  neutralArtGenerator("happy");
}

function drawSadNeutralArt() {
  console.log("Drawing normal sad art");
  document.getElementById("sad-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomNeuComment("sad");
  neutralArtGenerator("sad");
}

function drawAngryNeutralArt() {
  console.log("Drawing normal angry art");
  document.getElementById("angry-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomNeuComment("angry");
  neutralArtGenerator("angry");
}

//-------------------------------COMMENTS FOR NEUTRAL AND FUNCTION-------------------------------

let neutralComments = {
  happy: [
    "You seem to be in a good mood! It’s nice to see some positivity. Keep going!",
    "It’s always great to feel happy! Let’s keep that vibe going. 😊",
    "I see that smile! It’s a good day, isn’t it? Keep enjoying the moment.",
  ],
  sad: [
    "It looks like you're feeling a bit down. It’s okay, we all have those days.",
    "Sadness is just a part of life. Take your time, everything will be alright.",
    "It’s normal to feel sad sometimes. Things will look up soon.",
  ],
  angry: [
    "I can see that you're feeling a bit frustrated. It's okay, take a moment for yourself.",
    "Anger is a powerful emotion. Take a deep breath, and let’s calm things down.",
    "I sense some tension. It’s alright to feel angry, but remember, things will improve.",
  ],
};

function getRandomNeuComment(emotion) {
  const comments = neutralComments[emotion];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}

//----------------------------------------------------------------------
//-------------------------------BENE ART-------------------------------
//----------------------------------------------------------------------

//-------------------------------FUNCTIONS FOR CANVAS ART-----------------

const canvas3 = document.getElementById("artCanvas");
const ctx3 = canvas3.getContext("2d"); // Define it once for global access

function animateGradient(emotion) {
  let gradient = ctx3.createLinearGradient(0, 0, canvas3.width, canvas3.height);

  if (emotion === "happy") {
    gradient.addColorStop(0, "yellow");
    gradient.addColorStop(1, "orange");
  } else if (emotion === "sad") {
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "purple");
  } else if (emotion === "angry") {
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "black");
  }

  // Clear the canvas
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

  // Apply the gradient with transparency (so you can still see the video)
  ctx3.globalAlpha = 0.5;
  ctx3.fillStyle = gradient;
  ctx3.fillRect(0, 0, canvas3.width, canvas3.height);

  // Recursive animation
  requestAnimationFrame(() => animateGradient(emotion));
}

function drawHappyBeneArt() {
  console.log("Drawing happy art in bene mode");

  // Show the happy image and hide the neutral image
  document.getElementById("happy-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";

  // Update the comment
  comment.innerHTML = getRandomBeneComment("happy");

  // Start animating the gradient for "happy" emotion
  animateGradient("happy");
}

function drawSadBeneArt() {
  console.log("Drawing sad art in bene mode");
  document.getElementById("sad-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomBeneComment("sad");
}

function drawAngryBeneArt() {
  console.log("Drawing angry art in bene mode");
  document.getElementById("angry-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomBeneComment("angry");
}

//-------------------------------COMMENTS FOR BENE AND FUNCTION-------------------------------
let beneComments = {
  happy: [
    "I'm so glad to see you happy! Keep smiling, you're doing great! 😊",
    "Your happiness lights up the room! Let's make this moment even better! 🌟",
    "Ah, the joy in your face is contagious! Keep up the positivity! 😄",
  ],
  sad: [
    "I see you're feeling down, but I'm here to remind you that brighter days are ahead. 🌈",
    "It's okay to feel sad sometimes, but remember, you are strong and capable. 💪",
    "Take a deep breath, you're not alone. We'll get through this together. 💖",
  ],
  angry: [
    "I know you're upset, but take a moment to breathe. Everything will be okay. 🌻",
    "You're allowed to be angry, but remember, peace and calm will come soon. 🌸",
    "Anger is natural, but let's take a step back and let it go. You deserve happiness! 🌞",
  ],
};

function getRandomBeneComment(emotion) {
  const comments = beneComments[emotion];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}

//----------------------------------------------------------------------
//-------------------------------MISC ART-------------------------------
//----------------------------------------------------------------------

//-------------------------------THE EFFECTS FOR MISC-------------------

//this is a glitch effect applied for happy
function applyGlitchEffect() {
  let glitchTimeouts = [];

  function glitch() {
    videoElement.style.transform = `translate(${Math.random() * 20 - 10}px, ${
      Math.random() * 20 - 10
    }px)`;
    videoElement.style.filter = `hue-rotate(${
      Math.random() * 360
    }deg) contrast(${Math.random() * 2 + 1})`;
    videoElement.style.opacity = Math.random() * 0.6 + 0.4;

    glitchTimeouts.push(
      setTimeout(() => {
        videoElement.style.transform = "";
        videoElement.style.filter = "";
        videoElement.style.opacity = 1;
      }, Math.random() * 500 + 50)
    );
  }

  const glitchInterval = setInterval(glitch, Math.random() * 300 + 100);

  setTimeout(() => {
    clearInterval(glitchInterval);
    glitchTimeouts.forEach(clearTimeout);
    videoElement.style.transform = "";
    videoElement.style.filter = "";
    videoElement.style.opacity = 1;
  }, 2000); // glitch for 2 seconds
}

//this is particle code for all the emotions on misc

const canvas4 = document.getElementById("artCanvas");
const ctx4 = canvas4.getContext("2d"); // Only define once here

let particles = [];

class Particle {
  constructor(x, y, velocityX, velocityY, color, size = 3) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.size = size;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    if (this.size < 5) this.size += 0.05;
  }

  draw(ctx4) {
    ctx4.fillStyle = this.color;
    ctx4.beginPath();
    ctx4.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx4.fill();
  }
}

function createParticles(emotion) {
  particles = [];
  const numParticles = 100;

  let color, speed, opacity;
  if (emotion === "happy") {
    color = "yellow";
    speed = 2;
    opacity = 1;
  } else if (emotion === "sad") {
    color = "blue";
    speed = 0.5;
    opacity = 0.8;
  } else if (emotion === "angry") {
    color = "red";
    speed = 4;
    opacity = 1;
  }

  for (let i = 0; i < numParticles; i++) {
    let x = Math.random() * canvas4.width;
    let y = Math.random() * canvas4.height;
    let velocityX = (Math.random() - 0.5) * speed;
    let velocityY = (Math.random() - 0.5) * speed;
    particles.push(new Particle(x, y, velocityX, velocityY, color, opacity));
  }

  requestAnimationFrame(animateParticles);
}

function animateParticles() {
  ctx4.clearRect(0, 0, canvas4.width, canvas4.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw(ctx4);
  });

  requestAnimationFrame(animateParticles);
}

//-------------------FUNCTIONS FOR DISPLAYING MISC-------------------
function drawHappyMiscArt() {
  console.log("Drawing happy art in misc mode");
  document.getElementById("happy-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomMischievousComment("happy");
  applyGlitchEffect();
  createParticles("happy");
}

function drawSadMiscArt() {
  console.log("Drawing sad art in misc mode");
  document.getElementById("sad-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomMischievousComment("sad");
  createParticles("sad");
}

function drawAngryMiscArt() {
  console.log("Drawing angry art in misc mode");
  document.getElementById("mischievous-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomMischievousComment("angry");
  video.style.filter = getRandomMiscFilter("angry");
  createParticles("angry");
}

//-------------------------COMMENTS FOR MISC AND FUNCTION--------------------------
let mischievousComments = {
  happy: [
    "Oh, you're happy? Let’s see how long that lasts!",
    "You look so happy, but I know something’s up.",
    "Is this happiness, or are you just pretending? Let’s find out!",
  ],
  sad: [
    "Oh, feeling sad? You don’t fool me, I know you’re up to something.",
    "Sadness? Or maybe you're just faking it to get some attention?",
    "I see that frown. Let’s see what kind of mischief I can create from it!",
  ],
  angry: [
    "You’re angry, huh? Let me make this even more interesting.",
    "Oh, look at you! So mad, but I bet I can turn this into something fun.",
    "Anger? Let's see how long that lasts before something mischievous happens!",
  ],
};

let miscFilter = {
  //not in use
  happy: [
    "brightness(1.5) saturate(1.5)",
    "brightness(2) saturate(1.6)",
    "sepia(0.5) contrast(1.2)",
  ],
  //not in use
  sad: [
    "grayscale(1) brightness(2)",
    "grayscale(1) brightness(0.7)",
    "grayscale(1) brightness(0.5) contrast(1.3)",
  ],
  angry: [
    "contrast(2) saturate(3)",
    "contrast(1) saturate(2) grayscale(1)",
    "contrast(4) saturate(2) hue-rotate(180deg)",
  ],
};

//random filter
function getRandomMiscFilter(emotion) {
  const filters = miscFilter[emotion];
  const randomIndex = Math.floor(Math.random() * filters.length);
  return filters[randomIndex];
}

// random comment
function getRandomMischievousComment(emotion) {
  const comments = mischievousComments[emotion];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}

//---------------------------------------------------------------------------------------
//-------------------------------UPDATE ARTIST IMAGE LOGIC-------------------------------
//---------------------------------------------------------------------------------------

document.getElementById("mood-text").innerHTML = "";

// Function to update the mood text
function displayCurrentMood(mode) {
  const moodTextElement = document.getElementById("mood-text");

  switch (mode) {
    case "bene":
      moodTextElement.innerHTML =
        "The artist is in Benevolent mode, spreading positivity!";
      break;
    case "misc":
      moodTextElement.innerHTML =
        "The artist is in Mischievous mode, watch out!";
      break;
    case "normal":
      moodTextElement.innerHTML =
        "The artist is in Neutral mode, keeping things balanced.";
      break;
    case "impatient":
      moodTextElement.innerHTML =
        "The artist is in Impatient mode, a bit annoyed!";
      break;
    default:
      moodTextElement.innerHTML = "The artist's mood is unknown.";
  }
}

function updateMoodImages(emotion, mode) {
  // Clear all images
  document.getElementById("sad-image").style.display = "none";
  document.getElementById("angry-image").style.display = "none";
  document.getElementById("mischievous-image").style.display = "none";
  document.getElementById("benevolent-image").style.display = "none";
  document.getElementById("happy-image").style.display = "none";
  document.getElementById("impatient-image").style.display = "none";

  if (mood === "impatient") {
    document.getElementById("impatient-image").style.display = "block";
    comment.innerHTML =
      "I'm a little impatient, and this is boring. Do something interesting!";
  } else {
    switch (emotion) {
      case "happy":
        document.getElementById("happy-image").style.display = "block";
        comment.innerHTML = getRandomComment(emotion, mode);
        break;
      case "sad":
        document.getElementById("sad-image").style.display = "block";
        comment.innerHTML = getRandomComment(emotion, mode);
        break;

      case "angry":
        document.getElementById("angry-image").style.display = "block";
        comment.innerHTML = getRandomComment(emotion, mode);
        break;
      case "mischievous":
        document.getElementById("mischievous-image").style.display = "block";
        comment.innerHTML = getRandomComment(emotion, mode);
        break;
      default:
        console.log("Emotion not handled:", emotion);
    }
  }
  displayCurrentMood(mode);
}

function getRandomComment(emotion, mode) {
  let comments = [];

  if (mode === "bene") {
    comments = beneComments[emotion];
  } else if (mode === "misc") {
    comments = mischievousComments[emotion];
  } else if (mode === "normal") {
    comments = neutralComments[emotion];
  }

  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}

function hideAllImages() {
  document.getElementById("sad-image").style.display = "none";
  document.getElementById("angry-image").style.display = "none";
  document.getElementById("mischievous-image").style.display = "none";
  document.getElementById("happy-image").style.display = "none";
  document.getElementById("impatient-image").style.display = "none";
}
