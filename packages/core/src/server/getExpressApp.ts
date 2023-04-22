import express from "express";
import compression from "compression";
import { ApisMiddleware } from "../api";
import { corsMiddleware } from "../lib/middleware/corsMiddleware";
import { morganMiddleware } from "../lib/middleware/morganMiddleware";
import AdminUIRouter from "@neobase/admin-ui";
import { setupPassportOnExpressApp } from "../api/user/auth/setupPassportMiddlewares";
export const getExpressApp = () => {
  const app = express();

  app.use(morganMiddleware);
  app.use(corsMiddleware);

  app.use(compression());
  setupPassportOnExpressApp(app);
  app.use("/api", ApisMiddleware);
  app.use(AdminUIRouter);
  return app;
};
