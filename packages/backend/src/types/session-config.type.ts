import { SessionStoreWhich } from "./session-store-types";

export type SessionConfigType = {
    session_store: SessionStoreWhich;
    header_ip_field: string;
}