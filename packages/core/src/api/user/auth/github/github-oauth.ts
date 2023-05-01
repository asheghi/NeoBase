import express from "express";
import passport from "passport";
import { OAuth, OAuthProviders } from "../../../../lib/auth-providers";

const app = express.Router();

app.use((req, res, next) => {
  if (OAuth.isAvailable(OAuthProviders.Github)) {
    return next();
  }
  return res.status(400).json({
    msg: "Github auth provider is not configured",
  });
});

app.get("/", (req, res, next) => {
  const { returnTo } = req.query;
  const state = returnTo as any;
  const authenticator = passport.authenticate("github", {
    scope: ["user:email"],
    state,
  });
  authenticator(req, res, next);
});

app.get(
  "/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const returnTo = Buffer.from(String(req.query?.state), "base64").toString(
        "ascii"
      );

      if (typeof returnTo === "string") {
        return res.redirect(returnTo);
      }
    } catch {
      // just redirect normally below
    }
    // todo redirect to client and get client from config
    res.redirect("/");
  }
);

export const GithubOAuthRouter = app;
