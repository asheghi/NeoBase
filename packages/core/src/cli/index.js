/* eslint-disable prettier/prettier */
var __defProp = Object.defineProperty;
var __export = (target3, all) => {
  for (var name in all)
    __defProp(target3, name, { get: all[name], enumerable: true });
};

// ../src/cli/index.ts
import { program, Option } from "commander";

// ../src/cli/printFiglet.ts
import figlet from "figlet";

// ../package.json
var package_default = {
  name: "@neobase/core",
  title: "NeoBase",
  version: "0.0.1",
  description: "NeoBase Server",
  main: "export.js",
  type: "module",
  bin: {
    neobase: "export.js"
  },
  scripts: {
    dev: "npm run server",
    prod: "npm run build && npm run server:prod",
    build: "rimraf dist && vite build",
    server: "ts-node src/cli/index.ts start",
    "server:prod": "cross-env NODE_ENV=production ts-node src/cli/index.ts start",
    run: "npm run build && npm run server:prod"
  },
  dependencies: {
    "@emotion/react": "^11.10.6",
    "@emotion/styled": "^11.10.6",
    "@mui/material": "^5.11.12",
    "@types/compression": "^1.7.2",
    "@types/express": "^4.17.14",
    "@types/node": "^18.11.9",
    "@types/react": "^18.0.8",
    "@types/react-dom": "^18.0.3",
    "@vitejs/plugin-react": "^3.0.0",
    bcryptjs: "^2.4.3",
    "body-parser": "^1.20.0",
    commander: "^10.0.0",
    compression: "^1.7.4",
    "connect-flash": "^0.1.1",
    "connect-mongo": "^4.6.0",
    "cookie-parser": "^1.4.6",
    cors: "^2.8.5",
    "cross-env": "^7.0.3",
    "debug-level": "^2.1.2",
    express: "^4.18.1",
    "express-session": "^1.17.3",
    "express-slow-down": "^1.4.0",
    figlet: "^1.5.2",
    jsonwebtoken: "^8.5.1",
    mongoose: "^6.3.3",
    morgan: "^1.10.0",
    passport: "^0.6.0",
    react: "^18.1.0",
    "react-dom": "^18.1.0",
    rimraf: "^2.6.2",
    sirv: "^2.0.2",
    "ts-node": "^10.9.1",
    typescript: "^4.9.4",
    vite: "^4.0.3",
    "vite-plugin-ssr": "^0.4.91",
    zod: "^3.18.0"
  },
  devDependencies: {
    "@types/bcryptjs": "^2.4.2",
    "@types/body-parser": "^1.19.2",
    "@types/connect-flash": "^0.0.37",
    "@types/cookie-parser": "^1.4.3",
    "@types/cors": "^2.8.12",
    "@types/express-session": "^1.17.6",
    "@types/express-slow-down": "^1.3.2",
    "@types/figlet": "^1.5.5",
    "@types/jsonwebtoken": "^8.5.8",
    "@types/morgan": "^1.9.3",
    "@types/passport": "^1.0.12",
    "@typescript-eslint/eslint-plugin": "^5.34.0",
    "@typescript-eslint/parser": "^5.34.0",
    esbuild: "^0.17.11",
    eslint: "^8.16.0",
    "fs-extra": "^11.1.0"
  }
};

// ../src/cli/printFiglet.ts
function printFiglet() {
  console.log(figlet.textSync(package_default.title));
}

// ../src/cli/actions/createEnvFile.ts
import fs from "fs";

// ../src/lib/randomString.ts
var randomString = () => {
  return (Math.random() + 1).toString(36).substring(7);
};

// ../src/lib/config/defaultConfig.ts
var defaultConfig = {
  //cookie
  cookie_secret: process.env.cookie_secret || process.env.NODE_ENV === "development" ? "dev-mode-jwt-token" : randomString() + randomString(),
  domain: "",
  ssl: false,
  // database
  db_url: "mongodb://localhost:27017/",
  db_name: "neobase",
  // server
  simulate_slow_network: false,
  disable_morgan: false,
  morgan: ":method :url :status :res[content-length] - :response-time ms",
  /**
   * server is listening on all interfaces by default
   * you can change it to 127.0.0.1 to listen only to localhost and expose api via a reverse proxy
   */
  listen_host: "localhost",
  listen_port: 8080,
  trust_proxy: false
};

// ../src/lib/getLogger.ts
import DebugLevel from "debug-level";
var getLogger = (identifier) => {
  if (process.env.NODE_ENV === "test") {
    const dummy = () => {
    };
    return {
      fatal: dummy,
      error: dummy,
      warn: dummy,
      info: dummy,
      debug: dummy,
      trace: dummy,
      log: dummy
    };
  }
  const { fatal, error, warn, info, debug, trace, log: log11 } = DebugLevel(
    `app` + identifier ? ":" + identifier : "",
    {}
  );
  return { fatal, error, warn, info, debug, trace, log: log11 };
};

// ../src/lib/config/index.ts
var log = getLogger("config");
var target = {
  ...defaultConfig
};
var proxy = new Proxy(target, {
  get(t, key) {
    if (process.env[key.toUpperCase()]) {
      return process.env[key.toUpperCase()];
    }
    if (process.env[key]) {
      return process.env[key];
    }
    if (t[key]) {
      return t[key];
    }
    if (t[key] === void 0)
      log.warn(`config not found for '${key}'`);
    return null;
  }
});
var config = proxy;

// ../src/cli/actions/createEnvFile.ts
var createConfigFile = async () => {
  const json = {};
  Object.keys(config).forEach((key) => {
    json[key] = config[key];
  });
  fs.writeFileSync("config.json", JSON.stringify(json, null, 2));
  console.log("Successfully generated .env.json file");
};

// ../src/server/index.js
import express3 from "express";
import compression from "compression";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { renderPage } from "vite-plugin-ssr";
import express2 from "express";
import bodyParser from "body-parser";
import Express from "express";
import Mongoose2 from "mongoose";
import Mongoose from "mongoose";
import DebugLevel2 from "debug-level";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bodyParser2 from "body-parser";
import Express2 from "express";
import { z as z2 } from "zod";
import { z } from "zod";
import express from "express";
import bodyParser3 from "body-parser";
import Express3 from "express";
import bodyParser4 from "body-parser";
import Express4 from "express";
import slowDown from "express-slow-down";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
var __dirname = dirname(fileURLToPath(import.meta.url));
var root = `${__dirname}/../..`;
var isProduction = process.env.NODE_ENV === "production";
var getViteSsrMiddleware = async () => {
  if (isProduction) {
    const sirv = (await import("sirv")).default;
    return sirv(`${root}/dist/client`);
  } else {
    const vite = await import("vite");
    const viteDevMiddleware = (await vite.createServer({
      root,
      server: { middlewareMode: true }
    })).middlewares;
    return viteDevMiddleware;
  }
};
var viteSsrRequestHandler = async (req, res, next) => {
  const pageContextInit = {
    urlOriginal: req.originalUrl,
    urlQuery: req.query,
    // todo 1 extend request type
    user: req.user,
    // return with url if you wanted to redirect from onBeforeRender
    redirect: null
  };
  const pageContext = await renderPage(pageContextInit);
  if (pageContext.redirect) {
    return res.redirect(pageContext.redirect);
  }
  const { httpResponse } = pageContext;
  if (!httpResponse)
    return next();
  const { body, statusCode, contentType, earlyHints } = httpResponse;
  if (res.writeEarlyHints)
    res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
  res.status(statusCode).type(contentType).send(body);
};
var authGuard = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send();
  }
};
var randomString2 = () => {
  return (Math.random() + 1).toString(36).substring(7);
};
var defaultConfig2 = {
  //cookie
  cookie_secret: process.env.cookie_secret || process.env.NODE_ENV === "development" ? "dev-mode-jwt-token" : randomString2() + randomString2(),
  domain: "",
  ssl: false,
  // database
  db_url: "mongodb://localhost:27017/",
  db_name: "neobase",
  // server
  simulate_slow_network: false,
  disable_morgan: false,
  morgan: ":method :url :status :res[content-length] - :response-time ms",
  /**
   * server is listening on all interfaces by default
   * you can change it to 127.0.0.1 to listen only to localhost and expose api via a reverse proxy
   */
  listen_host: "localhost",
  listen_port: 8080,
  trust_proxy: false
};
var getLogger2 = (identifier) => {
  if (process.env.NODE_ENV === "test") {
    const dummy = () => {
    };
    return {
      fatal: dummy,
      error: dummy,
      warn: dummy,
      info: dummy,
      debug: dummy,
      trace: dummy,
      log: dummy
    };
  }
  const { fatal, error, warn, info, debug, trace, log: log72 } = DebugLevel2(
    `app` + identifier ? ":" + identifier : "",
    {}
  );
  return { fatal, error, warn, info, debug, trace, log: log72 };
};
var log2 = getLogger2("config");
var target2 = {
  ...defaultConfig2
};
var proxy2 = new Proxy(target2, {
  get(t, key) {
    if (process.env[key.toUpperCase()]) {
      return process.env[key.toUpperCase()];
    }
    if (process.env[key]) {
      return process.env[key];
    }
    if (t[key]) {
      return t[key];
    }
    if (t[key] === void 0)
      log2.warn(`config not found for '${key}'`);
    return null;
  }
});
var config2 = proxy2;
var log22 = getLogger2("db-connector");
var connectionPool = {};
async function getDatabase(dbNameArg) {
  const dbName = (config2.db_name ?? "neo-base") + (dbNameArg ? `-${dbNameArg}` : "");
  if (!connectionPool[dbName]) {
    const uri = config2.db_url + dbName;
    connectionPool[dbName] = Mongoose.createConnection(uri);
  }
  return connectionPool[dbName];
}
async function getCollection(colName, dbName) {
  const conn = await getDatabase(dbName);
  return conn.models[colName] || conn.model(
    colName,
    new Mongoose.Schema(
      {
        __v: { type: Number, select: false }
      },
      {
        strict: false,
        validateBeforeSave: false,
        timestamps: true
        //   strictPopulate: false,
      }
    ),
    colName
  );
}
async function getAuthCollection() {
  return getCollection("users", "auth");
}
var AccessConfigCollection = null;
async function getAccessConfigCollection() {
  if (!AccessConfigCollection) {
    AccessConfigCollection = await getCollection("access_config", "auth");
    await AccessConfigCollection.schema.index({ collection: 1 });
  }
  return AccessConfigCollection;
}
var log3 = getLogger2("jwt-utils");
function generateTokenForPayload(payload) {
  return jwt.sign(payload, config2.cookie_secret);
}
function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}
function comparePassword(hash, password) {
  if (!hash)
    return false;
  return bcrypt.compareSync(password, hash);
}
var app = Express.Router();
app.use(authGuard);
app.use(bodyParser.json());
app.get("/", async (req, res) => {
  const Users = await getAuthCollection();
  res.json(await Users.find({}, "-password"));
});
app.get("/:uid", async (req, res) => {
  const Users = await getAuthCollection();
  const { uid } = req.params;
  if (!uid)
    return res.status(422).json({ msg: "bad request!" });
  return res.json(
    await Users.findOne({ _id: new Mongoose2.Types.ObjectId(uid) }, "-password")
  );
});
app.post("/", async (req, res) => {
  const { email, password, ...rest } = req.body;
  const Users = await getAuthCollection();
  const exists = await Users.findOne({ email });
  if (exists)
    return res.status(422).json({ msg: "user already exists!" });
  const result = await Users.create({
    email,
    ...rest,
    password: hashPassword(password)
  });
  return res.json(result);
});
app.delete("/:uid", async (req, res) => {
  const Users = await getAuthCollection();
  const { uid } = req.params;
  const result = await Users.deleteOne({
    _id: new Mongoose2.Types.ObjectId(uid)
  });
  res.json(result);
});
app.put("/:uid", async (req, res) => {
  const Users = await getAuthCollection();
  const { uid } = req.params;
  const payload = req.body;
  delete payload.password;
  delete payload._id;
  const result = await Users.updateOne(
    { _id: new Mongoose2.Types.ObjectId(uid) },
    { $set: payload }
  );
  res.json(result);
});
var ManageUsersApiRouter = app;
var passwordSchema = z.string().min(8).max(128);
var usernameSchema = z.string().min(4).max(64);
var userSchema = z.object({
  username: usernameSchema,
  _id: z.any(),
  role: z.string().optional()
});
var log4 = getLogger2("auth.service");
async function getAuthService() {
  const Users = await getAuthCollection();
  return {
    Users,
    async login(username, password) {
      usernameSchema.parse(username);
      passwordSchema.parse(password);
      const user = await Users.findOne({ username });
      if (user) {
        const result = comparePassword(user.password, password);
        log4.debug("compare result:", result);
        return result ? user : null;
      }
      log4.debug("user not found with username:", username);
      await new Promise((r) => {
        setTimeout(r, 500 + Math.random() * 500);
      });
      return null;
    },
    async register(username, password) {
      usernameSchema.parse(username);
      passwordSchema.parse(password);
      const exists = await Users.findOne({ username });
      if (exists)
        throw new Error("account already exists");
      return Users.create({
        username,
        password: hashPassword(password)
      });
    },
    async createUser(username, password, role) {
      usernameSchema.parse(username);
      passwordSchema.parse(password);
      const exists = await Users.findOne({ username });
      if (exists)
        throw new Error("account already exists");
      return Users.create({
        username,
        password: hashPassword(password),
        role
      });
    },
    generateToken(user) {
      usernameSchema.parse(user.username);
      return generateTokenForPayload({ username: user.username });
    }
  };
}
var log5 = getLogger2("routeValidation");
var validateSchema = (schema) => (req, res, next) => {
  try {
    if (schema.body && schema.body.parse) {
      schema.body.parse(req.body);
    }
    if (schema.query && schema.query.parse) {
      schema.query.parse(req.query);
    }
    if (schema.params && schema.params.parse) {
      schema.params.parse(req.params);
    }
  } catch (e) {
    log5.error(req.path, e.message ?? e);
    return res.status(400).json(e.issues);
  }
  return next();
};
var log6 = getLogger2("auth.api");
var app2 = Express2.Router();
app2.use(async (req, res, next) => {
  req.AuthService = await getAuthService();
  next();
});
var registerSchema = {
  body: z2.object({
    username: usernameSchema,
    password: passwordSchema
  })
};
app2.use(bodyParser2.json(), bodyParser2.urlencoded({ extended: true }));
app2.post(
  "/register/password",
  validateSchema(registerSchema),
  async (req, res, next) => {
    const {
      body: { username, password }
    } = req;
    try {
      const user = await req.AuthService.register(username, password);
      if (!user)
        return res.status(400).send("something is not right!");
      const error = await new Promise((resolve) => {
        req.login(user, function(err) {
          if (err) {
            return resolve(err);
          }
          resolve(null);
        });
      });
      if (error) {
        return next(error);
      }
      if (error) {
        return res.status(500).json({ success: false });
      }
      return res.json({ success: true });
    } catch (e) {
      log6.error(e);
      return res.status(422).json({ msg: e.message });
    }
  }
);
var loginSchema = {
  body: z2.object({
    username: z2.string(),
    password: z2.string()
  })
};
app2.post(
  "/login/password",
  validateSchema(loginSchema),
  async (req, res, next) => {
    const {
      body: { username, password }
    } = req;
    const user = await req.AuthService.login(username, password);
    if (!user)
      return res.status(400).json({ success: false });
    const error = await new Promise((resolve) => {
      req.login(user, function(err) {
        if (err) {
          return resolve(err);
        }
        resolve(null);
      });
    });
    if (error) {
      return res.status(500).json({ success: false });
    }
    return res.json({ success: true });
  }
);
app2.use(authGuard);
app2.get("/me", (req, res) => {
  const { username } = req.user;
  res.json({ username });
});
app2.post("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    return res.json({ success: true });
  });
});
var AuthApiRouter = app2;
var package_default2 = {
  name: "@neobase/core",
  title: "NeoBase",
  version: "0.0.1",
  description: "NeoBase Server",
  main: "export.js",
  type: "module",
  bin: {
    neobase: "export.js"
  },
  scripts: {
    dev: "npm run server",
    prod: "npm run build && npm run server:prod",
    build: "rimraf dist && vite build",
    server: "ts-node src/cli/index.ts start",
    "server:prod": "cross-env NODE_ENV=production ts-node src/cli/index.ts start",
    run: "npm run build && npm run server:prod"
  },
  dependencies: {
    "@emotion/react": "^11.10.6",
    "@emotion/styled": "^11.10.6",
    "@mui/material": "^5.11.12",
    "@types/compression": "^1.7.2",
    "@types/express": "^4.17.14",
    "@types/node": "^18.11.9",
    "@types/react": "^18.0.8",
    "@types/react-dom": "^18.0.3",
    "@vitejs/plugin-react": "^3.0.0",
    bcryptjs: "^2.4.3",
    "body-parser": "^1.20.0",
    commander: "^10.0.0",
    compression: "^1.7.4",
    "connect-flash": "^0.1.1",
    "connect-mongo": "^4.6.0",
    "cookie-parser": "^1.4.6",
    cors: "^2.8.5",
    "cross-env": "^7.0.3",
    "debug-level": "^2.1.2",
    express: "^4.18.1",
    "express-session": "^1.17.3",
    "express-slow-down": "^1.4.0",
    figlet: "^1.5.2",
    jsonwebtoken: "^8.5.1",
    mongoose: "^6.3.3",
    morgan: "^1.10.0",
    passport: "^0.6.0",
    react: "^18.1.0",
    "react-dom": "^18.1.0",
    rimraf: "^2.6.2",
    sirv: "^2.0.2",
    "ts-node": "^10.9.1",
    typescript: "^4.9.4",
    vite: "^4.0.3",
    "vite-plugin-ssr": "^0.4.91",
    zod: "^3.18.0"
  },
  devDependencies: {
    "@types/bcryptjs": "^2.4.2",
    "@types/body-parser": "^1.19.2",
    "@types/connect-flash": "^0.0.37",
    "@types/cookie-parser": "^1.4.3",
    "@types/cors": "^2.8.12",
    "@types/express-session": "^1.17.6",
    "@types/express-slow-down": "^1.3.2",
    "@types/figlet": "^1.5.5",
    "@types/jsonwebtoken": "^8.5.8",
    "@types/morgan": "^1.9.3",
    "@types/passport": "^1.0.12",
    "@typescript-eslint/eslint-plugin": "^5.34.0",
    "@typescript-eslint/parser": "^5.34.0",
    esbuild: "^0.17.11",
    eslint: "^8.16.0",
    "fs-extra": "^11.1.0"
  }
};
var defaultAccessConfig = [
  // user with role
  {
    user: {
      role: "admin"
    },
    create: true,
    read: true,
    update: true,
    delete: true
  },
  // authenticated user
  {
    user: true,
    create: true,
    read: { createdBy: "$uid" },
    update: { createdBy: "$uid" },
    delete: { createdBy: "$uid" }
  },
  // unAuthenticated user
  { user: null, create: false, read: false, delete: false, update: false }
];
function processFilter(filterArg, context) {
  if (!filterArg)
    return false;
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
  return filter;
}
var AccessConfig = null;
async function getUserFilter(arg) {
  const { req, operation, collection } = arg;
  if (!AccessConfig)
    AccessConfig = await getAccessConfigCollection();
  const existing = await AccessConfig.findOne({ collection });
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
        if (operationConf === true)
          operationConf = {};
        return processFilter(operationConf, { req });
      }
    }
    const authedRole = accessConfig.find((it) => it.user === true);
    if (authedRole)
      return processFilter(authedRole[operation], { req });
  } else {
    const unAuthedRole = accessConfig.find((it) => !it.user);
    if (unAuthedRole)
      return processFilter(unAuthedRole[operation], { req });
  }
  return false;
}
var console2 = getLogger2("collection.api");
var app3 = Express3.Router();
app3.use(bodyParser3.json());
app3.get("/access-config/:collection", async (req, res, next) => {
  const AccessConfig2 = await getAccessConfigCollection();
  const { collection } = req.params;
  let config22 = await AccessConfig2.findOne({ collection });
  if (!config22)
    config22 = defaultAccessConfig;
  else
    config22 = config22.toObject().roles;
  ["_id", "updatedAt", "createdAt", "__v", "collection"].forEach((it) => {
    delete config22[it];
  });
  res.json(config22);
});
app3.post("/access-config/:collection", async (req, res) => {
  const AccessConfig2 = await getAccessConfigCollection();
  const { collection } = req.params;
  const query = { collection };
  const existing = await AccessConfig2.findOne(query);
  const config22 = req.body;
  if (!existing)
    return res.json(await AccessConfig2.create({ roles: config22, collection }));
  ["_id", "updatedAt", "createdAt", "__v", "collection"].forEach((it) => {
    delete config22[it];
  });
  await AccessConfig2.updateOne(query, { $set: { roles: config22 } });
  return res.json(await AccessConfig2.findOne({ collection }));
});
app3.delete("/access-config/:collection", async (req, res) => {
  const AccessConfig2 = await getAccessConfigCollection();
  const { collection } = req.params;
  const query = { collection };
  const result = await AccessConfig2.deleteMany(query);
  res.json(result);
});
app3.post("/", async (req, res) => {
  try {
    let name = "";
    try {
      const connection = await getDatabase();
      const db = connection.client.db();
      name = req.body.name;
      await db.createCollection(name);
    } catch (e) {
      console2.error(e);
    }
    return res.json({ name });
  } catch (e) {
    console2.error(e);
    return res.status(500).json({ msg: e.message });
  }
});
app3.get("/", async (req, res) => {
  try {
    const connection = await getDatabase();
    const db = connection.client.db();
    const listCollections = (await db.listCollections().toArray()).map(
      (it) => ({ name: it.name })
    );
    res.json(listCollections);
  } catch (e) {
    res.status(500).json({ msg: e.message });
    console2.error(e);
  }
});
app3.delete("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const connection = await getDatabase();
    const db = connection.client.db();
    await db.dropCollection(name, () => {
      res.json({ name });
    });
  } catch (e) {
    res.status(500).json({ msg: e.message });
    console2.error(e);
  }
});
var CollectionsApiRouter = app3;
var realIpHeader = config2.real_ip_header;
function keyGeneratorFor(prefix) {
  return (req) => {
    const ids = [];
    if (realIpHeader) {
      ids.push(req.headers[realIpHeader]);
    } else {
      ids.push(req.ip);
    }
    ids.push(String(prefix));
    return ids.join("__");
  };
}
var SlowDownDocumentsRouter = slowDown({
  windowMs: 60 * 1e3,
  // 1 minutes
  delayAfter: 120,
  delayMs: 200,
  headers: true,
  keyGenerator: keyGeneratorFor("documents")
});
var CommonSlowDown = slowDown({
  windowMs: 60 * 1e3,
  // 1 minutes
  delayAfter: 200,
  delayMs: 500,
  headers: true,
  keyGenerator: keyGeneratorFor("general")
});
var slow_downs_middleware_default = {
  SlowDownDocumentsRouter,
  CommonSlowDown
};
var { SlowDownDocumentsRouter: SlowDownDocumentsRouter2 } = slow_downs_middleware_default;
var FIND_LIMIT = 100;
var app4 = Express4.Router();
app4.use(bodyParser4.json());
var canUserDo = (operation) => async (req, res, next) => {
  if (req.user && req.user.auth_provider === "account") {
    req.access_filter = {};
    return next();
  }
  const filter = await getUserFilter({
    req,
    collection: req.collection,
    operation
  });
  if (filter) {
    req.access_filter = filter;
    return next();
  }
  return res.status(403).json({
    msg: "Access Denied!, You do not have the appropriate permissions."
  });
};
app4.post(
  "/find",
  canUserDo("read"),
  async (req, res) => {
    const filter = { ...req.body.filter || {}, ...req.access_filter };
    const projection = req.body.projection || {};
    const populate = req.body.populate || [];
    const opt = req.body.options || {};
    const options = {
      sort: opt.sort,
      skip: +(opt.skip || 0),
      limit: +(opt.limit || FIND_LIMIT)
    };
    let query = req.Collection.find(filter, projection, options);
    if (populate && populate.length)
      await Promise.all(
        populate.filter((it) => it.model).map(async (population) => {
          const { model: modelName, path, ...rest } = population;
          const model = await getCollection(modelName);
          query = query.populate({ model, path, ...rest });
        })
      );
    res.send(await query);
  }
);
app4.post("/findOne", canUserDo("read"), async (req, res) => {
  const filter = { ...req.body.filter || {}, ...req.access_filter };
  const projection = req.body.projection || {};
  const populate = req.body.populate || [];
  let query = req.Collection.findOne(filter, projection);
  if (populate && populate.length)
    await Promise.all(
      populate.filter((it) => it.model).map(async (population) => {
        const { model: modelName, path, ...rest } = population;
        const model = await getCollection(modelName);
        query = query.populate({ model, path, ...rest });
      })
    );
  res.send(await query);
});
app4.post("/count", canUserDo("read"), async (req, res) => {
  const filter = { ...req.body.filter || {}, ...req.access_filter };
  res.json(await req.Collection.count(filter));
});
app4.post("/create", canUserDo("create"), async (req, res) => {
  const payload = req.body;
  if (req.user && payload.createdBy)
    return res.status(422).json({ msg: "document must not contain createdBy key" });
  if (req.user)
    payload.createdBy = req.user.id;
  const result = await req.Collection.create(payload);
  return res.json(result);
});
app4.post("/deleteOne", canUserDo("delete"), async (req, res) => {
  const filter = { ...req.body, ...req.access_filter };
  res.json(await req.Collection.deleteOne(filter));
});
app4.post("/deleteMany", canUserDo("delete"), async (req, res) => {
  const filter = { ...req.body, ...req.access_filter };
  res.json(await req.Collection.deleteMany(filter));
});
app4.post("/updateOne", canUserDo("update"), async (req, res) => {
  const filter = { ...req.body.filter, ...req.access_filter };
  const payload = req.body.update;
  delete payload.createdBy;
  res.json(await req.Collection.updateOne(filter, payload));
});
var setCollection = async (req, _res, next) => {
  const { collection } = req.params;
  req.collection = collection;
  req.Collection = await getCollection(collection);
  next();
};
var cover = Express4.Router();
cover.use("/:collection", setCollection, SlowDownDocumentsRouter2, app4);
var DocumentsApiRouter = cover;
var app5 = express.Router();
app5.use("/collections", CollectionsApiRouter);
app5.use("/documents", DocumentsApiRouter);
var DataApiRouter = app5;
var getApisMiddleware = async () => {
  const app6 = express2.Router();
  if (config2.simulate_slow_network) {
    app6.use((req, res, next) => {
      setTimeout(next, Math.round(Math.random() * 1500) + 500);
    });
  }
  app6.use("/user/auth", AuthApiRouter);
  app6.use("/user/manage", ManageUsersApiRouter);
  app6.use("/data", DataApiRouter);
  app6.get("/", (req, res) => {
    res.json({
      name: package_default2.name,
      title: package_default2.title,
      description: package_default2.description,
      version: package_default2.version
    });
  });
  return app6;
};
var setupPassportOnExpressApp = async (app6) => {
  app6.use(cookieParser());
  app6.use(
    session({
      secret: config2.cookie_secret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: `${config2.db_url}${config2.db_name}-session`
      }),
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1e3
      }
    })
  );
  app6.use(passport.initialize());
  app6.use(passport.session());
  app6.use(flash());
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, role: user.role });
    });
  });
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
};
var corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  cors({
    credentials: true,
    origin
  })(req, res, next);
};
var morganMiddleware = config2.debug ? morgan(config2.morgan) : (req, res, next) => next();
var getExpressApp = async () => {
  const app6 = express3();
  app6.use(morganMiddleware);
  app6.use(corsMiddleware);
  app6.use(compression());
  await setupPassportOnExpressApp(app6);
  app6.use("/api", await getApisMiddleware());
  app6.use(await getViteSsrMiddleware());
  app6.get("*", viteSsrRequestHandler);
  return app6;
};
async function startServer() {
  const app6 = await getExpressApp();
  const port = config2.listen_port;
  const host = config2.listen_host;
  const ssl = config2.ssl;
  app6.listen(port);
  console.log(`Server running at http${ssl ? "s" : ""}://${host}:${port}`);
}

// ../src/cli/actions/startServerAction.ts
var startServerAction = () => {
  console.log("Starting Server ...");
  startServer();
};

// ../src/cli/actions/startReplConsole.ts
import repl from "node:repl";

// ../src/lib/jwt-utils.ts
var jwt_utils_exports = {};
__export(jwt_utils_exports, {
  comparePassword: () => comparePassword2,
  decodeToken: () => decodeToken,
  extractToken: () => extractToken,
  generateTokenForPayload: () => generateTokenForPayload2,
  hashPassword: () => hashPassword2
});
import bcrypt2 from "bcryptjs";
import jwt2 from "jsonwebtoken";
var log7 = getLogger("jwt-utils");
function generateTokenForPayload2(payload) {
  return jwt2.sign(payload, config.cookie_secret);
}
function verifyToken(token) {
  if (!token)
    return false;
  let valid;
  try {
    jwt2.verify(token, config.cookie_secret);
    valid = true;
  } catch (e) {
    log7.info("verify-token failed:", e.message);
    valid = false;
  }
  return valid;
}
function decodeToken(token) {
  return jwt2.decode(token);
}
function extractToken(token) {
  const valid = verifyToken(token);
  if (!valid)
    throw new Error("invalid token");
  return decodeToken(token);
}
function hashPassword2(password) {
  const salt = bcrypt2.genSaltSync(10);
  return bcrypt2.hashSync(password, salt);
}
function comparePassword2(hash, password) {
  if (!hash)
    return false;
  return bcrypt2.compareSync(password, hash);
}

// ../src/features/user/apis/auth/validations/auth.validations.ts
import { z as z3 } from "zod";
var passwordSchema2 = z3.string().min(8).max(128);
var usernameSchema2 = z3.string().min(4).max(64);
var userSchema2 = z3.object({
  username: usernameSchema2,
  _id: z3.any(),
  role: z3.string().optional()
});

// ../src/lib/db-connector.ts
var db_connector_exports = {};
__export(db_connector_exports, {
  getAccessConfigCollection: () => getAccessConfigCollection2,
  getAuthCollection: () => getAuthCollection2,
  getCollection: () => getCollection2,
  getDatabase: () => getDatabase2
});
import Mongoose3 from "mongoose";
var log8 = getLogger("db-connector");
var connectionPool2 = {};
async function getDatabase2(dbNameArg) {
  const dbName = (config.db_name ?? "neo-base") + (dbNameArg ? `-${dbNameArg}` : "");
  if (!connectionPool2[dbName]) {
    const uri = config.db_url + dbName;
    connectionPool2[dbName] = Mongoose3.createConnection(uri);
  }
  return connectionPool2[dbName];
}
async function getCollection2(colName, dbName) {
  const conn = await getDatabase2(dbName);
  return conn.models[colName] || conn.model(
    colName,
    new Mongoose3.Schema(
      {
        __v: { type: Number, select: false }
      },
      {
        strict: false,
        validateBeforeSave: false,
        timestamps: true
        //   strictPopulate: false,
      }
    ),
    colName
  );
}
async function getAuthCollection2() {
  return getCollection2("users", "auth");
}
var AccessConfigCollection2 = null;
async function getAccessConfigCollection2() {
  if (!AccessConfigCollection2) {
    AccessConfigCollection2 = await getCollection2("access_config", "auth");
    await AccessConfigCollection2.schema.index({ collection: 1 });
  }
  return AccessConfigCollection2;
}

// ../src/features/user/apis/auth/auth.service.ts
var log9 = getLogger("auth.service");
async function getAuthService2() {
  const Users = await getAuthCollection2();
  return {
    Users,
    async login(username, password) {
      usernameSchema2.parse(username);
      passwordSchema2.parse(password);
      const user = await Users.findOne({ username });
      if (user) {
        const result = comparePassword2(user.password, password);
        log9.debug("compare result:", result);
        return result ? user : null;
      }
      log9.debug("user not found with username:", username);
      await new Promise((r) => {
        setTimeout(r, 500 + Math.random() * 500);
      });
      return null;
    },
    async register(username, password) {
      usernameSchema2.parse(username);
      passwordSchema2.parse(password);
      const exists = await Users.findOne({ username });
      if (exists)
        throw new Error("account already exists");
      return Users.create({
        username,
        password: hashPassword2(password)
      });
    },
    async createUser(username, password, role) {
      usernameSchema2.parse(username);
      passwordSchema2.parse(password);
      const exists = await Users.findOne({ username });
      if (exists)
        throw new Error("account already exists");
      return Users.create({
        username,
        password: hashPassword2(password),
        role
      });
    },
    generateToken(user) {
      usernameSchema2.parse(user.username);
      return generateTokenForPayload2({ username: user.username });
    }
  };
}

// ../src/cli/actions/startReplConsole.ts
var startReplConsole = () => {
  const context = {
    config,
    ...jwt_utils_exports,
    getLogger,
    getAuthService: getAuthService2,
    ...db_connector_exports
  };
  const replServer = repl.start({
    prompt: `Node (${process.version}) > `
  });
  Object.keys(context).forEach((key) => {
    replServer.context[key] = context[key];
  });
  replServer.defineCommand("help", {
    help: "show help",
    action() {
      this.clearBufferedCommand();
      this.displayPrompt();
    }
  });
  replServer.setupHistory("node_modules/.console_repl_history", (err) => {
    if (err)
      console.error(err);
  });
};

// ../src/cli/actions/createAdminUserAction.ts
var log10 = getLogger("create-admin");
var createAdminUserAction = async ({
  username,
  password
}) => {
  const service = await getAuthService2();
  const role = "admin";
  try {
    await service.createUser(username, password, role);
    console.log("Successfully created Admin user".toUpperCase());
    console.log("username:", username);
    console.log("password:", password);
    console.log("role:", role);
  } catch (e) {
    log10.error("failed to create admin user");
    log10.error("username:", username, "password:", password);
    log10.error(e);
  }
};

// ../src/cli/index.ts
printFiglet();
program.command("start").description("start server").addOption(
  new Option("-p, --port <port>", "listening port").env("LISTEN_PORT")
).addOption(
  new Option("-H, --hostname <host>", "listening host").env("LISTEN_HOST")
).addOption(
  new Option(
    "-P, --trust-proxy",
    "behind reverse proxy, default:'false'"
  ).env("TRUST_PROXY")
).addOption(
  new Option(
    "--cookie-secret <cookieSecret>",
    "json-web-token secret used for token generation, default:'randomString'"
  ).env("cookie_secret")
).addOption(
  new Option(
    "--db <dbUrl>",
    "mongodb database url, default:'mongodb://127.0.0.1/'"
  ).env("DB_URL")
).addOption(
  new Option(
    "--db-name <dbName>",
    `mongodb database name, default:'${package_default.title}'`
  ).env("DB_NAME")
).addOption(
  new Option("-d, --debug", `show debug information, default:'false'`)
).action(async (options) => {
  if (options.port) {
    config.listen_port = options.port;
  }
  if (options.hostname) {
    config.listen_host = options.hostname;
  }
  if (options.trustProxy) {
    config.trust_proxy = true;
  }
  if (options.cookieSecret) {
    config.cookie_secret = options.cookieSecret;
  }
  if (options.db) {
    config.db_url = options.db;
  }
  if (options.dbName) {
    config.db_name = options.dbName;
  }
  if (options.debug) {
    console.log(
      Object.keys(options).map((key) => `options.${key}=${options[key]}`).join("\n")
    );
    console.log(
      Object.keys(config).map((key) => `config.${key}=${config[key]}`).join("\n")
    );
  }
  startServerAction();
});
program.command("config").description("create default config file").action(() => createConfigFile());
program.command("console").description("start repl console").action(() => startReplConsole());
program.command("create-admin").description("create admin user").addOption(
  new Option("-U, --username <username>", `username`).default("superadmin")
).addOption(
  new Option("-P, --password <password>", `password`).default(
    randomString() + randomString()
  )
).action(async (options) => {
  const username = options.username;
  const password = options.password;
  try {
    await createAdminUserAction({ username, password });
    process.exit(0);
  } catch (e) {
    process.exit(1);
  }
});
program.parse();
