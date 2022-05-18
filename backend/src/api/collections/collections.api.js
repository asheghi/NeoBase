import Express from 'express'
import bodyParser from "body-parser";
import {getCollection, getDatabase, getProjectsCollection,} from "../../lib/db/connector.js";
import {getDebug} from "../../lib/debug.js";
import {checkAccess} from "../../lib/access-control.js";
import {authenticateRequest} from "../auth/auth.middleware.js";

const log = getDebug('collection.api');
const app = Express.Router();

const authMiddleware = (operation) => async (req, res, next) => {
  const haveAccess = await checkAccess({req, project: req.project, collection: req.collection, operation})
  if (haveAccess) return next()
  res.status(403).json({msg: '403 Forbidden'})
}

app.get('/info', authMiddleware('info'), (req, res) => {
  res.json({account: req.account, col: req.collection_name})
})

app.get('/find', authMiddleware('read'), async (req, res) => {
  res.send(await req.collection.find(req.query));
})

app.get('/findOne', authMiddleware('read'), async (req, res) => {
  res.send(await req.collection.find(req.query));
})


app.get('/count', authMiddleware('read'), async (req, res) => {
  res.json(await req.collection.count(req.params));
})

app.use(bodyParser.json());


app.post('/create', authMiddleware('create'), async (req, res) => {
  res.json(await req.collection.create(req.body));
})


app.post('/deleteOne', authMiddleware('delete'), async (req, res) => {
  res.json(await req.collection.deleteOne(req.body));
})

app.post('/deleteMany', async (req, res) => {
  res.json(await req.collection.deleteMany(req.body));
})

app.put('/update', authMiddleware('update'), async (req, res) => {
  res.json(await req.collection.updateOne(req.query, req.body));
})

const appWrapper = Express.Router();
appWrapper.use(authenticateRequest);

appWrapper.use(bodyParser.json());

appWrapper.post('/__col/:project', async (req, res) => {
  try {
    const connection = await getDatabase(req.params.project);
    let db = connection.client.db();
    const col = await db.createCollection(req.body.name);
    res.json(col.name);
  } catch (e) {
    res.status(500).json({msg: e.message});
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
    res.status(500).json({msg: e.message});
    console.error(e);
  }
})

appWrapper.delete('/__col/:project/:name', async (req, res) => {
  try {
    const {name} = req.params;
    const connection = await getDatabase(req.params.project);
    let db = connection.client.db();
    const result = await db.dropCollection(name, () => {
      res.json(result);
    });
  } catch (e) {
    res.status(500).json({msg: e.message});
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
