import Express from "express";
import bodyParser from "body-parser";
import {getAuthService} from "./auth.service.js";
import {authenticateRequest, authGuard} from "./auth.middleware.js";

const app = Express.Router();
app.use(async (req, res, next) => {
  req.AuthService = await getAuthService(req.params.project);
  next();
})

app.post('/register', bodyParser.json(), async (req, res) => {
  const {body: {email, password}} = req;
  try {
    const user = await req.AuthService.register(email, password);
    if (!user) return res.status(400).send('something is not right!');
    const token = req.AuthService.generateToken(user);
    return res.json({token});
  } catch (e) {
    console.error(e);
    return res.status(422).json({msg: e.message});
  }

});

app.post('/login', bodyParser.json(), async (req, res) => {
  const {body: {email, password}} = req;
  const user = await req.AuthService.login(email, password);
  if (!user) return res.status(400).json({success: false});
  const token = req.AuthService.generateToken(user);
  res.json({token});
});

//private routes
app.use(authenticateRequest, authGuard);

app.get('/me', (req, res) => {
  const {email} = req.user;
  res.json({email});
});

export const ProjectAuthRouter = app;
