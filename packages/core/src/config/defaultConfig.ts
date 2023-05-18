import { randomString } from "../lib/randomString";
export type ConfigType = {
  cookie_secret: string;
  https: boolean;
  ssl_key: string | undefined;
  ssl_cert: string | undefined;
  db_url: string;
  db_name: string;
  cors_origin: string | undefined;
  simulate_slow_network: boolean;
  disable_morgan: boolean;
  morgan: string;
  listen_host: string;
  listen_port: number;
  trust_proxy: boolean;
  google_oauth_client_id: string | undefined;
  google_oauth_client_secret: string | undefined;
  github_oauth_client_id: string | undefined;
  github_oauth_client_secret: string | undefined;
  log_requests: boolean;
  compression: boolean;

  /* storage */
  s3_endpoint: string | undefined;
  s3_port: string | undefined;
  s3_ssl: boolean | undefined;
  s3_access_key: string | undefined;
  s3_secret_key: string | undefined;
  upload_path: string;
  s3_bucket_name: string;
};

// todo create a dev default values

export const defaultConfig: ConfigType = {
  //cookie
  cookie_secret:
    process.env.cookie_secret || process.env.NODE_ENV === "development"
      ? "dev-mode-jwt-token"
      : randomString() + randomString(),
  https: false,
  ssl_cert: undefined,
  ssl_key: undefined,

  // database
  db_url: "mongodb://127.0.0.1:27017/",
  db_name: "neobase",

  // server
  simulate_slow_network: false,
  disable_morgan: false,
  morgan: ":method :url :status :res[content-length] - :response-time ms",

  /**
   * server is listening on all interfaces by default
   * you can change it to 127.0.0.1 to listen only to localhost and expose api via a reverse proxy
   */
  listen_host: "0.0.0.0",
  listen_port: 8080,
  trust_proxy: false,
  /* default dev */
  cors_origin: "http://localhost:5173",
  log_requests: false,
  /*
    oAuth providers
   */
  google_oauth_client_id: undefined,
  google_oauth_client_secret: undefined,
  github_oauth_client_id: undefined,
  github_oauth_client_secret: undefined,

  upload_path: "/tmp/uploads/",
};
