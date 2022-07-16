export default {
  // dynamic jwt secret invalidates tokens after restart
  jwtSecret:
    process.env.JWT_SECRET || process.env.NODE_ENV === "development"
      ? "dev-mode-jwt-token"
      : (Math.random() + 1).toString(36).substring(7),
};
