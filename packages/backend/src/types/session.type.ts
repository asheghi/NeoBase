export type SessionType = SessionPayloadType & {
    token: string;
    email: string;
    ip: string;
    userAgent: string;
}

export type SessionPayloadType = {
    email: string;
}