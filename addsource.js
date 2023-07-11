
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CameraService from './CameraService';
import openDREWWindow from './openDREWWindow';
import openCameraWindow from './openCameraWindow';
import handleFileSelect from './handleFileSelect';
import openRTMPWindow from './openRTMPwindow';

function Addsource() {
    const videoRef = useRef(null)
    const [cameraName, setCameraName] = useState('');
    const [cameraCode, setCameraCode] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const generateCameraCode = () => {
        const username = loginUsername;
        const source = 'rtmp://maifocus.com/1935/live_hls';
        const generatedCode = CameraService.generateUniqueCode();
        const name = cameraName;
        CameraService.addCameraToMongoDB(username, name, source);
        setCameraCode(generatedCode);
        setIsCopied(false);
      };
      
      const copyCameraCode = () => {
        navigator.clipboard
          .writeText(cameraCode)
          .then(() => setIsCopied(true))
          .catch((error) => console.error(error));
      };
      
    return (
        <div className="App">
          <h1>Select source</h1>
          <div className="box">
        <h2>התחלה</h2>
<div id="image-container"></div>
<p>הבחירת מקור</p>
<img className="image" src="/images/cam.jpg" alt="מצלמה" width="300" height="200" />
<br />
<input type="file" accept="image/*" onChange={handleFileSelect} />
<button onClick={openCameraWindow}>open camera </button>
<button onClick={openDREWWindow}>בחר אזור בתמונה</button>
<button onClick={openRTMPWindow}>הגדרות RTMP</button>
<div>
  <video id="video" width="400" height="300" ref={videoRef} autoPlay></video>
</div>
</div>
<div>
<label htmlFor="cameraName">Camera Name:</label>
<input type="text" id="cameraName" value={cameraName} onChange={handleNameChange} />

<button onClick={generateCameraCode}>Generate Camera Code</button>

{cameraCode && (
  <div>
    <h3>Generated Camera Code:</h3>
    <p>{cameraCode}</p>
    <button onClick={copyCameraCode}>{isCopied ? 'Copied!' : 'Copy Code'}</button>
  </div>
)}
</div>
</div>
      );

}
export default Addsource;
