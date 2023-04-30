import { createApi } from "@neobase/client/api";

const baseurl = import.meta.env.VITE_BE_BASE_URL ?? "http://localhost:8080";

export const Api = createApi(baseurl);