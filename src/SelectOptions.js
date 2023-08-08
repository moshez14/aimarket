import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectOptions({ user_ID, routineName, onsubmitmessage }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // Automatically submit the selected message whenever it changes
    if (selectedMessage) {
      submitDataToMongoDB();
    }
  }, [selectedMessage]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://www.maifocus.com:4000/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const submitDataToMongoDB = async () => {
    try {
      onsubmitmessage(selectedMessage.name);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleSelectChange = (selectedValue) => {
    const selectedMessage = messages.find((message) => message._id === selectedValue);
    setSelectedMessage(selectedMessage);
  };

  return (
    <div className="App">
      <h3>Select Message type:</h3>
      <div>
        <select
          id="model"
          value={selectedMessage ? selectedMessage._id : ''}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="">Message Type</option>
          {messages.map((option, index) => (
            <option key={index} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SelectOptions;





/*import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectOptions({ user_ID, routineName, onsubmitmessage }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://www.maifocus.com:4000/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const submitDataToMongoDB = async (e) => {
    e.preventDefault();
    try {
      onsubmitmessage(selectedMessage.name);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleSelectChange = (selectedValue) => {
    const selectedMessage = messages.find((message) => message._id === selectedValue);
    setSelectedMessage(selectedMessage);
  };

  return (
    <div className="App">
      <h1>Select Message Option</h1>
      <div>
        <select
          id="model"
          value={selectedMessage ? selectedMessage._id : ''}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="">Message Type</option>
          {messages.map((option, index) => (
            <option key={index} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>
        <button onClick={submitDataToMongoDB}>Submit</button>
      </div>
    </div>
  );
}

export default SelectOptions;*/
