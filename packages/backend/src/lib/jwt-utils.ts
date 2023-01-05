import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index";
import { passwordSchema } from "../validations/auth.validations";
import { getLogger } from "./debug";

const log = getLogger("jwt-utils");

export function generateTokenForPayload(payload: any) {
  return jwt.sign(payload, config.jwtSecret);
}

export function verifyToken(token: string) {
  if (!token) return false;
  let valid;
  try {
    jwt.verify(token, config.jwtSecret);
    return true; 
  } catch (e: any) {
    log.info("verify-token failed:", e.message);
    return false;
  }
}

// note decode does not validate token
export function decodeToken(token: string) {
  return jwt.decode(token);
}

export function extractToken(token: string): any {
  const valid = verifyToken(token);
  if (!valid) throw new Error("invalid token");
  return decodeToken(token);
}

export function hashPassword(password: string) {
  passwordSchema.parse(password);
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(hash: string, password: string) {
  if (!hash) return false;
  if (!passwordSchema.safeParse(password).success) return false;
  return bcrypt.compareSync(password, hash);
}
