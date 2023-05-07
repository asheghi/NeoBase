import cors from "cors";
import { Request, Response, NextFunction } from "express";
import { config } from "../../config";

let it;
if (config.cors_origin) {
  it = cors({
    origin: config.cors_origin,
    credentials: true,
  });
} else {
  console.warn("cors origin configuration is not set!, starting without cors");

  it = (req: Request, res: Response, next: NextFunction) => {
    next();
  };
}

export const corsMiddleware = it;
