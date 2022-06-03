export default {
  jwtSecret:
    "devmode" ||
    import.meta.JWT_SECRET ||
    (Math.random() + 1).toString(36).substring(7),
};
