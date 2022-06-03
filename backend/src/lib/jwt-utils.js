import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getLogger } from "./debug.js";
import { config } from "../config/index.js";

const log = getLogger("jwt-utils");

export function generateTokenForPayload(payload) {
  return jwt.sign(payload, config.jwtSecret);
}

function verifyToken(token) {
  if (!token) return false;
  let valid;
  try {
    jwt.verify(token, config.jwtSecret);
    valid = true;
  } catch (e) {
    log.info("verify-token failed:", e.message);
    valid = false;
    // nothing
  }
  return valid;
}

// note decode does not validate token
export function decodeToken(token) {
  return jwt.decode(token);
}

export function extractToken(token) {
  const valid = verifyToken(token);
  if (!valid) throw new Error("invalid token");
  return decodeToken(token);
}

export function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(hash, password) {
  return bcrypt.compareSync(password, hash);
}
