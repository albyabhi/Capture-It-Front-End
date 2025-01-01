import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import Capture from '../Components/Capture';

const EventRoom = () => {
  const { eventCode } = useParams();
  const navigate = useNavigate(); // Initialize navigate function
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // Check if the token exists when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // If token doesn't exist, navigate to home
      navigate('/');
    } else {
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
    }
  }, [apiUrl, eventCode, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#EFFFFD',
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
          backgroundColor: '#EFFFFD',
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
        padding: '16px',
      }}
    >
      {roomData ? (
        <Box sx={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
          <Typography variant="h4" gutterBottom color="primary">
            Event Room: {roomData.event_name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            <strong>Owner:</strong> {roomData.owner_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Created On:</strong> {new Date(roomData.created_date).toLocaleString()}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No room data available
        </Typography>
      )}
      <Box>
         <Capture /> 
      </Box>
    </Box>
  );
};

export default EventRoom;
