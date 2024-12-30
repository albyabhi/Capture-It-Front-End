// src/Pages/QrCodeScan.jsx
import React, { useState } from 'react';
import QrReader from 'react-qr-scanner'; // Correct import
import { Container, Typography, Card, CardContent, Button,Box } from '@mui/material';

const QrCodeScan = () => {
  const [qrData, setQrData] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setQrData(data.text);
      console.log('Scanned QR Code:', data.text);
      // You can handle what happens after a QR code is scanned here
    }
  };

  const handleError = (err) => {
    console.error('QR Scan Error:', err);
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Scan QR Code
      </Typography>
      
      <Box
        sx={{
          padding: '30px',
          border: '3px dashed #ccc',
          borderRadius: '15px',
          display: 'inline-block', // Ensures the box fits snugly around the content
          margin: '30px auto', // Centers the box horizontally
        }}
      >
        <QrReader
          delay={300}
          style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}
          onError={handleError}
          onScan={handleScan}
        />
      </Box>
      
      
      {qrData && (
        <Card sx={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h6">Scanned QR Code:</Typography>
            <Typography variant="body1" sx={{ marginTop: '10px' }}>
              {qrData}
            </Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: '20px' }} onClick={() => window.location.href = qrData}>
              Enter Room
            </Button>

          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default QrCodeScan;
