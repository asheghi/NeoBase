import {
  getAccessConfigCollection,
  getCollection,
} from "../../lib/db/connector.js";

// collection level access control
export const defaultAccessConfig = {
  read: "public",
  create: {
    _id: "$uid$",
    role: "admin",
  },
  update: {
    _id: "$uid$",
    role: "admin",
  },
  delete: {
    _id: "$uid$",
    role: "admin",
  },
};

function getQuery(config, context) {
  const { req, project, collection, operation } = context;
  for (const key of Object.keys(config)) {
    const value = config[key];
    if (typeof value === "string") {
      if (value === "$uid$" && req.user) {
        config[key] = req.user._id;
      }
    }
  }
  return config;
}

const AccessConfig = await getAccessConfigCollection();
export async function checkAccess({ req, project, collection, operation }) {
  if (!req.user) return false;
  if (req.user.auth_provider === "account") return true;
  const result = await AccessConfig.findOne({ project, collection });
  const accessConfig = result ? result : defaultAccessConfig;
  const config = accessConfig[operation] || defaultAccessConfig[operation];
  if (config === "public") return true;
  if (config === "authed") return !!req.user;
  const Users = await getCollection("auth", project);
  const query = getQuery(config, { req, project, collection, operation });
  return await Users.count(query);
}
