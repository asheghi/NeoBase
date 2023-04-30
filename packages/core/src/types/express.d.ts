import { User } from "./user.type";
declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
    }
  }
}
