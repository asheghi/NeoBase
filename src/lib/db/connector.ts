import * as Mongoose from "mongoose";
import { config } from "../../config/index";
import { getLogger } from "../debug";

const log = getLogger("db-connector");

const connectionPool: { [key: string]: any } = {};

export async function getDatabase(name: string) {
  if (!connectionPool[name]) {
    const uri = config.mongodb_base_url + name;
    connectionPool[name] = Mongoose.createConnection(uri);
  }
  return connectionPool[name];
}

export async function getCollection(dbName: string, colName: string) {
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
          //   strictPopulate: false,
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

export async function getAuthCollection(project: string) {
  return getCollection(project, "users");
}

let AccessConfigCollection: any = null;
export async function getAccessConfigCollection() {
  if (!AccessConfigCollection) {
    AccessConfigCollection = await getCollection("main", "access_config");
    await AccessConfigCollection.schema.index({ project: 1, collection: 1 });
  }
  return AccessConfigCollection;
}
