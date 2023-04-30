import { defaultConfig } from "./defaultConfig";
import { getLogger } from "../getLogger";

const log = getLogger("config");

const target = {
  ...defaultConfig,
};

const proxy: any = new Proxy(target, {
  get(t: any, key: string) {
    // env has higher priority over default values in files
    if (process.env[key.toUpperCase()]) {
      return process.env[key.toUpperCase()];
    }
    if (process.env[key]) {
      return process.env[key];
    }
    // default value from source code
    if (t[key]) {
      return t[key];
    }
    if (t[key] === undefined) log.warn(`config not found for '${key}'`);
    return null;
  },
});

export const config = proxy as typeof defaultConfig;
