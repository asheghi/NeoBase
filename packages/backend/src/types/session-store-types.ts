import { SessionType } from "./session.type";

export enum SessionStoreWhich {
    memory = "memory",
    mongodb = "mongodb",
    redis = "redis"
}

export type SessionStoreType = {
    destorySessionByToken: (token: string) => boolean | undefined;
    destorySessionByEmail: (email: string) => boolean | undefined;
    getSession: (token: string) => SessionType | undefined;
    setSession: (token: string, session: SessionType) => boolean | undefined;
}