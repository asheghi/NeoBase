import * as bodyParser from "body-parser";
import * as Express from "express";
import { getLogger } from "../../lib/debug";
import { authenticateUserRequest, authGuard } from "./auth.middleware";
import { getAuthService } from "./auth.service";

const log = getLogger("auth.api");
const app = Express.Router();

app.use((req, res, next) => {
  next();
  log.debug("is handling request");
});

app.use(async (req: any, res, next) => {
  req.AuthService = await getAuthService(req.project);
  next();
});

app.post("/register", bodyParser.json(), async (req: any, res) => {
  const {
    body: { email, password },
  } = req;
  try {
    const user = await req.AuthService.register(email, password);
    if (!user) return res.status(400).send("something is not right!");
    const token = req.AuthService.generateToken(user);
    return res.json({ token });
  } catch (e: any) {
    console.error(e);
    return res.status(422).json({ msg: e.message });
  }
});

app.post("/login", bodyParser.json(), async (req: any, res) => {
  const {
    body: { email, password },
  } = req;
  const user = await req.AuthService.login(email, password);
  if (!user) return res.status(400).json({ success: false });
  const token = req.AuthService.generateToken(user);
  return res.json({ token });
});

// private routes
app.use(authenticateUserRequest, authGuard);

app.get("/me", (req, res) => {
  const { email } = (req as any).user;
  res.json({ email });
});

export const ProjectAuthRouter = app;
