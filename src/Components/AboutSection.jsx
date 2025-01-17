import { Typography, Box, Link } from '@mui/material';
import React from 'react';

const AboutSection = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf3ca',
        borderRadius : '25px',
        padding: '40px',
        marginTop: '50px',
         boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Typography variant="h4" gutterBottom color="primary">
        About
      </Typography>
      <Typography variant="h6" gutterBottom color="primary">
        Developer by Alby AB
      </Typography>
      <Typography variant="body1" paragraph color="text.primary">
        This project is a personal initiative made to study the MERN stack (MongoDB, Express, React, Node.js). 
        It showcases my understanding of building full-stack web applications.
      </Typography>
      <Typography variant="body1" paragraph color="text.primary">
        For more information or to get in touch, visit my website:
        <Link href="https://albyabhi.netlify.app/" target="_blank" rel="noopener noreferrer">
          albyabhi.netlify.app
        </Link>
      </Typography>
    </Box>
  );
};

export default AboutSection;
