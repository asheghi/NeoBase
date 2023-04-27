import { NextFunction, Response } from "express";

// todo 2 fix type
export const adminGuard = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(401).send();
};
