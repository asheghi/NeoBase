import express from "express";
import path from "path";
import { create } from "express-handlebars";
import packageInfo from "../../package.json";

export function configureHandleBars(app: express.Application) {
  const hbs = create({
    extname: "hbs",
    helpers: {
      title() {
        return packageInfo.title;
      },
    },
  });

  app.engine("hbs", hbs.engine);
  app.set("view engine", "hbs");
  app.set("views", path.join(__dirname, "../views"));
}
