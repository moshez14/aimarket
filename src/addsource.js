
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import CameraService from './CameraService';
import openDREWWindow from './openDREWWindow';
import openCameraWindow from './openCameraWindow';
//import handleFileSelect from './handleFileSelect';
import openRTMPWindow from './openRTMPwindow';

function Addsource({ user_ID, username }) {
    const videoRef = useRef(null)
    const [cameraName, setCameraName] = useState('');
    const [cameraCode, setCameraCode] = useState('');
    //const [generatedCode, setgeneratedCode]= useState('');
    const [isCopied, setIsCopied] = useState(false);
    const handleNameChange = (event) => {
        setCameraName(event.target.value);
      };
      const [showAdditionalCode, setShowAdditionalCode] = useState(false);
    const generateCameraCode = () => {
        //const username = username;
        //const source = 'rtmp://maifocus.com/1935/live_hls';
       const generatedCode = CameraService.generateUniqueCode();
        //const name = cameraName;
        
        //CameraService.addCameraToMongoDB(username, name, source);
        setCameraCode(generatedCode);
        setIsCopied(false);
      };
      
      const copyCameraCode = () => {
        navigator.clipboard
          .writeText(cameraCode)
          .then(() => setIsCopied(true))
          .catch((error) => console.error(error));
      };
      const submitDataToMongoDB = async (e) => {
        e.preventDefault();
        try { 
        await axios.post('http://www.maifocus.com:4000/api/addCamera', {
          userid: user_ID,
          cameraName: cameraName,
          cameraCode: cameraCode,
        });
        } catch (error) {
          console.error('Error during login:', error);
         // setLoginError('Invalid username or password');
        }
      };
      
      const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
      
        try {
          const response = await axios.post('http://www.maifocus.com:4000/api/upload',formData);
          const fileUrl = response.data.link; // Corrected property name
          console.log('Response from server:', fileUrl);
          await axios.post('http://www.maifocus.com:4000/api/addfileLink', {
          userid: user_ID,
          fileUrl: fileUrl,
          username: username,
        });
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      const addSource = () => {
        setShowAdditionalCode(true);
      };
      const closeAddSource = () => {
        setShowAdditionalCode(false);     
              };
      
      return (
        <div className="App">
          {showAdditionalCode ? (
            <>
              <button onClick={closeAddSource}>Close Add Source</button>
              <h1>Select source</h1>
              <div className="box">
                <h2>התחלה</h2>
                <div id="image-container"></div>
                <p>הבחירת מקור</p>
                <img className="image" src="/images/cam.jpg" alt="מצלמה" width="300" height="200" />
                <br />
                <input type="file" accept="image/*" onChange={handleFileSelect} />
                <button onClick={openCameraWindow}>open camera</button>
                <button onClick={openDREWWindow}>בחר אזור בתמונה</button>
                <button onClick={openRTMPWindow}>הגדרות RTMP</button>
                <div>
                  <video id="video" width="400" height="300" ref={videoRef} autoPlay></video>
                </div>
              </div>
              <div>
                <label htmlFor="cameraName">Camera Name:</label>
                <input type="text" id="cameraName" value={cameraName} onChange={handleNameChange} />
    
                <button onClick={generateCameraCode}>Generate Camera Code</button>{' '}
                <button onClick={submitDataToMongoDB}>Submit</button>
    
                {cameraCode && (
                  <div>
                    <h3>Generated Camera Code:</h3>
                    <p>{cameraCode}</p>
                    <button onClick={copyCameraCode}>{isCopied ? 'Copied!' : 'Copy Code'}</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button onClick={addSource}>Add Source</button>
          )}
        </div>
      );
    }
export default Addsource;
