import React from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "./types";
import "./PageShell.css";

export const PageShell = ({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) => (
  <React.StrictMode>
    <PageContextProvider pageContext={pageContext}>
      {children}
    </PageContextProvider>
  </React.StrictMode>
);
