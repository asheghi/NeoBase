import {verifyRequest} from "../../lib/jwt-utils.js";
import {getDebug} from "../../lib/debug.js";
const log = getDebug('auth.middleware');

export const authenticateRequest = (req, res, next) => {
  try {
    verifyRequest(req);
  } catch (e) {
    log.debug('failed to authenticate',e.message);
  }
  return next();
};

export async function authGuard(req, res, next) {
  if (!req.user) return res.status(401).send();
  return next();
}
