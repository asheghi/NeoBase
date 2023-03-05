import cors from "cors";
import Express from "express";
import morgan from "morgan";
import { engine as handlebars } from "express-handlebars";
import path from "path";
import { create } from "ionicons/icons";
import { ApiRouter } from "./api/api.router";
import { config, populateConfig } from "./config/index";
import { configureHandleBars } from "./lib/configureHandleBars";

export const startServer = async () => {
  await populateConfig();

  const app = Express();

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

  configureHandleBars(app);

  app.get("/", (req, res) => {
    res.render("home");
  });
  app.get("/auth/login", (req, res) => {
    res.render("login");
  });
  app.get("/auth/register", (req, res) => {
    res.render("register");
  });

  const hostname = config.listen_host;
  const port = config.listen_port;

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend is listening on http://${hostname}:${port}`);
  });
};
