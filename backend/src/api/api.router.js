import Express from "express";
import { config } from "../config/index.js";
import { CollectionsApiRouter } from "./collections/collections.router.js";
import { AccountsRouter } from "./accounts/accounts.router.js";
import { ProjectsApiRouter } from "./projects/projects.router.js";
import { ProjectAuthRouter } from "./auth/auth.router.js";
import { DocumentsApiRouter } from "./documents/documents.router.js";
import { ProjectUsersApiRouter } from "./projects/users.router.js";

const app = Express.Router();

// simulate slow network on dev mode
if (config.simulate_slow_network) {
  app.use((req, res, next) => {
    setTimeout(next, +config.simulate_slow_network || 1500);
  });
}

const setProject = (req, res, next) => {
  req.project = req.params.project;
  next();
};

app.use("/accounts", AccountsRouter);
app.use("/projects", ProjectsApiRouter);
app.use("/users/:project", setProject, ProjectUsersApiRouter);
app.use("/collections/:project", setProject, CollectionsApiRouter);
app.use("/documents", DocumentsApiRouter);
app.use("/auth/:project", setProject, ProjectAuthRouter);

app.get("/", (req, res) => {
  res.json({
    name: "FireStore Api",
    version: "1.0.0",
  });
});

export const ApiRouter = app;
