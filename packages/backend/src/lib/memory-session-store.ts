import { SessionStoreType } from "../types/session-store-types";
import { SessionType } from "../types/session.type";
import getLogger from "./debug";

const Store = new Map<string, SessionType>();
const log = getLogger('MemorySessionStore');
export const MemorySessionStore: SessionStoreType = {
    getSession(key: string) {
        return Store.get(key);
    },
    setSession(key: string, session: SessionType) {
        Store.set(key, session);
        return true;
    },
    destorySession(key: string) {
        Store.delete(key);
        return true;
    }
}