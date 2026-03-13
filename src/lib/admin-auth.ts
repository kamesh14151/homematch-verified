const ADMIN_SESSION_KEY = "admin_authenticated";

export const ADMIN_PASSWORD = "aj2006";

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function setAdminAuthenticated(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    return;
  }
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
