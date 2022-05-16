import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import {getDebug} from "./debug.js";
import {config} from "../config/index.js";

const log = getDebug('jwt-utils')

export function generateTokenForPayload(payload) {
  return jwt.sign(payload, config.jwtSecret);
}

export function verifyToken(token) {
  if (!token) return false;
  let valid;
  try {
    jwt.verify(token, config.jwtSecret);
    valid = true;
  } catch (e) {
    log.info('verify-token failed:', e.message)
    valid = false;
    // nothing
  }
  return valid;
}

export function verifyRequest(req) {
  const token = req.headers['x-wf-auth'];
  const valid = verifyToken(token);
  if (!valid) throw new Error('invalid token');
  req.user = decodeToken(token);
  return valid;
}

// note decode does not validate token
export function decodeToken(token) {
  return jwt.decode(token);
}

export function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(hash, password) {
  return bcrypt.compareSync(password, hash);
}

