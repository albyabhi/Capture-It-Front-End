// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';  // Update import to 'react-dom/client'
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#42C2FF', // Primary color (tealbluecoldwinterlightsky)
      light: '#85F4FF', // Lighter shade
      dark: '#42A2FF', // Darker shade (if needed)
      contrastText: '#FFFFFF', // Text color for buttons
    },
    secondary: {
      main: '#B8FFF9', // Secondary color
      light: '#EFFFFD', // Lighter shade
      dark: '#85F4FF', // Darker shade
      contrastText: '#000000', // Text color for contrast
    },
    background: {
      default: '#EFFFFD', // Background color for the app
      paper: '#FFFFFF', // Background for paper elements
    },
    text: {
      primary: '#000000', // Default text color
      secondary: '#42C2FF', // Text with secondary emphasis
    },
  },
  typography: {
    fontFamily: `'Urbanist', 'Arial', 'sans-serif'`, // Set Pacifico as the default font
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#42C2FF',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#85F4FF',
    },
    body1: {
      fontFamily: `'Urbanist', 'Arial', 'sans-serif'`, // Example of using a different font for body text
    },
  },
});

// Create root using ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
