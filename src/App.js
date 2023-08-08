import React, { useState, useRef, useEffect } from 'react';

import axios from 'axios';
import SignupFormComponent from './SignupForm';
import SelectOptions from './SelectOptions';
import SelectModel from './selectModel';
import SelectedSource from './selectSource';
import Addroutine from './addroutine';
import SubmitDataToMongoDB from './submitUsersetting';
import './App.css';
import './Chat.css';
import Selectsources from './selectSources';
import videojs from 'video.js';


function App() {
  const videoRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [input, setInput] = useState('');

  const [user_ID ,setUserId]= useState([]);;
  const ChackRoutineSubmit = async (submittedRoutineName) => { // Receive the routineName as an argument
    try {
      const response = await axios.post('http://www.maifocus.com:4000/api/routincheck', {
        user_ID: user_ID,
        routineName: submittedRoutineName, // Use the passed routineName here
      });
      setResponseData(response.data);
    } catch (error) {
      console.error('Error during routincheack:', error);
      setLoginError('Invalid routine');
    }
  };
  

  
 const [submittedRoutineName, setSubmittedRoutineName] = useState('');

  const handleRoutineSubmit = (routineName) => {
    setSubmittedRoutineName(routineName);
    ChackRoutineSubmit(routineName); // Pass the current routineName to the function
  };
 
  const [submittedModel, setSubmittedModel] = useState('');
  const handleModelSubmit = (modelselected) => {
    setSubmittedModel(modelselected);
  };

  const [submittedMessage, setSubmittedMessage] = useState('');
    const handlemessageSubmit  = (messageselected) => {
    setSubmittedMessage(messageselected);
  };

  const [selectedSources, setSelectedSources] = useState('');
  const [cameraHLS, setcameraHLS] = useState('');
  const handleSubmitsources = (Sourcesselected,cameraHLS) => {
    setSelectedSources(Sourcesselected);
    setcameraHLS(cameraHLS);
    // Perform any additional logic or API calls based on the selected source
  };

  useEffect(() => {
    fetchMessages();
    if (responseData !== null) {
      setSelectedSources(responseData.sourceselected);
      setSubmittedModel(responseData.ModelSelected);
      setSubmittedMessage(responseData.messageselect);
   
    }
  }, [responseData]); // Add responseData as a dependency
  
  
 
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://www.maifocus.com:4000/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

 
  
  

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://www.maifocus.com:4000/api/login', {
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
  
  const GreetingComponent = ({ username }) => {
    return (
      <div>
        <h2>Hello, {username}!</h2>     
      </div>
    );
  };

  function getYouTubeVideoId(url) {
    if (typeof url === 'string') {
      // Extract the video ID from the URL
      const regExp =
        /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regExp);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }
  const handlePlayVideo = () => {
    // If cameraHLS is available, play the video
    if (cameraHLS) {
      return (
        <div className="video-container">
          <video ref={videoRef} controls>
            <source src={cameraHLS} type="application/x-mpegURL" />
        
          </video>
        </div>
      );
    }
  
    // If cameraHLS is not available, check if the selectedSources is a valid YouTube URL
    const videoId = getYouTubeVideoId(selectedSources);
    if (videoId) {
      // If the video ID is available, construct the YouTube embed code
      const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
  
      return (
        <div className="video-container">
          <iframe
            width="320"
            height="180"
            src={youtubeEmbedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
  
    // If selectedSources is "0", display the camera stream from the device
    if (selectedSources === 0) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            // Display the camera stream in the video element
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing device camera:', error);
        }
      };
  
      const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
  
      return (
        <div className="video-container">
          <video ref={videoRef} autoPlay playsInline muted />
          <div>
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={stopCamera}>Stop Camera</button>
          </div>
        </div>
      );
    }
    // If no valid video URL is available, return null (or any other fallback)
    return null;
  };
  
  const [objectDetected, setObjectDetected] = useState('');

  useEffect(() => {
    // Make an HTTP request to the Flask API endpoint
    axios.post('http://www.maifocus.com:5000/maifocus/detect/')
      .then(response => {
        // Update the state with the detected object information
        setObjectDetected(response.data.object_detected);

        // Send email data if an object is detected
        if (response.data.object_detected) {
          const emailData = {
            email: 'recipient@example.com', // Replace with the recipient's email address
            object_detected: response.data.object_detected,
            frame: 'base64_encoded_image_data', // Replace with the actual base64-encoded image data of the frame
          };
        }
      })
      .catch(error => {
        console.error('Error fetching detected object:', error);
      });
    }, []);

    const [chatLog, setChatLog] = useState([]);

  const handleSubmit = () => {
    const userInput = chatLog[chatLog.length - 1];
    
    let botResponse;

    if (userInput.includes('hello')) {
      botResponse = 'Hello there!';
    } else if (userInput.includes('what time')) {
      botResponse = new Date().toLocaleTimeString(); 
    } else {
      botResponse = "I don't understand";
    }
    setInput('');
    setChatLog([...chatLog, {
      user: userInput,
      bot: botResponse
    }]);
  }

  return (
    <div className="app">
    <div className="sidebar">
        
        {isLoggedIn ? (
          <>
          <div className="chat-box">
      <div className="chat-log">
        <div className="chat-message user">
        {chatLog.map(line => (
        <div>
          {line.user}
          </div>
          ))} 
        </div>

        <div className="chat-message bot">
        {chatLog.map(line => (
        <div>
          {line.user}
          {line.bot}
        </div>
      ))}        </div>
      </div>
      <input 
        onChange={(e) => setChatLog([...chatLog, e.target.value])} 
      />

      <button onClick={handleSubmit}>send</button>
      
    </div>
        <div>
      

      {chatLog.map(line => (
        <div>
          {line.user}
          {line.bot}
        </div>
      ))}
    </div>
        </>
        ):(
          <div> </div>
        )}
        
        <ul>
          {/* <li>Home</li>
          <li>About us</li>
          <li>settings</li>
          Add more menu items as needed */}
        </ul>
      </div>
<div className="container">
    <div>       
      {isLoggedIn ? (
      <div>
        <div id="box1" class="box">
        <GreetingComponent username={loginUsername} />
        <h3>routine: {submittedRoutineName}</h3>
        <Addroutine user_ID={user_ID} onSubmitRoutine={handleRoutineSubmit} />
       { /* Display the response data
         {responseData && (
         <div>
         
           <h3>Selected Source:{responseData.sourceselected}</h3>
           <h3>Selected Model:{responseData.ModelSelected}</h3>
           <h3>Selected Response:{responseData.messageselect}</h3>
          
           
         </div>
         )}
        */ }
         </div>
      <div id="box2" class="box">
      
      <Selectsources user_ID={user_ID} routineName={submittedRoutineName} onSubmitsource={handleSubmitsources}/> 
      <p>Source selected: {selectedSources}</p> 
      {selectedSources !== null && handlePlayVideo()}
      </div>
      <div id="box3" class="box">
      <SelectModel user_ID={user_ID} routineName={submittedRoutineName} onSubmitModel={handleModelSubmit}/>
          <p>Model selected: {submittedModel}</p>
       </div>
       <div id="box4" class="box">
          <SelectOptions   user_ID={user_ID} routineName={submittedRoutineName} onsubmitmessage={handlemessageSubmit}/>
          <p>Submitted message type : {submittedMessage}</p>
          </div>

          <div id="box5" class="box">
          <SubmitDataToMongoDB user_ID={user_ID} routineName={submittedRoutineName}  SelectedSource={selectedSources}  SelectedModel={submittedModel}  selectedMessage={submittedMessage}/>
        </div>
        
        </div>
        ) : (
          <div>
           
      <div id="boxSUP" class="box">
        <SignupFormComponent />        
      </div>
      <div id="boxlogin" class="box">
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
      </div>
  );
}

export default App;

/*<box1>
         
        
{/* Display the response data }
{responseData && (
<div>

  <h3>Selected Source:{responseData.sourceselected}</h3>
  <h3>Selected Model:{responseData.ModelSelected}</h3>
  <h3>Selected Response:{responseData.messageselect}</h3>
 
  <SubmitDataToMongoDB user_ID={responseData.user_ID} routineName={responseData.RoutineName}  SelectedSource={responseData.sourceselected}  SelectedModel={responseData.ModelSelected}  selectedMessage={responseData.messageselect}/>
</div>
)}

</box1>*/
