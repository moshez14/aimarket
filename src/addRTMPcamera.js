import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';


function AddRTMPcamera({ user_ID, onSubmitRTMPcamera }) {
  const [cameraName, setCameraName] = useState('');
  const [cameraCode, setCameraCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showAdditionalCode, setShowAdditionalCode] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [sources, setSources] = useState([]);
  const [cameraRTMP, setCameraRtmp] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/usercameras', {
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

  const handleVideoUrlChange = (event) => {
    setVideoUrl(event.target.value);
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
  };

  const copyCameraCode = () => {
    navigator.clipboard
      .writeText(cameraCode)
      .then(() => setIsCopied(true))
      .catch((error) => console.error(error));
  };

  const SubmitcameraDataToMongoDB = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/addCamera', {
        userid: user_ID,
        cameraName: cameraName,
        cameraCode: cameraCode,
      });
      fetchSources();
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const addRTMPcamera = () => {
    setShowAdditionalCode(true);
  };

  const closeRTMPcamera = () => {
    setShowAdditionalCode(false);
  };

  const handleCameraRadioChange = (cameraId) => {
    setSelectedCamera(cameraId);
  };

  const generateRTMP = () => {
    const selectedCameraObj = sources
      .flatMap((source) => source.cameras)
      .find((camera) => camera.name === selectedCamera);

    if (selectedCameraObj) {
      const cameraRtmp = `rtmp://www.maifocus.com:1935/live_hls/${selectedCameraObj.code}`;
      setCameraRtmp(cameraRtmp);
      onSubmitRTMPcamera(cameraRtmp);
    }
  };

  return (
    <div className="App">
      {showAdditionalCode ? (
        <>
          <button onClick={closeRTMPcamera}>Close Add RTMP camera</button>
          <h1>Add RTMP camera</h1>
          <div className="box">
            <label htmlFor="cameraName">Camera Name:</label>
            <input type="text" id="cameraName" value={cameraName} onChange={handleNameChange} />

            <button onClick={generateCameraCode}>Generate Camera Code</button>{' '}
            <button onClick={SubmitcameraDataToMongoDB}>Submit</button>

            {cameraCode && (
              <div>
                <h3>Generated Camera Code:</h3>
                <p>{cameraCode}</p>
                <button onClick={copyCameraCode}>{isCopied ? 'Copied!' : 'Copy Code'}</button>
              </div>
            )}
          </div>
          <div className="box">
            <h2>Choose camera:</h2>
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Camera Name</th>
                  <th>Camera Code</th>
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
            <button onClick={generateRTMP}>Submit</button>
            {cameraRTMP}
            <a href="rtmp://www.maifocus.com:1935/live_hls/tGo1WHGMjmuc">Click here for live stream</a>

            </div>
        </>
      ) : (
        <button onClick={addRTMPcamera}>Add camera</button>
      )}
    </div>
  );
}

export default AddRTMPcamera;
