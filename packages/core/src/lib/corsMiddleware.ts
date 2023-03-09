import cors from "cors";
import { Request, Response, NextFunction } from "express";

export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = req.headers.origin;
  cors({
    credentials: true,
    origin: origin,
  })(req, res, next);
};
