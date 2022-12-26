const KEY = "x_auth_token";
export function getAccountToken() {
  return localStorage.getItem(KEY);
}
export function setAccountToken(token) {
  localStorage.setItem(KEY, token);
}
export function removeAccountToken() {
  localStorage.removeItem(KEY);
}
