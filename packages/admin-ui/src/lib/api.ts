import { createApi } from "@neobase/client/api";

const baseUrl = location.protocol + "//" + location.host;

export const Api = createApi(baseUrl);