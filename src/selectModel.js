import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
function SelectModel({ user_ID, routineName, onSubmitModel }) {
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    // Automatically submit the selected model whenever it changes
    submitDataToMongoDB();
  }, [selectedModel]);

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://www.maifocus.com:4000/api/AIModelObject');
      setModels(response.data);
    } catch (error) {
      console.error('Error fetching Models:', error);
    }
  };

  const submitDataToMongoDB = () => {
    try {
      onSubmitModel(selectedModel);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectChange = (selectedValue) => {
    setSelectedModel(selectedValue);
  };

  return (
    <div className="App">
      <h3>select what to serch for:</h3>
      <div>
        <select
          id="model"
          value={selectedModel}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="">Select a model</option>
          {models.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SelectModel;



/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectModel({ user_ID, routineName, onSubmitModel }) {
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://www.maifocus.com:4000/api/AIModelObject');
      setModels(response.data);
    } catch (error) {
      console.error('Error fetching Models:', error);
    }
  };
  
  const submitDataToMongoDB = (e) => {
    e.preventDefault();
    try { 
      onSubmitModel(selectedModel);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectChange = (selectedValue) => {
    setSelectedModel(selectedValue);
  };

  return (
    <div className="App">
      <h3>select what to serch for:</h3>
      <div>
        <select
          id="model"
          value={selectedModel}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="">Select a model</option>
          {models.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        
        <button onClick={submitDataToMongoDB}>Submit</button>
        
      </div> 
    </div>
  );
}

export default SelectModel;*/
