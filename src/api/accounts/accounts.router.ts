import bodyParser from "body-parser";
import Express, { Request } from "express";
import { z } from "zod";
import { validateSchema } from "../../lib/api-utils";
import { getLogger } from "../../lib/debug";
import { createSession, SessionType } from "../../lib/session-store";
import {
  emailSchema,
  passwordSchema,
} from "../../validations/auth.validations";
import {
  accountGuard,
  authenticateAccountRequest,
} from "./accounts.middleware";
import { AccountsService } from "./accounts.service";

const log = getLogger("account:api");
const app = Express.Router();

const registerSchema = {
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
};

app.post(
  "/register",
  bodyParser.json(),
  validateSchema(registerSchema),
  async (req, res) => {
    const {
      body: { email, password },
    } = req as Request & typeof registerSchema;
    try {
      const user = await AccountsService.register(email, password);
      if (!user) return res.status(400).send("something is not right!");
      const session = await createSession(req, user, "account");
      const payload = {
        email: user.email,
        role: user.role,
        sid: session.id,
      };
      const token = AccountsService.generateToken(payload);
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
    } = req as Request & typeof loginSchema;

    const user = await AccountsService.login(email, password);
    if (!user) return res.status(400).json({ success: false });
    const session = await createSession(req, user, "account");
    const payload = {
      email: user.email,
      role: user.role,
      sid: session.id,
    };
    const token = AccountsService.generateToken(payload);
    return res.json({ token });
  }
);

app.use(authenticateAccountRequest as any, accountGuard as any);

app.get("/logout", async (req: Request & { session: SessionType }, res) => {
  await req.session.destroy();
  res.status(200).json({ msg: "success" });
});

app.get("/me", (req: Request & { session: SessionType }, res) => {
  const { session } = req;
  if (!session) return res.status(401).send();
  const { user, expireAt } = session;
  return res.json({ user, expireAt });
});

export const AccountsRouter = app;
