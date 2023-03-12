import React from "react";
import { hydrateRoot } from "react-dom/client";
import { PageShell } from "./PageShell.js";
import type { PageContextClient } from "../lib/types/vite-ssr.type";
import { ThemeProvider } from "@mui/material";

export { render };

async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;
  hydrateRoot(
    document.getElementById("page-view")!,
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );
}

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
