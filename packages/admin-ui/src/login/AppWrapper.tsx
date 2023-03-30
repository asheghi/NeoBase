import React from "react";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {theme} from "../lib/theme";
import {createBrowserRouter} from "react-router-dom";
import {routes} from "../dashboard/routes";
import { PageContextProvider } from "../lib/pageContext";
import { ClientProvider } from "../lib/client";

export const AppWrapper = (props : {children:React.ReactNode}) => {
    const router = createBrowserRouter(routes)
    return (
    <PageContextProvider >
        <ClientProvider>
            <CssBaseline />
            <ThemeProvider theme={theme}>
                {props.children}
            </ThemeProvider>
        </ClientProvider>
    </PageContextProvider>
            );
}
