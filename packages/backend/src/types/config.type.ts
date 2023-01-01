import { SessionConfigType } from "./session-config.type";

export type CofnigType = SessionConfigType & {
    [key: string]: any;
}