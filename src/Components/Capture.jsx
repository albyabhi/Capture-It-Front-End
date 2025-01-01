import {useRef, useState } from 'react';

const Capture = () => {
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Handle image capture from camera or gallery
  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);  // Store the captured image URL for display
    }
  };

  // Open camera or gallery when button is clicked
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();  // Trigger file input click
    }
  };

  return (
    <div>
      <h2>Capture Photos</h2>

      {/* Button to open the default camera */}
      <button onClick={openCamera}>
        Open Camera
      </button>

      {/* Button to open gallery */}
      <button onClick={openCamera}>
        Open Gallery
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        capture="camera"  // Opens camera for capturing image
        onChange={handleImageCapture}
        style={{ display: 'none' }}  // Hide the input button
        ref={fileInputRef}
      />

      {/* Display the captured image */}
      {photo && (
        <div>
          <h3>Captured Image</h3>
          <img src={photo} alt="Captured" width="300" />
        </div>
      )}
    </div>
  );
};

export default Capture;
