import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ModelList = () => {
  const [AIModelObject, setAIModelObject] = useState([]);

  useEffect(() => {
    const fetchAIModelObject = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/AIModelObject');
        setAIModelObject(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchAIModelObject();
  }, []);

  return (
    <div>
      <h2>AIModelObject</h2>
      כחכא
      <ul>
        {AIModelObject.map((model) => (
          <li key={model._id}>{model.AIModelObject}</li>
        ))}
      </ul>
    </div>
  );
};

export default ModelList;
