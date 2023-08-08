import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';



function SubmitDataToMongoDB({ user_ID, routineName, SelectedSource, SelectedModel, selectedMessage }) {
  const [responseData, setResponseData] = useState(null);
  useEffect(() => {
    submitDataToMongoDB();
  }, []);

  const submitDataToMongoDB = async () => {
    try {
      const response = await axios.post('http://www.maifocus.com:4000/api/addsourceselected', {

      //await axios.post('http://www.maifocus.com:4000/api/addsourceselected', {
        userid: user_ID,
        routineName: routineName,
        selectedsource: SelectedSource,
        selectedmodel: SelectedModel,
        selectedmessage: selectedMessage
      });
      setResponseData(response.data);
      showStartingAIAlert(); // Show the pop-up after receiving the response
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const showStartingAIAlert = () => {
    window.alert('Starting AI on your video');
  };

  return (
    <div className="continer">
      {/*<h3>{responseData?.RoutineName}, {responseData?.sourceselected}, {responseData?.ModelSelected}, {responseData?.messageselect}</h3>*/}
    
      <button onClick={submitDataToMongoDB}>APPLY</button>

      
    </div>
  );
}

export default SubmitDataToMongoDB;
