import { SessionType } from "./session.type";

export enum SessionStoreWhich {
    memory = "memory",
    mongodb = "mongodb",
    redis = "redis"
}

export type SessionStoreType = {
    destorySession: (key:string) => boolean | undefined; 
    getSession: (key: string) => SessionType | undefined;
    setSession: (key: string, session: SessionType) => boolean | undefined;
}