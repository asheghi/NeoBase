import { createClient } from "redis";
import { config } from "../config";

const client = createClient({
  url: config.redis_url,
});

export async function initSessionStore() {
  await client.connect();
}
const randMin = 1;
const randMax = 100;
type SessionIdType = string;
type UserType = {
  email: string;
};

export type SessionType = {
  id: SessionIdType;
  user: UserType;
  expireAt: number;
  ip: string;
  user_agent: string;
  level: string;
  destroy: () => void;
};

export async function createSession(req, user: { email: string }, level = "") {
  // random session id
  const id = `s_${Date.now()}_${Math.floor(randMin + Math.random() * randMax)}`;
  const expireAt = Date.now() + 60 * 60 * 1000;
  const { ip } = req;
  const userAgent = req.headers["user-agent"];
  const session = {
    id,
    user,
    expireAt,
    ip,
    userAgent,
    level,
  };

  await client.set(id, JSON.stringify(session), {
    EX: config.session_expire_seconds,
  });
  return session;
}

export async function getSession(id: SessionIdType): Promise<SessionType> {
  const str = await client.get(id);
  if (!str) return null;
  const sessionObject = JSON.parse(str) as SessionType;
  sessionObject.destroy = () => client.del(sessionObject.id);
  return sessionObject;
}
