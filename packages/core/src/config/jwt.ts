const randomString = () => {
  return (Math.random() + 1).toString(36).substring(7);
};
export default {
  // dynamic jwt secret invalidates tokens after restart
  jwt_secret:
    process.env.JWT_SECRET || process.env.NODE_ENV === "development"
      ? "dev-mode-jwt-token"
      : randomString() + randomString(),
};
