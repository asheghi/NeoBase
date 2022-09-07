import { NextFunction, Response } from "express";
import { getLogger } from "../../lib/debug";
import { extractToken } from "../../lib/jwt-utils";
import { getSession, SessionType } from "../../lib/session-store";

const log = getLogger("account:middleware");

export const authenticateAccountRequest = async (
  _req: any,
  res: Response,
  next: NextFunction
) => {
  const req = _req as Request & { session: SessionType };
  if (req.session) {
    return next();
  }
  try {
    const token: string = req.headers["x-account-token"] as string;
    if (!token) return next();
    const { sid } = extractToken(token);
    const session = await getSession(sid);
    if (!session) return next();
    req.session = session;
  } catch (e: any) {
    log.debug("failed to authenticate", e.message);
  }
  return next();
};

export async function accountGuard(
  req: Request & { session: SessionType },
  res: Response,
  next: NextFunction
) {
  if (!req.session || req.session.level !== "account") {
    return res.status(401).send();
  }
  return next();
}
