import Express from 'express'
import bodyParser from "body-parser";
import {getAccessConfigCollection, getDatabase,} from "../../lib/db/connector.js";
import {getDebug} from "../../lib/debug.js";
import {accountGuard, authenticateAccountRequest} from "../accounts/accounts.middleware.js";

const log = getDebug('collection.api');

const app = Express.Router();

app.use((req, res, next) => {
  next();
  log.debug('is handling request')
});

app.use(bodyParser.json());

app.use(authenticateAccountRequest, accountGuard);

app.get('/access-config/:collection', async (req, res, next) => {
  let AccessConfig = await getAccessConfigCollection();
  const {project,} = req;
  const {collection} = req.params;
  res.json(await AccessConfig.findOne({project, collection}))
})

app.post('/access-config/:collection', async (req, res) => {
  let AccessConfig = await getAccessConfigCollection();
  const {project} = req;
  const {collection} = req.params;
  const existing = await AccessConfig.findOne({project, collection});
  const config = req.body;
  if (!existing) return res.json(await AccessConfig.create({...config, project, collection}));
  await existing.update({$set: config});

  res.json(await AccessConfig.findOne({project,collection}));
})


app.post('/', async (req, res) => {
  try {
    const connection = await getDatabase(req.project);
    let db = connection.client.db();
    let name = req.body.name;
    await db.createCollection(name);
    return res.json({name: name});
  } catch (e) {
    res.status(500).json({msg: e.message});
    console.error(e);
  }
})


app.get('/', async (req, res) => {
  try {
    const connection = await getDatabase(req.project);
    let db = connection.client.db();
    const listCollections = (await db.listCollections().toArray()).map(it => ({name: it.name}));
    res.json(listCollections);
  } catch (e) {
    res.status(500).json({msg: e.message});
    console.error(e);
  }
})

app.delete('/:name', async (req, res) => {
  try {
    const {name} = req.params;
    const connection = await getDatabase(req.project);
    let db = connection.client.db();
    await db.dropCollection(name, () => {
      res.json({name});
    });
  } catch (e) {
    res.status(500).json({msg: e.message});
    console.error(e);
  }
})

export const CollectionsApiRouter = app;
