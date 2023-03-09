const randomString = () => {
  return (Math.random() + 1).toString(36).substring(7);
};
export default {
  cookie_secret:
    process.env.cookie_secret || process.env.NODE_ENV === "development"
      ? "dev-mode-jwt-token"
      : randomString() + randomString(),
};
