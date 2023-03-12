import React from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "../lib/types/vite-ssr.type";
import "./PageShell.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { colors } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: colors.red["400"],
    },
  },
});

export const PageShell = ({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) => (
  <React.StrictMode>
    <PageContextProvider pageContext={pageContext}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </PageContextProvider>
  </React.StrictMode>
);
