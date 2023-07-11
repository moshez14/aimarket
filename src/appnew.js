import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CameraService from './CameraService';
import openDREWWindow from './openDREWWindow';
import openCameraWindow from './openCameraWindow';
import handleFileSelect from './handleFileSelect';
import openRTMPWindow from './openRTMPwindow';
import SignupFormComponent from './SignupForm';
import SelectOptions from './SelectOptions';
import SelectModel from './selectModel';
import SelectedSource from './selectSource';
import Addsource from './addsource';
import AddRTMPcamera from './addRTMPcamera';
import Addroutine from './addroutine';
import SubmitAddroutine from './addroutine';
import SubmitDataToMongoDB from './submitUsersetting';

function App() {
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
  const [userCameras, setUserCameras] = useState([]);
  const [user_ID ,setUserId]= useState([]);;
  const handleNameChange = (event) => {
    setCameraName(event.target.value);
  };

  const [submittedRoutineName, setSubmittedRoutineName] = useState('');
  const handleRoutineSubmit = (routineName) => {
    setSubmittedRoutineName(routineName);
  };

  const [submittedRTMPcamera, setSubmittedRTMPcamera] = useState('');
  const handleRTMPcameraSubmit = (cameraRTMP) => {
    setSubmittedRTMPcamera(cameraRTMP);
  };

  const [submittedModel, setSubmittedModel] = useState('');
  const handleModelSubmit = (modelselected) => {
    setSubmittedModel(modelselected);
  };

  const [submittedMessage, setSubmittedMessage] = useState('');
  const handlemessageSubmit = (messageselected) => {
    setSubmittedMessage(messageselected);
  };


  useEffect(() => {
    fetchMessages();
    
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

 
  
  
  const handleSelectChange = (selectedValue) => {
    setSelectedMessages(selectedValue);
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
      < SelectedSource user_ID={user_ID}/>   
// Access the user ID from the response data
      const userId = response.data.user_ID;
      setUserId(userId);
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Invalid username or password');
    }
  };
  
  const GreetingComponent = ({ user_ID }) => {
    return (
      <div>
        <h2>Hello, {user_ID}!</h2>
        <p>Thank you for logging in.</p>
        <p>start choosing your wish.</p>
       
      </div>
    );
  };
  const handleSourceChange = (selectedValue) => {
    setSelectedSource(selectedValue);
  };
  const [boxText, setBoxText] = useState('');

  const handleClick = (event) => {
    setBoxText(event.target.innerText);
  };

  useEffect(() => {
    const boxes = document.querySelectorAll('.box');
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].addEventListener('click', handleClick);
    }
  }, []);

  return (

      <div id="container">
      
      
        <div id="menu">
          <h2>Menu</h2>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
        {isLoggedIn ? (
        <div id="main">
          <div id="box1" class="box">
            <p>Box 1</p>
            <GreetingComponent username={loginUsername} />
          </div>
          <div id="box2" class="box">
            <p>Box 2</p>
          </div>
          <div id="box3" class="box">
            <p>Box 3</p>
          </div>
          <div id="box4" class="box">
            <p>Box 4</p>
          </div>
        </div>
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
  );
};
export default App;
/*<div className="container">

    <div>
      {isLoggedIn ? (
        <div>
          <GreetingComponent username={loginUsername} />
          
          <Addroutine user_ID={user_ID} onSubmitRoutine={handleRoutineSubmit} />
      <p>Submitted Routine Name: {submittedRoutineName}</p>
          <AddRTMPcamera  user_ID={user_ID} routineName={submittedRoutineName} onSubmitRTMPcamera={handleRTMPcameraSubmit} />
          <p>Submitted RTMP: {submittedRTMPcamera}</p>
          <SelectModel user_ID={user_ID} routineName={submittedRoutineName} onSubmitModel={handleModelSubmit}/>
          <p>Submitted AIModel Name: {submittedModel}</p>
          <SelectOptions   user_ID={user_ID} routineName={submittedRoutineName} onsubmitmessage={handlemessageSubmit}/>
          <p>Submitted message type : {submittedMessage}</p>
          <SubmitDataToMongoDB user_ID={user_ID} routineName={submittedRoutineName}  SelectedSource={submittedRTMPcamera}  SelectedModel={submittedModel}  selectedMessage={submittedMessage}/>
        </div>
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
     
      </div>
      
  );
}

*/

