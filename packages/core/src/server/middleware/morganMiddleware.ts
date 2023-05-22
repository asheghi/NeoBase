import morgan from "morgan";
import { config } from "../../config/index";
import { NextFunction, Request, Response } from "express";
export const morganMiddleware = config.log_requests
  ? morgan(config.morgan)
  : (req: Request, res: Response, next: NextFunction) => next();
