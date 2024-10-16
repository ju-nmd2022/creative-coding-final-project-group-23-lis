window.addEventListener("load", () => {
  const video = document.getElementById("video");

  // Load the models after the window is fully loaded
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"), // Load landmark model
  ]).then(startVideo);

  function startVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => (video.srcObject = stream))
      .catch((err) => console.error("Error accessing the camera: ", err));
  }

  faceapi.draw.drawDetections(canvasDraw, box);
  // Happy images
  const eyeImage = new Image();
  eyeImage.src = "images/eyes-cute.png"; // Path to your image for the eyes
  const noseImage = new Image();
  noseImage.src = "images/nose-wings.png"; // Path to your image for the nose
  const mouthImage = new Image();
  mouthImage.src = "images/lip-bite.png"; // Path to your image for the mouth

  // Sad images
  const sadEyeImage = new Image();
  sadEyeImage.src = "images/eyes-cross.png"; // Path to your sad image for the eyes
  const sadNoseImage = new Image();
  sadNoseImage.src = "images/nose-pig.png"; // Path to your sad image for the nose
  const sadMouthImage = new Image();
  sadMouthImage.src = "images/lip-crooked.png"; // Path to your sad image for the mouth

  // Angry images
  const angryEyeImage = new Image();
  angryEyeImage.src = "images/eyes-zombie.png"; // Path to your angry image for the eyes
  const angryNoseImage = new Image();
  angryNoseImage.src = "images/nose-septum.png"; // Path to your angry image for the nose
  const angryMouthImage = new Image();
  angryMouthImage.src = "images/lip-open.png"; // Path to your angry image for the mouth

  video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    const canvasCtx = canvas.getContext("2d");

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      // Clear the previous frame
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the mirrored video stream on the canvas
      canvasCtx.save();
      canvasCtx.translate(canvas.width, 0); // Move the origin to the right edge
      canvasCtx.scale(-1, 1); // Flip the canvas horizontally
      canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw the mirrored video
      canvasCtx.restore();

      // Draw facial recognition boxes and expressions (unmirrored)
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      // Overlay images conditionally based on the happy expression
      if (resizedDetections.length > 0) {
        const landmarks = resizedDetections[0].landmarks;
        const emotions = resizedDetections[0].expressions; // Ensure emotions is defined here

        // Check if the happy expression is detected above a threshold
        const happyThreshold = 0.5; // Adjust this value as needed
        if (emotions.happy > happyThreshold) {
          // Get the eye positions (unmirrored)
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();

          // Calculate positions to draw the image over the eyes
          const eyeWidth = 40; // Set the width for the image
          const eyeHeight = 40; // Set the height for the image
          const leftEyePosition = {
            x: leftEye[3].x - eyeWidth / 2, // Center image over the left eye
            y: leftEye[3].y - eyeHeight / 2,
          };
          const rightEyePosition = {
            x: rightEye[3].x - eyeWidth / 2, // Center image over the right eye
            y: rightEye[3].y - eyeHeight / 2,
          };

          // Draw the images over the eyes (unmirrored)
          canvasCtx.drawImage(
            eyeImage,
            leftEyePosition.x,
            leftEyePosition.y,
            eyeWidth,
            eyeHeight
          );
          canvasCtx.drawImage(
            eyeImage,
            rightEyePosition.x,
            rightEyePosition.y,
            eyeWidth,
            eyeHeight
          );

          // Get the nose position (unmirrored)
          const nose = landmarks.getNose();
          const noseWidth = 40; // Set the width for the image
          const noseHeight = 40; // Set the height for the image
          const nosePosition = {
            x: nose[3].x - noseWidth / 2, // Center image over the nose
            y: nose[3].y - noseHeight / 2,
          };

          // Draw the image over the nose (unmirrored)
          canvasCtx.drawImage(
            noseImage,
            nosePosition.x,
            nosePosition.y,
            noseWidth,
            noseHeight
          );

          // Get the mouth position (unmirrored)
          const mouth = landmarks.getMouth();
          const mouthWidth = 60; // Set the width for the image
          const mouthHeight = 40; // Set the height for the image
          const mouthPosition = {
            x: mouth[0].x - mouthWidth / 2, // Center image over the mouth
            y: mouth[3].y - mouthHeight / 2, // You may adjust this if needed
          };

          // Draw the image over the mouth (unmirrored)
          canvasCtx.drawImage(
            mouthImage,
            mouthPosition.x,
            mouthPosition.y,
            mouthWidth,
            mouthHeight
          );
        }

        // Check if the sad expression is detected above a threshold
        const sadThreshold = 0.5; // Adjust this value as needed
        if (emotions.sad > sadThreshold) {
          // Get the eye positions (unmirrored)
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();

          // Calculate positions to draw the sad images over the eyes
          const sadEyeWidth = 40; // Set the width for the sad eye image
          const sadEyeHeight = 40; // Set the height for the sad eye image
          const sadLeftEyePosition = {
            x: leftEye[3].x - sadEyeWidth / 2, // Center image over the left eye
            y: leftEye[3].y - sadEyeHeight / 2,
          };
          const sadRightEyePosition = {
            x: rightEye[3].x - sadEyeWidth / 2, // Center image over the right eye
            y: rightEye[3].y - sadEyeHeight / 2,
          };

          // Draw the images over the eyes (unmirrored)
          canvasCtx.drawImage(
            sadEyeImage,
            sadLeftEyePosition.x,
            sadLeftEyePosition.y,
            sadEyeWidth,
            sadEyeHeight
          );
          canvasCtx.drawImage(
            sadEyeImage,
            sadRightEyePosition.x,
            sadRightEyePosition.y,
            sadEyeWidth,
            sadEyeHeight
          );

          // Get the nose position (unmirrored)
          const nose = landmarks.getNose();
          const sadNoseWidth = 40; // Set the width for the sad nose image
          const sadNoseHeight = 40; // Set the height for the sad nose image
          const sadNosePosition = {
            x: nose[3].x - sadNoseWidth / 2, // Center image over the nose
            y: nose[3].y - sadNoseHeight / 2,
          };

          // Draw the image over the nose (unmirrored)
          canvasCtx.drawImage(
            sadNoseImage,
            sadNosePosition.x,
            sadNosePosition.y,
            sadNoseWidth,
            sadNoseHeight
          );

          // Get the mouth position (unmirrored)
          const mouth = landmarks.getMouth();
          const sadMouthWidth = 60; // Set the width for the sad mouth image
          const sadMouthHeight = 40; // Set the height for the sad mouth image
          const sadMouthPosition = {
            x: mouth[0].x - sadMouthWidth / 2, // Center image over the mouth
            y: mouth[3].y - sadMouthHeight / 2, // You may adjust this if needed
          };

          // Draw the image over the mouth (unmirrored)
          canvasCtx.drawImage(
            sadMouthImage,
            sadMouthPosition.x,
            sadMouthPosition.y,
            sadMouthWidth,
            sadMouthHeight
          );
        }

        // Check if the angry expression is detected above a threshold
        const angryThreshold = 0.5; // Adjust this value as needed
        if (emotions.angry > angryThreshold) {
          // Get the eye positions (unmirrored)
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();

          // Calculate positions to draw the angry images over the eyes
          const angryEyeWidth = 40; // Set the width for the angry eye image
          const angryEyeHeight = 40; // Set the height for the angry eye image
          const angryLeftEyePosition = {
            x: leftEye[3].x - angryEyeWidth / 2, // Center image over the left eye
            y: leftEye[3].y - angryEyeHeight / 2,
          };
          const angryRightEyePosition = {
            x: rightEye[3].x - angryEyeWidth / 2, // Center image over the right eye
            y: rightEye[3].y - angryEyeHeight / 2,
          };

          // Draw the images over the eyes (unmirrored)
          canvasCtx.drawImage(
            angryEyeImage,
            angryLeftEyePosition.x,
            angryLeftEyePosition.y,
            angryEyeWidth,
            angryEyeHeight
          );
          canvasCtx.drawImage(
            angryEyeImage,
            angryRightEyePosition.x,
            angryRightEyePosition.y,
            angryEyeWidth,
            angryEyeHeight
          );

          // Get the nose position (unmirrored)
          const nose = landmarks.getNose();
          const angryNoseWidth = 40; // Set the width for the angry nose image
          const angryNoseHeight = 40; // Set the height for the angry nose image
          const angryNosePosition = {
            x: nose[3].x - angryNoseWidth / 2, // Center image over the nose
            y: nose[3].y - angryNoseHeight / 2,
          };

          // Draw the image over the nose (unmirrored)
          canvasCtx.drawImage(
            angryNoseImage,
            angryNosePosition.x,
            angryNosePosition.y,
            angryNoseWidth,
            angryNoseHeight
          );

          // Get the mouth position (unmirrored)
          const mouth = landmarks.getMouth();
          const angryMouthWidth = 60; // Set the width for the angry mouth image
          const angryMouthHeight = 40; // Set the height for the angry mouth image
          const angryMouthPosition = {
            x: mouth[0].x - angryMouthWidth / 2, // Center image over the mouth
            y: mouth[3].y - angryMouthHeight / 2, // You may adjust this if needed
          };

          // Draw the image over the mouth (unmirrored)
          canvasCtx.drawImage(
            angryMouthImage,
            angryMouthPosition.x,
            angryMouthPosition.y,
            angryMouthWidth,
            angryMouthHeight
          );
        }
      }
    }, 100);
  });
});
