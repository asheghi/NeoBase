export type SessionType = SessionPayloadType & {
    key: string;
    [key: string]: any;
}

export type SessionPayloadType = {
    email: string;
}