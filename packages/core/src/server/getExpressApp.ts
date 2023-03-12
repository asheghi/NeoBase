import express from "express";
import compression from "compression";
import {
  getViteSsrMiddleware,
  viteSsrRequestHandler,
} from "../lib/vite-ssr/index.js";
import { getApisMiddleware } from "./getApisMiddleware.js";
import { setupPassportOnExpressApp } from "../features/user/apis/auth/setupPassportMiddlewares.js";
import { corsMiddleware } from "../lib/corsMiddleware.js";
import { morganMiddleware } from "../lib/middleware/morganMiddleware.js";

export const getExpressApp = async () => {
  const app = express();

  app.use(morganMiddleware);
  app.use(corsMiddleware);

  app.use(compression());
  await setupPassportOnExpressApp(app);
  app.use("/api", await getApisMiddleware());
  app.use(await getViteSsrMiddleware());
  app.get("*", viteSsrRequestHandler);
  return app;
};
