import { Typography, Box } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

const Caption = () => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(-610px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 200, friction: 30 },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        padding: '16px',
        marginTop: '30px',
      }}
    >
      <animated.div style={fadeIn}>
        <Typography variant="h1" gutterBottom color="primary">
          Welcome to Capture-It
        </Typography>
      </animated.div>

      <animated.div style={fadeIn}>
        <Typography variant="body1" paragraph color="text.primary">
          Capture your beautiful moments at any event. Be it a wedding, birthday party, or even a family get-together.
        </Typography>
      </animated.div>

      <animated.div style={fadeIn}>
        <Typography variant="body1" paragraph color="text.primary">
          Create your own personalized photo album with ease.
        </Typography>
      </animated.div>

      <animated.div style={fadeIn}>
        <Typography variant="body1" paragraph color="text.primary">
          Use your own camera or upload photos from your device.
        </Typography>
      </animated.div>

      <animated.div style={fadeIn}>
        <Typography variant="body1" paragraph color="text.primary">
          Make your memories unforgettable with us!
        </Typography>
      </animated.div>
    </Box>
  );
};

export default Caption;
