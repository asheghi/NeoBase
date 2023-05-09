import {
  usernameSchema,
  passwordSchema,
  emailSchema,
} from "./validations/auth.validations";
import {
  comparePassword,
  generateTokenForPayload,
  hashPassword,
} from "../../../lib/jwt-utils";
import { getLogger } from "../../../lib/getLogger";
import { getAuthCollection } from "../../../lib/db-connector";

const log = getLogger("auth.service");

export type UserService = ReturnType<typeof getAuthService>;

// todo 2 implement dependency injection!
export async function getAuthService() {
  const Users = await getAuthCollection();
  return {
    Users,
    async login(payload: {
      email: string;
      username: string;
      password: string;
    }) {
      const { email, username, password } = payload;
      if (username) usernameSchema.parse(username);
      if (email) emailSchema.parse(email);
      passwordSchema.parse(password);

      if (!(email || username)) {
        return null;
      }

      const filter: any = {};
      if (email) {
        filter.email = email;
      }

      if (username) {
        filter.username = username;
      }

      const user = await Users.findOne(filter);

      if (user) {
        const result = comparePassword(user.password, password);
        log.debug("compare result:", result);
        return result ? user : null;
      }
      log.debug("user not found with username:", username);
      await new Promise((r) => {
        setTimeout(r, 500 + Math.random() * 500);
      });
      return null;
    },
    async register(payload: {
      username?: string;
      password: string;
      email?: string;
    }) {
      const { username, password, email } = payload;
      if (username) usernameSchema.parse(username);
      if (email) emailSchema.parse(email);
      passwordSchema.parse(password);

      if (!(email || username)) {
        throw new Error("either username or email should be passed");
      }

      const filter: any = {};
      if (email) {
        filter.email = email;
      }

      if (username) {
        filter.username = username;
      }

      const exists = await Users.findOne(filter);
      if (exists) throw new Error("account already exists");

      return Users.create({
        emails: [email],
        username,
        password: hashPassword(password),
      });
    },
    async createUser(username: string, password: string, role: string) {
      usernameSchema.parse(username);
      passwordSchema.parse(password);

      const exists = await Users.findOne({ username });
      if (exists) throw new Error("account already exists");
      return Users.create({
        username,
        password: hashPassword(password),
        role: role,
      });
    },
    generateToken(user: { username: string }) {
      usernameSchema.parse(user.username);
      return generateTokenForPayload({ username: user.username });
    },
  };
}
