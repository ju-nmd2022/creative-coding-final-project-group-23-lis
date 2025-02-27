// Reference List
// Face API: https://github.com/justadudewhohacks/face-api.js Retrieved: September 2024
// Face API Tutorial: https://github.com/vladmandic/face-api/blob/master/TUTORIAL.md#getting-started-displaying-detection-results Retrieved: September 2024
// Store API: https://stackoverflow.com/questions/74874158/how-to-store-detected-emotion-value-of-the-faceapi-into-a-variable Retrieved: October 2024
// Blue box removed: https://github.com/justadudewhohacks/face-api.js/issues/913 Retrieved: October 2024
// Landmarks color removed: https://stackoverflow.com/questions/78793165/change-face-api-js-landmarks-pointcolor Retrieved: October 2024
// Object array: https://stackoverflow.com/questions/54878770/best-way-to-add-images-to-arrays-of-objects Retrieved: 30/1-25
// Objects and properties in arrays: https://chatgpt.com/share/679c9044-bd2c-8011-ab39-3a3429f8142a Retrieved: 30/1-25
// Findindex(): https://www.w3schools.com/jsref/jsref_find.asp Retrieved: 31/1-25
// Button onclick for thumbs up-/down: https://www.geeksforgeeks.org/javascript-onclick-event/ Retrieved: 1/2-25
// SetInterval for the lazy mood: https://www.w3schools.com/JSREF/met_win_settimeout.asp
// Lazy mood clear canvas fix: https://chatgpt.com/c/67a7c86b-4f50-800a-b7f4-8488e342e225
// Correction of the paths for GitHub Pages: https://stackoverflow.com/questions/16316311/github-pages-and-relative-paths Retrieved: 8/2-25
// Worked in collaboration with Thomas Halvarsson from 20/1-25 to 8/2-25

// Neutral image and comment is shown when the user enters the page
window.onload = function () {
  artistMood = "neutral";
  displayArtistImage(artistMood);
  displayArtistComment(artistMood);
};

function displayArtistImage(mood) {
  let neutralImg = document.getElementById("neutral-image");
  neutralImg.style.display = "block";

  let allImages = document.querySelectorAll(".artist-image");
  allImages.forEach((image) => {
    if (image.id !== "neutral-image") {
      image.style.display = "none";
    }
  });
}

function displayArtistComment(mood) {
  const moodComments = comments[mood];
  if (moodComments && moodComments.length > 0) {
    const randomComment =
      moodComments[Math.floor(Math.random() * moodComments.length)];
    artistComment.innerHTML = `<p>${randomComment}</p>`;
  }
}

// Arrays holding the images for different emotions
let noseArray = [
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/nose-septum.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/nose-round.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/nose-fat.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/nose-wings.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/nose-pig.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/nose-regular.PNG",
    weight: 15,
  },
];

let angryEyeArray = [
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-zombie.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-mad.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-close.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-pissed.PNG",
    weight: 15,
  },
];

let angryMouthArray = [
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-wide.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-crooked.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-open.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-grr.PNG",
    weight: 15,
  },
];

let happyEyeArray = [
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-normal.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-round.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-smile.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-hope.PNG",
    weight: 15,
  },
];

let happyMouthArray = [
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-kiss.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-tounge.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-gap.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-L.PNG",
    weight: 15,
  },
];

let sadEyeArray = [
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-drip.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-shiny.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-cry.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-wet.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/eye-tear.PNG",
    weight: 15,
  },
];

let sadMouthArray = [
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-bite.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-frown.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-sad.PNG",
    weight: 15,
  },
  {
    image:
      "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/images/lip-scream.PNG",
    weight: 15,
  },
];

// 1 = used, 0 = not used
let lastUsedImages = [
  { faceArray: "noseArray", used: 0 },
  { faceArray: "angryEyeArray", used: 0 },
  { faceArray: "angryMouthArray", used: 0 },
  { faceArray: "happyEyeArray", used: 0 },
  { faceArray: "happyMouthArray", used: 0 },
  { faceArray: "sadEyeArray", used: 0 },
  { faceArray: "sadMouthArray", used: 0 },
];

// Variables to hold the selected images for each part (to prevent re-randomization)
let selectedAngryEyeImage = null;
let selectedNoseImage = null; // Common nose image for all emotions
let selectedAngryMouthImage = null;
let selectedHappyEyeImage = null;
let selectedHappyMouthImage = null;
let selectedSadEyeImage = null;
let selectedSadMouthImage = null;

let arrayNameEyeGlobal;
let arrayNameMouthGlobal;

let randomIndexGlobal;

// Previous emotion states to detect changes
let previousEmotion = null;

let dislikeImg = document.getElementById("dislikeButton");
let likeImg = document.getElementById("likeButton");

let dislikeImgGray = document.getElementById("dislikeButtonGray");
let likeImgGray = document.getElementById("likeButtonGray");

let artistMood = "neutral";

let mood = "neutral";

let freezeEmotionDetection = 0;

let video = document.getElementById("video");
const ctx = document.getElementById("artCanvas").getContext("2d");

artCanvas.width = video.videoWidth;
artCanvas.height = video.videoHeight;

//------------------------------------------------------------------------------
//----------------------------Dislike function----------------------------------
//------------------------------------------------------------------------------
function dislikeButton() {
  if (artistMood !== "benevolent") {
    // To change the probability for all noses when clicking the like button:
    noseArray[lastUsedImages[0]?.used].weight += 1;

    // To change the probability for all eyes when clicking the like button:
    arrayNameEyeGlobal[lastUsedImages[randomIndexGlobal]?.used].weight += 1;

    // To change the probability for all mouths when clicking the like button:
    arrayNameMouthGlobal[lastUsedImages[randomIndexGlobal]?.used].weight += 1;
  } else
    [
      // To change the probability for all noses when clicking the like button:
      (noseArray[lastUsedImages[0]?.used].weight -= 1),
      // To change the probability for all eyes when clicking the like button:
      (arrayNameEyeGlobal[lastUsedImages[randomIndexGlobal]?.used].weight -= 1),
      // To change the probability for all mouths when clicking the like button:
      (arrayNameMouthGlobal[
        lastUsedImages[randomIndexGlobal]?.used
      ].weight -= 1),
    ];
  // Reset the array when it reaches 0
  if (arrayNameEyeGlobal[lastUsedImages[randomIndexGlobal]?.used].weight <= 0) {
    arrayNameEyeGlobal[lastUsedImages[randomIndexGlobal]?.used].weight = 15;
  }
}

//------------------------------------------------------------------------------
//-------------------------------Like function----------------------------------
//------------------------------------------------------------------------------
function likeButton() {
  console.log(
    "liked: ",
    arrayNameMouthGlobal[lastUsedImages[randomIndexGlobal]?.used].weight
  );
  if (artistMood !== "mischievous") {
    // To change the probability for all noses when clicking the like button:
    noseArray[lastUsedImages[0]?.used].weight += 1;

    // To change the probability for all eyes when clicking the like button:
    arrayNameEyeGlobal[lastUsedImages[randomIndexGlobal]?.used].weight += 1;

    // To change the probability for all mouths when clicking the like button:
    arrayNameMouthGlobal[lastUsedImages[randomIndexGlobal]?.used].weight += 1;
  } else
    [
      // To change the probability for all noses when clicking the like button:
      (noseArray[lastUsedImages[0]?.used].weight -= 1),
      // To change the probability for all eyes when clicking the like button:
      (arrayNameEyeGlobal[lastUsedImages[randomIndexGlobal]?.used].weight -= 1),
      // To change the probability for all mouths when clicking the like button:
      (arrayNameMouthGlobal[
        lastUsedImages[randomIndexGlobal]?.used
      ].weight -= 1),
    ];
  // Reset the array when it reaches 0
  if (arrayNameEyeGlobal[lastUsedImages[randomIndexGlobal]?.used].weight <= 0) {
    arrayNameEyeGlobal[lastUsedImages[randomIndexGlobal]?.used].weight = 15;
  }
}
//------------------------------------------------------------------------------
//--------------------------Set the mood for Artist-----------------------------
//------------------------------------------------------------------------------
function setArtistMood(currentEmotion) {
  if (currentEmotion === "neutral" || currentEmotion === "surprised") {
    artistMood = "neutral";
    return;
  }
  const randomNum = Math.floor(Math.random() * 15);
  if (randomNum <= 7) {
    artistMood = currentEmotion;
  } else if (randomNum >= 8 && randomNum <= 10) {
    artistMood = "mischievous";
  } else if (randomNum >= 11 && randomNum <= 13) {
    artistMood = "benevolent";
  } else {
    artistMood = "lazy";
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
    video.classList.add("bw-video");

    //had to add this because the comments for lazy didnt work
    const lazyComment =
      comments.lazy[Math.floor(Math.random() * comments.lazy.length)];
    artistComment.innerText = lazyComment;
    console.log("Lazy comment:", lazyComment);

    //reset mood after 7 seconds so it starts to draw again and the user is not stuck in lazy
    setTimeout(() => {
      artistMood = "neutral";
      console.log("Lazy mode ended, resuming painting.");
      video.classList.remove("bw-video");
    }, 7000);
    return;
  }

  if (
    artistMood === undefined ||
    (artistMood === currentEmotion && !currentEmotion)
  ) {
    artistMood = "neutral";
  }
}

//------------------------------------------------------------------------------
//---------------------Change comments + image for Artist-----------------------
//------------------------------------------------------------------------------
function changeMoodImg() {
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

//------------------------------------------------------------------------------
//----------------------------Random image for user-----------------------------
//------------------------------------------------------------------------------

// Function to load random images from an array and ensure they are loaded before use
function getRandomImage(imageArray, arrayName) {
  const weightedObjects = [];
  console.log("objects: ", weightedObjects);

  function getRandomObjectWeighted() {
    imageArray.forEach((object) => {
      for (let i = 0; i < object.weight; i++) {
        weightedObjects.push(object);
      }
    });
    const randomIndex2 = Math.floor(Math.random() * weightedObjects.length);
    const randomObject = weightedObjects[randomIndex2];

    // Find the index of the chosen object in the original array
    const originalIndex = imageArray.findIndex(
      (object) => object.image === randomObject.image
    );

    return { randomObject, originalIndex };
  }

  const { randomObject, originalIndex } = getRandomObjectWeighted();
  console.log(
    `Chosen Object: ${randomObject.image}, Weight: ${randomObject.weight}, Original Index: ${originalIndex}`
  );
  const randomIndex = originalIndex;
  randomIndexGlobal = randomIndex;

  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageArray[randomIndex].image;
    img.onload = () => resolve(img); // Resolve the promise once the image is loaded
  });
}

// Load the Face API models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(
    "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/models/tiny_face_detector_model/"
  ),
  faceapi.nets.faceLandmark68Net.loadFromUri(
    "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/models/face_landmark_68_model/"
  ),
  faceapi.nets.faceExpressionNet.loadFromUri(
    "https://ju-nmd2022.github.io/creative-coding-final-project-group-23-lis/models/face_expression_model/"
  ),
]).then(startVideo);

//------------------------------------------------------------------------------
//--------------------The app and all functions called--------------------------
//------------------------------------------------------------------------------
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
          //if mood is lazy, stop drawing images on face 7 secs
          if (artistMood === "lazy") {
            return;
          }

          const artCanvas = document.getElementById("artCanvas");
          const artCtx = artCanvas.getContext("2d");
          artCtx.clearRect(0, 0, artCanvas.width, artCanvas.height);

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

            if (currentEmotion !== previousEmotion) {
              freezeEmotionDetection += 1;
            }

            // Check if the emotion has changed
            if (
              (currentEmotion !== previousEmotion &&
                freezeEmotionDetection > 5) || // Change the length of the visible emotions here! <-------------------------------
              (currentEmotion !== previousEmotion &&
                currentEmotion === "normal")
            ) {
              previousEmotion = currentEmotion;
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              freezeEmotionDetection = 0;

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
                console.log("Here it is! " + noseArray[0].weight);
                arrayNameEyeGlobal = angryEyeArray;
                arrayNameMouthGlobal = angryMouthArray;
                setArtistMood(currentEmotion);
                changeMoodImg();
                [
                  selectedAngryEyeImage,
                  selectedNoseImage,
                  selectedAngryMouthImage,
                ] = await Promise.all([
                  getRandomImage(angryEyeArray, "angryEyeArray"),
                  getRandomImage(noseArray, "noseArray"),
                  getRandomImage(angryMouthArray, "angryMouthArray"),
                ]);
              } else if (currentEmotion === "happy" && emotions.happy > 0.5) {
                arrayNameEyeGlobal = happyEyeArray;
                arrayNameMouthGlobal = happyMouthArray;
                setArtistMood(currentEmotion);
                changeMoodImg();
                [
                  selectedHappyEyeImage,
                  selectedNoseImage,
                  selectedHappyMouthImage,
                ] = await Promise.all([
                  getRandomImage(happyEyeArray, "happyEyeArray"),
                  getRandomImage(noseArray, "noseArray"),
                  getRandomImage(happyMouthArray, "happyMouthArray"),
                ]);
              } else if (currentEmotion === "sad" && emotions.sad > 0.5) {
                arrayNameEyeGlobal = sadEyeArray;
                arrayNameMouthGlobal = sadMouthArray;
                setArtistMood(currentEmotion);
                changeMoodImg();
                [
                  selectedSadEyeImage,
                  selectedNoseImage,
                  selectedSadMouthImage,
                ] = await Promise.all([
                  getRandomImage(sadEyeArray, "sadEyeArray"),
                  getRandomImage(noseArray, "noseArray"),
                  getRandomImage(sadMouthArray, "sadMouthArray"),
                ]);
              } else if (
                currentEmotion === "neutral" &&
                emotions.neutral > 0.5
              ) {
                setArtistMood(currentEmotion);
                changeMoodImg();
              }
            }

            // Draw images based on current emotion
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            const nose = landmarks.getNose();
            const mouth = landmarks.getMouth();

            //calculate distance between eyes
            const eyeDistance = Math.hypot(
              rightEye[0].x - leftEye[0].x,
              rightEye[0].y - leftEye[0].y
            );

            //factor to multiply by to scale up or down
            const scaleFactor = eyeDistance / 100;

            //use these values to resize the drawn images on the canvas
            const eyeWidth = 70 * scaleFactor;
            const eyeHeight = 60 * scaleFactor;
            const noseWidth = 70 * scaleFactor;
            const noseHeight = 80 * scaleFactor;
            const mouthWidth = 90 * scaleFactor;
            const mouthHeight = 70 * scaleFactor;

            drawFaceElements(
              leftEye,
              rightEye,
              eyeWidth,
              eyeHeight,
              noseWidth,
              noseHeight,
              mouthWidth,
              mouthHeight
            );

            const canvasCtx = canvas.getContext("2d");

            if (selectedAngryEyeImage) {
              canvasCtx.drawImage(
                selectedAngryEyeImage,
                leftEye[3].x - eyeWidth / 2 - 20,
                leftEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedAngryEyeImage,
                rightEye[3].x - eyeWidth / 2 - 20,
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
                mouth[0].x - mouthWidth / 2 + 40,
                mouth[3].y - mouthHeight / 2 + 20,
                mouthWidth,
                mouthHeight
              );
            } else if (selectedHappyEyeImage) {
              canvasCtx.drawImage(
                selectedHappyEyeImage,
                leftEye[3].x - eyeWidth / 2 - 20,
                leftEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedHappyEyeImage,
                rightEye[3].x - eyeWidth / 2 - 20,
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
                mouth[0].x - mouthWidth / 2 + 50,
                mouth[3].y - mouthHeight / 2 + 25,
                mouthWidth,
                mouthHeight
              );
            } else if (selectedSadEyeImage) {
              canvasCtx.drawImage(
                selectedSadEyeImage,
                leftEye[3].x - eyeWidth / 2 - 20,
                leftEye[3].y - eyeHeight / 2,
                eyeWidth,
                eyeHeight
              );
              canvasCtx.drawImage(
                selectedSadEyeImage,
                rightEye[3].x - eyeWidth / 2 - 20,
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

function drawFaceElements(
  leftEye,
  rightEye,
  eyeWidth,
  eyeHeight,
  noseWidth,
  noseHeight,
  mouthWidth,
  mouthHeight
) {
  // Use the selected images based on the current emotion
  if (selectedAngryEyeImage) {
    ctx.drawImage(
      selectedAngryEyeImage,
      leftEye[0].x - eyeWidth / 2,
      leftEye[0].y - eyeHeight / 2,
      eyeWidth,
      eyeHeight
    );
    ctx.drawImage(
      selectedAngryEyeImage,
      rightEye[0].x - eyeWidth / 2,
      rightEye[0].y - eyeHeight / 2,
      eyeWidth,
      eyeHeight
    );
    ctx.drawImage(
      selectedNoseImage,
      (leftEye[0].x + rightEye[0].x) / 2 - noseWidth / 2,
      leftEye[0].y + 20 - noseHeight / 2,
      noseWidth,
      noseHeight
    );
    ctx.drawImage(
      selectedAngryMouthImage,
      (leftEye[0].x + rightEye[0].x) / 2 - mouthWidth / 2,
      leftEye[0].y + 50 - mouthHeight / 2,
      mouthWidth,
      mouthHeight
    );
  } else if (selectedHappyEyeImage) {
    ctx.drawImage(
      selectedHappyEyeImage,
      leftEye[0].x - eyeWidth / 2,
      leftEye[0].y - eyeHeight / 2,
      eyeWidth,
      eyeHeight
    );
    ctx.drawImage(
      selectedHappyEyeImage,
      rightEye[0].x - eyeWidth / 2,
      rightEye[0].y - eyeHeight / 2,
      eyeWidth,
      eyeHeight
    );
    ctx.drawImage(
      selectedNoseImage,
      (leftEye[0].x + rightEye[0].x) / 2 - noseWidth / 2,
      leftEye[0].y + 20 - noseHeight / 2,
      noseWidth,
      noseHeight
    );
    ctx.drawImage(
      selectedHappyMouthImage,
      (leftEye[0].x + rightEye[0].x) / 2 - mouthWidth / 2,
      leftEye[0].y + 50 - mouthHeight / 2,
      mouthWidth,
      mouthHeight
    );
  } else if (selectedSadEyeImage) {
    ctx.drawImage(
      selectedSadEyeImage,
      leftEye[0].x - eyeWidth / 2,
      leftEye[0].y - eyeHeight / 2,
      eyeWidth,
      eyeHeight
    );
    ctx.drawImage(
      selectedSadEyeImage,
      rightEye[0].x - eyeWidth / 2,
      rightEye[0].y - eyeHeight / 2,
      eyeWidth,
      eyeHeight
    );
    ctx.drawImage(
      selectedNoseImage,
      (leftEye[0].x + rightEye[0].x) / 2 - noseWidth / 2,
      leftEye[0].y + 20 - noseHeight / 2,
      noseWidth,
      noseHeight
    );
    ctx.drawImage(
      selectedSadMouthImage,
      (leftEye[0].x + rightEye[0].x) / 2 - mouthWidth / 2,
      leftEye[0].y + 50 - mouthHeight / 2,
      mouthWidth,
      mouthHeight
    );
  }
}

function artistImage(moodImages) {
  let angryImg = document.getElementById("angry-image");
  let sadImg = document.getElementById("sad-image");
  let happyImg = document.getElementById("happy-image");
  let miscImg = document.getElementById("mischievous-image");
  let beneImg = document.getElementById("benevolent-image");
  let lazyImg = document.getElementById("lazy-image");
  let neutralImg = document.getElementById("neutral-image");
  angryImg.style.display = "none";
  sadImg.style.display = "none";
  happyImg.style.display = "none";
  miscImg.style.display = "none";
  beneImg.style.display = "none";
  lazyImg.style.display = "none";
  neutralImg.style.display = "none";

  if (moodImages === "angry") {
    angryImg.style.display = "block";
    likeImg.style.display = "none";
    dislikeImg.style.display = "none";
    likeImgGray.style.display = "block";
    dislikeImgGray.style.display = "block";
    neutralImg.style.display = "none";
  }
  if (moodImages === "sad") {
    sadImg.style.display = "block";
    likeImg.style.display = "none";
    dislikeImg.style.display = "none";
    likeImgGray.style.display = "block";
    dislikeImgGray.style.display = "block";
    neutralImg.style.display = "none";
  }
  if (moodImages === "happy") {
    happyImg.style.display = "block";
    likeImg.style.display = "none";
    dislikeImg.style.display = "none";
    likeImgGray.style.display = "block";
    dislikeImgGray.style.display = "block";
    neutralImg.style.display = "none";
  }
  if (moodImages === "mischievous") {
    miscImg.style.display = "block";
    dislikeImg.style.display = "block";
    likeImg.style.display = "block";
    likeImgGray.style.display = "none";
    dislikeImgGray.style.display = "none";
    neutralImg.style.display = "none";
  }
  if (moodImages === "benevolent") {
    beneImg.style.display = "block";
    dislikeImg.style.display = "block";
    likeImg.style.display = "block";
    likeImgGray.style.display = "none";
    dislikeImgGray.style.display = "none";
    neutralImg.style.display = "none";
  }
  if (moodImages === "lazy") {
    lazyImg.style.display = "block";
    likeImg.style.display = "none";
    dislikeImg.style.display = "none";
    likeImgGray.style.display = "block";
    dislikeImgGray.style.display = "block";
    neutralImg.style.display = "none";

    const canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    selectedAngryEyeImage = null;
    selectedNoseImage = null;
    selectedAngryMouthImage = null;
    selectedHappyEyeImage = null;
    selectedHappyMouthImage = null;
    selectedSadEyeImage = null;
    selectedSadMouthImage = null;
    return;
  }
  if (moodImages === "neutral") {
    lazyImg.style.display = "none";
    likeImg.style.display = "none";
    dislikeImg.style.display = "none";
    likeImgGray.style.display = "block";
    dislikeImgGray.style.display = "block";
    neutralImg.style.display = "block";
  }
}

//comments that are randomized for each artist mood
let artistComment = document.getElementById("artist-comment");
const comments = {
  sad: [
    "I'm feeling so down today... I guess I could paint you blue :( I'm sorry but you cannot use the buttons below right now. Maybe when I'm in a different mood...",
    "Life is depressing. I'm sorry, I can only paint you blue right now. I'm sorry but you cannot use the buttons below right now. Maybe when I'm in a different mood...",
    "Oh, I am not feeling too good. Do you ever feel like crying? I'm sorry but you cannot use the buttons below right now. Maybe when I'm in a different mood...",
    "Do you ever feel really down? That's what I'm feeling now:( I'm sorry but you cannot use the buttons below right now. Maybe when I'm in a different mood...",
  ],

  angry: [
    "What are you looking at? Here you go with the red pictures, now leave me alone! You cannot use the buttons below right now. Maybe when I'm in a different mood...",
    "Why does everything have to be so frustrating? You cannot use the buttons below right now. Maybe when I'm in a different mood...",
    "AARRGH!!! Here you go stupid, I'll paint you in red >:( You cannot use the buttons below right now. Maybe when I'm in a different mood...",
    "Stop looking at me like that!!! What do you want? Here, have some silly picures. You cannot use the buttons below right now. Maybe when I'm in a different mood...",
  ],

  mischievous: [
    "Look at you! Ridiculous. You look so stupid right now hahah >:) Use the buttons below to tell me if you like them or not.",
    "You want to look cute? Impossible with that face. Use the buttons below to tell me if you like them or not.",
    "Do you like these images? No? Good, I'll add them in more often then! Use the buttons below to tell me if you like them or not.",
    "So you like the pictures? I'll stop using them if you do. I don't want you to be happy haha! Use the buttons below to tell me if you like them or not.",
  ],

  benevolent: [
    "Aww, you look lovely today, let's make you look even cuter! :) Use the buttons below to tell me if you like them or not!",
    "Look how cute! If you like these images, I'll add them in more frequently! Use the buttons below to tell me if you like them or not!",
    "You are truly beautiful Look at that face! Use the buttons below to tell me if you like them or not!",
    "Wow! You are incredible. I'll try to brigthen your day! If you dont like these images, I'll stop adding them so often. Use the buttons below to tell me if you like them or not!",
  ],

  happy: [
    "Ah look, I can paint you in a lovely yellow shade :D I'm sorry but you cannot use the buttons below right now. Maybe when I'm in a different mood!",
    "I'm feeling amazing! I'm sorry but you cannot use the buttons below right now. Maybe when I'm in a different mood!",
    "Everything is awesome! I'm sorry but you cannot use the buttons below right now. Maybe when I'm in a different mood!",
    "WOOOO! Life is so good right now, don't you agree? I'm sorry but you cannot use the buttons below right now. Maybe when I'm in a different mood!",
  ],

  lazy: [
    "Uuuuuuugh I don't know what you expect from me... I'm like reaaaally tired. Annnd you cannot use the buttons below right now. Maybe when I'm in a different mood!",
    "Maaaan I just wanna sleep, I don't even have the energy to give you color right now... Annnd you cannot use the buttons below right now. Maybe when I'm in a different mood!",
    "ZZZ I cannot be bothered with your wishes, can I be left to chill for like 3 seconds?? Annnd you cannot use the buttons below right now. Maybe when I'm in a different mood!",
    "Hmmm? Paint your face? I can't even be bothered to add color to you today. Annnd you cannot use the buttons below right now. Maybe when I'm in a different mood!",
  ],
  neutral: ["Move your face so I can paint!"],
};
