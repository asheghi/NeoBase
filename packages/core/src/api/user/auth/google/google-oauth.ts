import express from "express";
import passport from "passport";
import { OAuth, OAuthProviders } from "../../../../lib/auth-providers";

const app = express.Router();

app.use((req, res, next) => {
  if (OAuth.isAvailable(OAuthProviders.Google)) {
    return next();
  }
  return res.status(400).json({
    msg: "google auth provider is not configured",
  });
});

app.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

app.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

export const GoogleOAuthRouter = app;
