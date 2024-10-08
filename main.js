let video;
let handpose;
let predictions = [];
let sadArtist, happyArtist, angryArtist, misArtist, benArtist;
let mood = "happy";
let moodImageElement;
let comment = document.getElementById("artist-comment");
let headHeart, browsLift, eyesCross, noseSeptum, lipBite;
let filterArray;



function preload() {
    handpose = ml5.handPose(modelLoaded);

    //the artist mood images
    sadArtist = "images/artist-sad.PNG";
    happyArtist = "images/artist-happy.PNG";
    angryArtist = "images/artist-angry.PNG";
    misArtist = "images/artist-mis.PNG";
    benArtist = "images/artist-ben.PNG";

    //the facial features in the array
    headHeart = "images/head-heart.PNG";
    browsLift = "images/brows-lift.PNG";
    eyesCross = "images/eyes-cross.PNG";
    noseSeptum = "images/noseSeptum.PNG";
    lipBite = "images/lipBite.PNG";
    filterArray = [headHeart, browsLift, eyesCross, noseSeptum, lipBite];
}


function setup() {
    createCanvas(740, 580);
    video = createCapture(VIDEO);
    video.size(740, 580);
    video.hide();
  
    handpose.detectStart(video, getHandsData);
  
    //randomize number for the mood
    let randomizedMood = Math.floor(Math.random() * 8);
    
    //set mood based on randomized number
    if (randomizedMood === 0 || randomizedMood === 1) {
      console.log("The artist is sad.");
      mood = "sad";
    } else if (randomizedMood === 2 || randomizedMood === 3) {
      console.log("The artist is angry.");
      mood = "angry";
    } else if (randomizedMood === 4) {
      console.log("The artist is feeling mischievous.");
      mood = "mischievous";
    } else if (randomizedMood === 5) {
      console.log("The artist is feeling benevolent.");
      mood = "benevolent";
    } else {
      console.log("The artist is happy.");
      mood = "happy";
    }
    
  updateMoodImages();
}
  
  //function to hide or display images and test based on the current mood so the user 
  //is made aware what mood the artist is in
  function updateMoodImages() {
    document.getElementById("sad-image").style.display = "none";
    document.getElementById("angry-image").style.display = "none";
    document.getElementById("mischievous-image").style.display = "none";
    document.getElementById("benevolent-image").style.display = "none";
    document.getElementById("happy-image").style.display = "none";
  
    if (mood === "sad") {
      document.getElementById("sad-image").style.display = "block";
      comment.innerHTML = "Artist is sad."

    } else if (mood === "angry") {
      document.getElementById("angry-image").style.display = "block";
      comment.innerHTML = "Artist is angry."

    } else if (mood === "mischievous") {
      document.getElementById("mischievous-image").style.display = "block";
      comment.innerHTML = "Artist is feeling mischevious."

    } else if (mood === "benevolent") {
      document.getElementById("benevolent-image").style.display = "block";
      comment.innerHTML = "Artist is feeling benevolent."

    } else if (mood === "happy") {
      document.getElementById("happy-image").style.display = "block";
      comment.innerHTML = "Artist is happy."
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
      
      for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        
        push();
        noStroke();
  
        if (i >= 9 && i <= 12) {
          fill(255, 0, 0); 
        } else {
          fill(0, 255, 0);
        }
  
        ellipse(keypoint.x, keypoint.y, 10);
        pop();
      }
    }
  }
  

function modelLoaded() {
    console.log("Model Loaded!");
}
