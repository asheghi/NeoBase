import cors from "cors";
import Express from "express";
import morgan from "morgan";
import { configureExpressRender } from "lib/express-render/configureExpressRender";
import { config, populateConfig } from "config";
import { authGuard } from "lib/authGuard";
import { ApiRouter } from "./api/api.router";
import { setupPassportOnExpressApp } from "./features/auth";
import { configureDashboardExpressApp } from "./features/dashboard";

export const startServer = async () => {
  await populateConfig();

  const app = Express();

  await setupPassportOnExpressApp(app);

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

  configureExpressRender(app);

  app.use("/api", ApiRouter);

  app.get("/", authGuard, (req, res) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.render("home", { user: req.user });
  });

  const hostname = config.listen_host;
  const port = config.listen_port;

  configureDashboardExpressApp(app);

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend is listening on http://${hostname}:${port}`);
  });
};
