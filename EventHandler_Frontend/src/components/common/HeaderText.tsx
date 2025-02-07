import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '1px',
    background: theme.palette.divider,
  },
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  '@media (max-width: 600px)': {
    fontSize: '1.5rem',
  },
}));

type HeaderTextProps = {
  message: string | ReactNode;
  button?: string;
  buttonLink?: string;
};

function HeaderText({ message, button = undefined, buttonLink = undefined }: HeaderTextProps) {
  return (
    <HeaderContainer>
      <HeaderTitle variant="h4">{message}</HeaderTitle>
      {button && buttonLink && (
        <Button
          component={Link}
          to={buttonLink}
          size="large"
          sx={(theme) => {
            const isColorTheme = theme.palette.primary.main === '#7f3593';
            return {
              color: isColorTheme ? '#ffffff' : theme.palette.buttons.green.main,
              background: isColorTheme ? theme.palette.buttons.green.main : 'transparent',
              '&:hover': {
                background: isColorTheme ? theme.palette.buttons.green.main : 'transparent',
                filter: isColorTheme ? theme.palette.buttons.green.hover : 'none',
                backgroundColor: !isColorTheme ? theme.palette.buttons.green.hover : 'transparent',
              },
            };
          }}
        >
          {button}
        </Button>
      )}
    </HeaderContainer>
  );
}

export default HeaderText;
