import { getExpressApp } from "./getExpressApp.js";
import { config } from "../lib/config/index.js";

export async function startServer() {
  const app = await getExpressApp();
  const port = config.listen_port;
  const host = config.listen_host;
  const ssl = config.ssl;
  app.listen(port);
  console.log(`Server running at http${ssl ? "s" : ""}://${host}:${port}`);
}
