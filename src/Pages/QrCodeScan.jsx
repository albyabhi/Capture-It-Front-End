// src/Pages/QrCodeScan.jsx
import { useState, useEffect, useRef } from 'react';
import { Container, Typography, Card, CardContent, Button, Box } from '@mui/material';
import { BrowserMultiFormatReader } from '@zxing/library';

const QrCodeScan = () => {
  const [qrData, setQrData] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
      if (result) {
        setQrData(result.getText());
        console.log('Scanned QR Code:', result.getText());
      }
      if (error) {
        console.warn('QR Scan Error:', error.message);
      }
    });

    return () => {
      codeReader.reset();
    };
  }, []);

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
          display: 'inline-block',
          margin: '30px auto',
        }}
      >
        <video
          ref={videoRef}
          style={{
            width: '100%',
            maxWidth: '400px',
            borderRadius: '10px',
          }}
        />
      </Box>

      {qrData && (
        <Card sx={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h6">Scanned QR Code:</Typography>
            <Typography variant="body1" sx={{ marginTop: '10px' }}>
              {qrData}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: '20px' }}
              onClick={() => (window.location.href = qrData)}
            >
              Enter Room
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default QrCodeScan;
