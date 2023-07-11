import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectedSource({ onSourceChange, user_ID }) {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sources, setSources] = useState([]);
  const [showSourceList, setShowSourceList] = useState(false);
  const [cameraRTMP,setcameraRtmp]= useState();

  useEffect(() => {
    fetchSources();
  }, []);
  const submitDataToMongoDB = async (e) => {
    e.preventDefault();
    const selectedCameraObj = sources
    .flatMap((source) => source.cameras)
    .find((camera) => camera._id.$oid === selectedCamera);

  const selectedFileObj = sources
    .flatMap((source) => source.filesLink)
    .find((file) => file._id.$oid === selectedFile);

  onSourceChange(selectedCameraObj, selectedFileObj);

  if (selectedCameraObj) {
    const cameraRtmp = `rtmp://maifocus.com/1935/live_hls/${selectedCameraObj.code}`;
    // Use the cameraRtmp value as needed (e.g., set it in state or pass it to another component)
    //console.log('cameraRtmp:', cameraRtmp);
   setcameraRtmp (cameraRtmp);
  }
  if (selectedFileObj) {
    // Use the cameraRtmp value as needed (e.g., set it in state or pass it to another component)
    //console.log('cameraRtmp:', cameraRtmp);
   setcameraRtmp (selectedFileObj.link);
  }
    try { 
    await axios.post('http://localhost:4000/api/addsourceseleced', {
      userid: user_ID,
      selectedsource: cameraRTMP
    });
    } catch (error) {
      console.error('Error during login:', error);
     // setLoginError('Invalid username or password');
    }
  };

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

  const handleCameraRadioChange = (cameraId) => {
    setSelectedCamera(cameraId === selectedCamera ? null : cameraId);
  };

  const handleFileRadioChange = (fileId) => {
    setSelectedFile(fileId === selectedFile ? null : fileId);
  };

  const toggleSourceList = () => {
    setShowSourceList(!showSourceList);
  };

  const handleSubmit = () => {
    const selectedCameraObj = sources
      .flatMap((source) => source.cameras)
      .find((camera) => camera._id.$oid === selectedCamera);

    const selectedFileObj = sources
      .flatMap((source) => source.filesLink)
      .find((file) => file._id.$oid === selectedFile);

    onSourceChange(selectedCameraObj, selectedFileObj);
    setShowSourceList(false);
    if (selectedCameraObj) {
        const cameraRtmp = `rtmp://maifocus.com/1935/live_hls/${selectedCameraObj.code}`;
        // Use the cameraRtmp value as needed (e.g., set it in state or pass it to another component)
       // console.log('cameraRtmp:', cameraRtmp);
      }
  };

  const selectedCameraData = sources
    .flatMap((source) => source.cameras)
    .find((camera) => camera._id.$oid === selectedCamera);

  const selectedFileData = sources
    .flatMap((source) => source.filesLink)
    .find((file) => file._id.$oid === selectedFile);

  return (
    <div className="App">
        
      {showSourceList ? (
        <div>
         
   
          <button onClick={toggleSourceList}>Close Source List</button>

          <h2>Cameras:</h2>
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
                  <tr key={camera._id.$oid}>
                    <td>
                      <input
                        type="radio"
                        name="selectedCamera"
                        value={camera._id.$oid}
                        checked={camera._id.$oid === selectedCamera}
                        onChange={() => handleCameraRadioChange(camera._id.$oid)}
                      />
                    </td>
                    <td>{camera.name}</td>
                    <td>{camera.code}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h2>File Links:</h2>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>File Name</th>
                <th>File Link</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="radio"
                    name="selectedFile"
                    value="none"
                    checked={selectedFile === null}
                    onChange={() => handleFileRadioChange(null)}
                  />
                </td>
                <td>None</td>
                <td></td>
              </tr>
              {sources.map((source) =>
                source.filesLink.map((file) => (
                  <tr key={file._id.$oid}>
                    <td>
                      <input
                        type="radio"
                        name="selectedFile"
                        value={file._id.$oid}
                        checked={file._id.$oid === selectedFile}
                        onChange={() => handleFileRadioChange(file._id.$oid)}
                      />
                    </td>
                    <td>{file.name}</td>
                    <td>{file.link}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <button onClick={submitDataToMongoDB}>Submit</button>
        </div>
      ) : (
        <div>
          <button onClick={toggleSourceList}>Open Source List</button>
          <div>
            <h3>Selected Camera:</h3>
            {selectedCameraData ? (
              <div>
                <p>Name: {selectedCameraData.name}</p>
                <p>Code: {selectedCameraData.code}</p>
                
              </div>
            ) : (
              <p>No camera selected.</p>
            )}
          </div>
          <div>
            <h3>Selected File Link:</h3>
            {selectedFileData ? (
              <div>
                <p>Name: {selectedFileData.name}</p>
                <p>Link: {selectedFileData.link}</p>
              </div>
            ) : (
              <p>No file link selected.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectedSource;
