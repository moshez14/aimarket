//import React from 'react';

const openCameraWindow = () => {
  //const videoRef = React.createRef();

  const newWindow = window.open('', '_blank', 'width=500,height=500');
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Camera Window</title>
          <script>
            navigator.mediaDevices.getUserMedia({ video: true })
              .then(function(stream) {
                var video = document.getElementById('video');
                video.srcObject = stream;
                video.play();
              })
              .catch(function(error) {
                console.error('Error accessing camera:', error);
              });
              
            function takeSnapshot() {
              const video = document.getElementById('video');
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');

              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              const imageBase64 = canvas.toDataURL('image/png');

              const link = document.createElement('a');
              link.href = imageBase64;
              link.download = 'my_photo.png';
              link.click();
              
            }
            
            function stopCamera() {
              const video = document.getElementById('video');
              const stream = video.srcObject;
              const tracks = stream.getTracks();

              tracks.forEach(function(track) {
                track.stop();
                window.close();
              });

              video.srcObject = null;
            }
          </script>
      </head>
      <body>
          <h1>Camera Window</h1>
          <video id="video" width="400" height="300" autoplay></video>
          <button onclick="takeSnapshot()">Take Snapshot</button>
          <button onclick="stopCamera()">stop</button>
      </body>
      </html>
    `);
  } else {
    console.error('Unable to open new window');
  }
};

export default openCameraWindow;
