import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr";
import icon from "../public/favicon.ico";
import safariPinned from "../public/safari-pinned-tab.svg";
import webmanifest from "../public/site.webmanifest";
import favIcon16 from "../public/favicon-16x16.png";
import favIcon32 from "../public/favicon-32x32.png";
import appleTouchIcon from "../public/apple-touch-icon.png";

import type { PageContextServer } from "../lib/types/vite-ssr.type";
import { manifest } from "../lib/manifest";

export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "urlPathname", "user"];

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports;
  const title = (documentProps && documentProps.title) || manifest.title;
  const desc =
    (documentProps && documentProps.description) || manifest.description;

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        <link rel="apple-touch-icon" sizes="180x180" href="${appleTouchIcon}">
        <link rel="icon" type="image/png" sizes="32x32" href="${favIcon32}">
        <link rel="icon" type="image/png" sizes="16x16" href="${favIcon16}">
        <link rel="manifest" href="${webmanifest}">
        <link rel="mask-icon" href="${safariPinned}" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">
        <link rel="icon" href="${icon}"/>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
