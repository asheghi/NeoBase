import Express from "express";
import bodyParser from "body-parser";
import { authenticateUserRequest } from "../auth/auth.middleware.js";
import { authenticateAccountRequest } from "../accounts/accounts.middleware.js";
import { getLogger } from "../../lib/debug.js";
import { getUserFilter } from "./access-control.js";
import { getCollection } from "../../lib/db/connector.js";

const logger = getLogger("documents.api");
const FIND_LIMIT = 100;

const app = Express.Router();

app.use((req, res, next) => {
  next();
});

app.use(authenticateAccountRequest);
app.use(authenticateUserRequest);
app.use(bodyParser.json());

const canUserDo = (operation) => async (req, res, next) => {
  if (req.user && req.user.auth_provider === "account") {
    req.access_filter = {};
    return next();
  }
  const filter = await getUserFilter({
    req,
    project: req.project,
    collection: req.collection,
    operation,
  });
  if (filter) {
    req.access_filter = filter;
    return next();
  }
  return res.status(403).json({ msg: "403 Forbidden, you can't touch this!" });
};

app.post("/find", canUserDo("read"), async (req, res) => {
  const filter = { ...(req.body.filter || {}), ...req.access_filter };
  const projection = req.body.projection || {};
  const opt = req.body.options || {};
  const options = {
    sort: opt.sort,
    skip: opt.skip,
    limit: opt.limit || FIND_LIMIT,
  };
  res.send(await req.Collection.find(filter, projection, options));
});

app.post("/findOne", canUserDo("read"), async (req, res) => {
  const filter = { ...(req.body.filter || {}), ...req.access_filter };
  const projection = req.body.projection || {};
  const opt = req.body.options || {};
  const options = {
    sort: opt.limit,
    limit: opt.limit || FIND_LIMIT,
    skip: opt.skip,
  };
  res.send(await req.Collection.findOne(filter, projection, options));
});

app.get("/count", canUserDo("read"), async (req, res) => {
  const filter = { ...req.query, ...req.access_filter };
  res.json(await req.Collection.count(filter));
});

app.post("/create", canUserDo("create"), async (req, res) => {
  const payload = req.body;
  if (req.user && payload.createdBy)
    return res
      .status(422)
      .json({ msg: "document must not contain createdBy key" });

  if (req.user) payload.createdBy = req.user._id;
  const result = await req.Collection.create(payload);
  return res.json(result);
});

app.post("/deleteOne", canUserDo("delete"), async (req, res) => {
  const filter = { ...req.body, ...req.access_filter };
  res.json(await req.Collection.deleteOne(filter));
});

app.post("/deleteMany", canUserDo("delete"), async (req, res) => {
  const filter = { ...req.body, ...req.access_filter };
  res.json(await req.Collection.deleteMany(filter));
});

app.put("/updateOne", canUserDo("update"), async (req, res) => {
  const filter = { ...req.query, ...req.access_filter };
  const payload = req.body;
  delete payload.createdBy;
  res.json(await req.Collection.updateOne(filter, payload));
});

const setCollection = async (req, res, next) => {
  const { project, collection } = req.params;
  req.project = project;
  req.collection = collection;
  req.Collection = await getCollection(project, collection);
  next();
};
const cover = Express.Router();
cover.use("/:project/:collection", setCollection, app);
export const DocumentsApiRouter = cover;
export default { DocumentsApiRouter };
