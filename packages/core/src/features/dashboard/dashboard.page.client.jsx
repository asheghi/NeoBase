export { render };

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

async function render(pageContext) {
  const { Page } = pageContext;
  const root = createRoot(document.getElementById("react-root"));
  root.render(
    <BrowserRouter>
      <Page {...pageContext.pageProps} />
    </BrowserRouter>
  );
}
