import bodyParser from "body-parser";
import Express from "express";
import { getProjectsCollection } from "../../lib/db/connector";
import { getLogger } from "../../lib/debug";
import {
  accountGuard,
  authenticateAccountRequest,
} from "../accounts/accounts.middleware";
import { projectOwnerGuard } from "../common/guards.middleware";

const log = getLogger("projects.api");
const app = Express.Router();

app.use((req, res, next) => {
  next();
  log.debug("is handling request");
});

app.use(authenticateAccountRequest, accountGuard);
app.use(bodyParser.json());

const setProject = (req: any, _res: any, next: Express.NextFunction) => {
  log.debug("setting project");
  req.project = req.params.project;
  next();
};

// return users projects
app.get("/", async (req: any, res: any) => {
  const Projects = await getProjectsCollection();
  res.json(await Projects.find({ user_id: req.user._id }));
});
// create project for current user
app.post("/", async (req: any, res) => {
  const { name } = req.body;
  if (["admin", "config", "main", "local"].includes(name))
    res.status(422).json("project name is taken!");
  const Projects = await getProjectsCollection();
  const exists = await Projects.findOne({ name });
  if (exists)
    return res.status(422).json({ msg: "project name already taken!" });
  return res.json(await Projects.create({ user_id: req.user._id, name }));
});

app.delete("/:project", setProject, projectOwnerGuard, async (req, res) => {
  const Projects = await getProjectsCollection();
  const { project } = req.params;
  res.json(await Projects.deleteOne({ name: project }));
  // todo delete database
});

export const ProjectsApiRouter = app;
