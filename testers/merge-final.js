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
    randomizeMood();
  }
  const video = document.getElementById("video");
  
  //-------------------------------ARTIST BOT-------------------------------
  let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
  let mood = "happy";
  let comment = document.getElementById("artist-comment");
  let moodTimeout;
  let headFilterArray = [];
  let browsFilterArray = [];
  let eyesFilterArray = [];
  let noseFilterArray = [];
  let lipFilterArray = [];
  let filtersShowing = [];
  
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
  
  //RANDOMIZE ARTISTS MOOD
  function randomizeMood() {
    let randomizedMood = Math.floor(Math.random() * 15);
  
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
  
    updateMoodImages();
  
    //ARTIST GETS IMPATIENT AFTER 20S IF NOTHING TRIGGERS AN EMOTION
    moodTimeout = setTimeout(() => {
      transitionToImpatient();
    }, 20000);
  }
  
  //used the help och ChatGPT to get this impatient part to work
  function transitionToImpatient() {
    mood = "impatient";
    updateMoodImages();
  
    //refresh the mood again after being impatient for 10 seconds
    moodTimeout = setTimeout(() => {
      randomizeMood();
    }, 10000);
  }
  
  //hide or display images and text based on the current mood
  function updateMoodImages() {
    document.getElementById("sad-image").style.display = "none";
    document.getElementById("angry-image").style.display = "none";
    document.getElementById("mischievous-image").style.display = "none";
    document.getElementById("benevolent-image").style.display = "none";
    document.getElementById("happy-image").style.display = "none";
    document.getElementById("impatient-image").style.display = "none";
  
    //update the displayed image and comment based on the current mood
    //images from the array are cleared and then randomized with very mood
    if (mood === "sad") {
      document.getElementById("sad-image").style.display = "block";
      comment.innerHTML = "Oh... I guess I could paint you blue :(";
      filtersShowing = [];
      filterObject();
    } else if (mood === "angry") {
      document.getElementById("angry-image").style.display = "block";
      comment.innerHTML =
        "AARRGH!!! Here you go stupid, I'll paint you in red >:(";
      filtersShowing = [];
      filterObject();
    } else if (mood === "mischievous") {
      document.getElementById("mischievous-image").style.display = "block";
      comment.innerHTML =
        "Look at you! Ridicolous. This is how you look, haha! >:)";
      filtersShowing = [];
      filterObject();
    } else if (mood === "benevolent") {
      document.getElementById("benevolent-image").style.display = "block";
      comment.innerHTML =
        "Aww, you look lovely today, let's make you look even cuter! :)";
      filtersShowing = [];
      filterObject();
    } else if (mood === "happy") {
      document.getElementById("happy-image").style.display = "block";
      comment.innerHTML = "Ah look, I can paint you in a lovely yellow shade :D";
      filtersShowing = [];
      filterObject();
    } else if (mood === "impatient") {
      document.getElementById("impatient-image").style.display = "block";
      comment.innerHTML =
        "I'm a little impatient, and this is boring. If you don't do something interesting soon, my mood will change.";
    }
  }
  /*
  function filterObject() {
    filtersShowing = [];
  
    let randomHead =
      headFilterArray[Math.floor(Math.random() * headFilterArray.length)];
    let randomBrows =
      browsFilterArray[Math.floor(Math.random() * browsFilterArray.length)];
    let randomEyes =
      eyesFilterArray[Math.floor(Math.random() * eyesFilterArray.length)];
    let randomNose =
      noseFilterArray[Math.floor(Math.random() * noseFilterArray.length)];
    let randomLips =
      lipFilterArray[Math.floor(Math.random() * lipFilterArray.length)];
  
    filtersShowing.push(
      randomHead,
      randomBrows,
      randomEyes,
      randomNose,
      randomLips
    );
  }
  */
  //-------------------------------FACE API-------------------------------
  
  //happy eyes
  const eyeNormal = new Image();
  eyeNormal.src = "images/eye-normal.PNG";
  const eyeRound = new Image();
  eyeRound.src = "images/eye-round.PNG";
  const eyeSmile = new Image();
  eyeSmile.src = "images/eye-smile.PNG";
  happyEyesArray = [eyeNormal, eyeRound, eyeSmile];
  
  // Happy images
  const eyeImage = new Image();
  eyeImage.src = "images/eye-round.png"; // Path to your image for the eyes
  const noseImage = new Image();
  noseImage.src = "images/nose-wings.png"; // Path to your image for the nose
  const mouthImage = new Image();
  mouthImage.src = "images/lip-bite.png"; // Path to your image for the mouth
  
  // Sad images
  const sadEyeImage = new Image();
  sadEyeImage.src = "images/eye-shiny.png"; // Path to your sad image for the eyes
  const sadNoseImage = new Image();
  sadNoseImage.src = "images/nose-pig.png"; // Path to your sad image for the nose
  const sadMouthImage = new Image();
  sadMouthImage.src = "images/lip-crooked.png"; // Path to your sad image for the mouth
  
  // Angry images
  const angryEyeImage = new Image();
  angryEyeImage.src = "images/eye-mad.png"; // Path to your angry image for the eyes
  const angryNoseImage = new Image();
  angryNoseImage.src = "images/nose-septum.png"; // Path to your angry image for the nose
  const angryMouthImage = new Image();
  angryMouthImage.src = "images/lip-open.png"; // Path to your angry image for the mouth
  
  video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    const videoContainer = document.getElementById("video-container");
    videoContainer.append(canvas); // Append canvas inside video container
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
  
    const canvasCtx = canvas.getContext("2d");
  
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  
      // Overlay image on top of the eyes
      if (resizedDetections.length > 0) {
        const landmarks = resizedDetections[0].landmarks;
        const emotions = resizedDetections[0].expressions;
        
  
        
      }
    }, 100);
  });
  














/*
  if (mood === "impatient") {
    document.getElementById("impatient-image").style.display = "block";
    comment.innerHTML = "I'm a little impatient, and this is boring. Do something interesting!";
} else {
    // If not impatient, display image based on detected emotion
    switch (emotion) {
        case "happy":
            document.getElementById("happy-image").style.display = "block";
            break;
        case "sad":
            document.getElementById("sad-image").style.display = "block";
            drawSadMouth();
            drawSadEyes();
            drawNose();
            break;
        case "angry":
            document.getElementById("angry-image").style.display = "block";
            drawAngryMouth();
            drawAngryEyes();
            drawNose();
            break;
        case "mischievous":
            document.getElementById("mischievous-image").style.display = "block";
            break;
        default:
            console.log("Emotion not handled:", emotion);
    }
}




//misc function
function drawHappyMiscArt() {
  console.log("Drawing happy art in misc mode");
  document.getElementById("happy-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("happy"); 

}

function drawSadMiscArt() {
  console.log("Drawing sad art in misc mode");
  document.getElementById("sad-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("sad"); 
}

function drawAngryMiscArt() {
  console.log("Drawing angry art in misc mode");
  document.getElementById("mischievous-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("angry");  
}

//bene function
function drawHappyBeneArt() {
  console.log("Drawing happy art in misc mode");
  document.getElementById("happy-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("happy"); 

}

function drawSadBeneArt() {
  console.log("Drawing sad art in misc mode");
  document.getElementById("sad-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("sad"); 
}

function drawAngryBeneArt() {
  console.log("Drawing angry art in misc mode");
  document.getElementById("mischievous-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("angry");  
}



  
  if(emotions.angry > angryThreshold && mood === "mischievous"){
    drawAngryMouth();
    drawAngryEyes();
    drawNose();
    console.log("the mood is mischevious and the user is angry")
  } else if (emotions.happy > happyThreshold && mood === "mischievous") {
    drawHappyMouth();
    drawHappyEyes();
    drawNose();
    ("the mood is mischevious and the user is happy")
  } else if (emotions.sad > sadThreshold && mood === "mischievous") {
    drawSadMouth();
    drawSadEyes();
    drawNose();
    ("the mood is  mischevious and the user is sad")
  } else if (emotions.angry > angryThreshold && mood === "benevolent") {
    drawAngryMouth();
    drawAngryEyes();
    drawNose();
    ("the mood is benevolent and the user is angry")
  } else if (emotions.happy > happyThreshold && mood === "benevolent") {
    drawHappyMouth();
    drawHappyEyes();
    drawNose();
    ("the mood is benevolent and the user is happy")
  } else if (emotions.sad > sadThreshold && mood === "benevolent") {
    drawSadMouth();
    drawSadEyes();
    drawNose();
    ("the mood is benevolent and the user is sad")
  } else {
    console.log("The mood is not mischievous or benevolent")
  };
  */