import { createTheme } from '@mui/material';

import { baseTheme } from './base';

export const colorTheme = createTheme({
  ...baseTheme,
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'linear-gradient(135deg, #7f3593 0%, #4f93d7 100%)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 8,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(108, 99, 255, 0.1)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#2c3e50',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(106, 193, 255, 0.1) 0%, rgba(255, 101, 212, 0.1) 100%)',
          },
        },
      },
    },
  },
  palette: {
    mode: 'light',
    background: {
      default: '#f0f7ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#555555',
    },
    primary: {
      main: '#7f3593',
      light: '#4f93d7',
    },
    secondary: {
      main: '#4facfe',
    },
    buttons: {
      red: {
        main: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
        hover: 'brightness(110%)',
      },
      blue: {
        main: 'linear-gradient(135deg, #6ac1ff 0%, #4facfe 100%)',
        hover: 'brightness(110%)',
      },
      green: {
        main: 'linear-gradient(135deg, #66bb6a 0%, #81c784 100%)',
        hover: 'brightness(110%)',
      },
      orange: {
        main: 'linear-gradient(135deg, #ffa726 0%, #ff9757 100%)',
        hover: 'brightness(110%)',
      },
    },
  },
});
