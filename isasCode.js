//-------------------------------LOAD WINDOW-------------------------------
//-------------------------------LOAD WINDOW-------------------------------
//-------------------------------LOAD WINDOW-------------------------------
window.addEventListener("load", () => {
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  ]).then(() => {
    startVideo();
    randomizeMood();
    displayCurrentMood(mood);
  });
});

//-------------------------------SET UP-------------------------------
//-------------------------------SET UP-------------------------------
//-------------------------------SET UP-------------------------------

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => (video.srcObject = stream))
    .catch((err) => console.error("Error accessing the camera: ", err));
}
const video = document.getElementById("video");

//-------------------------------ARTIST BOT-------------------------------
//-------------------------------ARTIST BOT-------------------------------
//-------------------------------ARTIST BOT-------------------------------

let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let comment = document.getElementById("artist-comment");
let mood = "normal";
let previousEmotion = null; // Global variable to store the previously detected emotion

//The following lines of code with implementing images are Selma Palmquist's code
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
//-------------------------------IMPATIENT MODE-------------------------------
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
//END OF SELMA'S CODE

//-------------------------------FACE API-------------------------------
//-------------------------------FACE API-------------------------------
//-------------------------------FACE API-------------------------------

// This code is possible because of implementation of FACE API - URL: https://github.com/justadudewhohacks/face-api.js/
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

//-------------------------------MOOD SETTINGS-------------------------------
//-------------------------------MOOD SETTINGS-------------------------------
//-------------------------------MOOD SETTINGS-------------------------------

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

    //prob exists better ways to do this on but here we are
    stopRainEffect();
    stopFloatingHearts();
    stopFireworks();
    stopSuns();
    stopBubbles();
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
//------------------------------------------------------------------------
//-------------------------------NEUTRAL MOOD-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

const canvas2 = document.getElementById("artCanvas2");
const ctxx = canvas2.getContext("2d");

//------------------------------------------------------------------------
//-------------------------------THE ART----------------------------------
//------------------------------------------------------------------------

//THE ART HAS BEEN CREATED WITH THE HELP OF CHAT GPT AND FOLLOWING SOURCES AS INSPIRATION:
//--------------------------------URL:--------------------------------
// BUBBLES FOR BENE ANGRY: https://codepen.io/Jelilicent/pen/oNzPjEo
// SUN: https://codepen.io/hsfo3o/pen/BxXjyL
// HEARTS: ALSO CODEPEN

//GLITCH
function applyScreenGlitchEffect() {
  let glitchTimeouts = [];

  function glitch() {
    document.body.style.transform = `translate(${Math.random() * 20 - 10}px, ${
      Math.random() * 20 - 10
    }px)`;

    document.body.style.filter = `hue-rotate(${
      Math.random() * 360
    }deg) contrast(${Math.random() * 2 + 1})`;

    document.body.style.opacity = Math.random() * 0.3 + 0.9;

    glitchTimeouts.push(
      setTimeout(() => {
        document.body.style.transform = "";
        document.body.style.filter = "";
        document.body.style.opacity = 1;
      }, Math.random() * 500 + 50)
    );
  }

  const glitchInterval = setInterval(glitch, Math.random() * 300 + 100);

  setTimeout(() => {
    clearInterval(glitchInterval);
    glitchTimeouts.forEach(clearTimeout);
    document.body.style.transform = "";
    document.body.style.filter = "";
    document.body.style.opacity = 1;
  }, 2000);
}

//SUN
let sunInterval;
let sunArray = [];

function createSunGrid() {
  function createSuns() {
    const sun = document.createElement("div");
    sun.classList.add("createSun");

    sunArray.push(sun);

    sun.style.left = `${Math.random() * 100}vw`;
    sun.style.top = `${Math.random() * 100}vh`;

    const size = Math.random() * 15 + 10;
    sun.style.width = `${size}px`;
    sun.style.height = `${size}px`;

    const duration = Math.random() * 3 + 3;
    sun.style.animationDuration = `${duration}s`;

    sun.style.opacity = Math.random() * 0.5 + 0.5;
  }

  sunInterval = setInterval(createSuns, 500);

  const style = document.createElement("style");
  style.innerHTML = `
    #sun-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none; /* Prevents suns from blocking interactions */
      z-index: 9999; /* Ensure it appears on top */
    }

    .createSun {
      position: absolute;
      border-radius: 50%;
      background-color: yellow;
      box-shadow: 0 0 35px 5px orange, 0 0 25px 10px orange inset;
      animation: float 5s ease-in-out infinite;
    }

    @keyframes float {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
      100% {
        transform: translateY(0);
      }
    }

    body {
      background-color: rgba(28, 40, 51, 100);
      margin: 0;
      overflow: hidden; /* Prevent scrollbars */
    }
  `;
  document.head.appendChild(style);
}

function stopSuns() {
  clearInterval(sunInterval);

  sunArray.forEach((sun) => {
    sun.remove();
  });

  sunArray = [];
}

//BASIC SUNS
function happyNeutralArt1() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);

  for (let i = 0; i < 5; i++) {
    const sunX = Math.random() * canvas2.width;
    const sunY = Math.random() * canvas2.height;
    const sunRadius = 30 + Math.random() * 20;
    const rayLength = 20 + Math.random() * 10;
    const numRays = 12;

    ctxx.fillStyle = "yellow";
    ctxx.beginPath();
    ctxx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctxx.fill();

    for (let j = 0; j < numRays; j++) {
      const angle = ((Math.PI * 2) / numRays) * j;
      const rayX1 = sunX + Math.cos(angle) * sunRadius;
      const rayY1 = sunY + Math.sin(angle) * sunRadius;
      const rayX2 = sunX + Math.cos(angle) * (sunRadius + rayLength);
      const rayY2 = sunY + Math.sin(angle) * (sunRadius + rayLength);

      ctxx.strokeStyle = "orange";
      ctxx.lineWidth = 3;
      ctxx.beginPath();
      ctxx.moveTo(rayX1, rayY1);
      ctxx.lineTo(rayX2, rayY2);
      ctxx.stroke();
    }
  }
}

//SOME ABSTRACT SAD ART
function sadNeutralArt1() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);

  const numCircles = 20;

  for (let i = 0; i < numCircles; i++) {
    const circleX = Math.random() * canvas2.width;
    const circleY = Math.random() * canvas2.height;
    const circleRadius = 10 + Math.random() * 20;

    ctxx.fillStyle = "blue";
    ctxx.beginPath();
    ctxx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
    ctxx.fill();
  }
}

//SAME BUT RED AND FASTER
let circles = [];

function angryNeutralArt1() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);

  const numCircles = 20;

  for (let i = 0; i < numCircles; i++) {
    let circle = {
      x: Math.random() * canvas2.width,
      y: Math.random() * canvas2.height,
      radius: 10 + Math.random() * 20,
      dx: Math.random() * 4 - 2,
      dy: Math.random() * 4 - 2,
      color: "red",
    };
    circles.push(circle);
  }

  function animateShakingCircles() {
    ctxx.clearRect(0, 0, canvas2.width, canvas2.height);

    circles.forEach((circle) => {
      circle.x += circle.dx;
      circle.y += circle.dy;

      if (Math.random() < 0.1) {
        circle.dx = Math.random() * 10 - 3;
        circle.dy = Math.random() * 10 - 3;
      }

      ctxx.fillStyle = circle.color;
      ctxx.beginPath();
      ctxx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctxx.fill();
    });

    requestAnimationFrame(animateShakingCircles);
  }

  animateShakingCircles();
}

//HAPPY "FIREWORKS OR SMTH"
let fireworks = [];
let isFireworksActive = false;

function startFireworks() {
  if (!isFireworksActive) {
    isFireworksActive = true;
    createFireworks(5);
    animateFireworks();
  }
}

function stopFireworks() {
  isFireworksActive = false;
  fireworks.length = 0;
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
}

function createFireworks(numFireworks) {
  for (let i = 0; i < numFireworks; i++) {
    const x = Math.random() * canvas2.width;
    const y = canvas2.height;
    const color = getRandomColor();
    const radius = Math.random() * 5 + 3;

    fireworks.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: -(Math.random() * 3 + 2),
      radius: radius,
      color: color,
      alpha: 1,
    });
  }
}

function animateFireworks() {
  if (!isFireworksActive) return;

  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);

  fireworks.forEach((firework, index) => {
    firework.x += firework.vx;
    firework.y += firework.vy;

    firework.alpha -= 0.01;

    ctxx.beginPath();
    ctxx.arc(firework.x, firework.y, firework.radius, 0, Math.PI * 2);
    ctxx.fillStyle = firework.color;
    ctxx.fill();

    if (firework.alpha <= 0) {
      fireworks.splice(index, 1);
    }
  });

  if (fireworks.length < 5) {
    createFireworks(1);
  }

  requestAnimationFrame(animateFireworks);
}

function getRandomColor() {
  const colors = ["red", "yellow", "blue", "green", "purple", "orange"];
  return colors[Math.floor(Math.random() * colors.length)];
}

//SAD RAIN ANIMATION
const raindrops = [];
let isRaining = false;

function resizeCanvas() {
  canvas2.width = video.videoWidth;
  canvas2.height = video.videoHeight;
}

video.addEventListener("play", () => {
  resizeCanvas();
});

function stopRainEffect() {
  isRaining = false;
  raindrops.length = 0;
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
}

function startRainEffect() {
  if (!isRaining) {
    isRaining = true;
    createRaindrops(100);
    animateRain();
  }
}

function createRaindrops(numDrops) {
  for (let i = 0; i < numDrops; i++) {
    raindrops.push({
      x: Math.random() * canvas2.width,
      y: Math.random() * canvas2.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 2,
    });
  }
}

function rainEffect() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);

  if (isRaining) {
    raindrops.forEach((drop) => {
      ctxx.beginPath();
      ctxx.moveTo(drop.x, drop.y);
      ctxx.lineTo(drop.x, drop.y + drop.length);
      ctxx.strokeStyle = "rgba(173, 216, 230, 0.6)";
      ctxx.lineWidth = 2;
      ctxx.stroke();

      drop.y += drop.speed;

      if (drop.y > canvas2.height) {
        drop.y = 0;
        drop.x = Math.random() * canvas2.width;
      }
    });
  }
}

function animateRain() {
  rainEffect();
  if (isRaining) {
    requestAnimationFrame(animateRain);
  }
}

//-------------------------------------------------------------------------------------------------
//-------------------------------DETERMINES WHICH ART TO DISPLAY-------------------------------
//-------------------------------------------------------------------------------------------------

let neutralArt = {
  happy: [startFireworks, happyNeutralArt1],
  sad: [sadNeutralArt1, startRainEffect],
  angry: [angryNeutralArt1, applyScreenGlitchEffect],
};

// FUNCTION FOR THE ARRAY
function neutralArtGenerator(emotion) {
  const art = neutralArt[emotion];
  const randomIndex = Math.floor(Math.random() * art.length);
  const selectedArtFunction = art[randomIndex];

  selectedArtFunction();
}

//-------------------------------------------------------------------------------------------------
//-------------------------------FUNCTIONS FOR DISPLAYING ALL NEUTRAL-------------------------------
//-------------------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------------
//-------------------------------COMMENTS FOR NEUTRAL AND FUNCTION-------------------------------
//-------------------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------BENE ART----------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

//-------------------------------THE ART-----------------------------

//HEARTS
let floatingHeartsInterval;
let heartsArray = [];

function createFloatingHearts() {
  function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    document.body.appendChild(heart);

    heartsArray.push(heart);

    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${Math.random() * 100}vh`;

    const size = Math.random() * 15 + 10;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;

    const duration = Math.random() * 3 + 3;
    heart.style.animationDuration = `${duration}s`;

    heart.style.opacity = Math.random() * 0.5 + 0.5;
  }

  floatingHeartsInterval = setInterval(createHeart, 500);

  const style = document.createElement("style");
  style.innerHTML = `
    .floating-heart {
      position: absolute;
      width: 100px;
      height: 90px;
      background: transparent;
    }

    .floating-heart:before, .floating-heart:after {
      position: absolute;
      content: "";
      left: 50px;
      top: 0;
      width: 50px;
      height: 80px;
      background: red;
      border-radius: 50px 50px 0 0;
      transform: rotate(-45deg);
      transform-origin: 0 100%;
    }

    .floating-heart:after {
      left: 0;
      transform: rotate(45deg);
      transform-origin: 100% 100%;
    }

    @keyframes float {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
      100% {
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

function stopFloatingHearts() {
  clearInterval(floatingHeartsInterval);

  heartsArray.forEach((heart) => {
    heart.remove();
  });

  heartsArray = [];
}

//BUBBLES
let bubbles = [];
let isBubblesActive = false;

function startBubbles() {
  if (!isBubblesActive) {
    isBubblesActive = true;
    createBubbles(10);
    animateBubbles();
  }
}

function stopBubbles() {
  isBubblesActive = false;
  bubbles.length = 0;
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
}

function createBubbles(numBubbles) {
  for (let i = 0; i < numBubbles; i++) {
    const x = Math.random() * canvas2.width;
    const y = canvas2.height;
    const size = Math.random() * 30 + 20;
    const duration = Math.random() * 3 + 3;

    bubbles.push({
      x: x,
      y: y,
      size: size,
      opacity: Math.random() * 0.5 + 0.5,
      vy: -(Math.random() * 2 + 2),
      duration: duration,
      timeAlive: 0,
    });
  }
}

function animateBubbles() {
  if (!isBubblesActive) return;

  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);

  bubbles.forEach((bubble, index) => {
    bubble.y += bubble.vy;
    bubble.timeAlive += 0.05;
    bubble.opacity = Math.max(0.2, bubble.opacity - 0.01);
    bubble.size = Math.max(10, bubble.size * 0.99);

    ctxx.beginPath();
    ctxx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
    ctxx.fillStyle = `rgba(173, 216, 230, ${bubble.opacity})`;
    ctxx.fill();

    ctxx.beginPath();
    ctxx.ellipse(
      bubble.x,
      bubble.y + bubble.size / 2,
      bubble.size * 0.75,
      10,
      0,
      0,
      Math.PI * 2
    );

    ctxx.fillStyle = `rgba(180, 150, 180, ${bubble.opacity / 3})`; // Soft shadow ??
    ctxx.fill();

    if (
      bubble.timeAlive > bubble.duration ||
      bubble.opacity <= 0.2 ||
      bubble.size <= 10
    ) {
      bubbles.splice(index, 1);
    }
  });

  if (bubbles.length < 5) {
    createBubbles(1);
  }

  requestAnimationFrame(animateBubbles);
}

//SUNS AGAIN
let suns = [];
let isSunsActive = false;

function startSuns() {
  if (!isSunsActive) {
    isSunsActive = true;
    createSuns(10);
    animateSuns();
  }
}

function stopSuns() {
  isSunsActive = false;
  suns.length = 0;
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
}

function createSuns(numSuns) {
  for (let i = 0; i < numSuns; i++) {
    const x = Math.random() * canvas2.width;
    const y = canvas2.height;
    const size = Math.random() * 15 + 20;
    const duration = Math.random() * 6 + 3;

    suns.push({
      x: x,
      y: y,
      size: size,
      opacity: Math.random() * 0.5 + 0.5,
      vy: -(Math.random() * 2 + 2),
      duration: duration,
    });
  }
}

function animateSuns() {
  if (!isSunsActive) return;

  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);

  suns.forEach((sun, index) => {
    sun.y += sun.vy;

    sun.opacity = Math.max(0.2, sun.opacity - 0.01); // fading
    sun.size = Math.max(10, sun.size * 0.99); //shrinking

    ctxx.beginPath();
    ctxx.arc(sun.x, sun.y, sun.size, 0, Math.PI * 2);
    ctxx.fillStyle = `rgba(255, 165, 0, ${sun.opacity})`;
    ctxx.fill();

    if (sun.opacity <= 0.2 || sun.size <= 10) {
      suns.splice(index, 1);
    }
  });
  if (suns.length < 5) {
    createSuns(1);
  }

  requestAnimationFrame(animateSuns);
}

//-------------------------------------------------------------------------------------------------
//-------------------------------FUNCTIONS FOR DISPLAYING THE BENELOVENT ART-------------------------------
//-------------------------------------------------------------------------------------------------

function drawHappyBeneArt() {
  console.log("Drawing happy art in bene mode");
  document.getElementById("happy-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";

  comment.innerHTML = getRandomBeneComment("happy");
  beneArtGenerator("happy");
}

function drawSadBeneArt() {
  console.log("Drawing sad art in bene mode");
  document.getElementById("sad-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";

  comment.innerHTML = getRandomBeneComment("sad");
  beneArtGenerator("sad");
}

function drawAngryBeneArt() {
  console.log("Drawing angry art in bene mode");
  document.getElementById("angry-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";

  comment.innerHTML = getRandomBeneComment("angry");
  beneArtGenerator("angry");
}

//THE ARRAY
let beneArt = {
  happy: [createFloatingHearts],
  sad: [startSuns],
  angry: [startBubbles],
};

function beneArtGenerator(emotion) {
  const art = beneArt[emotion];
  const randomIndex = Math.floor(Math.random() * art.length);
  const selectedArtFunction = art[randomIndex];

  selectedArtFunction();
}

//-------------------------------COMMENTS FOR BENE AND FUNCTION-------------------------------
//-------------------------------COMMENTS FOR BENE AND FUNCTION-------------------------------
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
//----------------------------------------------------------------------
//-------------------------------MISC ART-------------------------------
//----------------------------------------------------------------------

//EFFECTS
function stopRainEffect() {
  isRaining = false;
  raindrops.length = 0;
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
}

function startRainEffect() {
  if (!isRaining) {
    isRaining = true;
    createRaindrops(100);
    animateRain();
  }
}

function createRaindrops(numDrops) {
  for (let i = 0; i < numDrops; i++) {
    raindrops.push({
      x: Math.random() * canvas2.width,
      y: Math.random() * canvas2.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 2,
    });
  }
}

function rainEffect() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);

  if (isRaining) {
    raindrops.forEach((drop) => {
      ctxx.beginPath();
      ctxx.moveTo(drop.x, drop.y);
      ctxx.lineTo(drop.x, drop.y + drop.length);
      ctxx.strokeStyle = "rgba(173, 216, 230, 0.6)";
      ctxx.lineWidth = 2;
      ctxx.stroke();

      drop.y += drop.speed;

      if (drop.y > canvas2.height) {
        drop.y = 0;
        drop.x = Math.random() * canvas2.width;
      }
    });
  }
}

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
const canvas4 = document.getElementById("artCanvas2");
const ctx4 = canvas4.getContext("2d");

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
//-------------------FUNCTIONS FOR DISPLAYING MISC-------------------
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
  video.style.filter = getRandomMiscFilter("sad");
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
  sad: [
    "grayscale(1) brightness(2)",
    "grayscale(1) brightness(0.7)",
    "grayscale(1) brightness(0.5) contrast(1.3)",
  ],
  angry: [
    "contrast(2) saturate(3)",
    "brightness(2) saturate(1.6)",
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

// UPDATE MOOD TEXT
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

//SOME HELP FROM CHAT GPT WITH THE LOGIC

function updateMoodImages(emotion, mode) {
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
