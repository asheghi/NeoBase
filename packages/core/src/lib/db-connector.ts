import Mongoose from "mongoose";
import { config } from "./config";
import { getLogger } from "./getLogger";
import { Model as _Model } from "mongoose";
import { User } from "./types/vite-ssr.type";

type Model = _Model<any>;
const log = getLogger("db-connector");

const connectionPool: { [key: string]: any } = {};

export async function getDatabase(dbNameArg?: string) {
  const dbName =
    (config.db_name ?? "neo-base") + (dbNameArg ? `-${dbNameArg}` : "");
  if (!connectionPool[dbName]) {
    const uri = config.db_url + dbName;
    connectionPool[dbName] = Mongoose.createConnection(uri);
  }
  return connectionPool[dbName];
}

export async function getCollection(
  colName: string,
  dbName?: string
): Promise<Model> {
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

export async function getAuthCollection(): Promise<Model> {
  return getCollection("users", "auth");
}

let AccessConfigCollection: any = null;
export async function getAccessConfigCollection(): Promise<_Model<User>> {
  if (!AccessConfigCollection) {
    AccessConfigCollection = await getCollection("access_config", "auth");
    await AccessConfigCollection.schema.index({ collection: 1 });
  }
  return AccessConfigCollection;
}
