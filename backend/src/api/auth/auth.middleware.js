import {getDebug} from "../../lib/debug.js";
import {verifyRequest} from "../../lib/jwt-utils.js";
import {getAccountCollection, getCollection} from "../../lib/db/connector.js";

const log = getDebug('auth.middleware');

export const authenticateUserRequest = async (req, res, next) => {
  if (req.user && req.user._id) return next();
  try {
    verifyRequest(req);
    if (req.user) {
      const Users = await getCollection('auth', req.params.project)
      req.user = await Users.findOne({email: req.user.email})
      req.user.auth_provider = 'auth';
    }
  } catch (e) {
    log.debug('failed to authenticate', e.message);
  }
  return next();
};

export async function authGuard(req, res, next) {
  if (!req.user) return res.status(401).send();
  return next();
}
