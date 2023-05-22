import { Request, Response, NextFunction } from "express";

// todo 1 extend request type
export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  // todo 1 fix
  if ((req as any).user) {
    next();
  } else {
    res.status(401).send();
  }
};
