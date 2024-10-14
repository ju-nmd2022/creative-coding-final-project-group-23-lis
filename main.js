let video;
let handpose;
let predictions = [];
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let mood = "happy";
let comment = document.getElementById("artist-comment");
let moodTimeout;
let happyFilterArray = [];
let happyFilterShowing = []; 

function preload() {
  handpose = ml5.handPose(modelLoaded);

  //the artist mood images
  sadArtist = loadImage("images/artist-sad.PNG", () => console.log("Sad image loaded."), () => console.error("Failed to load sad image."));
  happyArtist = loadImage("images/artist-happy.PNG", () => console.log("Happy image loaded."), () => console.error("Failed to load happy image."));
  angryArtist = loadImage("images/artist-angry.PNG", () => console.log("Angry image loaded."), () => console.error("Failed to load angry image."));
  misArtist = loadImage("images/artist-mis.PNG", () => console.log("Mischievous image loaded."), () => console.error("Failed to load mischievous image."));
  benArtist = loadImage("images/artist-ben.PNG", () => console.log("Benevolent image loaded."), () => console.error("Failed to load benevolent image."));
  impatientArtist = loadImage("images/artist-impatient.PNG", () => console.log("Impatient image loaded."), () => console.error("Failed to load impatient image."));

  //the facial features in the array
  headHeart = loadImage("images/head-heart.PNG");
  browsLift = loadImage("images/brows-lift.PNG");
  eyesCross = loadImage("images/eyes-cross.PNG");
  noseSeptum = loadImage("images/nose-septum.PNG");
  lipBite = loadImage("images/lip-bite.PNG");
  happyFilterArray = [headHeart, browsLift, eyesCross, noseSeptum, lipBite];
}

function setup() {
  createCanvas(740, 580);
  video = createCapture(VIDEO);
  video.size(740, 580);
  video.hide();

  handpose.detectStart(video, getHandsData);

  randomizeMood();
  colorMode(HSB);
}

//function to randomize the artist's mood
function randomizeMood() {
    let randomizedMood = Math.floor(Math.random() * 15); 

  //set mood based on the randomized number
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

    
    //changing the mood to "impatient" after 20 seconds
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
        happyFilterShowing = []; 
        filterObject();
    } else if (mood === "angry") {
        document.getElementById("angry-image").style.display = "block";
        comment.innerHTML = "AARRGH!!! Here you go stupid, I'll paint you in red >:(";
        happyFilterShowing = []; 
        filterObject();
    } else if (mood === "mischievous") {
        document.getElementById("mischievous-image").style.display = "block";
        comment.innerHTML = "Look at you! Ridicolous. This is how you look, haha! >:)";
        happyFilterShowing = []; 
        filterObject();
    } else if (mood === "benevolent") {
        document.getElementById("benevolent-image").style.display = "block";
        comment.innerHTML = "Aww, you look lovely today, let's make you look even cuter! :)";
        happyFilterShowing = []; 
        filterObject();
    } else if (mood === "happy") {
        document.getElementById("happy-image").style.display = "block";
        comment.innerHTML = "Ah look, I can paint you in a lovely yellow shade :D";
        happyFilterShowing = []; 
        filterObject();
    } else if (mood === "impatient") {
        document.getElementById("impatient-image").style.display = "block";
        comment.innerHTML = "I'm a little impatient, and this is boring. If you don't do something interesting soon, my mood will change.";
    }
}

let moodColor = [60, 100, 100];

//changes the color of the facial features based on the mood in HSB
//the mood is a variable because we dont want the color to change with the impatient mood
function applyMoodColorFilter() {
    if (mood === "sad") {
        moodColor = [240, 100, 67];
        tint(...moodColor);
    } else if (mood === "angry") {
        moodColor = [0, 100, 100];
        tint(...moodColor);
    } else if (mood === "mischievous") {
        moodColor = [266, 100, 50];
        tint(...moodColor);
    } else if (mood === "benevolent") {
        moodColor = [327, 100, 100]; 
        tint(...moodColor);
    } else if (mood === "happy") {
        moodColor = [50, 100, 100];
        tint(...moodColor);
    } else if (mood === "impatient") {
        tint(...moodColor);
    }
}



function getHandsData(results) {
    predictions = results;
}

function draw() {
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
  displayFilter();
}

//used help from ChatGPT to get this part to work: begins here
function filterObject() {
    happyFilterShowing = []; 
    let numberOfFilters = Math.floor(Math.random() * (happyFilterArray.length + 1)); 

    for (let i = 0; i < numberOfFilters; i++) {
        happyFilterShowing.push(happyFilterArray[Math.floor(Math.random() * happyFilterArray.length)]);
    }
}

//display random facial features from the array
function displayFilter() {
    for (let feature of happyFilterShowing) {
        applyMoodColorFilter();
        image(feature, 300, 200, 200, 100); 
    }
    noTint();
}
//ChatGPT help: ends here

function modelLoaded() {
    console.log("Model Loaded!");
}
