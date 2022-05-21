import axios from 'axios';
import {getAccountToken} from "../lib/auth";
const baseUrl = 'http://localhost:7585/api/'

//todo add credentials
export const ax = axios.create({
  baseURL: baseUrl,
});

ax.interceptors.request.use(config => {
  config.headers['x-account-token'] = getAccountToken()
  return config
})
