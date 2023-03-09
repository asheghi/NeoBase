import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { getLogger } from "./getLogger";

const log = getLogger("routeValidation");

type ValidationSchemaType = {
  body?: z.ZodAny;
  params?: z.ZodAny;
  query?: z.ZodAny;
};

export const validateSchema =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body && schema.body.parse) {
        schema.body.parse(req.body);
      }
      if (schema.query && schema.query.parse) {
        schema.query.parse(req.query);
      }
      if (schema.params && schema.params.parse) {
        schema.params.parse(req.params);
      }
    } catch (e: any) {
      log.error(req.path, e.message ?? e);
      return res.status(400).json(e.issues);
    }
    return next();
  };
