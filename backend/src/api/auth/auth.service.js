import {getDebug} from "../../lib/debug.js";
import {getCollection} from "../../lib/db/connector.js";
import {comparePassword, generateTokenForPayload, hashPassword} from "../../lib/jwt-utils.js";

const log = getDebug('auth.service');

export async function getAuthService(project) {
  const Users = await getCollection(project, 'users');
  return {
    Users,
    async login(email, password) {
      const user = await Users.findOne({email});
      if (user) {
        const result = comparePassword(user.password, password);
        return result ? user : null;
      }
      log.debug('user not found with email:', email);
      await new Promise((r) => {
        setTimeout(r, 500 + (Math.random() * 500));
      });
      return null;
    },
    async register(email, password) {
      const exists = await Users.findOne({email})
      if (exists) throw new Error('account already exists');
      return Users.create({
        email,
        password: hashPassword(password),
      });
    },
    generateToken(user) {
      return generateTokenForPayload({email: user.email});
    }
  }
}

