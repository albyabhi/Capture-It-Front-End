import { TextField, Button, Divider, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RoomSetup = ({ eventCode, setEventCode }) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const handleJoinEvent = async () => {
    if (eventCode.trim() === '') {
      alert('Please enter an event code!');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
      const data = await response.json();

      if (response.status === 200) {
        console.log('Room found:', data.room);
        navigate(`/user/${eventCode}`);
      } else {
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
        backgroundColor: '#EFFFFD',
        
      }}
    >
      <Typography variant="h6" gutterBottom color="primary">
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

export default RoomSetup;
