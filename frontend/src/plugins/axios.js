import axios from 'axios';
const baseUrl = 'http://localhost:7585/api/'

//todo add credentials
export const ax = axios.create({
  baseURL: baseUrl,
});
