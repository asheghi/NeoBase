import Express from "express";
import {checkAccess} from "./access-control.js";
import bodyParser from "body-parser";
import {authenticateUserRequest} from "../auth/auth.middleware.js";
import {authenticateAccountRequest} from "../accounts/accounts.middleware.js";
import {getDebug} from "../../lib/debug.js";
const log = getDebug('documents.api')
const app = Express.Router();

app.use((req, res, next) => {
  next();
  log.debug('is handling request')
});


app.use((req,res,next) => {
  req['fuck'] = 'this shit';
  next();
})

app.use(authenticateAccountRequest)
app.use(authenticateUserRequest,)

const canUserDo = (operation) => async (req, res, next) => {
  const haveAccess = await checkAccess({req, project: req.project, collection: req.Collection, operation})
  if (haveAccess) return next()
  res.status(403).json({msg: '403 Forbidden'})
}

app.get('/find', canUserDo('read'), async (req, res) => {
  res.send(await req.Collection.find(req.query));
})

app.get('/findOne', canUserDo('read'), async (req, res) => {
  res.send(await req.Collection.findOne(req.query));
})


app.get('/count', canUserDo('read'), async (req, res) => {
  res.json(await req.Collection.count(req.params));
})

app.use(bodyParser.json());


app.post('/create', canUserDo('create'), async (req, res) => {
  res.json(await req.Collection.create(req.body));
})


app.post('/deleteOne', canUserDo('delete'), async (req, res) => {
  res.json(await req.Collection.deleteOne(req.body));
})

app.post('/deleteMany',canUserDo('delete'), async (req, res) => {
  res.json(await req.Collection.deleteMany(req.body));
})

app.put('/update', canUserDo('update'), async (req, res) => {
  res.json(await req.Collection.updateOne(req.query, req.body));
})

export const DocumentsApiRouter = app;
