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

  const eyeImage = new Image();
  eyeImage.src = "images/eyes-cute.png"; // Path to your image for the eyes
  const noseImage = new Image();
  noseImage.src = "images/nose-wings.png"; // Path to your image for the nose
  const mouthImage = new Image();
  mouthImage.src = "images/lip-bite.png"; // Path to your image for the mouth

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

      // Overlay images on top of the eyes
      if (resizedDetections.length > 0) {
        const landmarks = resizedDetections[0].landmarks;

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

      // Display detected emotion (unmirrored)
      if (detections.length > 0) {
        const emotions = detections[0].expressions;
        const maxEmotion = Object.keys(emotions).reduce((a, b) =>
          emotions[a] > emotions[b] ? a : b
        );
        const emotionText = `${maxEmotion} (${(
          emotions[maxEmotion] * 100
        ).toFixed(2)}%)`;

        // Calculate position for the emotion text (unmirrored)
        const emotionPosition = {
          x: 10, // Adjust as needed
          y: 30, // Adjust as needed
        };

        // Draw the emotion text on the canvas (unmirrored)
        canvasCtx.font = "20px Arial";
        canvasCtx.fillStyle = "white";
        canvasCtx.fillText(emotionText, emotionPosition.x, emotionPosition.y);
      }
    }, 100);
  });
});
