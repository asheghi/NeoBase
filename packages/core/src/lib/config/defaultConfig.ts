import { randomString } from "../randomString";
export const defaultConfig = {
  //cookie
  cookie_secret:
    process.env.cookie_secret || process.env.NODE_ENV === "development"
      ? "dev-mode-jwt-token"
      : randomString() + randomString(),
  domain: "",
  ssl: false,

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
};
