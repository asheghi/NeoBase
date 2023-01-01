import bodyParser from "body-parser";
import Express, { Request } from "express";
import { z } from "zod";
import { getLogger } from "../../lib/debug";
import { authenticateUserRequest, authGuard } from "./auth.middleware";
import { AuthServiceType, getAuthService } from "./auth.service";
import {
  emailSchema,
  passwordSchema,
} from "../../validations/auth.validations";
import { validateSchema } from "../../lib/api-utils";
import { destroySession } from "../../lib/sesstion";
import { SessionType } from "../../types/session.type";

const log = getLogger("auth.api");
const app = Express.Router();

app.use(async (req: any, res, next) => {
  req.AuthService = await getAuthService(req.project);
  next();
});

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
  async (req: any, res) => {
    const {
      body: { email, password },
    } = req;
    try {
      const user = await req.AuthService.register(email, password);
      if (!user) return res.status(400).send("something is not right!");
      const token = req.AuthService.generateSession(user);
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
  async (req: Request & { AuthService: AuthServiceType }, res) => {
    const {
      body: { email, password },
    } = req;
    const user = await req.AuthService.login(email, password);
    if (!user) return res.status(400).json({ success: false });
    const token = await req.AuthService.generateSession(user);
    return res.json({ token });
  }
);

// private routes
app.use(authenticateUserRequest, authGuard);

app.get("/me", (req, res) => {
  const { email } = (req as any).user;
  res.json({ email });
});

app.get("/logout", async (req: Request & { session: SessionType }, res) => {
  await destroySession(req.session.key);
  res.json({ msg: "session destroyed!" })
})

export const ProjectAuthRouter = app;
