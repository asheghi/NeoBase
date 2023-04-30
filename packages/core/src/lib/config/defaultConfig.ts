import { randomString } from "../randomString";
export type ConfigType = {
  cookie_secret: string;
  domain: string;
  https: boolean;
  ssl_key: string | undefined;
  ssl_cert: string | undefined;
  db_url: string;
  db_name: string;
  simulate_slow_network: boolean;
  disable_morgan: boolean;
  morgan: string;
  listen_host: string;
  listen_port: number;
  trust_proxy: boolean;
  google_oauth_client_id: string | undefined;
  google_oauth_client_secret: string | undefined;
  cors_origin: string | undefined;
};

export const defaultConfig: ConfigType = {
  //cookie
  cookie_secret:
    process.env.cookie_secret || process.env.NODE_ENV === "development"
      ? "dev-mode-jwt-token"
      : randomString() + randomString(),
  domain: "",
  https: false,
  ssl_cert: undefined,
  ssl_key: undefined,

  // database
  db_url: "mongodb://localhost:27017/",
  db_name: "neobase",

  // server
  simulate_slow_network: false,
  disable_morgan: false,
  morgan: ":method :url :status :res[content-length] - :response-time ms",

  /**
   * server is listening on all interfaces by default
   * you can change it to 127.0.0.1 to listen only to localhost and expose api via a reverse proxy
   */
  listen_host: "localhost",
  listen_port: 8080,
  trust_proxy: false,
  google_oauth_client_id: undefined,
  google_oauth_client_secret: undefined,
  cors_origin: "http://localhost:5173",
};
