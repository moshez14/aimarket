import React, { useState, useEffect } from 'react';
import axios from 'axios';



function SubmitDataToMongoDB({ user_ID, routineName, SelectedSource, SelectedModel, selectedMessage }) {
  useEffect(() => {
    submitDataToMongoDB();
  }, []);

  const submitDataToMongoDB = async () => {
    try {
      await axios.post('http://localhost:4000/api/addsourceselected', {
        userid: user_ID,
        routineName: routineName,
        selectedsource: SelectedSource,
        selectedmodel: SelectedModel,
        selectedmessage: selectedMessage
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">

      <button onClick={submitDataToMongoDB}>APPLAY</button>
     
    </div>
  );
}

export default SubmitDataToMongoDB;
