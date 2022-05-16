import axios from 'axios';
const baseUrl = 'http://localhost:7585/api/'

//todo add credentials
export const ax = axios.create({
  baseURL: baseUrl,
});

ax.interceptors.request.use(config => {
  config.headers['x-wf-auth'] = localStorage.getItem('x-wf-auth')
  return config
})
