import express from "express";
import { ApisMiddleware } from "../api";
import { morganMiddleware } from "../lib/middleware/morganMiddleware";
import AdminUIRouter from "@neobase/admin-ui";
import { setupPassportOnExpressApp } from "../api/user/auth/setupPassportMiddlewares";
import { corsMiddleware } from "../lib/middleware/corsMiddleware";
import { compressionMiddleware } from "../lib/middleware/compressionMiddleware";

export const getExpressApp = () => {
  const app = express();

  app.use(morganMiddleware);
  app.use(corsMiddleware);
  app.use(compressionMiddleware);

  setupPassportOnExpressApp(app);

  app.use("/api", ApisMiddleware);
  app.use(AdminUIRouter);
  return app;
};
