import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const Recent_Rooms = ( {onRoomsFetched} ) => {
  const [roomDetails, setRoomDetails] = useState([]);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      const recentRooms = JSON.parse(localStorage.getItem('recent-rooms')) || [];

      if (recentRooms.length === 0) {
        console.warn('No recent rooms found in localStorage');
        return;
      }

      try {
        const roomDataPromises = recentRooms.map(async (eventCode) => {
          try {
            const response = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
            if (response.ok) {
              const data = await response.json();
              return { eventCode, eventName: data.room.event_name };
            } else {
              console.error(`Room not found for eventCode: ${eventCode}`);
              return null;
            }
          } catch (error) {
            console.error(`Error fetching data for eventCode: ${eventCode}`, error);
            return null;
          }
        });

        const details = (await Promise.all(roomDataPromises)).filter(Boolean);
        setRoomDetails(details);
        if (onRoomsFetched) {
          onRoomsFetched(details); 
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };

    fetchRoomDetails();
  }, [apiUrl]);

  const handleRoomClick = (eventCode) => {
    navigate(`/event-room/${eventCode}`);
  };

  return (
    <Box
      sx={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" color="primary" gutterBottom>
        Recent logins
      </Typography>
      {roomDetails.length > 0 ? (
        <List>
          {roomDetails.map((room, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleRoomClick(room.eventCode)}
              sx={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: '#f9f9f9',
                '&:hover': {
                    backgroundColor: '#e0f7fa',
                  },
                }}
              >
                <ListItemText
                  primary={room.eventName}
                  secondary={`Code: ${room.eventCode}`}
                  sx={{ textAlign: 'left' }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No recent rooms available.
          </Typography>
        )}
      </Box>
    );
  };
  
  export default Recent_Rooms;
  