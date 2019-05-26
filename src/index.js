import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import SofaThemeProvider from './theme/SofaTheme';

const rootElement = document.querySelector('#root');

if (rootElement) {
    ReactDOM.render(
        <SofaThemeProvider>
            <App />
        </SofaThemeProvider>
    , rootElement);
}
