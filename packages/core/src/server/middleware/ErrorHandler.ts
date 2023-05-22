import { NextFunction, Request, Response } from "express";

export const ExpressErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.json({ msg: err.message ?? err });
  console.error(err);
};
