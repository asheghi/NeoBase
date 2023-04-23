/* eslint-disable no-loops/no-loops */

import {
  getAccessConfigCollection,
  getAuthCollection,
} from "../../../lib/db-connector";

// policies
export const defaultAccessConfig = [
  // user with role
  {
    name: "admin",
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
    name: "creator",
    user: true,
    create: true,
    read: { createdBy: "$uid" },
    update: { createdBy: "$uid" },
    delete: { createdBy: "$uid" },
  },
  // unAuthenticated user
  {
    name: "anonymous",
    user: null,
    create: false,
    read: false,
    delete: false,
    update: false,
  },
];

function processFilter(filterArg: any, context: any) {
  if (!filterArg) return false;
  // if access allowed we don't apply any filter
  if (filterArg === true) return {};
  const { req } = context;
  const filter = { ...filterArg };
  Object.keys(filter).forEach((key) => {
    const value = filter[key];
    if (typeof value === "string") {
      if (value === "$uid" && req.user) {
        filter[key] = req.user.id;
      }
    }
  });
  // mongodb db query filter
  return filter;
}

let AccessConfig: any = null;

async function filterRulesForUser(rules: any[], user: any) {
  const selectedRules = [];
  // level 1 check if user falls in one of the rules
  for (const rule of rules) {
    // un-authenticated users
    if (!rule.user) {
      selectedRules.push({ ...rule, priority: 1 });
    }
    // authenticated users
    else if (user && rule.user === true) {
      selectedRules.push({ ...rule, priority: 2 });
    }
    // only role based rule
    else if (
      user?.role &&
      rule?.user?.role &&
      Object.keys(rule.user).length === 1
    ) {
      if (user.role === rule.user.role)
        selectedRules.push({ ...rule, priority: 3 });
    }
    // custom user filter
    else if (user && rule.user) {
      const Users = await getAuthCollection();
      const found = await Users.findOne({ ...rule.user, _id: user.id });
      if (found) selectedRules.push({ ...rule, priority: 4 });
    } else {
      console.error("bad rule: did not find a case for this rule:");
      console.log("rule:", rule);
    }
  }
  return selectedRules.sort((a, b) => a.priority - b.priority);
}

export async function getUserFilter(arg: any) {
  const { req, operation, collection } = arg;
  const user = req.user;
  if (!AccessConfig) AccessConfig = await getAccessConfigCollection();
  const existing = await AccessConfig.findOne({ collection });
  const rules = existing.rules ?? defaultAccessConfig;
  const filteredRules = await filterRulesForUser(rules, user);

  // if no rules found for this user then no access
  if (!filteredRules.length) return false;

  let result: any = false;
  for (const rule of filteredRules) {
    const filter = processFilter(rule[operation], { req });
    if (!filter) {
      result = false;
    } else if (!result) {
      result = filter;
    } else {
      // should we override or extend?
      // result = { ...result, ...filter };
      result = filter;
    }
  }

  return result;
}
