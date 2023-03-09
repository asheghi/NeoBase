import { getAuthCollection } from "lib/db-connector";
import { getLogger } from "lib/debug";
import {
  comparePassword,
  generateTokenForPayload,
  hashPassword,
} from "lib/jwt-utils";
import { usernameSchema, passwordSchema } from "./validations/auth.validations";

const log = getLogger("auth.service");

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
    generateToken(user: { username: string }) {
      usernameSchema.parse(user.username);
      return generateTokenForPayload({ username: user.username });
    },
  };
}
