const KEY = "x_account_token";
export function getAccountToken() {
  return localStorage.getItem(KEY);
}
export function setAccountToken(token) {
  localStorage.setItem(KEY, token);
}
export function removeAccountToken() {
  localStorage.removeItem(KEY);
}
