import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import DataProvider from './Theme/DataProvider';
import ThemeWrapper from './Theme/ThemeWrapper';


const rootElement = document.querySelector('#content');

if (rootElement) {
    ReactDOM.render(
        <DataProvider>
            <ThemeWrapper>
                <App />
            </ThemeWrapper>
        </DataProvider>
    , rootElement);
}
