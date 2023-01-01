import { getAccountCollection } from "../../lib/db/connector";
import { getLogger } from "../../lib/debug";
import * as JwtUtils from "../../lib/jwt-utils";
import { generateSession } from "../../lib/sesstion";
import {
  emailSchema,
  passwordSchema,
} from "../../validations/auth.validations";

const { comparePassword, hashPassword } = JwtUtils;
const log = getLogger("auth.service");

type UserType = {
  email: string
}

export const AccountsService = {
  async login(email: string, password: string) {
    emailSchema.parse(email);
    passwordSchema.parse(password);

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
    emailSchema.parse(email);
    passwordSchema.parse(password);

    const Accounts = await getAccountCollection();
    const exists = await Accounts.findOne({ email });
    if (exists) throw new Error("account already exists");
    return Accounts.create({
      email,
      password: hashPassword(password),
    });
  },
  async generateSession(user: UserType) {
    const email = emailSchema.parse(user.email);
    const token = await generateSession({ email });
    return token;
  },
  async findUserByEmail(email: string) {
    emailSchema.parse(email);
    const Accounts = await getAccountCollection();
    return Accounts.findOne({ email });
  },
};
