import { Typography, Box } from '@mui/material';


const Caption = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        padding: '16px',
        marginTop:'30px'
      }}
    >
      <Typography variant="h1" gutterBottom color="primary">
        Welcome to Capture-It
      </Typography>
      <Typography variant="body1" paragraph color="text.primary">
        Capture your beautiful moments at any event.  be it a wedding, birthday party, or even a family get together.
      </Typography>
      <Typography variant="body1" paragraph color="text.primary">
        Create your own personalized photo album with ease.
      </Typography>
      <Typography variant="body1" paragraph color="text.primary">
        Use your own camera or upload photos from your device.
      </Typography>
      <Typography variant="body1" paragraph color="text.primary">
        Make your memories unforgettable with us!
      </Typography>
    </Box>
  );
};

export default Caption;
