import Express from "express";
import { config } from "../config/index.js";
import { CollectionsApiRouter } from "./collections/collections.router.js";
import { AccountsRouter } from "./accounts/accounts.router.js";
import { ProjectsApiRouter } from "./projects/projects.router.js";
import { ProjectAuthRouter } from "./auth/auth.router.js";
import { DocumentsApiRouter } from "./documents/documents.router.js";
import { ProjectUsersApiRouter } from "./projects/users.router.js";
import { CommonSlowDown } from "./slow-downs.middleware.js";

const app = Express.Router();

if (config.simulate_slow_network) {
  app.use((req, res, next) => {
    setTimeout(next, Math.round(Math.random() * 1500) + 500);
  });
}

const setProject = (req, res, next) => {
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

app.get("/", (req, res) => {
  res.json({
    name: "NeoBase Api",
    version: "1.0.0",
  });
});

export const ApiRouter = app;
