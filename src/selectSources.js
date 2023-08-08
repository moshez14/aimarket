import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddRTMPcamera from './addRTMPcamera';
import openCameraWindow from './openCameraWindow'
import AddFile from './handleFileSelect';

function Selectsources({ user_ID, routineName, onSubmitsource }) {
  const [selectedsources, setSelectedsource] = useState('');
  const [sourceselected, setsourceselected] = useState('');
  const [sources, setsources] = useState([]);
  const [Link, setLInk] = useState('');
  const [submittedFILE, setSubmittedFile] = useState('');
  const [submittedRTMPcamera, setSubmittedRTMPcamera] = useState('');
  const [submittedHLScamera, setSubmittedHLScamera] = useState('');

  useEffect(() => {
    fetchsources();
  }, []);
  useEffect(() => {
    // Automatically submit the selected model whenever it changes
    submitselection();
  }, [sourceselected]);

  const fetchsources = async () => {
    try {
      const response = await axios.get('http://www.maifocus.com:4000/api/source');
      setsources(response.data);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const submitselection = () => {
    if (sourceselected === submittedRTMPcamera) {
      onSubmitsource(sourceselected, submittedHLScamera);
    } else {
      onSubmitsource(sourceselected);
    }
  };

 /* const Filesubmit = () => {
    setsourceselected(submittedFILE);
    submitselection();
  }*/

  const handleSelectChange = (selectedValue) => {
    setSelectedsource(selectedValue);

    // Automatically call the submitselection function on source selection change
    if (selectedValue === 'RTMP camera') {
      <AddRTMPcamera user_ID={user_ID} onSubmitRTMPcamera={handleRTMPcameraSubmit} />
      setsourceselected(0);
      submitselection();
    }
    if (selectedValue === 'device camera') {
      setsourceselected(0);
      submitselection();
      // Add the logic here for automatically selecting device camera source (if needed)
      // setsourceselected(DEVICE_CAMERA_VALUE);
      // submitselection();
    }
    if (selectedValue === 'upload file') {
      setsourceselected(submittedFILE);
      // Add the logic here for automatically selecting upload file source (if needed)
      // setsourceselected(UPLOAD_FILE_VALUE);
       submitselection();
    }
    if (selectedValue === 'link') {
      <form onSubmit={handleLinkSubmit}>
      <label htmlFor="name">Link:</label>
      <input
        type="text"
        id="link"
        value={Link}
        onChange={(e) => setLInk(e.target.value)}
        required
      />
      submitselection();
    
      </form>
      // Add the logic here for automatically selecting link source (if needed)
      // setsourceselected(LINK_VALUE);
      // submitselection();
    }
  };

  const handleRTMPcameraSubmit = (cameraRTMP, cameraHLS) => {
    setSubmittedRTMPcamera(cameraRTMP);
    setSubmittedHLScamera(cameraHLS);
    setsourceselected(cameraRTMP);
    submitselection();
    console.log('Camera RTMP:', cameraRTMP);
    console.log('Camera HLS:', cameraHLS);
  };

  const handlFileSubmit = (Fileurl) => {
    setSubmittedFile(Fileurl);
    setsourceselected(Fileurl);
    submitselection();
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    setsourceselected(Link);

    try {
      const response = await axios.post('http://www.maifocus.com:4000/api/addLink', {
        link: Link,
      });
      console.log('Login successful:', response.data);

    } catch (error) {
      console.error('Error uploading link:', error);
    }
    submitselection();
  };

  
  return (
    <div className="App">
      <h3>select source:</h3>
      <div>
        <select
          id="model"
          value={selectedsources}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="">Select a source</option>
          {sources.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>

        {selectedsources === 'RTMP camera' && (
          <AddRTMPcamera user_ID={user_ID} onSubmitRTMPcamera={handleRTMPcameraSubmit} />
        )}
        {selectedsources === 'device camera' && (
          <>
            <button onClick={openCameraWindow}>Open camera</button>
            {/* No need for <submitselection/> here */}
          </>
        )}
        {selectedsources === 'upload file' && (
          <>
            <AddFile user_ID={user_ID} onSubmitFile={handlFileSubmit} />
            {/* No need for <Filesubmit/> here */}
          </>
        )}
        {selectedsources === 'link' && (
          <form onSubmit={handleLinkSubmit}>
            <label htmlFor="name">Link:</label>
            <input
              type="text"
              id="link"
              value={Link}
              onChange={(e) => setLInk(e.target.value)}
              required
            />
            <button type="submit">ADD</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Selectsources;
/*














import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddRTMPcamera from './addRTMPcamera';
import openCameraWindow from './openCameraWindow'
import AddFile from './handleFileSelect';
//import handleLinkSubmit from './handleLinkSubmit';

function Selectsources({ user_ID, routineName, onSubmitsource }) {
  const [selectedsources, setSelectedsource] = useState('');
  const [sourceselected, setsourceselected] = useState('');
  const [sources, setsources] = useState([]);
  const [Link, setLInk] = useState('');


  useEffect(() => {
    fetchsources();
  }, []);

  const fetchsources = async () => {
    try {
      const response = await axios.get('http://www.maifocus.com:4000/api/source');
      setsources(response.data);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };
  
  const submitselection = () => {
    if (sourceselected==submittedRTMPcamera){
      onSubmitsource(sourceselected,submittedHLScamera);
      }
      else{
        onSubmitsource(sourceselected);
      }
      
};

const Filesubmit = () => {
  setsourceselected(submittedFILE);
 
}

/*const handledevicecamera = () => {
  setsourceselected(0);
 //submitselection();
  //onSubmitsource(sourceselected);
}*/

/*const [submittedRTMPcamera, setSubmittedRTMPcamera] = useState('');
const [submittedHLScamera, setSubmittedHLScamera] = useState('');
 /* const handleRTMPcameraSubmit = (cameraRTMP) => {
    setSubmittedRTMPcamera(cameraRTMP);
    setsourceselected(cameraRTMP);
    submitselection();
  };*/
 /* const handleRTMPcameraSubmit = (cameraRTMP, cameraHLS) => {
    // Use both cameraRTMP and cameraHLS values as needed
    setSubmittedRTMPcamera(cameraRTMP);
    setSubmittedHLScamera(cameraHLS);
    setsourceselected(cameraRTMP);
    submitselection();
    console.log('Camera RTMP:', cameraRTMP);
    console.log('Camera HLS:', cameraHLS);
  };
  const [submittedFILE, setSubmittedFile] = useState('');
  const handlFileSubmit = (Fileurl) => {
    setSubmittedFile(Fileurl);
    setsourceselected(Fileurl);
    submitselection();
  };
  const handleSelectChange = (selectedValue) => {
    setSelectedsource(selectedValue);
    if (selectedValue === 'device camera') {
      setsourceselected(0);
      submitselection();
    
    }
  };
 

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    setsourceselected(Link);
    
    try {
      const response = await axios.post('http://www.maifocus.com:4000/api/addLink', {
        link: Link,
      });
      console.log('Login successful:', response.data);
      
    } catch (error) {
        console.error('Error uploading link:', error);
      } 
      submitselection();
  };

  return (
    <div className="App">
      <h3>select source:</h3>
      <div>
        <select
          id="model"
          value={selectedsources}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="">Select a source</option>
          {sources.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
       
        {selectedsources === 'RTMP camera' && (
          <AddRTMPcamera user_ID={user_ID} onSubmitRTMPcamera={handleRTMPcameraSubmit} />

        )}
        {selectedsources === 'device camera' && (
        <>
                  
          <button onClick={openCameraWindow}>Open camera</button>
          <submitselection/>
         
        </>
      )}
        {selectedsources === 'upload file' && (
          <> 
         <AddFile user_ID={user_ID} onSubmitFile={handlFileSubmit} />
        < Filesubmit/>;
         {/*} <button onClick={Filesubmit}>Save</button>}*/
       /*   </>
         
        )}
        {selectedsources === 'link' && (
          <form onSubmit={handleLinkSubmit}>
          <label htmlFor="name">Link:</label>
          <input
            type="text"
            id="link"
            value={Link}
            onChange={(e) => setLInk(e.target.value)}
            required
          />

          <button onClick={submitselection}  type="submit" >Save</button>
          
          </form>
          )}
           
           <button onClick={submitselection}>SAVE</button>
          
        
      </div> 
    </div>
  );
}
export default Selectsources;*/
