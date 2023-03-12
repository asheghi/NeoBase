import morgan from "morgan";
import { config } from "../config/index.js";
import { NextFunction, Request, Response } from "express";
export const morganMiddleware = config.debug
  ? morgan(config.morgan)
  : (req: Request, res: Response, next: NextFunction) => next();
