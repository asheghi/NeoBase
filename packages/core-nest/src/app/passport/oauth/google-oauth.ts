// import * as GoogleOAuth2 from "passport-google-oauth20";
// import { OAuth, OAuthProviders } from "../../../lib/auth-providers";
// import { config } from "../../../config";
// import passport from "passport";

export const setupGoogleOAuth = () => {
  // if (OAuth.isAvailable(OAuthProviders.Google)) {
  //   if (!config.google_oauth_client_id || !config.google_oauth_client_secret) {
  //     throw new Error("something is not right!");
  //   }
  //   passport.use(
  //     new GoogleOAuth2.Strategy(
  //       {
  //         clientID: config.google_oauth_client_id!,
  //         clientSecret: config.google_oauth_client_secret!,
  //       },
  //       function (accessToken, refreshToken, profile, cb) {
  //         console.log(
  //           "got user:accessToken, refreshToken, profile,",
  //           accessToken,
  //           refreshToken,
  //           profile
  //         );
  //         cb();
  //         // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //         //   return cb(err, user);
  //         // });
  //       }
  //     )
  //   );
  // }
};
