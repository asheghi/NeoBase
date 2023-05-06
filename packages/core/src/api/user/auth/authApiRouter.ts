import bodyParser from "body-parser";
import Express from "express";
import { z } from "zod";
import { getAuthService } from "./auth.service";
import { usernameSchema, passwordSchema } from "./validations/auth.validations";
import { getLogger } from "../../../lib/getLogger";
import { authGuard } from "../../../lib/middleware/authGuard";
import { validateSchema } from "../../../lib/validateSchema";
import { GoogleOAuthRouter } from "./google/google-oauth";
import { Services } from "../../../lib/services";
import { OAuth } from "../../../lib/auth-providers";
import { GithubOAuthRouter } from "./github/github-oauth";

const log = getLogger("auth.api");
const app = Express.Router();

app.use(async (req: any, res, next) => {
  req.AuthService = await getAuthService();
  next();
});

const registerSchema = {
  body: z.object({
    username: usernameSchema,
    password: passwordSchema,
  }),
};

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

app.post(
  "/register/password",
  validateSchema(registerSchema),
  async (req: any, res, next) => {
    const {
      body: { email, username, password },
    } = req;
    try {
      const user = await req.AuthService.register({
        email,
        username,
        password,
      });
      if (!user) return res.status(400).send("something is not right!");
      const error = await new Promise((resolve) => {
        req.login(user, function (err: any) {
          if (err) {
            return resolve(err);
          }
          resolve(null);
        });
      });
      if (error) {
        return next(error);
      }
      if (error) {
        return res.status(500).json({ success: false });
      }

      return res.json({ success: true });
    } catch (e: any) {
      log.error(e);
      return res.status(422).json({ msg: e.message });
    }
  }
);

const loginSchema = {
  body: z.object({
    username: usernameSchema,
    password: passwordSchema,
  }),
};

app.post(
  "/login/password",
  validateSchema(loginSchema),
  async (req: any, res) => {
    const {
      body: { username, password, email },
    } = req;
    const user = await req.AuthService.login({ email, username, password });
    if (!user) return res.status(400).json({ success: false });
    const error = await new Promise((resolve) => {
      req.login(user, function (err: any) {
        if (err) {
          return resolve(err);
        }
        resolve(null);
      });
    });

    if (error) {
      return res.status(500).json({ success: false });
    }

    return res.json({ success: true });
  }
);

app.use("/google", GoogleOAuthRouter);
app.use("/github", GithubOAuthRouter);

app.get("/oauth-providers", (req, res) => {
  return res.json(OAuth.getProviders());
});

// private routes
app.use(authGuard);

app.get("/me", (req, res) => {
  const { id, username, role, emails, avatar, name, provider } = (req as any)
    .user;
  res.json({ id, username, role, emails, avatar, name, provider });
});

app.post("/logout", function (req, res, next) {
  const userId = (req.user as any).id;
  const authChannel = "auth-" + userId;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    Services.getIoService().emit(authChannel, "logout");
    return res.json({ success: true });
  });
});

export const AuthApiRouter = app;
