import cors from "cors";
import { Request, Response, NextFunction } from "express";
import { config } from "../../config";

const whitelist = config.cors_origin?.split(",") ?? [];

let it;
if (config.cors_origin) {
  it = cors({
    origin: function (origin, callback) {
      if ((origin && whitelist.includes(origin)) || true) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });
} else {
  console.warn("cors origin configuration is not set!, starting without cors");

  it = (req: Request, res: Response, next: NextFunction) => {
    next();
  };
}

export const corsMiddleware = it;
