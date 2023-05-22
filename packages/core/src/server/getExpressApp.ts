import express from "express";
import { ApisMiddleware } from "../api";
import { morganMiddleware } from "./middleware/morganMiddleware";
import AdminUIRouter from "@neobase/admin-ui";
import { setupPassport } from "./passport";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { compressionMiddleware } from "./middleware/compressionMiddleware";
import { io } from "./ioServer";
import { setupCollectionWatch } from "../api/data/collections/watch";
import { ExpressErrorHandler } from "./middleware/ErrorHandler";

export const getExpressApp = () => {
  const app = express();

  app.use(morganMiddleware);
  app.use(corsMiddleware);
  app.use(compressionMiddleware);

  setupPassport(app, io);

  app.use("/api", ApisMiddleware);
  app.use(AdminUIRouter);

  setupCollectionWatch();

  app.use(ExpressErrorHandler);
  return app;
};
