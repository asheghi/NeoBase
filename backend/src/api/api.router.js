import Express from "express";
import {config} from "../config/index.js";
import {CollectionsApiRouter} from "./collections/collections.api.js";
import cors from 'cors'
import {AuthRouter} from "./auth/auth.router.js";
import {ProjectsApiRouter} from "./projects/projects.api.js";

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
app.use('/auth', AuthRouter);

app.use('/', (req, res) => {
  res.send('api base url')
})

export const ApiRouter = app;
