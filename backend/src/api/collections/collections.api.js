import Express from 'express'
import bodyParser from "body-parser";
import {getCollection,} from "../../lib/db/connector.js";
import {getDebug} from "../../lib/debug.js";

const log = getDebug('collection.api')
const app = Express.Router();
app.use(bodyParser.json());

app.get('/info', (req, res) => {
  res.json({account: req.account, col: req.collection_name})
})

app.get('/count', async (req, res) => {
  res.json(await req.collection.count(req.params));
})

app.post('/create', async (req, res) => {
  res.json(await req.collection.create(req.body));
})

app.get('/find', async (req, res) => {
  res.send(await req.collection.find(req.query));
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

appWrapper.use('/:account/:col_name', async (req, res, next) => {
  const {account, col_name} = req.params;
  req.account = account;
  req.collection_name = col_name;
  req.collection = await getCollection(account, col_name);
  next()
}, app)

export const CollectionsApiRouter = appWrapper;
