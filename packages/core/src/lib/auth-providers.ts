import { config } from "../config";

export enum OAuthProviders {
  Google = "google",
  Github = "github",
}

let providers: OAuthProviders[];

const initProviders = () => {
  providers = [];
  // google
  if (config.google_oauth_client_id && config.google_oauth_client_secret) {
    providers.push(OAuthProviders.Google);
  }
  if (config.github_oauth_client_id && config.github_oauth_client_secret) {
    providers.push(OAuthProviders.Github);
  }
};

export const OAuth = {
  getProviders() {
    if (!providers) {
      initProviders();
    }

    return providers;
  },
  isAvailable(provider: OAuthProviders) {
    if (!providers) {
      initProviders();
    }
    return providers.includes(provider);
  },
};
