import repl from "node:repl";
import { config } from "../config/index.js";
import * as JwtUtils from "../lib/jwt-utils.js";
import { getLogger } from "../lib/debug.js";
import * as DbConnector from "../lib/db/connector.js";
import { AccountsService } from "../api/accounts/accounts.service.js";
import { getAuthService } from "../api/auth/auth.service.js";

const context = {
  config,
  ...JwtUtils,
  getLogger,
  ...DbConnector,
  AccountsService,
  getAuthService,
};

const replServer = repl.start({
  prompt: `Node (${process.version}) > `,
});

Object.keys(context).forEach((key) => {
  replServer.context[key] = context[key];
});

replServer.defineCommand("help", {
  help: "show help",
  action() {
    this.clearBufferedCommand();
    console.log(`help content`);
    this.displayPrompt();
  },
});

replServer.setupHistory("node_modules/.console_repl_history", (err, repl) => {
  if (err) console.error(err);
});
