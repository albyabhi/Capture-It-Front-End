import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import logo from '../assets/capture-it-logo.png';
import { useNavigate } from 'react-router-dom';

const Appbar = () => {
  const navigate = useNavigate();

  const handleHomeNav = () => {
    navigate('/');
    
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
      }}
    >
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: {
                xs: '200px',
                sm: '250px',
                md: '350px',
                lg: '400px',
              },
              height: 'auto',
              cursor: 'pointer',
            }}
            onClick={handleHomeNav} 
          >
            <img
              src={logo}
              alt="Capture It Logo"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </Box>
        </Box>
      </Toolbar>
    </Box>
  );
};

export default Appbar;
