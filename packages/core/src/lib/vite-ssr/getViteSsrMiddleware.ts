import { root } from "../root.js";
import { isProduction } from "../isProduction.js";

export const getViteSsrMiddleware = async () => {
  if (isProduction) {
    const sirv = (await import("sirv")).default;
    return sirv(`${root}/dist/client`);
  } else {
    const vite = await import("vite");
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares;
    return viteDevMiddleware;
  }
};
