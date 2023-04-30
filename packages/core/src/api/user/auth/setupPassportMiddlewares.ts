import { Application } from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import { config } from "../../../lib/config";
import passport from "passport";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import * as GoogleOAuth2 from "passport-google-oauth20";

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

  if (config.google_oauth_client_id && config.google_oauth_client_secret) {
    passport.use(
      new GoogleOAuth2.Strategy(
        {
          clientID: config.google_oauth_client_id,
          clientSecret: config.google_oauth_client_secret,
          callbackURL: "http://localhost:8080/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, cb) {
          console.log(
            "got user:accessToken, refreshToken, profile,",
            accessToken,
            refreshToken,
            profile
          );
          cb();
          // User.findOrCreate({ googleId: profile.id }, function (err, user) {
          //   return cb(err, user);
          // });
        }
      )
    );
  }

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
