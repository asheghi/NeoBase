import cors from "cors";
import { Request, Response, NextFunction } from "express";

export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { origin } = req.headers;
  cors({
    credentials: true,
    origin,
  })(req, res, next);
};
