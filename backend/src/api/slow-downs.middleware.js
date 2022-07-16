import slowDown from "express-slow-down";
import { config } from "../config/index.js";

const realIpHeader = config.real_ip_header;

function keyGeneratorFor(prefix) {
  return (req) => {
    // todo skip for paid projects
    const ids = [];
    if (realIpHeader) {
      ids.push(req.headers[realIpHeader]);
    } else {
      ids.push(req.ip);
    }
    ids.push(String(prefix));
    if (req.params.project) {
      ids.push(req.params.project);
    }
    return ids.join("__");
  };
}
// todo add redis store to share state between different instances
export const SlowDownDocumentsRouter = slowDown({
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 120,
  delayMs: 200,
  headers: true,
  keyGenerator: keyGeneratorFor("documents"),
});

export const CommonSlowDown = slowDown({
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 200,
  delayMs: 500,
  headers: true,
  keyGenerator: keyGeneratorFor("general"),
});
