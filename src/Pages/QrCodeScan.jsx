import { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Typography, Card, CardContent, Button, Box } from '@mui/material';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useNavigate } from 'react-router-dom';
import Appbar from '../Components/Appbar';

const QrCodeScan = () => {
  const [qrData, setQrData] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const handleRoomEnter = useCallback(() => {
    const token = localStorage.getItem("authToken");
    const recentRooms = JSON.parse(localStorage.getItem('recent-rooms')) || [];
    
    if (!recentRooms.includes(qrData)) {
      recentRooms.push(qrData);
      localStorage.setItem('recent-rooms', JSON.stringify(recentRooms));
    }

    if (!token) {
      navigate(`/user/${qrData}`);
    } else {
      navigate(`/event-room/${qrData}`);
    }
  }, [qrData, navigate]);

  useEffect(() => {
    if (qrData) {
      handleRoomEnter(); // Execute when qrData changes
    }
  }, [qrData, handleRoomEnter]); // Dependency on qrData

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let isMounted = true;

    codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
      if (result && isMounted) {
        setQrData(result.getText());
        console.log('Scanned QR Code:', result.getText());
      } else if (error && error.name !== 'NotFoundException') {
        console.warn('QR Scan Error:', error.message);
      }
    });

    return () => {
      isMounted = false;
      codeReader.reset();
    };
  }, []);

  return (
    <box>
      <box>
        <Appbar />
      </box>
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
          </CardContent>
        </Card>
      )}
    </Container>
    </box>
  );
};

export default QrCodeScan;
