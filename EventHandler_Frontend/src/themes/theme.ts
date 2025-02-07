import { colorTheme } from './color';
import { darkTheme } from './dark';
import { lightTheme } from './light';

export const themeOptions = {
  light: {
    theme: lightTheme,
  },
  dark: {
    theme: darkTheme,
  },
  color: {
    theme: colorTheme,
  },
} as const;

export type ThemeKey = keyof typeof themeOptions;
