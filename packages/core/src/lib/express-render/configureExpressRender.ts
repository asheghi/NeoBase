// noinspection TypeScriptValidateJSTypes

import fs from "fs";
import path from "path";
import { createExpressRender } from "./index";
import packageInfo from "../../../package.json";

const shortDelimiters = ["<#", "#>"];
const scriptDelimiters = ["<script node>", "</script>"];
const vm = require("node:vm");

const defaultContext = {
  pageTitle: packageInfo.title,
  foo: "bar",
};

function compute(source, context, delimiters) {
  const [a, b] = delimiters;
  const pointer = 0;
  let computed = source;
  while (computed.indexOf(a, pointer) > -1) {
    const start = computed.indexOf(a, pointer);
    const end = computed.indexOf(b, start);
    const script = computed.substring(start + a.length, end);
    const result = vm.runInContext(script, context);
    const before = computed.substring(0, start);
    const after = computed.substring(end + b.length, computed.length);
    computed = before + result + after;
  }

  return computed;
}

export function configureExpressRender(app) {
  const renderer = createExpressRender();
  app.engine("html", async (filePath, options, callback) => {
    const template = (await fs.readFileSync(filePath)).toString();

    const layout = (
      await fs.readFileSync(
        path.join(
          options.settings.views,
          "layouts",
          `${options.layout ?? "main"}.html`
        )
      )
    ).toString();

    const context = vm.createContext({ ...defaultContext, ...options });
    const finalTemplate = layout.replace("<% body %>", template);

    const computed = compute(
      compute(finalTemplate, context, shortDelimiters),
      context,
      scriptDelimiters
    );
    callback(null, computed);
  });
  app.set("views", path.join(__dirname, "../../views"));
  app.set("view engine", "html");
}
