import fs from "fs";
import { config, populateConfig } from "../../config";

export const createConfigFile = async () => {
  await populateConfig();
  const json = {};
  Object.keys(config).forEach((key) => {
    json[key] = config[key];
  });
  fs.writeFileSync(".env.json", JSON.stringify(json, null, 2));
  console.log("Successfully generated .env.json file");
};
