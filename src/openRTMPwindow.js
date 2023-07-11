
const openRTMPWindow = () => {
    const newWindow = window.open('', '_blank', 'width=500,height=500');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>RTMP Window</title>
        </head>
        <body>
            <h1>RTMP URL</h1>
            <p>rtmp://maifocus.com/1935/live_hls/CAMERA_KEY</p>
        </body>
        </html>
      `);
    } else {
      console.error('Unable to open new window');
    }
  };
  export default openRTMPWindow;
