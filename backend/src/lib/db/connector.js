import {getLogger} from "../debug.js";
import {config} from "../../config/index.js";
import Mongoose from 'mongoose'
const log = getLogger('db-connector')

export async function getDatabase(name) {
  const uri = config.mongoUriBase + name;
  return Mongoose.createConnection(uri);
}

export async function getCollection(db_name,col_name){
  let conn = await getDatabase(db_name);
  return conn.models[col_name] || conn.model(col_name,new Mongoose.Schema({},{
    strict:false,
    validateBeforeSave:false,
    timestamps:true,
  }),col_name);
}

export async function getAccountCollection(){
  return getCollection('main','users')
};

export async function getProjectsCollection(){
  return getCollection('main','projects');
}

export async function getAccessConfigCollection(){
  return getCollection('main','access_config')
}
