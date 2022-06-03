import Mongoose from "mongoose";
import { getLogger } from "../debug.js";
import { config } from "../../config/index.js";

const log = getLogger("db-connector");

export async function getDatabase(name) {
  const uri = config.mongoUriBase + name;
  return Mongoose.createConnection(uri);
}

export async function getCollection(dbName, colName) {
  const conn = await getDatabase(dbName);
  return (
    conn.models[colName] ||
    conn.model(
      colName,
      new Mongoose.Schema(
        {},
        {
          strict: false,
          validateBeforeSave: false,
          timestamps: true,
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

export async function getAccessConfigCollection() {
  return getCollection("main", "access_config");
}
