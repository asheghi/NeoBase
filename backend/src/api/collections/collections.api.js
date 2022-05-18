import Express from 'express'
import bodyParser from "body-parser";
import { getDatabase,} from "../../lib/db/connector.js";
import {getDebug} from "../../lib/debug.js";
import {authenticateAccountRequest} from "../accounts/accounts.middleware.js";

const log = getDebug('collection.api');


const app = Express.Router();
app.use(authenticateAccountRequest);

app.use(bodyParser.json());

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
