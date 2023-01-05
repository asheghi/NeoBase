import { SessionStoreType } from "../types/session-store-types";
import { SessionType } from "../types/session.type";
import getLogger from "./debug";

const Store = new Map<string, SessionType>();
const EmailTokensMap = new Map<string, string[]>();

const log = getLogger('MemorySessionStore');

export const MemorySessionStore: SessionStoreType = {
    getSession(key: string) {
        return Store.get(key);
    },
    setSession(key: string, session: SessionType) {
        Store.set(key, session);
        const { email } = session;
        if (!EmailTokensMap.get(email)) {
            EmailTokensMap.set(email, []);
        }
        EmailTokensMap.set(email, [email, ...EmailTokensMap.get(email)]);
        return true;
    },
    destorySessionByToken(token: string) {
        return Store.delete(token);
    },
    destorySessionByEmail(email) {
        return !!EmailTokensMap.get(email).map((token) => {
            return this.destorySessionByToken(token)
        }).filter(it => it).length;
    },
}