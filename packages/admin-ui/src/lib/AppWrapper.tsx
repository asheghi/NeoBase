import React from "react";
import {PageContextProvider} from "./pageContext";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {theme} from "./theme";

export const AppWrapper = (props : {children:React.ReactNode}) => {
    return <PageContextProvider >
        <CssBaseline />
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </PageContextProvider>
}
