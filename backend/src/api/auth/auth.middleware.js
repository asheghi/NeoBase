import {getDebug} from "../../lib/debug.js";
import {extractToken, } from "../../lib/jwt-utils.js";
import { getCollection} from "../../lib/db/connector.js";

const log = getDebug('auth.middleware');

export const authenticateUserRequest = async (req, res, next) => {
  if (req.user && req.user._id) return next();
  try {
    const token = req.headers['x-auth-token']
    const {email} = extractToken(token);
    const Users = await getCollection('auth', req.project)
    req.user = await Users.findOne({email})
    req.user.auth_provider = 'auth';
  } catch (e) {
    log.debug('failed to authenticate', e.message);
  }
  return next();
};

export async function authGuard(req, res, next) {
  if (!req.user) return res.status(401).send();
  return next();
}
