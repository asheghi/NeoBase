import compression from "compression";
import { config } from "../../config/index";
import { NextFunction, Request, Response } from "express";

export const compressionMiddleware = config.compression
  ? compression()
  : (req: Request, res: Response, next: NextFunction) => next();
