import { getAccountCollection } from "../../lib/db/connector";
import { getLogger } from "../../lib/debug";
import {
  comparePassword,
  generateTokenForPayload,
  hashPassword,
} from "../../lib/jwt-utils";

const log = getLogger("auth.service");

export const AccountsService = {
  async login(email: string, password: string) {
    const Accounts = await getAccountCollection();
    const user = await Accounts.findOne({ email });
    if (user) {
      const result = comparePassword(user.password, password);
      return result ? user : null;
    }
    log.debug("user not found with email:", email);
    await new Promise((r) => {
      setTimeout(r, 500 + Math.random() * 500);
    });
    return null;
  },
  async register(email: string, password: string) {
    const Accounts = await getAccountCollection();
    const exists = await Accounts.findOne({ email });
    if (exists) throw new Error("account already exists");
    return Accounts.create({
      email,
      password: hashPassword(password),
    });
  },
  generateToken(user: any) {
    log.debug("generate token called for:", user.email);
    return generateTokenForPayload({ email: user.email });
  },
  async findUserByEmail(email: string) {
    const Accounts = await getAccountCollection();
    return Accounts.findOne({ email });
  },
};
