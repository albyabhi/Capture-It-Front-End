import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Divider, Button } from '@mui/material';

const EventRoom = () => {
  const { eventCode } = useParams();
  const [roomData, setRoomData] = useState(null); // State to hold the room data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State to handle errors

  const apiUrl = import.meta.env.VITE_BACKEND_URL; // Correctly access environment variable

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
        const data = await response.json();
        console.log(data);

        if (response.status === 200) {
          setRoomData(data.room);  // Set room data in state
        } else {
          setError('Room not found'); // Set error if room is not found
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
        setError('An error occurred while fetching the room data'); // Set error message if fetch fails
      } finally {
        setLoading(false); // Stop loading once the request is done
      }
    };

    fetchRoomData(); // Fetch room data when the component is mounted
  }, [eventCode]); // Dependency array: run the effect when eventCode changes

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
    );  // Show loading state while fetching data
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
        <Typography variant="h6" color="error">{error}</Typography>  // Display error message if any error occurs
      </Box>
    );
  }

  // If roomData is available, display it
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
        <Typography variant="body1" color="textSecondary">No room data available</Typography>  // This will be displayed if the roomData is empty or null
      )}
    </Box>
  );
};

export default EventRoom;
