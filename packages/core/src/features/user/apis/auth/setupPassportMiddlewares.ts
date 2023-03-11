import { Application } from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import { config } from "../../../../lib/config";

const passport = require("passport");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

// todo 1 fix types
export const setupPassportOnExpressApp = async (app: Application) => {
  app.use(cookieParser());
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

  // passport.authenticate("local", {
  //   successRedirect: "/",
  //   failureRedirect: "/login",
  // });

  passport.serializeUser(function (
    user: any,
    cb: (err: any, user: any) => void
  ) {
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.username, role: user.role });
    });
  });

  passport.deserializeUser(function (user: any, cb: any) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};
