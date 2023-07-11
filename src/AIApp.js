import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CameraService from './CameraService';
import openDREWWindow from './openDREWWindow';
import openCameraWindow from './openCameraWindow';
import handleFileSelect from './handleFileSelect';
import openRTMPWindow from './openRTMPwindow';
import SignupFormComponent from './SignupForm';
import Select from 'react-select';
//import SelectOptions from './SelectOptions';


//import ModelList from './ModelList';
//import SelectOptions from './SelectOptions';

const AIApp = () => {
  const videoRef = useRef(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedMessages, setSelectedMessages] = useState('');
  const [messages, setMessages] = useState([]);
  const [cameraName, setCameraName] = useState('');
  const [cameraCode, setCameraCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleNameChange = (event) => {
    setCameraName(event.target.value);
  };

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

  useEffect(() => {
    //fetchOptions();
    fetchMessages();
  }, []);
  /*const fetchOptions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/modelFinder');
      setOptions(response.data.aiModelObject);
     // console.log(setOptions['AIModelObject']);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };*/
  
  const fetchMessages = async (e) => {
    try {
      const response = await axios.get('http://localhost:4000/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/login', {
        name: loginUsername,
        password: loginPassword,
      });
      console.log('Login successful:', response.data);
      setLoginSuccess('Login Success');
      setLoginError('');
      setLoginSuccess(true);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Invalid username or password');
    }
  };
  

  const submitDataToMongoDB = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/usersettings', {
        name: loginUsername,
        sourcelink: cameraCode,
        model: selectedOption,
        message: selectedMessages,
      });
      await axios.post('http://localhost:4000/api/detect/', {
        model: selectedOption,
        rtmp: cameraCode,
      });
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Invalid username or password');
    }
  };

  const GreetingComponent = ({ username }) => {
    return (
      <div>
        <h2>Hello, {username}!</h2>
        <p>Thank you for logging in.</p>
        <p>start choosing your wish.</p>
        <button onClick={submitDataToMongoDB}>Submit</button>
      </div>
    );
  };
  
  const SelectOptions = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get('http://localhost:4000/api/messages'); // Replace with your API endpoint
        setOptions(response);
      } catch (error) {
        console.error(error);
      }
      return (
        <div>
          <h2> the is : {setOptions}</h2> 
          <Select options={options} />
        </div>
      );
    };
    
  
  
  

  return (
    <div className="container">
      <div>
        {isLoggedIn ? (
          <GreetingComponent username={loginUsername} />
        ) : (
          <div>
            <div className="box">      
    
           <SignupFormComponent />
                  
            </div>
            <div className="box">
              <h2>Login</h2>
              <form onSubmit={handleLoginSubmit}>
                <label htmlFor="name">Username:</label>
                <input
                  type="text"
                  id="name"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
                <br />
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <br />
                {loginError && <p className="error">{loginError}</p>}
                {loginSuccess && <p className="success">{loginSuccess}</p>}
                <button type="submit">Login</button>
              </form>
            </div>
          </div>
        )}
      </div>
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
      <div className="box">
    
        <h2>בחר מה למצוא</h2>
        <SelectOptions />
        <img className="image" src="/images/object.jpg" alt="אובייקט" width="300" height="200" />
        <br />
        <h2>Hello, {selectedOption}!</h2>
        <select
          id="model"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">בחר אובייקט</option>
          {options.map((option ,index) => (
            <option key={index} value={option}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <div className="box">
        <h2>בחר מקור</h2>
        <select
          id="source"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          <option value="">בחר מקור</option>
          <option value="1">מצלמה 1</option>
          <option value="2">מצלמה 2</option>
          <option value="3">מצלמה 3</option>
        </select>
      </div>
      <div className="box">
        <h2>הודעות</h2>
        <div className="AIApp">
      <h1>Select Options from MongoDB</h1>
      <SelectOptions />
    </div>
        
      </div>
    </div>
  );
};

export default AIApp;
