import {comparePassword, generateTokenForPayload, hashPassword} from "../../lib/jwt-utils.js";
import {getAccountCollection} from "../../lib/db/connector.js";
import {getDebug} from "../../lib/debug.js";

const log = getDebug('auth.service');

export const AuthService = {
  async login(email, password) {
    const Accounts = await getAccountCollection()
    const user = await Accounts.findOne({ email });
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
    const Accounts = await getAccountCollection()
    const exists = await Accounts.findOne({email})
    if (exists) throw new Error('account already exists');
    return Accounts.create({
      email,
      password: hashPassword(password),
    });
  },
  generateToken(user) {
    return generateTokenForPayload({email: user.email});
  }
}

