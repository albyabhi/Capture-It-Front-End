import { useRef, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';

const Capture = () => {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const fileSelectRef = useRef(null);  // Reference for the select input

  // Handle image capture from camera
  const handleImageCapture = (e) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prevPhotos => [...prevPhotos, ...fileUrls]);  // Store captured image URLs for display
    }
  };

  // Handle image selection from file input
  const handleImageSelect = (e) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prevPhotos => [...prevPhotos, ...fileUrls]);  // Store selected image URLs for display
    }
  };

  // Open camera when button is clicked
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();  // Trigger file input click
    }
  };

  // Open file input for selecting images from file system
  const openFileSelector = () => {
    if (fileSelectRef.current) {
      fileSelectRef.current.click();  // Trigger file selection click
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        gap: '16px',  // Added gap between elements
      }}
    >
      {/* Button to open the camera */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={openCamera}
        sx={{ maxWidth: '400px' }}
      >
        Open Camera
      </Button>

      {/* Hidden file input for camera */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageCapture}
        style={{ display: 'none' }}  // Hide the input button
        ref={fileInputRef}
        multiple
        capture="camera"  // This will open the camera for image capture
      />

      {/* Button to open file selector */}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={openFileSelector}
        sx={{ maxWidth: '400px' }}
      >
        Select Images from Files
      </Button>

      {/* Hidden file input for selecting images */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{ display: 'none' }}  // Hide the input button
        ref={fileSelectRef}
        multiple  // Allow multiple files to be selected
      />

      {/* Display the captured or selected images */}
      {photos.length > 0 && (
        <Box sx={{ width: '100%', maxWidth: '600px' }}>
          <Typography variant="h6" color="secondary" sx={{ marginBottom: '16px' }}>
            Captured Images
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',  // Responsive grid layout
              gap: '10px',  // Added gap between images
            }}
          >
            {photos.map((photo, index) => (
              <Box key={index} sx={{ width: '100%' }}>
                <img src={photo} alt={`Captured ${index + 1}`} width="100%" style={{ borderRadius: '8px' }} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Capture;
