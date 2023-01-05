import { getAuthCollection } from "../../lib/db/connector";
import { getLogger } from "../../lib/debug";
import {
  comparePassword,
  hashPassword,
} from "../../lib/jwt-utils";
import { AuthProvider, generateSession, getRequestIp } from "../../lib/sesstion";
import { UserType } from "../../types/user.type";
import {
  emailSchema,
  passwordSchema,
} from "../../validations/auth.validations";
import { Request } from 'express'

const log = getLogger("auth.service");

export async function getAuthService(project: string) {
  const Users = await getAuthCollection(project);
  return {
    Users,
    async login(email: string, password: string) {
      emailSchema.parse(email);
      passwordSchema.parse(password);

      const user = await Users.findOne({ email });
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

      const exists = await Users.findOne({ email });
      if (exists) throw new Error("account already exists");
      return Users.create({
        email,
        password: hashPassword(password),
      });
    },
    async generateSession(req: Request & { user : UserType}) {
      const { user } = req;
      const email = emailSchema.parse(user.email);
      const ip = getRequestIp(req);
      const userAgent = req.get('user-agent');
      const token = await generateSession({ email, ip, userAgent, authProvider:AuthProvider.Password });
      return token;
    },
  };
}

export type AuthServiceType = Awaited<ReturnType<typeof getAuthService>>