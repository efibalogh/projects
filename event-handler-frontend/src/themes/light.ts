import { createTheme } from '@mui/material';

import { baseTheme } from './base';

export const lightTheme = createTheme({
  ...baseTheme,
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'linear-gradient(135deg, #8e46cf 0%, #6a3094 100%)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 8,
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
    primary: {
      main: '#8e46cf',
      light: '#6a3094',
    },
    secondary: {
      main: '#1976d2',
    },
    buttons: {
      red: {
        main: '#e13c3c',
        hover: '#ffb1bb',
      },
      blue: {
        main: '#1678da',
        hover: '#aae8ff',
      },
      green: {
        main: '#4caf50',
        hover: '#dcedc8',
      },
      orange: {
        main: '#ff8800',
        hover: '#ffd5bb',
      },
    },
  },
});
