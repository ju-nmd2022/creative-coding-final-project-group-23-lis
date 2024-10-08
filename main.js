let video;
let handpose;
let predictions = [];
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let mood = "happy";
let comment = document.getElementById("artist-comment");
let moodTimeout;
let happyFilterArray = [];

function preload() {
    handpose = ml5.handPose(modelLoaded);

    //the artist mood images
    sadArtist = "images/artist-sad.PNG";
    happyArtist = "images/artist-happy.PNG";
    angryArtist = "images/artist-angry.PNG";
    misArtist = "images/artist-mis.PNG";
    benArtist = "images/artist-ben.PNG";
    impatientArtist = "images/artist-impatient.PNG"; 

    //the facial features in the array
    headHeart = "images/head-heart.PNG";
    browsLift = "images/brows-lift.PNG";
    eyesCross = "images/eyes-cross.PNG";
    noseSeptum = "images/nose-septum.PNG";
    lipBite = "images/lip-bite.PNG";
    happyFilterArray = [headHeart, browsLift, eyesCross, noseSeptum, lipBite];
}

function setup() {
    createCanvas(740, 580);
    video = createCapture(VIDEO);
    video.size(740, 580);
    video.hide();
  
    handpose.detectStart(video, getHandsData);
  
    randomizeMood();
}

//function to randomize the artist's mood
function randomizeMood() {
    let randomizedMood = Math.floor(Math.random() * 16); 

    //set mood based on the randomized number
    if (randomizedMood <= 3) {
      console.log("The artist is sad.");
      mood = "sad";
    } else if (randomizedMood <= 7) {
      console.log("The artist is angry.");
      mood = "angry";
    } else if (randomizedMood <= 9) {
      console.log("The artist is feeling mischievous.");
      mood = "mischievous";
    } else if (randomizedMood <= 11) {
      console.log("The artist is feeling benevolent.");
      mood = "benevolent";
    } else {
      console.log("The artist is happy.");
      mood = "happy";
    }
    
    updateMoodImages();

    //changing the mood "impatient" after 20 seconds
    moodTimeout = setTimeout(() => {
        transitionToImpatient();
    }, 20000); 
}

//used the help of chatgpt to get this impatient part to work
function transitionToImpatient() {
    console.log("The artist has become impatient.");
    mood = "impatient";
    updateMoodImages();

    //refresh the mood again after being impatient for 10 secs
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
    document.getElementById("impatient-image").style.display = "none"; // Hide impatient by default

    //update the displayed image and comment based on the current mood
    if (mood === "sad") {
      document.getElementById("sad-image").style.display = "block";
      comment.innerHTML = "Artist is sad.";
    } else if (mood === "angry") {
      document.getElementById("angry-image").style.display = "block";
      comment.innerHTML = "Artist is angry.";
    } else if (mood === "mischievous") {
      document.getElementById("mischievous-image").style.display = "block";
      comment.innerHTML = "Artist is feeling mischievous.";
    } else if (mood === "benevolent") {
      document.getElementById("benevolent-image").style.display = "block";
      comment.innerHTML = "Artist is feeling benevolent.";
    } else if (mood === "happy") {
      document.getElementById("happy-image").style.display = "block";
      comment.innerHTML = "Artist is happy.";
    } else if (mood === "impatient") {
      document.getElementById("impatient-image").style.display = "block";
      comment.innerHTML = "Artist is impatient. If you don't do something interesting soon his mood will change.";
    }
}

function getHandsData(results) {
    predictions = results;
}

function draw() {
    background(255, 255, 255);
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, 740, 580);

    for (let hand of predictions) {
        const keypoints = hand.keypoints;
        for (let keypoint of keypoints) {
            push();
            noStroke();
            fill(0, 255, 0);
            ellipse(keypoint.x, keypoint.y, 10);
            pop();
        }
    }

    filterObject();
    displayFilter();
}



function filterObject() {
  const facialFeatures = {
    positionX: 100,
    positionY: 100,
    filterSize: 20,
  };

  randomFacialFeatures = Math.floor(Math.random() * 3);
}

function displayFilter() {
  for (let feature of happyFilterShowing) {
    image(
      happyFilterArray[randomFacialFeatures],
      feature.positionX,
      feature.positionY,
      feature.filterSize,
    );
  }
}


function modelLoaded() {
    console.log("Model Loaded!");
}
