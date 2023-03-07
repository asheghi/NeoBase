import express from "express";
import { packageInfo } from "lib/package-info";
import { config } from "config";
import { CollectionsApiRouter } from "./collections/collections.router";
import { DocumentsApiRouter } from "./documents/documents.router";
import slowdown from "./slow-downs.middleware";
import { UsersApiRouter } from "./projects/users.router";
import { AuthApiRouter } from "../features/auth";

const { CommonSlowDown } = slowdown;

const app = express.Router();

if (config.simulate_slow_network) {
  app.use((req, res, next) => {
    setTimeout(next, Math.round(Math.random() * 1500) + 500);
  });
}

app.use("/collections", CommonSlowDown, CollectionsApiRouter);
app.use("/documents", DocumentsApiRouter);
app.use("/auth", CommonSlowDown, AuthApiRouter);
app.use("/users", CommonSlowDown, UsersApiRouter);

app.get("/", CommonSlowDown, (req, res) => {
  res.json({
    name: packageInfo.name,
    title: packageInfo.title,
    description: packageInfo.description,
    version: packageInfo.version,
  });
});

export const ApiRouter = app;
