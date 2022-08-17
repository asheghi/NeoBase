import axios from "axios";
import { getAccountToken } from "../lib/auth";
import { toast } from "./alert";
import { getLogger } from "./log";
export const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7585/api/";

console.log("baseUrl is", baseUrl);

const log = getLogger("axios");

//todo add credentials
export const ax = axios.create({
  baseURL: baseUrl,
});

ax.interceptors.request.use((config) => {
  if (!config.skipAccountToken)
    config.headers["x-account-token"] = getAccountToken();
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
  log.debug("on-error", url, status, source, data, msg);
  toast(msg, { icon: "error" });
}

ax.interceptors.response.use(
  function (res) {
    return res;
  },
  function (err) {
    if (!err.config?.skipInterceptors)
      onError({
        url: err.config.url,
        ...parseAxiosError(err),
      });
    return Promise.reject(err);
  }
);
