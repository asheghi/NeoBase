import Express from 'express'
import bodyParser from "body-parser";
import {getCollection, getDatabase, getProjectsCollection,} from "../../lib/db/connector.js";
import {getDebug} from "../../lib/debug.js";

const log = getDebug('collection.api');
const app = Express.Router();

app.get('/info', (req, res) => {
  res.json({account: req.account, col: req.collection_name})
})

app.get('/find', async (req, res) => {
  res.send(await req.collection.find(req.query));
})


app.get('/count', async (req, res) => {
  res.json(await req.collection.count(req.params));
})

const ownerGuard = async (req, res, next) => {
  const name = req.project;
  const Projects = await getProjectsCollection();
  const exists = await Projects.findOne({name});
  if (!exists) res.status(422).json({msg: "project does not exists!"})
  if (exists.user_id.toString() !== req.user._id.toString()) return res.status(422).json({msg: "no access!"})
  next();
};

app.use(ownerGuard);
app.use(bodyParser.json());


app.post('/create', async (req, res) => {
  res.json(await req.collection.create(req.body));
})


app.post('/deleteOne', async (req, res) => {
  res.json(await req.collection.deleteOne(req.body));
})

app.post('/deleteMany', async (req, res) => {
  res.json(await req.collection.deleteMany(req.body));
})

app.put('/update', async (req, res) => {
  res.json(await req.collection.updateOne(req.query, req.body));
})

const appWrapper = Express.Router();
appWrapper.use(bodyParser.json());

appWrapper.post('/__col/:project', async (req, res) => {
  try {
    const connection = await getDatabase(req.params.project);
    let db = connection.client.db();
    const col = await db.createCollection(req.body.name);
    res.json(col.name);
  } catch (e) {
    res.status(500).json({msg:e.message});
    console.error(e);
  }
})


appWrapper.get('/__col/:project', async (req, res) => {
  try {
    const connection = await getDatabase(req.params.project);
    let db = connection.client.db();
    const listCollections = (await db.listCollections().toArray()).map(it => ({name: it.name}));
    res.json(listCollections);
  } catch (e) {
    res.status(500).json({msg:e.message});
    console.error(e);
  }
})

appWrapper.delete('/__col/:project/:name', async (req, res) => {
  try {
    const {name} = req.params;
    const connection = await getDatabase(req.params.project);
    let db = connection.client.db();
    const result = await db.dropCollection(name,() => {
      res.json(result);
    });
  } catch (e) {
    res.status(500).json({msg:e.message});
    console.error(e);
  }
})

appWrapper.use('/:project/:col_name', async (req, res, next) => {
  const {project, col_name} = req.params;
  req.project = project;
  req.collection_name = col_name;
  req.collection = await getCollection(project, col_name);
  next()
}, app)

export const CollectionsApiRouter = appWrapper;
