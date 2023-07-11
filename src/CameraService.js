import axios from 'axios';

// Function to generate a unique 12-letter code
function generateUniqueCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Function to add camera to the MongoDB camera list
async function addCameraToMongoDB(username, name, source) {
  try {
    const code = generateUniqueCode();

   // Send the code, name, and source to the server
    const response = await axios.post('http://localhost:4000/api/add-camera', {
      username: username,
      code: code,
      name: name,
      source: source,
    });

    // Handle the response from the server if needed
    console.log(response.data);
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error(error);
  }
}

const CameraService = {
  generateUniqueCode, // Make the generateUniqueCode function accessible
  addCameraToMongoDB
};

export default CameraService;
