import { Application } from "express";
import MongoStore from "connect-mongo";
import { config, populateConfig } from "config";
import session from "express-session";

const passport = require("passport");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

export const setupPassportOnExpressApp = async (app: Application) => {
  await populateConfig();
  app.use(cookieParser());
  console.log("fuck", config.cookie_secret);
  app.use(
    session({
      secret: config.cookie_secret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: `${config.db_url}${config.db_name}-session`,
      }) as any,
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
};
