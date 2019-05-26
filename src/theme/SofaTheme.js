import React, {  PureComponent, Component, useState, useEffect } from 'react';

import lightTheme from './sofaThemeLight';
import darkTheme from './sofaThemeDark';

import { ThemeProvider, makeStyles } from '@material-ui/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

export const ThemeContext = React.createContext();

export default function SofaThemeProvider(props) {
    
    const [colorScheme, setColorScheme] = useState('');
    const [sofaTheme, setSofaTheme] = useState({});

    useEffect(() => {
        applyTheme()
    }, []);
    
    function getTheme() {
        if (sofaTheme.hasOwnProperty('palette')) { 
            return sofaTheme 
        }
        var d = new Date();
        var n = d.getHours();
        if (n>17 || n<8) {
            return darkTheme
        } else {
            return lightTheme
        }
    }

    function applyTheme(themeName) {
        
        if (themeName=='dark') {
            setColorScheme('dark')
            setSofaTheme(darkTheme)
            return darkTheme
        } else if (themeName=='light') {
            setColorScheme('light')
            setSofaTheme(lightTheme)
            return lightTheme
        }
        
        return getTheme()

    }

    return (
        <ThemeContext.Provider
            value={{
                colorScheme: colorScheme,
                sofaTheme: sofaTheme,
                applyTheme: applyTheme,
                getTheme: getTheme,
            }}
        >
            <ThemeProvider theme={getTheme(colorScheme)}>
                <CssBaseline />
                { props.children }
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export function withThemeChange(Component) {
    
    return function ThemeComponent(props) {
        return (
            <ThemeContext.Consumer>
                { context => <Component {...props} {...context} context={context} 
                                colorScheme={context.colorScheme} sofaTheme={context.sofaTheme}
                                applyTheme={context.applyTheme} getTheme={context.getTheme}
                            /> }
            </ThemeContext.Consumer>
        );
    };
}

