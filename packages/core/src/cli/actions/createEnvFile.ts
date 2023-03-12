import fs from "fs";
import { config } from "../../lib/config/index.js";

export const createConfigFile = async () => {
  const json: any = {};
  Object.keys(config).forEach((key) => {
    json[key] = config[key];
  });
  fs.writeFileSync("config.json", JSON.stringify(json, null, 2));
  console.log("Successfully generated .env.json file");
};
