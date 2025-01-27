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

let chanceMiscOrBene = 5;

// Previous emotion states to detect changes
let previousEmotion = null;

let mood = "normal";

let dislikeImg = document.getElementById("dislikeButton");
let likeImg = document.getElementById("likeButton");

let dislikeImgGray = document.getElementById("dislikeButtonGray");
let likeImgGray = document.getElementById("likeButtonGray");

let artistMood;

let freezeEmotionDetection = 0;

function dislikeButton() {
  console.log("hey!");
}
function likeButton() {
  console.log("yes!");
  console.log(artistMood);
  if (artistMood === "benevolent" || artistMood === "mischievous") {
    console.log("we want to add");
    chanceMiscOrBene -= 0.025;
  }
}

//SET MOOD BASED ON RANDOM NUMBER
function changeMoodImg() {
  let randomizedMood = Math.floor(Math.random() * 15);

  video.classList.remove("bw-video");

  if (randomizedMood <= 2) {
    artistMood = "sad";
  } else if (randomizedMood <= 5) {
    artistMood = "angry";
  } else if (randomizedMood <= 8) {
    artistMood = "miscOrBene";
  } else if (randomizedMood === 9) {
    artistMood = "lazy";
    video.classList.add("bw-video");
  } else {
    artistMood = "happy";
  }

  //handle "miscOrBene" mood
  if (artistMood === "miscOrBene") {
    let miscOrBene = Math.floor(Math.random() * 10);
    if (miscOrBene <= chanceMiscOrBene) {
      artistMood = "mischievous";
      //chanceMiscOrBene += 0.025;
    } else {
      artistMood = "benevolent";
      //chanceMiscOrBene -= 0.025;
    }
  }

  

  //calls the artist image for each mood
  artistImage(artistMood);

  //comments for the current mood
  const moodComments = comments[artistMood];
  if (moodComments && moodComments.length > 0) {
    const randomComment =
      moodComments[Math.floor(Math.random() * moodComments.length)];
    artistComment.innerHTML = `<p>${randomComment}</p>`;
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

          if (artistMood === "lazy") {
            return;
          }

          if (resizedDetections.length > 0) {
            const landmarks = resizedDetections[0].landmarks;
            const emotions = resizedDetections[0].expressions;

            // Determine the highest emotion
            const currentEmotion = Object.keys(emotions).reduce((a, b) =>
              emotions[a] > emotions[b] ? a : b
            );
            freezeEmotionDetection += 1;
            console.log(freezeEmotionDetection);
            // Check if the emotion has changed
            if (
              currentEmotion !== previousEmotion //&&
              //freezeEmotionDetection > 30
            ) {
              previousEmotion = currentEmotion;
              //freezeEmotionDetection = 0;

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
                changeMoodImg();
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
                changeMoodImg();
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
                changeMoodImg();
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
            const noseWidth = 70,
              noseHeight = 80;
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

function artistImage(moodImages) {
  let angryImg = document.getElementById("angry-image");
  let sadImg = document.getElementById("sad-image");
  let happyImg = document.getElementById("happy-image");
  let miscImg = document.getElementById("mischievous-image");
  let beneImg = document.getElementById("benevolent-image");
  let lazyImg = document.getElementById("neutral-image");
  angryImg.style.display = "none";
  sadImg.style.display = "none";
  happyImg.style.display = "none";
  miscImg.style.display = "none";
  beneImg.style.display = "none";
  lazyImg.style.display = "none";

  if (moodImages === "angry") {
    console.log("it works!" + moodImages);
    angryImg.style.display = "block";
    likeImg.style.display = "none";
    dislikeImg.style.display = "none";
    likeImgGray.style.display = "block";
    dislikeImgGray.style.display = "block";
  }
  if (moodImages === "sad") {
    console.log("it works!" + moodImages);
    sadImg.style.display = "block";
    likeImg.style.display = "none";
    dislikeImg.style.display = "none";
    likeImgGray.style.display = "block";
    dislikeImgGray.style.display = "block";
  }
  if (moodImages === "happy") {
    console.log("it works!" + moodImages);
    happyImg.style.display = "block";
    likeImg.style.display = "none";
    dislikeImg.style.display = "none";
    likeImgGray.style.display = "block";
    dislikeImgGray.style.display = "block";
  }
  if (moodImages === "mischievous") {
    console.log("it works!" + moodImages);
    miscImg.style.display = "block";
    dislikeImg.style.display = "block";
    likeImg.style.display = "block";
    likeImgGray.style.display = "none";
    dislikeImgGray.style.display = "none";
  }
  if (moodImages === "benevolent") {
    console.log("it works!" + moodImages);
    beneImg.style.display = "block";
    dislikeImg.style.display = "block";
    likeImg.style.display = "block";
    likeImgGray.style.display = "none";
    dislikeImgGray.style.display = "none";
  }
  if (moodImages === "lazy") {
    console.log("it works!" + moodImages);
    lazyImg.style.display = "block";
    likeImg.style.display = "none";
    dislikeImg.style.display = "none";
    likeImgGray.style.display = "block";
    dislikeImgGray.style.display = "block";
  }
}
//
//
//
//
//
//
//
//comments that are randomized for each artist mood
let artistComment = document.getElementById("artist-comment");
const comments = {
  sad: [
    "I'm feeling so down today... I guess I could paint you blue :(",
    "Life is depressing. I'm sorry, I can only paint you blue right now.",
    "Oh, I am not feeling too good. Do you ever feel like crying?",
    "Do you ever feel really down? That's what I'm feeling now:(",
  ],

  angry: [
    "What are you looking at? Here you go with the red pictures, now leave me alone!",
    "Why does everything have to be so frustrating?",
    "AARRGH!!! Here you go stupid, I'll paint you in red >:(",
    "Stop looking at me like that!!! What do you want? Here, have some silly picures.",
  ],

  mischievous: [
    "Look at you! Ridiculous. You look so stupid right now hahah >:)",
    "You want to look cute? Impossible with that face.",
    "Do you like these images? No? Good, I'll add them in more often then!",
    "So you like the pictures? I'll stop using them if you do. I don't want you to be happy haha!",
  ],

  benevolent: [
    "Aww, you look lovely today, let's make you look even cuter! :)",
    "Look how cute! If you like these images, I'll add them in more frequently!",
    "You are truly beautiful❤️ Look at that face!",
    "Wow! You are incredible. I'll try to brigthen your day! If you dont like these images, I'll stop adding them so often.",
  ],

  happy: [
    "Ah look, I can paint you in a lovely yellow shade :D",
    "I'm feeling amazing!",
    "Everything is awesome!",
    "WOOOO! Life is so good right now, don't you agree?",
  ],

  lazy: [
    "Uuuuuuugh I don't know what you expect from me... I'm like reaaaally tired.",
    "Maaaan I just wanna sleep, I don't even have the energy to give you color right now...",
    "ZZZ I cannot be bothered with your wishes, can I be left to chill for like 3 seconds??",
    "Hmmm? Paint your face? I can't even be bothered to add color to you today.",
  ],
};
