const SESSION_KEY = "cbt_session_token";

export function saveSessionToken(token: string) {
  localStorage.setItem(SESSION_KEY, token);
}

export function getSessionToken() {
  return localStorage.getItem(SESSION_KEY);
}

export function clearSessionToken() {
  localStorage.removeItem(SESSION_KEY);
}
