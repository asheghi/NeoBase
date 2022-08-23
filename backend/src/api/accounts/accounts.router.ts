import * as bodyParser from "body-parser";
import * as Express from "express";
import { getLogger } from "../../lib/debug";
import {
  accountGuard,
  authenticateAccountRequest,
} from "./accounts.middleware";
import { AccountsService } from "./accounts.service";

const log = getLogger("account:api");
const app = Express.Router();
app.use((req, res, next) => {
  next();
  log.debug("is handling request");
});

app.post("/register", bodyParser.json(), async (req, res) => {
  const {
    body: { email, password },
  } = req;
  try {
    const user = await AccountsService.register(email, password);
    if (!user) return res.status(400).send("something is not right!");
    const token = AccountsService.generateToken(user);
    return res.json({ token });
  } catch (e: any) {
    console.error(e);
    return res.status(422).json({ msg: e.message });
  }
});

app.post("/login", bodyParser.json(), async (req, res) => {
  const {
    body: { email, password },
  } = req;
  const user = await AccountsService.login(email, password);
  if (!user) return res.status(400).json({ success: false });
  const token = AccountsService.generateToken(user);
  return res.json({ token });
});

// private routes
app.use(authenticateAccountRequest, accountGuard);

app.get("/me", (req: any, res) => {
  const { email } = req.user;
  res.json({ email });
});
export const AccountsRouter = app;
