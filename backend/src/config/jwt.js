export default {
  jwtSecret:import.meta.JWT_SECRET || (Math.random() + 1).toString(36).substring(7),
}
