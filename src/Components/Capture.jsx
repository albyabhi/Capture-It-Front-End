import { useRef, useState } from 'react';
import { Button, Box, Typography , Alert  } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';

const Capture = ({ eventCode }) => {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const fileSelectRef = useRef(null);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('authToken');

  // Handle image capture or file selection
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) => ({
        file,
        name: file.name,
        size: file.size,
      }));
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  // Open camera when button is clicked
  const openCamera = () => {
    fileInputRef.current?.click();
  };

  // Open file input for selecting images
  const openFileSelector = () => {
    fileSelectRef.current?.click();
  };

  // Send images to backend
  const sendImagesToBackend = async () => {
    if (!photos.length) return; // Don't send empty form

    const formData = new FormData();
    photos.forEach((photo) => formData.append('images', photo.file));
    formData.append('eventCode', eventCode);

    try {
      const response = await axios.post(`${apiUrl}/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setPhotos([]);
      console.log('Images uploaded:', response.data);

      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to upload images', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: '16px' }}>
      {alertVisible && <Alert severity="success" sx={{ position: 'absolute', top: 20, zIndex: 1, width: '30%' }}>Image saved!</Alert>}
      <Button variant="contained" color="primary" fullWidth onClick={openCamera} sx={{ maxWidth: '400px' }}>
        Open Camera
      </Button>
      <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={fileInputRef} multiple capture="camera" />

      <Button variant="contained" color="secondary" fullWidth onClick={openFileSelector} sx={{ maxWidth: '400px' }}>
        Select Images from Files
      </Button>
      <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={fileSelectRef} multiple />

      {photos.length > 0 && (
        <Box sx={{ width: '100%', maxWidth: '600px' }}>
          <Typography variant="h6" color="secondary" sx={{ marginBottom: '16px' }}>
            Captured Images
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {photos.map((photo, index) => (
              <Box key={index} sx={{ width: '100%' }}>
                <img src={URL.createObjectURL(photo.file)} alt={`Captured ${index + 1}`} width="100%" style={{ borderRadius: '8px' }} />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Button variant="contained" color="success" fullWidth onClick={sendImagesToBackend} sx={{ maxWidth: '400px' }}>
        Send Images to Backend
      </Button>
    </Box>
  );
};

Capture.propTypes = {
  eventCode: PropTypes.string.isRequired,
};

export default Capture;
