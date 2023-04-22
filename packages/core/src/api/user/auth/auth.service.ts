import { usernameSchema, passwordSchema } from "./validations/auth.validations";
import {
  comparePassword,
  generateTokenForPayload,
  hashPassword,
} from "../../../lib/jwt-utils";
import { getLogger } from "../../../lib/getLogger";
import { getAuthCollection } from "../../../lib/db-connector";

const log = getLogger("auth.service");

// todo 2 implement dependency injection!
export async function getAuthService() {
  const Users = await getAuthCollection();
  return {
    Users,
    async login(username: string, password: string) {
      usernameSchema.parse(username);
      passwordSchema.parse(password);

      const user = await Users.findOne({ username });
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
    async register(username: string, password: string) {
      usernameSchema.parse(username);
      passwordSchema.parse(password);

      const exists = await Users.findOne({ username });
      if (exists) throw new Error("account already exists");
      return Users.create({
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
