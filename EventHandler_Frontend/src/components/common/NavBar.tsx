import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AppBar, Box, Button, Container, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Home from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { People } from '@mui/icons-material';
import LanguageIcon from '@mui/icons-material/Language';
import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium';
import Logout from '@mui/icons-material/Logout';

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeKey } from '../../themes/theme';

const NavBrand = styled(Typography)<{ component?: React.ElementType; to?: string }>(() => ({
  margin: 'auto 12px',
  textDecoration: 'none',
  textTransform: 'capitalize',
  color: '#ffffff',
  fontWeight: 700,
  letterSpacing: '.02rem',
}));

const NavButton = styled(Button)<{ component?: React.ElementType; to?: string }>(() => ({
  color: '#ffffff',
  background: 'transparent',
  transition: 'all 0.3s ease',
  fontSize: '1rem',
  fontWeight: 600,
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
  },

  '@media (max-width: 1040px)': {
    fontSize: '0.9rem',
  },
}));

const NavMenu = styled(Box)(() => ({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  marginLeft: 'auto',
  flexWrap: 'nowrap',
}));

function NavBar() {
  const { t } = useTranslation();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const [themeAnchor, setThemeAnchor] = useState<null | HTMLElement>(null);
  const { currentTheme, setTheme } = useTheme();
  const { changeLanguage, isUpdating: langUpdating } = useLanguage();

  const isAdmin = user?.role === 'ADMIN';

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchor(languageAnchor ? null : event.currentTarget);
    if (themeAnchor) setThemeAnchor(null);
  };

  const handleThemeClick = (event: React.MouseEvent<HTMLElement>) => {
    setThemeAnchor(themeAnchor ? null : event.currentTarget);
    if (languageAnchor) setLanguageAnchor(null);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleThemeClose = () => {
    setThemeAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleThemeChange = (theme: ThemeKey) => {
    setTheme(theme);
    handleThemeClose();
  };

  const handleLanguageChange = async (language: string) => {
    if (langUpdating) return;
    try {
      await changeLanguage(language);
      handleLanguageClose();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 3 }}>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <NavBrand variant="h5" component={Link} to="/">
              {isAuthenticated && user ? t('common.greeting', { username: user.username }) : 'EventHandler'}
            </NavBrand>

            <NavMenu>
              {isAuthenticated ? (
                <>
                  <NavButton component={Link} to="/events" startIcon={<Home />}>
                    {t('common.home')}
                  </NavButton>
                  <NavButton component={Link} to="/profile" startIcon={<AccountCircleIcon />}>
                    {t('common.profile')}
                  </NavButton>
                  {isAdmin && (
                    <NavButton component={Link} to="/users" startIcon={<People />}>
                      {t('common.users')}
                    </NavButton>
                  )}
                </>
              ) : null}
              <Box>
                <NavButton
                  disabled={langUpdating}
                  startIcon={<LanguageIcon />}
                  onClick={handleLanguageClick}
                  aria-controls={languageAnchor ? 'language-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={languageAnchor ? 'true' : undefined}
                >
                  {t('common.language')}
                </NavButton>
                <Menu
                  id="language-menu"
                  anchorEl={languageAnchor}
                  open={Boolean(languageAnchor)}
                  onClose={handleLanguageClose}
                >
                  <MenuItem onClick={() => handleLanguageChange('en')}>{t('language.en')}</MenuItem>
                  <MenuItem onClick={() => handleLanguageChange('hu')}>{t('language.hu')}</MenuItem>
                  <MenuItem onClick={() => handleLanguageChange('ro')}>{t('language.ro')}</MenuItem>
                </Menu>
              </Box>
              <Box>
                <NavButton
                  startIcon={<BrightnessMediumIcon />}
                  onClick={handleThemeClick}
                  aria-controls={themeAnchor ? 'theme-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={themeAnchor ? 'true' : undefined}
                >
                  {t('common.theme')}
                </NavButton>
                <Menu id="theme-menu" anchorEl={themeAnchor} open={Boolean(themeAnchor)} onClose={handleThemeClose}>
                  <MenuItem onClick={() => handleThemeChange('light')} selected={currentTheme === 'light'}>
                    {t('theme.light')}
                  </MenuItem>
                  <MenuItem onClick={() => handleThemeChange('dark')} selected={currentTheme === 'dark'}>
                    {t('theme.dark')}
                  </MenuItem>
                  <MenuItem onClick={() => handleThemeChange('color')} selected={currentTheme === 'color'}>
                    {t('theme.color')}
                  </MenuItem>
                </Menu>
              </Box>
              {isAuthenticated && (
                <NavButton onClick={handleLogout} startIcon={<Logout />}>
                  {t('common.logout')}
                </NavButton>
              )}
            </NavMenu>
          </Toolbar>
        </Container>
      </AppBar>
    </Container>
  );
}

export default NavBar;
