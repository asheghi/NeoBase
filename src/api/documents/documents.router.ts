import bodyParser from "body-parser";
import Express from "express";
import { getCollection } from "../../lib/db/connector";
import { authenticateAccountRequest } from "../accounts/accounts.middleware";
import { authenticateUserRequest } from "../auth/auth.middleware";
import { getUserFilter } from "./access-control";

// const logger = getLogger("documents.api");
const FIND_LIMIT = 100;

const app = Express.Router();

// @ts-ignore
app.use(authenticateAccountRequest);
app.use(authenticateUserRequest);
app.use(bodyParser.json());

const canUserDo =
  (operation: string) =>
  async (req: any, res: Express.Response, next: Express.NextFunction) => {
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
    return res.status(403).json({
      msg: "Access Denied!, You do not have the appropriate permissions.",
    });
  };

app.post(
  "/find",
  canUserDo("read"),
  async (req: any, res: Express.Response) => {
    const filter = { ...(req.body.filter || {}), ...req.access_filter };
    const projection = req.body.projection || {};
    const populate = req.body.populate || [];
    const opt = req.body.options || {};
    const options = {
      sort: opt.sort,
      skip: +(opt.skip || 0),
      limit: +(opt.limit || FIND_LIMIT),
    };
    let query = req.Collection.find(filter, projection, options);
    if (populate && populate.length)
      await Promise.all(
        populate
          .filter((it: any) => it.model)
          .map(async (population: any) => {
            const { model: modelName, path, ...rest } = population;
            const model = await getCollection(req.project, modelName);
            query = query.populate({ model, path, ...rest });
          })
      );
    res.send(await query);
  }
);

app.post("/findOne", canUserDo("read"), async (req: any, res) => {
  const filter = { ...(req.body.filter || {}), ...req.access_filter };
  const projection = req.body.projection || {};
  const populate = req.body.populate || [];

  let query = req.Collection.findOne(filter, projection);

  if (populate && populate.length)
    await Promise.all(
      populate
        .filter((it: any) => it.model)
        .map(async (population: any) => {
          const { model: modelName, path, ...rest } = population;
          const model = await getCollection(req.project, modelName);
          query = query.populate({ model, path, ...rest });
        })
    );
  res.send(await query);
});

app.post("/count", canUserDo("read"), async (req: any, res) => {
  const filter = { ...(req.body.filter || {}), ...req.access_filter };
  res.json(await req.Collection.count(filter));
});

app.post("/create", canUserDo("create"), async (req: any, res) => {
  const payload = req.body;
  if (req.user && payload.createdBy)
    return res
      .status(422)
      .json({ msg: "document must not contain createdBy key" });

  if (req.user) payload.createdBy = req.user._id;
  const result = await req.Collection.create(payload);
  return res.json(result);
});

app.post("/deleteOne", canUserDo("delete"), async (req: any, res) => {
  const filter = { ...req.body, ...req.access_filter };
  res.json(await req.Collection.deleteOne(filter));
});

app.post("/deleteMany", canUserDo("delete"), async (req: any, res) => {
  const filter = { ...req.body, ...req.access_filter };
  res.json(await req.Collection.deleteMany(filter));
});

app.post("/updateOne", canUserDo("update"), async (req: any, res) => {
  const filter = { ...req.body.filter, ...req.access_filter };
  const payload = req.body.update;
  delete payload.createdBy;
  res.json(await req.Collection.updateOne(filter, payload));
});

const setCollection = async (
  req: any,
  _res: any,
  next: Express.NextFunction
) => {
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
