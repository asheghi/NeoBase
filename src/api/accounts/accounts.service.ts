import { getAccountCollection } from "../../lib/db/connector";
import { getLogger } from "../../lib/debug";
import * as JwtUtils from "../../lib/jwt-utils";
import { JwtPayloadType } from "../../types/auth";
import {
  emailSchema,
  passwordSchema,
  sessionIdSchema,
} from "../../validations/auth.validations";

const { comparePassword, generateTokenForPayload, hashPassword } = JwtUtils;
const log = getLogger("auth.service");
export const AccountsService = {
  async login(email: string, password: string) {
    emailSchema.parse(email);
    passwordSchema.parse(password);

    const Accounts = await getAccountCollection();
    const user = await Accounts.findOne({ email }).projection("-password");
    if (user) {
      const result = comparePassword(user.password, password);
      if (!result) return null;
      const userObject = user.toObject();
      delete userObject.password;
      // eslint-disable-next-line no-underscore-dangle
      delete userObject.__v;
      return userObject;
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
    const newUser = await Accounts.create({
      email,
      password: hashPassword(password),
    });
    const user = newUser.toObject();
    delete user.password;
    // eslint-disable-next-line no-underscore-dangle
    delete user.__v;
    return user;
  },
  generateToken(payload: JwtPayloadType) {
    sessionIdSchema.parse(payload.sid);
    emailSchema.parse(payload.email);
    return generateTokenForPayload(payload);
  },
  async findUserByEmail(email: string) {
    emailSchema.parse(email);
    const Accounts = await getAccountCollection();
    return Accounts.findOne({ email });
  },
};
