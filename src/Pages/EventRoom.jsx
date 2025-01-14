import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setRoomData, setLoading, setError , setEventCode} from '../Store/roomSlice';
import { setUserData } from '../Store/userSlice'; // Add this action to manage user data
import { Box, Typography, CircularProgress } from '@mui/material';
import Capture from '../Components/Capture';
import Album from '../Components/Album';

const EventRoom = () => {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomData, loading, error } = useSelector((state) => state.room);
  const { userData } = useSelector((state) => state.user); // Select user data from the store

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
 
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }
    

    const fetchRoomAndUserData = async () => {
      dispatch(setLoading(true));
      try {
        // Fetch room data
        const roomResponse = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
        const roomData = await roomResponse.json();
        

        if (roomResponse.status === 200) {
          dispatch(setRoomData(roomData.room));
          dispatch(setEventCode(eventCode));
        } else {
          dispatch(setError('Room not found'));
        }

        // Fetch user data
        const userResponse = await fetch(`${apiUrl}/user/user-data`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          dispatch(setUserData(userData.user)); // Save user data to the Redux store
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        dispatch(setError('An error occurred while fetching data'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchRoomAndUserData();
  }, [apiUrl, eventCode, navigate, dispatch]);

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
          
        </Box>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No room data available
        </Typography>
      )}

      {userData && (
        <Box sx={{ textAlign: 'center', maxWidth: '600px', width: '100%', marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom >
            Welcome {userData.fullName}
          </Typography>
        </Box>
      )}

      <Box>
      <Capture eventCode={eventCode} />
      </Box>

      <Box>
      <Album eventCode={eventCode} />
      </Box>
    </Box>
  );
};

export default EventRoom;
