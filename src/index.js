import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import brown from '@material-ui/core/colors/brown';
import grey from '@material-ui/core/colors/grey';
import yellow from '@material-ui/core/colors/yellow';

const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
        primary: deepOrange,
        secondary: yellow,
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
