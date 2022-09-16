import React from "react";
import './App.css';

//material-ui (using CssBaseline)
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
import { darkTheme, lightTheme } from './theme-material-ui';
// let thisTheme = lightTheme;
let thisTheme = darkTheme;

function App() {

    // return (
    //     <ThemeProvider theme={thisTheme}>
    //         <CssBaseline />
    //     </ThemeProvider>
    // );

    return (
        <div className="App">
            <CssBaseline />
        </div>
    );
}

export default App;
