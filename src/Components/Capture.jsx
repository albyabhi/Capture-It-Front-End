import { useRef, useState } from 'react';
import { Button, Box, Grid, Typography, Alert } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const Capture = ({ eventCode, refreshImages }) => {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileSelectRef = useRef(null);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.log('No token found');
    return null; // Or redirect to login
  }

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files)
        .filter((file) => file.type.startsWith('image/')) // Filter only images
        .map((file) => ({
          file,
          name: file.name,
          size: file.size,
        }));
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const openCamera = () => {
    fileInputRef.current?.click();
  };

  const openFileSelector = () => {
    fileSelectRef.current?.click();
  };

  const sendImagesToBackend = async () => {
    if (!photos.length || loading) return;

    setLoading(true);
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
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      refreshImages();
    } catch (error) {
      console.error('Failed to upload images', error);
      setUploadError('Failed to upload images, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: '16px' }}>
      {alertVisible && <Alert severity="success" sx={{ position: 'absolute', top: 20, zIndex: 1, width: '30%' }}>Image saved!</Alert>}
      {uploadError && <Alert severity="error">{uploadError}</Alert>}

      {/* Grid for buttons */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={openCamera} 
            sx={{ height: { xs: '40px', sm: '50px', md: '60px', lg: '70px' },
               minWidth: '50px' }}
          >
            Open Camera
          </Button>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={fileInputRef} multiple capture="camera" />
        </Grid>

        <Grid item xs={12} md={4}>
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth 
            onClick={openFileSelector} 
            sx={{ height: { xs: '40px', sm: '50px', md: '60px', lg: '70px' },
               minWidth: '50px' }}
          >
            Select Images from Files
          </Button>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={fileSelectRef} multiple />
        </Grid>

        <Grid item xs={12} md={4}>
          <Button 
            variant="contained" 
            color="success" 
            fullWidth 
            onClick={sendImagesToBackend} 
            disabled={loading} 
            sx={{ height: { xs: '40px', sm: '50px', md: '60px', lg: '70px' },
               minWidth: '50px' }}
          >
            {loading ? 'Uploading...' : 'Send Images to Backend'}
          </Button>
        </Grid>
      </Grid>

      {/* Display the captured images in an ImageList */}
      {photos.length > 0 && (
        <Box sx={{ width: '100%', maxWidth: '600px', marginTop: '20px' }}>
          <Typography variant="h6" color="secondary" sx={{ marginBottom: '16px' }}>
            Captured Images
          </Typography>
          <ImageList sx={{ width: '100%', height: 'auto' }} cols={3}>
            {photos.map((photo, index) => (
              <ImageListItem key={index}>
                <img
                  src={URL.createObjectURL(photo.file)}
                  alt={`Captured ${index + 1}`}
                  loading="lazy"
                  style={{ borderRadius: '8px' }}
                />
                <ImageListItemBar
                  title={photo.name}
                  subtitle={`Size: ${Math.round(photo.size / 1024)} KB`}
                  
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}
    </Box>
  );
};

Capture.propTypes = {
  eventCode: PropTypes.string.isRequired,
  refreshImages: PropTypes.func.isRequired,
};

export default Capture;
