// import { config } from "../../../config";
// import { OAuth, OAuthProviders } from "../../../lib/auth-providers";
// import * as GithubOAuth2 from "passport-github2";
// import { getAuthCollection } from "../../../lib/db-connector";
// import { onlyUnique } from "../../../lib/utils";
// import passport from "passport";

export const setupGithubOAuth = () => {
  // if (OAuth.isAvailable(OAuthProviders.Github)) {
  //   if (!config.github_oauth_client_id || !config.github_oauth_client_secret) {
  //     throw new Error("something is not right!");
  //   }
  //   passport.use(
  //     new GithubOAuth2.Strategy(
  //       {
  //         clientID: config.github_oauth_client_id,
  //         clientSecret: config.github_oauth_client_secret,
  //         callbackURL: undefined!,
  //       },
  //       async function (
  //         accessToken: string,
  //         refreshToken: string,
  //         profile: any,
  //         done: any
  //       ) {
  //         const User = await getAuthCollection();
  //         const emails = profile.emails.map((it: any) => it.value);
  //         const existing = await User.find({ emails: { $in: emails } });
  //         if (existing && existing.length) {
  //           // update profile
  //           const user = existing[0];
  //           await User.updateOne(
  //             { _id: user._id },
  //             {
  //               $set: {
  //                 avatar: profile.photos?.[0]?.value,
  //                 github_id: profile.id,
  //                 emails: [...user.emails, ...emails].filter(onlyUnique),
  //                 name: profile.displayName,
  //                 github_profile: profile,
  //               },
  //             }
  //           );
  //           return done(null, user);
  //         } else {
  //           // create new user
  //           const user = await User.create({
  //             emails,
  //             avatar: profile.photos?.[0]?.value,
  //             name: profile.displayName,
  //             github_id: profile.id,
  //             github_profile: profile,
  //           });
  //           return done(null, { provider: "github", ...user.toObject() });
  //         }
  //       }
  //     )
  //   );
  // }
};
