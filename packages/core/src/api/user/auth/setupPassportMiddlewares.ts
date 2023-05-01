import { Application } from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import { config } from "../../../config";
import passport from "passport";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import * as GoogleOAuth2 from "passport-google-oauth20";
import { OAuth, OAuthProviders } from "../../../lib/auth-providers";
import * as GithubOAuth2 from "passport-github2";
import { getAuthCollection } from "../../../lib/db-connector";

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

  if (OAuth.isAvailable(OAuthProviders.Google)) {
    if (!config.google_oauth_client_id || !config.google_oauth_client_secret) {
      throw new Error("something is not right!");
    }
    passport.use(
      new GoogleOAuth2.Strategy(
        {
          clientID: config.google_oauth_client_id!,
          clientSecret: config.google_oauth_client_secret!,
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

  if (OAuth.isAvailable(OAuthProviders.Github)) {
    if (!config.github_oauth_client_id || !config.github_oauth_client_secret) {
      throw new Error("something is not right!");
    }
    passport.use(
      new GithubOAuth2.Strategy(
        {
          clientID: config.github_oauth_client_id,
          clientSecret: config.github_oauth_client_secret,
          callbackURL: undefined!,
        },
        async function (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: any
        ) {
          const User = await getAuthCollection();
          const existing = await User.find({ emails: { $in: profile.emails } });

          if (existing && existing.length) {
            // update profile
            const user = existing[0];
            await User.updateOne(
              { _id: user._id },
              {
                $set: {
                  github_profile: profile,
                  avatar: profile.photos?.[0]?.value,
                  github_id: profile.id,
                  emails: [
                    ...user.emails,
                    ...profile.emails.map((it: any) => it.value),
                  ],
                  name: profile.displayName,
                },
              }
            );
            return done(null, user);
          } else {
            // create new user
            const user = await User.create({
              emails: profile.emails.map((it: any) => it.value),
              avatar: profile.photos?.[0]?.value,
              name: profile.displayName,
              github_id: profile.id,
              github_profile: profile,
            });

            return done(null, { provider: "github", ...user.toObject() });
          }
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
    const { username, role, emails, avatar, name, provider } = user;
    process.nextTick(function () {
      cb(null, {
        id: user._id,
        username,
        role,
        emails,
        avatar,
        name,
        provider,
      });
    });
  });

  passport.deserializeUser(function (user: any, cb: any) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};
