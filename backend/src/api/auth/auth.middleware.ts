import { NextFunction, Response } from "express";
import { getCollection } from "../../lib/db/connector";
import { getLogger } from "../../lib/debug";
import { extractToken } from "../../lib/jwt-utils";

const log = getLogger("auth.middleware");

export const authenticateUserRequest = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user._id) return next();
  try {
    const token = req.headers["x-auth-token"];
    const { email } = extractToken(token);
    const Users = await getCollection("auth", req.project);
    req.user = await Users.findOne({ email });
    req.user.auth_provider = "auth";
  } catch (e: any) {
    log.debug("failed to authenticate", e.message);
  }
  return next();
};

export async function authGuard(req: any, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).send();
  }
  return next();
}
