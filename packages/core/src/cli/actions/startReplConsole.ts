import repl from "node:repl";
import * as JwtUtils from "../../lib/jwt-utils";
import { config } from "../../lib/config/index";
import { getLogger } from "../../lib/getLogger";
import * as DbConnector from "../../lib/db-connector";
import { getAuthService } from "../../api/user/auth/auth.service";

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
