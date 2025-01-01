import { useRef, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';

const Capture = () => {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  // Handle image capture from camera or gallery
  const handleImageCapture = (e) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prevPhotos => [...prevPhotos, ...fileUrls]);  // Store captured image URLs for display
    }
  };

  // Open camera or gallery when button is clicked
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();  // Trigger file input click
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
      {/* Button to open the default camera */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={openCamera}
        sx={{ maxWidth: '400px' }}
      >
        Open Camera
      </Button>

      {/* Styled file input button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => fileInputRef.current.click()}  // Trigger file input click
        sx={{
          maxWidth: '400px',
          height: '50px',
          textTransform: 'none',  // Prevent uppercase text
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Upload from Gallery
      </Button>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        capture="camera"  // Opens camera for capturing image
        onChange={handleImageCapture}
        style={{ display: 'none' }}  // Hide the input button
        ref={fileInputRef}
        multiple  // Allows multiple image selection
      />

      {/* Display the captured images */}
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
