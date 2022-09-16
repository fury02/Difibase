import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
  Container,
  createStyles,
  CssBaseline,
  IconButton,
  Link,
  makeStyles,
  Toolbar,
  Typography
} from '@material-ui/core';

// Create a light theme instance.
export const lightTheme = createTheme();

// Create a dark theme instance.
export const darkTheme = createTheme({
  palette: {
    type: 'dark',
  },
});
