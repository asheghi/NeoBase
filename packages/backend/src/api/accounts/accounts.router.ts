import bodyParser from "body-parser";
import Express, { Request } from "express";
import { UserType } from "user.type";
import { z } from "zod";
import { validateSchema } from "../../lib/api-utils";
import { getLogger } from "../../lib/debug";
import { destroySession } from "../../lib/sesstion";
import { SessionType } from "../../types/session.type";
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
      const token = await AccountsService.generateSession(user);
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
    const token = await AccountsService.generateSession(user);
    return res.json({ token });
  }
);

app.use(authenticateAccountRequest, accountGuard);

app.get("/me", (req, res) => {
  const { user } = req as Request & { user: UserType };
  if (!user) return res.status(401).send();
  const { email } = user;
  return res.json({ email });
});

app.get("/logout", async (req: Request & { session?: SessionType }, res) => {
    await destroySession(req.session.key);
    res.json({msg:"session destroyed!"})
})

export const AccountsRouter = app;
