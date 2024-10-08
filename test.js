let video;
let featureExtractor;
let classifier;
let happyButton;
let sadButton;
let angryButton;
let saveButton;
let trainButton;
let predictions = [];
let videoReadyFlag = false; // Flag to check if the video is ready
let exampleCount = 0; // Count the number of examples added

function setup() {
  createCanvas(innerWidth, innerHeight);

  // Load the MobileNet feature extractor model
  featureExtractor = ml5.featureExtractor("MobileNet", modelLoaded);

  // Set up the video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Ensure video is ready before adding images to the classifier
  video.elt.addEventListener("loadeddata", () => {
    // Create the classifier using the video element
    classifier = featureExtractor.classification(video.elt, videoReady);
  });
  neutralButton = createButton("Neutral");
  neutralButton.mousePressed(() => {
    if (videoReadyFlag) {
      classifier.addImage("neutral");
      exampleCount++;
    } else {
      console.log("Video is not ready yet!");
    }
  });

  // Disable buttons initially until the video is ready
  happyButton = createButton("Happy");
  happyButton.mousePressed(() => {
    if (videoReadyFlag) {
      classifier.addImage("happy");
      exampleCount++;
    } else {
      console.log("Video is not ready yet!");
    }
  });

  sadButton = createButton("Sad");
  sadButton.mousePressed(() => {
    if (videoReadyFlag) {
      classifier.addImage("sad");
      exampleCount++;
    } else {
      console.log("Video is not ready yet!");
    }
  });

  angryButton = createButton("Angry");
  angryButton.mousePressed(() => {
    if (videoReadyFlag) {
      classifier.addImage("angry");
      exampleCount++;
    } else {
      console.log("Video is not ready yet!");
    }
  });

  // Train button
  trainButton = createButton("🚂");
  trainButton.mousePressed(() => {
    if (exampleCount > 0) {
      classifier.train(trainProgress);
    } else {
      console.log("Add some examples before training!");
    }
  });

  // Save model button
  saveButton = createButton("💾");
  saveButton.mousePressed(() => {
    if (videoReadyFlag) {
      featureExtractor.save();
    } else {
      console.log("Video is not ready yet!");
    }
  });
}

// Callback when the model is loaded
function modelLoaded() {
  console.log("Model Loaded!");
}

// Callback when the video is ready
function videoReady() {
  console.log("Video ready!");
  videoReadyFlag = true; // Set the flag when video is ready
}

// Function to track the training progress
function trainProgress(loss) {
  if (loss === null) {
    console.log("Training finished");
    classifier.classify(gotResults); // Start classification after training
  } else {
    console.log(loss);
  }
}

// Handle the results after classification
function gotResults(error, results) {
  if (error) {
    console.log(error);
  } else {
    console.log(results);
    predictions = results;
    classifier.classify(gotResults); // Continue classifying in a loop
  }
}

// Draw the video feed and display the predicted label
function draw() {
  background(255, 255, 255);

  // Apply horizontal flip
  push(); // Start a new drawing state
  translate(video.width, 0); // Move the origin to the right edge of the video
  scale(-1, 1); // Flip the x-axis to mirror the video
  image(video, 0, 0, 640, 480); // Draw the video flipped
  pop(); // Restore original drawing state

  // Default label
  let label = "No Emotion Detected";

  // Update the label based on prediction confidence
  for (let prediction of predictions) {
    if (prediction.confidence > 0.6) {
      label = prediction.label;
    }
  }

  // Display the label on the screen
  push();
  noStroke();
  fill(255, 255, 255);
  textSize(30);
  text(label, 100, 100);
  pop();
}
