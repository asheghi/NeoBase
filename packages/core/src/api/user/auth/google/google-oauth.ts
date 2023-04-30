import express from "express";
import passport from "passport";

const app = express.Router();

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
