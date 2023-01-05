import { NextFunction, Response, Request } from "express";
import { getAuthCollection } from "../../lib/db/connector";
import { getLogger } from "../../lib/debug";
import { getSession } from "../../lib/sesstion";
import { SessionType } from "../../types/session.type";
import { AuthType, UserType } from "../../types/user.type";

const log = getLogger("auth.middleware");
/**
 * express middleware which attemps to authenticate request
 */
export const authenticateUserRequest = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const req = _req as Request & { session?: SessionType, user: UserType; project: string | undefined };
  if (req.user && req.user._id) return next();
  try {
    const token = req.headers["x-auth-token"] as string | undefined;
    if (!token) return next();
    const session = await getSession(token);
    if (!session) return res.status(401).json({ msg: "session expired!" })
    req.session = session;
    const { email } = session;
    if (!req.project) throw new Error("project was not set on request.");
    const Users = await getAuthCollection(req.project);
    req.user = await Users.findOne({ email });
    req.user.authType = AuthType.User;
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
