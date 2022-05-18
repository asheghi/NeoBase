import Express from "express";
import {config} from "../config/index.js";
import {CollectionsApiRouter} from "./collections/collections.api.js";
import cors from 'cors'
import {AccountsRouter} from "./accounts/accounts.router.js";
import {ProjectsApiRouter} from "./projects/projects.api.js";
import {ProjectAuthRouter} from "./auth/auth.router.js";

const app = Express.Router();

// simulate slow network on dev mode
if (config.simulate_slow_network) {
  app.use((req, res, next) => {
    setTimeout(next, +config.simulate_slow_network || 1500);
  });
}

app.use(cors());

app.use('/store', CollectionsApiRouter);
app.use('/projects', ProjectsApiRouter);
app.use('/accounts', AccountsRouter);
app.use('/auth/:project',ProjectAuthRouter);

app.use('/', (req, res) => {
  res.json({
    name:"FireStore Api",
    version:"1.0.0",
  })
})

export const ApiRouter = app;
