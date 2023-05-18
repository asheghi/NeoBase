/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Application, Handler, NextFunction, Request, Response } from "express";

import passport from "passport";
import flash from "connect-flash";
import cookieParser from "cookie-parser";

import { Server } from "socket.io";
import { sessionMiddleware } from "./session";
import { setupGoogleOAuth } from "./oauth/google-oauth";
import { setupGithubOAuth } from "./oauth/github-oauth";

export const setupPassport = (app: Application, io: Server) => {
  // express app stuff
  app.use(cookieParser());
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // socket.io stuff
  const wrap =
    (middleware: Handler) => (socket: { request: any }, next: any) => {
      // @ts-ignore
      return middleware(socket.request, {}, next);
    };
  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  // basic user model stuff
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

  // OAuth providers
  setupGoogleOAuth();
  setupGithubOAuth();
};
