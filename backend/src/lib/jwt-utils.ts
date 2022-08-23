import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { config } from "../config/index";
import { getLogger } from "./debug";

const log = getLogger("jwt-utils");

export function generateTokenForPayload(payload: any) {
  return jwt.sign(payload, config.jwtSecret);
}

function verifyToken(token: string) {
  if (!token) return false;
  let valid;
  try {
    jwt.verify(token, config.jwtSecret);
    valid = true;
  } catch (e: any) {
    log.info("verify-token failed:", e.message);
    valid = false;
    // nothing
  }
  return valid;
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
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(hash: string, password: string) {
  return bcrypt.compareSync(password, hash);
}
