import React, { useState } from 'react';
import Appbar from '../Components/Appbar';
import RoomSetup from '../Components/RoomSetup';  // Import RoomSetup component
import Recent_Rooms from '../Components/Recent_Rooms';

import { Box, Grid } from '@mui/material'; // Import Grid from MUI
import Caption from '../Components/Caption';
import AboutSection from '../Components/AboutSection';

const Home = () => {
  const [eventCode, setEventCode] = useState('');

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

      {/* Use Grid for responsive layout */}
      <Grid
        container
        spacing={2}  // Adjust spacing between items
        sx={{
          width: '100%',
          maxWidth: { xs: '90%', sm: '80%', md: '70%' },
          padding: { xs: '8px', sm: '16px', md: '24px' },
          marginTop: { xs: '20px', sm: '15px', md: '20px' ,lg: '10px' },
        }}
      >
        <Grid item xs={12} sm={6} md={6}> {/* RoomSetup in first half */}
          <RoomSetup eventCode={eventCode} setEventCode={setEventCode} />
        </Grid>
        <Grid item xs={12} sm={6} md={6}> {/* Recent_Rooms in second half */}
          <Recent_Rooms />
        </Grid>
      </Grid>

      <Box>
        <AboutSection />
      </Box>

    </Box>
  );
};

export default Home;
