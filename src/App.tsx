import React from 'react';
import './App.css';
import Home from "./Home";
import {createTheme, CssBaseline, ThemeProvider, useMediaQuery} from "@mui/material";
import {ColorModeContext} from "./context";
import {themeMode} from "./enums";
import {LocalThemeKey} from "./const";

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const [mode, setMode] = React.useState<themeMode>(prefersDarkMode ? themeMode.DARK : themeMode.LIGHT);
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    let newTheme = prevMode === themeMode.DARK ? themeMode.LIGHT : themeMode.DARK
                    localStorage.setItem(LocalThemeKey,newTheme)
                    return newTheme
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