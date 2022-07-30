import Express from "express";
import bodyParser from "body-parser";
import {
  getAccessConfigCollection,
  getDatabase,
} from "../../lib/db/connector.js";
import { getLogger } from "../../lib/debug.js";
import {
  accountGuard,
  authenticateAccountRequest,
} from "../accounts/accounts.middleware.js";
import { projectOwnerGuard } from "../common/guards.middleware.js";
import { defaultAccessConfig } from "../documents/access-control.js";

const logger = getLogger("collection.api");
const app = Express.Router();

app.use(bodyParser.json());

app.use(authenticateAccountRequest, accountGuard, projectOwnerGuard);

app.get("/access-config/:collection", async (req, res, next) => {
  const AccessConfig = await getAccessConfigCollection();
  const { project } = req;
  const { collection } = req.params;
  let config = await AccessConfig.findOne({ project, collection });
  if (!config) config = defaultAccessConfig;
  else config = config.toObject().roles;
  ["_id", "updatedAt", "createdAt", "__v", "collection", "project"].forEach(
    (it) => {
      delete config[it];
    }
  );
  res.json(config);
});

app.post("/access-config/:collection", async (req, res) => {
  const AccessConfig = await getAccessConfigCollection();
  const { project } = req;
  const { collection } = req.params;
  const query = { project, collection };
  const existing = await AccessConfig.findOne(query);
  const config = req.body;
  if (!existing)
    return res.json(
      await AccessConfig.create({ roles: config, project, collection })
    );
  ["_id", "updatedAt", "createdAt", "__v", "collection", "project"].forEach(
    (it) => {
      delete config[it];
    }
  );
  await AccessConfig.updateOne(query, { $set: { roles: config } });
  return res.json(await AccessConfig.findOne({ project, collection }));
});

app.delete("/access-config/:collection", async (req, res) => {
  const AccessConfig = await getAccessConfigCollection();
  const { project } = req;
  const { collection } = req.params;
  const query = { project, collection };
  const result = await AccessConfig.deleteMany(query);
  res.json(result.roles);
});

app.post("/", async (req, res) => {
  try {
    let name = "";
    // todo check if collection exists
    // ignore exception for now
    try {
      const connection = await getDatabase(req.project);
      const db = connection.client.db();
      name = req.body.name;
      await db.createCollection(name);
    } catch (e) {
      console.error(e);
    }
    return res.json({ name });
  } catch (e) {
    res.status(500).json({ msg: e.message });
    console.error(e);
  }
});

app.get("/", async (req, res) => {
  try {
    const connection = await getDatabase(req.project);
    const db = connection.client.db();
    const listCollections = (await db.listCollections().toArray()).map(
      (it) => ({ name: it.name })
    );
    res.json(listCollections);
  } catch (e) {
    res.status(500).json({ msg: e.message });
    console.error(e);
  }
});

app.delete("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const connection = await getDatabase(req.project);
    const db = connection.client.db();
    await db.dropCollection(name, () => {
      res.json({ name });
    });
  } catch (e) {
    res.status(500).json({ msg: e.message });
    console.error(e);
  }
});

export const CollectionsApiRouter = app;
