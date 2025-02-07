export const baseTheme = {
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:first-of-type': {
            paddingTop: 0,
          },
          '&:last-child': {
            borderBottom: 'none',
            paddingBottom: 0,
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          '& a': {
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: 600,
            transition: 'color 0.3s ease',
            '&:hover': {
              color: 'primary.main',
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
};

declare module '@mui/material/styles' {
  interface Palette {
    buttons: {
      red: {
        main: string;
        hover: string;
      };
      blue: {
        main: string;
        hover: string;
      };
      green: {
        main: string;
        hover: string;
      };
      orange: {
        main: string;
        hover: string;
      };
    };
  }
  interface PaletteOptions {
    buttons: {
      red: {
        main: string;
        hover: string;
      };
      blue: {
        main: string;
        hover: string;
      };
      green: {
        main: string;
        hover: string;
      };
      orange: {
        main: string;
        hover: string;
      };
    };
  }
}
