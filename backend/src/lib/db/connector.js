import Mongoose from "mongoose";
import { getLogger } from "../debug.js";
import { config } from "../../config/index.js";

const log = getLogger("db-connector");

const connectionPool = {};

export async function getDatabase(name) {
  if (!connectionPool[name]) {
    const uri = config.mongodb_base_url + name;
    connectionPool[name] = Mongoose.createConnection(uri);
  }
  return connectionPool[name];
}

export async function getCollection(dbName, colName) {
  const conn = await getDatabase(dbName);
  return (
    conn.models[colName] ||
    conn.model(
      colName,
      new Mongoose.Schema(
        {
          __v: { type: Number, select: false },
        },
        {
          strict: false,
          validateBeforeSave: false,
          timestamps: true,
          strictPopulate: false,
        }
      ),
      colName
    )
  );
}

export async function getAccountCollection() {
  return getCollection("main", "users");
}

export async function getProjectsCollection() {
  return getCollection("main", "projects");
}

let AccessConfigCollection = null;
export async function getAccessConfigCollection() {
  if (!AccessConfigCollection) {
    AccessConfigCollection = await getCollection("main", "access_config");
    await AccessConfigCollection.schema.index({ project: 1, collection: 1 });
  }
  return AccessConfigCollection;
}
