import { SessionConfigType } from "../types/session-config.type";
import { SessionStoreWhich } from "../types/session-store-types";

const sessionConfig : SessionConfigType =  {
    session_store: SessionStoreWhich.memory,
}

export default sessionConfig;