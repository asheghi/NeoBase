import { NextFunction, Response, Request } from "express";
import { getAuthCollection } from "../../lib/db/connector";
import { getLogger } from "../../lib/debug";
import { extractToken } from "../../lib/jwt-utils";
import { UserType } from "../../types/user.type";

const log = getLogger("auth.middleware");
/**
 * express middleware which attemps to authenticate request
 */
export const authenticateUserRequest = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const req = _req as Request & { user: UserType; project: string | undefined };
  if (req.user && req.user._id) return next();
  try {
    const token = req.headers["x-auth-token"] as string | undefined;
    if (!token) return next();
    const { email } = extractToken(token);
    const Users = await getAuthCollection();
    req.user = await Users.findOne({ email });
    req.user.auth_provider = "auth";
  } catch (e) {
    log.debug("failed to authenticate", e.message);
  }
  return next();
};
/**
 * express middlewares which block un-authenticated request
 */
export async function authGuard(
  req: Request & { user?: UserType },
  res: Response,
  next: NextFunction
) {
  if (!req.user) return res.status(401).send();
  return next();
}
