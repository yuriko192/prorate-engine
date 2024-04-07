import React from 'react';
import './App.css';
import Home from "./Home";
import {createTheme, CssBaseline, ThemeProvider, useMediaQuery} from "@mui/material";
import {ColorModeContext} from "./context";
import {themeMode} from "./enums";
import {LocalThemeKey} from "./const";

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const preferedTheme = prefersDarkMode ? themeMode.DARK : themeMode.LIGHT
    let localTheme = localStorage.getItem(LocalThemeKey) as themeMode

    localTheme = (localTheme ?? preferedTheme)
    if (!Object.values(themeMode).includes(localTheme)) {
        localTheme = preferedTheme
        localStorage.setItem(LocalThemeKey, preferedTheme)
    }
    document.documentElement.classList[localTheme == themeMode.DARK ? 'add' : 'remove']('dark');

    const [mode, setMode] = React.useState<themeMode>(localTheme);
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    localTheme = prevMode === themeMode.DARK ? themeMode.LIGHT : themeMode.DARK
                    document.documentElement.classList[localTheme == themeMode.DARK ? 'add' : 'remove']('dark');
                    localStorage.setItem(LocalThemeKey, localTheme)
                    return localTheme
                });
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Home/>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default App;