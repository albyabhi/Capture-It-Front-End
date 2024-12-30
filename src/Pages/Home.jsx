import React, { useState, useRef } from 'react';
import { TextField, Button, Box, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';

const Home = () => {
  const [eventCode, setEventCode] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const apiUrl = import.meta.env.VITE_BACKEND_URL; // Correctly access environment variable

  const navigate = useNavigate();

  const handleCameraOpen = () => {
    setIsCameraOpen(true); // Opens the camera
  };

  const handleJoinEvent = async () => {
    if (eventCode.trim() === '') {
      alert('Please enter an event code!');
      return;
    }

    try {
      // Check if the room exists by sending a request to the backend
      const response = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
      const data = await response.json();
      const eventName =data.event_name;

      if (response.status === 200) {
        // Room exists
        console.log('Room found:', data.room);
        navigate(`/event-room/${eventCode}`);
      } else {
        // Room does not exist
        console.log('Room not found');
        alert('Room not found, please check the event code.');
      }
    } catch (error) {
      console.error('Error checking room:', error);
      alert('An error occurred while checking the room.');
    }
  };

  const handleCreateEvent = () => {
    navigate('/create-room');
  };

  const handleQrCode = () => {
    navigate('/QR-Scan');
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
        Join or Create Event Room
      </Typography>

     
        <>
          <TextField
            label="Event Code"
            variant="outlined"
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            fullWidth
            sx={{ marginBottom: '16px', maxWidth: '400px' }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleJoinEvent}
            sx={{ marginBottom: '16px', maxWidth: '400px' }}
          >
            Join Event Room
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleQrCode}
            sx={{ marginBottom: '16px', maxWidth: '400px' }}
          >
            Scan QR Code
          </Button>
          <Divider sx={{ margin: '16px 0', width: '100%', maxWidth: '400px' }}>
            OR
          </Divider>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleCreateEvent}
            sx={{ maxWidth: '400px' }}
          >
            Create Event Room
          </Button>
        </>
      
    </Box>
  );
};

export default Home;
