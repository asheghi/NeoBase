import axios from "axios";
import { getAccountToken } from "../lib/auth";
import { toast } from "./alert";
const baseUrl = import.meta.env.VITE_NB_BASE_URL;

export const ax = axios.create({
  baseURL: baseUrl,
});

ax.interceptors.request.use((config) => {
  config.headers["x-auth-token"] = getAccountToken();
  return config;
});

export function parseAxiosError(e) {
  if (e.response) {
    const { headers, status, data } = e.response;
    let msg;
    if (data && data.msg) {
      msg = data.msg;
    } else {
      msg = status >= 500 ? "server_error" : "bad_request";
    }
    return {
      data,
      status,
      headers,
      msg,
    };
  } else if (e.request) {
    return { req: e.request, msg: "request_failed" };
  } else {
    return { msg: e.message };
  }
}

function onError({ url, status, source, data, msg }) {
  console.log("on-axios-error", url, status, source, data, msg);
  toast(msg, { icon: "error" });
}

ax.interceptors.response.use(
  function (res) {
    return res;
  },
  function (err) {
    onError({
      url: err.config.url,
      ...parseAxiosError(err),
    });
    return Promise.reject(err);
  }
);
