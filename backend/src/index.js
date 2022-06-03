import Express from "express";
import morgan from "morgan";
import { config } from "./config/index.js";
import { ApiRouter } from "./api/api.router.js";

const app = Express();

if (config.log_access) {
  app.use(morgan("dev"));
}

app.use("/api", ApiRouter);

app.get("/", (req, res) => {
  res.send("hello from the other side!");
});

app.listen(7585, "0.0.0.0", () => {
  console.log("Backend is listening on http://0.0.0.0:7585");
});
