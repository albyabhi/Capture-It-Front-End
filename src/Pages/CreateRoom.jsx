import  { useState, useRef } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';
import ReactQR from 'react-qr-code';

const CreateRoom = () => {
  const [eventName, setEventName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [roomCode, setRoomCode] = useState(null);
  const qrCodeRef = useRef(null);

  const handleCreateRoom = async () => {
    if (eventName.trim() === '' || ownerName.trim() === '') {
      setErrorMessage('Please enter all required details.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/room/create`, { eventName, ownerName });
      setRoomData(response.data.room);
      setRoomCode(response.data.room.room_code);
      setSuccessMessage('Room created successfully!');
    } catch (error) {
      console.error('Error creating room:', error);
      setErrorMessage('Failed to create the room. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const saveQRCode = () => {
    const canvas = qrCodeRef.current.querySelector('canvas');
    if (canvas) {
      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'room-qr-code.png';
      link.click();
    } else {
      alert('QR code is not ready!');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EFFFFD', padding: '16px' }}>
      <Typography variant="h4" gutterBottom color="primary">
        Create Event Room
      </Typography>

      <TextField
        label="Event Name"
        variant="outlined"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        fullWidth
        sx={{ marginBottom: '16px', maxWidth: '400px' }}
        error={!!errorMessage}
        helperText={errorMessage}
        aria-label="Event Name"
      />
      <TextField
        label="Room Owner Name"
        variant="outlined"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        fullWidth
        sx={{ marginBottom: '16px', maxWidth: '400px' }}
        error={!!errorMessage}
        helperText={errorMessage}
        aria-label="Room Owner Name"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateRoom}
        fullWidth
        sx={{ maxWidth: '400px', marginBottom: '16px' }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Room'}
      </Button>

      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          message={successMessage}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      )}

      {roomData && roomCode && (
        <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Room Code: {roomCode}
          </Typography>
          <div ref={qrCodeRef}>
            <ReactQR value={roomCode} size={256} />
          </div>
          <Box sx={{ marginTop: '16px' }}>
            <Button variant="contained" color="primary" onClick={saveQRCode}>
              Save QR
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CreateRoom;
