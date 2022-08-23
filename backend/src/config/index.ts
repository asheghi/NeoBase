// @ts-ignore
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { getLogger } from "../lib/debug";

const log = getLogger("config");

const __rootdir = path.join(__dirname, "../..");

const envFile = getEnvFilePath();

envFile &&
  dotenv.config({
    path: getEnvFilePath(),
  });

const initialConfig = {
  rootPath: path.join(__dirname, "../../.."),
};

const proxy: any = new Proxy(initialConfig, {
  get(t: any, key: string) {
    // env has higher priority over default values in files
    if (process.env[key.toUpperCase()]) {
      return process.env[key.toUpperCase()];
    }
    if (process.env[key]) {
      return process.env[key];
    }
    // default value from files
    if (t[key]) {
      return t[key];
    }
    if (t[key] === undefined) log.warn(`config not found for '${key}'`);
    return null;
  },
});

async function populateDefaults() {
  const files = fs
    .readdirSync(__dirname)
    .filter((it) => it !== path.basename(__filename))
    .filter((it) => !it.endsWith(".js.map"));

  await Promise.all(
    files.map(async (configFile) => {
      try {
        const it = require(`./${configFile}`);
        const configs = require(`./${configFile}`).default;
        Object.keys(configs).forEach((key) => {
          proxy[key] = configs[key];
        });
      } catch (e) {
        log.error(e);
      }
    })
  );
  return proxy;
}

export async function populateConfig() {
  await populateDefaults();
}

export const config = proxy;

function getEnvFilePath() {
  const mode = process.env.NODE_ENV || process.env.node_env;
  let p: any;
  if (mode) {
    p = path.join(__rootdir, ".env." + mode.toLowerCase());
  } else {
    p = path.join(__rootdir, ".env");
  }
  if (fs.existsSync(p)) return p;
  return null;
}
