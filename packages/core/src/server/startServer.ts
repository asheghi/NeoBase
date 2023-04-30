import { getExpressApp } from "./getExpressApp";
import { config } from "../lib/config/index";
import http from "node:http";
import https from "node:https";
import { Server as SocketIoServer } from "socket.io";
import { getLogger } from "../lib";
import { Services } from "../lib/services";

const log = getLogger("StartServer");

export async function startServer() {
  const app = await getExpressApp();
  const port = config.listen_port;
  const host = config.listen_host;
  const server = config.https
    ? https.createServer({ key: config.ssl_key, cert: config.ssl_cert }, app)
    : http.createServer(app);

  const io = new SocketIoServer(server, {
    cors: {
      origin: config.cors_origin,
      methods: ["GET", "POST"],
      // allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });
  Services.setIoService(io);

  server.listen(config.listen_port, config.listen_host, () => {
    log.info(
      `Server listening at http${config.https ? "s" : ""}://${host}:${port}`
    );
  });
}
