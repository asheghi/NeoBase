import React from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "../lib/types/vite-ssr.type";
import "./PageShell.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";

export const PageShell = ({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) => (
  <React.StrictMode>
    <PageContextProvider pageContext={pageContext}>
      <CssBaseline />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </PageContextProvider>
  </React.StrictMode>
);
