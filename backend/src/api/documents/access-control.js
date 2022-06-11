/* eslint-disable no-loops/no-loops */
import { getAccessConfigCollection } from "../../lib/db/connector.js";

export const defaultAccessConfig = [
  // user with role
  {
    user: {
      role: "admin",
    },
    create: true,
    read: true,
    update: true,
    delete: true,
  },
  // authenticated user
  {
    user: true,
    create: true,
    read: { createdBy: "$uid" },
    update: { createdBy: "$uid" },
    delete: { createdBy: "$uid" },
  },
  // unAuthenticated user
  { user: null, create: false, read: false, delete: false, update: false },
];

function processFilter(filterArg, context) {
  if (!filterArg) return false;
  const { req } = context;
  const filter = { ...filterArg };
  Object.keys(filter).forEach((key) => {
    const value = filter[key];
    if (typeof value === "string") {
      if (value === "$uid" && req.user) {
        filter[key] = req.user._id;
      }
    }
  });
  return filter;
}

const AccessConfig = await getAccessConfigCollection();

export async function getUserFilter({ req, operation, project, collection }) {
  const existing = await AccessConfig.findOne({ project, collection });
  const accessConfig = existing ? existing.roles : defaultAccessConfig;
  const { user } = req;

  if (user) {
    if (user.role) {
      const roleBasedRoles = accessConfig.filter(
        (it) => it.user && it.user.role && typeof it.user.role === "string"
      );
      const matchedConfig = roleBasedRoles.find(
        (it) => it.user.role === user.role
      );
      if (matchedConfig) {
        let operationConf = matchedConfig[operation];
        if (operationConf === true) operationConf = {};
        return processFilter(operationConf, { req });
      }
    }
    const authedRole = accessConfig.find((it) => it.user === true);
    if (authedRole) return processFilter(authedRole[operation], { req });
  } else {
    const unAuthedRole = accessConfig.find((it) => !it.user);
    if (unAuthedRole) return processFilter(unAuthedRole[operation], { req });
  }

  // finally, if no suitable rules were found
  return false;
}
