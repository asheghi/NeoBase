import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { getLogger } from "../lib/debug.js";

const log = getLogger("config");

const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = basename(fileURLToPath(import.meta.url));

const initialConfig = {
  rootPath: join(__dirname, "../../.."),
};

const proxy = new Proxy(initialConfig, {
  get(t, key) {
    if (!t[key]) log.warn(`config not found, key:'${key}'`);
    return t[key];
  },
});

for (const configFile of fs
  .readdirSync(__dirname)
  .filter((it) => it !== __filename)) {
  const configs = (await import(`./${configFile}`)).default;
  Object.keys(configs).forEach((key) => {
    proxy[key] = configs[key];
  });
}

export const config = proxy;