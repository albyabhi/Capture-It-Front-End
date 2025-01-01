import { useState } from 'react';

const Capture = () => {
  const [photo, setPhoto] = useState(null);

  // Handle image capture from camera or gallery
  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);  // Store the captured image URL for display
    }
  };

  return (
    <div>
      <h2>Capture Photos</h2>

      {/* Button to open the default camera */}
      <button>
        <input
          type="file"
          accept="image/*"
          capture="camera"  // Opens camera for capturing image
          onChange={handleImageCapture}
          style={{ display: 'none' }}  // Hide the input button
        />
        Open Camera
      </button>

      {/* Button to open gallery */}
      <button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageCapture}  // Allow file selection from gallery
          style={{ display: 'none' }}  // Hide the input button
        />
        Open Gallery
      </button>

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
