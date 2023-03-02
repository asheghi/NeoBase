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
      "--jwt-secret",
      "json-web-token secret used for token generation, default:'randomString'"
    ).env("JWT_SECRET")
  )
  .addOption(
    new Option(
      "--db",
      "mongodb database url, default:'mongodb://127.0.0.1/'"
    ).env("DB_URL")
  )
  .addOption(
    new Option(
      "--db-name",
      `mongodb database name, default:'${packageInfo.title}'`
    ).env("DB_NAME")
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

    if (options.jwtSeret) {
      config.jwt_secret = options.jwtSeret;
    }

    if (options.db) {
      config.db_url = options.db;
    }

    if (options.dbName) {
      config.db_name = options.dbName;
    }

    console.log(options);

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
