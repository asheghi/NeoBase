import { SessionPayloadType, SessionType } from "../types/session.type";
import { generateTokenForPayload } from "./jwt-utils";
import { getSessionStore } from "./session-store";

export async function generateSession(payload : SessionPayloadType): Promise<string> {
    const store = await getSessionStore();
    const token = generateTokenForPayload(payload);
    const success = await store.setSession(token, {key:token, ...payload});
    if(!success) throw new Error('failed to create session!')
    return token;
}
export async function destroySession(token: string) {
    const store = await getSessionStore();
    store.destorySession(token)
}

export async function getSession(token: string): Promise<SessionType | undefined> {
    const store = await getSessionStore();
    return store.getSession(token);
}