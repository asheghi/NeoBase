import Express from 'express'
import bodyParser from "body-parser";
import {getProjectsCollection} from "../../lib/db/connector.js";
import {authenticateAccountRequest, accountGuard} from "../accounts/accounts.middleware.js";
import {getDebug} from "../../lib/debug.js";
const log = getDebug('projects.api')
const app = Express.Router();

app.use((req, res, next) => {
  next();
  log.debug('is handling request')
});


app.use(authenticateAccountRequest, accountGuard);
app.use(bodyParser.json());

//return users projects
app.get('/', async (req, res) => {
  const Projects = await getProjectsCollection();
  res.json(await Projects.find({user_id: req.user._id}))
})
//create project for current user
app.post('/', async (req, res) => {
  const {name} = req.body;
  if (['admin','config','main','local'].includes(name))res.status(422).json('project name is taken!')
  const Projects = await getProjectsCollection();
  const exists = await Projects.count({name})
  if (exists) return res.status(422).json({msg: "project name already taken!"})
  res.json(await Projects.create({user_id: req.user._id, name}))
})

const ownerGuard = async (req, res, next) => {
  const {project: name} = req.params;
  const Projects = await getProjectsCollection();
  const exists = await Projects.findOne({name});
  if (!exists) res.status(422).json({msg: "project does not exists!"})
  if (exists.user_id.toString() !== req.user._id.toString()) return res.status(422).json({msg: "no access!"})
  next();
};

app.delete('/:project', ownerGuard, async (req, res) => {
  const Projects = await getProjectsCollection();
  const {project} = req.params
  res.json(await Projects.deleteOne({name:project}))
  //todo delete database
})

export const ProjectsApiRouter = app;
