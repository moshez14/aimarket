import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ReactDOM from 'react-dom';

function AddRTMPcamera({ user_ID, onSubmitRTMPcamera }) {
  const [cameraName, setCameraName] = useState('');
  const [cameraCode, setCameraCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showAdditionalCode, setShowAdditionalCode] = useState(false);
  const [showcameralist, setShowcameralist] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [sources, setSources] = useState([]);
  const [cameraRTMP, setCameraRtmp] = useState('');

  useEffect(() => {
    fetchSources();
  }, []);
 


  const fetchSources = async () => {
    try {
      const response = await axios.get('http://www.maifoccus.com:4000/api/usercameras', {
        params: {
          user_ID: user_ID,
        },
      });
      const { data } = response;
      if (Array.isArray(data)) {
        setSources(data);
      } else {
        console.error('Invalid user sources data:', data);
      }
    } catch (error) {
      console.error('Error fetching user sources:', error);
    }
  };

  const handleNameChange = (event) => {
    setCameraName(event.target.value);
  };

  const generateUniqueCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const generateCameraCode = () => {
    const generatedCode = generateUniqueCode();
    setCameraCode(generatedCode);
    setIsCopied(false);

    // Automatically submit the camera code
    submitCameraDataToMongoDB();
    setShowAdditionalCode(false);
    setShowcameralist(true);
  };

  const copyCameraCode = () => {
    navigator.clipboard
      .writeText(cameraCode)
      .then(() => setIsCopied(true))
      .catch((error) => console.error(error));
  };

  const cameradelete = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://www.maifoccus.com:4000/api/deleteCamera', {
        userid: user_ID,
        cameraName: selectedCamera,
      });
      fetchSources();
    } catch (error) {
      console.error('Error during camera delete:', error);
    }
  };

  const submitCameraDataToMongoDB = async () => {
    try {
      await axios.post('http://www.maifoccus.com:4000/api/addCamera', {
        userid: user_ID,
        cameraName: cameraName,
        cameraCode: cameraCode,
      });
      fetchSources();
    } catch (error) {
      console.error('Error during camera data submission:', error);
    }
  };

  const addRTMPcamera = () => {
    setShowAdditionalCode(true);
    setShowcameralist(false);
  };

  const closeRTMPcamera = () => {
    setShowAdditionalCode(false);
    setShowcameralist(true);
  };
  const handleCameraRadioChange = (cameraId) => {
    setSelectedCamera(cameraId);
  };
  useEffect(() => {
    generateRTMP(); // Call generateRTMP whenever selectedCamera changes
  }, [selectedCamera]);
 
  const generateRTMP = () => {
    const selectedCameraObj = sources
      .flatMap((source) => source.cameras)
      .find((camera) => camera.name === selectedCamera);

    if (selectedCameraObj) {
      const cameraRtmp = `rtmp://www.maifocus.com:1935/live_hls/${selectedCameraObj.code}`;
      const cameraHLS = `http://maifocus.com:8080/show/${selectedCameraObj.code}`;

      setCameraRtmp(cameraRtmp);
      onSubmitRTMPcamera(cameraRtmp, cameraHLS); // Pass both parameters to the callback
    }
  };
  const handleRTMPcameraSubmit = (cameraRTMP, cameraHLS) => {
    // Add the functionality as per your requirements
    console.log('Camera RTMP:', cameraRTMP);
    console.log('Camera HLS:', cameraHLS);
  };

  const openAddRTMPcameraWindow = () => {
    const newWindow = window.open('', '_blank', 'width=600,height=400');
    newWindow.document.title = 'Add RTMP Camera';
    newWindow.document.body.innerHTML = '<h1>Add RTMP Camera</h1>';

    // Render the AddRTMPcamera component in the new window
    ReactDOM.render(
      <React.StrictMode>
        <AddRTMPcamera
          user_ID={user_ID}
          onSubmitRTMPcamera={handleRTMPcameraSubmit}
          onClose={() => newWindow.close()} // This prop is used to close the window when needed
        />
      </React.StrictMode>,
      newWindow.document.body
    );

    // Show the appropriate view in the original window
    setShowAdditionalCode(true);
    setShowcameralist(false);
  };

  return (
    <div className="continer">
      {showAdditionalCode ? (
        <>
        {!showcameralist && <button onClick={closeRTMPcamera}>Close Add RTMP camera</button>}
          {/*<button onClick={closeRTMPcamera}>Close Add RTMP camera</button>*/}
          <div id="cam" className="box">
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
        </>
      ) : (
        <button onClick={addRTMPcamera}>Add camera</button>
      )}
      {showcameralist ? (
        <>
          <h3>Choose camera:</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="radio"
                    name="selectedCamera"
                    value="none"
                    checked={selectedCamera === null}
                    onChange={() => handleCameraRadioChange(null)}
                  />
                </td>
                <td>None</td>
                <td></td>
              </tr>
              {sources.map((source) =>
                source.cameras.map((camera) => (
                  <tr key={camera.code}>
                    <td>
                      <input
                        type="radio"
                        name="selectedCamera"
                        value={camera.name}
                        checked={camera.name === selectedCamera}
                        onChange={() => handleCameraRadioChange(camera.name)}
                      />
                    </td>
                    <td>{camera.name}</td>
                    <td>{camera.code}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button onClick={cameradelete}>Delete</button>
          
        </>
      ) : (
        <closeRTMPcamera />
      )}
    </div>
  );
}

export default AddRTMPcamera;


/* const handleCameraRadioChange = (cameraId) => {
    setSelectedCamera(cameraId);
  };
*/
 /* const generateRTMP = () => {
    const selectedCameraObj = sources
      .flatMap((source) => source.cameras)
      .find((camera) => camera.name === selectedCamera);

    if (selectedCameraObj) {
      const cameraRtmp = `rtmp://www.maifocus.com:1935/live_hls/${selectedCameraObj.code}`;
      const cameraHLS = 'http://maifocus.com:8000/${selectedCameraObj.code}';
      setCameraRtmp(cameraRtmp);
      onSubmitRTMPcamera(cameraRtmp);
    }
  };*/
