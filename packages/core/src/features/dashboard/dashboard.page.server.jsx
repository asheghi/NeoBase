import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr";
import appleTouchIcon from "../../../public/apple-touch-icon.png";
import favIcon32 from "../../../public/favicon-32x32.png";
import favIcon16 from "../../../public/favicon-16x16.png";
import webmanifest from "../../../public/site.webmanifest";
import safariPinned from "../../../public/safari-pinned-tab.svg";
import icon from "../../../public/favicon.ico";
import { manifest } from "../../../lib/manifest.js";

export { render };
export { passToClient };

const passToClient = ["pageProps"];

async function render(pageContext) {
  const { Page, pageProps, urlPathname } = pageContext;

  const pageHtml = renderToString(
    <StaticRouter location={urlPathname}>
      <Page {...pageProps} />
    </StaticRouter>
  );
  const { documentProps } = pageContext.exports;
  const title = (documentProps && documentProps.title) || manifest.title;
  const desc =
    (documentProps && documentProps.description) || manifest.description;

  return escapeInject`<!DOCTYPE html>
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}
