import { createTheme } from '@mui/material';

import { baseTheme } from './base';

export const darkTheme = createTheme({
  ...baseTheme,
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1e1e1e',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 8,
          backgroundColor: '#1d1d1d',
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#eee',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#cccccc',
    },
    primary: {
      main: '#64b5f6',
      dark: '#1e88e5',
    },
    secondary: {
      main: '#81c784',
    },
    buttons: {
      red: {
        main: '#e57373',
        hover: 'rgba(229, 115, 115, 0.2)',
      },
      blue: {
        main: '#64b5f6',
        hover: 'rgba(100, 181, 246, 0.2)',
      },
      green: {
        main: '#81c784',
        hover: 'rgba(129, 199, 132, 0.2)',
      },
      orange: {
        main: '#ffa726',
        hover: 'rgba(255, 167, 38, 0.2)',
      },
    },
  },
});
