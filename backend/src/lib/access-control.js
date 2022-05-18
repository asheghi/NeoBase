import {getAccessConfigCollection, getCollection} from "./db/connector.js";

const defaultAccessConfig = {
  read: 'public',
  create: {
    users: {
      _id: '$uid$',
      role: 'admin',
    }
  },
  update: {
    users: {
      _id: '$uid$',
      role: 'admin',
    }
  },
  delete: {
    users: {
      _id: '$uid$',
      role: 'admin',
    }
  },
  info:'public',
}

function getQuery(config, context) {
  const {req, project, collection, operation} = context;
  for (let key of Object.keys(config)) {
    const value = config[key];
    if (typeof value === "string"){
      if (value === '$uid$' && req.user){
        config[key] = req.user._id;
      }
    }
  }
  return config;
}

export async function checkAccess({req, project, collection, operation}) {
  let AccessConfig = await getAccessConfigCollection();
  console.log(AccessConfig);
  let result = await AccessConfig.findOne({project, collection});
  let accessConfig = result ? result[0] : defaultAccessConfig;
  let config = accessConfig[operation] || defaultAccessConfig[operation];
  if (config === 'public') return true;
  if (config === 'authed') return !!req.user;
  for (let col of Object.keys(config)) {
    const Model = await getCollection(project, col);
    const query = getQuery(config[col], {req, project, collection, operation})
    console.log('check query', query);
    const res = await Model.count(query);
    console.log('check result', res);
    if (!res) return false;
  }
  return true;
}
