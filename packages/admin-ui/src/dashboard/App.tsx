import React, { useEffect } from "react";
import { PageContextProvider } from "../lib/pageContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../lib/theme";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { useAuth } from "@neobase/client/react";

export const App = () => {
    const router = createBrowserRouter(routes)
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            window.location.href = '/login/';
        }
    })

    if (loading) {
        return <div>Loading ...</div>
    }
    if (!user) {
        return <div>
            You must login to be able to access dashboard.
            <br />
            Redirecting to Login...
        </div>
    }

    if (user.role !== 'admin') {
        return <div>
            you don't have permission to access this page.
        </div>
    }

    return (
        <PageContextProvider >
            <CssBaseline />
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </PageContextProvider>
    );
}
