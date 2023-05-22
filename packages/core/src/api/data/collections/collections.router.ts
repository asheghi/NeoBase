import bodyParser from "body-parser";
import Express from "express";
import { defaultAccessConfig } from "../documents/access-control";
import { getLogger } from "../../../lib/getLogger";
import {
  getAccessConfigCollection,
  getDatabase,
} from "../../../lib/db-connector";
import { adminGuard } from "../../../server/middleware/adminGuard";

const console = getLogger("collection.api");
const app = Express.Router();

app.use(bodyParser.json());

app.use(adminGuard);

app.get("/access-config/:collection", async (req, res) => {
  const AccessConfig = await getAccessConfigCollection();
  const { collection } = req.params;
  let config: any = await AccessConfig.findOne({ collection });
  if (!config) config = defaultAccessConfig;
  else config = config.toObject().rules;
  try {
    ["_id", "updatedAt", "createdAt", "__v", "collection"].forEach((it) => {
      delete config[it];
    });
  } catch (e) {
    console.error(e);
  }
  res.json(config);
});

app.post("/access-config/:collection", async (req, res) => {
  const AccessConfig = await getAccessConfigCollection();
  const { collection } = req.params;
  const query = { collection };
  const existing = await AccessConfig.findOne(query);
  const config = req.body;
  if (!existing)
    return res.json(await AccessConfig.create({ rules: config, collection }));
  ["_id", "updatedAt", "createdAt", "__v", "collection"].forEach((it) => {
    delete config[it];
  });
  await AccessConfig.updateOne(query, { $set: { rules: config } });
  return res.json(await AccessConfig.findOne({ collection }));
});

app.delete("/access-config/:collection", async (req, res) => {
  const AccessConfig = await getAccessConfigCollection();
  const { collection } = req.params;
  const query = { collection };
  const result = await AccessConfig.deleteMany(query);
  res.json(result);
});

app.post("/", async (req, res) => {
  try {
    let name = "";
    // todo check if collection exists
    // ignore exception for now
    try {
      const connection: any = await getDatabase();
      const db = connection.client.db();
      name = req.body.name;
      await db.createCollection(name);
    } catch (e) {
      console.error(e);
    }
    return res.json({ name });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ msg: e.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const connection: any = await getDatabase();
    const db = connection.client.db();
    const listCollections = (await db.listCollections().toArray()).map(
      (it: any) => ({ name: it.name })
    );
    res.json(listCollections);
  } catch (e: any) {
    res.status(500).json({ msg: e.message });
    console.error(e);
  }
});

app.delete("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const connection: any = await getDatabase();
    const db = connection.client.db();
    await db.dropCollection(name, () => {
      res.json({ name });
    });
  } catch (e: any) {
    res.status(500).json({ msg: e.message });
    console.error(e);
  }
});

export const CollectionsApiRouter = app;
