import { NextFunction, Response } from "express";

// todo 2 fix type
export const adminGuard = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user === "admin") {
    return next();
  }
  return req.status(401).send();
};
