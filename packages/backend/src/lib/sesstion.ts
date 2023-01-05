import { SessionPayloadType, SessionType } from "../types/session.type";
import { generateTokenForPayload, verifyToken } from "./jwt-utils";
import { getSessionStore } from "./session-store";
import type { Request } from "express";
import { UserType } from "../types/user.type";
import { config } from "../config";


export enum AuthProvider {
    Password = 'password'
}

type AuthedRequestType = Request & {
    user: UserType,
}

type GenerateSessionArgType = {
    email: string;
    ip: string;
    userAgent: string;
    authProvider: string;
}

export async function generateSession({ email, ip, userAgent, authProvider }: GenerateSessionArgType): Promise<string> {
    const store = await getSessionStore();

    const jwtPayload = { email };
    const token = generateTokenForPayload(jwtPayload);
    const sessionPayload = { email, ip, userAgent, token, authProvider };

    const success = await store.setSession(token, sessionPayload);
    if (!success) throw new Error('failed to create session!')
    return token;
}

export async function destroySession(token: string) {
    const store = await getSessionStore();
    return store.destorySessionByToken(token)
}

export async function getSession(token: string): Promise<SessionType | undefined> {
    const store = await getSessionStore();
    //check if session is still valid?
    if (isTokenExpired(token)) return null;
    return store.getSession(token);
}

function isTokenExpired(token: string): boolean {
    return !verifyToken(token);
}

// todo move this method
export function getRequestIp(req: Request) {
    const value = req.headers[config.header_ip_field];
    if (!value) return req.socket.remoteAddress;
    if (Array.isArray(value)) return value[0];
    return value && value.split(', ')[0]
}