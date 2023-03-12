import repl from "node:repl";
import * as JwtUtils from "../../lib/jwt-utils.js";
import { config } from "../../lib/config/index.js";
import { getLogger } from "../../lib/getLogger.js";
import { getAuthService } from "../../features/user/apis/auth/auth.service.js";
import * as DbConnector from "../../lib/db-connector.js";

export const startReplConsole = () => {
  const context: any = {
    config,
    ...JwtUtils,
    getLogger,
    getAuthService,
    ...DbConnector,
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
      this.displayPrompt();
    },
  });

  replServer.setupHistory("node_modules/.console_repl_history", (err) => {
    if (err) console.error(err);
  });
};
