import Express from "express";
import {config} from "../config/index.js";
import {CollectionsApiRouter} from "./collections/collections.router.js";
import cors from 'cors'
import {AccountsRouter} from "./accounts/accounts.router.js";
import {ProjectsApiRouter} from "./projects/projects.router.js";
import {ProjectAuthRouter} from "./auth/auth.router.js";
import {DocumentsApiRouter} from "./documents/documents.router.js";
import {getCollection} from "../lib/db/connector.js";

const app = Express.Router();

// simulate slow network on dev mode
if (config.simulate_slow_network) {
  app.use((req, res, next) => {
    setTimeout(next, +config.simulate_slow_network || 1500);
  });
}

app.use(cors());

app.use('/accounts', AccountsRouter);
app.use('/projects', ProjectsApiRouter);
app.use('/collections/:project',
  (req, res, next) => {
    req.project = req.params.project;
    next();
  },
  CollectionsApiRouter)

app.use('/documents/:project/:collection',
  async (req, res, next) => {
    const {project, collection} = req.params;
    req.project = project;
    req.collection_name = collection;
    req.Collection = await getCollection(project, collection);
    next()
  },
  DocumentsApiRouter);
app.use('/auth/:project', (req, res, next) => {
    req.project = req.params.project;
    next();
  },
  ProjectAuthRouter
)
;

app.get('/', (req, res) => {
  res.json({
    name: "FireStore Api",
    version: "1.0.0",
  })
})

export const ApiRouter = app;
