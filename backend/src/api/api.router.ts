import express from "express";
import { config } from "../config";
import { AccountsRouter } from "./accounts/accounts.router";
import { ProjectAuthRouter } from "./auth/auth.router";
import { CollectionsApiRouter } from "./collections/collections.router";
import { DocumentsApiRouter } from "./documents/documents.router";
import { ProjectsApiRouter } from "./projects/projects.router";
import { ProjectUsersApiRouter } from "./projects/users.router";
import slowdown from "./slow-downs.middleware";

const { CommonSlowDown } = slowdown;

const app = express.Router();

if (config.simulate_slow_network) {
  app.use((req, res, next) => {
    setTimeout(next, Math.round(Math.random() * 1500) + 500);
  });
}

const setProject = (
  req: any,
  _res: express.Response,
  next: express.NextFunction
) => {
  req.project = req.params.project;
  next();
};

app.use("/accounts", CommonSlowDown, AccountsRouter);
app.use("/projects", CommonSlowDown, ProjectsApiRouter);
app.use("/users/:project", CommonSlowDown, setProject, ProjectUsersApiRouter);
app.use(
  "/collections/:project",
  CommonSlowDown,
  setProject,
  CollectionsApiRouter
);
app.use("/documents", DocumentsApiRouter);
app.use("/auth/:project", CommonSlowDown, setProject, ProjectAuthRouter);

app.get("/", CommonSlowDown, (req, res) => {
  res.json({
    name: "NeoBase Api",
    version: "1.0.0",
  });
});

export const ApiRouter = app;
