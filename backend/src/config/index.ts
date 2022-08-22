// @ts-ignore
import dotenv from "dotenv";
import fs from "node:fs";
import path, { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getLogger } from "../lib/debug.js";

const log = getLogger("config");

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));
// @ts-ignore
const __filename = basename(fileURLToPath(import.meta.url));
const __rootdir = path.join(__dirname, "../..");

const envFile = getEnvFilePath();

envFile &&
  dotenv.config({
    path: getEnvFilePath(),
  });

const initialConfig = {
  rootPath: join(__dirname, "../../.."),
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
  const files = fs.readdirSync(__dirname).filter((it) => it !== __filename);
  await Promise.all(
    files.map(async (configFile) => {
      try {
        const configs = (await import(`./${configFile}`)).default;
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

await populateDefaults();

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
