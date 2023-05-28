import passport from 'passport';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { Config } from '../../modules';
import session from 'express-session';
import mongoConnect from 'connect-mongo';

export const setupPassport = (app: INestApplication) => {
  const config = app.get<Config>(Config);
  app.use(cookieParser());
  app.use(
    session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      store: mongoConnect.create({
        mongoUrl: config.session.db_url,
      }),
      cookie: {
        maxAge: config.session.max_age * 24 * 60 * 60 * 1000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // socket.io stuff
  // const wrap =
  //   (middleware: Handler) => (socket: { request: any }, next: any) => {
  //     // @ts-ignore
  //     return middleware(socket.request, {}, next);
  //   };
  // io.use(wrap(sessionMiddleware));
  // io.use(wrap(passport.initialize()));
  // io.use(wrap(passport.session()));

  // basic user model stuff
  passport.serializeUser(function (
    user: any,
    cb: (err: any, user: any) => void,
  ) {
    const { email, name } = user;
    process.nextTick(function () {
      cb(null, {
        id: user._id,
        email,
        name,
      });
    });
  });

  passport.deserializeUser(function (user: any, cb: any) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  // OAuth providers
  // setupGoogleOAuth();
  // setupGithubOAuth();
};
