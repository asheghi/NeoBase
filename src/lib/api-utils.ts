import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import getLogger from "./debug";

const log = getLogger("routeValidation");

export type ValidationSchemaType = {
  body?: z.ZodObject<any>;
  query?: z.ZodObject<any>;
  params?: z.ZodObject<any>;
};

export const validateSchema =
  (schema: ValidationSchemaType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        schema.body.parse(req.body);
      }
      if (schema.query) {
        schema.query.parse(req.query);
      }
      if (schema.params) {
        schema.params.parse(req.params);
      }
    } catch (e) {
      log.error(req.path, e.message);
      return res.status(400).json(e.issues);
    }
    return next();
  };
