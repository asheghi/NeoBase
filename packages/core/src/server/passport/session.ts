import MongoStore from "connect-mongo";
import session from "express-session";
import { config } from "../../config";

// todo validate mongo url
// todo add params to config
// todo validate config

export const sessionMiddleware = session({
  secret: config.cookie_secret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `${config.db_url}${config.db_name}-session`,
  }),
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
});
