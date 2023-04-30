import React, { useEffect } from "react";
import { PageContextProvider } from "../lib/pageContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../lib/theme";
import { client, ClientProvider } from "../lib/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

export const App = () => {
    const router = createBrowserRouter(routes)
    useEffect(() => {
        client.Auth.me().catch(() => {
            location.href = '/login';
        })
    }, [])
    return (
        <PageContextProvider >
            <ClientProvider>
                <CssBaseline />
                <ThemeProvider theme={theme}>
                    <RouterProvider router={router} />
                </ThemeProvider>
            </ClientProvider>
        </PageContextProvider>
    );
}
