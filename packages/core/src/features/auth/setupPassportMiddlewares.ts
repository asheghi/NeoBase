import { Application } from "express";
import MongoStore from "connect-mongo";
import { config } from "../../config";

const passport = require("passport");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const setupPassportMiddleware = (app: Application) => {
  app.use(cookieParser());
  console.log("fuck", config.jwt_secret);
  app.use(
    session({
      secret: config.jwt_secret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: `${config.db_url}${config.db_name}-session`,
      }),
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // app.use(passport.authenticate("session"));

  app.get("/login", (req, res) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (req.user) return res.redirect("/");
    return res.render("login");
  });

  app.get("/register", (req, res) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (req.user) return res.redirect("/");
    return res.render("register");
  });

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  });

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.username });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  // todo update
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.use(flash());
};

export default setupPassportMiddleware;
