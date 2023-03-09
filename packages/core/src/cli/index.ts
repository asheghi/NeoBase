import { program, Option } from "commander";
import { printFiglet } from "./printFiglet";
import { createConfigFile } from "./actions/createEnvFile";
import { startServerAction } from "./actions/startServerAction";
import { startReplConsole } from "./actions/startReplConsole";
import { manifest } from "../lib/manifest";
import { config } from "../lib/config";

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
      "--cookie-secret <cookieSecret>",
      "json-web-token secret used for token generation, default:'randomString'"
    ).env("cookie_secret")
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
      `mongodb database name, default:'${manifest.title}'`
    ).env("DB_NAME")
  )
  .addOption(
    new Option("-d, --debug", `show debug information, default:'false'`)
  )
  .action(async (options) => {
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
