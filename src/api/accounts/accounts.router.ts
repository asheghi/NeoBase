import bodyParser from "body-parser";
import Express from "express";
import { z } from "zod";
import { validateSchema } from "../../lib/api-utils";
import { getLogger } from "../../lib/debug";
import {
  accountGuard,
  authenticateAccountRequest,
} from "./accounts.middleware";
import { AccountsService } from "./accounts.service";

const log = getLogger("account:api");
const app = Express.Router();

const registerSchema = {
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
};

app.post(
  "/register",
  bodyParser.json(),
  validateSchema(registerSchema),
  async (req, res) => {
    const {
      body: { email, password },
    } = req;
    try {
      const user = await AccountsService.register(email, password);
      if (!user) return res.status(400).send("something is not right!");
      const token = AccountsService.generateToken(user);
      return res.json({ token });
    } catch (e: any) {
      log.error(e);
      return res.status(422).json({ msg: e.message });
    }
  }
);

const loginSchema = {
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
};

app.post(
  "/login",
  bodyParser.json(),
  validateSchema(loginSchema),
  async (req, res) => {
    const {
      body: { email, password },
    } = req;
    const user = await AccountsService.login(email, password);
    if (!user) return res.status(400).json({ success: false });
    const token = AccountsService.generateToken(user);
    return res.json({ token });
  }
);

app.use(authenticateAccountRequest, accountGuard);

app.get("/me", (req: any, res) => {
  if (!req.user) return res.status(401).send();
  const { email } = req.user;
  return res.json({ email });
});

export const AccountsRouter = app;
