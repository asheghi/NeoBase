import cors from "cors";
import morgan from "morgan";
import express from "express";
import { ApiRouter } from "./api/api.router";
import { config, populateConfig } from "./config/index";
import { initSessionStore } from "./lib/session-store";

const bootstrap = async () => {
  await populateConfig();

  await initSessionStore();

  const app = express();

  if (config.log_access) {
    app.use(morgan("dev"));
  }

  app.use(
    cors({
      optionsSuccessStatus: 200,
      origin: "*",
    })
  );

  if (config.trust_proxy) {
    app.enable("trust proxy");
  }

  app.use("/api", ApiRouter);

  app.get("/", (req, res) => {
    res.send("hello from the other side!");
  });

  const hostname = config.listen_host;
  const port = config.listen_port;

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend is listening on http://${hostname}:${port}`);
  });
};

bootstrap();
