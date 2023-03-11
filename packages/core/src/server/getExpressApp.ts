import express from "express";
import compression from "compression";
import cors from "cors";
import { getViteSsrMiddleware, viteSsrRequestHandler } from "../lib/vite-ssr";
import { getApisMiddleware } from "./getApisMiddleware";
import { setupPassportOnExpressApp } from "../features/user/apis/auth/setupPassportMiddlewares";
import { corsMiddleware } from "../lib/corsMiddleware";
import { morganMiddleware } from "../lib/middleware/morganMiddleware";

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
