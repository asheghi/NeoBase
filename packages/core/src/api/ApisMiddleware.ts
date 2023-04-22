import express from "express";

import { manifest } from "../lib/manifest";
import { config } from "../lib/config";
import { DataApiRouter } from "./data";
import { UserApiRouter } from "./user";
const app = express.Router();

if (config.simulate_slow_network) {
  app.use((req, res, next) => {
    setTimeout(next, Math.round(Math.random() * 1500) + 500);
  });
}

app.use("/user", UserApiRouter);
app.use("/data", DataApiRouter);

app.get("/", (req, res) => {
  res.json({
    name: manifest.name,
    title: manifest.title,
    description: manifest.description,
    version: manifest.version,
  });
});

export const ApisMiddleware = app;
