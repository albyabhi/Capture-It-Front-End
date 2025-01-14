import { useState, useEffect } from 'react';
import { useParams ,  useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

const UserLogin = () => {
  const { eventCode } = useParams();
  const [fullName, setFullName] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
        const data = await response.json();

        if (response.status === 200) {
          setRoomData(data.room);
        } else {
          setError('Room not found');
        }
      } catch (err) {
        console.error('Error fetching room data:', err);
        setError('An error occurred while fetching the room data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [apiUrl, eventCode]);

  const handleLogin = async () => {
    if (fullName.trim() === '') {
      alert('Please enter your full name!');
      return;
    }
  
    try {
      const response = await fetch(`${apiUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, eventCode }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Response from server:', result);
  
        // Retrieve the token from the server response
        const token = result.token;
  
        // Log the token to the console
        console.log('JWT Token:', token);
  
        // Optionally store the token in localStorage or a state management system
        localStorage.setItem('authToken', token);
  
        // Save the eventCode to recent-rooms in localStorage
        const recentRooms = JSON.parse(localStorage.getItem('recent-rooms')) || [];
        if (!recentRooms.includes(eventCode)) {
          recentRooms.push(eventCode);
        }
        localStorage.setItem('recent-rooms', JSON.stringify(recentRooms));
  
        navigate(`/event-room/${eventCode}`);
      } else {
        alert('Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    }
  };
  

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '16px',
      }}
    >
      {roomData && (
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: '16px',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <Typography variant="h5" color="primary">
            Event Name {roomData.event_name}
          </Typography>
          
        </Box>
      )}

     

      <TextField
        label="Your Full Name"
        variant="outlined"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        fullWidth
        sx={{ marginBottom: '16px', maxWidth: '400px' }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        sx={{ maxWidth: '400px' }}
      >
        Login
      </Button>
    </Box>
  );
};

export default UserLogin;
