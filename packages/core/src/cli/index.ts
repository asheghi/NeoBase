import { program, Option } from "commander";
import { printFiglet } from "./misc/printFiglet";
import { createConfigFile } from "./actions/createEnvFile";
import { startReplConsole } from "./actions/startReplConsole";
import { config } from "../config/index";
import { createAdminUserAction } from "./actions/createAdminUserAction";
import { randomString } from "../lib/randomString";
import { manifest } from "../lib/manifest";
import * as dotenv from "dotenv";
import { envFormatter } from "./misc/envFormatter";

dotenv.config();

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
      "-C, --cors-origin <cors origin>",
      "add cors origin, e.g: http://domain.com"
    ).env("CORS_ORIGIN")
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
  .addOption(new Option("--https", `server as https server`).env("HTTPS"))
  .addOption(
    new Option("--ssl-cert <sslCert>", `ssl cert file content`).env("SSL_CERT")
  )
  .addOption(
    new Option("--ssl-key <sslKey>", `ssl key file content`).env("SSL_KEY")
  )
  .addOption(
    new Option(
      "--google-oauth-client-id <clientId>",
      `google oauth 2 client id`
    ).env("GOOGLE_OAUTH_CLIENT_ID")
  )
  .addOption(
    new Option(
      "--google-oauth-client-secret <clientSecret>",
      `google oauth 2 client id`
    ).env("GOOGLE_OAUTH_CLIENT_SECRET")
  )
  .addOption(
    new Option(
      "--github-oauth-client-id <clientId>",
      `github oauth 2 client id`
    ).env("GITHUB_OAUTH_CLIENT_ID")
  )
  .addOption(
    new Option(
      "--github-oauth-client-secret <clientSecret>",
      `github oauth 2 client id`
    ).env("GITHUB_OAUTH_CLIENT_SECRET")
  )
  .addOption(
    new Option("--s3-endpoint <S3 Rndpoint>", `object storage base url`).env(
      "S3_ENDPOINT"
    )
  )
  .addOption(
    new Option("--s3-port <number>", `s3 endpoint port`).env("S3_PORT")
  )
  .addOption(
    new Option("--s3-ssl", `use https to connect to s3 endpoint`).env("S3_SSL")
  )
  .addOption(
    new Option("--s3-access-key <accessKey>", `s3 storage access key`).env(
      "S3_ACCESS_KEY"
    )
  )
  .addOption(
    new Option("--s3-secret-key <secret key>", `s3 storage secret key`).env(
      "S3_SECRET_KEY"
    )
  )
  .addOption(
    new Option("--s3-bucket-name <bucket name>", `s3 bucket name`).env(
      "S3_BUCKET_NAME"
    )
  )
  .addOption(
    new Option("--upload-path <dbName>", `path to store uploaded files`).env(
      "UPLOAD_PATH"
    )
  )
  .addOption(
    new Option("-d, --debug", `show debug information, default:'false'`).env(
      "DDEBUG"
    )
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
          .map((key) => `options.${key}=${envFormatter(options[key])}`)
          .join("\n")
      );

      console.log(
        Object.keys(config)
          .map((key) => `config.${key}=${envFormatter(config[key])}`)
          .join("\n")
      );
    }

    if (options.googleOauthClientId || options.googleOauthClientSecret) {
      if (!(options.googleOauthClientId && options.googleOauthClientSecret)) {
        console.error(
          "Error: both Google OAuth client id and client secret must be passed!"
        );
        process.exit(0);
      }
    }

    if (options.googleOauthClientId) {
      config.google_oauth_client_id = options.googleOauthClientId;
    }

    if (options.googleOauthClientSecret) {
      config.google_oauth_client_secret = options.googleOauthClientSecret;
    }

    if (options.https) {
      if (!(options.sslCert && options.sslKey)) {
        console.error(
          "Error: ssl cert and ssl key are required for https mode"
        );
        process.exit(0);
      }
    }

    if (options.githubOauthClientId) {
      config.github_oauth_client_id = options.githubOauthClientId;
    }

    if (options.githubOauthClientSecret) {
      config.github_oauth_client_secret = options.githubOauthClientSecret;
    }

    if (options.https) {
      if (!(options.sslCert && options.sslKey)) {
        console.error(
          "Error: ssl cert and ssl key are required for https mode"
        );
        process.exit(0);
      }
    }

    // Storage, s3 configs
    const {
      s3Endpoint: s3_endpoint,
      s3Port: s3_port,
      s3Ssl: s3_ssl,
      s3AccessKey: s3_access_key,
      s3SecretKey: s3_secret_key,
      uploadPath: upload_path,
      s3BucketName: s3_bucket_name,
    } = options;

    config.s3_endpoint = s3_endpoint ?? config.s3_endpoint;
    config.s3_port = s3_port ?? config.s3_port;
    config.s3_ssl = s3_ssl ?? config.s3_ssl;
    config.s3_access_key = s3_access_key ?? config.s3_access_key;
    config.s3_secret_key = s3_secret_key ?? config.s3_secret_key;
    config.s3_bucket_name = s3_bucket_name ?? config.s3_bucket_name;
    config.upload_path = upload_path ?? config.upload_path;

    const { corsOrigin: cors_origin } = options;
    config.cors_origin = cors_origin ?? config.cors_origin;

    // lazy loading because some
    const { startServerAction } = require("./actions/startServerAction");

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
program
  .command("create-admin")
  .description("create admin user")
  .addOption(
    new Option("-U, --username <username>", `username`).default("superadmin")
  )
  .addOption(
    new Option("-P, --password <password>", `password`).default(
      randomString() + randomString()
    )
  )
  .action(async (options): Promise<any> => {
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
