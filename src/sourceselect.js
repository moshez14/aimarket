import axios from 'axios';


const openDREWWindow = () => {
    const newWindow = window.open('', '_blank', 'width=500,height=500');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>העלאת תמונה וציור עליה</title>
            <script>
                function handleFileSelect(event) {
                    var file = event.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var img = new Image();
                        img.onload = function () {
                            var canvas = document.getElementById("canvas");
                            var context = canvas.getContext("2d");
                            canvas.width = img.width;
                            canvas.height = img.height;
                            context.drawImage(img, 0, 0);

                            // הוספת מאזין לחיצה ימנית על התמונה
                            canvas.addEventListener("contextmenu", drawSquare);
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }

                function drawSquare(event) {
                    event.preventDefault(); // מניעת הצגת תפריט הקירות הימני בדפדפן
                    var canvas = document.getElementById("canvas");
                    var context = canvas.getContext("2d");

                    // ערכי מיקום וגודל הריבוע
                    var rect = canvas.getBoundingClientRect();
                    var x = event.clientX - rect.left;
                    var y = event.clientY - rect.top;
                    var size = parseInt(document.getElementById("size").value);

                    // ציור הריבוע על התמונה
                    context.fillStyle = "rgba(255, 0, 0, 0.5)";
                    context.fillRect(x, y, size, size);

                    // הצגת ערכי מיקום הריבוע בתחתית הדף
                    var output = document.getElementById("output");
                    output.innerHTML = "מיקום הריבוע: X=" + x + ", Y=" + y;
                }
            </script>
        </head>
        <body>
            <h1>העלאת תמונה וציור עליה</h1>
            <input type="file" id="fileInput" accept="image/*" onchange="handleFileSelect(event)">
            <canvas id="canvas"></canvas>

            <h2>ציור על התמונה</h2>
            <label for="size">גודל:</label>
            <input type="number" id="size" value="50">
            <br>
            <div id="output"></div>
        </body>
        </html>
      `);
    } else {
      console.error('Unable to open new window');
    }
  };
/*
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
const sourceinput = () => {
    const newWindow = window.open('', '_blank', 'width=500,height=500');
      if (newWindow) {
        newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
        <div className="box">
        <h2>התחלה</h2>
        <div id="image-container"></div>
        <p>הבחירת מקור</p>
        <img className="image" src="/images/cam.jpg" alt="מצלמה" width="300" height="200" />
        <br />
        <input type="file" accept="image/*" onChange={handleFileSelect} />
        <button onClick={openCameraWindow}>open camera </button>
        <button onClick={takeSnapshot}>take take Snapshot </button>
        <button onClick={openDREWWindow}>בחר אזור בתמונה</button>
        <button onClick={openRTMPWindow}>הגדרות RTMP</button>
        {/* Added the video element }
        <div>
          <video id="video" width="400" height="300" ref={videoRef} autoPlay></video>
        </div>
      </div>
      </body>
      </html>
    `);
      } else {
        console.error('Unable to open new window');
      }
  
  }
/* Function to generate a unique 12-letter code
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

const sourceinpt = {
  takeSnapshot, // Make the generateUniqueCode function accessible
  openRTMPWindow
};*/

export default openDREWWindow;
