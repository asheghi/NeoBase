import { getExpressApp } from "./getExpressApp";
import { config } from "../config/index";
import http from "node:http";
import https from "node:https";
import { getLogger } from "../lib";
import { io } from "./ioServer";

const log = getLogger("StartServer");

export async function startServer() {
  const app = await getExpressApp();
  const port = config.listen_port;
  const host = config.listen_host;
  const server = config.https
    ? https.createServer({ key: config.ssl_key, cert: config.ssl_cert }, app)
    : http.createServer(app);

  io.attach(server);

  server.listen(config.listen_port, config.listen_host, () => {
    log.info(
      `Server listening at http${config.https ? "s" : ""}://${host}:${port}`
    );
  });
}
