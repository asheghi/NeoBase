import { createClient } from "@neobase/client";
const baseurl = import.meta.env.VITE_BE_BASE_URL ?? "http://localhost:8080";

export const Client = createClient(baseurl);
export const Todos = Client.Collection("todos");
export const Auth = Client.Auth;
