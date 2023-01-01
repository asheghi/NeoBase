import { config } from '../config'
import { SessionStoreType, SessionStoreWhich } from '../types/session-store-types';
import { MemorySessionStore } from './memory-session-store';

let instance = null;
export async function getSessionStore(): Promise<SessionStoreType> {
    if (!instance) {
        switch (config.session_store) {
            case SessionStoreWhich.memory: {
                instance = MemorySessionStore;
                break;
            }
            case SessionStoreWhich.mongodb: {
                // todo implement
                throw new Error('MongoDB session store is not implemented yet.')
            }
            case SessionStoreWhich.redis: {
                // todo implement
                throw new Error('Redis session store is not implemented yet.')
            }
            default: {
                throw new Error('invalid session store type')
            }
        }
    }
    return instance;
}