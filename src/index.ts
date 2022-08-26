import cors from "cors";
import Express from "express";
import morgan from "morgan";
import { ApiRouter } from "./api/api.router";
import { config, populateConfig } from "./config/index";

const bootstrap = async () => {
  await populateConfig();

  const app = Express();

  if (config.log_access) {
    app.use(morgan("dev"));
  }

  app.use(
    cors({
      optionsSuccessStatus: 200,
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
