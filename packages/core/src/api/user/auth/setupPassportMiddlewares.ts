import { Application } from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import { config } from "../../../lib/config";
import passport from "passport";
import flash from "connect-flash";
import cookieParser from "cookie-parser";

export const setupPassportOnExpressApp = (app: Application) => {
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
