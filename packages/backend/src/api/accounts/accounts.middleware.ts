import { NextFunction, Response } from "express";
import { getLogger } from "../../lib/debug";
import { extractToken } from "../../lib/jwt-utils";
import { getSession } from "../../lib/sesstion";
import { SessionType } from "../../types/session.type";
import { AuthType, UserType } from "../../types/user.type";
import { AccountsService } from "./accounts.service";

const log = getLogger("account:middleware");

export const authenticateAccountRequest = async (
  _req: any,
  res: Response,
  next: NextFunction
) => {
  const req = _req as Request & { user: UserType, session: SessionType };
  if (req.user && req.user._id) {
    return next();
  }
  try {
    const token: string = req.headers["x-account-token"];
    if (!token) return next();
    const session = await getSession(token);
    if (!session) return res.status(401).json({ msg: "session expired!" })
    req.session = session;
    const { email } = req.session;
    req.user = await AccountsService.findUserByEmail(email);
    if (!req.user) throw new Error(`user not found!, email:${email}`);
    req.user.authType = AuthType.Account;
  } catch (e: any) {
    log.debug("failed to authenticate", e.message);
  }
  return next();
};

export async function accountGuard(
  req: any,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.authType !== AuthType.Account) {
    return res.status(401).send();
  }
  return next();
}
