import {
  getAccessConfigCollection,
  getCollection,
} from "../../lib/db/connector.js";

export const defaultAccessConfig = {
  // who
  user: {
    read: "public",
    create: "authed",
    update: "authed",
    delete: "authed",
  },
  // document filters
  document: {
    read: {
      createdBy: "$uid$",
    },
    update: {
      createdBy: "$uid$",
    },
    delete: {
      createdBy: "$uid$",
    },
  },
};

function getQuery(configArg, context) {
  const { req } = context;
  const config = { ...configArg };
  Object.keys(config).forEach((key) => {
    const value = config[key];
    if (typeof value === "string") {
      if (value === "$uid$" && req.user) {
        config[key] = req.user._id;
      }
    }
  });
  return config;
}

const AccessConfig = await getAccessConfigCollection();

function processFilter(filterArg, context) {
  const { req } = context;
  const filter = { ...filterArg };
  Object.keys(filter).forEach((key) => {
    const value = filter[key];
    if (typeof value === "string") {
      if (value === "$uid$" && req.user) {
        filter[key] = req.user._id;
      }
    }
  });
  return filter;
}

export async function getDocumentFilter({
  req,
  project,
  collection,
  operation,
}) {
  const existing = await AccessConfig.findOne({ project, collection });
  const accessConfig = existing || defaultAccessConfig;
  const documentFilter = accessConfig.document;
  const filter = documentFilter[operation] || {};
  return processFilter(filter, { req });
}

export async function canUserAccessCollection({
  req,
  project,
  collection,
  operation,
}) {
  if (req.user.auth_provider === "account") return true;
  const result = await AccessConfig.findOne({ project, collection });
  const accessConfig = result || defaultAccessConfig;
  const userAccessConfig = accessConfig.user;
  const config =
    userAccessConfig[operation] || defaultAccessConfig.user[operation];
  if (config === "public" || config === true) return true;
  if (config === "authed") return !!req.user;
  const Users = await getCollection("auth", project);
  const query = getQuery(config, {
    req,
  });
  return Users.count(query);
}
