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
        minHeight: '100vh',
        backgroundColor: '#EFFFFD',
        padding: '16px',
      }}
    >
      <Typography variant="h4" gutterBottom color="primary">
        Capture Photos
      </Typography>

      {/* Button to open the default camera */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={openCamera}
        sx={{ marginBottom: '16px', maxWidth: '400px' }}
      >
        Open Camera
      </Button>

      {/* Button to open gallery */}
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={openCamera}
        sx={{ marginBottom: '16px', maxWidth: '400px' }}
      >
        Open Gallery
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
        <Box sx={{ marginTop: '20px', width: '100%', maxWidth: '600px' }}>
          <Typography variant="h6" color="secondary">
            Captured Images
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {photos.map((photo, index) => (
              <Box key={index} sx={{ margin: '10px' }}>
                <img src={photo} alt={`Captured ${index + 1}`} width="150" />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Capture;
