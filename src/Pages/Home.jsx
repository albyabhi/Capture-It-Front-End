import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import for jwt-decode
import Appbar from '../Components/Appbar';
import RoomSetup from '../Components/RoomSetup';
import Recent_Rooms from '../Components/Recent_Rooms';
import { Box, Grid } from '@mui/material';
import Caption from '../Components/Caption';
import AboutSection from '../Components/AboutSection';
import { clearImages } from '../Store/albumSlice';
import { useSelector, useDispatch } from 'react-redux';

const Home = () => {
  const [eventCode, setEventCode] = useState('');
  const [recentRooms, setRecentRooms] = useState([]);
  const images = useSelector((state) => state.album.images);
  const dispatch = useDispatch();
  
  

  useEffect(() => {

    if (images.length > 0) {
      dispatch(clearImages());
    }



    const token = localStorage.getItem('authToken');

   
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Corrected function call
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          console.log('Token has expired');
          localStorage.removeItem('authToken');
        } else {
          console.log('Token is valid');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#EFFFFD',
        padding: '8px',
      }}
    >
      <Appbar />

      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '90%', sm: '80%', md: '70%' },
          padding: { xs: '8px', sm: '16px', md: '24px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: { xs: '90px', sm: '75px', md: '100px', lg: '150px' },
        }}
      >
        <Caption />
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          width: '100%',
          maxWidth: { xs: '90%', sm: '80%', md: '70%' },
          padding: { xs: '8px', sm: '16px', md: '24px' },
          marginTop: { xs: '20px', sm: '15px', md: '20px', lg: '10px' },
        }}
      >
        <Grid item xs={12} sm={6} md={6}>
          <RoomSetup eventCode={eventCode} setEventCode={setEventCode} />
        </Grid>
        
        <Grid item xs={12} sm={6} md={6}>
        <Recent_Rooms  />
        </Grid>
      </Grid>

      <Box>
        <AboutSection />
      </Box>
    </Box>
  );
};

export default Home;
