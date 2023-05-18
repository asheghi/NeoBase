import { createApi } from "@neobase/client/api";
const baseurl = import.meta.env.VITE_BE_BASE_URL ?? "http://localhost:8080";

export const Api = createApi(baseurl);
export const Todos = Api.Collection("todos");
export const Auth = Api.Auth;
export const Client = Api;