import getClient from "@neobase/client";
import { getAccountToken as getToken } from "./auth";
const baseurl = import.meta.env.VITE_NB_BASE_URL;
if (!baseurl)
  throw new Error(
    "neobase base url is required, please make sure VITE_NB_BASE_URL is availabe in your env variables."
  );
const project = import.meta.env.VITE_PROJECT_NAME || "TodoApp";
export const Client = getClient(project, { baseurl, getToken });
export const Todos = Client.Collection("todos");
export const Auth = Client.Auth;
