import Express from "express";
import bodyParser from "body-parser";
import {
  canUserAccessCollection,
  getDocumentFilter,
} from "./access-control.js";
import { authenticateUserRequest } from "../auth/auth.middleware.js";
import { authenticateAccountRequest } from "../accounts/accounts.middleware.js";
import { getLogger } from "../../lib/debug.js";

const logger = getLogger("documents.api");
const app = Express.Router();

app.use((req, res, next) => {
  next();
});

app.use(authenticateAccountRequest);
app.use(authenticateUserRequest);

const canUserDo = (operation) => async (req, res, next) => {
  const haveAccess = await canUserAccessCollection({
    req,
    project: req.project,
    collection: req.Collection,
    operation,
  });
  if (haveAccess) return next();
  return res.status(403).json({ msg: "403 Forbidden, you can't touch this!" });
};

app.get("/find", canUserDo("read"), async (req, res) => {
  const documentFilter = await getDocumentFilter({
    req,
    project: req.project,
    collection: req.collection,
    operation: "read",
  });
  const filter = { ...req.query, ...documentFilter };
  res.send(await req.Collection.find(filter));
});

app.get("/findOne", canUserDo("read"), async (req, res) => {
  const documentFilter = await getDocumentFilter({
    req,
    project: req.project,
    collection: req.collection,
    operation: "read",
  });
  const filter = { ...req.query, ...documentFilter };
  res.send(await req.Collection.findOne(filter));
});

app.get("/count", canUserDo("read"), async (req, res) => {
  const documentFilter = await getDocumentFilter({
    req,
    project: req.project,
    collection: req.collection,
    operation: "find",
  });
  const filter = { ...req.query, ...documentFilter };
  res.json(await req.Collection.count(filter));
});

app.use(bodyParser.json());

app.post("/create", canUserDo("create"), async (req, res) => {
  const payload = req.body;
  if (req.user && payload.createdBy)
    return res
      .status(422)
      .json({ msg: "document must not contain createdBy key" });

  if (req.user) payload.createdBy = req.user._id;
  const result = await req.Collection.create(payload);
  res.json(result);
});

app.post("/deleteOne", canUserDo("delete"), async (req, res) => {
  const documentFilter = await getDocumentFilter({
    req,
    project: req.project,
    collection: req.collection,
    operation: "delete",
  });
  const filter = { ...req.body, ...documentFilter };
  res.json(await req.Collection.deleteOne(filter));
});

app.post("/deleteMany", canUserDo("delete"), async (req, res) => {
  const documentFilter = await getDocumentFilter({
    req,
    project: req.project,
    collection: req.collection,
    operation: "delete",
  });
  const filter = { ...req.body, ...documentFilter };
  res.json(await req.Collection.deleteMany(filter));
});

app.put("/updateOne", canUserDo("update"), async (req, res) => {
  const documentFilter = await getDocumentFilter({
    req,
    project: req.project,
    collection: req.collection,
    operation: "delete",
  });
  const filter = { ...req.query, ...documentFilter };
  const payload = req.body;
  delete payload.createdBy;
  res.json(await req.Collection.updateOne(filter, payload));
});

export const DocumentsApiRouter = app;
