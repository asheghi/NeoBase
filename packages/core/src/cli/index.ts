import "module-alias/register";

import { program, Option } from "commander";
import { printFiglet } from "./printFiglet";
import { createConfigFile } from "./actions/createEnvFile";
import { startServerAction } from "./actions/startServerAction";
import { config, populateConfig } from "../config";
import packageInfo from "../../package.json";
import { startReplConsole } from "./actions/startReplConsole";

printFiglet();

program
  .command("start")
  .description("start server")
  .addOption(
    new Option("-p, --port <port>", "listening port").env("LISTEN_PORT")
  )
  .addOption(
    new Option("-H, --hostname <host>", "listening host").env("LISTEN_HOST")
  )
  .addOption(
    new Option(
      "-P, --trust-proxy",
      "behind reverse proxy, default:'false'"
    ).env("TRUST_PROXY")
  )
  .addOption(
    new Option(
      "--jwt-secret <jwtSecret>",
      "json-web-token secret used for token generation, default:'randomString'"
    ).env("JWT_SECRET")
  )
  .addOption(
    new Option(
      "--db <dbUrl>",
      "mongodb database url, default:'mongodb://127.0.0.1/'"
    ).env("DB_URL")
  )
  .addOption(
    new Option(
      "--db-name <dbName>",
      `mongodb database name, default:'${packageInfo.title}'`
    ).env("DB_NAME")
  )
  .addOption(
    new Option("-d, --debug", `show debug information, default:'false'`)
  )
  .action(async (options) => {
    await populateConfig();
    if (options.port) {
      config.listen_port = options.port;
    }
    if (options.hostname) {
      config.listen_host = options.hostname;
    }

    if (options.trustProxy) {
      config.trust_proxy = true;
    }

    if (options.jwtSecret) {
      config.jwt_secret = options.jwtSecret;
    }

    if (options.db) {
      config.db_url = options.db;
    }

    if (options.dbName) {
      config.db_name = options.dbName;
    }

    if (options.debug) {
      console.log(
        Object.keys(options)
          .map((key) => `options.${key}=${options[key]}`)
          .join("\n")
      );

      console.log(
        Object.keys(config)
          .map((key) => `config.${key}=${config[key]}`)
          .join("\n")
      );
    }

    startServerAction();
  });

program
  .command("config")
  .description("create default config file")
  .action(() => createConfigFile());

program
  .command("console")
  .description("start repl console")
  .action(() => startReplConsole());

program.parse();
