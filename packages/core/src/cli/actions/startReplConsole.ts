import repl from "node:repl";
import { getAuthService } from "../../api/auth/auth.service";
import * as DbConnector from "../../lib/db/connector";
import { getLogger } from "../../lib/debug";
import * as JwtUtils from "../../lib/jwt-utils";
import { config } from "../../config";

export const startReplConsole = () => {
  const context: any = {
    config,
    ...JwtUtils,
    getLogger,
    ...DbConnector,
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
      this.displayPrompt();
    },
  });

  replServer.setupHistory("node_modules/.console_repl_history", (err) => {
    if (err) console.error(err);
  });
};
