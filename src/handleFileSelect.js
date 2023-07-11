import axios from "axios";

const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:4000/api/upload', formData);
      const fileUrl = response.data.link; // Corrected property name
      console.log('Response from server:', fileUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  export default handleFileSelect;