import express from "express";
import { ApisMiddleware } from "../api";
import { morganMiddleware } from "../lib/middleware/morganMiddleware";
import AdminUIRouter from "@neobase/admin-ui";
import { setupPassport } from "./passport";
import { corsMiddleware } from "../lib/middleware/corsMiddleware";
import { compressionMiddleware } from "../lib/middleware/compressionMiddleware";
import { io } from "./ioServer";
import { setupCollectionWatch } from "../api/data/collections/watch";

export const getExpressApp = () => {
  const app = express();

  app.use(morganMiddleware);
  app.use(corsMiddleware);
  app.use(compressionMiddleware);

  setupPassport(app, io);

  app.use("/api", ApisMiddleware);
  app.use(AdminUIRouter);

  setupCollectionWatch();

  return app;
};
