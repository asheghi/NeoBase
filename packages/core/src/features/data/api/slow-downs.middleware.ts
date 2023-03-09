import slowDown from "express-slow-down";
import { config } from "../../../lib/config";

const realIpHeader = config.real_ip_header;

function keyGeneratorFor(prefix: string) {
  return (req: any) => {
    const ids: any[] = [];
    if (realIpHeader) {
      ids.push(req.headers[realIpHeader]);
    } else {
      ids.push(req.ip);
    }
    ids.push(String(prefix));
    return ids.join("__");
  };
}

// todo add redis store to share state between different instances
const SlowDownDocumentsRouter = slowDown({
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 120,
  delayMs: 200,
  headers: true,
  keyGenerator: keyGeneratorFor("documents"),
});

const CommonSlowDown = slowDown({
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 200,
  delayMs: 500,
  headers: true,
  keyGenerator: keyGeneratorFor("general"),
});

export default {
  SlowDownDocumentsRouter,
  CommonSlowDown,
};
