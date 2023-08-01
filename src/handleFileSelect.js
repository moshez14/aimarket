import React, { useState, useEffect } from 'react';
import axios from "axios";
function AddFile({ user_ID, onSubmitFile }) {
  const [fileUrl, setFileUrl] = useState('');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      const fileUrl = data.link;
      setFileUrl(fileUrl); // Update the file URL state
      onSubmitFile(fileUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  /*
const [Fileurl, setFileurl] = useState('');
const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:4000/api/upload', formData);
      const fileUrl = response.data.link; // Corrected property name
      console.log('Response from server:', fileUrl);
      setFileurl(fileUrl)
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    onSubmitFile(Fileurl);
  }*/
 return(
  <div className="continer"> 
  <input type="file"  onChange={handleFileSelect} />
  {fileUrl && <p>File URL: {fileUrl}</p>}
  </div> 
  )
 
};
  export default AddFile;