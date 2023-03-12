import bodyParser from "body-parser";
import Express from "express";
import { z } from "zod";
import { getAuthService } from "./auth.service.js";
import {
  usernameSchema,
  passwordSchema,
} from "./validations/auth.validations.js";
import { getLogger } from "../../../../lib/getLogger.js";
import { authGuard } from "../../../../lib/middleware/authGuard.js";
import { validateSchema } from "../../../../lib/validateSchema.js";

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
      body: { username, password },
    } = req;
    try {
      const user = await req.AuthService.register(username, password);
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
    username: z.string(),
    password: z.string(),
  }),
};

app.post(
  "/login/password",
  validateSchema(loginSchema),
  async (req: any, res, next) => {
    const {
      body: { username, password },
    } = req;
    const user = await req.AuthService.login(username, password);
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

// private routes
app.use(authGuard);

app.get("/me", (req, res) => {
  const { username } = (req as any).user;
  res.json({ username });
});

app.post("/logout", function (req, res, next) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.json({ success: true });
  });
});

export const AuthApiRouter = app;
