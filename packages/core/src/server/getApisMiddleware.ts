import express from "express";
import {
  AuthApiRouter,
  ManageUsersApiRouter,
} from "../features/user/apis/auth/index.js";
import { manifest } from "../lib/manifest.js";
import { config } from "../lib/config/index.js";
import { DataApiRouter } from "../features/data/index.js";
export const getApisMiddleware = async () => {
  const app = express.Router();

  if (config.simulate_slow_network) {
    app.use((req, res, next) => {
      setTimeout(next, Math.round(Math.random() * 1500) + 500);
    });
  }

  app.use("/user/auth", AuthApiRouter);
  app.use("/user/manage", ManageUsersApiRouter);
  app.use("/data", DataApiRouter);

  app.get("/", (req, res) => {
    res.json({
      name: manifest.name,
      title: manifest.title,
      description: manifest.description,
      version: manifest.version,
    });
  });

  return app;
};
