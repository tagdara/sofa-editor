import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import brown from '@material-ui/core/colors/brown';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
        primary: deepOrange,
        secondary: grey, // Indigo is probably a good match with pink
  },
});

const rootElement = document.querySelector('#content');

if (rootElement) {
    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    , rootElement);
}
