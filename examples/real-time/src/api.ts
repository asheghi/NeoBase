import { createApi } from "@neobase/client/api";

export const Api = createApi('http://localhost:8080');
export const Socket = Api.getSocket();